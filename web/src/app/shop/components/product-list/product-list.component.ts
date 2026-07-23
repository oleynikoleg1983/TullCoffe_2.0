import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Product } from '../../../shared/models/product.model';

@Component({
  selector: 'product-list',
  standalone: true,
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