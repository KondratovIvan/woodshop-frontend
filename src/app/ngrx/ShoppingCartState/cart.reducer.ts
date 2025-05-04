import { Action } from '@ngrx/store';
import { ShoppingCart } from '../../models/ShoppingCart';
import { DataStateEnum } from '../productsState/products.reducer';
import {
  CartAction,
  CartActionType
} from './cart.actions';

export interface ShoppingCartState {
  shoppingCart?: ShoppingCart;
  dataState: DataStateEnum;
  errorMessage: string;
}

const initialState: ShoppingCartState = {
  dataState: DataStateEnum.INITIAL,
  errorMessage: ''
};

export function ShoppingCartReducer(
  state: ShoppingCartState = initialState,
  action: Action                          // ← принимаем базовый Action
): ShoppingCartState {
  // приведение к нашему узкому типу
  const cartAction = action as CartAction;

  switch (cartAction.type) {
    // все запросы переводим в loading
    case CartActionType.GET_CART:
    case CartActionType.ADD_PRODUCT_TO_CART:
    case CartActionType.DELETE_PRODUCT_FROM_CART:
    case CartActionType.INCREASE_PRODUCT_QUANTITY:
    case CartActionType.DECREASE_PRODUCT_QUANTITY:
      return { ...state, dataState: DataStateEnum.LOADING };

    // успешные ответы кладём payload в стор
    case CartActionType.GET_CART_SUCCESS:
    case CartActionType.ADD_PRODUCT_TO_CART_SUCCESS:
    case CartActionType.DELETE_PRODUCT_FROM_CART_SUCCESS:
    case CartActionType.INCREASE_PRODUCT_QUANTITY_SUCCESS:
    case CartActionType.DECREASE_PRODUCT_QUANTITY_SUCCESS:
      return {
        ...state,
        dataState: DataStateEnum.LOADED,
        shoppingCart: cartAction.payload
      };

    // ошибки
    case CartActionType.GET_CART_ERROR:
    case CartActionType.ADD_PRODUCT_TO_CART_ERROR:
    case CartActionType.DELETE_PRODUCT_FROM_CART_ERROR:
      return {
        ...state,
        dataState: DataStateEnum.ERROR,
        errorMessage: cartAction.payload as string
      };

    default:
      return state;
  }
}
