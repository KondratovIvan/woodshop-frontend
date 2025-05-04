import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ShoppingCart } from '../../../models/ShoppingCart';
import {
  DeleteProductFromCartAction,
  IncreaseProductQuantityAction,
  DecreaseProductQuantityAction
} from '../../../ngrx/ShoppingCartState/cart.actions';
import { ShoppingCartService } from '../../../services/shoppingCartService/shopping-cart.service';
import { SecurityService } from '../../../security/security.service';
import { Product } from '../../../models/product.model';

@Component({
  selector: 'app-shopping-cart-items',
  templateUrl: './shopping-cart-items.component.html',
  styleUrls: ['./shopping-cart-items.component.css']
})
export class ShoppingCartItemsComponent implements OnInit {
  @Input() shoppingCart?: ShoppingCart;

  constructor(
    private store: Store<any>,
    public shoppingCartService: ShoppingCartService,
    private secService: SecurityService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onDeleteItem(productId: string): void {
    const customerId = this.secService.profile?.id;
    if (!customerId) {
      this.secService.login();
      return;
    }
    this.store.dispatch(
      new DeleteProductFromCartAction({ customerId, productId })
    );
  }

  onIncrease(productId: string): void {
    const customerId = this.secService.profile?.id;
    if (!customerId) {
      this.secService.login();
      return;
    }
    this.store.dispatch(
      new IncreaseProductQuantityAction({ customerId, productId })
    );
  }

  onDecrease(productId: string): void {
    const customerId = this.secService.profile?.id;
    if (!customerId) {
      this.secService.login();
      return;
    }
    this.store.dispatch(
      new DecreaseProductQuantityAction({ customerId, productId })
    );
  }

  goToProduct(product: Product): void {
    this.router.navigate(['/product-details', product.productId]);
  }
}
