import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
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
  @UseGuards(JwtAuthGuard)
  purchaseProduct(@Body() dto: PurchaseProductDto, @Req() request: Request & { user?: { sub: number } }) {
    return this.shopService.purchaseProduct(dto.id, dto.quantity, request.user?.sub);
  }

  @Get('categories')
  getCategories() {
    return this.shopService.getCategories();
  }
}
