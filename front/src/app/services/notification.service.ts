import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification, NotificationConfig, NotificationType } from '../core/models/notification.model';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private notifications$ = new BehaviorSubject<Notification[]>([]);
    private maxNotifications = 5;

    getNotifications(): Observable<Notification[]> {
        return this.notifications$.asObservable();
    }

    /**
     * Muestra una notificación de éxito
     */
    success(title: string, message: string, duration: number = 5000): void {
        this.show({
            type: NotificationType.SUCCESS,
            title,
            message,
            duration
        });
    }

    /**
     * Muestra una notificación de error
     */
    error(title: string, message: string, duration: number = 0): void {
        this.show({
            type: NotificationType.ERROR,
            title,
            message,
            duration,
            dismissible: true
        });
    }

    /**
     * Muestra una notificación de advertencia
     */
    warning(title: string, message: string, duration: number = 7000): void {
        this.show({
            type: NotificationType.WARNING,
            title,
            message,
            duration
        });
    }

    /**
     * Muestra una notificación informativa
     */
    info(title: string, message: string, duration: number = 5000): void {
        this.show({
            type: NotificationType.INFO,
            title,
            message,
            duration
        });
    }

    /**
     * Muestra una notificación personalizada
     */
    show(config: NotificationConfig): void {
        const notification: Notification = {
            id: this.generateId(),
            type: config.type,
            title: config.title,
            message: config.message,
            duration: config.duration ?? 5000,
            timestamp: new Date(),
            dismissible: config.dismissible ?? true,
            action: config.action
        };

        const currentNotifications = this.notifications$.value;
        const updatedNotifications = [notification, ...currentNotifications];

        // Limitar el número de notificaciones
        if (updatedNotifications.length > this.maxNotifications) {
            updatedNotifications.pop();
        }

        this.notifications$.next(updatedNotifications);

        // Auto-dismiss si tiene duración
        if (notification.duration && notification.duration > 0) {
            setTimeout(() => {
                this.dismiss(notification.id);
            }, notification.duration);
        }
    }

    /**
     * Descarta una notificación por ID
     */
    dismiss(id: string): void {
        const currentNotifications = this.notifications$.value;
        const updatedNotifications = currentNotifications.filter(n => n.id !== id);
        this.notifications$.next(updatedNotifications);
    }

    /**
     * Descarta todas las notificaciones
     */
    dismissAll(): void {
        this.notifications$.next([]);
    }

    /**
     * Valida una respuesta HTTP y muestra notificación apropiada
     */
    handleHttpResponse(response: any, successMessage?: string): void {
        if (response?.success === true || response?.status === 200 || response?.status === 201) {
            this.success(
                'Operación exitosa',
                successMessage || response?.message || 'La operación se completó correctamente'
            );
        } else if (response?.success === false || response?.error) {
            this.error(
                'Error',
                response?.message || response?.error?.message || 'Ocurrió un error inesperado'
            );
        }
    }

    /**
     * Maneja errores HTTP y muestra notificación
     */
    handleHttpError(error: any): void {
        let title = 'Error';
        let message = 'Ocurrió un error inesperado';

        if (error?.status === 0) {
            title = 'Error de conexión';
            message = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
        } else if (error?.status === 400) {
            title = 'Datos inválidos';
            message = error?.error?.message || 'Los datos enviados no son válidos';
        } else if (error?.status === 401) {
            title = 'No autorizado';
            message = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
        } else if (error?.status === 403) {
            title = 'Acceso denegado';
            message = 'No tienes permisos para realizar esta acción.';
        } else if (error?.status === 404) {
            title = 'No encontrado';
            message = 'El recurso solicitado no fue encontrado.';
        } else if (error?.status === 409) {
            title = 'Conflicto';
            message = error?.error?.message || 'Ya existe un registro con estos datos.';
        } else if (error?.status === 422) {
            title = 'Validación fallida';
            message = this.extractValidationErrors(error?.error?.errors) || 'Los datos no cumplen con los requisitos.';
        } else if (error?.status >= 500) {
            title = 'Error del servidor';
            message = 'El servidor encontró un error. Por favor, intenta más tarde.';
        } else if (error?.error?.message) {
            message = error.error.message;
        }

        this.error(title, message);
    }

    /**
     * Extrae mensajes de error de validación
     */
    private extractValidationErrors(errors: any): string {
        if (!errors) return '';

        if (typeof errors === 'string') return errors;

        if (Array.isArray(errors)) {
            // Soporte para FluentValidation (ErrorMessage) y formato estándar (message)
            return errors.map(e => e.message || e.errorMessage || e.ErrorMessage || e).join(', ');
        }

        if (typeof errors === 'object') {
            const messages: string[] = [];
            for (const key in errors) {
                if (errors.hasOwnProperty(key)) {
                    const errorMessages = errors[key];
                    if (Array.isArray(errorMessages)) {
                        messages.push(...errorMessages);
                    } else {
                        messages.push(errorMessages);
                    }
                }
            }
            return messages.join(', ');
        }

        return '';
    }

    /**
     * Genera un ID único para la notificación
     */
    private generateId(): string {
        return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}
