import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { toSignal } from '@angular/core/rxjs-interop';
import { Product } from '../../../../shared/models/product.model';
import { CategoryService } from '../../../../shared/services/category.service';

export type CreateProductPayload = Omit<Product, 'id'>;

@Component({
  selector: 'app-create-product-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './create-product-modal.component.html',
  styleUrl: './create-product-modal.component.less'
})
export class CreateProductModalComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<CreateProductModalComponent>);
  private readonly categoryService = inject(CategoryService);
  readonly categories = toSignal(this.categoryService.categories$, { initialValue: [] });

  readonly draft: CreateProductPayload = {
    name: '',
    description: '',
    price: 0,
    isActive: true,
    isDeleted: false,
    categoryId: null,
    userSalary: null,
    sortOrder: 0,
  };

  ngOnInit(): void {
    this.categoryService.loadCategories();
  }

  getActiveCategories() {
    return this.categories().filter((category) => category.isActive);
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (!this.draft.name.trim()) {
      return;
    }

    this.dialogRef.close({
      ...this.draft,
      name: this.draft.name.trim(),
      description: this.draft.description.trim(),
    });
  }
}
