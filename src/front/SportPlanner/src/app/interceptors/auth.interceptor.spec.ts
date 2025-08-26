import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthInterceptor } from './auth.interceptor';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';
import { NavigationService } from '../services/navigation.service';
import { NotificationService } from '../services/notification.service';
import { ErrorHandlerService } from '../services/error-handler.service';
import { LoadingService } from '../services/loading.service';
import { UserRole, AuthResponse } from '../models';

describe('AuthInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let tokenService: jasmine.SpyObj<TokenService>;
  let authService: jasmine.SpyObj<AuthService>;
  let navigationService: jasmine.SpyObj<NavigationService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let errorHandlerService: jasmine.SpyObj<ErrorHandlerService>;
  let loadingService: jasmine.SpyObj<LoadingService>;
  let router: jasmine.SpyObj<Router>;

  const mockAuthResponse: AuthResponse = {
    user: { 
      id: '1', 
      email: 'test@test.com', 
      firstName: 'Test', 
      lastName: 'User', 
      supabaseId: 'sup1', 
      role: UserRole.Administrator, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    },
    accessToken: 'new-token',
    refreshToken: 'new-refresh',
    expiresIn: 3600
  };

  beforeEach(() => {
    const tokenServiceSpy = jasmine.createSpyObj('TokenService', [
      'getAccessToken', 'getRefreshToken', 'isTokenExpired', 'clearTokens'
    ]);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['refreshToken']);
    const navigationServiceSpy = jasmine.createSpyObj('NavigationService', ['navigateToLogin']);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'showError', 'showWarning'
    ]);
    const errorHandlerServiceSpy = jasmine.createSpyObj('ErrorHandlerService', ['handleHttpError']);
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['show', 'hide']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'], { url: '/dashboard' });

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: TokenService, useValue: tokenServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NavigationService, useValue: navigationServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: ErrorHandlerService, useValue: errorHandlerServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    navigationService = TestBed.inject(NavigationService) as jasmine.SpyObj<NavigationService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    errorHandlerService = TestBed.inject(ErrorHandlerService) as jasmine.SpyObj<ErrorHandlerService>;
    loadingService = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('Token Management', () => {
    it('should add Authorization header when valid token exists', () => {
      const mockToken = 'valid-token';
      tokenService.getAccessToken.and.returnValue(mockToken);
      tokenService.isTokenExpired.and.returnValue(false);

      httpClient.get('/api/test').subscribe();

      const req = httpTestingController.expectOne('/api/test');
      expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req.flush({});
    });

    it('should not add Authorization header when token is expired', () => {
      const mockToken = 'expired-token';
      tokenService.getAccessToken.and.returnValue(mockToken);
      tokenService.isTokenExpired.and.returnValue(true);

      httpClient.get('/api/test').subscribe();

      const req = httpTestingController.expectOne('/api/test');
      expect(req.request.headers.get('Authorization')).toBeNull();
      req.flush({});
    });

    it('should not add Authorization header when no token exists', () => {
      tokenService.getAccessToken.and.returnValue(null);

      httpClient.get('/api/test').subscribe();

      const req = httpTestingController.expectOne('/api/test');
      expect(req.request.headers.get('Authorization')).toBeNull();
      req.flush({});
    });

    it('should skip auth header for auth endpoints', () => {
      const mockToken = 'valid-token';
      tokenService.getAccessToken.and.returnValue(mockToken);
      tokenService.isTokenExpired.and.returnValue(false);

      httpClient.post('/api/auth/login', {}).subscribe();

      const req = httpTestingController.expectOne('/api/auth/login');
      expect(req.request.headers.get('Authorization')).toBeNull();
      req.flush({});
    });
  });

  describe('Loading State Management', () => {
    it('should show loading for regular requests', () => {
      tokenService.getAccessToken.and.returnValue('token');
      tokenService.isTokenExpired.and.returnValue(false);

      httpClient.get('/api/test').subscribe();

      expect(loadingService.show).toHaveBeenCalled();

      const req = httpTestingController.expectOne('/api/test');
      req.flush({});

      expect(loadingService.hide).toHaveBeenCalled();
    });

    it('should not show loading for background requests', () => {
      tokenService.getAccessToken.and.returnValue('token');
      tokenService.isTokenExpired.and.returnValue(false);

      httpClient.get('/api/auth/validate').subscribe();

      expect(loadingService.show).not.toHaveBeenCalled();

      const req = httpTestingController.expectOne('/api/auth/validate');
      req.flush({});

      expect(loadingService.hide).not.toHaveBeenCalled();
    });

    it('should not show loading for auth endpoints', () => {
      httpClient.post('/api/auth/login', {}).subscribe();

      expect(loadingService.show).not.toHaveBeenCalled();

      const req = httpTestingController.expectOne('/api/auth/login');
      req.flush({});

      expect(loadingService.hide).not.toHaveBeenCalled();
    });
  });

  describe('Token Refresh on 401', () => {
    it('should refresh token and retry request on 401 error', () => {
      const mockToken = 'valid-token';
      const mockRefreshToken = 'refresh-token';
      
      tokenService.getAccessToken.and.returnValue(mockToken);
      tokenService.isTokenExpired.and.returnValue(false);
      tokenService.getRefreshToken.and.returnValue(mockRefreshToken);
      authService.refreshToken.and.returnValue(of(mockAuthResponse));

      httpClient.get('/api/test').subscribe();

      // First request with original token
      const req1 = httpTestingController.expectOne('/api/test');
      expect(req1.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      req1.flush({}, { status: 401, statusText: 'Unauthorized' });

      // Should show loading during token refresh
      expect(loadingService.show).toHaveBeenCalled();

      // Retry request with new token
      const req2 = httpTestingController.expectOne('/api/test');
      expect(req2.request.headers.get('Authorization')).toBe(`Bearer ${mockAuthResponse.accessToken}`);
      req2.flush({ data: 'success' });

      // Should hide loading after token refresh
      expect(loadingService.hide).toHaveBeenCalled();
    });

    it('should handle auth failure when refresh token is not available', () => {
      const mockToken = 'valid-token';
      
      tokenService.getAccessToken.and.returnValue(mockToken);
      tokenService.isTokenExpired.and.returnValue(false);
      tokenService.getRefreshToken.and.returnValue(null);

      httpClient.get('/api/test').subscribe({
        error: (error) => {
          expect(error.message).toBe('No refresh token available');
        }
      });

      const req = httpTestingController.expectOne('/api/test');
      req.flush({}, { status: 401, statusText: 'Unauthorized' });

      expect(tokenService.clearTokens).toHaveBeenCalled();
      expect(notificationService.showError).toHaveBeenCalledWith(
        'Sesión expirada',
        'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
      );
      expect(navigationService.navigateToLogin).toHaveBeenCalled();
    });

    it('should handle auth failure when token refresh fails', () => {
      const mockToken = 'valid-token';
      const mockRefreshToken = 'refresh-token';
      
      tokenService.getAccessToken.and.returnValue(mockToken);
      tokenService.isTokenExpired.and.returnValue(false);
      tokenService.getRefreshToken.and.returnValue(mockRefreshToken);
      authService.refreshToken.and.returnValue(throwError(() => new Error('Refresh failed')));

      httpClient.get('/api/test').subscribe({
        error: (error) => {
          expect(error.message).toBe('Refresh failed');
        }
      });

      const req = httpTestingController.expectOne('/api/test');
      req.flush({}, { status: 401, statusText: 'Unauthorized' });

      expect(tokenService.clearTokens).toHaveBeenCalled();
      expect(notificationService.showError).toHaveBeenCalled();
      expect(navigationService.navigateToLogin).toHaveBeenCalled();
      expect(loadingService.hide).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      tokenService.getAccessToken.and.returnValue('token');
      tokenService.isTokenExpired.and.returnValue(false);
    });

    it('should show connection error notification for network errors', () => {
      httpClient.get('/api/test').subscribe({
        error: () => {}
      });

      const req = httpTestingController.expectOne('/api/test');
      req.flush({}, { status: 0, statusText: 'Network Error' });

      expect(notificationService.showError).toHaveBeenCalledWith(
        'Error de conexión',
        'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
      );
    });

    it('should show access denied notification for 403 errors', () => {
      httpClient.get('/api/test').subscribe({
        error: () => {}
      });

      const req = httpTestingController.expectOne('/api/test');
      req.flush({}, { status: 403, statusText: 'Forbidden' });

      expect(notificationService.showError).toHaveBeenCalledWith(
        'Acceso denegado',
        'No tienes permisos para realizar esta acción.'
      );
    });

    it('should show rate limit warning for 429 errors', () => {
      httpClient.get('/api/test').subscribe({
        error: () => {}
      });

      const req = httpTestingController.expectOne('/api/test');
      req.flush({}, { status: 429, statusText: 'Too Many Requests' });

      expect(notificationService.showWarning).toHaveBeenCalledWith(
        'Demasiadas solicitudes',
        'Has realizado demasiadas solicitudes. Intenta nuevamente más tarde.'
      );
    });

    it('should show server error notification for 5xx errors', () => {
      httpClient.get('/api/test').subscribe({
        error: () => {}
      });

      const req = httpTestingController.expectOne('/api/test');
      req.flush({}, { status: 500, statusText: 'Internal Server Error' });

      expect(notificationService.showError).toHaveBeenCalledWith(
        'Error del servidor',
        'Ha ocurrido un error del servidor. Intenta nuevamente más tarde.'
      );
    });

    it('should not show notifications for 404 errors', () => {
      httpClient.get('/api/test').subscribe({
        error: () => {}
      });

      const req = httpTestingController.expectOne('/api/test');
      req.flush({}, { status: 404, statusText: 'Not Found' });

      expect(notificationService.showError).not.toHaveBeenCalled();
      expect(notificationService.showWarning).not.toHaveBeenCalled();
    });

    it('should not show notifications for auth endpoint errors', () => {
      httpClient.post('/api/auth/login', {}).subscribe({
        error: () => {}
      });

      const req = httpTestingController.expectOne('/api/auth/login');
      req.flush({}, { status: 400, statusText: 'Bad Request' });

      expect(notificationService.showError).not.toHaveBeenCalled();
    });
  });

  describe('Concurrent Token Refresh', () => {
    it('should handle concurrent requests during token refresh', () => {
      const mockToken = 'valid-token';
      const mockRefreshToken = 'refresh-token';
      
      tokenService.getAccessToken.and.returnValue(mockToken);
      tokenService.isTokenExpired.and.returnValue(false);
      tokenService.getRefreshToken.and.returnValue(mockRefreshToken);
      authService.refreshToken.and.returnValue(of(mockAuthResponse));

      // Make first request that will trigger refresh
      httpClient.get('/api/test1').subscribe();
      const req1 = httpTestingController.expectOne('/api/test1');
      req1.flush({}, { status: 401, statusText: 'Unauthorized' });

      // Make second request while refresh is in progress
      httpClient.get('/api/test2').subscribe();

      // First retry request should use the new token
      const retryReq1 = httpTestingController.expectOne('/api/test1');
      expect(retryReq1.request.headers.get('Authorization')).toBe(`Bearer ${mockAuthResponse.accessToken}`);
      retryReq1.flush({ data: 'success1' });

      // Second request should also get the new token without triggering another refresh
      const req2 = httpTestingController.expectOne('/api/test2');
      expect(req2.request.headers.get('Authorization')).toBe(`Bearer ${mockAuthResponse.accessToken}`);
      req2.flush({ data: 'success2' });

      // Refresh should only be called once
      expect(authService.refreshToken).toHaveBeenCalledTimes(1);
    });
  });
});