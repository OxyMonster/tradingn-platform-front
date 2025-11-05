import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { AuthService } from './core/services/auth.service';
import { authInterceptor } from './core/interceptros/auth.interceptor';
import { errorInterceptor } from './core/interceptros/error.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideLottieOptions } from 'ngx-lottie';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor])),
    provideLottieOptions({ player: () => import('lottie-web') }),
    {
      provide: APP_INITIALIZER,
      useFactory: (authService: AuthService) => () => Promise.resolve(),
      deps: [AuthService],
      multi: true,
    },
  ],
};
