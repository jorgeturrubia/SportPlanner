import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { NavigationService } from '../services/navigation.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let tokenService: jasmine.SpyObj<TokenService>;
  let navigationService: jasmine.SpyObj<NavigationService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['validateSession', 'refreshToken']);
    const tokenServiceSpy = jasmine.createSpyObj('TokenService', [
      'hasTokens', 
      'getAccessToken', 
      'isTokenExpired', 
      'willTokenExpireSoon',
      'getRefreshToken'
    ]);
    const navigationServiceSpy = jasmine.createSpyObj('NavigationService', [
      'shouldPreserveUrl', 
      'setReturnUrl'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: TokenService, useValue: tokenServiceSpy },
        { provide: NavigationService, useValue: navigationServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    tokenService = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
    navigationService = TestBed.inject(NavigationService) as jasmine.SpyObj<NavigationService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  describe('canActivate', () => {
    const mockRoute: any = {};
    const mockState: any = { url: '/dashboard/teams' };

    it('should redirect to login when no tokens exist', (done) => {
      tokenService.hasTokens.and.returnValue(false);
      navigationService.shouldPreserveUrl.and.returnValue(true);
      const urlTree = new UrlTree();
      router.createUrlTree.and.returnValue(urlTree);

      const result = guard.canActivate(mockRoute, mockState);
      
      if (result instanceof Promise) {
        result.then((value) => {
          expect(value).toBe(urlTree);
          expect(navigationService.setReturnUrl).toHaveBeenCalledWith('/dashboard/teams');
          done();
        });
      } else if (typeof result === 'object' && 'subscribe' in result) {
        result.subscribe((value) => {
          expect(value).toBe(urlTree);
          expect(navigationService.setReturnUrl).toHaveBeenCalledWith('/dashboard/teams');
          done();
        });
      } else {
        expect(result).toBe(urlTree);
        expect(navigationService.setReturnUrl).toHaveBeenCalledWith('/dashboard/teams');
        done();
      }
    });

    it('should attempt token refresh when access token is expired', (done) => {
      tokenService.hasTokens.and.returnValue(true);
      tokenService.getAccessToken.and.returnValue('expired-token');
      tokenService.isTokenExpired.and.returnValue(true);
      tokenService.getRefreshToken.and.returnValue('refresh-token');
      authService.refreshToken.and.returnValue(of({ accessToken: 'new-token' } as any));

      const result = guard.canActivate(mockRoute, mockState);
      
      if (typeof result === 'object' && 'subscribe' in result) {
        result.subscribe((value) => {
          expect(value).toBe(true);
          expect(authService.refreshToken).toHaveBeenCalled();
          done();
        });
      }
    });

    it('should redirect to login when token refresh fails', (done) => {
      tokenService.hasTokens.and.returnValue(true);
      tokenService.getAccessToken.and.returnValue('expired-token');
      tokenService.isTokenExpired.and.returnValue(true);
      tokenService.getRefreshToken.and.returnValue('refresh-token');
      authService.refreshToken.and.returnValue(throwError(() => new Error('Refresh failed')));
      navigationService.shouldPreserveUrl.and.returnValue(true);
      const urlTree = new UrlTree();
      router.createUrlTree.and.returnValue(urlTree);

      const result = guard.canActivate(mockRoute, mockState);
      
      if (typeof result === 'object' && 'subscribe' in result) {
        result.subscribe((value) => {
          expect(value).toBe(urlTree);
          expect(navigationService.setReturnUrl).toHaveBeenCalledWith('/dashboard/teams');
          done();
        });
      }
    });

    it('should validate session when token is valid but expires soon', (done) => {
      tokenService.hasTokens.and.returnValue(true);
      tokenService.getAccessToken.and.returnValue('valid-token');
      tokenService.isTokenExpired.and.returnValue(false);
      tokenService.willTokenExpireSoon.and.returnValue(true);
      authService.validateSession.and.returnValue(of(true));
      authService.refreshToken.and.returnValue(of({ accessToken: 'new-token' } as any));

      const result = guard.canActivate(mockRoute, mockState);
      
      if (typeof result === 'object' && 'subscribe' in result) {
        result.subscribe((value) => {
          expect(value).toBe(true);
          expect(authService.validateSession).toHaveBeenCalled();
          done();
        });
      }
    });

    it('should validate session when token is valid and not expiring soon', (done) => {
      tokenService.hasTokens.and.returnValue(true);
      tokenService.getAccessToken.and.returnValue('valid-token');
      tokenService.isTokenExpired.and.returnValue(false);
      tokenService.willTokenExpireSoon.and.returnValue(false);
      authService.validateSession.and.returnValue(of(true));

      const result = guard.canActivate(mockRoute, mockState);
      
      if (typeof result === 'object' && 'subscribe' in result) {
        result.subscribe((value) => {
          expect(value).toBe(true);
          expect(authService.validateSession).toHaveBeenCalled();
          done();
        });
      }
    });

    it('should redirect to login when session validation fails', (done) => {
      tokenService.hasTokens.and.returnValue(true);
      tokenService.getAccessToken.and.returnValue('valid-token');
      tokenService.isTokenExpired.and.returnValue(false);
      tokenService.willTokenExpireSoon.and.returnValue(false);
      authService.validateSession.and.returnValue(of(false));
      navigationService.shouldPreserveUrl.and.returnValue(true);
      const urlTree = new UrlTree();
      router.createUrlTree.and.returnValue(urlTree);

      const result = guard.canActivate(mockRoute, mockState);
      
      if (typeof result === 'object' && 'subscribe' in result) {
        result.subscribe((value) => {
          expect(value).toBe(urlTree);
          expect(navigationService.setReturnUrl).toHaveBeenCalledWith('/dashboard/teams');
          done();
        });
      }
    });
  });
});