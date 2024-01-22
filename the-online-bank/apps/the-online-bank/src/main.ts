import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withHashLocation } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import {
  addBearerTokenInterceptor,
  provideAuthenticationInitializer,
} from '@the-online-bank/shared-authentication-data-access-access-management';

import { AppComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routing';

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
    provideAnimations(),
    provideRouter(APP_ROUTES, withHashLocation()),
    provideHttpClient(withInterceptors([addBearerTokenInterceptor])),

    importProvidersFrom(BsDropdownModule.forRoot()),

    provideAuthenticationInitializer(),
  ],
}).catch((err) => console.error(err));
