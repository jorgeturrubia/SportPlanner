import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
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
}