import { Component, OnInit, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { Category } from '../../../shared/models/category.model';
import { CategoryService } from '../../../shared/services/category.service';
import {
  CreateCategoryModalComponent,
  CreateCategoryPayload,
} from './create-category-modal/create-category-modal.component';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-categories.component.html',
  styleUrl: './admin-categories.component.less',
})
export class AdminCategoriesComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly dialog = inject(MatDialog);
  readonly categories = toSignal(this.categoryService.categories$, { initialValue: [] });

  private readonly drafts: Record<number, Category> = {};
  private readonly editing: Record<number, boolean> = {};
  private readonly saving: Record<number, boolean> = {};

  ngOnInit(): void {
    this.categoryService.loadCategories();
  }

  startEditing(category: Category): void {
    this.editing[category.id] = true;
    this.drafts[category.id] = { ...category };
  }

  isEditing(categoryId: number): boolean {
    return this.editing[categoryId] === true;
  }

  isSaving(categoryId: number): boolean {
    return this.saving[categoryId] === true;
  }

  getDraft(category: Category): Category {
    return this.drafts[category.id] ?? { ...category };
  }

  hasChanges(category: Category): boolean {
    const draft = this.getDraft(category);

    return (
      draft.name.trim() !== category.name.trim() ||
      draft.isActive !== category.isActive
    );
  }

  saveCategory(category: Category): void {
    if (!this.isEditing(category.id) || !this.hasChanges(category) || this.isSaving(category.id)) {
      return;
    }

    const draft = this.getDraft(category);
    const payload: Category = {
      id: category.id,
      name: draft.name.trim(),
      isActive: draft.isActive,
    };

    this.saving[category.id] = true;

    this.categoryService
      .updateCategory(payload)
      .pipe(
        finalize(() => {
          this.saving[category.id] = false;
        }),
      )
      .subscribe({
        next: () => {
          this.editing[category.id] = false;
          delete this.drafts[category.id];
        },
      });
  }

  cancelEditing(categoryId: number): void {
    this.editing[categoryId] = false;
    delete this.drafts[categoryId];
  }

  openCreateCategoryModal(): void {
    const dialogRef = this.dialog.open(CreateCategoryModalComponent, {
      width: '460px',
      panelClass: 'create-category-dialog',
    });

    dialogRef.afterClosed().subscribe((payload?: CreateCategoryPayload) => {
      if (!payload) {
        return;
      }

      this.categoryService.createCategory(payload).subscribe();
    });
  }
}
