import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private readonly RETURN_URL_KEY = 'sp_return_url';
  private readonly LAST_ROUTE_KEY = 'sp_last_route';

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initializeRouteTracking();
  }

  private isClient(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private initializeRouteTracking(): void {
    if (this.isClient()) {
      // Track navigation to store last visited route
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) => {
        // Don't store auth routes or root route
        if (!event.url.startsWith('/auth') && event.url !== '/') {
          this.setLastRoute(event.url);
        }
      });
    }
  }

  /**
   * Store the URL to return to after login
   */
  setReturnUrl(url: string): void {
    if (this.isClient() && !url.startsWith('/auth') && url !== '/') {
      sessionStorage.setItem(this.RETURN_URL_KEY, url);
    }
  }

  /**
   * Get and clear the stored return URL
   */
  getAndClearReturnUrl(): string | null {
    if (this.isClient()) {
      const returnUrl = sessionStorage.getItem(this.RETURN_URL_KEY);
      if (returnUrl) {
        sessionStorage.removeItem(this.RETURN_URL_KEY);
        return returnUrl;
      }
    }
    return null;
  }

  /**
   * Store the last visited route
   */
  private setLastRoute(url: string): void {
    if (this.isClient()) {
      sessionStorage.setItem(this.LAST_ROUTE_KEY, url);
    }
  }

  /**
   * Get the last visited route
   */
  getLastRoute(): string | null {
    if (this.isClient()) {
      return sessionStorage.getItem(this.LAST_ROUTE_KEY);
    }
    return null;
  }

  /**
   * Clear all stored navigation state
   */
  clearNavigationState(): void {
    if (this.isClient()) {
      sessionStorage.removeItem(this.RETURN_URL_KEY);
      sessionStorage.removeItem(this.LAST_ROUTE_KEY);
    }
  }

  /**
   * Navigate to the appropriate route after login
   */
  navigateAfterLogin(): void {
    const returnUrl = this.getAndClearReturnUrl();
    
    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
    } else {
      // Navigate to dashboard as default
      this.router.navigate(['/dashboard']);
    }
  }

  /**
   * Navigate to login with current URL stored for return
   */
  navigateToLogin(currentUrl?: string): void {
    if (currentUrl) {
      this.setReturnUrl(currentUrl);
    }
    this.router.navigate(['/auth/login']);
  }

  /**
   * Check if a URL should be preserved for post-login redirect
   */
  shouldPreserveUrl(url: string): boolean {
    return !url.startsWith('/auth') && 
           url !== '/' && 
           !url.includes('logout') &&
           !url.includes('error');
  }
}