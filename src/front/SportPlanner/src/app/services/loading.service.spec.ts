import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Loading State Management', () => {
    it('should start with loading state as false', () => {
      expect(service.isCurrentlyLoading()).toBeFalse();
      expect(service.getLoadingSignal()()).toBeFalse();
    });

    it('should set loading to true when show() is called', () => {
      service.show();
      
      expect(service.isCurrentlyLoading()).toBeTrue();
      expect(service.getLoadingSignal()()).toBeTrue();
    });

    it('should set loading to false when hide() is called', () => {
      service.show();
      service.hide();
      
      expect(service.isCurrentlyLoading()).toBeFalse();
      expect(service.getLoadingSignal()()).toBeFalse();
    });

    it('should handle multiple show() calls correctly', () => {
      service.show();
      service.show();
      service.show();
      
      expect(service.isCurrentlyLoading()).toBeTrue();
      expect(service.getLoadingSignal()()).toBeTrue();
      
      // Should still be loading after one hide()
      service.hide();
      expect(service.isCurrentlyLoading()).toBeTrue();
      expect(service.getLoadingSignal()()).toBeTrue();
      
      // Should still be loading after second hide()
      service.hide();
      expect(service.isCurrentlyLoading()).toBeTrue();
      expect(service.getLoadingSignal()()).toBeTrue();
      
      // Should be false after third hide()
      service.hide();
      expect(service.isCurrentlyLoading()).toBeFalse();
      expect(service.getLoadingSignal()()).toBeFalse();
    });

    it('should not go below zero when hide() is called more than show()', () => {
      service.hide();
      service.hide();
      
      expect(service.isCurrentlyLoading()).toBeFalse();
      expect(service.getLoadingSignal()()).toBeFalse();
      
      service.show();
      expect(service.isCurrentlyLoading()).toBeTrue();
      expect(service.getLoadingSignal()()).toBeTrue();
      
      service.hide();
      expect(service.isCurrentlyLoading()).toBeFalse();
      expect(service.getLoadingSignal()()).toBeFalse();
    });

    it('should force hide loading regardless of counter', () => {
      service.show();
      service.show();
      service.show();
      
      expect(service.isCurrentlyLoading()).toBeTrue();
      
      service.forceHide();
      
      expect(service.isCurrentlyLoading()).toBeFalse();
      expect(service.getLoadingSignal()()).toBeFalse();
    });
  });

  describe('Observable State', () => {
    it('should emit loading state changes through observable', (done) => {
      const states: boolean[] = [];
      
      service.getLoadingState().subscribe(state => {
        states.push(state);
        
        if (states.length === 3) {
          expect(states).toEqual([false, true, false]);
          done();
        }
      });
      
      service.show();
      service.hide();
    });
  });

  describe('withLoading method', () => {
    it('should show loading during observable execution and hide when complete', (done) => {
      const mockObservable = of('test data');
      
      expect(service.isCurrentlyLoading()).toBeFalse();
      
      service.withLoading(() => mockObservable).subscribe({
        next: (data) => {
          expect(data).toBe('test data');
        },
        complete: () => {
          // Should be hidden after completion
          setTimeout(() => {
            expect(service.isCurrentlyLoading()).toBeFalse();
            done();
          }, 0);
        }
      });
      
      // Should be loading during execution
      expect(service.isCurrentlyLoading()).toBeTrue();
    });

    it('should hide loading even when observable errors', (done) => {
      const mockError = new Error('Test error');
      const mockObservable = throwError(() => mockError);
      
      expect(service.isCurrentlyLoading()).toBeFalse();
      
      service.withLoading(() => mockObservable).subscribe({
        error: (error) => {
          expect(error).toBe(mockError);
          
          // Should be hidden after error
          setTimeout(() => {
            expect(service.isCurrentlyLoading()).toBeFalse();
            done();
          }, 0);
        }
      });
      
      // Should be loading during execution
      expect(service.isCurrentlyLoading()).toBeTrue();
    });
  });
});