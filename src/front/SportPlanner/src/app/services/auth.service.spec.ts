import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { environment } from '../../environments/environment';
import { User, UserRole, LoginRequest, RegisterRequest, AuthResponse } from '../models';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let tokenService: jasmine.SpyObj<TokenService>;
  let router: jasmine.SpyObj<Router>;

  const mockUser: User = {
    id: '123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    supabaseId: 'supabase-123',
    role: UserRole.Coach,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockAuthResponse: AuthResponse = {
    user: mockUser,
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
    expiresIn: 3600
  };

  beforeEach(() => {
    const tokenServiceSpy = jasmine.createSpyObj('TokenService', [
      'getAccessToken',
      'getRefreshToken',
      'setTokens',
      'clearTokens',
      'isTokenExpired',
      'scheduleTokenRefresh'
    ]);

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy.url = '/dashboard';

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: TokenService, useValue: tokenServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('login', () => {
    it('should login successfully and set user state', () => {
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
        rememberMe: false
      };

      service.login(loginRequest).subscribe(response => {
        expect(response).toEqual(mockAuthResponse);
        expect(service.getCurrentUser()()).toEqual(jasmine.objectContaining({
          id: mockUser.id,
          email: mockUser.email
        }));
        expect(service.isLoggedIn()()).toBe(true);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginRequest);
      req.flush(mockAuthResponse);

      expect(tokenService.setTokens).toHaveBeenCalledWith(
        mockAuthResponse.accessToken,
        mockAuthResponse.refreshToken
      );
    });

    it('should handle login error', () => {
      const loginRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'wrongpassword',
        rememberMe: false
      };

      service.login(loginRequest).subscribe({
        error: (error) => {
          expect(error.message).toContain('Invalid credentials');
          expect(service.getAuthError()()).toBeTruthy();
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/login`);
      req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('register', () => {
    it('should register successfully', () => {
      const registerRequest: RegisterRequest = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith'
      };

      service.register(registerRequest).subscribe(response => {
        expect(response).toEqual(mockAuthResponse);
        expect(service.isLoggedIn()()).toBe(true);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/register`);
      expect(req.request.method).toBe('POST');
      req.flush(mockAuthResponse);
    });

    it('should handle registration error for existing email', () => {
      const registerRequest: RegisterRequest = {
        email: 'existing@example.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith'
      };

      service.register(registerRequest).subscribe({
        error: (error) => {
          expect(error.message).toContain('already exists');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/register`);
      req.flush({ message: 'Email already exists' }, { status: 409, statusText: 'Conflict' });
    });
  });

  describe('logout', () => {
    it('should logout successfully', () => {
      tokenService.getAccessToken.and.returnValue('valid-token');

      service.logout().subscribe(() => {
        expect(service.getCurrentUser()()).toBeNull();
        expect(service.isLoggedIn()()).toBe(false);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/logout`);
      expect(req.request.method).toBe('POST');
      req.flush({});

      expect(tokenService.clearTokens).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
    });

    it('should clear tokens even if logout request fails', () => {
      tokenService.getAccessToken.and.returnValue('valid-token');

      service.logout().subscribe(() => {
        expect(tokenService.clearTokens).toHaveBeenCalled();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/logout`);
      req.flush({}, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', () => {
      tokenService.getRefreshToken.and.returnValue('valid-refresh-token');

      service.refreshToken().subscribe(response => {
        expect(response).toEqual(mockAuthResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/refresh`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ refreshToken: 'valid-refresh-token' });
      req.flush(mockAuthResponse);
    });

    it('should handle refresh token failure', () => {
      tokenService.getRefreshToken.and.returnValue('invalid-refresh-token');

      service.refreshToken().subscribe({
        error: (error) => {
          expect(error.message).toBe('Token refresh failed');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/refresh`);
      req.flush({}, { status: 401, statusText: 'Unauthorized' });

      expect(tokenService.clearTokens).toHaveBeenCalled();
    });
  });

  describe('validateSession', () => {
    it('should validate session successfully', () => {
      tokenService.getAccessToken.and.returnValue('valid-token');

      service.validateSession().subscribe(isValid => {
        expect(isValid).toBe(true);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/validate`);
      req.flush({ valid: true });
    });

    it('should return false for invalid session', () => {
      tokenService.getAccessToken.and.returnValue('invalid-token');

      service.validateSession().subscribe(isValid => {
        expect(isValid).toBe(false);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/auth/validate`);
      req.flush({}, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('utility methods', () => {
    beforeEach(() => {
      // Set up authenticated state
      service['currentUser'].set(mockUser);
    });

    it('should check user role correctly', () => {
      expect(service.hasRole('2')).toBe(true); // Coach = 2
      expect(service.hasRole('0')).toBe(false); // Administrator = 0
    });

    it('should return user full name', () => {
      expect(service.getUserFullName()).toBe('John Doe');
    });

    it('should clear auth error', () => {
      service['authError'].set('Some error');
      service.clearAuthError();
      expect(service.getAuthError()()).toBeNull();
    });
  });
});