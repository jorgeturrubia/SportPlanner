import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;
  let mockLocalStorage: { [key: string]: string };

  // Mock JWT token (header.payload.signature)
  const mockAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.signature';
  const mockRefreshToken = 'refresh-token-123';

  beforeEach(() => {
    mockLocalStorage = {};

    // Mock localStorage
    spyOn(localStorage, 'getItem').and.callFake((key: string) => mockLocalStorage[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      mockLocalStorage[key] = value;
    });
    spyOn(localStorage, 'removeItem').and.callFake((key: string) => {
      delete mockLocalStorage[key];
    });

    TestBed.configureTestingModule({
      providers: [
        TokenService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(TokenService);
  });

  describe('setTokens', () => {
    it('should store valid tokens', () => {
      service.setTokens(mockAccessToken, mockRefreshToken);

      expect(localStorage.setItem).toHaveBeenCalledWith('sp_access_token', mockAccessToken);
      expect(localStorage.setItem).toHaveBeenCalledWith('sp_refresh_token', mockRefreshToken);
      expect(localStorage.setItem).toHaveBeenCalledWith('sp_token_expiry', '9999999999');
    });

    it('should not store invalid tokens', () => {
      spyOn(console, 'error'); // Suppress console error for this test
      service.setTokens('invalid-token', mockRefreshToken);

      expect(localStorage.removeItem).toHaveBeenCalledWith('sp_access_token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('sp_refresh_token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('sp_token_expiry');
    });
  });

  describe('getAccessToken', () => {
    it('should return valid token', () => {
      mockLocalStorage['sp_access_token'] = mockAccessToken;

      const token = service.getAccessToken();
      expect(token).toBe(mockAccessToken);
    });

    it('should return null for expired token', () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.signature';
      mockLocalStorage['sp_access_token'] = expiredToken;

      const token = service.getAccessToken();
      expect(token).toBeNull();
      expect(localStorage.removeItem).toHaveBeenCalled();
    });

    it('should return null for invalid token', () => {
      mockLocalStorage['sp_access_token'] = 'invalid-token';

      const token = service.getAccessToken();
      expect(token).toBeNull();
    });
  });

  describe('getRefreshToken', () => {
    it('should return refresh token', () => {
      mockLocalStorage['sp_refresh_token'] = mockRefreshToken;

      const token = service.getRefreshToken();
      expect(token).toBe(mockRefreshToken);
    });

    it('should return null when no token exists', () => {
      const token = service.getRefreshToken();
      expect(token).toBeNull();
    });
  });

  describe('clearTokens', () => {
    it('should clear all tokens', () => {
      service.clearTokens();

      expect(localStorage.removeItem).toHaveBeenCalledWith('sp_access_token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('sp_refresh_token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('sp_token_expiry');
    });
  });

  describe('isTokenExpired', () => {
    it('should return false for valid token', () => {
      const isExpired = service.isTokenExpired(mockAccessToken);
      expect(isExpired).toBe(false);
    });

    it('should return true for expired token', () => {
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.signature';
      const isExpired = service.isTokenExpired(expiredToken);
      expect(isExpired).toBe(true);
    });

    it('should return true for invalid token', () => {
      const isExpired = service.isTokenExpired('invalid-token');
      expect(isExpired).toBe(true);
    });
  });

  describe('getTokenExpiryTime', () => {
    it('should return expiry time in milliseconds', () => {
      mockLocalStorage['sp_token_expiry'] = '9999999999';

      const expiryTime = service.getTokenExpiryTime();
      expect(expiryTime).toBe(9999999999000);
    });

    it('should return null when no expiry stored', () => {
      const expiryTime = service.getTokenExpiryTime();
      expect(expiryTime).toBeNull();
    });
  });

  describe('willTokenExpireSoon', () => {
    it('should return true when token expires soon', () => {
      const soonExpiry = Math.floor(Date.now() / 1000) + 60; // 1 minute from now
      mockLocalStorage['sp_token_expiry'] = soonExpiry.toString();

      const willExpire = service.willTokenExpireSoon(5); // 5 minutes warning
      expect(willExpire).toBe(true);
    });

    it('should return false when token has time left', () => {
      const laterExpiry = Math.floor(Date.now() / 1000) + 600; // 10 minutes from now
      mockLocalStorage['sp_token_expiry'] = laterExpiry.toString();

      const willExpire = service.willTokenExpireSoon(5); // 5 minutes warning
      expect(willExpire).toBe(false);
    });
  });

  describe('hasTokens', () => {
    it('should return true when both tokens exist', () => {
      mockLocalStorage['sp_access_token'] = mockAccessToken;
      mockLocalStorage['sp_refresh_token'] = mockRefreshToken;

      const hasTokens = service.hasTokens();
      expect(hasTokens).toBe(true);
    });

    it('should return false when tokens are missing', () => {
      const hasTokens = service.hasTokens();
      expect(hasTokens).toBe(false);
    });
  });

  describe('getUserFromToken', () => {
    it('should return user data from token', () => {
      mockLocalStorage['sp_access_token'] = mockAccessToken;

      const userData = service.getUserFromToken();
      expect(userData).toEqual(jasmine.objectContaining({
        sub: '1234567890',
        name: 'John Doe'
      }));
    });

    it('should return null when no token exists', () => {
      const userData = service.getUserFromToken();
      expect(userData).toBeNull();
    });
  });
});