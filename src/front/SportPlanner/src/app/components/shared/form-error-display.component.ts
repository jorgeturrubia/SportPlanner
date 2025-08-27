import { Component, Input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormGroup } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { FormErrorHandlerService } from '../../services/form-error-handler.service';

@Component({
  selector: 'app-form-error-display',
  standalone: true,
  imports: [CommonModule, NgIcon],
  template: `
    <!-- Field-specific error display -->
    @if (control && showFieldError()) {
      <div class="mt-1 flex items-start space-x-2">
        <ng-icon name="heroExclamationTriangle" class="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0"></ng-icon>
        <p class="text-sm text-red-600">
          {{ fieldErrorMessage() }}
        </p>
      </div>
    }

    <!-- Form-wide error summary -->
    @if (form && showFormErrors && formErrors().length > 0) {
      <div class="rounded-md bg-red-50 border border-red-200 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <ng-icon name="heroExclamationTriangle" class="h-5 w-5 text-red-400"></ng-icon>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              {{ formErrors().length === 1 ? 'Error en el formulario' : 'Errores en el formulario' }}
            </h3>
            <div class="mt-2 text-sm text-red-700">
              <ul class="list-disc list-inside space-y-1">
                @for (error of formErrors(); track error.field) {
                  <li>{{ error.message }}</li>
                }
              </ul>
            </div>
            @if (showRetryButton) {
              <div class="mt-3">
                <button
                  type="button"
                  (click)="onRetry()"
                  class="text-sm font-medium text-red-800 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Reintentar
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    }

    <!-- Server error display -->
    @if (serverError) {
      <div class="rounded-md bg-red-50 border border-red-200 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <ng-icon name="heroExclamationTriangle" class="h-5 w-5 text-red-400"></ng-icon>
          </div>
          <div class="ml-3 flex-1">
            <h3 class="text-sm font-medium text-red-800">
              Error del servidor
            </h3>
            <p class="mt-1 text-sm text-red-700">
              {{ serverError }}
            </p>
            @if (showRetryButton) {
              <div class="mt-3">
                <button
                  type="button"
                  (click)="onRetry()"
                  class="text-sm font-medium text-red-800 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  <ng-icon name="heroArrowPath" class="h-4 w-4 mr-1 inline"></ng-icon>
                  Reintentar
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    }

    <!-- Success message display -->
    @if (successMessage) {
      <div class="rounded-md bg-green-50 border border-green-200 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <ng-icon name="heroCheckCircle" class="h-5 w-5 text-green-400"></ng-icon>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800">
              {{ successMessage }}
            </p>
          </div>
        </div>
      </div>
    }

    <!-- Loading state -->
    @if (isLoading) {
      <div class="rounded-md bg-blue-50 border border-blue-200 p-4">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="animate-spin h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-blue-800">
              {{ loadingMessage || 'Procesando...' }}
            </p>
          </div>
        </div>
      </div>
    }
  `
})
export class FormErrorDisplayComponent {
  @Input() control?: AbstractControl | null;
  @Input() fieldName?: string;
  @Input() form?: FormGroup;
  @Input() serverError?: string;
  @Input() successMessage?: string;
  @Input() isLoading = false;
  @Input() loadingMessage?: string;
  @Input() showFormErrors: boolean = false;
  @Input() showRetryButton = false;
  @Input() retryCallback?: () => void;

  private formErrorHandler = inject(FormErrorHandlerService);

  // Computed properties
  showFieldError = computed(() => {
    return this.control && this.fieldName && 
           this.formErrorHandler.isFieldInvalid(this.control);
  });

  fieldErrorMessage = computed(() => {
    if (!this.control || !this.fieldName) return '';
    return this.formErrorHandler.getFieldErrorMessage(this.control, this.fieldName);
  });

  formErrors = computed(() => {
    if (!this.form) return [];
    return this.formErrorHandler.getFormErrors(this.form);
  });

  onRetry(): void {
    if (this.retryCallback) {
      this.retryCallback();
    }
  }
}