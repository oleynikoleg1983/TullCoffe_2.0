import { Routes } from '@angular/router';
import { adminGuard, authGuard } from './shared/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () =>
      import('./admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'shop',
    canActivate: [authGuard],
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