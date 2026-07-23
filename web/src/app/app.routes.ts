import { Routes } from '@angular/router';
import { AdminComponent } from './admin/components/admin.component';
import { ShopComponent } from './shop/components/shop.component';
import { adminGuard } from './shared/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [adminGuard]
  },
  {
    path: 'shop',
    component: ShopComponent
  },
  {
    path: '',
    redirectTo: 'shop',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'shop'
  }
];
