import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Category } from '../../../../shared/models/category.model';

export type CreateCategoryPayload = Omit<Category, 'id'>;

@Component({
  selector: 'app-create-category-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './create-category-modal.component.html',
  styleUrl: './create-category-modal.component.less',
})
export class CreateCategoryModalComponent {
  private readonly dialogRef = inject(MatDialogRef<CreateCategoryModalComponent>);

  readonly draft: CreateCategoryPayload = {
    name: '',
    isActive: true,
  };

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    const name = this.draft.name.trim();

    if (!name) {
      return;
    }

    this.dialogRef.close({
      name,
      isActive: this.draft.isActive,
    });
  }
}
