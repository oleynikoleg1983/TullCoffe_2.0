import { Injectable } from '@nestjs/common';
import { Product, Category, SalesReportDetailRow, SalesReportRow, ShopService } from '../shop/shop.service';

interface UpsertProductPayload {
	name: string;
	description: string;
	price: number;
	isActive: boolean;
	isDeleted: boolean;
	categoryId: number | null;
	userSalary: number | null;
	sortOrder: number;
}

interface UpsertCategoryPayload {
	name: string;
	isActive: boolean;
}


@Injectable()
export class AdminService {
	constructor(private readonly shopService: ShopService) {}

	createProduct(payload: UpsertProductPayload): Promise<Product> {
		return this.shopService.createProduct(payload);
	}

	updateProduct(id: number, payload: UpsertProductPayload): Promise<Product> {
		return this.shopService.updateProduct(id, payload);
	}

    createCategory(payload: UpsertCategoryPayload): Promise<Category> {
		return this.shopService.createCategory(payload);
	}

	updateCategory(id: number, payload: UpsertCategoryPayload): Promise<Category> {
		return this.shopService.updateCategory(id, payload);
	}

	getSalesReport(from: string, to: string): Promise<SalesReportRow[]> {
		return this.shopService.getSalesReport(from, to);
	}

	getSalesReportDetails(from: string, to: string): Promise<SalesReportDetailRow[]> {
		return this.shopService.getSalesReportDetails(from, to);
	}
}
