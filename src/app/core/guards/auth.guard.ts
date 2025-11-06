import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);
  const router = inject(Router);

  // Give a moment for auth to load from localStorage
  if (typeof window !== 'undefined') {
    // We're in the browser
    const isAuthenticated = authService.isAuthenticated();

    if (isAuthenticated) {
      // Validate data integrity to prevent localStorage tampering
      if (!tokenService.validateUserDataIntegrity()) {
        console.error('Authentication failed: Data integrity check failed');
        router.navigate(['/login'], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      }
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
