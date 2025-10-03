import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError, Observable } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        if (error.status === 0) {
          errorMessage = 'Unable to connect to server. Please check your internet connection.';
        } else if (error.status === 400) {
          // Handle Django validation errors
          if (error.error && typeof error.error === 'object') {
            // Extract first error message from Django response
            const firstKey = Object.keys(error.error)[0];
            if (firstKey && Array.isArray(error.error[firstKey])) {
              errorMessage = error.error[firstKey][0];
            } else if (error.error.error) {
              errorMessage = error.error.error;
            } else if (error.error.message) {
              errorMessage = error.error.message;
            } else {
              errorMessage = 'Bad request';
            }
          }
        } else if (error.status === 401) {
          errorMessage = error.error?.error || 'Unauthorized. Please login again.';
        } else if (error.status === 403) {
          errorMessage = error.error?.error || 'Access denied';
        } else if (error.status === 404) {
          errorMessage = 'Resource not found';
        } else if (error.status === 500) {
          errorMessage = 'Internal server error. Please try again later.';
        } else {
          errorMessage = error.error?.error || error.error?.message || `Error: ${error.status}`;
        }
      }

      console.error('HTTP Error:', error);

      return throwError(() => new Error(errorMessage));
    })
  );
};
