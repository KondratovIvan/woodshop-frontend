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
  shoppingCart$!: Observable<ShoppingCartState>;
  readonly cartDataState = DataStateEnum;

  constructor(
    private store: Store<{ shoppingCartState: ShoppingCartState }>,
    private secService: SecurityService
  ) {}

  ngOnInit(): void {
    const customerId = this.secService.profile?.id;
    if (!customerId) {
       this.secService.login();
    }

    if (customerId) {
      this.store.dispatch(new GetShoppingCartAction(customerId));
    }

    this.shoppingCart$ = this.store.pipe(
      select('shoppingCartState')
    );
  }
}
