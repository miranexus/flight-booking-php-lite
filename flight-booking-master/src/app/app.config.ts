import Aura from '@primeng/themes/aura';
import { routes } from './app.routes';
import { SignalsStore } from './store';
import { provideStore } from '@ngrx/store';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { providePrimeNG } from 'primeng/config';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    SignalsStore,
    provideStore(),
    provideEffects(),
    provideRouter(routes),
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura
      }
    })
  ]
};
