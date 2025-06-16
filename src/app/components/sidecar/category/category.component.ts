import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';

import { ProductsCategory } from '../../../models/product.model';
import {
  GetProductsPageByCategoryAction,
  SetSearchCriteria
} from '../../../ngrx/productsState/product.actions';
import { ShoppingCartState } from '../../../ngrx/ShoppingCartState/cart.reducer';
import { GetShoppingCartAction } from '../../../ngrx/ShoppingCartState/cart.actions';
import { DataStateEnum } from '../../../ngrx/productsState/products.reducer';
import { ShoppingCartService } from '../../../services/shoppingCartService/shopping-cart.service';
import { SecurityService } from '../../../security/security.service';
import { ProductService } from '../../../services/productService/product.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  categories: string[] = Object.values(ProductsCategory).map(c => c.category);
  shoppingCart$?: Observable<ShoppingCartState>;
  readonly CartDataState = DataStateEnum;

  constructor(
    private store: Store<any>,
    private router: Router,
    public shoppingCartService: ShoppingCartService,
    private securityService: SecurityService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const userId = this.securityService.profile?.id;
    if (userId) {
      this.store.dispatch(new GetShoppingCartAction(userId));
      this.shoppingCart$ = this.store.pipe(map(s => s.shoppingCartState));
    }
  }

  onSearchByCategory(cat: string) {
    const userId = this.securityService.profile?.id;
    this.store.dispatch(new SetSearchCriteria({ keyword: '', category: cat }));

    this.store.dispatch(
      new GetProductsPageByCategoryAction({
        pageSize: { page: 0, size: 6 },
        data: cat
      })
    );

    if (userId) {
      this.productService.recordCategoryView(cat, userId);
    }

    this.router.navigateByUrl('/searched-products');
  }

  goToShCart() {
    this.router.navigateByUrl('/cart');
  }
}
