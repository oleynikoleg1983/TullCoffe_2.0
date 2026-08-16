import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Product } from '../../../shared/models/product.model';

export type CreateProductPayload = Omit<Product, 'id'>;

@Component({
  selector: 'app-create-product-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './create-product-modal.component.html',
  styleUrl: './create-product-modal.component.less'
})
export class CreateProductModalComponent {
  private readonly dialogRef = inject(MatDialogRef<CreateProductModalComponent>);

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
