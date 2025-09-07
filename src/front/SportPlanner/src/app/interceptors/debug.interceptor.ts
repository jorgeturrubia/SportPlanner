import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpResponse, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

/**
 * DEBUG INTERCEPTOR
 * Enhanced diagnostics for authentication issues
 */
export const debugInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const isApiRequest = req.url.startsWith(environment.apiUrl);
  
  // Only log API requests to reduce noise
  if (isApiRequest) {
    const token = authService.getAccessToken();
    const hasAuthHeader = req.headers.has('Authorization');
    const authHeaderValue = req.headers.get('Authorization');
    
    console.log('🔍 AUTH DEBUG:');
    console.log('  📡 Request:', req.method, req.url.replace(environment.apiUrl, ''));
    console.log('  🔒 Auth State:', authService.isAuthenticated());
    console.log('  👤 User:', authService.currentUser()?.email || 'None');
    console.log('  🎟️ Token Available:', !!token);
    console.log('  📋 Auth Header:', hasAuthHeader ? 'Present' : 'Missing');
    
    if (token && hasAuthHeader) {
      // Verify token matches what we sent
      const expectedHeader = `Bearer ${token}`;
      const headerMatches = authHeaderValue === expectedHeader;
      console.log('  🔄 Token Match:', headerMatches);
      
      if (!headerMatches) {
        console.warn('  ⚠️ Header/Token mismatch!');
        console.warn('    Expected:', expectedHeader.substring(0, 50) + '...');
        console.warn('    Actual:', authHeaderValue?.substring(0, 50) + '...');
      }
    }
  }
  
  return next(req).pipe(
    tap({
      next: (event: HttpEvent<unknown>) => {
        if (event.type === 4 && isApiRequest) { // HttpResponse
          const response = event as HttpResponse<unknown>;
          console.log('  ✅ Response:', response.status, response.statusText);
        }
      },
      error: (error: HttpErrorResponse) => {
        if (isApiRequest) {
          console.log('  ❌ Error:', error.status, error.statusText || 'Unknown');
          
          if (error.status === 401) {
            console.log('  🚨 401 UNAUTHORIZED');
            console.log('    - Request had auth header:', req.headers.has('Authorization'));
            console.log('    - Auth service state:', authService.isAuthenticated());
            console.log('    - Token available:', !!authService.getAccessToken());
          } else if (error.status === 0) {
            console.log('  🔌 Network Error - Backend may be unreachable');
          }
        }
      }
    })
  );
};