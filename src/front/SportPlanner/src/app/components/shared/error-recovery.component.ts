import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';

export interface ErrorRecoveryAction {
  label: string;
  action: () => void;
  primary?: boolean;
  loading?: boolean;
}

export interface ErrorRecoveryConfig {
  title?: string;
  message?: string;
  actions?: ErrorRecoveryAction[];
  showReload?: boolean;
  showRetry?: boolean;
  showDetails?: boolean;
  autoRetry?: {
    enabled: boolean;
    maxAttempts: number;
    delayMs: number;
  };
}

@Component({
  selector: 'app-error-recovery',
  standalone: true,
  imports: [CommonModule, NgIcon],
  template: `
    <div class="min-h-[300px] flex items-center justify-center p-8">
      <div class="text-center max-w-lg">
        <!-- Error Icon -->
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-error-50 mb-6">
          <ng-icon [name]="getErrorIcon()" class="h-8 w-8 text-error-600"></ng-icon>
        </div>
        
        <!-- Error Title -->
        <h3 class="text-xl font-semibold text-gray-900 mb-3">
          {{ config.title || 'Algo salió mal' }}
        </h3>
        
        <!-- Error Message -->
        <p class="text-gray-600 mb-6 leading-relaxed">
          {{ config.message || 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.' }}
        </p>

        <!-- Auto Retry Indicator -->
        @if (isAutoRetrying()) {
          <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="flex items-center justify-center space-x-3">
              <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-sm font-medium text-blue-800">
                Reintentando automáticamente... ({{ autoRetryAttempt() }}/{{ config.autoRetry?.maxAttempts }})
              </span>
            </div>
            <div class="mt-2">
              <button
                (click)="cancelAutoRetry()"
                class="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Cancelar reintentos automáticos
              </button>
            </div>
          </div>
        }
        
        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <!-- Custom Actions -->
          @for (action of config.actions || []; track action.label) {
            <button
              (click)="executeAction(action)"
              [disabled]="action.loading"
              [class]="getActionButtonClasses(action)"
            >
              @if (action.loading) {
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              }
              {{ action.label }}
            </button>
          }
          
          <!-- Default Retry Button -->
          @if (config.showRetry !== false && (!config.actions || config.actions.length === 0)) {
            <button
              (click)="retry()"
              [disabled]="isRetrying()"
              class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              @if (isRetrying()) {
                <svg class="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Reintentando...
              } @else {
                <ng-icon name="heroArrowPath" class="h-5 w-5 mr-2"></ng-icon>
                Reintentar
              }
            </button>
          }
          
          <!-- Reload Button -->
          @if (config.showReload) {
            <button
              (click)="reload()"
              class="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <ng-icon name="heroArrowPath" class="h-5 w-5 mr-2"></ng-icon>
              Recargar página
            </button>
          }
        </div>
        
        <!-- Error Details -->
        @if (config.showDetails && errorDetails) {
          <details class="text-left">
            <summary class="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-3">
              Ver detalles técnicos
            </summary>
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <pre class="text-xs text-gray-600 overflow-auto max-h-40 whitespace-pre-wrap">{{ errorDetails }}</pre>
            </div>
          </details>
        }

        <!-- Help Text -->
        <div class="mt-6 text-sm text-gray-500">
          <p>Si el problema persiste, contacta al soporte técnico.</p>
        </div>
      </div>
    </div>
  `
})
export class ErrorRecoveryComponent {
  @Input() config: ErrorRecoveryConfig = {};
  @Input() errorDetails?: string;
  @Input() error?: any;

  @Output() retryClicked = new EventEmitter<void>();
  @Output() reloadClicked = new EventEmitter<void>();
  @Output() actionExecuted = new EventEmitter<ErrorRecoveryAction>();

  isRetrying = signal(false);
  isAutoRetrying = signal(false);
  autoRetryAttempt = signal(0);
  private autoRetryTimer?: number;

  ngOnInit(): void {
    if (this.config.autoRetry?.enabled) {
      this.startAutoRetry();
    }
  }

  ngOnDestroy(): void {
    this.cancelAutoRetry();
  }

  retry(): void {
    this.isRetrying.set(true);
    this.retryClicked.emit();
    
    // Reset retry state after a delay
    setTimeout(() => {
      this.isRetrying.set(false);
    }, 2000);
  }

  reload(): void {
    this.reloadClicked.emit();
    
    // Default reload behavior
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  }

  executeAction(action: ErrorRecoveryAction): void {
    if (action.loading) return;
    
    this.actionExecuted.emit(action);
    action.action();
  }

  private startAutoRetry(): void {
    if (!this.config.autoRetry) return;
    
    const { maxAttempts, delayMs } = this.config.autoRetry;
    
    if (this.autoRetryAttempt() >= maxAttempts) {
      return;
    }
    
    this.isAutoRetrying.set(true);
    this.autoRetryAttempt.update(count => count + 1);
    
    this.autoRetryTimer = window.setTimeout(() => {
      this.retry();
      
      // Schedule next retry if not at max attempts
      if (this.autoRetryAttempt() < maxAttempts) {
        this.startAutoRetry();
      } else {
        this.isAutoRetrying.set(false);
      }
    }, delayMs);
  }

  cancelAutoRetry(): void {
    if (this.autoRetryTimer) {
      clearTimeout(this.autoRetryTimer);
      this.autoRetryTimer = undefined;
    }
    this.isAutoRetrying.set(false);
  }

  getErrorIcon(): string {
    if (this.error?.status) {
      switch (this.error.status) {
        case 404:
          return 'heroMagnifyingGlass';
        case 403:
          return 'heroLockClosed';
        case 401:
          return 'heroKey';
        case 500:
        case 502:
        case 503:
        case 504:
          return 'heroServerStack';
        default:
          return 'heroExclamationTriangle';
      }
    }
    return 'heroExclamationTriangle';
  }

  getActionButtonClasses(action: ErrorRecoveryAction): string {
    const baseClasses = 'inline-flex items-center px-6 py-3 border text-base font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors';
    
    if (action.primary) {
      return `${baseClasses} border-transparent text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500`;
    } else {
      return `${baseClasses} border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-primary-500`;
    }
  }
}