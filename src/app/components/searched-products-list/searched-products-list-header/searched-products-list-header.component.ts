import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-searched-products-list-header',
  templateUrl: './searched-products-list-header.component.html',
  styleUrls: ['./searched-products-list-header.component.css'],
})
export class SearchedProductsListHeaderComponent {
   @Input() productsNumber!: number ;
   @Input() minAvailablePrice: number = 0;
   @Input() maxAvailablePrice: number = 1000;
   @Output() sortChanged = new EventEmitter<string>();
   @Output() priceFilterChanged = new EventEmitter<number>();
 
   selectedMaxPrice: number = this.maxAvailablePrice;
 
   ngOnChanges() {
     this.selectedMaxPrice = this.maxAvailablePrice;
   }
 
   onSortChange(event: Event): void {
     const selected = (event.target as HTMLSelectElement).value;
     this.sortChanged.emit(selected);
   }
 
   onRangeChange(): void {
     this.priceFilterChanged.emit(this.selectedMaxPrice);
   }
  }
