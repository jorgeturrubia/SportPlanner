import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { catchError, switchMap, tap } from 'rxjs/operators';
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
  
  console.log('📡 Auth Interceptor called for URL:', req.url);
  console.log('  🔍 Is API request:', isApiRequest);
  console.log('  🔒 Is authenticated:', authService.isAuthenticated());
  
  if (isApiRequest && authService.isAuthenticated()) {
    // Try to get token synchronously first for performance
    const syncToken = authService.getAccessToken();
    console.log('  🔑 Sync token:', syncToken ? 'Available (length: ' + syncToken.length + ')' : 'Missing');
    
    if (syncToken) {
      console.log('  ✅ Adding auth header with sync token');
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${syncToken}`)
      });
      return next(authReq);
    } else {
      console.log('  ⏳ No sync token, trying async');
      // No sync token, try async token retrieval
      return from(authService.getAccessTokenAsync()).pipe(
        tap(asyncToken => console.log('  🔑 Async token:', asyncToken ? 'Retrieved (length: ' + asyncToken.length + ')' : 'Failed')),
        switchMap(token => {
          if (token) {
            console.log('  ✅ Adding auth header with async token');
            const authReq = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${token}`)
            });
            return next(authReq);
          } else {
            console.log('  ⚠️ No token available after async attempt');
            // No valid token available - this indicates auth state inconsistency
            console.warn('⚠️ Auth service says authenticated but no token available');
            // Proceed without auth header - the 401 response will trigger proper logout
            return next(req);
          }
        }),
        catchError(error => {
          console.warn('❌ Token refresh failed in interceptor:', error);
          // If token refresh fails, proceed without token
          // The 401 response will be handled by the error interceptor
          return next(req);
        })
      );
    }
  }
  
  console.log('  ℹ️ No auth needed - passing request unchanged');
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
        // Check if we actually sent an Authorization header
        const hasAuthHeader = req.headers.has('Authorization');
        
        if (hasAuthHeader) {
          // We sent an auth token but got 401 - token is invalid
          console.warn('❌ Authentication token was rejected by server, logging out user');
          
          // Use setTimeout to prevent potential HTTP loops and allow current request to complete
          setTimeout(() => {
            authService.logout();
          }, 100);
        } else {
          // We didn't send a token but are authenticated - likely a temporary issue
          console.warn('⚠️ Got 401 but no auth header was sent - possible race condition');
          // Don't log out - this might be due to race condition during initialization
        }
      }
      
      // Re-throw the error for components to handle
      return throwError(() => error);
    })
  );
};

