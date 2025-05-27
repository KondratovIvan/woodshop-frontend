import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AddItemRequest, ShoppingCart } from '../../models/ShoppingCart';
import { DeleteProductReq } from '../../models/common.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private baseUrl = environment.customerService;

  constructor(private http: HttpClient) {}

  /** GET  /api/customers/{customerId}/shoppingCart */
  getShoppingCartOfCustomer(customerId: string): Observable<ShoppingCart> {
    const url = `${this.baseUrl}/api/customers/${customerId}/shoppingCart`;
    console.log('[CartService] GET', url);
    return this.http.get<ShoppingCart>(url);
  }

  /** POST /api */
  addProductToShoppingCart(addProductReq: AddItemRequest): Observable<ShoppingCart> {
    const url = `${this.baseUrl}/api`;
    return this.http.post<ShoppingCart>(url, addProductReq);
  }

  /** DELETE /api/{customerId}/{productId} */
  deleteItemFromCart(req: DeleteProductReq): Observable<ShoppingCart> {
    const url = `${this.baseUrl}/api/${req.customerId}/${req.productId}`;
    console.log('[CartService] DELETE', url);
    return this.http.delete<ShoppingCart>(url);
  }

  /** PUT /api/{customerId}/{productId}/increase */
  increaseItemQuantity(customerId: string, productId: string): Observable<ShoppingCart> {
    const url = `${this.baseUrl}/api/${customerId}/${productId}/increase`;
    console.log('[CartService] PUT', url);
    return this.http.put<ShoppingCart>(url, {});
  }

  /** PUT /api/{customerId}/{productId}/decrease */
  decreaseItemQuantity(customerId: string, productId: string): Observable<ShoppingCart> {
    const url = `${this.baseUrl}/api/${customerId}/${productId}/decrease`;
    console.log('[CartService] PUT', url);
    return this.http.put<ShoppingCart>(url, {});
  }

  calcTotalPrice(cart: ShoppingCart): number {
    return cart.items.reduce(
      (sum, item) => sum + item.quantity * item.product.productPrice.price,
      0
    );
  }
}
