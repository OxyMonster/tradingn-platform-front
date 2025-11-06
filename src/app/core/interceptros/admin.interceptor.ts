import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';
import { environment } from '../../../environment.development';

/**
 * Admin interceptor - ensures all admin API requests have valid auth
 * Excludes profile routes since they're accessible to all authenticated users
 */
export const adminInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // Skip external API calls (Binance, etc.)
  const isExternalAPI = req.url.startsWith('http://') || req.url.startsWith('https://');
  const isOwnAPI = req.url.includes(environment.apiUrl) || req.url.startsWith('/api/');

  // Only check our own API calls
  if (isExternalAPI && !isOwnAPI) {
    return next(req);
  }

  // Check if this is an admin-related request
  const isAdminRequest = req.url.includes('/admin/');

  // Profile routes should NOT be restricted to admin only
  const isProfileRequest = req.url.includes('/profile/');

  // Only apply strict checks for admin requests that aren't profile requests
  if (isAdminRequest && !isProfileRequest) {
    const accessToken = tokenService.getAccessToken();
    const user = tokenService.getUser();

    // Validate token exists and user has staff role
    if (!accessToken || !user) {
      console.error('Admin access denied: No valid authentication');
      router.navigate(['/admin-login']);
      return throwError(() => new Error('Authentication required for admin access'));
    }

    // Validate data integrity to prevent localStorage tampering
    if (!tokenService.validateUserDataIntegrity()) {
      console.error('Admin access denied: Data integrity check failed');
      tokenService.clearTokens();
      router.navigate(['/admin-login']);
      return throwError(() => new Error('Invalid authentication data'));
    }

    // Verify user has appropriate role for admin access
    const allowedRoles = ['admin', 'worker', 'support'];
    if (!allowedRoles.includes(user.role)) {
      console.error(`Admin access denied: User role '${user.role}' not authorized`);
      router.navigate(['/login']);
      return throwError(() => new Error('Insufficient permissions for admin access'));
    }

    // Check if token is expired
    if (tokenService.isTokenExpired(accessToken)) {
      console.error('Admin access denied: Token expired');
      tokenService.clearTokens();
      router.navigate(['/admin-login']);
      return throwError(() => new Error('Session expired'));
    }

    // Validate token format
    if (!tokenService.isValidTokenFormat(accessToken)) {
      console.error('Admin access denied: Invalid token format');
      tokenService.clearTokens();
      router.navigate(['/admin-login']);
      return throwError(() => new Error('Invalid token format'));
    }
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Additional handling for admin-specific errors
      if (isAdminRequest && !isProfileRequest) {
        if (error.status === 403) {
          console.error('Admin access forbidden:', error.message);
          router.navigate(['/login']);
        } else if (error.status === 401) {
          console.error('Admin authentication failed:', error.message);
          tokenService.clearTokens();
          router.navigate(['/admin-login']);
        }
      }
      return throwError(() => error);
    })
  );
};
