import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';

import { Product } from '../../../shared/models/product.model';
import { ProductService } from '../../../shared/services/product.service';
import { ProductModalComponent } from '../product-modal/product-modal.component';
import { ProductListComponent } from '../product-list/product-list.component';

import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [ProductListComponent, CommonModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.less'
})
export class ShopComponent implements OnInit {
  private readonly productService = inject(ProductService);
  products = toSignal(this.productService.products$, {
    initialValue: []
  });
  

  constructor( private dialog: MatDialog) {}

  ngOnInit(): void {
    this.productService.loadProducts();
  }

  
  openProductModal(product: Product): void {
    const dialogRef = this.dialog.open(ProductModalComponent, {
      width: '500px',
      panelClass: 'sell-product-dialog',
      data: {
        product,
        quantity: 1
      }
    });

    dialogRef.afterClosed().subscribe(quantity => {
      if (quantity == null) {
        return;
      }

      this.applyProductChanges(quantity, product);
    });
  }

  applyProductChanges(quantity: number, product: Product): void {
    console.log('Selected product:', product.name, 'quantity:', quantity);
  }
}
