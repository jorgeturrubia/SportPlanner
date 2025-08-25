import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { AuthService } from '../../services';

@Component({
  selector: 'app-logout-confirmation',
  standalone: true,
  imports: [CommonModule, NgIcon],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" 
         (click)="onBackdropClick($event)">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
           (click)="$event.stopPropagation()">
        <div class="flex items-center mb-4">
          <ng-icon name="heroExclamationTriangle" class="text-yellow-500 text-2xl mr-3"></ng-icon>
          <h3 class="text-lg font-semibold text-gray-900">Confirmar cierre de sesión</h3>
        </div>
        
        <p class="text-gray-600 mb-6">
          ¿Estás seguro de que quieres cerrar sesión? Tendrás que volver a iniciar sesión para acceder a tu cuenta.
        </p>
        
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            (click)="onCancel()"
            [disabled]="isLoading()"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
            Cancelar
          </button>
          
          <button
            type="button"
            (click)="onConfirm()"
            [disabled]="isLoading()"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
            @if (isLoading()) {
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            }
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  `
})
export class LogoutConfirmationComponent {
  isLoading = signal(false);

  constructor(private authService: AuthService) {}

  onConfirm(): void {
    this.isLoading.set(true);
    
    this.authService.logout().subscribe({
      next: () => {
        this.isLoading.set(false);
        // The auth service will handle navigation
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Logout error:', error);
        // Even on error, we should close the modal as tokens are cleared
      }
    });
  }

  onCancel(): void {
    // Emit cancel event or close modal
    // This would typically be handled by a modal service
  }

  onBackdropClick(event: Event): void {
    // Close modal when clicking backdrop
    this.onCancel();
  }
}