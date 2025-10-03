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
}
