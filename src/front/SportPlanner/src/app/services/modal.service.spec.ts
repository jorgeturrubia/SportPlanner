import { TestBed } from '@angular/core/testing';
import { Component, ViewContainerRef } from '@angular/core';
import { ModalService, ModalConfig } from './modal.service';

@Component({
  template: '<div>Test Component</div>'
})
class TestComponent {
  modalRef?: any;
  data?: any;
}

describe('ModalService', () => {
  let service: ModalService;
  let mockViewContainer: jasmine.SpyObj<ViewContainerRef>;

  beforeEach(() => {
    const viewContainerSpy = jasmine.createSpyObj('ViewContainerRef', ['createComponent']);

    TestBed.configureTestingModule({
      providers: [
        ModalService,
        { provide: ViewContainerRef, useValue: viewContainerSpy }
      ]
    });

    service = TestBed.inject(ModalService);
    mockViewContainer = TestBed.inject(ViewContainerRef) as jasmine.SpyObj<ViewContainerRef>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('open', () => {
    it('should open a modal with default config', () => {
      const modalRef = service.open(TestComponent);

      expect(modalRef).toBeDefined();
      expect(modalRef.id).toMatch(/^modal-\d+$/);
      expect(modalRef.config.size).toBe('md');
      expect(modalRef.config.closable).toBe(true);
      expect(modalRef.config.backdrop).toBe(true);
      expect(modalRef.config.keyboard).toBe(true);
    });

    it('should open a modal with custom config', () => {
      const config: ModalConfig = {
        title: 'Test Modal',
        size: 'lg',
        closable: false,
        backdrop: false,
        keyboard: false,
        data: { test: 'data' }
      };

      const modalRef = service.open(TestComponent, config);

      expect(modalRef.config.title).toBe('Test Modal');
      expect(modalRef.config.size).toBe('lg');
      expect(modalRef.config.closable).toBe(false);
      expect(modalRef.config.backdrop).toBe(false);
      expect(modalRef.config.keyboard).toBe(false);
      expect(modalRef.config.data).toEqual({ test: 'data' });
    });

    it('should add modal to the modals list', () => {
      expect(service.getModals().length).toBe(0);

      service.open(TestComponent);

      expect(service.getModals().length).toBe(1);
    });

    it('should create component when view container is available', () => {
      const mockComponentRef = {
        instance: new TestComponent(),
        destroy: jasmine.createSpy('destroy'),
        location: {},
        injector: {},
        hostView: {},
        changeDetectorRef: {},
        componentType: TestComponent,
        setInput: jasmine.createSpy('setInput'),
        onDestroy: jasmine.createSpy('onDestroy')
      };
      mockViewContainer.createComponent.and.returnValue(mockComponentRef as any);
      service.setViewContainer(mockViewContainer);

      const modalRef = service.open(TestComponent);

      expect(mockViewContainer.createComponent).toHaveBeenCalledWith(jasmine.any(Function));
      expect(modalRef.componentRef).toBeDefined();
    });
  });

  describe('close', () => {
    it('should close a modal and emit result', (done) => {
      const modalRef = service.open(TestComponent);
      const testResult = { success: true };

      modalRef.result$.subscribe({
        next: (result) => {
          expect(result).toEqual(testResult);
          done();
        }
      });

      service.close(modalRef.id, testResult);
      expect(service.getModals().length).toBe(0);
    });

    it('should not close non-existent modal', () => {
      service.open(TestComponent);
      const initialCount = service.getModals().length;

      service.close('non-existent-id');

      expect(service.getModals().length).toBe(initialCount);
    });
  });

  describe('dismiss', () => {
    it('should dismiss a modal and emit error', (done) => {
      const modalRef = service.open(TestComponent);
      const testReason = 'user cancelled';

      modalRef.result$.subscribe({
        error: (reason) => {
          expect(reason).toBe(testReason);
          done();
        }
      });

      service.dismiss(modalRef.id, testReason);
      expect(service.getModals().length).toBe(0);
    });

    it('should dismiss with default reason when none provided', (done) => {
      const modalRef = service.open(TestComponent);

      modalRef.result$.subscribe({
        error: (reason) => {
          expect(reason).toBe('dismissed');
          done();
        }
      });

      service.dismiss(modalRef.id);
    });
  });

  describe('closeTopModal', () => {
    it('should close the topmost modal', () => {
      const modal1 = service.open(TestComponent);
      const modal2 = service.open(TestComponent);

      expect(service.getModals().length).toBe(2);

      service.closeTopModal();

      expect(service.getModals().length).toBe(1);
      expect(service.getModals()[0].id).toBe(modal1.id);
    });

    it('should not close modal if keyboard is disabled', () => {
      service.open(TestComponent, { keyboard: false });

      expect(service.getModals().length).toBe(1);

      service.closeTopModal();

      expect(service.getModals().length).toBe(1);
    });

    it('should do nothing when no modals are open', () => {
      expect(service.getModals().length).toBe(0);

      service.closeTopModal();

      expect(service.getModals().length).toBe(0);
    });
  });

  describe('closeAll', () => {
    it('should close all open modals', () => {
      service.open(TestComponent);
      service.open(TestComponent);
      service.open(TestComponent);

      expect(service.getModals().length).toBe(3);

      service.closeAll();

      expect(service.getModals().length).toBe(0);
    });
  });

  describe('hasOpenModals', () => {
    it('should return false when no modals are open', () => {
      expect(service.hasOpenModals()).toBe(false);
    });

    it('should return true when modals are open', () => {
      service.open(TestComponent);

      expect(service.hasOpenModals()).toBe(true);
    });
  });

  describe('getModalResult', () => {
    it('should return the result observable', () => {
      const modalRef = service.open(TestComponent);
      const result$ = service.getModalResult(modalRef);

      expect(result$).toBe(modalRef.result$.asObservable());
    });
  });
});