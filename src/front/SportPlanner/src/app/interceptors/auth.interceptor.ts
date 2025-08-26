import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, filter, take, switchMap, catchError, finalize, tap } from 'rxjs';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { NavigationService } from '../services/navigation.service';
import { NotificationService } from '../services/notification.service';
import { ErrorHandlerService } from '../services/error-handler.service';
import { LoadingService } from '../services/loading.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private navigationService: NavigationService,
    private notificationService: NotificationService,
    private errorHandler: ErrorHandlerService,
    private loadingService: LoadingService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip auth header for auth endpoints to avoid circular calls
    if (this.isAuthEndpoint(req.url)) {
      return this.handleRequest(req, next, false);
    }

    const token = this.tokenService.getAccessToken();
    
    if (token && !this.tokenService.isTokenExpired(token)) {
      req = this.addTokenHeader(req, token);
    }
    
    return this.handleRequest(req, next, true).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isAuthEndpoint(req.url)) {
          return this.handle401Error(req, next);
        }
        
        // Handle other HTTP errors
        this.handleHttpError(error, req);
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
        // Show loading during token refresh
        this.loadingService.show();
        
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
          }),
          finalize(() => {
            this.loadingService.hide();
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
    
    // Show authentication failure notification
    this.notificationService.showError(
      'Sesión expirada',
      'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
    );
    
    // Store current URL for post-login redirect using navigation service
    const currentUrl = this.router.url;
    this.navigationService.navigateToLogin(currentUrl);
  }

  /**
   * Handle HTTP request with loading state management
   */
  private handleRequest(req: HttpRequest<any>, next: HttpHandler, trackLoading: boolean): Observable<HttpEvent<any>> {
    if (trackLoading && !this.isBackgroundRequest(req)) {
      this.loadingService.show();
    }

    return next.handle(req).pipe(
      finalize(() => {
        if (trackLoading && !this.isBackgroundRequest(req)) {
          this.loadingService.hide();
        }
      })
    );
  }

  /**
   * Handle HTTP errors with appropriate user feedback
   */
  private handleHttpError(error: HttpErrorResponse, req: HttpRequest<any>): void {
    // Don't show error notifications for auth endpoints as they're handled elsewhere
    if (this.isAuthEndpoint(req.url)) {
      return;
    }

    // Don't show notifications for 401 errors as they're handled by token refresh logic
    if (error.status === 401) {
      return;
    }

    // Handle specific error cases
    switch (error.status) {
      case 0:
        this.notificationService.showError(
          'Error de conexión',
          'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
        );
        break;
      case 403:
        this.notificationService.showError(
          'Acceso denegado',
          'No tienes permisos para realizar esta acción.'
        );
        break;
      case 404:
        // Don't show notifications for 404 errors as they might be expected
        break;
      case 429:
        this.notificationService.showWarning(
          'Demasiadas solicitudes',
          'Has realizado demasiadas solicitudes. Intenta nuevamente más tarde.'
        );
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        this.notificationService.showError(
          'Error del servidor',
          'Ha ocurrido un error del servidor. Intenta nuevamente más tarde.'
        );
        break;
      default:
        // For other errors, let the component handle them
        break;
    }
  }

  /**
   * Check if request should be treated as background (no loading indicator)
   */
  private isBackgroundRequest(req: HttpRequest<any>): boolean {
    // Don't show loading for validation requests or other background operations
    return req.url.includes('/api/auth/validate') || 
           req.url.includes('/api/auth/refresh') ||
           req.headers.has('X-Background-Request');
  }
}