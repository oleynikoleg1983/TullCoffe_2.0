import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductSaleEntity } from './entities/product-sale.entity';

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  isActive: boolean;
  isDeleted: boolean;
  categoryId: number | null;
  userSalary: number | null;
  sortOrder: number;
  is_active?: boolean;
  is_deleted?: boolean;
  category_id?: number | null;
  user_salary?: number | null;
  sort_order?: number;
}

interface UpdateProductPayload {
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  isDeleted: boolean;
  categoryId: number | null;
  userSalary: number | null;
  sortOrder: number;
}

interface CreateProductPayload {
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  isDeleted: boolean;
  categoryId: number | null;
  userSalary: number | null;
  sortOrder: number;
}

interface GetProductsOptions {
  includeInactive?: boolean;
  includeDeleted?: boolean;
}

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductSaleEntity)
    private readonly productSaleRepository: Repository<ProductSaleEntity>,
  ) {}

  async getProducts(options: GetProductsOptions = {}): Promise<Product[]> {
    const where: FindOptionsWhere<ProductEntity> = {};

    if (!options.includeDeleted) {
      where.isDeleted = false;
    }

    if (!options.includeInactive) {
      where.isActive = true;
    }

    const products = await this.productRepository.find({
      where,
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
      isActive: product.isActive,
      isDeleted: product.isDeleted,
      categoryId: product.categoryId == null ? null : Number(product.categoryId),
      userSalary: product.userSalary == null ? null : Number(product.userSalary),
      sortOrder: product.sortOrder,
      is_active: product.isActive,
      is_deleted: product.isDeleted,
      category_id: product.categoryId == null ? null : Number(product.categoryId),
      user_salary: product.userSalary == null ? null : Number(product.userSalary),
      sort_order: product.sortOrder,
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

  async createProduct(payload: CreateProductPayload): Promise<Product> {
    const normalizedName = payload.name?.trim();
    const normalizedDescription = payload.description?.trim() ?? '';
    const normalizedPrice = Number(payload.price);
    const normalizedCategoryId = payload.categoryId == null ? null : Number(payload.categoryId);
    const normalizedUserSalary = payload.userSalary == null ? null : Number(payload.userSalary);
    const normalizedSortOrder = Number(payload.sortOrder);

    if (!normalizedName) {
      throw new BadRequestException('Product name is required');
    }

    if (!Number.isFinite(normalizedPrice) || normalizedPrice < 0) {
      throw new BadRequestException('Price must be a non-negative number');
    }

    if (typeof payload.isActive !== 'boolean') {
      throw new BadRequestException('isActive must be boolean');
    }

    if (typeof payload.isDeleted !== 'boolean') {
      throw new BadRequestException('isDeleted must be boolean');
    }

    if (normalizedCategoryId != null && (!Number.isInteger(normalizedCategoryId) || normalizedCategoryId < 0)) {
      throw new BadRequestException('categoryId must be a positive integer or null');
    }

    if (normalizedUserSalary != null && (!Number.isFinite(normalizedUserSalary) || normalizedUserSalary < 0)) {
      throw new BadRequestException('userSalary must be a non-negative number or null');
    }

    if (!Number.isInteger(normalizedSortOrder) || normalizedSortOrder < 0) {
      throw new BadRequestException('sortOrder must be a non-negative integer');
    }

    const created = this.productRepository.create({
      siteId: '1',
      name: normalizedName,
      description: normalizedDescription,
      price: normalizedPrice.toFixed(2),
      isActive: payload.isActive,
      isDeleted: payload.isDeleted,
      categoryId: normalizedCategoryId == null ? null : String(normalizedCategoryId),
      userSalary: normalizedUserSalary == null ? null : normalizedUserSalary.toFixed(2),
      sortOrder: normalizedSortOrder,
    });

    const saved = await this.productRepository.save(created);

    return {
      id: Number(saved.id),
      name: saved.name,
      price: Number(saved.price),
      description: saved.description ?? '',
      isActive: saved.isActive,
      isDeleted: saved.isDeleted,
      categoryId: saved.categoryId == null ? null : Number(saved.categoryId),
      userSalary: saved.userSalary == null ? null : Number(saved.userSalary),
      sortOrder: saved.sortOrder,
      is_active: saved.isActive,
      is_deleted: saved.isDeleted,
      category_id: saved.categoryId == null ? null : Number(saved.categoryId),
      user_salary: saved.userSalary == null ? null : Number(saved.userSalary),
      sort_order: saved.sortOrder,
    };
  }

  async updateProduct(id: number, payload: UpdateProductPayload): Promise<Product> {
    const normalizedName = payload.name?.trim();
    const normalizedDescription = payload.description?.trim() ?? '';
    const normalizedPrice = Number(payload.price);
    const normalizedCategoryId = payload.categoryId == null ? null : Number(payload.categoryId);
    const normalizedUserSalary = payload.userSalary == null ? null : Number(payload.userSalary);
    const normalizedSortOrder = Number(payload.sortOrder);

    if (!normalizedName) {
      throw new BadRequestException('Product name is required');
    }

    if (!Number.isFinite(normalizedPrice) || normalizedPrice < 0) {
      throw new BadRequestException('Price must be a non-negative number');
    }

    if (typeof payload.isActive !== 'boolean') {
      throw new BadRequestException('isActive must be boolean');
    }

    if (typeof payload.isDeleted !== 'boolean') {
      throw new BadRequestException('isDeleted must be boolean');
    }

    if (normalizedCategoryId != null && (!Number.isInteger(normalizedCategoryId) || normalizedCategoryId < 0)) {
      throw new BadRequestException('categoryId must be a positive integer or null');
    }

    if (normalizedUserSalary != null && (!Number.isFinite(normalizedUserSalary) || normalizedUserSalary < 0)) {
      throw new BadRequestException('userSalary must be a non-negative number or null');
    }

    if (!Number.isInteger(normalizedSortOrder) || normalizedSortOrder < 0) {
      throw new BadRequestException('sortOrder must be a non-negative integer');
    }

    const product = await this.productRepository.findOne({
      where: {
        id: String(id),
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    product.name = normalizedName;
    product.description = normalizedDescription;
    product.price = normalizedPrice.toFixed(2);
    product.isActive = payload.isActive;
    product.isDeleted = payload.isDeleted;
    product.categoryId = normalizedCategoryId == null ? null : String(normalizedCategoryId);
    product.userSalary = normalizedUserSalary == null ? null : normalizedUserSalary.toFixed(2);
    product.sortOrder = normalizedSortOrder;

    const updated = await this.productRepository.save(product);

    return {
      id: Number(updated.id),
      name: updated.name,
      price: Number(updated.price),
      description: updated.description ?? '',
      isActive: updated.isActive,
      isDeleted: updated.isDeleted,
      categoryId: updated.categoryId == null ? null : Number(updated.categoryId),
      userSalary: updated.userSalary == null ? null : Number(updated.userSalary),
      sortOrder: updated.sortOrder,
      is_active: updated.isActive,
      is_deleted: updated.isDeleted,
      category_id: updated.categoryId == null ? null : Number(updated.categoryId),
      user_salary: updated.userSalary == null ? null : Number(updated.userSalary),
      sort_order: updated.sortOrder,
    };
  }
}
