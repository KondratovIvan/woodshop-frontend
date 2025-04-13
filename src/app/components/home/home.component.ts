import {Component, OnInit} from '@angular/core';
import { ProductsCategory } from '../../models/product.model';
import {Store} from "@ngrx/store";
import { GetProductsPageAction, GetProductsPageByCategoryAction} from "../../ngrx/productsState/product.actions";
import {map, Observable} from "rxjs";
import {ProductState, DataStateEnum} from "../../ngrx/productsState/products.reducer";
import {SelectedProductsState} from "../../ngrx/Selected-Products-State/SelectedProduct.reducer";
import {GetSelectedProductAction} from "../../ngrx/Selected-Products-State/SelectedProduct.action";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  productState$? : Observable<ProductState> ;
  selectedProductsState$?: Observable<SelectedProductsState> ;
  public readonly ProductStateEnum = DataStateEnum ;
  constructor(private store:Store<any>, private router: Router) {
  }
  ngOnInit(): void {
    this.productState$ = this.store.pipe(
      map(state => state.productState)
    )
    this.selectedProductsState$ = this.store.pipe(
      map(state => state.selectedProductsState)
    )

    this.store.dispatch(new GetProductsPageAction({page: 0 , size:6}))
    this.store.dispatch(new GetSelectedProductAction({page: 0 , size:4}))
  }

isModalOpen = false;
 birthDate: string = '';
 treeHoroscope: {
   name: string;
   category: string;
   description: string;
   image: string;
 } | null = null;
 
 trees = [
   ProductsCategory.APPLE,
   ProductsCategory.FIR,
   ProductsCategory.ELM,
   ProductsCategory.CYPRESS,
   ProductsCategory.POPLAR,
   ProductsCategory.CEDAR,
   ProductsCategory.PINE,
   ProductsCategory.WILLOW,
   ProductsCategory.LINDEN,
   ProductsCategory.HAZEL,
   ProductsCategory.ROWAN,
   ProductsCategory.MAPLE,
   ProductsCategory.WALNUT,
   ProductsCategory.JASMINE,
 ];
 
 openModal() {
   this.isModalOpen = true;
   this.treeHoroscope = null;
   this.birthDate = '';
 }
 
 closeModal() {
   this.isModalOpen = false;
 }
 
 calculateTreeHoroscope() {
   if (!this.birthDate) return;
 
   const date = new Date(this.birthDate);
   const dayOfYear = this.getDayOfYearWithoutYear(date);
 
   const tree = this.getTreeByDayOfYear(dayOfYear);
   this.treeHoroscope = {
     name: tree.name,
     category: tree.category,
     description: tree.description,
     image: tree.image,
   };
 }
 
 getDayOfYearWithoutYear(date: Date): number {
   const day = date.getDate();
   const month = date.getMonth();
 
   const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
 
   let dayOfYear = day;
 
   for (let i = 0; i < month; i++) {
     dayOfYear += daysInMonth[i];
   }
 
   return dayOfYear;
 }
 
 getTreeByDayOfYear(dayOfYear: number): {
   name: string;
   category: string;
   description: string;
   image: string;
 } {
   const daysPerTree = 365 / this.trees.length;
   console.log(dayOfYear);
 
   const treeIndex = Math.floor((dayOfYear - 1) / daysPerTree);
   const treeName = this.trees[treeIndex].name;
   const category = this.trees[treeIndex].category;
   const description = this.trees[treeIndex].description;
   const imgUrl = this.trees[treeIndex].image;
 
   return {
     name: treeName,
     category: category,
     description: description,
     image: imgUrl,
   };
 }
 
 onSearchByCategory(category: string) {
   this.store.dispatch(
     new GetProductsPageByCategoryAction({
       pageSize: { page: 0, size: 6 },
       data: category,
     })
   );
   this.router.navigateByUrl('/searched-products');
 }
 }
