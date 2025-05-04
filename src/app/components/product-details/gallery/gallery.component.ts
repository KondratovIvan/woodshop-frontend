import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent implements OnInit {
  @Input() product!: { productImagesBas64: string[] };

  selectedImage: string | null = null;

  ngOnInit(): void {
    if (this.product.productImagesBas64?.length) {
      this.selectedImage = this.product.productImagesBas64[0];
    }
  }

  changeImage(img: string): void {
    this.selectedImage = img;
  }
}
