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
  public PATH = '';
  private readonly apiService: ApiService = inject(ApiService);
  private readonly router: Router = inject(Router);
  private isAuthenticatedSignal = signal<boolean>(this.hasValidToken());
  private redirectUrlSignal = signal<string | null>(null);

  constructor() {
    // Initialize authentication state based on token presence
    this.setAuthenticated(this.hasValidToken());
  }

  private hasValidToken(): boolean {
    return !!this.apiService.getAccessToken()?.accessToken;
  }

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
    localStorage.removeItem(TOKEN_KEY);
    return this.apiService
      .post<RegisterData, AuthResponse>(`${this.PATH}/users`, data)
      .pipe(tap(this.apiService.setAccessToken.bind(this)));
  }

  public login(email: string, password: string): Observable<AuthResponse> {
    localStorage.removeItem(TOKEN_KEY);
    return this.apiService
      .post<
        {
          email: string;
          password: string;
        },
        AuthResponse
      >(`${this.PATH}/auth`, {
        email,
        password,
      })
      .pipe(
        tap((response) => {
          this.apiService.setAccessToken(response);
          this.setAuthenticated(true);
        })
      );
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
