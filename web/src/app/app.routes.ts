import { Routes } from '@angular/router';
import { AdminComponent } from './admin/components/admin.component';
import { ShopComponent } from './shop/components/shop.component';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent
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
