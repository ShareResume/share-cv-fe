import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { PATH } from '../constants/path.constants';
import { UserRoleEnum } from '../enums/user-role.enum';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const accessToken = authService.getAccessToken();

  if (route.url.some(segment => segment.path === PATH.LOGIN) && accessToken) {
    // If user is already logged in and trying to access login page
    if (authService.userRole === UserRoleEnum.ADMIN) {
      // Admin users go to admin page
      router.navigate(['/admin']);
    } else {
      // Regular users go to home
      router.navigate(['/']);
    }
    return false;
  } else if (accessToken) {
    return true;
  }

  // Store the attempted URL for redirecting after login
  authService.setRedirectUrl(state.url);
  
  router.navigate([PATH.LOGIN]);

  return false;
};
