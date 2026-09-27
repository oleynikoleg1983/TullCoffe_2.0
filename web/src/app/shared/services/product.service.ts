import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { CategoryService } from './category.service';
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

  constructor(
    private readonly productApiService: ProductApiService,
    private readonly categoryService: CategoryService,
  ) {}

  loadProducts(options: LoadProductsOptions = {}): void {
    this.categoryService.loadCategories();

    this.productApiService
      .getProducts(options)
      .pipe(
        switchMap((products) =>
          this.categoryService.categories$.pipe(
            take(1),
            map((categories) => this.filterActiveCategoryProducts(products, categories)),
          ),
        ),
      )
      .subscribe({
        next: (products) => this.productsSubject.next(products),
        error: () => this.productsSubject.next([]),
      });
  }

  getProducts(): Product[] {
    return this.productsSubject.value;
  }

  private filterActiveCategoryProducts(products: Product[], categories: Array<{ id: number; isActive: boolean }>): Product[] {
    if (!categories.length) {
      return products;
    }

    const activeCategoryIds = new Set(
      categories.filter((category) => category.isActive).map((category) => category.id),
    );

    return products.filter(
      (product) => product.categoryId == null || activeCategoryIds.has(product.categoryId),
    );
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
