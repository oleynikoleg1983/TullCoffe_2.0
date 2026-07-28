import { Injectable } from '@nestjs/common';

@Injectable()
export class ShopService {
  purchaseProduct(id: number, quantity: number) {
    console.log(`Purchase: product ${id}, quantity ${quantity}`);
    return { success: true, id, quantity };
  }
}
