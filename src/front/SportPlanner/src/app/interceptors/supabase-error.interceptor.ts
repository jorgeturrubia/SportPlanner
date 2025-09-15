import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const supabaseErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle NavigatorLockAcquireTimeoutError specifically
      if (error.error?.name === 'NavigatorLockAcquireTimeoutError' ||
          error.message?.includes('NavigatorLockAcquireTimeoutError')) {
        console.warn('⚠️ Navigator lock timeout intercepted, continuing operation');
        
        // Don't show error to user for this specific error
        // as it's a known Supabase issue that doesn't affect functionality
        return throwError(() => new Error('Navigator lock timeout - operation may have succeeded'));
      }

      // Handle other Supabase-related errors
      if (error.error?.message?.includes('supabase')) {
        console.error('Supabase error intercepted:', error);
        notificationService.showError('Error de conexión temporal. Por favor, intenta nuevamente.');
      }

      return throwError(() => error);
    })
  );
};