import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

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

class CreateCategoryDto {
  name!: string;
  isActive!: boolean;
}

class UpdateCategoryDto {
  name!: string;
  isActive!: boolean;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Roles('admin')
  @Post('products')
  createProduct(@Body() dto: CreateProductDto) {
    return this.adminService.createProduct(dto);
  }

  @Roles('admin')
  @Put('products/:id')
  updateProduct(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.adminService.updateProduct(id, dto);
  }

  @Roles('admin')
  @Post('categories')
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.adminService.createCategory(dto);
  }

  @Roles('admin')
  @Put('categories/:id')
  updateCategory(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) {
    return this.adminService.updateCategory(id, dto);
  }

  @Roles('admin')
  @Get('reports/sales')
  getSalesReport(@Query('from') from: string, @Query('to') to: string) {
    return this.adminService.getSalesReport(from, to);
  }

  @Roles('admin')
  @Get('reports/sales/details')
  getSalesReportDetails(@Query('from') from: string, @Query('to') to: string) {
    return this.adminService.getSalesReportDetails(from, to);
  }
}
