// src/app/shopping-cart/shopping-cart.component.ts

import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { GetShoppingCartAction } from '../../ngrx/ShoppingCartState/cart.actions';
import { ShoppingCartState } from '../../ngrx/ShoppingCartState/cart.reducer';
import { DataStateEnum } from '../../ngrx/productsState/products.reducer';
import { SecurityService } from '../../security/security.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  // поток со всем состоянием корзины (LOADING / LOADED / ERROR + данные)
  shoppingCart$!: Observable<ShoppingCartState>;
  // чтобы шаблон понимал, что такое .LOADING/.LOADED/.ERROR
  readonly cartDataState = DataStateEnum;

  constructor(
    private store: Store<{ shoppingCartState: ShoppingCartState }>,
    private secService: SecurityService
  ) {}

  ngOnInit(): void {
    // 1) Получаем ID пользователя
    const customerId = this.secService.profile?.id;
    if (!customerId) {
      // если не залогинен, сразу кидаем на login
       this.secService.login();
    }

    // 2) Диспатчим экшен на загрузку корзины
    if (customerId) {
      this.store.dispatch(new GetShoppingCartAction(customerId));
    }

    // 3) Подписываемся на кусок сторa с корзиной
    this.shoppingCart$ = this.store.pipe(
      select('shoppingCartState')
    );
  }
}
