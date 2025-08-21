import { Component, EventEmitter, Output, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroXMark, heroExclamationTriangle } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [
    provideIcons({
      heroXMark,
      heroExclamationTriangle
    })
  ],
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent {
  isOpen = input(false);
  title = input('Confirmar acción');
  message = input('¿Estás seguro de que deseas continuar?');
  confirmText = input('Confirmar');
  cancelText = input('Cancelar');
  isLoading = input(false);
  type = input<'warning' | 'danger' | 'info'>('warning');
  
  confirm = output<void>();
  cancel = output<void>();

  onConfirm(): void {
    if (!this.isLoading()) {
      this.confirm.emit();
    }
  }

  onCancel(): void {
    if (!this.isLoading()) {
      this.cancel.emit();
    }
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget && !this.isLoading()) {
      this.onCancel();
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && !this.isLoading()) {
      this.onCancel();
    }
  }

  getIconName(): string {
    switch (this.type()) {
      case 'danger':
        return 'heroExclamationTriangle';
      case 'warning':
        return 'heroExclamationTriangle';
      case 'info':
      default:
        return 'heroExclamationTriangle';
    }
  }

  getIconColorClass(): string {
    switch (this.type()) {
      case 'danger':
        return 'text-red-600 dark:text-red-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'info':
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  }

  getConfirmButtonClass(): string {
    switch (this.type()) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500';
      case 'info':
      default:
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500';
    }
  }
}