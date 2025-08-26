import { Injectable, signal, ComponentRef, ViewContainerRef, Type } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface ModalConfig {
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  backdrop?: boolean;
  keyboard?: boolean;
  data?: any;
}

export interface ModalRef<T = any> {
  id: string;
  componentRef?: ComponentRef<T>;
  config: ModalConfig;
  result$: Subject<any>;
  close: (result?: any) => void;
  dismiss: (reason?: any) => void;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals = signal<ModalRef[]>([]);
  private viewContainer?: ViewContainerRef;
  private modalCounter = 0;

  constructor() {
    // Listen for escape key globally
    if (typeof window !== 'undefined') {
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          this.closeTopModal();
        }
      });
    }
  }

  /**
   * Set the view container for dynamic component creation
   */
  setViewContainer(viewContainer: ViewContainerRef): void {
    this.viewContainer = viewContainer;
  }

  /**
   * Open a modal with a component
   */
  open<T extends object>(component: Type<T>, config: ModalConfig = {}): ModalRef<T> {
    const modalId = `modal-${++this.modalCounter}`;
    const defaultConfig: ModalConfig = {
      size: 'md',
      closable: true,
      backdrop: true,
      keyboard: true,
      ...config
    };

    const modalRef: ModalRef<T> = {
      id: modalId,
      config: defaultConfig,
      result$: new Subject<any>(),
      close: (result?: any) => this.close(modalId, result),
      dismiss: (reason?: any) => this.dismiss(modalId, reason)
    };

    // Create component instance if view container is available
    if (this.viewContainer) {
      const componentRef = this.viewContainer.createComponent(component);
      modalRef.componentRef = componentRef;

      // Pass modal reference to component if it has a modalRef property
      if ('modalRef' in componentRef.instance) {
        (componentRef.instance as any).modalRef = modalRef;
      }

      // Pass data to component if provided
      if (config.data && 'data' in componentRef.instance) {
        (componentRef.instance as any).data = config.data;
      }
    }

    // Add modal to the stack
    const currentModals = this.modals();
    this.modals.set([...currentModals, modalRef]);

    return modalRef;
  }

  /**
   * Close a modal with a result
   */
  close(modalId: string, result?: any): void {
    const modal = this.findModal(modalId);
    if (modal) {
      modal.result$.next(result);
      modal.result$.complete();
      this.removeModal(modalId);
    }
  }

  /**
   * Dismiss a modal with a reason
   */
  dismiss(modalId: string, reason?: any): void {
    const modal = this.findModal(modalId);
    if (modal) {
      modal.result$.error(reason || 'dismissed');
      this.removeModal(modalId);
    }
  }

  /**
   * Close the topmost modal
   */
  closeTopModal(): void {
    const modals = this.modals();
    if (modals.length > 0) {
      const topModal = modals[modals.length - 1];
      if (topModal.config.keyboard !== false) {
        this.dismiss(topModal.id, 'escape');
      }
    }
  }

  /**
   * Close all modals
   */
  closeAll(): void {
    const modals = this.modals();
    modals.forEach(modal => this.dismiss(modal.id, 'closeAll'));
  }

  /**
   * Get all open modals
   */
  getModals(): ModalRef[] {
    return this.modals();
  }

  /**
   * Get modals as a signal for reactive updates
   */
  getModalsSignal() {
    return this.modals.asReadonly();
  }

  /**
   * Check if any modal is open
   */
  hasOpenModals(): boolean {
    return this.modals().length > 0;
  }

  /**
   * Get the result observable for a modal
   */
  getModalResult<T>(modalRef: ModalRef): Observable<T> {
    return modalRef.result$.asObservable();
  }

  private findModal(modalId: string): ModalRef | undefined {
    return this.modals().find(modal => modal.id === modalId);
  }

  private removeModal(modalId: string): void {
    const modal = this.findModal(modalId);
    if (modal) {
      // Destroy component if it exists
      if (modal.componentRef) {
        modal.componentRef.destroy();
      }

      // Remove from modals array
      const currentModals = this.modals();
      const updatedModals = currentModals.filter(m => m.id !== modalId);
      this.modals.set(updatedModals);
    }
  }
}