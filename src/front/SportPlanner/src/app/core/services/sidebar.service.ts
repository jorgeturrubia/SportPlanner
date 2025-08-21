import { Injectable, signal, computed, effect } from '@angular/core';

export interface SidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  width: number;
  collapsedWidth: number;
}

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private readonly STORAGE_KEY = 'sidebar-collapsed';
  private readonly MOBILE_BREAKPOINT = 768;
  private readonly SIDEBAR_WIDTH = 280;
  private readonly SIDEBAR_COLLAPSED_WIDTH = 64;
  
  // Private signals for internal state management
  private _isCollapsed = signal<boolean>(this.getStoredCollapsedState());
  private _isMobileOpen = signal<boolean>(false);
  private _isMobileBreakpoint = signal<boolean>(this.checkMobileBreakpoint());
  
  // Public readonly signals
  readonly isCollapsed = this._isCollapsed.asReadonly();
  readonly isMobileOpen = this._isMobileOpen.asReadonly();
  readonly isMobileBreakpoint = this._isMobileBreakpoint.asReadonly();
  
  // Computed signal for complete sidebar state
  readonly sidebarState = computed<SidebarState>(() => ({
    isCollapsed: this._isCollapsed(),
    isMobileOpen: this._isMobileOpen(),
    width: this.SIDEBAR_WIDTH,
    collapsedWidth: this.SIDEBAR_COLLAPSED_WIDTH
  }));
  
  // Computed signal for current width based on state
  readonly currentWidth = computed<number>(() => {
    if (this._isMobileBreakpoint()) {
      return this._isMobileOpen() ? this.SIDEBAR_WIDTH : 0;
    }
    return this._isCollapsed() ? this.SIDEBAR_COLLAPSED_WIDTH : this.SIDEBAR_WIDTH;
  });
  
  // Computed signal for CSS classes
  readonly cssClasses = computed<string[]>(() => {
    const classes: string[] = ['sidebar-transition'];
    
    if (this._isCollapsed()) {
      classes.push('sidebar-collapsed');
    }
    
    if (this._isMobileOpen()) {
      classes.push('sidebar-mobile-open');
    }
    
    if (this._isMobileBreakpoint()) {
      classes.push('sidebar-mobile');
    }
    
    return classes;
  });

  constructor() {
    // Listen for window resize events
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        this._isMobileBreakpoint.set(this.checkMobileBreakpoint());
      });
    }
    
    // Effect to persist collapsed state
    effect(() => {
      const collapsed = this._isCollapsed();
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, collapsed.toString());
      }
    });
    
    // Effect to close mobile sidebar when switching to desktop
    effect(() => {
      if (!this._isMobileBreakpoint() && this._isMobileOpen()) {
        this._isMobileOpen.set(false);
      }
    });
  }

  /**
   * Toggle sidebar collapsed state (desktop only)
   */
  toggle(): void {
    this._isCollapsed.update(collapsed => !collapsed);
  }

  /**
   * Collapse sidebar (desktop only)
   */
  collapse(): void {
    this._isCollapsed.set(true);
  }

  /**
   * Expand sidebar (desktop only)
   */
  expand(): void {
    this._isCollapsed.set(false);
  }

  /**
   * Set mobile sidebar open state
   */
  setMobileOpen(open: boolean): void {
    this._isMobileOpen.set(open);
  }

  /**
   * Toggle mobile sidebar
   */
  toggleMobile(): void {
    this._isMobileOpen.update(open => !open);
  }

  /**
   * Close mobile sidebar
   */
  closeMobile(): void {
    this._isMobileOpen.set(false);
  }

  /**
   * Check if current viewport is mobile breakpoint
   */
  private checkMobileBreakpoint(): boolean {
    if (typeof window === 'undefined') {
      return false; // SSR fallback
    }
    return window.innerWidth < this.MOBILE_BREAKPOINT;
  }

  /**
   * Get stored collapsed state from localStorage
   */
  private getStoredCollapsedState(): boolean {
    if (typeof localStorage === 'undefined') {
      return false; // SSR fallback
    }
    
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored === 'true';
  }

  /**
   * Get sidebar width for CSS calculations
   */
  getSidebarWidth(): string {
    return `${this.SIDEBAR_WIDTH}px`;
  }

  /**
   * Get collapsed sidebar width for CSS calculations
   */
  getCollapsedWidth(): string {
    return `${this.SIDEBAR_COLLAPSED_WIDTH}px`;
  }

  /**
   * Get CSS custom properties for sidebar
   */
  getCSSProperties(): Record<string, string> {
    return {
      '--sidebar-width': this.getSidebarWidth(),
      '--sidebar-collapsed-width': this.getCollapsedWidth(),
      '--sidebar-current-width': `${this.currentWidth()}px`
    };
  }

  /**
   * Check if sidebar should show overlay (mobile only)
   */
  shouldShowOverlay(): boolean {
    return this._isMobileBreakpoint() && this._isMobileOpen();
  }

  /**
   * Handle overlay click (close mobile sidebar)
   */
  handleOverlayClick(): void {
    if (this._isMobileBreakpoint()) {
      this.closeMobile();
    }
  }

  /**
   * Handle escape key press
   */
  handleEscapeKey(): void {
    if (this._isMobileBreakpoint() && this._isMobileOpen()) {
      this.closeMobile();
    }
  }
}