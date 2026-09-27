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
      {
        path: 'categories',
        loadComponent: () =>
          import('./components/categories/admin-categories.component').then(
            (m) => m.AdminCategoriesComponent
          ),
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./components/reports/admin-reports.component').then(
            (m) => m.AdminReportsComponent
          ),
      },
    ],
  },
];