import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export function initializeAuth() {
  const authService = inject(AuthService);

  return () => {
    // This ensures auth is loaded before app renders
    // The service constructor already loads from localStorage
    return Promise.resolve();
  };
}
