import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { AuthService } from './core/services/auth.service';
import { authInterceptor } from './core/interceptros/auth.interceptor';
import { adminInterceptor } from './core/interceptros/admin.interceptor';
import { errorInterceptor } from './core/interceptros/error.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideLottieOptions } from 'ngx-lottie';
import { GlobalErrorHandler } from './core/handlers/global-error.handler';

// Suppress unhandled AbortError promise rejections at window level
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    if (
      reason?.name === 'AbortError' ||
      reason?.message?.includes('AbortError') ||
      reason?.message?.includes('aborted') ||
      reason?.toString?.()?.includes('AbortError') ||
      (reason instanceof DOMException && reason.name === 'AbortError')
    ) {
      event.preventDefault(); // Prevent the error from being logged
      return;
    }
  });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, adminInterceptor, errorInterceptor])),
    provideLottieOptions({ player: () => import('lottie-web') }),
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (authService: AuthService) => () => Promise.resolve(),
      deps: [AuthService],
      multi: true,
    },
  ],
};
