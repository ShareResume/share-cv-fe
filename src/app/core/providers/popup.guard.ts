import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PopupService } from '../services/popup.service';
import { firstValueFrom, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

/**
 * Guard that shows a login popup for unauthenticated users
 * and redirects them to the login page if they choose to login
 */
export const popupGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const popupService = inject(PopupService);
  const accessToken = authService.getAccessToken();

  // If the user is already authenticated, allow access
  if (accessToken) {
    return true;
  }

  // Store the attempted URL for redirecting after login
  authService.setRedirectUrl(state.url);
  
  popupService.showLoginPopup(state.url);
  
  // Always return false because we either redirect to login or back to home
  return false;
}; 