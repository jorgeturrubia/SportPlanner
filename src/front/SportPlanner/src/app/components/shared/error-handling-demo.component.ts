import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { Observable, throwError, timer, of, tap } from 'rxjs';

import { ErrorBoundaryService } from '../../services/error-boundary.service';
import { RetryService } from '../../services/retry.service';
import { NotificationService } from '../../services/notification.service';
import { FormErrorHandlerService } from '../../services/form-error-handler.service';
import { ErrorRecoveryComponent, ErrorRecoveryConfig } from './error-recovery.component';
import { FormErrorDisplayComponent } from './form-error-display.component';
import { UserFeedbackComponent } from './user-feedback.component';

@Component({
  selector: 'app-error-handling-demo',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    NgIcon,
    ErrorRecoveryComponent,
    FormErrorDisplayComponent,
    UserFeedbackComponent
  ],
  template: `
    <div class="max-w-4xl mx-auto p-6 space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Error Handling Demo</h1>
        <p class="text-gray-600">Demonstración de las capacidades de manejo de errores</p>
      </div>

      <!-- Error Boundary Examples -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Error Boundary Examples</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            (click)="simulateNetworkError()"
            class="btn-secondary"
            [disabled]="isLoading()"
          >
            <ng-icon name="heroExclamationTriangle" class="h-4 w-4 mr-2"></ng-icon>
            Simular Error de Red
          </button>
          
          <button
            (click)="simulateServerError()"
            class="btn-secondary"
            [disabled]="isLoading()"
          >
            <ng-icon name="heroServerStack" class="h-4 w-4 mr-2"></ng-icon>
            Simular Error del Servidor
          </button>
          
          <button
            (click)="simulateValidationError()"
            class="btn-secondary"
            [disabled]="isLoading()"
          >
            <ng-icon name="heroExclamationTriangle" class="h-4 w-4 mr-2"></ng-icon>
            Simular Error de Validación
          </button>
          
          <button
            (click)="simulateSuccessfulOperation()"
            class="btn-primary"
            [disabled]="isLoading()"
          >
            <ng-icon name="heroCheckCircle" class="h-4 w-4 mr-2"></ng-icon>
            Operación Exitosa
          </button>
        </div>

        @if (isLoading()) {
          <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="flex items-center">
              <svg class="animate-spin h-5 w-5 text-blue-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-blue-800 font-medium">Procesando operación...</span>
            </div>
          </div>
        }
      </div>

      <!-- Form Error Handling -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Form Error Handling</h2>
        
        <form [formGroup]="demoForm" (ngSubmit)="onSubmitForm()" class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              id="name"
              type="text"
              formControlName="name"
              [class]="formErrorHandler.getFieldClasses(demoForm.get('name'), 'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2')"
              placeholder="Ingresa tu nombre"
            />
            <app-form-error-display
              [control]="demoForm.get('name')"
              fieldName="name"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              id="email"
              type="email"
              formControlName="email"
              [class]="formErrorHandler.getFieldClasses(demoForm.get('email'), 'w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2')"
              placeholder="Ingresa tu email"
            />
            <app-form-error-display
              [control]="demoForm.get('email')"
              fieldName="email"
            />
          </div>

          <app-form-error-display
            [form]="demoForm"
            [showFormErrors]="showFormErrors()"
            [serverError]="formServerError()"
            [isLoading]="isFormSubmitting()"
            [successMessage]="formSuccessMessage()"
            [showRetryButton]="true"
            [retryCallback]="retryFormSubmission.bind(this)"
          />

          <div class="flex space-x-3">
            <button
              type="submit"
              class="btn-primary"
              [disabled]="isFormSubmitting()"
            >
              @if (isFormSubmitting()) {
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              } @else {
                Enviar Formulario
              }
            </button>
            
            <button
              type="button"
              (click)="simulateFormValidationError()"
              class="btn-secondary"
              [disabled]="isFormSubmitting()"
            >
              Simular Error de Validación
            </button>
          </div>
        </form>
      </div>

      <!-- Error Recovery Component -->
      @if (showErrorRecovery()) {
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <app-error-recovery
            [config]="errorRecoveryConfig()"
            [errorDetails]="errorDetails()"
            (retryClicked)="onRetryClicked()"
            (reloadClicked)="onReloadClicked()"
            (actionExecuted)="onActionExecuted($event)"
          />
        </div>
      }

      <!-- User Feedback Examples -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">User Feedback Examples</h2>
        
        <div class="space-y-4">
          <app-user-feedback
            type="success"
            title="Operación exitosa"
            message="La operación se completó correctamente."
            [dismissible]="true"
          />
          
          <app-user-feedback
            type="error"
            title="Error de validación"
            message="Se encontraron errores en el formulario."
            [details]="['El nombre es obligatorio', 'El email debe ser válido']"
            [dismissible]="true"
          />
          
          <app-user-feedback
            type="warning"
            title="Advertencia"
            message="Esta acción no se puede deshacer."
            [dismissible]="true"
          />
          
          <app-user-feedback
            type="info"
            title="Información"
            message="Los cambios se guardarán automáticamente."
            [dismissible]="true"
          />
        </div>
      </div>

      <!-- Retry Mechanism Demo -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Retry Mechanism Demo</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            (click)="testRetryMechanism()"
            class="btn-secondary"
            [disabled]="isRetrying()"
          >
            @if (isRetrying()) {
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Reintentando...
            } @else {
              <ng-icon name="heroArrowPath" class="h-4 w-4 mr-2"></ng-icon>
              Test Retry (Falla 2 veces)
            }
          </button>
          
          <button
            (click)="testAutoRetry()"
            class="btn-secondary"
            [disabled]="isRetrying()"
          >
            <ng-icon name="heroArrowPath" class="h-4 w-4 mr-2"></ng-icon>
            Test Auto Retry
          </button>
        </div>
      </div>
    </div>
  `
})
export class ErrorHandlingDemoComponent {
  private fb = inject(FormBuilder);
  private errorBoundary = inject(ErrorBoundaryService);
  private retryService = inject(RetryService);
  private notificationService = inject(NotificationService);
  formErrorHandler = inject(FormErrorHandlerService);

