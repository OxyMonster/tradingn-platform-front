// src/app/core/interceptors/error.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, EMPTY } from 'rxjs';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: any) => {
      // Silently ignore AbortError - it's expected when requests are cancelled
      if (
        error.status === 0 ||
        error.name === 'AbortError' ||
        error.error?.name === 'AbortError' ||
        error.message?.includes('AbortError') ||
        error.statusText === 'Unknown Error' ||
        (error.error instanceof DOMException && error.error.name === 'AbortError')
      ) {
        return EMPTY; // Silently complete the observable
      }

      let errorMessage = 'An error occurred';

      if (error.error instanceof Error) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

        // Handle specific HTTP error codes
        switch (error.status) {
          case 0:
            // This shouldn't happen now as we catch it above, but keep as fallback
            return EMPTY;
          case 400:
            errorMessage = error.error?.error || 'Bad request';
            break;
          case 401:
            errorMessage = 'Unauthorized. Please login.';
            // Optionally redirect to login
            // router.navigate(['/login']);
            break;
          case 403:
            errorMessage = 'Forbidden. You do not have permission.';
            break;
          case 404:
            errorMessage = 'Resource not found';
            break;
          case 500:
            errorMessage = 'Internal server error. Please try again later.';
            break;
          default:
            if (error.error?.error) {
              errorMessage = error.error.error;
            } else if (error.error?.message) {
              errorMessage = error.error.message;
            }
        }
      }

      console.error('HTTP Error:', errorMessage, error);

      return throwError(() => ({
        error: errorMessage,
        status: error.status,
        originalError: error,
      }));
    })
  );
};
