/**
 * UPDATED APP CONFIGURATION - HttpClient Provider Setup
 * 
 * Replace the contents of src/app/app.config.ts with this file
 * to ensure HttpClient is properly configured for webhook requests.
 */

import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptorsFromDi()
    )
    // Add additional providers here:
    // - Global HTTP interceptors
    // - Error handling services
    // - Analytics services
  ]
};
