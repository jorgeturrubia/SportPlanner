import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { ModalRef } from '../../services/modal.service';

export interface DeleteConfirmationData {
  title: string;
  message: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

@Component({
  selector: 'app-delete-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, NgIcon],
  styleUrl: './delete-confirmation-dialog.component.css',
  template: `
    <div class="dialog-container">
      <!-- Header -->
      <div class="flex items-start space-x-4 mb-6">
        <div class="flex-shrink-0">
          <div class="w-12 h-12 rounded-full bg-error-50 flex items-center justify-center">
            <ng-icon name="heroExclamationTriangle" class="h-6 w-6 text-error-600"></ng-icon>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-semibold text-secondary-900 mb-2">
            {{ data.title }}
          </h3>
          <div class="text-sm text-secondary-600 space-y-2">
            <p>{{ data.message }}</p>
            @if (data.itemName) {
              <p class="font-medium text-secondary-900">
                "{{ data.itemName }}"
              </p>
            }
            @if (data.destructive) {
              <p class="text-error-600 font-medium">
                Esta acción no se puede deshacer.
              </p>
            }
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="dialog-actions">
        <button
          type="button"
          (click)="onCancel()"
          [disabled]="isProcessing()"
          class="btn-cancel w-full sm:w-auto"
        >
          {{ data.cancelText || 'Cancelar' }}
        </button>
        
        <button
          type="button"
          (click)="onConfirm()"
          [disabled]="isProcessing()"
          class="btn-delete w-full sm:w-auto"
        >
          @if (isProcessing()) {
            <svg class="loading-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          }
          {{ data.confirmText || 'Eliminar' }}
        </button>
      </div>
    </div>
  `
})
export class DeleteConfirmationDialogComponent {
  @Input() modalRef!: ModalRef;
  @Input() data!: DeleteConfirmationData;

  isProcessing = signal(false);

  onConfirm(): void {
    if (this.isProcessing()) return;
    
    this.isProcessing.set(true);
    this.modalRef.close(true);
  }

  onCancel(): void {
    if (this.isProcessing()) return;
    
    this.modalRef.dismiss('cancel');
  }
}