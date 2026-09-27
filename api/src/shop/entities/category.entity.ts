import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categories') 
export class CategoryEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id!: string;

  @Column({ name: 'site_id', type: 'bigint', default: 1 })
  siteId!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

}
