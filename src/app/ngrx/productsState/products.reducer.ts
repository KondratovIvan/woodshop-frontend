import { Action } from '@ngrx/store';
import { Product } from '../../models/product.model';
import { ProductAction, ProductsActionType } from './product.actions';
import { PageInfo } from '../../models/common.model';

export enum DataStateEnum {
  INITIAL = 'Initial',
  LOADING = 'Loading',
  LOADED  = 'Loaded',
  ERROR   = 'Error',
  EDIT    = 'EDIT',
  EDITED  = 'EDITED',
}

export enum FetchMethode {
  ALL                 = 'ALL',
  PAGE                = 'PAGE',
  SEARCH_BY_KEYWORD   = 'SEARCH_BY_KEYWORD',
  SEARCH_BY_CATEGORY  = 'SEARCH_BY_CATEGORY',
}

export interface ProductState {
  products: Product[];
  errorMessage: string;
  dataState: DataStateEnum;
  pageInfo?: PageInfo;
  fetchMethode?: FetchMethode;
  searchCriteria?: { keyword: string; category: string };
}

const initState: ProductState = {
  products: [],
  errorMessage: '',
  dataState: DataStateEnum.INITIAL,
  searchCriteria: { keyword: '', category: '' },
};

export function productReducer(
  state: ProductState = initState,
  action: Action
): ProductState {
  const act = action as ProductAction;

  switch (act.type) {
    // ——— ВСЕ ТОВАРЫ ————————————————————————————————
    case ProductsActionType.GET_ALL_PRODUCTS:
      return { ...state, dataState: DataStateEnum.LOADING };

    case ProductsActionType.GET_ALL_PRODUCTS_SUCCESS:
      return {
        ...state,
        dataState:   DataStateEnum.LOADED,
        products:    act.payload._embedded.products,
        pageInfo:    act.payload.page,
        fetchMethode: FetchMethode.ALL,
        // при ALL мы сбрасываем критерии
        searchCriteria: { keyword: '', category: '' },
      };

    case ProductsActionType.GET_ALL_PRODUCTS_ERROR:
      return {
        ...state,
        dataState:    DataStateEnum.ERROR,
        errorMessage: act.payload,
      };


    // ——— ПОСТРАНИЧНЫЙ ВЫГРУЗКА ————————————————————
    case ProductsActionType.GET_PRODUCTS_PAGE:
      return { ...state, dataState: DataStateEnum.LOADING };

    case ProductsActionType.GET_PRODUCT_PAGE_SUCCESS:
      return {
        ...state,
        dataState:    DataStateEnum.LOADED,
        products:     act.payload._embedded.products,
        pageInfo:     act.payload.page,
        fetchMethode: FetchMethode.PAGE,
        // при чистой постраничке не меняем searchCriteria
      };

    case ProductsActionType.GET_PRODUCTS_PAGE_ERROR:
      return {
        ...state,
        dataState:    DataStateEnum.ERROR,
        errorMessage: act.payload,
      };


    // ——— ПОИСК ПО КЛЮЧЕВОМУ СЛОВУ —————————————————
    case ProductsActionType.GET_PRODUCTS_PAGE_BY_KEYWORD:
      // сохраняем keyword прямо в стейт
      return {
        ...state,
        dataState:      DataStateEnum.LOADING,
        fetchMethode:   FetchMethode.SEARCH_BY_KEYWORD,
        searchCriteria: {
          keyword: act.payload.data,
          category: state.searchCriteria?.category ?? '',
        },
      };

    case ProductsActionType.GET_PRODUCT_PAGE_BY_KEYWORD_SUCCESS:
      return {
        ...state,
        dataState:    DataStateEnum.LOADED,
        products:     act.payload._embedded.products,
        pageInfo:     act.payload.page,
        // fetchMethode и searchCriteria уже выставлены в предыдущем шаге
      };

    case ProductsActionType.GET_PRODUCTS_PAGE_BY_KEYWORD_ERROR:
      return {
        ...state,
        dataState:    DataStateEnum.ERROR,
        errorMessage: act.payload,
      };


    // ——— ПОИСК ПО КАТЕГОРИИ ——————————————————————
    case ProductsActionType.GET_PRODUCTS_PAGE_BY_CATEGORY:
      return {
        ...state,
        dataState:      DataStateEnum.LOADING,
        fetchMethode:   FetchMethode.SEARCH_BY_CATEGORY,
        searchCriteria: {
          keyword: state.searchCriteria?.keyword ?? '',
          category: act.payload.data,
        },
      };

    case ProductsActionType.GET_PRODUCT_PAGE_BY_CATEGORY_SUCCESS:
      return {
        ...state,
        dataState:    DataStateEnum.LOADED,
        products:     act.payload._embedded.products,
        pageInfo:     act.payload.page,
      };

    case ProductsActionType.GET_PRODUCTS_PAGE_BY_CATEGORY_ERROR:
      return {
        ...state,
        dataState:    DataStateEnum.ERROR,
        errorMessage: act.payload,
      };


    // ——— ЯВНАЯ УСТАНОВКА КРИТЕРИЕВ (если понадобится) ——
    case ProductsActionType.SET_SEARCH_CRITERIA:
      return {
        ...state,
        searchCriteria: act.payload,
      };


    default:
      return state;
  }
}
