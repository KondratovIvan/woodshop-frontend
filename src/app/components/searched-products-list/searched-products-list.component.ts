import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, takeUntil } from 'rxjs/operators';
import { map, Observable, forkJoin, Subject } from 'rxjs';
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
  SetSearchCriteria
} from '../../ngrx/productsState/product.actions';
import { ProductService } from '../../services/productService/product.service';
import { SecurityService } from '../../security/security.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-searched-products-list',
  templateUrl: './searched-products-list.component.html',
  styleUrls: ['./searched-products-list.component.css'],
})
export class SearchedProductsListComponent implements OnInit, OnDestroy {
  productState$: Observable<ProductState>;
  readonly ProductStateEnum = DataStateEnum;
  readonly fetchMethode = FetchMethode;

  productReviewsCount: Record<string, number> = {};
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
  currentCategory = '';

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store<any>,
    private productService: ProductService,
    private secSecurity: SecurityService,
    private http: HttpClient
  ) {
    this.productState$ = this.store.select('productState');
  }

  ngOnInit(): void {
    this.store
      .select('searchState')
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ keyword, category }) => {
        this.currentKeyword = keyword;
        this.currentCategory = category;
        const pageSize = { page: 0, size: 9999 };

        if (keyword) {
          this.store.dispatch(new GetProductsPageByKeyWordAction({ pageSize, data: keyword }));
        } else if (category && category !== 'ALL') {
          this.store.dispatch(new GetProductsPageByCategoryAction({ pageSize, data: category }));
        } else {
          this.store.dispatch(new GetProductsPageAction(pageSize));
        }
      });

    this.productState$
      .pipe(
        filter(s => s.dataState === DataStateEnum.LOADED),
        takeUntil(this.destroy$)
      )
      .subscribe(s => {
        this.allProducts = s.products;

        const prices = this.allProducts.map(p => p.productPrice.price);
        this.minAvailablePrice = Math.min(...prices);
        this.maxAvailablePrice = Math.max(...prices);
        this.selectedMaxPrice = this.maxAvailablePrice;
        this.currentPage = 0;
        this.loadReviews(this.allProducts.map(p => p.productId));
        this.applyFilterAndSort();

        const userId = this.secSecurity.profile?.id;
        if (userId) {
          if (s.fetchMethode === FetchMethode.SEARCH_BY_CATEGORY && s.searchCriteria?.category) {
            this.productService.recordCategoryView(s.searchCriteria.category, userId);
          } else if (s.fetchMethode === FetchMethode.SEARCH_BY_KEYWORD && s.searchCriteria?.keyword) {
            this.productService.recordKeywordSearch(s.searchCriteria.keyword, userId);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
      p => p.productPrice.price <= this.selectedMaxPrice
    );

    let sorted = [...this.filteredProducts];
    switch (this.selectedSortType) {
      case 'date-newest':
        sorted.sort((a, b) => new Date(b.addingDate).getTime() - new Date(a.addingDate).getTime());
        break;
      case 'date-oldest':
        sorted.sort((a, b) => new Date(a.addingDate).getTime() - new Date(b.addingDate).getTime());
        break;
      case 'price-asc':
        sorted.sort((a, b) => a.productPrice.price - b.productPrice.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.productPrice.price - a.productPrice.price);
        break;
      case 'popular':
        sorted.sort((a, b) =>
          (this.productReviewsCount[b.productId] || 0) - (this.productReviewsCount[a.productId] || 0)
        );
        break;
    }

    const start = this.currentPage * this.pageSize;
    this.sortedProducts = sorted.slice(start, start + this.pageSize);
  }

  private loadReviews(ids: string[]): void {
    forkJoin(ids.map(id =>
      this.http.get<any[]>(`http://localhost:8082/api/reviews?productId=${id}`)
    )).subscribe({
      next: lists => lists.forEach((list, i) => this.productReviewsCount[ids[i]] = list.length),
      error: err => console.error('Error loading reviews', err)
    });
  }
}
