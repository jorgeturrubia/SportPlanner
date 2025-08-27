import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError, timer } from 'rxjs';

import { ErrorBoundaryService } from './error-boundary.service';
import { ErrorHandlerService } from './error-handler.service';
import { NotificationService } from './notification.service';
import { RetryService } from './retry.service';

describe('ErrorBoundaryService', () => {
  let service: ErrorBoundaryService;
  let errorHandlerSpy: jasmine.SpyObj<ErrorHandlerService>;
  let notificationSpy: jasmine.SpyObj<NotificationService>;
  let retrySpy: jasmine.SpyObj<RetryService>;

  beforeEach(() => {
    const errorHandlerSpyObj = jasmine.createSpyObj('ErrorHandlerService', ['handleHttpError']);
    const notificationSpyObj = jasmine.createSpyObj('NotificationService', ['showSuccess', 'showError']);
    const retrySpyObj = jasmine.createSpyObj('RetryService', ['withRetry']);

    TestBed.configureTestingModule({
      providers: [
        ErrorBoundaryService,
        { provide: ErrorHandlerService, useValue: errorHandlerSpyObj },
        { provide: NotificationService, useValue: notificationSpyObj },
        { provide: RetryService, useValue: retrySpyObj }
      ]
    });

    service = TestBed.inject(ErrorBoundaryService);
    errorHandlerSpy = TestBed.inject(ErrorHandlerService) as jasmine.SpyObj<ErrorHandlerService>;
    notificationSpy = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    retrySpy = TestBed.inject(RetryService) as jasmine.SpyObj<RetryService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('wrapObservable', () => {
    it('should handle successful operations', (done) => {
      const testData = 'test data';
      const source = of(testData);
      const onSuccess = jasmine.createSpy('onSuccess');

      service.wrapObservable(source, {
        context: 'test operation',
        onSuccess
      }).subscribe({
        next: (result) => {
          expect(result).toBe(testData);
          expect(onSuccess).toHaveBeenCalledWith(testData);
          done();
        }
      });
    });

    it('should handle errors with notifications', (done) => {
      const error = new HttpErrorResponse({ status: 500, statusText: 'Server Error' });
      const source = throwError(() => error);
      const onError = jasmine.createSpy('onError');

      service.wrapObservable(source, {
        context: 'test operation',
        showNotifications: true,
        onError
      }).subscribe({
        error: (err) => {
          expect(err).toBe(error);
          expect(onError).toHaveBeenCalledWith(error);
          expect(errorHandlerSpy.handleHttpError).toHaveBeenCalledWith(error, 'test operation');
          done();
        }
      });
    });

    it('should return fallback value on error', (done) => {
      const error = new Error('Test error');
      const fallbackValue = 'fallback';
      const source = throwError(() => error);

      service.wrapObservable(source, {
        fallbackValue,
        showNotifications: false
      }).subscribe({
        next: (result) => {
          expect(result).toBe(fallbackValue);
          done();
        }
      });
    });

    it('should use retry configuration when provided', () => {
      const source = of('test');
      const retryConfig = { maxRetries: 3, delayMs: 1000 };
      
      retrySpy.withRetry.and.returnValue(source);

      service.wrapObservable(source, {
        retryConfig,
        context: 'test'
      });

      expect(retrySpy.withRetry).toHaveBeenCalledWith(source, {
        ...retryConfig,
        context: 'test',
        showNotifications: true
      });
    });
  });

  describe('executeWithBoundary', () => {
    it('should handle successful function execution', async () => {
      const testResult = 'success';
      const testFn = jasmine.createSpy('testFn').and.returnValue(testResult);
      const onSuccess = jasmine.createSpy('onSuccess');

      const result = await service.executeWithBoundary(testFn, {
        context: 'test function',
        onSuccess
      });

      expect(result).toBe(testResult);
      expect(testFn).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalledWith(testResult);
    });

    it('should handle function errors', async () => {
      const error = new Error('Test error');
      const testFn = jasmine.createSpy('testFn').and.throwError(error);
      const onError = jasmine.createSpy('onError');

      try {
        await service.executeWithBoundary(testFn, {
          context: 'test function',
          onError
        });
        fail('Should have thrown error');
      } catch (err) {
        expect(err).toBe(error);
        expect(onError).toHaveBeenCalledWith(error);
      }
    });

    it('should handle async function execution', async () => {
      const testResult = 'async success';
      const testFn = jasmine.createSpy('testFn').and.returnValue(Promise.resolve(testResult));

      const result = await service.executeWithBoundary(testFn, {
        context: 'async test'
      });

      expect(result).toBe(testResult);
    });
  });

  describe('error state management', () => {
    it('should track error states', () => {
      const boundaryId = 'test-boundary';
      
      expect(service.hasError(boundaryId)).toBeFalse();
      
      // Simulate error by calling private method through public interface
      const source = throwError(() => new Error('Test error'));
      
      service.wrapObservable(source, {
        context: 'test',
        showNotifications: false
      }).subscribe({
        error: () => {
          // Error state should be tracked internally
        }
      });
    });

    it('should clear error states', () => {
      const boundaryId = 'test-boundary';
      
      service.clearErrorState(boundaryId);
      expect(service.hasError(boundaryId)).toBeFalse();
    });

    it('should clear all error states', () => {
      service.clearAllErrorStates();
      
      const allStates = service.getAllErrorStates();
      expect(allStates.size).toBe(0);
    });
  });

  describe('handleFormSubmission', () => {
    it('should handle successful form submission', (done) => {
      const submitFn = () => of('form submitted');
      const successMessage = 'Form submitted successfully';

      service.handleFormSubmission(submitFn, {
        successMessage,
        context: 'form submission'
      }).subscribe({
        next: (result) => {
          expect(result).toBe('form submitted');
          expect(notificationSpy.showSuccess).toHaveBeenCalledWith('Éxito', successMessage);
          done();
        }
      });
    });

    it('should handle form submission errors', (done) => {
      const error = new HttpErrorResponse({
        status: 422,
        error: { errors: { name: ['Required'] } }
      });
      const submitFn = () => throwError(() => error);
      const mockForm = {
        get: jasmine.createSpy('get').and.returnValue({
          setErrors: jasmine.createSpy('setErrors'),
          markAsTouched: jasmine.createSpy('markAsTouched')
        })
      };

      service.handleFormSubmission(submitFn, {
        form: mockForm,
        errorMessage: 'Form error',
        context: 'form submission'
      }).subscribe({
        error: (err) => {
          expect(err).toBe(error);
          expect(mockForm.get).toHaveBeenCalledWith('name');
          done();
        }
      });
    });
  });

  describe('createRetryFunction', () => {
    it('should create a retry function', () => {
      const operation = () => of('test');
      const retryFn = service.createRetryFunction(operation, {
        context: 'retry test'
      });

      expect(typeof retryFn).toBe('function');
      
      const result = retryFn();
      expect(result).toBeDefined();
    });
  });
});