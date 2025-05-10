import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { SecurityService } from '../../security/security.service';
import { ShoppingCartService } from 'src/app/services/shoppingCartService/shopping-cart.service';
import { GetShoppingCartAction } from '../../ngrx/ShoppingCartState/cart.actions';
import { ShoppingCartState } from '../../ngrx/ShoppingCartState/cart.reducer';
import { DataStateEnum } from '../../ngrx/productsState/products.reducer';

interface InvoiceResponse {
  pageUrl: string;
  invoiceId: string;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  public readonly cartDataState = DataStateEnum;
  shoppingCart$?: Observable<ShoppingCartState>;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private secService: SecurityService,
    private store: Store<{ shoppingCartState: ShoppingCartState }>,
    private shoppingCartService: ShoppingCartService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      name: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-zА-Яа-яёЁ]+$/)],
      ],
      surname: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-zА-Яа-яёЁ]+$/)],
      ],
      city: [
        '',
        [Validators.required, Validators.pattern(/^[A-Za-zА-Яа-яёЁ]+$/)],
      ],
      telephoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^\d{10}$/)],
      ],
      postOfficeNumber: [
        '',
        [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)],
      ],
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      const customerId = this.secService.profile?.id;
      if (customerId) {
        this.store.dispatch(new GetShoppingCartAction(customerId));
        this.shoppingCart$ = this.store.pipe(
          map((state) => state.shoppingCartState)
        );
      } else {
        console.warn('User profile not loaded yet');
      }
    }, 500);
  }

  payOnline(): void {
    if (this.checkoutForm.invalid) {
      return;
    }
    this.createMonopayInvoice();
  }

  payByCash(): void {
    if (this.checkoutForm.invalid) {
      return;
    }
    alert('Order placed successfully! Please pay by cash on delivery.');
    this.placeOrder(false);
    this.clearCartAndReload();
    this.checkoutForm.reset();
  }

  private createMonopayInvoice(): void {
    this.shoppingCart$!
      .pipe(take(1))
      .subscribe((state) => {
        const customerId = this.secService.profile!.id;
        const totalUAH = this.shoppingCartService.calcTotalPrice(
          state.shoppingCart ?? { items: [], customerId: '0', id: '0' }
        );
        const totalPennies = Math.round(totalUAH * 100);
        const body = {
          amount: totalPennies,
          ccy: 980,
          merchantPaymInfo: {
            reference: Date.now(),
            destination: 'Your order in the WoodShop',
            comment: 'Your order',
            basketOrder: state.shoppingCart?.items.map((item) => {
              const pricePennies = Math.round(
                item.product.productPrice.price * 100
              );
              return {
                name: item.product.name,
                qty: item.quantity,
                sum: pricePennies,
                total: pricePennies * item.quantity,
                icon: item.product.productImagesBas64[0],
                unit: 'шт.',
                code: item.product.name,
              };
            }),
          },
          redirectUrl: 'http://localhost:4200/home',
          validity: 3600,
          paymentType: null,
        };

        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'X-Token': 'uHuevGSB4NpYxstom5D6gvwwzdNLG_PCJFQzwttCiXR8',
        });

        this.http
          .post<InvoiceResponse>(
            'http://localhost:8081/api/monobank/create-invoice',
            body,
            { headers }
          )
          .subscribe(
            (resp) => {
              this.placeOrder(true);
              this.clearCartAndReload();
              setTimeout(() => {
                window.location.href = resp.pageUrl;
              }, 500);
            },
            (err) => console.error('Error creating invoice:', err)
          );
      });
  }

  private placeOrder(byCreditCard: boolean): void {
    this.shoppingCart$!
      .pipe(take(1))
      .subscribe((state) => {
        const customerId = this.secService.profile!.id;
        const cart = state.shoppingCart!;
        const orderData = {
          customerId,
          items: cart.items,
          totalAmount: this.shoppingCartService.calcTotalPrice(cart),
          deliveryData: this.checkoutForm.value,
          payment: {
            amount: this.shoppingCartService.calcTotalPrice(cart),
            currency: 'UAH',
            byCreditCard,
          },
        };
        this.http
          .post('http://localhost:8081/api/orders', orderData, {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
          })
          .subscribe(
            () => console.log('Order placed'),
            (err) => console.error('Order failed:', err)
          );
      });
  }

  private clearCartAndReload(): void {
    const customerId = this.secService.profile!.id;
    this.http
      .delete(`http://localhost:8081/api/customers/${customerId}/shoppingCart`)
      .subscribe({
        next: () => {
          if (customerId) {
            this.store.dispatch(new GetShoppingCartAction(customerId));
          } else {
            console.error('Customer ID is undefined');
          }
        },
        error: (err) =>
          console.error('Failed to clear shopping cart:', err),
      });
  }

  getControlError(controlName: string): string {
    const control = this.checkoutForm.get(controlName);
    if (control?.touched || control?.dirty) {
      const label = controlName
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/^./, (m) => m.toUpperCase());
      if (control.hasError('required')) return `${label} is required`;
      if (control.hasError('pattern')) return `${label} has invalid format`;
      if (control.hasError('min')) return `${label} must be greater than 0`;
    }
    return '';
  }
}
