import { Action } from "@ngrx/store";
import { AddItemRequest } from "../../models/ShoppingCart";
import { DeleteProductReq } from "../../models/common.model";
import { ShoppingCart } from "../../models/ShoppingCart";

export enum CartActionType {
  GET_CART                  = "*ShoppingCart* GET Shopping Cart",
  GET_CART_SUCCESS          = "*ShoppingCart* GET Shopping Cart [SUCCESS]",
  GET_CART_ERROR            = "*ShoppingCart* GET Shopping Cart [ERROR]",

  ADD_PRODUCT_TO_CART       = "*ShoppingCart* ADD PRODUCT TO Shopping Cart",
  ADD_PRODUCT_TO_CART_SUCCESS = "*ShoppingCart* ADD PRODUCT TO Shopping Cart [SUCCESS]",
  ADD_PRODUCT_TO_CART_ERROR   = "*ShoppingCart* ADD PRODUCT TO Shopping Cart [ERROR]",

  DELETE_PRODUCT_FROM_CART    = "*ShoppingCart* DELETE PRODUCT FROM Shopping Cart",
  DELETE_PRODUCT_FROM_CART_SUCCESS = "*ShoppingCart* DELETE PRODUCT FROM Shopping Cart [SUCCESS]",
  DELETE_PRODUCT_FROM_CART_ERROR   = "*ShoppingCart* DELETE PRODUCT FROM Shopping Cart [ERROR]",

  INCREASE_PRODUCT_QUANTITY    = "*ShoppingCart* INCREASE PRODUCT QUANTITY",
  INCREASE_PRODUCT_QUANTITY_SUCCESS = "*ShoppingCart* INCREASE PRODUCT QUANTITY [SUCCESS]",

  DECREASE_PRODUCT_QUANTITY    = "*ShoppingCart* DECREASE PRODUCT QUANTITY",
  DECREASE_PRODUCT_QUANTITY_SUCCESS = "*ShoppingCart* DECREASE PRODUCT QUANTITY [SUCCESS]",
}

// GET
export class GetShoppingCartAction implements Action {
  readonly type = CartActionType.GET_CART;
  constructor(public payload: string) {}
}
export class GetShoppingCartActionSuccess implements Action {
  readonly type = CartActionType.GET_CART_SUCCESS;
  constructor(public payload: ShoppingCart) {}
}
export class GetShoppingCartActionError implements Action {
  readonly type = CartActionType.GET_CART_ERROR;
  constructor(public payload: string) {}
}

// ADD
export class AddProductToCartAction implements Action {
  readonly type = CartActionType.ADD_PRODUCT_TO_CART;
  constructor(public payload: AddItemRequest) {}
}
export class AddProductToCartActionSuccess implements Action {
  readonly type = CartActionType.ADD_PRODUCT_TO_CART_SUCCESS;
  constructor(public payload: ShoppingCart) {}
}
export class AddProductToCartActionError implements Action {
  readonly type = CartActionType.ADD_PRODUCT_TO_CART_ERROR;
  constructor(public payload: string) {}
}

// DELETE
export class DeleteProductFromCartAction implements Action {
  readonly type = CartActionType.DELETE_PRODUCT_FROM_CART;
  constructor(public payload: DeleteProductReq) {}
}
export class DeleteProductFromCartActionSuccess implements Action {
  readonly type = CartActionType.DELETE_PRODUCT_FROM_CART_SUCCESS;
  constructor(public payload: ShoppingCart) {}
}
export class DeleteProductFromCartActionError implements Action {
  readonly type = CartActionType.DELETE_PRODUCT_FROM_CART_ERROR;
  constructor(public payload: string) {}
}

// INCREASE
export class IncreaseProductQuantityAction implements Action {
  readonly type = CartActionType.INCREASE_PRODUCT_QUANTITY;
  constructor(public payload: { customerId: string; productId: string }) {}
}
export class IncreaseProductQuantityActionSuccess implements Action {
  readonly type = CartActionType.INCREASE_PRODUCT_QUANTITY_SUCCESS;
  constructor(public payload: ShoppingCart) {}
}

// DECREASE
export class DecreaseProductQuantityAction implements Action {
  readonly type = CartActionType.DECREASE_PRODUCT_QUANTITY;
  constructor(public payload: { customerId: string; productId: string }) {}
}
export class DecreaseProductQuantityActionSuccess implements Action {
  readonly type = CartActionType.DECREASE_PRODUCT_QUANTITY_SUCCESS;
  constructor(public payload: ShoppingCart) {}
}

export type CartAction =
  | GetShoppingCartAction
  | GetShoppingCartActionSuccess
  | GetShoppingCartActionError
  | AddProductToCartAction
  | AddProductToCartActionSuccess
  | AddProductToCartActionError
  | DeleteProductFromCartAction
  | DeleteProductFromCartActionSuccess
  | DeleteProductFromCartActionError
  | IncreaseProductQuantityAction
  | IncreaseProductQuantityActionSuccess
  | DecreaseProductQuantityAction
  | DecreaseProductQuantityActionSuccess;
