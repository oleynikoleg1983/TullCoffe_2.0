import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { Product } from '../../../shared/models/product.model';
import { ProductService } from '../../../shared/services/product.service';
import { ProductModalComponent } from '../product-modal/product-modal.component';
import { ProductListComponent } from '../product-list/product-list.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [ProductModalComponent, ProductListComponent, CommonModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.less'
})
export class ShopComponent implements OnInit {
  private readonly productService = inject(ProductService);
  products = toSignal(this.productService.products$, {
    initialValue: []
  });
  selectedProduct: Product | null = null;
  selectedQuantity = 1;

  constructor() {}

  ngOnInit(): void {
    this.productService.loadProducts();
  }

  openProductModal(product: Product): void {
    this.selectedProduct = product;
    this.selectedQuantity = 1;
  }

  closeProductModal(): void {
    this.selectedProduct = null;
  }

  applyProductChanges(quantity: number): void {
    if (!this.selectedProduct) {
      return;
    }

    console.log('Selected product:', this.selectedProduct.name, 'quantity:', quantity);
    this.selectedProduct = null;
  }
}
