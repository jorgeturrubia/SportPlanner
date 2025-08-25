import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private currentUser = signal<User | null>(null);
  private isAuthenticated = computed(() => !!this.currentUser());

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService
  ) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = this.tokenService.getAccessToken();
    if (token && !this.tokenService.isTokenExpired(token)) {
      // In a real app, you'd validate the token with the backend
      // For now, we'll just check if it exists and isn't expired
      this.tokenService.scheduleTokenRefresh();
    } else {
      this.tokenService.clearTokens();
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.handleAuthSuccess(response);
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => error);
        })
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/register`, userData)
      .pipe(
        tap(response => {
          this.handleAuthSuccess(response);
        }),
        catchError(error => {
          console.error('Registration error:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/api/auth/logout`, {})
      .pipe(
        tap(() => {
          this.handleLogout();
        }),
        catchError(error => {
          // Even if the server request fails, we should clear local tokens
          this.handleLogout();
          return throwError(() => error);
        })
      );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/refresh`, { refreshToken })
      .pipe(
        tap(response => {
          this.handleAuthSuccess(response);
        }),
        catchError(error => {
          this.handleLogout();
          return throwError(() => error);
        })
      );
  }

  private handleAuthSuccess(response: AuthResponse): void {
    this.currentUser.set(response.user);
    this.tokenService.setTokens(response.accessToken, response.refreshToken);
    this.tokenService.scheduleTokenRefresh();
  }

  private handleLogout(): void {
    this.currentUser.set(null);
    this.tokenService.clearTokens();
    this.router.navigate(['/auth/login']);
  }

  getCurrentUser() {
    return this.currentUser.asReadonly();
  }

  isLoggedIn() {
    return this.isAuthenticated;
  }
}