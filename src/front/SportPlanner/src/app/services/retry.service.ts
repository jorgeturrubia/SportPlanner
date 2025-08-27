import { Injectable, inject } from '@angular/core';
import { Observable, throwError, timer, retryWhen, mergeMap, tap, finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from './notification.service';
import { LoadingService } from './loading.service';

export interface RetryConfig {
  maxRetries?: number;
  delayMs?: number;
  exponentialBackoff?: boolean;
  showNotifications?: boolean;
  context?: string;
  retryCondition?: (error: any) => boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RetryService {
  private notificationService = inject(NotificationService);
  private loadingService = inject(LoadingService);

  /**
   * Add retry logic to an observable with configurable options
   */
  withRetry<T>(
    source: Observable<T>,
    config: RetryConfig = {}
  ): Observable<T> {
    const {
      maxRetries = 3,
      delayMs = 1000,
      exponentialBackoff = true,
      showNotifications = true,
      context = 'operación',
      retryCondition = this.defaultRetryCondition
    } = config;

    return source.pipe(
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error: any, index) => {
            const retryAttempt = index + 1;
            
            // Check if we should retry this error
            if (!retryCondition(error)) {
              if (showNotifications) {
                this.showFinalErrorNotification(error, context);
              }
              return throwError(() => error);
            }
            
            // Max retries reached
            if (retryAttempt > maxRetries) {
              if (showNotifications) {
                this.showMaxRetriesNotification(context, maxRetries);
              }
              return throwError(() => error);
            }
            
            // Show retry notification
            if (showNotifications && retryAttempt > 1) {
              this.showRetryNotification(context, retryAttempt, maxRetries);
            }
            
            // Calculate delay (with exponential backoff if enabled)
            const delay = exponentialBackoff 
              ? delayMs * Math.pow(2, retryAttempt - 1)
              : delayMs;
            
            return timer(delay);
          })
        )
      )
    );
  }

  /**
   * Retry a function that returns an observable
   */
  retryOperation<T>(
    operation: () => Observable<T>,
    config: RetryConfig = {}
  ): Observable<T> {
    return this.withRetry(operation(), config);
  }

  /**
   * Retry with loading indicator
   */
  retryWithLoading<T>(
    operation: () => Observable<T>,
    config: RetryConfig = {}
  ): Observable<T> {
    this.loadingService.show();
    
    return this.withRetry(operation(), config).pipe(
      finalize(() => this.loadingService.hide())
    );
  }

  /**
   * Default retry condition - retry for network errors and server errors
   */
  private defaultRetryCondition(error: any): boolean {
    if (error instanceof HttpErrorResponse) {
      // Retry for network errors (0), timeouts (408), rate limits (429), and server errors (5xx)
      return [0, 408, 429].includes(error.status) || 
             (error.status >= 500 && error.status < 600);
    }
    
    // Retry for network-related JavaScript errors
    if (error instanceof Error) {
      const networkErrorMessages = [
        'fetch',
        'network',
        'timeout',
        'connection'
      ];
      
      return networkErrorMessages.some(msg => 
        error.message?.toLowerCase().includes(msg)
      );
    }
    
    return false;
  }

  private showRetryNotification(context: string, attempt: number, maxRetries: number): void {
    this.notificationService.showInfo(
      'Reintentando...',
      `Reintentando ${context} (${attempt}/${maxRetries})`
    );
  }

  private showMaxRetriesNotification(context: string, maxRetries: number): void {
    this.notificationService.showError(
      'Operación fallida',
      `No se pudo completar la ${context} después de ${maxRetries} intentos. Verifica tu conexión e intenta nuevamente.`
    );
  }

  private showFinalErrorNotification(error: any, context: string): void {
    let message = `No se pudo completar la ${context}.`;
    
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 401:
          message = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
          break;
        case 403:
          message = 'No tienes permisos para realizar esta acción.';
          break;
        case 404:
          message = 'El recurso solicitado no fue encontrado.';
          break;
        default:
          message = error.error?.message || message;
      }
    }
    
    this.notificationService.showError('Error', message);
  }
}