import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryApiService {
  constructor(private readonly http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/products/categories');
  }

  createCategory(category: Omit<Category, 'id'>): Observable<Category> {
    return this.http.post<Category>('/api/admin/categories', category);
  }

  updateCategory(id: number, category: Omit<Category, 'id'>): Observable<Category> {
    return this.http.put<Category>(`/api/admin/categories/${id}`, category);
  }
}
