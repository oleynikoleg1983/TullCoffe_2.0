import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ShopService } from './shop.service';

class PurchaseProductDto {
  id!: number;
  quantity!: number;
}

class UpdateProductDto {
  name!: string;
  description!: string;
  price!: number;
  isActive!: boolean;
  isDeleted!: boolean;
  categoryId!: number | null;
  userSalary!: number | null;
  sortOrder!: number;
}

class CreateProductDto {
  name!: string;
  description!: string;
  price!: number;
  isActive!: boolean;
  isDeleted!: boolean;
  categoryId!: number | null;
  userSalary!: number | null;
  sortOrder!: number;
}

@Controller('products')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get()
  getProducts(
    @Query('includeInactive') includeInactive?: string,
    @Query('includeDeleted') includeDeleted?: string,
  ) {
    return this.shopService.getProducts({
      includeInactive: includeInactive === 'true',
      includeDeleted: includeDeleted === 'true',
    });
  }

  @Post('purchase')
  purchaseProduct(@Body() dto: PurchaseProductDto) {
    return this.shopService.purchaseProduct(dto.id, dto.quantity);
  }

  @Post()
  createProduct(@Body() dto: CreateProductDto) {
    return this.shopService.createProduct(dto);
  }

  @Put(':id')
  updateProduct(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.shopService.updateProduct(id, dto);
  }
}
