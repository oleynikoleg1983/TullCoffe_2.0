import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CurrentUserService } from '../services/current-user.service';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const currentUserService = inject(CurrentUserService);
  const currentUser = currentUserService.getCurrentUser();

  if (currentUser?.role === 'admin') {
    return true;
  }

  return router.createUrlTree(['/shop']);
};
