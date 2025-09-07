import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

/**
 * TEMPORARY DEBUG INTERCEPTOR
 * Para diagnosticar problemas de autenticación
 */
export const debugInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  
  console.log('🔍 DEBUG INTERCEPTOR:');
  console.log('  📡 Request:', req.method, req.url);
  console.log('  🔒 Is Authenticated:', authService.isAuthenticated());
  console.log('  👤 Current User:', authService.currentUser()?.email || 'None');
  console.log('  🎟️ Has Token:', !!authService.getAccessToken());
  console.log('  📋 Headers:', req.headers.get('Authorization') ? 'Bearer Present' : 'No Auth Header');
  
  return next(req).pipe(
    tap({
      next: (response: any) => {
        if (response.type === 4) { // HttpResponse
          console.log('  ✅ Response:', response.status, response.statusText);
        }
      },
      error: (error: any) => {
        console.log('  ❌ Error Response:', error.status, error.statusText);
        console.log('  📄 Error Details:', error);
        
        if (error.status === 401) {
          console.log('  🚨 401 UNAUTHORIZED - Token is invalid or expired');
        }
      }
    })
  );
};