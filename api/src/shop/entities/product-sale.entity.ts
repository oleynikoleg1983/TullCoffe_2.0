import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product_sales')
export class ProductSaleEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ name: 'product_id', type: 'bigint' })
  productId: string;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ name: 'unit_price', type: 'numeric', precision: 10, scale: 2 })
  unitPrice: string;

  @Column({ name: 'total_price', type: 'numeric', precision: 12, scale: 2 })
  totalPrice: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
