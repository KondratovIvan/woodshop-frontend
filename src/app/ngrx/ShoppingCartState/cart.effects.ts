import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { mergeMap, map, catchError, of } from "rxjs";
import {
  CartActionType,
  GetShoppingCartAction,
  GetShoppingCartActionSuccess,
  GetShoppingCartActionError,
  AddProductToCartAction,
  AddProductToCartActionSuccess,
  AddProductToCartActionError,
  DeleteProductFromCartAction,
  DeleteProductFromCartActionSuccess,
  DeleteProductFromCartActionError,
  IncreaseProductQuantityAction,
  IncreaseProductQuantityActionSuccess,
  DecreaseProductQuantityAction,
  DecreaseProductQuantityActionSuccess
} from "./cart.actions";
import { ShoppingCartService } from "../../services/shoppingCartService/shopping-cart.service";

@Injectable()
export class ShoppingCartEffect {
  constructor(
    private actions$: Actions,
    private shCartService: ShoppingCartService
  ) {}

  getCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActionType.GET_CART),
      mergeMap((action: GetShoppingCartAction) =>
        this.shCartService.getShoppingCartOfCustomer(action.payload).pipe(
          map(data => new GetShoppingCartActionSuccess(data)),
          catchError(err => of(new GetShoppingCartActionError(err.message)))
        )
      )
    )
  );

  addProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActionType.ADD_PRODUCT_TO_CART),
      mergeMap((action: AddProductToCartAction) =>
        this.shCartService.addProductToShoppingCart(action.payload).pipe(
          map(data => new AddProductToCartActionSuccess(data)),
          catchError(err => of(new AddProductToCartActionError(err.message)))
        )
      )
    )
  );

  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActionType.DELETE_PRODUCT_FROM_CART),
      mergeMap((action: DeleteProductFromCartAction) =>
        this.shCartService.deleteItemFromCart(action.payload).pipe(
          map(data => new DeleteProductFromCartActionSuccess(data)),
          catchError(err => of(new DeleteProductFromCartActionError(err.message)))
        )
      )
    )
  );

  increaseQty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActionType.INCREASE_PRODUCT_QUANTITY),
      mergeMap((action: IncreaseProductQuantityAction) =>
        this.shCartService
          .increaseItemQuantity(
            action.payload.customerId,
            action.payload.productId
          )
          .pipe(
            map(cart => new IncreaseProductQuantityActionSuccess(cart)),
            catchError(() => of())
          )
      )
    )
  );

  decreaseQty$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActionType.DECREASE_PRODUCT_QUANTITY),
      mergeMap((action: DecreaseProductQuantityAction) =>
        this.shCartService
          .decreaseItemQuantity(
            action.payload.customerId,
            action.payload.productId
          )
          .pipe(
            map(cart => new DecreaseProductQuantityActionSuccess(cart)),
            catchError(() => of())
          )
      )
    )
  );
}
