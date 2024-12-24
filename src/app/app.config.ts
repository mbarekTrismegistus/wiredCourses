import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental'

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SocketService } from '../services/socket.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideTanStackQuery(new QueryClient()),
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    ReactiveFormsModule,
    SocketService
  ]
};
