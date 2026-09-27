import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CurrentUserService } from '../services/current-user.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const currentUserService = inject(CurrentUserService);

  if (currentUserService.getCurrentUser()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const currentUserService = inject(CurrentUserService);
  const currentUser = currentUserService.getCurrentUser();

  if (currentUser?.role === 'admin') {
    return true;
  }

  if (!currentUser) {
    return router.createUrlTree(['/login']);
  }

  return router.createUrlTree(['/shop']);
};
