import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { catchError, switchMap, retry, delay } from 'rxjs/operators';
import { from, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

/**
 * Functional HTTP Interceptor that automatically adds authentication tokens to requests
 * Only applies to requests to the API backend, not to Supabase or external APIs
 */
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  
  // Only add auth header for requests to our API backend
  const isApiRequest = req.url.startsWith(environment.apiUrl);
  
  if (isApiRequest && authService.isAuthenticated()) {
    // Get token synchronously to avoid async issues that cause loops
    const token = authService.getAccessToken();
    if (token) {
      // Clone the request and add the authorization header
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next(authReq);
    }
  }
  
  // Pass the request unchanged if no auth is needed
  return next(req);
};

/**
 * Error interceptor to handle 401 unauthorized responses
 * Automatically logs out users when their tokens are invalid
 */
export const authErrorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  
  return next(req).pipe(
    // Handle authentication errors
    catchError((error) => {
      // Only handle auth errors for API requests
      const isApiRequest = req.url.startsWith(environment.apiUrl);
      
      if (error.status === 401 && isApiRequest && authService.isAuthenticated()) {
        console.warn('❌ Authentication token is invalid, logging out user');
        authService.logout();
      }
      
      // Re-throw the error for components to handle
      throw error;
    })
  );
};

