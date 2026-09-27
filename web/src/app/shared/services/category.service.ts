import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Category } from '../models/category.model';
import { CategoryApiService } from './category-api.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly categoriesSubject = new BehaviorSubject<Category[]>([]);
  readonly categories$ = this.categoriesSubject.asObservable();

  constructor(private readonly categoryApiService: CategoryApiService) {}

  loadCategories(): void {
    this.categoryApiService.getCategories().subscribe({
      next: (categories) => this.categoriesSubject.next(categories),
      error: () => this.categoriesSubject.next([]),
    });
  }

  getCategories(): Category[] {
    return this.categoriesSubject.value;
  }

  createCategory(category: Omit<Category, 'id'>): Observable<Category> {
    return this.categoryApiService.createCategory(category).pipe(
      tap((created) => {
        const next = [...this.categoriesSubject.value, created].sort(
          (a, b) => a.id - b.id,
        );

        this.categoriesSubject.next(next);
      }),
    );
  }

  updateCategory(category: Category): Observable<Category> {
    return this.categoryApiService
      .updateCategory(category.id, {
        name: category.name,
        isActive: category.isActive,
      })
      .pipe(
        tap((updated) => {
          const next = this.categoriesSubject.value.map((current) =>
            current.id === updated.id ? updated : current,
          );

          this.categoriesSubject.next(next);
        }),
      );
  }
}
