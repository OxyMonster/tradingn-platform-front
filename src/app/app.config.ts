import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { AuthService } from './core/services/auth.service';
import { authInterceptor } from './core/interceptros/auth.interceptor';
import { errorInterceptor } from './core/interceptros/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor])
    ),
    // Add APP_INITIALIZER to load auth before rendering
    {
      provide: APP_INITIALIZER,
      useFactory: (authService: AuthService) => () => {
        // Constructor already loads from localStorage
        return Promise.resolve();
      },
      deps: [AuthService],
      multi: true
    }
  ]
};