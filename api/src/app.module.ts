import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShopModule } from './shop/shop.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [ShopModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
