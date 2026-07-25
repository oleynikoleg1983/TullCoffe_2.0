import { Routes } from '@angular/router';
import { adminGuard } from './shared/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () =>
      import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'shop',
    loadChildren: () =>
      import('./shop/shop.routes').then((m) => m.SHOP_ROUTES),
  },
  {
    path: '',
    redirectTo: 'shop',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'shop',
  },
];