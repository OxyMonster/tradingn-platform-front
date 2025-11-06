import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take, Observable } from 'rxjs';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environment.development';

let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  const router = inject(Router);

  // Skip external API calls (Binance, etc.)
  const isExternalAPI = req.url.startsWith('http://') || req.url.startsWith('https://');
  const isOwnAPI = req.url.includes(environment.apiUrl) || req.url.startsWith('/api/');

  // Only add auth to our own API calls
  if (isExternalAPI && !isOwnAPI) {
    return next(req);
  }

  // Skip adding token for these endpoints
  const skipAuth = ['/login/', '/register/', '/token/refresh/'].some((url) =>
    req.url.includes(url)
  );

  if (skipAuth) {
    return next(req);
  }

  // Get access token
  const accessToken = tokenService.getAccessToken();

  // Clone request and add authorization header
  if (accessToken) {
    req = addAuthHeader(req, accessToken);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // If 401 Unauthorized and not already refreshing
      if (error.status === 401 && !req.url.includes('/token/refresh/')) {
        return handle401Error(req, next, tokenService, authService, router);
      }

      return throwError(() => error);
    })
  );
};

function addAuthHeader(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

function handle401Error(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  tokenService: TokenService,
  authService: AuthService,
  router: Router
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    const refreshToken = tokenService.getRefreshToken();

    if (refreshToken) {
      return authService.refreshToken().pipe(
        switchMap(() => {
          isRefreshing = false;
          const newAccessToken = tokenService.getAccessToken();
          refreshTokenSubject.next(newAccessToken);

          // Retry the failed request with new token
          return next(addAuthHeader(request, newAccessToken!));
        }),
        catchError((error) => {
          isRefreshing = false;
          // Refresh failed - logout user
          tokenService.clearTokens();
          router.navigate(['/login']);
          return throwError(() => error);
        })
      );
    } else {
      isRefreshing = false;
      tokenService.clearTokens();
      router.navigate(['/login']);
      return throwError(() => new Error('No refresh token available'));
    }
  } else {
    // Wait for token refresh to complete
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => {
        return next(addAuthHeader(request, token!));
      })
    );
  }
}
