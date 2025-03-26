import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { PATH } from '../constants/path.constants';

export const authGuard: CanActivateFn = route => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const accessToken = authService.getAccessToken();

  if (route.url.some(segment => segment.path === PATH.LOGIN) && accessToken) {
    router.navigate(['/']);

    return false;
  } else if (accessToken) {
    return true;
  }

  router.navigate([PATH.LOGIN]);

  return false;
};
