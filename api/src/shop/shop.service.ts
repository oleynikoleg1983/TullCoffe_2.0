import { Injectable } from '@nestjs/common';

@Injectable()
export class ShopService {
  purchaseProduct(id: number, quantity: number) {
    console.log(`Purchase: product -1- ${id}, quantity ${quantity}`);
    return { success: true, id, quantity, message: '-Purchase successful 1-4-5-' };
  }
}
