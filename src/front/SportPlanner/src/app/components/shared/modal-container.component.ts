import { Component, ViewChild, ViewContainerRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService, ModalRef } from '../../services/modal.service';
import { ModalComponent } from './modal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-container',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  template: `
    <!-- Dynamic Modal Container -->
    <div #modalContainer></div>
    
    <!-- Static Modals (if any) -->
    @for (modal of modalService.getModalsSignal()(); track modal.id) {
      <app-modal
        [title]="modal.config.title"
        [size]="modal.config.size || 'md'"
        [closable]="modal.config.closable !== false"
        [backdrop]="modal.config.backdrop !== false"
        [keyboard]="modal.config.keyboard !== false"
        (closed)="onModalClosed(modal, $event)"
        (dismissed)="onModalDismissed(modal, $event)"
      >
        <!-- Dynamic content will be inserted here -->
      </app-modal>
    }
  `
})
export class ModalContainerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer!: ViewContainerRef;
  
  private subscriptions: Subscription[] = [];

  constructor(public modalService: ModalService) {}

  ngAfterViewInit(): void {
    // Set the view container for dynamic component creation
    this.modalService.setViewContainer(this.modalContainer);
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    
    // Close all modals
    this.modalService.closeAll();
  }

  onModalClosed(modal: ModalRef, result: any): void {
    modal.result$.next(result);
    modal.result$.complete();
  }

  onModalDismissed(modal: ModalRef, reason: any): void {
    modal.result$.error(reason || 'dismissed');
  }
}