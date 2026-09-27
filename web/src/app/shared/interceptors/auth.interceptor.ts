import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { CurrentUserService } from '../services/current-user.service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const token = localStorage.getItem('tull_coffee_token');

  if (token && !req.url.includes('/auth/login')) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next(cloned);
  }

  return next(req);
};
