import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html'
})
export class ConfirmDialogComponent {
  @Input() title: string = '¿Estás seguro?';
  @Input() message: string = '';
  @Input() confirmText: string = 'Eliminar';
  @Input() cancelText: string = 'Cancelar';
  @Input() isVisible: boolean = false;
  @Input() isLoading: boolean = false;
  
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() visibilityChange = new EventEmitter<boolean>();

  onConfirm() {
    if (!this.isLoading) {
      this.confirm.emit();
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  closeDialog() {
    this.visibilityChange.emit(false);
  }

  // Also close when clicking outside the modal
  onBackdropClick() {
    if (!this.isLoading) {
      this.closeDialog();
    }
  }

  // Close on escape key
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && !this.isLoading) {
      this.closeDialog();
    }
  }
}