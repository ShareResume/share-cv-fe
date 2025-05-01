import { inject, Injectable, signal, NgZone, OnDestroy } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, tap, Subject, takeUntil, timer, Subscription } from 'rxjs';
import { AuthResponse, RegisterData } from '../models/user.model';
import { Router } from '@angular/router';
import { PATH } from '../constants/path.constants';
import { TOKEN_KEY } from '../constants/user.constants';
import { UserRoleEnum } from '../enums/user-role.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  public PATH = '';
  private readonly apiService: ApiService = inject(ApiService);
  private readonly router: Router = inject(Router);
  private readonly ngZone: NgZone = inject(NgZone);
  private isAuthenticatedSignal = signal<boolean>(this.hasValidToken());
  private userRoleSignal = signal<UserRoleEnum | null>(this.getUserRole());
  private redirectUrlSignal = signal<string | null>(null);
  private destroy$ = new Subject<void>();
  private tokenRefreshSubscription?: Subscription;
  
  // Buffer time (in ms) before token expiration when we should refresh
  private readonly REFRESH_BUFFER = 60000; // 1 minute

  constructor() {
    // Initialize authentication state based on token presence
    this.setAuthenticated(this.hasValidToken());
    
    // Setup token refresh timer if token exists
    if (this.isAuthenticated) {
      this.setupTokenRefreshTimer();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.clearTokenRefreshTimer();
  }

  private hasValidToken(): boolean {
    return !!this.apiService.getAccessToken()?.accessToken;
  }
  
  private getUserRole(): UserRoleEnum | null {
    const authResponse = this.apiService.getAccessToken();
    return authResponse?.role || null;
  }

  get isAuthenticated() {
    return this.isAuthenticatedSignal();
  }
  
  get userRole(): UserRoleEnum | null {
    return this.userRoleSignal();
  }
  
  get isAdmin(): boolean {
    return this.userRoleSignal() === UserRoleEnum.ADMIN;
  }

  setAuthenticated(value: boolean): void {
    this.isAuthenticatedSignal.set(value);
    
    if (value) {
      this.setupTokenRefreshTimer();
      this.userRoleSignal.set(this.getUserRole());
    } else {
      this.clearTokenRefreshTimer();
      this.userRoleSignal.set(null);
    }
  }

  get redirectUrl(): string | null {
    return this.redirectUrlSignal();
  }

  setRedirectUrl(url: string | null): void {
    this.redirectUrlSignal.set(url);
  }

  private getTokenExpirationTime(): number | null {
    const token = this.apiService.getAccessToken()?.accessToken;
    if (!token) return null;
    
    try {
      // Extract and parse the token payload (middle part of JWT)
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.exp) return null;
      
      // Return expiration timestamp in milliseconds
      return payload.exp * 1000;
    } catch (e) {
      console.error('Error parsing token:', e);
      return null;
    }
  }

  private setupTokenRefreshTimer(): void {
    this.clearTokenRefreshTimer();
    
    const expTime = this.getTokenExpirationTime();
    if (!expTime) return;
    
    const timeToRefresh = expTime - Date.now() - this.REFRESH_BUFFER;
    
    if (timeToRefresh <= 0) {
      // Token is already expired or about to expire, refresh immediately
      this.refreshToken();
      return;
    }
    
    // Schedule token refresh
    this.ngZone.runOutsideAngular(() => {
      this.tokenRefreshSubscription = timer(timeToRefresh)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.ngZone.run(() => this.refreshToken());
        });
    });
  }

  private clearTokenRefreshTimer(): void {
    if (this.tokenRefreshSubscription) {
      this.tokenRefreshSubscription.unsubscribe();
      this.tokenRefreshSubscription = undefined;
    }
  }

  private refreshToken(): void {
    this.apiService.refreshAccessToken()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.apiService.updateAccessToken(response.accessToken, response.role);
          this.userRoleSignal.set(response.role);
          this.setupTokenRefreshTimer(); // Set up the next refresh timer
        },
        error: () => {
          // If refresh fails, logout the user
          this.logout();
        }
      });
  }

  public register(data: RegisterData): Observable<AuthResponse> {
    localStorage.removeItem(TOKEN_KEY);
    return this.apiService
      .post<RegisterData, AuthResponse>(`${this.PATH}/users`, data)
      .pipe(
        tap((response) => {
          this.apiService.setAccessToken(response);
          this.userRoleSignal.set(response.role);
        })
      );
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
          this.userRoleSignal.set(response.role);
          this.setAuthenticated(true);
          // Removed navigation logic to prevent conflicts with AuthComponent
        })
      );
  }

  public logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.router.navigate([PATH.LOGIN]);
    this.setAuthenticated(false);
    this.userRoleSignal.set(null);
    this.setRedirectUrl(null);
    this.clearTokenRefreshTimer();
  }

  public resetPassword(email: string): Observable<void> {
    return this.apiService.post<{ email: string }, void>(`${this.PATH}/reset`, { email });
  }

  public getAccessToken(): string {
    return this.apiService.getAccessToken()?.accessToken || '';
  }
}
