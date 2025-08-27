import { Injectable, inject, signal } from '@angular/core';
import { Observable, throwError, catchError, retry, delay, tap } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';
import { NotificationService } from './notification.service';
import { RetryService, RetryConfig } from './retry.service';

export interface ErrorBoundaryConfig {
  context?: string;
  showNotifications?: boolean;
  retryConfig?: RetryConfig;
  fallbackValue?: any;
  onError?: (error: any) => void;
  onRetry?: (attempt: number) => void;
  onSuccess?: (result: any) => void;
}

export interface ErrorState {
  hasError: boolean;
  error: any;
  context?: string;
  retryCount: number;
  lastAttempt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorBoundaryService {
  private errorHandler = inject(ErrorHandlerService);
  private notificationService = inject(NotificationService);
  private retryService = inject(RetryService);

  private errorStates = new Map<string, ErrorState>();

  /**
   * Wrap an observable with error boundary protection
   */
  wrapObservable<T>(
    source: Observable<T>,
    config: ErrorBoundaryConfig = {}
  ): Observable<T> {
    const {
      context = 'operación',
      showNotifications = true,
      retryConfig,
      fallbackValue,
      onError,
      onRetry,
      onSuccess
    } = config;

    const boundaryId = this.generateBoundaryId(context);
    this.initializeErrorState(boundaryId, context);

    let observable = source.pipe(
      tap((result) => {
        // Clear error state on success
        this.clearErrorState(boundaryId);
        if (onSuccess) {
          onSuccess(result);
        }
      }),
      catchError((error) => {
        this.updateErrorState(boundaryId, error);
        
        if (onError) {
          onError(error);
        }

        if (showNotifications) {
          this.errorHandler.handleHttpError(error, context);
        }

        // Return fallback value if provided, otherwise re-throw
        if (fallbackValue !== undefined) {
          return [fallbackValue];
        }

        return throwError(() => error);
      })
    );

    // Add retry logic if configured
    if (retryConfig) {
      observable = this.retryService.withRetry(observable, {
        ...retryConfig,
        context,
        showNotifications
      }).pipe(
        tap({
          error: () => {
            if (onRetry) {
              const state = this.getErrorState(boundaryId);
              onRetry(state?.retryCount || 0);
            }
          }
        })
      );
    }

    return observable;
  }

  /**
   * Execute a function with error boundary protection
   */
  executeWithBoundary<T>(
    fn: () => T | Promise<T>,
    config: ErrorBoundaryConfig = {}
  ): Promise<T> {
    const {
      context = 'operación',
      showNotifications = true,
      onError,
      onSuccess
    } = config;

    const boundaryId = this.generateBoundaryId(context);
    this.initializeErrorState(boundaryId, context);

    return Promise.resolve()
      .then(() => fn())
      .then((result) => {
        this.clearErrorState(boundaryId);
        if (onSuccess) {
          onSuccess(result);
        }
        return result;
      })
      .catch((error) => {
        this.updateErrorState(boundaryId, error);
        
        if (onError) {
          onError(error);
        }

        if (showNotifications) {
          this.errorHandler.handleHttpError(error, context);
        }

        throw error;
      });
  }

  /**
   * Get error state for a specific boundary
   */
  getErrorState(boundaryId: string): ErrorState | undefined {
    return this.errorStates.get(boundaryId);
  }

  /**
   * Check if a boundary has an error
   */
  hasError(boundaryId: string): boolean {
    const state = this.errorStates.get(boundaryId);
    return state?.hasError || false;
  }

  /**
   * Clear error state for a specific boundary
   */
  clearErrorState(boundaryId: string): void {
    const state = this.errorStates.get(boundaryId);
    if (state) {
      state.hasError = false;
      state.error = null;
      state.retryCount = 0;
      state.lastAttempt = undefined;
    }
  }

  /**
   * Clear all error states
   */
  clearAllErrorStates(): void {
    this.errorStates.clear();
  }

  /**
   * Get all current error states
   */
  getAllErrorStates(): Map<string, ErrorState> {
    return new Map(this.errorStates);
  }

  /**
   * Create a retry function for manual retry operations
   */
  createRetryFunction<T>(
    operation: () => Observable<T>,
    config: ErrorBoundaryConfig = {}
  ): () => Observable<T> {
    return () => this.wrapObservable(operation(), config);
  }

  /**
   * Handle form submission with error boundary
   */
  handleFormSubmission<T>(
    submitFn: () => Observable<T>,
    config: ErrorBoundaryConfig & {
      form?: any;
      successMessage?: string;
      errorMessage?: string;
    } = {}
  ): Observable<T> {
    const {
      form,
      successMessage = 'Operación completada exitosamente',
      errorMessage = 'Error al procesar el formulario',
      context = 'envío de formulario',
      ...boundaryConfig
    } = config;

    return this.wrapObservable(submitFn(), {
      ...boundaryConfig,
      context,
      onSuccess: (result) => {
        if (successMessage) {
          this.notificationService.showSuccess('Éxito', successMessage);
        }
        if (config.onSuccess) {
          config.onSuccess(result);
        }
      },
      onError: (error) => {
        // Handle form-specific errors
        if (form && error.status === 422 && error.error?.errors) {
          // Handle validation errors
          this.handleFormValidationErrors(form, error.error.errors);
        } else if (errorMessage) {
          this.notificationService.showError('Error', errorMessage);
        }
        
        if (config.onError) {
          config.onError(error);
        }
      }
    });
  }

  private generateBoundaryId(context: string): string {
    return `boundary_${context}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeErrorState(boundaryId: string, context?: string): void {
    this.errorStates.set(boundaryId, {
      hasError: false,
      error: null,
      context,
      retryCount: 0
    });
  }

  private updateErrorState(boundaryId: string, error: any): void {
    const state = this.errorStates.get(boundaryId);
    if (state) {
      state.hasError = true;
      state.error = error;
      state.retryCount += 1;
      state.lastAttempt = new Date();
    }
  }

  private handleFormValidationErrors(form: any, errors: any): void {
    if (form && typeof form.setErrors === 'function') {
      // Handle Angular reactive forms
      Object.keys(errors).forEach(field => {
        const control = form.get(field);
        if (control) {
          control.setErrors({ server: errors[field] });
          control.markAsTouched();
        }
      });
    }
  }
}