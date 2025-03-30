import { inject, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, tap } from 'rxjs';
import { AuthResponse, RegisterData } from '../models/user.model';
import { Router } from '@angular/router';
import { PATH } from '../constants/path.constants';
import { TOKEN_KEY } from '../constants/user.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public PATH = '/auth';
  private readonly apiService: ApiService = inject(ApiService);
  private readonly router: Router = inject(Router);
  private isAuthenticatedSignal = signal<boolean>(false);
  private redirectUrlSignal = signal<string | null>(null);

  get isAuthenticated() {
    return this.isAuthenticatedSignal();
  }

  setAuthenticated(value: boolean): void {
    this.isAuthenticatedSignal.set(value);
  }

  get redirectUrl(): string | null {
    return this.redirectUrlSignal();
  }

  setRedirectUrl(url: string | null): void {
    this.redirectUrlSignal.set(url);
  }

  public register(data: RegisterData): Observable<AuthResponse> {
    return this.apiService
      .post<RegisterData, AuthResponse>(`${this.PATH}/register`, data)
      .pipe(tap(this.apiService.setAccessToken.bind(this)));
  }

  public login(username: string, password: string): Observable<AuthResponse> {
    return this.apiService
      .post<
        {
          username: string;
          password: string;
        },
        AuthResponse
      >(`${this.PATH}/login`, {
        username,
        password,
      })
      .pipe(tap(this.apiService.setAccessToken.bind(this)));
  }

  public logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.router.navigate([PATH.LOGIN]);
    this.setAuthenticated(false);
    this.setRedirectUrl(null);
  }

  public resetPassword(email: string): Observable<void> {
    return this.apiService.post<{ email: string }, void>(`${this.PATH}/reset`, { email });
  }

  public getAccessToken(): string {
    return this.apiService.getAccessToken()?.accessToken || '';
  }
}
