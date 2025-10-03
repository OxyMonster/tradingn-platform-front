import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { TokenService } from './token.service';
import {
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  AuthTokens,
} from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8000/api/accounts';
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;

  // Use signals for reactive state
  private userSignal = signal<User | null>(null);
  private isAuthenticatedSignal = signal<boolean>(false);

  // Public readonly signals
  user = this.userSignal.asReadonly();
  isAuthenticated = this.isAuthenticatedSignal.asReadonly();

  // Computed values
  userRole = computed(() => this.user()?.role);
  isAdmin = computed(() => this.user()?.role === 'admin');
  isWorker = computed(() => this.user()?.role === 'worker');
  isSupport = computed(() => this.user()?.role === 'support');
  isRegularUser = computed(() => this.user()?.role === 'user');

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    // Only load from storage in browser
    if (this.isBrowser) {
      this.loadUserFromStorage();
    }
  }

  /**
   * Load user from localStorage on app init (browser only)
   */
  private loadUserFromStorage(): void {
    if (!this.isBrowser) return;

    const token = this.tokenService.getAccessToken();
    const user = this.tokenService.getUser();

    if (token && user && !this.tokenService.isTokenExpired(token)) {
      this.userSignal.set(user);
      this.isAuthenticatedSignal.set(true);
    } else {
      this.clearAuth();
    }
  }

  /**
   * Register new user
   */
  register(data: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/register/`, data).pipe(
      tap((response) => {
        if (response.success) {
          this.handleAuthSuccess(response);
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Login user
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login/`, credentials).pipe(
      tap((response) => {
        if (response.success) {
          this.handleAuthSuccess(response);
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Logout user
   */
  logout(): Observable<any> {
    const refreshToken = this.tokenService.getRefreshToken();

    if (!refreshToken) {
      this.clearAuth();
      this.navigateToLogin();
      return throwError(() => new Error('No refresh token'));
    }

    return this.http
      .post(`${this.API_URL}/logout/`, {
        refresh_token: refreshToken,
      })
      .pipe(
        tap(() => {
          this.clearAuth();
          this.navigateToLogin();
        }),
        catchError((error) => {
          this.clearAuth(); // Clear auth even if API call fails
          this.navigateToLogin();
          return throwError(() => error);
        })
      );
  }

  /**
   * Refresh access token
   */
  refreshToken(): Observable<AuthTokens> {
    const refreshToken = this.tokenService.getRefreshToken();

    if (!refreshToken) {
      this.clearAuth();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http
      .post<any>(`${this.API_URL}/token/refresh/`, {
        refresh: refreshToken,
      })
      .pipe(
        tap((response) => {
          this.tokenService.setAccessToken(response.access);
          if (response.refresh) {
            this.tokenService.setRefreshToken(response.refresh);
          }
        }),
        catchError((error) => {
          this.clearAuth();
          return throwError(() => error);
        })
      );
  }

  /**
   * Get current user profile
   */
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/profile/`).pipe(
      tap((user) => {
        this.userSignal.set(user);
        this.tokenService.setUser(user);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Update user profile
   */
  updateProfile(data: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.API_URL}/profile/`, data).pipe(
      tap((user) => {
        this.userSignal.set(user);
        this.tokenService.setUser(user);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Change password
   */
  changePassword(
    oldPassword: string,
    newPassword: string,
    newPasswordConfirm: string
  ): Observable<any> {
    return this.http
      .post(`${this.API_URL}/change-password/`, {
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirm: newPasswordConfirm,
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Handle successful authentication
   */
  private handleAuthSuccess(response: LoginResponse): void {
    if (!this.isBrowser) return;

    this.tokenService.setAccessToken(response.tokens.access);
    this.tokenService.setRefreshToken(response.tokens.refresh);
    this.tokenService.setUser(response.user);
    this.userSignal.set(response.user);
    this.isAuthenticatedSignal.set(true);
  }

  /**
   * Clear authentication state
   */
  private clearAuth(): void {
    this.tokenService.clearTokens();
    this.userSignal.set(null);
    this.isAuthenticatedSignal.set(false);
  }

  /**
   * Navigate to login
   */
  private navigateToLogin(): void {
    if (this.isBrowser) {
      this.router.navigate(['/login']);
    }
  }

  /**
   * Navigate based on user role
   */
  navigateByRole(): void {
    if (!this.isBrowser) return;

    const role = this.user()?.role;

    switch (role) {
      case 'admin':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'worker':
        this.router.navigate(['/worker/dashboard']);
        break;
      case 'support':
        this.router.navigate(['/support/dashboard']);
        break;
      case 'user':
      default:
        this.router.navigate(['/profile/wallet']);
        break;
    }
  }

  /**
   * Error handler
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error?.error) {
      errorMessage = error.error.error;
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return throwError(() => new Error(errorMessage));
  }
}
