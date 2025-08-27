import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer, retry, retryWhen, mergeMap, finalize } from 'rxjs';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private notificationService: NotificationService) {}

  /**
   * Handle HTTP errors and show appropriate notifications
   */
  handleHttpError(error: HttpErrorResponse, context?: string): void {
    let title = 'Error';
    let message = 'Ha ocurrido un error inesperado';

    if (context) {
      title = `Error en ${context}`;
    }

    switch (error.status) {
      case 0:
        title = 'Error de conexión';
        message = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
        break;
      case 400:
        title = 'Solicitud inválida';
        message = error.error?.message || 'Los datos enviados no son válidos.';
        break;
      case 401:
        title = 'No autorizado';
        message = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
        break;
      case 403:
        title = 'Acceso denegado';
        message = 'No tienes permisos para realizar esta acción.';
        break;
      case 404:
        title = 'No encontrado';
        message = 'El recurso solicitado no fue encontrado.';
        break;
      case 409:
        title = 'Conflicto';
        message = error.error?.message || 'Ya existe un recurso con estos datos.';
        break;
      case 422:
        title = 'Datos inválidos';
        message = error.error?.message || 'Los datos proporcionados no son válidos.';
        break;
      case 429:
        title = 'Demasiadas solicitudes';
        message = 'Has realizado demasiadas solicitudes. Intenta nuevamente más tarde.';
        break;
      case 500:
        title = 'Error del servidor';
        message = 'Ha ocurrido un error interno del servidor. Intenta nuevamente más tarde.';
        break;
      case 502:
      case 503:
      case 504:
        title = 'Servicio no disponible';
        message = 'El servicio no está disponible temporalmente. Intenta nuevamente más tarde.';
        break;
      default:
        if (error.error?.message) {
          message = error.error.message;
        }
    }

    this.notificationService.showError(title, message);
  }

  /**
   * Handle authentication errors specifically
   */
  handleAuthError(error: HttpErrorResponse): void {
    let message = 'Error de autenticación';

    switch (error.status) {
      case 401:
        message = 'Credenciales inválidas. Verifica tu email y contraseña.';
        break;
      case 409:
        message = 'Ya existe una cuenta con este email.';
        break;
      case 422:
        message = error.error?.message || 'Los datos proporcionados no son válidos.';
        break;
      default:
        message = error.error?.message || 'Ha ocurrido un error durante la autenticación.';
    }

    this.notificationService.showError('Error de autenticación', message);
  }

  /**
   * Handle validation errors
   */
  handleValidationError(errors: Record<string, string[]>): void {
    const errorMessages = Object.values(errors).flat();
    const message = errorMessages.join(', ');
    
    this.notificationService.showError('Errores de validación', message);
  }

  /**
   * Handle network errors
   */
  handleNetworkError(): void {
    this.notificationService.showError(
      'Error de conexión',
      'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
    );
  }

  /**
   * Handle timeout errors
   */
  handleTimeoutError(): void {
    this.notificationService.showError(
      'Tiempo de espera agotado',
      'La solicitud tardó demasiado tiempo. Intenta nuevamente.'
    );
  }

  /**
   * Show a generic success message
   */
  showSuccess(message: string, title: string = 'Éxito'): void {
    this.notificationService.showSuccess(title, message);
  }

  /**
   * Show a warning message
   */
  showWarning(message: string, title: string = 'Advertencia'): void {
    this.notificationService.showWarning(title, message);
  }

  /**
   * Show an info message
   */
  showInfo(message: string, title: string = 'Información'): void {
    this.notificationService.showInfo(title, message);
  }

  /**
   * Retry mechanism for failed HTTP operations
   */
  retryOperation<T>(
    operation: () => Observable<T>,
    maxRetries: number = 3,
    delayMs: number = 1000,
    context?: string
  ): Observable<T> {
    return operation().pipe(
      retryWhen(errors =>
        errors.pipe(
          mergeMap((error: HttpErrorResponse, index) => {
            const retryAttempt = index + 1;
            
            // Don't retry for certain error types
            if (this.shouldNotRetry(error)) {
              return throwError(() => error);
            }
            
            // Max retries reached
            if (retryAttempt > maxRetries) {
              if (context) {
                this.notificationService.showError(
                  'Operación fallida',
                  `No se pudo completar la operación "${context}" después de ${maxRetries} intentos.`
                );
              }
              return throwError(() => error);
            }
            
            // Show retry notification
            if (context && retryAttempt > 1) {
              this.notificationService.showInfo(
                'Reintentando...',
                `Reintentando "${context}" (${retryAttempt}/${maxRetries})`
              );
            }
            
            // Exponential backoff delay
            const delay = delayMs * Math.pow(2, retryAttempt - 1);
            return timer(delay);
          })
        )
      )
    );
  }

  /**
   * Determine if an error should not be retried
   */
  private shouldNotRetry(error: HttpErrorResponse): boolean {
    // Don't retry for client errors (4xx) except for specific cases
    if (error.status >= 400 && error.status < 500) {
      // Retry for 408 (timeout), 429 (rate limit), and network errors
      return ![0, 408, 429].includes(error.status);
    }
    
    // Retry for server errors (5xx) and network errors
    return false;
  }

  /**
   * Handle form validation errors with user-friendly messages
   */
  handleFormValidationErrors(errors: any): Record<string, string> {
    const formattedErrors: Record<string, string> = {};
    
    if (typeof errors === 'object' && errors !== null) {
      Object.keys(errors).forEach(field => {
        const fieldErrors = errors[field];
        if (Array.isArray(fieldErrors)) {
          formattedErrors[field] = fieldErrors.join(', ');
        } else if (typeof fieldErrors === 'string') {
          formattedErrors[field] = fieldErrors;
        }
      });
    }
    
    return formattedErrors;
  }

  /**
   * Get user-friendly error message based on error type and context
   */
  getUserFriendlyMessage(error: HttpErrorResponse, context?: string): string {
    const contextPrefix = context ? `${context}: ` : '';
    
    switch (error.status) {
      case 0:
        return `${contextPrefix}No se pudo conectar con el servidor. Verifica tu conexión a internet.`;
      case 400:
        return `${contextPrefix}Los datos enviados no son válidos. Revisa la información e intenta nuevamente.`;
      case 401:
        return `${contextPrefix}Tu sesión ha expirado. Por favor, inicia sesión nuevamente.`;
      case 403:
        return `${contextPrefix}No tienes permisos para realizar esta acción.`;
      case 404:
        return `${contextPrefix}El recurso solicitado no fue encontrado.`;
      case 409:
        return error.error?.message || `${contextPrefix}Ya existe un recurso con estos datos.`;
      case 422:
        return error.error?.message || `${contextPrefix}Los datos proporcionados no son válidos.`;
      case 429:
        return `${contextPrefix}Has realizado demasiadas solicitudes. Intenta nuevamente en unos minutos.`;
      case 500:
        return `${contextPrefix}Ha ocurrido un error interno del servidor. Nuestro equipo ha sido notificado.`;
      case 502:
      case 503:
      case 504:
        return `${contextPrefix}El servicio no está disponible temporalmente. Intenta nuevamente más tarde.`;
      default:
        return error.error?.message || `${contextPrefix}Ha ocurrido un error inesperado. Intenta nuevamente.`;
    }
  }

  /**
   * Log error for debugging purposes
   */
  logError(error: any, context?: string, additionalContext?: any): void {
    const timestamp = new Date().toISOString();
    const logContext = context ? `[${context}]` : '[ERROR]';
    
    console.group(`${logContext} ${timestamp}`);
    console.error('Error details:', error);
    
    if (error instanceof HttpErrorResponse) {
      console.error('Status:', error.status);
      console.error('Status Text:', error.statusText);
      console.error('URL:', error.url);
      console.error('Error Body:', error.error);
      console.error('Headers:', error.headers);
    }
    
    if (error instanceof Error) {
      console.error('Name:', error.name);
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
    }
    
    if (additionalContext) {
      console.error('Additional Context:', additionalContext);
    }
    
    console.groupEnd();
  }

  /**
   * Handle offline/online status
   */
  handleNetworkStatus(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.notificationService.showSuccess(
          'Conexión restaurada',
          'La conexión a internet ha sido restaurada.'
        );
      });
      
      window.addEventListener('offline', () => {
        this.notificationService.showWarning(
          'Sin conexión',
          'Se ha perdido la conexión a internet. Algunas funciones pueden no estar disponibles.'
        );
      });
    }
  }
}