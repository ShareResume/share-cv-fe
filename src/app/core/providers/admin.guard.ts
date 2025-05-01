import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { PATH } from '../constants/path.constants';
import { UserRoleEnum } from '../enums/user-role.enum';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const accessToken = authService.getAccessToken();
  
  if (!accessToken) {
    // Store the attempted URL for redirecting after login
    authService.setRedirectUrl(state.url);
    router.navigate([PATH.LOGIN]);
    return false;
  }
  
  // Check if the user is authenticated and has the ADMIN role
  if (authService.isAuthenticated && authService.userRole === UserRoleEnum.ADMIN) {
    return true;
  }
  
  // If the user is authenticated but not an admin, redirect to home page
  router.navigate(['/']);
  return false;
}; 