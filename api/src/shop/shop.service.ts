import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductSaleEntity } from './entities/product-sale.entity';
import { CategoryEntity } from './entities/category.entity';

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

export interface Category {
  id: number;
  name: string;
  isActive: boolean;
}

interface CreateCategoryPayload {
  name: string;
  isActive: boolean;
}

interface UpdateCategoryPayload {
  name: string;
  isActive: boolean;
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

export interface SalesReportRow {
  userId: number;
  userName: string;
  email: string;
  productsSold: number;
  salesAmount: number;
  salaryAmount: number;
}

export interface SalesReportDetailRow {
  saleId: number;
  createdAt: string;
  productName: string;
  sellerName: string;
  quantity: number;
  salesAmount: number;
}

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(ProductSaleEntity)
    private readonly productSaleRepository: Repository<ProductSaleEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
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

  async purchaseProduct(id: number, quantity: number, userId?: number) {
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
      userId: userId == null ? null : String(userId),
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

  async getSalesReport(from: string, to: string): Promise<SalesReportRow[]> {
    if (!this.isDateOnly(from) || !this.isDateOnly(to) || from > to) {
      throw new BadRequestException('A valid date range is required');
    }

    const fromDate = new Date(`${from}T00:00:00.000Z`);
    const toDate = new Date(`${to}T00:00:00.000Z`);
    toDate.setUTCDate(toDate.getUTCDate() + 1);

    const rows = await this.productSaleRepository.query(
      `
        SELECT
          u.id AS "userId",
          u.name AS "userName",
          u.email AS "email",
          COALESCE(SUM(ps.quantity), 0)::int AS "productsSold",
          COALESCE(SUM(ps.total_price), 0)::numeric(12, 2) AS "salesAmount",
          COALESCE(SUM(ps.quantity * COALESCE(p.user_salary, 0)), 0)::numeric(12, 2) AS "salaryAmount"
        FROM users u
        INNER JOIN product_sales ps ON ps.user_id = u.id
        INNER JOIN products p ON p.id = ps.product_id
        WHERE ps.created_at >= $1 AND ps.created_at < $2
        GROUP BY u.id, u.name, u.email
        ORDER BY "salesAmount" DESC, u.name ASC
      `,
      [fromDate, toDate],
    );

    return rows.map((row: SalesReportRow) => ({
      userId: Number(row.userId),
      userName: row.userName,
      email: row.email,
      productsSold: Number(row.productsSold),
      salesAmount: Number(row.salesAmount),
      salaryAmount: Number(row.salaryAmount),
    }));
  }

  async getSalesReportDetails(from: string, to: string): Promise<SalesReportDetailRow[]> {
    if (!this.isDateOnly(from) || !this.isDateOnly(to) || from > to) {
      throw new BadRequestException('A valid date range is required');
    }

    const fromDate = new Date(`${from}T00:00:00.000Z`);
    const toDate = new Date(`${to}T00:00:00.000Z`);
    toDate.setUTCDate(toDate.getUTCDate() + 1);

    const rows = await this.productSaleRepository.query(
      `
        SELECT
          ps.id AS "saleId",
          ps.created_at AS "createdAt",
          p.name AS "productName",
          u.name AS "sellerName",
          ps.quantity AS "quantity",
          ps.total_price AS "salesAmount"
        FROM product_sales ps
        INNER JOIN products p ON p.id = ps.product_id
        INNER JOIN users u ON u.id = ps.user_id
        WHERE ps.created_at >= $1 AND ps.created_at < $2
        ORDER BY ps.created_at DESC, ps.id DESC
      `,
      [fromDate, toDate],
    );

    return rows.map((row: SalesReportDetailRow) => ({
      saleId: Number(row.saleId),
      createdAt: row.createdAt,
      productName: row.productName,
      sellerName: row.sellerName,
      quantity: Number(row.quantity),
      salesAmount: Number(row.salesAmount),
    }));
  }

  private isDateOnly(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return false;
    }

    return !Number.isNaN(new Date(`${value}T00:00:00.000Z`).getTime());
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

  async createCategory(payload: CreateCategoryPayload): Promise<Category> {
      const normalizedName = payload.name?.trim();
      if (!normalizedName) {
        throw new BadRequestException('Product name is required');
      }
      if (typeof payload.isActive !== 'boolean') {
        throw new BadRequestException('isActive must be boolean');
      }

      const created = this.categoryRepository.create({
        siteId: '1',
        name: normalizedName,
        isActive: payload.isActive
      });

    const saved = await this.categoryRepository.save(created);

    return {
      id: Number(saved.id),
      name: saved.name,
      isActive: saved.isActive,
    };

  }

  async updateCategory(id: number, payload: UpdateCategoryPayload): Promise<Category> {
    const category = await this.categoryRepository.findOneBy({ id: String(id) });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const normalizedName = payload.name?.trim();
    if (!normalizedName) {
      throw new BadRequestException('Category name is required');
    }
    if (typeof payload.isActive !== 'boolean') {
      throw new BadRequestException('isActive must be boolean');
    }

    category.name = normalizedName;
    category.isActive = payload.isActive;

    const updated = await this.categoryRepository.save(category);

    return {
      id: Number(updated.id),
      name: updated.name,
      isActive: updated.isActive,
    };
  }

  async getCategories(): Promise<Category[]> {
      const where: FindOptionsWhere<CategoryEntity> = {};
      const categories = await this.categoryRepository.find({
      where,
      order: {
        id: 'ASC'
      },
    });

     return categories.map((category) => ({
      id: Number(category.id),
      name: category.name,
      isActive: category.isActive
    }));
  }


}
