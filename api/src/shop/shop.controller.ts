import { Controller, Post, Body } from '@nestjs/common';
import { ShopService } from './shop.service';

class PurchaseProductDto {
  id: number;
  quantity: number;
}

@Controller('products')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post('purchase')
  purchaseProduct(@Body() dto: PurchaseProductDto) {
    return this.shopService.purchaseProduct(dto.id, dto.quantity);
  }
}
