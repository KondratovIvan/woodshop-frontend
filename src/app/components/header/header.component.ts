import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsCategory } from '../../models/product.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  GetProductsPageAction,
  GetProductsPageByCategoryAction,
  GetProductsPageByKeyWordAction,
} from '../../ngrx/productsState/product.actions';
import { map, Observable } from 'rxjs';
import { ShoppingCartState } from '../../ngrx/ShoppingCartState/cart.reducer';
import { GetShoppingCartAction } from '../../ngrx/ShoppingCartState/cart.actions';
import { DataStateEnum } from '../../ngrx/productsState/products.reducer';
import { environment } from '../../../environments/environment';
import { SecurityService } from '../../security/security.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  categories: string[] = Object.values(ProductsCategory).map((color) =>
    String(color)
  );
  searchFormGroup?: FormGroup;
  shoppingCart$?: Observable<ShoppingCartState>;
  public readonly CartDataState = DataStateEnum;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<any>,
    public securityService: SecurityService
  ) {}

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword: ['']
    });
    this.shoppingCart$ = this.store.pipe(
      map((state) => state.shoppingCartState)
    );

  }

  onHome() {
    this.router.navigateByUrl('home');
  }

  onContact() {
    this.router.navigateByUrl('contact');
  }

  onSearchProduct() {
    const keyword = this.searchFormGroup?.value.keyword?.trim();
    if (keyword) {
      this.store.dispatch(
        new GetProductsPageByKeyWordAction({
          pageSize: { page: 0, size: 6 },
          data: keyword
        })
      );
    } else {
      this.store.dispatch(new GetProductsPageAction({ page: 0, size: 6 }));
    }
    this.router.navigateByUrl('/searched-products');
  }

  onShCart() {
    this.router.navigateByUrl('/cart');
  }

  onAdmin() {
    this.router.navigateByUrl('/addProduct');
  }

  loging() {}
}
