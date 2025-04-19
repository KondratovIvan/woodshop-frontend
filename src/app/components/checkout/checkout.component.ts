import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SecurityService } from '../../security/security.service';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { ShoppingCartState } from '../../ngrx/ShoppingCartState/cart.reducer';
import { ShoppingCartService } from 'src/app/services/shoppingCartService/shopping-cart.service';
// import { state } from '@angular/animations';
import { DataStateEnum } from '../../ngrx/productsState/products.reducer';
import { GetShoppingCartAction } from '../../ngrx/ShoppingCartState/cart.actions';

interface InvoiceResponse {
  pageUrl: string;
  invoiceId: string;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent {
  checkoutForm: FormGroup;

  public readonly cartDataState = DataStateEnum;
  shoppingCart$?: Observable<ShoppingCartState>;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private secService: SecurityService, 
    private store: Store<{ shoppingCartState: ShoppingCartState }>,
    private shoppingCartService: ShoppingCartService,

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
      if (this.secService.profile && this.secService.profile.id) {
        this.store.dispatch(new GetShoppingCartAction(this.secService.profile.id));
        this.shoppingCart$ = this.store.pipe(
          map((state) => state.shoppingCartState)
        );
      } else {
        console.warn('Профиль пользователя еще не загружен');
      }
    }, 500); // Даем 0.5 секунды Keycloak на загрузку данных
  }
  

  payOnline() {
    if (this.checkoutForm.valid) {
      console.log('Delivery Data:', this.checkoutForm.value);
      this.createMonopayInvoice();
      this.checkoutForm.reset();
    }
  }

  payByCash() {
    if (this.checkoutForm.valid) {
      console.log('Delivery Data:', this.checkoutForm.value);
      alert('Order placed successfully! Please pay by cash on delivery.');
      this.placeOrder(false);
      this.checkoutForm.reset();
    }
  }

  createMonopayInvoice() {
    this.shoppingCart$?.subscribe(state => {
      const totalPriceUAH = this.shoppingCartService.calcTotalPrice(state.shoppingCart ?? { items: [], customerId: '0', id: '0' });
      const totalPricePennies = Math.round(totalPriceUAH * 100);
      const body = {
        amount: totalPricePennies,
        ccy: 980,
        merchantPaymInfo: {
          reference: Date.now(),
          destination: 'Your order in the WoodShop',
          comment: 'Your order',
          basketOrder: state.shoppingCart?.items.map(item => {
            const pricePennies = Math.round(item.product.productPrice.price * 100);
            return {
              name: item.product.name,
              qty: item.quantity,
              sum: pricePennies,
              total: pricePennies * item.quantity,
              icon: item.product.productImagesBas64[0],
              unit: 'шт.',
              code: item.product.name
            };
          })
        },
        redirectUrl: 'http://localhost:4200/home',
        validity: 3600,
        paymentType: null
      };
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Token': 'uHuevGSB4NpYxstom5D6gvwwzdNLG_PCJFQzwttCiXR8'
      });
      const backendUrl = 'http://localhost:8081/api/monobank/create-invoice';
      this.http.post<InvoiceResponse>(backendUrl, body, { headers }).subscribe(
        response => {
          console.log('Invoice created successfully:', response);
          window.location.href = response.pageUrl;
        },
        error => {
          console.error('Error creating invoice:', error);
        }
      );
    });
  }

  placeOrder(byCreditCard: boolean): void {
    this.shoppingCart$?.subscribe((cart) => {
        console.log('cart:', cart.shoppingCart);  // 🔍 Посмотрите, что хранится в cart
      const orderData = {
        customerId: this.secService.profile.id,
        items: cart.shoppingCart?.items,
        totalAmount: this.shoppingCartService.calcTotalPrice(cart.shoppingCart?? { items: [], customerId:"0", id:"0" }),
        deliveryData: this.checkoutForm.value,
        payment: {
          amount: this.shoppingCartService.calcTotalPrice(cart.shoppingCart?? { items: [], customerId:"0", id:"0" }),
          currency: 'UAH',
          byCreditCard: byCreditCard,
        },
      };
      console.log('Order data:', orderData);
      this.http
        .post('http://localhost:8081/api/orders', orderData, {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        })
        .subscribe(
          (response) => console.log('Order placed:', response),
          (error) => console.error('Order failed:', error)
        );
    });
  }

  getControlError(controlName: string): string {
    const control = this.checkoutForm.get(controlName);

    if (control?.touched || control?.dirty) {
      const formattedControlName = controlName
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/^([a-z])/, (match) => match.toUpperCase());

      if (control?.hasError('required')) {
        return `${formattedControlName} is required`;
      }
      if (control?.hasError('pattern')) {
        return `${formattedControlName} has an invalid format`;
      }
      if (control?.hasError('min')) {
        return `${formattedControlName} must be greater than 0`;
      }
    }
    return '';
  }
}