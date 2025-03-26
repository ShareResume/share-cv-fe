import { TestBed } from '@angular/core/testing';
import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
  HttpSentEvent,
  provideHttpClient,
} from '@angular/common/http';

import { errorInterceptor } from './error.interceptor';
import { ToasterService } from '../services/toaster.service';
import { catchError, EMPTY, of, switchMap, throwError } from 'rxjs';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('errorInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => errorInterceptor(req, next));

  let toasterService: ToasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideAnimationsAsync(), provideHttpClient()],
    });
    toasterService = TestBed.inject(ToasterService);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should throw error', () => {
    jest.spyOn(toasterService, 'showError');

    const error = new HttpErrorResponse({
      status: 400,
      error: {},
    });

    interceptor(new HttpRequest('GET', '', {}), () =>
      of(1).pipe(switchMap(() => throwError(error))),
    )
      .pipe(catchError(() => EMPTY))
      .subscribe();

    expect(toasterService.showError).toHaveBeenCalled();
  });

  it('should not throw error', () => {
    jest.spyOn(toasterService, 'showError');
    interceptor(new HttpRequest('GET', '', {}), () => of({} as HttpSentEvent));
    expect(toasterService.showError).not.toHaveBeenCalled();
  });
});
