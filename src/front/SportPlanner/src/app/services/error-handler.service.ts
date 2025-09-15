import { Injectable, ErrorHandler } from '@angular/core';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {
  constructor(private notificationService: NotificationService) {}

  handleError(error: any): void {
    // Handle NavigatorLockAcquireTimeoutError specifically
    if (error?.name === 'NavigatorLockAcquireTimeoutError' ||
        error?.message?.includes('NavigatorLockAcquireTimeoutError') ||
        error?.rejection?.name === 'NavigatorLockAcquireTimeoutError') {
      
      console.warn('⚠️ NavigatorLockAcquireTimeoutError handled globally:', {
        name: error?.name,
        message: error?.message,
        stack: error?.stack?.substring(0, 200) + '...'
      });
      
      // Don't show this error to users as it's a known Supabase issue
      // that doesn't affect the actual functionality
      return;
    }

    // Handle other unhandled promise rejections related to Supabase
    if (error?.rejection?.message?.includes('supabase') ||
        error?.message?.includes('supabase')) {
      console.warn('⚠️ Supabase-related error handled globally:', error);
      
      // Show a generic connection error message
      this.notificationService.showWarning('Problema temporal de conexión. La aplicación sigue funcionando normalmente.');
      return;
    }

    // Handle zone.js unhandled promise rejections
    if (error?.rejection && typeof error.rejection === 'object') {
      const rejection = error.rejection;
      
      if (rejection.name === 'NavigatorLockAcquireTimeoutError') {
        console.warn('⚠️ Zone.js NavigatorLockAcquireTimeoutError handled:', rejection);
        return;
      }
    }

    // Log other errors normally
    console.error('🔥 Global error handler:', error);
    
    // Only show critical errors to users
    if (error?.message && !error.message.includes('NavigatorLock')) {
      this.notificationService.showError('Ha ocurrido un error inesperado. Por favor, recarga la página si el problema persiste.');
    }
  }
}