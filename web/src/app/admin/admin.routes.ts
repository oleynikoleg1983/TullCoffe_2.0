import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/main/admin.component').then(
        (m) => m.AdminComponent
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'products',
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./components/products/admin-products.component').then(
            (m) => m.AdminProductsComponent
          ),
      },
    ],
  },
];