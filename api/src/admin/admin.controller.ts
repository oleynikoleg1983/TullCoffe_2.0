import { Body, Controller, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { AdminService } from './admin.service';

class UpdateProductDto {
	name!: string;
	description!: string;
	price!: number;
	isActive!: boolean;
	isDeleted!: boolean;
	categoryId!: number | null;
	userSalary!: number | null;
	sortOrder!: number;
}

class CreateProductDto {
	name!: string;
	description!: string;
	price!: number;
	isActive!: boolean;
	isDeleted!: boolean;
	categoryId!: number | null;
	userSalary!: number | null;
	sortOrder!: number;
}

@Controller('admin')
export class AdminController {
	constructor(private readonly adminService: AdminService) {}

	@Post('products')
	createProduct(@Body() dto: CreateProductDto) {
		return this.adminService.createProduct(dto);
	}

	@Put('products/:id')
	updateProduct(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
		return this.adminService.updateProduct(id, dto);
	}
}
