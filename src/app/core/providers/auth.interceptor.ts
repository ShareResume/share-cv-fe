import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { PATH } from '../constants/path.constants';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip interceptor for public routes
  // if (req.url.includes('public')) {
  //   return next(req);
  // }

  // Skip token refresh endpoint to avoid infinite loop
  if (req.url.includes('auth/access-token')) {
    return next(req);
  }

  const authService = inject(AuthService);
  const apiService = inject(ApiService);
  const router = inject(Router);
  const tokenData = apiService.getAccessToken();
  const accessToken = tokenData?.accessToken;

  if (!accessToken) {
    return next(req);
  }

  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // If error is 401 Unauthorized, try to refresh the token
      if (error.status === 401 && !req.url.includes('auth/access-token')) {
        return apiService.refreshAccessToken().pipe(
          switchMap(response => {
            // Update the access token in storage
            apiService.updateAccessToken(response.accessToken);
            
            // Clone the original request with the new token
            const newReq = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${response.accessToken}`)
            });
            
            // Retry the request with the new token
            return next(newReq);
          }),
          catchError(refreshError => {
            // If token refresh fails, logout the user and redirect to login
            authService.logout();
            router.navigate([PATH.LOGIN]);
            return throwError(() => refreshError);
          })
        );
      }
      
      return throwError(() => error);
    })
  );
};
