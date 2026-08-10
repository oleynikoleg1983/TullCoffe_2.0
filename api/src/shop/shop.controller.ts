import { Controller, Post, Body, Get } from '@nestjs/common';
import { ShopService } from './shop.service';

class PurchaseProductDto {
  id: number;
  quantity: number;
}

@Controller('products')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get()
  getProducts() {
    return this.shopService.getProducts();
  }

  @Post('purchase')
  purchaseProduct(@Body() dto: PurchaseProductDto) {
    return this.shopService.purchaseProduct(dto.id, dto.quantity);
  }
}
