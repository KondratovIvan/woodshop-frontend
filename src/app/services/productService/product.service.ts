import {Injectable, OnInit} from '@angular/core';
import {map, Observable, switchMap} from "rxjs";
import {ActionPayload, CreatedProduct, Product, ProductPrice, ProductsPage} from "../../models/product.model";
import {HttpClient} from "@angular/common/http";
import {EventType, PageSize} from "../../models/common.model";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProductService implements OnInit{

  private productService:string =environment.productService
  ngOnInit(): void {
  }

  constructor(private http : HttpClient) { }

  public getAllProducts():Observable<Product[]>{
     return  this.http.get<Product[]>(this.productService + "/products")
  }
  public getProductsPage(pageSize : PageSize): Observable<Product[]> {
    return this.http.get<Product[]>(this.productService + "/products?page=" + pageSize.page + "&size=" + pageSize.size)
  }


  public getSelectedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productService + "/products/search/findBySelected?selected=true")
  }
  public getProductsPageByKeyword(payload : ActionPayload<String>): Observable<Product[]> {
    return this.http.get<Product[]>(this.productService + "/products/search/findByNameContainsIgnoreCase?keyword=" + payload.data +"&page=" + payload.pageSize.page +"&size="+payload.pageSize.size)
  }

  public getProductsPageByCategory(payload : ActionPayload<String>): Observable<Product[]> {
    return this.http.get<Product[]>(this.productService + "/products/search/findByCategory?category=" + payload.data +"&page=" + payload.pageSize.page +"&size="+payload.pageSize.size)
  }

  public recordClick(productName: string, customerId: string): void {
    const url = `${this.productService}/api/products/event/click/${productName}/${customerId}`;
    this.http
      .get<void>(url)
      .subscribe({
        next: () => console.log(`Click event sent: product=${productName}`),
        error: err => console.error('Error recording click event', err)
      });
  }

  public recordCategoryView(category: string, customerId: string): void {
    const cat = encodeURIComponent(category);
    const url = `${this.productService}/api/products/event/category/${cat}/${customerId}`;
    this.http
      .get<void>(url)
      .subscribe({
        next: () => console.log(`Category view sent: category=${category}`),
        error: err => console.error('Error recording category view', err)
      });
  }

  public recordKeywordSearch(keyword: string, customerId: string): void {
    if (!keyword?.trim()) return;
    const key = encodeURIComponent(keyword);
    const url = `${this.productService}/api/products/event/keyword/${key}/${customerId}`;
    this.http
      .get<void>(url)
      .subscribe({
        next: () => console.log(`Keyword search sent: keyword=${keyword}`),
        error: err => console.error('Error recording keyword search', err)
      });
  }

  public saveProduct(product : CreatedProduct):Observable<Product>{
    return this.http.post<Product>(this.productService + "/api/products" , product) ;
  }

  public editProduct(
    productId: string,
    changes: Partial<CreatedProduct>
  ): Observable<Product> {
    return this.http.put<Product>(
      this.productService + `/api/products/${productId}`,
      changes
    );
  }

  public deleteProduct(productId : string):Observable<Product>{
     return this.http.delete<Product>(this.productService + "/products/" + productId) ;
  }


  public getDate(product : Product){
    return product.addingDate.slice(0 ,10);
  }

  public getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(this.productService + `/api/products/find/${id}`);
  }
  

}
