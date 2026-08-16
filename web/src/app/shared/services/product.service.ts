import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { ProductApiService } from './product-api.service';

interface LoadProductsOptions {
  includeInactive?: boolean;
  includeDeleted?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly productsSubject = new BehaviorSubject<Product[]>([]);
  readonly products$: Observable<Product[]> = this.productsSubject.asObservable();

  constructor(private readonly productApiService: ProductApiService) {}

  loadProducts(options: LoadProductsOptions = {}): void {
    this.productApiService
      .getProducts(options)
      .subscribe({
        next: (products) => this.productsSubject.next(products),
        error: () => this.productsSubject.next([])
      });
  }

  getProducts(): Product[] {
    return this.productsSubject.value;
  }

  purchaseProduct(id: number, quantity: number): Observable<void> {
    return this.productApiService.purchaseProduct(id, quantity);
  }

  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.productApiService.createProduct(product).pipe(
      tap((created) => {
        const next = [...this.productsSubject.value, created].sort(
          (a, b) => a.sortOrder - b.sortOrder || a.id - b.id,
        );

        this.productsSubject.next(next);
      }),
    );
  }

  updateProduct(product: Product): Observable<Product> {
    return this.productApiService
      .updateProduct(product.id, {
        name: product.name,
        description: product.description,
        price: product.price,
        isActive: product.isActive,
        isDeleted: product.isDeleted,
        categoryId: product.categoryId,
        userSalary: product.userSalary,
        sortOrder: product.sortOrder,
      })
      .pipe(
        tap((updated) => {
          const next = this.productsSubject.value.map((current) =>
            current.id === updated.id ? updated : current,
          );

          this.productsSubject.next(next);
        }),
      );
  }
}
