import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

/**
 * Interceptor HTTP que captura automáticamente las respuestas del backend
 * y muestra notificaciones apropiadas al usuario
 */
export const notificationInterceptor: HttpInterceptorFn = (req, next) => {
    const notificationService = inject(NotificationService);

    // Lista de endpoints que no deben mostrar notificaciones automáticas
    const excludedEndpoints = [
        '/auth/user',
        '/auth/session',
        '/lookup'
    ];

    // Verificar si el endpoint está excluido
    const isExcluded = excludedEndpoints.some(endpoint => req.url.includes(endpoint));

    return next(req).pipe(
        tap(event => {
            // Solo procesar respuestas HTTP exitosas y no excluidas
            if (!isExcluded && event.type === 4) { // HttpEventType.Response
                const response = event as any;

                // Solo mostrar notificación para métodos que modifican datos
                if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
                    // Extraer mensaje personalizado del header o del body
                    const customMessage = response.headers?.get('X-Success-Message') ||
                        response.body?.message;

                    if (response.status >= 200 && response.status < 300) {
                        notificationService.success(
                            'Operación exitosa',
                            customMessage || getSuccessMessage(req.method)
                        );
                    }
                }
            }
        }),
        catchError((error: HttpErrorResponse) => {
            // No mostrar notificación para endpoints excluidos
            if (!isExcluded) {
                notificationService.handleHttpError(error);
            }
            return throwError(() => error);
        })
    );
};

/**
 * Obtiene un mensaje de éxito basado en el método HTTP
 */
function getSuccessMessage(method: string): string {
    switch (method) {
        case 'POST':
            return 'Registro creado exitosamente';
        case 'PUT':
        case 'PATCH':
            return 'Registro actualizado exitosamente';
        case 'DELETE':
            return 'Registro eliminado exitosamente';
        default:
            return 'Operación completada exitosamente';
    }
}
