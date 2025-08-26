import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private loadingCount = 0;
  private isLoading = signal<boolean>(false);

  constructor() {}

  /**
   * Show loading indicator
   */
  show(): void {
    this.loadingCount++;
    if (this.loadingCount === 1) {
      this.isLoading.set(true);
      this.loadingSubject.next(true);
    }
  }

  /**
   * Hide loading indicator
   */
  hide(): void {
    this.loadingCount = Math.max(0, this.loadingCount - 1);
    if (this.loadingCount === 0) {
      this.isLoading.set(false);
      this.loadingSubject.next(false);
    }
  }

  /**
   * Force hide loading indicator (reset counter)
   */
  forceHide(): void {
    this.loadingCount = 0;
    this.isLoading.set(false);
    this.loadingSubject.next(false);
  }

  /**
   * Get loading state as observable
   */
  getLoadingState(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  /**
   * Get loading state as signal
   */
  getLoadingSignal() {
    return this.isLoading.asReadonly();
  }

  /**
   * Check if currently loading
   */
  isCurrentlyLoading(): boolean {
    return this.loadingCount > 0;
  }

  /**
   * Execute a function with loading state
   */
  withLoading<T>(fn: () => Observable<T>): Observable<T> {
    this.show();
    return fn().pipe(
      finalize(() => this.hide())
    );
  }
}