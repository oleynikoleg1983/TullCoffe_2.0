import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { ProductEntity } from './entities/product.entity';
import { ProductSaleEntity } from './entities/product-sale.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, ProductSaleEntity])],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
