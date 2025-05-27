import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Observable, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import {
  DataStateEnum,
  FetchMethode,
  ProductState,
} from '../../ngrx/productsState/products.reducer';
import {
  GetProductsPageAction,
  GetProductsPageByCategoryAction,
  GetProductsPageByKeyWordAction,
} from 'src/app/ngrx/productsState/product.actions';
import { ProductService } from '../../services/productService/product.service';
import { SecurityService } from '../../security/security.service';
import { EventType } from '../../models/common.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-searched-products-list',
  templateUrl: './searched-products-list.component.html',
  styleUrls: ['./searched-products-list.component.css'],
})
export class SearchedProductsListComponent implements OnInit {
  productState$?: Observable<ProductState>;
  public readonly ProductStateEnum = DataStateEnum;
  public readonly fetchMethode = FetchMethode;

  productReviewsCount: { [id: string]: number } = {};
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  sortedProducts: Product[] = [];

  minAvailablePrice = 0;
  maxAvailablePrice = 0;
  selectedMaxPrice = 0;

  selectedSortType = 'date-newest';

  currentPage = 0;
  pageSize = 8;

  currentKeyword = '';
  currentCategory = 'ALL';

  constructor(
    private store: Store<any>,
    private productService: ProductService,
    private secSecurity: SecurityService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.productState$ = this.store.pipe(map((s) => s.productState));

    this.store.select('searchState').subscribe(({ keyword, category }) => {
      this.currentKeyword = keyword;
      this.currentCategory = category;
      const pageSize = { page: 0, size: 9999 };

      if (keyword) {
        this.store.dispatch(
          new GetProductsPageByKeyWordAction({ pageSize, data: keyword })
        );
      } else if (category && category !== 'ALL') {
        this.store.dispatch(
          new GetProductsPageByCategoryAction({ pageSize, data: category })
        );
      } else {
        this.store.dispatch(new GetProductsPageAction(pageSize));
      }
    });

    this.productState$.subscribe((s) => {
      if (s.dataState === DataStateEnum.LOADED) {
        this.allProducts = s.products;

        const prices = this.allProducts.map((p) => p.productPrice.price);
        this.minAvailablePrice = Math.min(...prices);
        this.maxAvailablePrice = Math.max(...prices);
        this.selectedMaxPrice = this.maxAvailablePrice;

        this.loadReviews(this.allProducts.map((p) => p.productId));

        this.currentPage = 0;
        this.applyFilterAndSort();

        const first = s.products[0];
        if (first && this.secSecurity.profile?.id) {
          const evt =
            s.fetchMethode === FetchMethode.SEARCH_BY_CATEGORY
              ? EventType.SEARCH_BY_CATEGORY
              : EventType.SEARCH_BY_KEYWORD;

          this.productService.publishEvent(
            first.productId,
            evt,
            this.secSecurity.profile.id
          );
        }
      }
    });
  }

  onPriceFilterChanged(maxPrice: number): void {
    this.selectedMaxPrice = maxPrice;
    this.applyFilterAndSort();
  }

  onSortChanged(sortType: string): void {
    this.selectedSortType = sortType;
    this.applyFilterAndSort();
  }

  onPageHandle(page: number): void {
    this.currentPage = page;
    this.applyFilterAndSort();
  }

  nextPage(): void {
    const total = Math.ceil(this.filteredProducts.length / this.pageSize);
    if (this.currentPage < total - 1) {
      this.currentPage++;
      this.applyFilterAndSort();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.applyFilterAndSort();
    }
  }

  private applyFilterAndSort(): void {
    this.filteredProducts = this.allProducts.filter(
      (p) => p.productPrice.price <= this.selectedMaxPrice
    );

    let sorted = [...this.filteredProducts];
    switch (this.selectedSortType) {
      case 'date-newest':
        sorted.sort(
          (a, b) =>
            new Date(b.addingDate).getTime() -
            new Date(a.addingDate).getTime()
        );
        break;
      case 'date-oldest':
        sorted.sort(
          (a, b) =>
            new Date(a.addingDate).getTime() -
            new Date(b.addingDate).getTime()
        );
        break;
      case 'price-asc':
        sorted.sort((a, b) => a.productPrice.price - b.productPrice.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.productPrice.price - a.productPrice.price);
        break;
      case 'popular':
        sorted.sort(
          (a, b) =>
            (this.productReviewsCount[b.productId] || 0) -
            (this.productReviewsCount[a.productId] || 0)
        );
        break;
    }

    const start = this.currentPage * this.pageSize;
    this.sortedProducts = sorted.slice(start, start + this.pageSize);
  }

  private loadReviews(ids: string[]): void {
    forkJoin(
      ids.map((id) =>
        this.http.get<any[]>(
          `http://localhost:8082/api/reviews?productId=${id}`
        )
      )
    ).subscribe({
      next: (lists) =>
        lists.forEach((list, i) => {
          this.productReviewsCount[ids[i]] = list.length;
        }),
      error: (err) => console.error('Error on reviews fetching:', err),
    });
  }
}
