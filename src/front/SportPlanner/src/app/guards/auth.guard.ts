import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, of, map, catchError } from 'rxjs';
import { AuthService } from '../services';
import { TokenService } from '../services/token.service';
import { NavigationService } from '../services/navigation.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router,
    private navigationService: NavigationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkAuthentication(state.url);
  }

  private checkAuthentication(url: string): Observable<boolean | UrlTree> {
    // First check if we have tokens
    const hasTokens = this.tokenService.hasTokens();
    
    if (!hasTokens) {
      return of(this.redirectToLogin(url));
    }

    // Check if access token is expired
    const accessToken = this.tokenService.getAccessToken();
    if (!accessToken || this.tokenService.isTokenExpired(accessToken)) {
      // Try to refresh the token
      return this.attemptTokenRefresh(url);
    }

    // Check if token will expire soon and validate session
    if (this.tokenService.willTokenExpireSoon(5)) {
      return this.validateAndRefreshIfNeeded(url);
    }

    // Token is valid, validate session with backend
    return this.authService.validateSession().pipe(
      map(isValid => {
        if (isValid) {
          return true;
        } else {
          return this.redirectToLogin(url);
        }
      }),
      catchError(() => {
        // If validation fails, redirect to login
        return of(this.redirectToLogin(url));
      })
    );
  }

  private attemptTokenRefresh(url: string): Observable<boolean | UrlTree> {
    const refreshToken = this.tokenService.getRefreshToken();
    
    if (!refreshToken) {
      return of(this.redirectToLogin(url));
    }

    return this.authService.refreshToken().pipe(
      map(() => {
        // Token refreshed successfully
        return true;
      }),
      catchError(() => {
        // Refresh failed, redirect to login
        return of(this.redirectToLogin(url));
      })
    );
  }

  private validateAndRefreshIfNeeded(url: string): Observable<boolean | UrlTree> {
    return this.authService.validateSession().pipe(
      map(isValid => {
        if (isValid) {
          // Session is valid, but token expires soon - refresh it in background
          this.authService.refreshToken().subscribe({
            error: () => {
              // If background refresh fails, user will be logged out on next request
              console.warn('Background token refresh failed');
            }
          });
          return true;
        } else {
          return this.redirectToLogin(url);
        }
      }),
      catchError(() => {
        return of(this.redirectToLogin(url));
      })
    );
  }

  private redirectToLogin(returnUrl: string): UrlTree {
    // Preserve the intended URL for post-login redirect
    if (this.navigationService.shouldPreserveUrl(returnUrl)) {
      this.navigationService.setReturnUrl(returnUrl);
    }
    return this.router.createUrlTree(['/auth/login']);
  }
}