import { Component, OnInit, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { Product } from '../../../shared/models/product.model';
import { ProductService } from '../../../shared/services/product.service';
import {
  CreateProductModalComponent,
  CreateProductPayload,
} from './create-product-modal.component';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.less'
})
export class AdminProductsComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly dialog = inject(MatDialog);
  readonly products = toSignal(this.productService.products$, { initialValue: [] });

  private readonly drafts: Record<number, Product> = {};
  private readonly editing: Record<number, boolean> = {};
  private readonly saving: Record<number, boolean> = {};

  ngOnInit(): void {
    this.productService.loadProducts({
      includeInactive: true,
      includeDeleted: true,
    });
  }

  startEditing(product: Product): void {
    this.editing[product.id] = true;
    this.drafts[product.id] = { ...product };
  }

  isEditing(productId: number): boolean {
    return this.editing[productId] === true;
  }

  isSaving(productId: number): boolean {
    return this.saving[productId] === true;
  }

  getDraft(product: Product): Product {
    return this.drafts[product.id] ?? { ...product };
  }

  hasChanges(product: Product): boolean {
    const draft = this.getDraft(product);

    return (
      draft.name.trim() !== product.name.trim() ||
      draft.description.trim() !== product.description.trim() ||
      Number(draft.price) !== Number(product.price) ||
      draft.isActive !== product.isActive ||
      draft.isDeleted !== product.isDeleted ||
      this.toNullableNumber(draft.categoryId) !== this.toNullableNumber(product.categoryId) ||
      this.toNullableNumber(draft.userSalary) !== this.toNullableNumber(product.userSalary) ||
      Number(draft.sortOrder) !== Number(product.sortOrder)
    );
  }

  saveProduct(product: Product): void {
    if (!this.isEditing(product.id) || !this.hasChanges(product) || this.isSaving(product.id)) {
      return;
    }

    const draft = this.getDraft(product);
    const payload: Product = {
      id: product.id,
      name: draft.name.trim(),
      description: draft.description.trim(),
      price: Number(draft.price),
      isActive: draft.isActive,
      isDeleted: draft.isDeleted,
      categoryId: this.toNullableNumber(draft.categoryId),
      userSalary: this.toNullableNumber(draft.userSalary),
      sortOrder: Number(draft.sortOrder),
    };

    this.saving[product.id] = true;

    this.productService
      .updateProduct(payload)
      .pipe(
        finalize(() => {
          this.saving[product.id] = false;
        }),
      )
      .subscribe({
        next: () => {
          this.editing[product.id] = false;
          delete this.drafts[product.id];
        },
      });
  }

  cancelEditing(productId: number): void {
    this.editing[productId] = false;
    delete this.drafts[productId];
  }

  setDraftCategoryId(product: Product, value: unknown): void {
    this.getDraft(product).categoryId = this.toNullableNumber(value);
  }

  setDraftUserSalary(product: Product, value: unknown): void {
    this.getDraft(product).userSalary = this.toNullableNumber(value);
  }

  openCreateProductModal(): void {
    const dialogRef = this.dialog.open(CreateProductModalComponent, {
      width: '680px',
      panelClass: 'create-product-dialog',
    });

    dialogRef.afterClosed().subscribe((payload?: CreateProductPayload) => {
      if (!payload) {
        return;
      }

      this.productService.createProduct(payload).subscribe();
    });
  }

  private toNullableNumber(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
}
