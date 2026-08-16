import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ShopService } from './shop.service';

class PurchaseProductDto {
  id!: number;
  quantity!: number;
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
}
