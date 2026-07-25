import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';


import { Product } from '../../../shared/models/product.model';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    MatDialogModule, 
    MatFormFieldModule,
    MatInputModule, 
    MatButtonModule,
    ],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.less'
})
export class ProductModalComponent {

  private dialogRef = inject(MatDialogRef<ProductModalComponent>);

  data = inject(MAT_DIALOG_DATA) as {
    product: Product;
    quantity: number;
  };

  quantity = this.data.quantity;

  close(): void {
    this.dialogRef.close();
  }

  apply(): void {
    this.dialogRef.close(this.quantity);
  }

  increase(): void {
    this.quantity = this.quantity + 1
  }

  decrease(): void {
    this.quantity = (this.quantity > 1) ? this.quantity - 1 : this.quantity;
  }

  get summa() {
    return this.quantity * this.data.product.price;
  }

  get currency() {
    return 'UAH';
  }
}