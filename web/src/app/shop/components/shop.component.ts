import { Component, OnInit } from '@angular/core';
import { Product } from '../../shared/models/product.model';
import { ProductService } from '../../shared/services/product.service';
import { ProductModalComponent } from './product-modal/product-modal.component';
import { ProductListComponent } from './product-list/product-list.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [ProductModalComponent, ProductListComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.less'
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product | null = null;
  selectedQuantity = 1;

  constructor(private readonly productService: ProductService) {}

  ngOnInit(): void {
    this.productService.products$.subscribe((products) => {
      console.log('Products loaded:', products);
      this.products = products;
    });

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
