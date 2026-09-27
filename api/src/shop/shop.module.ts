import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { ProductEntity } from './entities/product.entity';
import { ProductSaleEntity } from './entities/product-sale.entity';
import { CategoryEntity } from './entities/category.entity';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([ProductEntity, ProductSaleEntity, CategoryEntity])],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
