import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  ParamMap,
  RouterStateSnapshot,
} from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { PATH } from '../constants/path.constants';
import { provideHttpClient } from '@angular/common/http';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    TestBed.configureTestingModule({});
    authService = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should guard routes', () => {
    jest
      .spyOn(authService, 'getAccessToken')
      .mockReturnValueOnce('here')
      .mockReturnValueOnce('here')
      .mockReturnValueOnce('');

    const snapshot = new ActivatedRouteSnapshot();

    snapshot.url = [
      {
        path: PATH.LOGIN,
        parameters: {},
        parameterMap: {} as ParamMap,
      },
    ];

    let result = executeGuard(snapshot, {} as RouterStateSnapshot);

    expect(result).not.toBeTruthy();

    snapshot.url = [
      {
        path: '/',
        parameters: {},
        parameterMap: {} as ParamMap,
      },
    ];
    result = executeGuard(snapshot, {} as RouterStateSnapshot);
    expect(result).toBeTruthy();

    snapshot.url = [
      {
        path: '/',
        parameters: {},
        parameterMap: {} as ParamMap,
      },
    ];
    result = executeGuard(snapshot, {} as RouterStateSnapshot);
    expect(result).not.toBeTruthy();
  });
});
