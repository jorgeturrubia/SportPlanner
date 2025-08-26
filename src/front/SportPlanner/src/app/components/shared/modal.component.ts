import { Component, Input, Output, EventEmitter, signal, OnInit, OnDestroy, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { ModalService, ModalRef, ModalConfig } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, NgIcon],
  template: `
    <!-- Modal Backdrop -->
    @if (isVisible()) {
      <div 
        class="fixed inset-0 z-50 overflow-y-auto"
        [class.animate-fade-in]="isVisible()"
        [class.animate-fade-out]="!isVisible()"
      >
        <!-- Backdrop -->
        <div 
          class="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          [class.opacity-100]="isVisible()"
          [class.opacity-0]="!isVisible()"
          (click)="onBackdropClick()"
          [attr.aria-hidden]="true"
        ></div>

        <!-- Modal Container -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div 
            class="relative w-full transform overflow-hidden rounded-lg bg-white shadow-xl transition-all duration-300"
            [class]="getModalSizeClass()"
            [class.scale-100]="isVisible()"
            [class.scale-95]="!isVisible()"
            role="dialog"
            [attr.aria-modal]="true"
            [attr.aria-labelledby]="modalRef?.id + '-title'"
          >
            <!-- Modal Header -->
            @if (showHeaderInput()) {
              <div class="flex items-center justify-between p-6 pb-4">
                <h3 
                  [id]="modalRef?.id + '-title'"
                  class="text-lg font-semibold text-secondary-900"
                >
                  {{ title || modalRef?.config?.title || 'Modal' }}
                </h3>
                
                @if (modalRef?.config?.closable ?? closable) {
                  <button
                    type="button"
                    (click)="close()"
                    class="rounded-md p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 transition-colors duration-200"
                    [attr.aria-label]="'Cerrar ' + (title || 'modal')"
                  >
                    <ng-icon name="heroXMark" class="h-5 w-5"></ng-icon>
                  </button>
                }
              </div>
            }

            <!-- Modal Body -->
            <div class="px-6" [class.pt-6]="!showHeaderInput()">
              <!-- Content Projection -->
              <ng-content></ng-content>
              
              <!-- Dynamic Component Container -->
              <div #dynamicContent></div>
            </div>

            <!-- Modal Footer -->
            @if (showFooterInput()) {
              <div class="flex items-center justify-end space-x-3 p-6 pt-4 bg-secondary-50 rounded-b-lg">
                <ng-content select="[slot=footer]"></ng-content>
                
                @if (!hasFooterContentSignal()) {
                  <button
                    type="button"
                    (click)="close()"
                    class="btn-secondary"
                  >
                    Cerrar
                  </button>
                }
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes fade-out {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    
    .animate-fade-in {
      animation: fade-in 0.3s ease-out;
    }
    
    .animate-fade-out {
      animation: fade-out 0.3s ease-out;
    }
  `]
})
export class ModalComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() title?: string;
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md';
  @Input() closable = true;
  @Input() backdrop = true;
  @Input() keyboard = true;
  @Input() showHeaderInput = signal(true);
  @Input() showFooterInput = signal(false);

  @Output() closed = new EventEmitter<any>();
  @Output() dismissed = new EventEmitter<any>();

  @ViewChild('dynamicContent', { read: ViewContainerRef }) dynamicContent!: ViewContainerRef;

  modalRef?: ModalRef;
  isVisible = signal(false);
  hasFooterContentSignal = signal(false);

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    // Show modal with animation
    setTimeout(() => this.isVisible.set(true), 10);
  }

  ngAfterViewInit(): void {
    // Set view container for dynamic components
    if (this.dynamicContent) {
      this.modalService.setViewContainer(this.dynamicContent);
    }

    // Check if footer content is projected
    this.checkFooterContent();
  }

  ngOnDestroy(): void {
    // Ensure modal is removed from service
    if (this.modalRef) {
      this.modalService.dismiss(this.modalRef.id, 'destroyed');
    }
  }

  onBackdropClick(): void {
    if (this.backdrop && this.closable) {
      this.dismiss('backdrop');
    }
  }

  close(result?: any): void {
    this.isVisible.set(false);
    
    // Wait for animation to complete before actually closing
    setTimeout(() => {
      if (this.modalRef) {
        this.modalRef.close(result);
      }
      this.closed.emit(result);
    }, 300);
  }

  dismiss(reason?: any): void {
    this.isVisible.set(false);
    
    // Wait for animation to complete before actually dismissing
    setTimeout(() => {
      if (this.modalRef) {
        this.modalRef.dismiss(reason);
      }
      this.dismissed.emit(reason);
    }, 300);
  }

  getModalSizeClass(): string {
    const sizeToUse = this.modalRef?.config.size || this.size;
    
    const sizeClasses = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      full: 'max-w-full mx-4'
    };

    return sizeClasses[sizeToUse] || sizeClasses.md;
  }

  private checkFooterContent(): void {
    // This would need to be implemented based on content projection
    // For now, we'll assume no footer content unless explicitly set
    this.hasFooterContentSignal.set(false);
  }
}