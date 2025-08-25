import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, of, map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkGuestAccess();
  }

  private checkGuestAccess(): Observable<boolean | UrlTree> {
    // Check if user has valid tokens
    const hasTokens = this.tokenService.hasTokens();
    const accessToken = this.tokenService.getAccessToken();
    
    if (!hasTokens || !accessToken || this.tokenService.isTokenExpired(accessToken)) {
      // No valid tokens, allow access to guest routes
      return of(true);
    }

    // User has valid tokens, validate session
    return this.authService.validateSession().pipe(
      map(isValid => {
        if (isValid) {
          // User is authenticated, redirect to dashboard
          return this.router.createUrlTree(['/dashboard']);
        } else {
          // Session is invalid, allow access to guest routes
          return true;
        }
      })
    );
  }
}