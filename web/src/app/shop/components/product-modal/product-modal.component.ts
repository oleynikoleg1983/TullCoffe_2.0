import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../shared/models/product.model';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.less'
})
export class ProductModalComponent {
  @Input() product: Product | null = null;
  @Input() quantity = 1;
  @Output() closeModal = new EventEmitter<void>();
  @Output() applyChanges = new EventEmitter<number>();

  close(): void {
    this.closeModal.emit();
  }

  apply(): void {
    this.applyChanges.emit(this.quantity);
  }
}
