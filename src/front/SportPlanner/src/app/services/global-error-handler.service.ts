import { Injectable, ErrorHandler, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from './notification.service';
import { ErrorHandlerService } from './error-handler.service';

export interface ErrorContext {
  component?: string;
  action?: string;
  userId?: string;
  timestamp?: Date;
  userAgent?: string;
  url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {
  private notificationService = inject(NotificationService);
  private errorHandlerService = inject(ErrorHandlerService);
  private errorCount = 0;
  private readonly maxErrorsPerSession = 10;

  handleError(error: any): void {
    // Prevent error flooding
    this.errorCount++;
    if (this.errorCount > this.maxErrorsPerSession) {
      console.warn('Too many errors in this session. Suppressing further error notifications.');
      return;
    }

    // Create error context
    const context: ErrorContext = {
      timestamp: new Date(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined
    };

    // Log the error for debugging
    this.errorHandlerService.logError(error, 'GLOBAL', context);

    // Handle different types of errors
    if (error instanceof HttpErrorResponse) {
      // HTTP errors are handled by the interceptor, so we don't need to show notifications here
      return;
    }

    // Handle JavaScript errors
    if (error instanceof Error) {
      this.handleJavaScriptError(error, context);
      return;
    }

    // Handle promise rejections
    if (error?.rejection) {
      this.handlePromiseRejection(error.rejection, context);
      return;
    }

    // Handle unknown errors
    this.handleUnknownError(error, context);
  }

  private handleJavaScriptError(error: Error, context: ErrorContext): void {
    console.error('JavaScript Error:', error);
    
    // Don't show notifications for certain types of errors that are expected
    if (this.isExpectedError(error)) {
      return;
    }

    // Categorize error severity
    const severity = this.getErrorSeverity(error);
    
    switch (severity) {
      case 'critical':
        this.handleCriticalError(error, context);
        break;
      case 'high':
        this.handleHighSeverityError(error, context);
        break;
      case 'medium':
        this.handleMediumSeverityError(error, context);
        break;
      case 'low':
        // Log but don't notify user
        break;
    }
  }

  private handlePromiseRejection(rejection: any, context: ErrorContext): void {
    console.error('Unhandled Promise Rejection:', rejection);
    
    // Don't show notifications for HTTP errors (handled elsewhere)
    if (rejection instanceof HttpErrorResponse) {
      return;
    }

    // Handle different types of promise rejections
    if (rejection instanceof Error) {
      this.handleJavaScriptError(rejection, context);
      return;
    }

    this.notificationService.showError(
      'Error de operación',
      'Una operación no pudo completarse correctamente. Intenta nuevamente.'
    );
  }

  private handleUnknownError(error: any, context: ErrorContext): void {
    console.error('Unknown Error:', error);
    
    // Try to extract meaningful information
    let message = 'Ha ocurrido un error inesperado.';
    
    if (typeof error === 'string') {
      message = error;
    } else if (error?.message) {
      message = error.message;
    }
    
    this.notificationService.showError(
      'Error desconocido',
      `${message} Si el problema persiste, contacta al soporte técnico.`
    );
  }

  private handleCriticalError(error: Error, context: ErrorContext): void {
    this.notificationService.showError(
      'Error crítico',
      'Ha ocurrido un error crítico. La aplicación se recargará automáticamente en 5 segundos.',
      true // persistent
    );

    // Send error to monitoring service (if available)
    this.sendErrorToMonitoring(error, 'critical', context);

    // Reload the page after a delay
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }, 5000);
  }

  private handleHighSeverityError(error: Error, context: ErrorContext): void {
    this.notificationService.showError(
      'Error de aplicación',
      'Ha ocurrido un error que puede afectar el funcionamiento. Intenta recargar la página si persiste.',
      true // persistent
    );

    this.sendErrorToMonitoring(error, 'high', context);
  }

  private handleMediumSeverityError(error: Error, context: ErrorContext): void {
    this.notificationService.showError(
      'Error',
      'Ha ocurrido un error. La aplicación debería seguir funcionando normalmente.'
    );

    this.sendErrorToMonitoring(error, 'medium', context);
  }

  private isExpectedError(error: Error): boolean {
    const expectedErrorMessages = [
      'Non-Error promise rejection captured',
      'ResizeObserver loop limit exceeded',
      'Script error',
      'Network request failed'
    ];

    return expectedErrorMessages.some(msg => 
      error.message?.includes(msg) || error.name?.includes(msg)
    );
  }

  private getErrorSeverity(error: Error): 'critical' | 'high' | 'medium' | 'low' {
    const errorMessage = error.message?.toLowerCase() || '';
    const errorName = error.name?.toLowerCase() || '';
    
    // Critical errors that require page reload
    const criticalPatterns = [
      'chunkloaderror',
      'loading chunk',
      'loading css chunk',
      'script error',
      'out of memory'
    ];
    
    // High severity errors that significantly impact functionality
    const highSeverityPatterns = [
      'referenceerror',
      'typeerror: cannot read prop',
      'typeerror: cannot set prop',
      'rangeerror',
      'syntaxerror'
    ];
    
    // Medium severity errors that may impact some functionality
    const mediumSeverityPatterns = [
      'network error',
      'fetch error',
      'timeout',
      'abort'
    ];
    
    if (criticalPatterns.some(pattern => 
      errorMessage.includes(pattern) || errorName.includes(pattern)
    )) {
      return 'critical';
    }
    
    if (highSeverityPatterns.some(pattern => 
      errorMessage.includes(pattern) || errorName.includes(pattern)
    )) {
      return 'high';
    }
    
    if (mediumSeverityPatterns.some(pattern => 
      errorMessage.includes(pattern) || errorName.includes(pattern)
    )) {
      return 'medium';
    }
    
    return 'low';
  }

  private sendErrorToMonitoring(error: Error, severity: string, context: ErrorContext): void {
    // In a real application, this would send errors to a monitoring service
    // like Sentry, LogRocket, or a custom error tracking service
    
    const errorReport = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      severity,
      context,
      sessionId: this.getSessionId(),
      buildVersion: this.getBuildVersion()
    };
    
    // For now, just log to console in development
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.group('🚨 Error Report');
      console.error('Error:', error);
      console.log('Severity:', severity);
      console.log('Context:', context);
      console.log('Full Report:', errorReport);
      console.groupEnd();
    }
    
    // TODO: Implement actual error reporting service integration
    // Example: this.errorReportingService.sendError(errorReport);
  }

  private getSessionId(): string {
    // Generate or retrieve session ID for error tracking
    if (typeof window !== 'undefined') {
      let sessionId = sessionStorage.getItem('error-session-id');
      if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem('error-session-id', sessionId);
      }
      return sessionId;
    }
    return 'unknown';
  }

  private getBuildVersion(): string {
    // In a real application, this would be injected from build process
    return 'dev-build';
  }

  /**
   * Reset error count (useful for testing or after successful operations)
   */
  resetErrorCount(): void {
    this.errorCount = 0;
  }

  /**
   * Get current error count for monitoring
   */
  getErrorCount(): number {
    return this.errorCount;
  }
}