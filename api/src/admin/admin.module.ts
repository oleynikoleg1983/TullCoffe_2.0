import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ShopModule } from '../shop/shop.module';

@Module({
  imports: [AuthModule, ShopModule],
  controllers: [AdminController],
  providers: [AdminService, JwtAuthGuard, RolesGuard],
})
export class AdminModule {}
