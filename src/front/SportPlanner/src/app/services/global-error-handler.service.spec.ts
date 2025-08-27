import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';

import { GlobalErrorHandlerService } from './global-error-handler.service';
import { NotificationService } from './notification.service';
import { ErrorHandlerService } from './error-handler.service';

describe('GlobalErrorHandlerService', () => {
  let service: GlobalErrorHandlerService;
  let notificationSpy: jasmine.SpyObj<NotificationService>;
  let errorHandlerSpy: jasmine.SpyObj<ErrorHandlerService>;

  beforeEach(() => {
    const notificationSpyObj = jasmine.createSpyObj('NotificationService', ['showError', 'showWarning']);
    const errorHandlerSpyObj = jasmine.createSpyObj('ErrorHandlerService', ['logError']);

    TestBed.configureTestingModule({
      providers: [
        GlobalErrorHandlerService,
        { provide: NotificationService, useValue: notificationSpyObj },
        { provide: ErrorHandlerService, useValue: errorHandlerSpyObj }
      ]
    });

    service = TestBed.inject(GlobalErrorHandlerService);
    notificationSpy = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    errorHandlerSpy = TestBed.inject(ErrorHandlerService) as jasmine.SpyObj<ErrorHandlerService>;
  });

  beforeEach(() => {
    // Reset error count before each test
    service.resetErrorCount();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('handleError', () => {
    it('should ignore HTTP errors', () => {
      const httpError = new HttpErrorResponse({ status: 500 });
      
      service.handleError(httpError);
      
      expect(errorHandlerSpy.logError).toHaveBeenCalledWith(httpError, 'GLOBAL', jasmine.any(Object));
      expect(notificationSpy.showError).not.toHaveBeenCalled();
    });

    it('should handle JavaScript errors based on severity', () => {
      const criticalError = new Error('ChunkLoadError: Loading chunk failed');
      
      spyOn(window.location, 'reload');
      
      service.handleError(criticalError);
      
      expect(errorHandlerSpy.logError).toHaveBeenCalled();
      expect(notificationSpy.showError).toHaveBeenCalledWith(
        'Error crítico',
        jasmine.stringContaining('error crítico'),
        true
      );
    });

    it('should handle high severity errors', () => {
      const highSeverityError = new ReferenceError('Variable is not defined');
      
      service.handleError(highSeverityError);
      
      expect(notificationSpy.showError).toHaveBeenCalledWith(
        'Error de aplicación',
        jasmine.stringContaining('error que puede afectar'),
        true
      );
    });

    it('should handle medium severity errors', () => {
      const mediumSeverityError = new Error('Network error occurred');
      
      service.handleError(mediumSeverityError);
      
      expect(notificationSpy.showError).toHaveBeenCalledWith(
        'Error',
        jasmine.stringContaining('La aplicación debería seguir funcionando')
      );
    });

    it('should ignore expected errors', () => {
      const expectedError = new Error('ResizeObserver loop limit exceeded');
      
      service.handleError(expectedError);
      
      expect(errorHandlerSpy.logError).toHaveBeenCalled();
      expect(notificationSpy.showError).not.toHaveBeenCalled();
    });

    it('should handle promise rejections', () => {
      const promiseRejection = {
        rejection: new Error('Promise rejected')
      };
      
      service.handleError(promiseRejection);
      
      expect(errorHandlerSpy.logError).toHaveBeenCalled();
      expect(notificationSpy.showError).toHaveBeenCalled();
    });

    it('should handle unknown errors', () => {
      const unknownError = 'String error';
      
      service.handleError(unknownError);
      
      expect(errorHandlerSpy.logError).toHaveBeenCalled();
      expect(notificationSpy.showError).toHaveBeenCalledWith(
        'Error desconocido',
        jasmine.stringContaining('String error')
      );
    });

    it('should prevent error flooding', () => {
      const error = new Error('Test error');
      
      // Trigger multiple errors to exceed the limit
      for (let i = 0; i < 15; i++) {
        service.handleError(error);
      }
      
      // Should have logged all errors but only shown notifications for the first 10
      expect(errorHandlerSpy.logError).toHaveBeenCalledTimes(15);
      expect(notificationSpy.showError).toHaveBeenCalledTimes(10);
    });
  });

  describe('error severity classification', () => {
    it('should classify critical errors correctly', () => {
      const criticalErrors = [
        new Error('ChunkLoadError'),
        new Error('Loading chunk failed'),
        new Error('Script error'),
        new Error('Out of memory')
      ];
      
      criticalErrors.forEach(error => {
        service.resetErrorCount();
        spyOn(window.location, 'reload');
        
        service.handleError(error);
        
        expect(notificationSpy.showError).toHaveBeenCalledWith(
          'Error crítico',
          jasmine.any(String),
          true
        );
      });
    });

    it('should classify high severity errors correctly', () => {
      const highSeverityErrors = [
        new ReferenceError('Variable not defined'),
        new TypeError('Cannot read property of undefined'),
        new RangeError('Invalid array length'),
        new SyntaxError('Unexpected token')
      ];
      
      highSeverityErrors.forEach(error => {
        service.resetErrorCount();
        
        service.handleError(error);
        
        expect(notificationSpy.showError).toHaveBeenCalledWith(
          'Error de aplicación',
          jasmine.any(String),
          true
        );
      });
    });
  });

  describe('error count management', () => {
    it('should track error count', () => {
      expect(service.getErrorCount()).toBe(0);
      
      service.handleError(new Error('Test error'));
      expect(service.getErrorCount()).toBe(1);
      
      service.handleError(new Error('Another error'));
      expect(service.getErrorCount()).toBe(2);
    });

    it('should reset error count', () => {
      service.handleError(new Error('Test error'));
      expect(service.getErrorCount()).toBe(1);
      
      service.resetErrorCount();
      expect(service.getErrorCount()).toBe(0);
    });
  });

  describe('error monitoring', () => {
    it('should send errors to monitoring service', () => {
      spyOn(console, 'group');
      spyOn(console, 'error');
      spyOn(console, 'log');
      spyOn(console, 'groupEnd');
      
      const error = new Error('Test monitoring error');
      
      service.handleError(error);
      
      // In development, should log to console
      expect(console.group).toHaveBeenCalledWith('🚨 Error Report');
      expect(console.error).toHaveBeenCalledWith('Error:', error);
      expect(console.groupEnd).toHaveBeenCalled();
    });
  });
});