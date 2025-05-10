import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/productService/product.service';
import {
  ProductsCategory as ProductsCategoryMap,
  CreatedProduct,
  Product
} from '../../models/product.model';
import { Color, Currency } from '../../models/common.model';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
  editForm!: FormGroup;
  submitted = false;
  isLoading = true;
  productId!: string;

  categoryOptions = Object.values(ProductsCategoryMap);
  colors         = Object.values(Color);
  currencies     = Object.values(Currency);

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // получаем id из URL
    this.productId = this.route.snapshot.paramMap.get('id')!;
    // загружаем продукт
    this.productService.getProductById(this.productId).subscribe({
      next: p => this.initForm(p),
      error: () => this.router.navigate(['/home'])
    });
  }

  private initForm(p: Product) {
    // строим formGroup с валидаторами
    this.editForm = this.fb.group({
      productName:     [p.name,      Validators.required],
      productQuantity: [p.quantity,  Validators.required],
      productBrand:    [p.brand,     Validators.required],
      productPrice:    [p.productPrice.price,    Validators.required],
      productCurrency: [p.productPrice.currency, Validators.required],
      productCategory: [p.category,  Validators.required],
      productColors:   [p.colors,    Validators.required],
      productDescription: [p.description, Validators.required],
      productSelected: [p.selected],

      productHeight:  [p.dimension.height, [Validators.required, Validators.min(0.01)]],
      productWidth:   [p.dimension.width,  [Validators.required, Validators.min(0.01)]],
      productLarger:  [p.dimension.larger, [Validators.required, Validators.min(0.01)]],
      productWeight:  [p.dimension.weight, [Validators.required, Validators.min(0.01)]],

      productImage1: [p.productImagesBas64?.[0] || null, Validators.required],
      productImage2: [p.productImagesBas64?.[1] || null, Validators.required],
      productImage3: [p.productImagesBas64?.[2] || null, Validators.required]
    });

    this.isLoading = false;
  }

  onFileSelected(event: Event, num: number): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.editForm.patchValue({ [`productImage${num}`]: reader.result });
    };
    reader.readAsDataURL(input.files[0]);
    input.value = '';
  }

  saveChanges(): void {
    this.submitted = true;
    if (this.editForm.invalid) {
      return;
    }

    const raw = this.editForm.value as any;
    const changes: Partial<CreatedProduct> = {};

    // текстовые / числовые поля
    changes.name        = raw.productName;
    changes.quantity    = raw.productQuantity;
    changes.brand       = raw.productBrand;
    changes.description = raw.productDescription;
    changes.productPrice = {
      price:    raw.productPrice,
      currency: raw.productCurrency,
      symbol:   ''
    };
    changes.category   = raw.productCategory;
    changes.colors     = raw.productColors;
    changes.selected   = raw.productSelected;

    // размеры
    changes.dimension = {
      height: raw.productHeight,
      width:  raw.productWidth,
      larger: raw.productLarger,
      weight: raw.productWeight
    };

    // изображения
    changes.productImagesBas64 = [
      raw.productImage1,
      raw.productImage2,
      raw.productImage3
    ];

    this.productService.editProduct(this.productId, changes).subscribe({
      next: () => {
        alert('Product updated successfully');
        this.router.navigate(['/product-details', this.productId]);
      },
      error: err => {
        console.error('Failed to save', err);
        alert('Unable to save changes');
      }
    });
  }
}
