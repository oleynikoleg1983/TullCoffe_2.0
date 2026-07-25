import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../../shared/models/product.model';

@Component({
  selector: 'product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.less'
})
export class ProductListComponent implements OnInit { 

     @Input() products: Product[] = [];
     @Output() selectedProduct = new EventEmitter<Product>();

     ngOnInit(): void {}

     selectProduct(product: Product): void {
        this.selectedProduct.emit(product);
     }
}