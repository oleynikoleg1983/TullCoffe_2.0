import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductSaleEntity } from './entities/product-sale.entity';

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductSaleEntity)
    private readonly productSaleRepository: Repository<ProductSaleEntity>,
  ) {}

  async getProducts(): Promise<Product[]> {
    const products = await this.productRepository.find({
      where: {
        isDeleted: false,
        isActive: true,
      },
      order: {
        sortOrder: 'ASC',
        id: 'ASC',
      },
    });

    return products.map((product) => ({
      id: Number(product.id),
      name: product.name,
      price: Number(product.price),
      description: product.description ?? '',
    }));
  }

  async purchaseProduct(id: number, quantity: number) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException('Quantity must be a positive integer');
    }

    const product = await this.productRepository.findOne({
      where: {
        id: String(id),
        isDeleted: false,
        isActive: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const unitPrice = Number(product.price);
    const totalPrice = unitPrice * quantity;

    const sale = this.productSaleRepository.create({
      productId: product.id,
      quantity,
      unitPrice: unitPrice.toFixed(2),
      totalPrice: totalPrice.toFixed(2),
    });

    const savedSale = await this.productSaleRepository.save(sale);

    return {
      success: true,
      id,
      quantity,
      saleId: Number(savedSale.id),
      message: 'Purchase successful',
    };
  }
}
