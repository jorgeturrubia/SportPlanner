import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer, retryWhen, mergeMap, finalize } from 'rxjs';
import { ErrorHandlerService } from '../services/error-handler.service';
import { NotificationService } from '../services/notification.service';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private errorHandler = inject(ErrorHandlerService);
  private notificationService = inject(NotificationService);
  private loadingService = inject(LoadingService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error: HttpErrorResponse, index) => {
            const retryAttempt = index + 1;
            const maxRetries = this.getMaxRetries(error);
            
            // Don't retry for certain error types
            if (!this.shouldRetry(error) || retryAttempt > maxRetries) {
              return throwError(() => error);
            }
            
            // Show retry notification for user-facing requests
            if (retryAttempt > 1 && !this.isBackgroundRequest(req)) {
              this.notificationService.showInfo(
                'Reintentando...',
                `Reintentando operación (${retryAttempt}/${maxRetries})`
              );
            }
            
            // Exponential backoff delay
            const delay = 1000 * Math.pow(2, retryAttempt - 1);
            return timer(delay);
          })
        )
      ),
      finalize(() => {
        // Handle any cleanup if needed
        if (!this.isBackgroundRequest(req)) {
          this.loadingService.hide();
        }
      })
    );
  }

  private shouldRetry(error: HttpErrorResponse): boolean {
    // Retry for network errors (0), timeouts (408), rate limits (429), and server errors (5xx)
    return [0, 408, 429].includes(error.status) || 
           (error.status >= 500 && error.status < 600);
  }

  private getMaxRetries(error: HttpErrorResponse): number {
    // Different retry strategies based on error type
    switch (error.status) {
      case 0: // Network error
        return 3;
      case 408: // Timeout
        return 2;
      case 429: // Rate limit
        return 1;
      case 500:
      case 502:
      case 503:
      case 504:
        return 2;
      default:
        return 1;
    }
  }

  private isBackgroundRequest(req: HttpRequest<any>): boolean {
    return req.headers.has('X-Background-Request') ||
           req.url.includes('/api/auth/validate') ||
           req.url.includes('/api/auth/refresh');
  }
}