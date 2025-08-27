import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { ErrorHandlerService } from '../../services/error-handler.service';

@Component({
  selector: 'app-error-boundary',
  standalone: true,
  imports: [CommonModule, NgIcon],
  template: `
    @if (hasError) {
      <div class="min-h-[200px] flex items-center justify-center p-8">
        <div class="text-center max-w-md">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <ng-icon name="heroExclamationTriangle" class="h-6 w-6 text-red-600"></ng-icon>
          </div>
          
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            {{ errorTitle }}
          </h3>
          
          <p class="text-sm text-gray-500 mb-6">
            {{ errorMessage }}
          </p>
          
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              (click)="retry()"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <ng-icon name="heroArrowPath" class="h-4 w-4 mr-2"></ng-icon>
              Reintentar
            </button>
            
            @if (showReloadOption) {
              <button
                (click)="reload()"
                class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                Recargar página
              </button>
            }
          </div>
          
          @if (showDetails && errorDetails) {
            <details class="mt-6 text-left">
              <summary class="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Detalles técnicos
              </summary>
              <pre class="mt-2 text-xs text-gray-600 bg-gray-50 p-3 rounded overflow-auto max-h-32">{{ errorDetails }}</pre>
            </details>
          }
        </div>
      </div>
    } @else {
      <ng-content></ng-content>
    }
  `
})
export class ErrorBoundaryComponent implements OnInit, OnDestroy {
  @Input() errorTitle: string = 'Algo salió mal';
  @Input() errorMessage: string = 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.';
  @Input() showReloadOption: boolean = true;
  @Input() showDetails: boolean = false;
  @Input() retryCallback?: () => void;

  hasError = false;
  errorDetails: string | null = null;

  private destroy$ = new Subject<void>();
  private notificationService = inject(NotificationService);
  private errorHandler = inject(ErrorHandlerService);

  ngOnInit(): void {
    // Listen for unhandled errors in this component's context
    if (typeof window !== 'undefined') {
      window.addEventListener('error', this.handleError.bind(this));
      window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    if (typeof window !== 'undefined') {
      window.removeEventListener('error', this.handleError.bind(this));
      window.removeEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
    }
  }

  private handleError(event: ErrorEvent): void {
    this.showError(event.error || event.message);
  }

  private handlePromiseRejection(event: PromiseRejectionEvent): void {
    this.showError(event.reason);
  }

  showError(error: any): void {
    this.hasError = true;
    
    if (this.showDetails) {
      this.errorDetails = this.formatErrorDetails(error);
    }
    
    // Log the error
    this.errorHandler.logError(error, 'ERROR_BOUNDARY');
  }

  retry(): void {
    this.hasError = false;
    this.errorDetails = null;
    
    if (this.retryCallback) {
      try {
        this.retryCallback();
      } catch (error) {
        this.showError(error);
      }
    } else {
      // Default retry behavior - reload the current route
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }
  }

  reload(): void {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }

  private formatErrorDetails(error: any): string {
    if (error instanceof Error) {
      return `${error.name}: ${error.message}\n\nStack trace:\n${error.stack}`;
    }
    
    if (typeof error === 'object') {
      try {
        return JSON.stringify(error, null, 2);
      } catch {
        return String(error);
      }
    }
    
    return String(error);
  }
}