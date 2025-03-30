import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PopupService } from '../services/popup.service';

export const popupGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const popupService = inject(PopupService);

  if (authService.isAuthenticated) {
    return true;
  }

  // Show login popup and wait for result
  await popupService.showLoginPopup(state.url);
  
  // Always return false because we either redirect to login or back to home
  return false;
}; 