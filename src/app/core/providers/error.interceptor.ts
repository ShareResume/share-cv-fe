import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToasterService } from '../services/toaster.service';
import { httpDefaultErrorMessage } from '../constants/error.constants';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toasterService = inject(ToasterService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError(error => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          authService.logout();
        }

        toasterService.showError(
          error.error.detail || error.message || httpDefaultErrorMessage,
        );
      } else {
        console.log(httpDefaultErrorMessage);
      }

      return throwError(() => new Error(error));
    }),
  );
};
