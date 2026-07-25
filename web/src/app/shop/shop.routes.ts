import { Routes } from '@angular/router';

export const SHOP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/main-component/shop.component').then(
        (m) => m.ShopComponent
      ),
  },
];