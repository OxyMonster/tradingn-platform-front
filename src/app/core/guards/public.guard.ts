import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Public guard - prevents authenticated users from accessing public pages
 * Use on login/register pages
 */
export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If already authenticated, redirect to appropriate dashboard
  if (authService.isAuthenticated()) {
    authService.navigateByRole();
    return false;
  }

  return true;
};
