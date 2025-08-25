import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'sp_access_token';
  private readonly REFRESH_TOKEN_KEY = 'sp_refresh_token';
  private readonly TOKEN_EXPIRY_KEY = 'sp_token_expiry';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private isClient(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  setTokens(accessToken: string, refreshToken: string): void {
    if (this.isClient()) {
      try {
        // Validate tokens before storing
        if (!this.isValidJWT(accessToken) || !refreshToken) {
          throw new Error('Invalid tokens provided');
        }

        localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
        
        // Store expiry time for quick access
        const payload = this.decodeToken(accessToken);
        if (payload?.exp) {
          localStorage.setItem(this.TOKEN_EXPIRY_KEY, payload.exp.toString());
        }
      } catch (error) {
        console.error('Error storing tokens:', error);
        this.clearTokens();
      }
    }
  }

  getAccessToken(): string | null {
    if (this.isClient()) {
      const token = localStorage.getItem(this.ACCESS_TOKEN_KEY);
      
      // Validate token before returning
      if (token && this.isValidJWT(token) && !this.isTokenExpired(token)) {
        return token;
      } else if (token) {
        // Token exists but is invalid or expired, clear it
        this.clearTokens();
      }
    }
    return null;
  }

  getRefreshToken(): string | null {
    if (this.isClient()) {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  clearTokens(): void {
    if (this.isClient()) {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    }
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = this.decodeToken(token);
      if (!payload?.exp) return true;
      
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }

  /**
   * Get token expiry time in milliseconds
   */
  getTokenExpiryTime(): number | null {
    if (this.isClient()) {
      const expiryStr = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
      if (expiryStr) {
        return parseInt(expiryStr, 10) * 1000; // Convert to milliseconds
      }
    }
    return null;
  }

  /**
   * Check if token will expire within the specified minutes
   */
  willTokenExpireSoon(minutes: number = 5): boolean {
    const expiryTime = this.getTokenExpiryTime();
    if (!expiryTime) return true;
    
    const currentTime = Date.now();
    const warningTime = expiryTime - (minutes * 60 * 1000);
    
    return currentTime >= warningTime;
  }

  scheduleTokenRefresh(): void {
    const token = this.getAccessToken();
    if (!token || !this.isClient()) return;

    try {
      const payload = this.decodeToken(token);
      if (!payload?.exp) return;

      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      const refreshTime = expirationTime - (5 * 60 * 1000); // 5 minutes before expiration

      if (refreshTime > currentTime) {
        setTimeout(() => {
          // Only dispatch if we're still in the browser and token is still valid
          if (this.isClient() && this.getAccessToken()) {
            window.dispatchEvent(new CustomEvent('token-refresh-needed'));
          }
        }, refreshTime - currentTime);
      }
    } catch (error) {
      console.error('Error scheduling token refresh:', error);
      this.clearTokens();
    }
  }

  /**
   * Validate JWT format
   */
  private isValidJWT(token: string): boolean {
    if (!token) return false;
    
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    try {
      // Try to decode each part
      atob(parts[0]); // header
      atob(parts[1]); // payload
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Decode JWT token payload
   */
  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  /**
   * Get user information from token
   */
  getUserFromToken(): any {
    const token = this.getAccessToken();
    if (!token) return null;
    
    return this.decodeToken(token);
  }

  /**
   * Check if tokens exist (for quick auth state check)
   */
  hasTokens(): boolean {
    return !!(this.getAccessToken() && this.getRefreshToken());
  }
}