import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

/**
 * Generic role guard factory with backend verification
 * Usage: canActivate: [roleGuard(['admin', 'worker'])]
 */
export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route: ActivatedRouteSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.user();

    if (!user) {
      router.navigate(['/login']);
      return false;
    }

    // First check local role
    if (!allowedRoles.includes(user.role)) {
      console.warn(
        `Access denied. Required roles: ${allowedRoles.join(', ')}, User role: ${user.role}`
      );
      authService.navigateByRole();
      return false;
    }

    // For staff roles (admin, worker, support), verify with backend
    if (['admin', 'worker', 'support'].includes(user.role)) {
      return authService.verifyToken().pipe(
        map((response) => {
          if (response.valid && response.user && allowedRoles.includes(response.user.role)) {
            return true;
          } else {
            console.warn('Token verification failed or role mismatch');
            router.navigate(['/login']);
            return false;
          }
        }),
        catchError(() => {
          console.error('Token verification failed');
          router.navigate(['/login']);
          return of(false);
        })
      );
    }

    return true;
  };
};

/**
 * Pre-configured role guards for convenience
 */
export const adminGuard: CanActivateFn = roleGuard(['admin']);
export const workerGuard: CanActivateFn = roleGuard(['admin', 'worker']);
export const supportGuard: CanActivateFn = roleGuard(['admin', 'support']);
export const adminOrWorkerGuard: CanActivateFn = roleGuard(['admin', 'worker']);
export const adminOrSupportGuard: CanActivateFn = roleGuard(['admin', 'support']);
export const staffGuard: CanActivateFn = roleGuard(['admin', 'worker', 'support']);
