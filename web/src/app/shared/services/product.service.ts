import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { ProductApiService } from './product-api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly fallbackProducts: Product[] = [
    { id: 1, name: 'Espresso', price: 45, description: 'Strong coffee with a rich aroma.' },
    { id: 2, name: 'Latte', price: 65, description: 'Smooth milk coffee with a soft taste.' },
    { id: 3, name: 'Cappuccino', price: 70, description: 'Classic coffee with creamy foam.' },
    { id: 4, name: 'Americano', price: 55, description: 'Black coffee with a bold body.' },
    { id: 5, name: 'Mocha', price: 74, description: 'Coffee with chocolate and creamy texture.' },
    { id: 6, name: 'Flat White', price: 69, description: 'Velvety coffee with fine microfoam.' },
    { id: 7, name: 'Macchiato', price: 62, description: 'Espresso topped with a small milk foam.' },
    { id: 8, name: 'Cold Brew', price: 73, description: 'Slow-steeped coffee with a smooth finish.' },
    { id: 9, name: 'Irish Coffee', price: 89, description: 'Coffee blended with whiskey and cream.' },
    { id: 10, name: 'Tea Latte', price: 58, description: 'A fragrant tea with steamed milk.' },
    { id: 11, name: 'Chai Latte', price: 60, description: 'Spiced chai with a creamy finish.' }
  ];

  private readonly productsSubject = new BehaviorSubject<Product[]>([]);
  readonly products$: Observable<Product[]> = this.productsSubject.asObservable();

  constructor(private readonly productApiService: ProductApiService) {}

  loadProducts(): void {
    this.productApiService
      .getProducts()
      .pipe(catchError(() => of(this.fallbackProducts)))
      .subscribe((products) => this.productsSubject.next(products));
  }

  getProducts(): Product[] {
    return this.productsSubject.value;
  }
}
