import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Give a moment for auth to load from localStorage
  if (typeof window !== 'undefined') {
    // We're in the browser
    const isAuthenticated = authService.isAuthenticated();

    if (isAuthenticated) {
      return true;
    }

    // Not authenticated - redirect to login
    router.navigate(['/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }

  // SSR - allow through (client will check)
  return true;
};
