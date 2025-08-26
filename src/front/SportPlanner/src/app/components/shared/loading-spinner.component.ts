import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-spinner" [class.overlay]="overlay" [class.inline]="!overlay">
      @if (overlay) {
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white rounded-lg p-6 shadow-lg">
            <div class="flex items-center space-x-3">
              <div class="spinner"></div>
              <span class="text-gray-700">{{ message }}</span>
            </div>
          </div>
        </div>
      } @else {
        <div class="flex items-center justify-center space-x-2">
          <div class="spinner" [class.small]="size === 'small'"></div>
          @if (message) {
            <span class="text-gray-600" [class.text-sm]="size === 'small'">{{ message }}</span>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .spinner {
      @apply w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin;
    }
    
    .spinner.small {
      @apply w-4 h-4 border border-blue-200 border-t-blue-600;
    }
    
    .loading-spinner.inline {
      @apply inline-flex;
    }
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    
    .animate-spin {
      animation: spin 1s linear infinite;
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() message: string = 'Cargando...';
  @Input() overlay: boolean = false;
  @Input() size: 'normal' | 'small' = 'normal';
}