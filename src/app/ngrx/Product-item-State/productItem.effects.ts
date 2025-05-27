// src/app/ngrx/Product-item-State/productItem.effects.ts

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, map, catchError, of, Observable } from 'rxjs';
import { Action } from '@ngrx/store';

import {
  EditProductAction,
  EditProductActionSuccess,
  EditProductActionError,
  ProductItemActionType
} from './productItem.actions';

import { ProductService } from '../../services/productService/product.service';
import type { CreatedProduct } from '../../models/product.model';

@Injectable()
export class ProductItemEffect {

  constructor(
    private actions$: Actions,
    private productService: ProductService
  ) {}

  editProductEffect$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType<EditProductAction>(ProductItemActionType.EDIT_PRODUCT),
      mergeMap(action => {
        const { productId, ...changes } = action.payload as CreatedProduct;

        if (!productId) {
          return of(new EditProductActionError('Product ID is undefined'));
        }

        return this.productService
          .editProduct(productId, changes)
          .pipe(
            map(updated => new EditProductActionSuccess(updated)),
            catchError(err => of(new EditProductActionError(err.message)))
          );
      })
    )
  );

}
