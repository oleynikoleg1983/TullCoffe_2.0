import { Injectable } from '@nestjs/common';
import { Product, ShopService } from '../shop/shop.service';

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

@Injectable()
export class AdminService {
	constructor(private readonly shopService: ShopService) {}

	createProduct(payload: UpsertProductPayload): Promise<Product> {
		return this.shopService.createProduct(payload);
	}

	updateProduct(id: number, payload: UpsertProductPayload): Promise<Product> {
		return this.shopService.updateProduct(id, payload);
	}
}
