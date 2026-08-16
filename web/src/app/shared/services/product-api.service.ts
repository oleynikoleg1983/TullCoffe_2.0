import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

interface GetProductsOptions {
  includeInactive?: boolean;
  includeDeleted?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {
  constructor(private readonly http: HttpClient) {}

  getProducts(options: GetProductsOptions = {}): Observable<Product[]> {
    const query = new URLSearchParams();

    if (options.includeInactive) {
      query.set('includeInactive', 'true');
    }

    if (options.includeDeleted) {
      query.set('includeDeleted', 'true');
    }

    const suffix = query.toString();
    const url = suffix ? `/api/products?${suffix}` : '/api/products';

    return this.http.get<Product[]>(url);
  }

  purchaseProduct(id: number, quantity: number): Observable<void> {
    return this.http.post<void>('/api/products/purchase', { id, quantity });
  }

  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>('/api/admin/products', product);
  }

  updateProduct(id: number, product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.put<Product>(`/api/admin/products/${id}`, product);
  }
}
