import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../../models/product.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { AddProductToCartAction } from '../../../ngrx/ShoppingCartState/cart.actions';
import { GetProductItemAction } from '../../../ngrx/Product-item-State/productItem.actions';
import { SecurityService } from '../../../security/security.service';

@Component({
  selector: 'app-product-item-description',
  templateUrl: './product-item-description.component.html',
  styleUrls: ['./product-item-description.component.css'],
})
export class ProductItemDescriptionComponent implements OnInit {
  @Input() product: Product | null = null;
  addProductForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store<any>,
    private router: Router,
    public secService: SecurityService
  ) {
    this.addProductForm = this.fb.group({
      quantity: [1, [Validators.required, Validators.min(1)]],
      color: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.product?.colors?.length) {
      // по умолчанию первый цвет
      this.addProductForm.patchValue({ color: this.product.colors[0] });
    }
  }

  onAddProductToCart(): void {
    if (this.addProductForm.invalid) {
      return;
    }

    const quantity = Math.max(1, this.addProductForm.value.quantity);
    const pickedColor = this.addProductForm.value.color;

    if (!this.secService.profile) {
      this.secService.login();
      return;
    }

    this.store.dispatch(
      new AddProductToCartAction({
        productId: this.product!.productId,
        quantity,
        customerId: this.secService.profile?.id || '',
        pickedColor,
      })
    );
  }

  onEditProduct(): void {
    if (!this.product) return;
    this.store.dispatch(new GetProductItemAction(this.product));
    // ← именно так:
    this.router.navigate(['/edit-product', this.product.productId]);
  }
}
