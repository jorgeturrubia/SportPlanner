import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'sp_access_token';
  private readonly REFRESH_TOKEN_KEY = 'sp_refresh_token';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private isClient(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  setTokens(accessToken: string, refreshToken: string): void {
    if (this.isClient()) {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  getAccessToken(): string | null {
    if (this.isClient()) {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY);
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
    }
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }

  scheduleTokenRefresh(): void {
    const token = this.getAccessToken();
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      const refreshTime = expirationTime - (5 * 60 * 1000); // 5 minutes before expiration

      if (refreshTime > currentTime) {
        setTimeout(() => {
          // This will be handled by the auth service
          window.dispatchEvent(new CustomEvent('token-refresh-needed'));
        }, refreshTime - currentTime);
      }
    } catch {
      // Invalid token, clear it
      this.clearTokens();
    }
  }
}