  // State signals
  isLoading = signal(false);
  isFormSubmitting = signal(false);
  isRetrying = signal(false);
  showFormErrors = signal(false);
  formServerError = signal<string | undefined>(undefined);
  formSuccessMessage = signal<string | undefined>(undefined);
  showErrorRecovery = signal(false);
  errorRecoveryConfig = signal<ErrorRecoveryConfig>({});
  errorDetails = signal<string | undefined>(undefined);

  // Form
  demoForm: FormGroup;

  constructor() {
    this.demoForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  simulateNetworkError(): void {
    this.isLoading.set(true);
    
    const operation = () => throwError(() => ({
      status: 0,
      message: 'Network error',
      name: 'NetworkError'
    }));

    this.errorBoundary.wrapObservable(operation(), {
      context: 'conexión de red',
      retryConfig: {
        maxRetries: 3,
        delayMs: 1000,
        exponentialBackoff: true
      },
      onError: () => {
        this.showErrorRecoveryDialog({
          title: 'Error de conexión',
          message: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
          showRetry: true,
          showReload: true
        });
      }
    }).subscribe({
      complete: () => this.isLoading.set(false)
    });
  }

  simulateServerError(): void {
    this.isLoading.set(true);
    
    const operation = () => throwError(() => ({
      status: 500,
      message: 'Internal server error',
      error: { message: 'Database connection failed' }
    }));

    this.errorBoundary.wrapObservable(operation(), {
      context: 'servidor',
      retryConfig: {
        maxRetries: 2,
        delayMs: 2000
      },
      onError: () => {
        this.showErrorRecoveryDialog({
          title: 'Error del servidor',
          message: 'Ha ocurrido un error interno del servidor. Nuestro equipo ha sido notificado.',
          showRetry: true,
          showDetails: true,
          autoRetry: {
            enabled: true,
            maxAttempts: 3,
            delayMs: 5000
          }
        });
      }
    }).subscribe({
      complete: () => this.isLoading.set(false)
    });
  }

  simulateValidationError(): void {
    this.isLoading.set(true);
    
    const operation = () => throwError(() => ({
      status: 422,
      message: 'Validation failed',
      error: {
        errors: {
          name: ['El nombre es obligatorio'],
          email: ['El formato del email no es válido']
        }
      }
    }));

    this.errorBoundary.wrapObservable(operation(), {
      context: 'validación',
      showNotifications: false,
      onError: (error) => {
        this.notificationService.showError(
          'Error de validación',
          'Por favor, corrige los errores en el formulario.'
        );
      }
    }).subscribe({
      complete: () => this.isLoading.set(false)
    });
  }

  simulateSuccessfulOperation(): void {
    this.isLoading.set(true);
    
    const operation = () => timer(2000).pipe(
      tap(() => {
        this.notificationService.showSuccess(
          'Operación exitosa',
          'La operación se completó correctamente.'
        );
      })
    );

    this.errorBoundary.wrapObservable(operation(), {
      context: 'operación exitosa'
    }).subscribe({
      complete: () => this.isLoading.set(false)
    });
  }

  onSubmitForm(): void {
    if (this.demoForm.invalid) {
      this.formErrorHandler.markAllFieldsAsTouched(this.demoForm);
      this.showFormErrors.set(true);
      return;
    }

    this.isFormSubmitting.set(true);
    this.formServerError.set(undefined);
    this.formSuccessMessage.set(undefined);
    this.showFormErrors.set(false);

    // Simulate form submission
    const operation = () => timer(2000);

    this.errorBoundary.handleFormSubmission(operation, {
      form: this.demoForm,
      context: 'envío de formulario',
      successMessage: 'Formulario enviado exitosamente',
      errorMessage: 'Error al enviar el formulario',
      onSuccess: () => {
        this.formSuccessMessage.set('Formulario enviado exitosamente');
        this.demoForm.reset();
      },
      onError: (error) => {
        this.formServerError.set('Error del servidor al procesar el formulario');
      }
    }).subscribe({
      complete: () => this.isFormSubmitting.set(false)
    });
  }

  simulateFormValidationError(): void {
    this.formServerError.set(undefined);
    this.formSuccessMessage.set(undefined);
    
    // Simulate server validation errors
    const serverErrors = {
      name: ['El nombre ya está en uso'],
      email: ['Este email ya está registrado']
    };
    
    this.formErrorHandler.handleServerValidationErrors(this.demoForm, serverErrors);
    this.showFormErrors.set(true);
  }

  retryFormSubmission(): void {
    this.onSubmitForm();
  }

  testRetryMechanism(): void {
    this.isRetrying.set(true);
    let attemptCount = 0;

    const operation = () => {
      attemptCount++;
      if (attemptCount < 3) {
        return throwError(() => new Error(`Attempt ${attemptCount} failed`));
      }
      return of(`Success on attempt ${attemptCount}`);
    };

    this.retryService.retryOperation(operation, {
      maxRetries: 3,
      delayMs: 1000,
      context: 'operación de prueba',
      showNotifications: true
    }).subscribe({
      next: (result) => {
        this.notificationService.showSuccess('Éxito', result);
      },
      error: (error) => {
        this.notificationService.showError('Error', 'La operación falló después de varios intentos');
      },
      complete: () => {
        this.isRetrying.set(false);
      }
    });
  }

  testAutoRetry(): void {
    this.showErrorRecoveryDialog({
      title: 'Operación fallida',
      message: 'La operación falló pero se reintentará automáticamente.',
      autoRetry: {
        enabled: true,
        maxAttempts: 5,
        delayMs: 3000
      },
      actions: [
        {
          label: 'Cancelar reintentos',
          action: () => {
            this.showErrorRecovery.set(false);
            this.notificationService.showInfo('Cancelado', 'Los reintentos automáticos han sido cancelados');
          }
        }
      ]
    });
  }

  private showErrorRecoveryDialog(config: ErrorRecoveryConfig): void {
    this.errorRecoveryConfig.set(config);
    this.errorDetails.set(JSON.stringify({
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }, null, 2));
    this.showErrorRecovery.set(true);
    this.isLoading.set(false);
  }

  onRetryClicked(): void {
    this.showErrorRecovery.set(false);
    this.notificationService.showInfo('Reintentando', 'Reintentando la operación...');
  }

  onReloadClicked(): void {
    this.notificationService.showInfo('Recargando', 'Recargando la página...');
  }

  onActionExecuted(action: any): void {
    console.log('Action executed:', action);
  }
}