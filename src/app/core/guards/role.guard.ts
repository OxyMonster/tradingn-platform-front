import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Generic role guard factory
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

    if (allowedRoles.includes(user.role)) {
      return true;
    }

    // User doesn't have required role - redirect to their dashboard
    console.warn(
      `Access denied. Required roles: ${allowedRoles.join(', ')}, User role: ${user.role}`
    );
    authService.navigateByRole();
    return false;
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
