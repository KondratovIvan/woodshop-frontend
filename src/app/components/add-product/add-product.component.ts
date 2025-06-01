import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/productService/product.service';
import { CreatedProduct, ProductsCategory as ProductsCategoryMap } from '../../models/product.model';
import type { ProductsCategory as ProductsCategoryType } from '../../models/product.model';
import { Color, Currency } from '../../models/common.model';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  addProductFormGroup!: FormGroup;
  submitted = false;

  categoryOptions = Object.values(ProductsCategoryMap);
  categories: ProductsCategoryType[] =
    this.categoryOptions.map(c => c.category as ProductsCategoryType);

  colors: string[] = Object.values(Color);
  currencies: string[] = Object.values(Currency);

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.addProductFormGroup = this.fb.group({
      productName: ['', Validators.required],
      productImage1: [null, Validators.required],
      productImage2: [null, Validators.required],
      productImage3: [null, Validators.required],
      productBrand: ['', Validators.required],
      productPrice: [null, Validators.required],
      productCurrency: ['', Validators.required],
      productColors: [[], Validators.required],
      productQuantity: [0, Validators.required],
      productSelected: [false],
      productDescription: ['', Validators.required],
      productHeight: [0, [Validators.required, Validators.min(0.01)]],
      productWidth: [0, [Validators.required, Validators.min(0.01)]],
      productLarger: [0, [Validators.required, Validators.min(0.01)]],
      productWeight: [0, [Validators.required, Validators.min(0.01)]],
      productCategory: ['', Validators.required],
    });
  }

  addProduct(): void {
    this.submitted = true;
    if (this.addProductFormGroup.invalid) {
      return;
    }

    const f = this.addProductFormGroup.value;
    const product: CreatedProduct = {
      name: f.productName,
      quantity: f.productQuantity,
      category: f.productCategory,
      description: f.productDescription,
      productPrice: {
        price: f.productPrice,
        currency: f.productCurrency,
        symbol: f.productCurrency,
      },
      productImagesBas64: [f.productImage1, f.productImage2, f.productImage3],
      colors: f.productColors,
      brand: f.productBrand,
      selected: f.productSelected,
      status: 'AVAILABLE',
      dimension: {
        height: f.productHeight,
        width: f.productWidth,
        larger: f.productLarger,
        weight: f.productWeight,
      },
    };

    this.productService.saveProduct(product).subscribe({
      next: created => {
        alert(`Product "${created.name}" has been added!`);
        this.router.navigate(['/products']);
      },
      error: err => {
        console.error('Error saving product:', err);
        alert('Error on saving product.');
      },
    });
  }

  onFileSelected(event: Event, imageNum: number): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.addProductFormGroup.patchValue({
        [`productImage${imageNum}`]: reader.result as string,
      });
    };
    reader.readAsDataURL(input.files[0]);
    input.value = '';
  }
}
