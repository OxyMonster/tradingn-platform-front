import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user';
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // Access Token
  getAccessToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  setAccessToken(token: string): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  removeAccessToken(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
  }

  // Refresh Token
  getRefreshToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  setRefreshToken(token: string): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  removeRefreshToken(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  // User Data
  getUser(): any | null {
    if (!this.isBrowser) return null;
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  setUser(user: any): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  removeUser(): void {
    if (!this.isBrowser) return;
    localStorage.removeItem(this.USER_KEY);
  }

  // Clear all
  clearTokens(): void {
    if (!this.isBrowser) return;
    this.removeAccessToken();
    this.removeRefreshToken();
    this.removeUser();
  }

  // Check if access token is expired (basic check)
  isTokenExpired(token: string): boolean {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expiry;
    } catch (e) {
      return true;
    }
  }

  /**
   * Validate token structure and format
   * Returns true if token appears to be a valid JWT format
   */
  isValidTokenFormat(token: string): boolean {
    if (!token) return false;

    try {
      // JWT should have 3 parts separated by dots
      const parts = token.split('.');
      if (parts.length !== 3) {
        return false;
      }

      // Try to decode the payload
      const payload = JSON.parse(atob(parts[1]));

      // Check for required JWT fields
      if (!payload.exp || !payload.user_id) {
        return false;
      }

      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Extract user role from token payload
   * Returns null if token is invalid or role not found
   */
  getRoleFromToken(token: string): string | null {
    if (!token || !this.isValidTokenFormat(token)) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Validate that localStorage data matches token data
   * This helps detect tampering
   */
  validateUserDataIntegrity(): boolean {
    const token = this.getAccessToken();
    const user = this.getUser();

    if (!token || !user) {
      return false;
    }

    const tokenRole = this.getRoleFromToken(token);

    // If token role doesn't match stored user role, data is tampered
    if (tokenRole && tokenRole !== user.role) {
      console.error('Security violation: User role mismatch between token and localStorage');
      this.clearTokens();
      return false;
    }

    return true;
  }
}
