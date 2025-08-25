import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, filter, take, switchMap, catchError } from 'rxjs';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { NavigationService } from '../services/navigation.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private navigationService: NavigationService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip auth header for auth endpoints to avoid circular calls
    if (this.isAuthEndpoint(req.url)) {
      return next.handle(req);
    }

    const token = this.tokenService.getAccessToken();
    
    if (token && !this.tokenService.isTokenExpired(token)) {
      req = this.addTokenHeader(req, token);
    }
    
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isAuthEndpoint(req.url)) {
          return this.handle401Error(req, next);
        }
        
        return throwError(() => error);
      })
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private isAuthEndpoint(url: string): boolean {
    return url.includes('/api/auth/login') || 
           url.includes('/api/auth/register') || 
           url.includes('/api/auth/refresh');
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = this.tokenService.getRefreshToken();
      
      if (refreshToken) {
        return this.authService.refreshToken().pipe(
          switchMap((response: any) => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(response.accessToken);
            
            return next.handle(this.addTokenHeader(request, response.accessToken));
          }),
          catchError((error) => {
            this.isRefreshing = false;
            this.handleAuthFailure();
            return throwError(() => error);
          })
        );
      } else {
        this.isRefreshing = false;
        this.handleAuthFailure();
        return throwError(() => new Error('No refresh token available'));
      }
    } else {
      // If refresh is in progress, wait for it to complete
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap((token) => next.handle(this.addTokenHeader(request, token)))
      );
    }
  }

  private handleAuthFailure(): void {
    // Clear tokens and redirect to login
    this.tokenService.clearTokens();
    
    // Store current URL for post-login redirect using navigation service
    const currentUrl = this.router.url;
    this.navigationService.navigateToLogin(currentUrl);
  }
}