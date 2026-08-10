import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductApiService } from './product-api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly productsSubject = new BehaviorSubject<Product[]>([]);
  readonly products$: Observable<Product[]> = this.productsSubject.asObservable();

  constructor(private readonly productApiService: ProductApiService) {}

  loadProducts(): void {
    this.productApiService
      .getProducts()
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
}
