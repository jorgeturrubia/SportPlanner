import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroExclamationTriangle } from '@ng-icons/heroicons/outline';

import { DeleteConfirmationDialogComponent, DeleteConfirmationData } from './delete-confirmation-dialog.component';
import { ModalRef } from '../../services/modal.service';

describe('DeleteConfirmationDialogComponent', () => {
  let component: DeleteConfirmationDialogComponent;
  let fixture: ComponentFixture<DeleteConfirmationDialogComponent>;
  let mockModalRef: jasmine.SpyObj<ModalRef>;

  const mockData: DeleteConfirmationData = {
    title: 'Delete Item',
    message: 'Are you sure you want to delete this item?',
    itemName: 'Test Item',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    destructive: true
  };

  beforeEach(async () => {
    mockModalRef = jasmine.createSpyObj('ModalRef', ['close', 'dismiss']);

    await TestBed.configureTestingModule({
      imports: [DeleteConfirmationDialogComponent, NgIcon],
      providers: [
        provideIcons({ heroExclamationTriangle })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteConfirmationDialogComponent);
    component = fixture.componentInstance;
    component.modalRef = mockModalRef;
    component.data = mockData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct title and message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    expect(compiled.textContent).toContain(mockData.title);
    expect(compiled.textContent).toContain(mockData.message);
    expect(compiled.textContent).toContain(mockData.itemName);
  });

  it('should display destructive warning when destructive is true', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    expect(compiled.textContent).toContain('Esta acción no se puede deshacer.');
  });

  it('should not display destructive warning when destructive is false', () => {
    component.data = { ...mockData, destructive: false };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).not.toContain('Esta acción no se puede deshacer.');
  });

  it('should display custom button texts', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    
    expect(compiled.textContent).toContain(mockData.confirmText);
    expect(compiled.textContent).toContain(mockData.cancelText);
  });

  it('should display default button texts when not provided', () => {
    component.data = {
      title: 'Delete Item',
      message: 'Are you sure?'
    };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Eliminar');
    expect(compiled.textContent).toContain('Cancelar');
  });

  it('should call modalRef.close(true) when confirm button is clicked', () => {
    const confirmButton = fixture.nativeElement.querySelector('button[type="button"]:last-child') as HTMLButtonElement;
    
    confirmButton.click();
    
    expect(mockModalRef.close).toHaveBeenCalledWith(true);
  });

  it('should call modalRef.dismiss when cancel button is clicked', () => {
    const cancelButton = fixture.nativeElement.querySelector('button[type="button"]:first-child') as HTMLButtonElement;
    
    cancelButton.click();
    
    expect(mockModalRef.dismiss).toHaveBeenCalledWith('cancel');
  });

  it('should set processing state when confirm is clicked', () => {
    expect(component.isProcessing()).toBeFalse();
    
    component.onConfirm();
    
    expect(component.isProcessing()).toBeTrue();
  });

  it('should disable buttons when processing', () => {
    component.isProcessing.set(true);
    fixture.detectChanges();
    
    const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    buttons.forEach(button => {
      expect(button.disabled).toBeTrue();
    });
  });

  it('should show loading spinner when processing', () => {
    component.isProcessing.set(true);
    fixture.detectChanges();
    
    const spinner = fixture.nativeElement.querySelector('.loading-spinner');
    expect(spinner).toBeTruthy();
  });

  it('should not call methods when processing and buttons are clicked', () => {
    component.isProcessing.set(true);
    
    component.onConfirm();
    component.onCancel();
    
    // Should only be called once from the initial setup, not from the method calls above
    expect(mockModalRef.close).not.toHaveBeenCalled();
    expect(mockModalRef.dismiss).not.toHaveBeenCalled();
  });

  it('should handle missing itemName gracefully', () => {
    component.data = {
      title: 'Delete Item',
      message: 'Are you sure?'
    };
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p.font-medium')).toBeFalsy();
  });

  it('should have proper accessibility attributes', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    
    buttons.forEach(button => {
      expect(button.type).toBe('button');
    });
  });

  it('should have proper CSS classes for styling', () => {
    const confirmButton = fixture.nativeElement.querySelector('button:last-child') as HTMLButtonElement;
    const cancelButton = fixture.nativeElement.querySelector('button:first-child') as HTMLButtonElement;
    
    expect(confirmButton.classList).toContain('btn-delete');
    expect(cancelButton.classList).toContain('btn-cancel');
  });
});