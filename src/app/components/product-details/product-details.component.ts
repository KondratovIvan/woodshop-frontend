import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { ProductItemState } from '../../ngrx/Product-item-State/productItem.reducers';
import { ProductService } from '../../services/productService/product.service';
import {
  DataStateEnum,
} from '../../ngrx/productsState/products.reducer';
import { EventType } from '../../models/common.model';
import { SecurityService } from '../../security/security.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  // Храним всё состояние
  productItem$ = this.store.pipe(map((state) => state.productItemState));
  // Локальное свойство для ID продукта
  productId?: string;

  reviewText: string = '';
  rating: number = 0;
  reviews: { firstName: string; lastName: string; reviewText: string; rating: number; date: string }[] = [];

  stars = new Array(5);

  constructor(
    private store: Store<any>,
    private productService: ProductService,
    private secService: SecurityService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Подписываемся на состояние продукта
    this.productItem$.subscribe((itemState: ProductItemState) => {
      if (itemState.dataState === DataStateEnum.LOADED && itemState.product) {
        // Сохраняем productId в локальное свойство
        this.productId = itemState.product.productId;
        // Если нужно отправить событие "просмотр продукта"
        if (this.secService.profile.id) {
          this.productService.publishEvent(
            this.productId,
            EventType.CLICK_PRODUCT,
            this.secService.profile.id
          );
        }
        // Загружаем отзывы сразу, как только узнали productId
        this.getReviews();
      }
    });
  }

  setRating(index: number) {
    this.rating = index + 1;
  }

  getStarImage(index: number, rating: number = this.rating): string {
    return index < rating
      ? 'assets/img/yellow-star.svg'
      : 'assets/img/white-star.svg';
  }

  submitReview() {
    // Убедимся, что есть текст, рейтинг и productId
    if (this.reviewText.trim() && this.rating > 0 && this.productId) {
      const reviewData = {
        firstName: this.secService.profile.firstName,
        lastName: this.secService.profile.lastName,
        productId: this.productId,  // <-- используем локальное свойство
        rating: this.rating,
        reviewText: this.reviewText,
        date: new Date().toISOString(),
      };

      this.http
        .post('http://localhost:8082/api/reviews', reviewData)
        .subscribe({
          next: (response) => {
            console.log('Отзыв успешно отправлен:', response);
            // Обновим список отзывов на UI (без повторного запроса)
            if (this.secService.profile.id) {
              this.reviews.push({
                firstName: this.secService.profile.firstName!,
                lastName: this.secService.profile.lastName!,
                reviewText: this.reviewText,
                rating: this.rating,
                date: new Date().toISOString(),
              });
            }
            // Очистим поля формы
            this.reviewText = '';
            this.rating = 0;
          },
          error: (error) => {
            console.error('Ошибка при отправке отзыва:', error);
            alert('Не удалось отправить отзыв. Попробуйте снова.');
          },
        });
    } else {
      alert('Please provide both a rating and a review.');
    }
  }

  getReviews() {
    // Если нет productId, нет смысла делать запрос
    if (!this.productId) return;

    this.http
      .get<{ firstName: string; lastName: string; reviewText: string; rating: number; date: string }[]>(
        `http://localhost:8082/api/reviews?productId=${this.productId}`
      )
      .subscribe({
        next: (data) => {
          this.reviews = data;
        },
        error: (error) => {
          console.error('Ошибка при получении отзывов:', error);
        },
      });
  }
}
