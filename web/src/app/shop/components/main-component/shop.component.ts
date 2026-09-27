import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { Product } from '../../../shared/models/product.model';
import { CategoryService } from '../../../shared/services/category.service';
import { ProductService } from '../../../shared/services/product.service';
import { ProductModalComponent } from '../product-modal/product-modal.component';
import { ProductListComponent } from '../product-list/product-list.component';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [ProductListComponent, CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.less'
})
export class ShopComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  products = toSignal(this.productService.products$, {
    initialValue: []
  });
  categories = toSignal(this.categoryService.categories$, {
    initialValue: []
  });
  selectedCategoryId: number | null = null;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.categoryService.loadCategories();
    this.productService.loadProducts();
  }

  get filteredProducts(): Product[] {
    const products = this.products();

    if (this.selectedCategoryId == null) {
      return products;
    }

    return products.filter((product) => product.categoryId === this.selectedCategoryId);
  }

  get activeCategories() {
    return this.categories().filter((category) => category.isActive);
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
    console.log('Selected product: -2- ', product.name, 'quantity:', quantity);
    this.productService.purchaseProduct(product.id, quantity).subscribe({
      next: () => {
        this.snackBar.open('Request completed successfully', 'Close', {
          duration: 3000
        });
      }
    });
  }
}
