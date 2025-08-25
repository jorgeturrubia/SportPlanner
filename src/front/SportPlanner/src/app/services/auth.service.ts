import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap, catchError, throwError, of, timer, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models';
import { TokenService } from './token.service';
import { NavigationService } from './navigation.service';
import { NotificationService } from './notification.service';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private currentUser = signal<User | null>(null);
  private isAuthenticated = computed(() => !!this.currentUser());
  private isLoading = signal<boolean>(false);
  private authError = signal<string | null>(null);
  private refreshInProgress = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService,
    private navigationService: NavigationService,
    private notificationService: NotificationService,
    private errorHandler: ErrorHandlerService
  ) {
    this.initializeAuth();
    this.setupTokenRefreshListener();
  }

  private initializeAuth(): void {
    const token = this.tokenService.getAccessToken();
    if (token && !this.tokenService.isTokenExpired(token)) {
      this.validateSession().subscribe({
        next: (isValid) => {
          if (isValid) {
            this.tokenService.scheduleTokenRefresh();
          } else {
            this.handleLogout();
          }
        },
        error: () => {
          this.handleLogout();
        }
      });
    } else {
      this.tokenService.clearTokens();
    }
  }

  private setupTokenRefreshListener(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('token-refresh-needed', () => {
        this.refreshToken().subscribe({
          error: () => {
            this.handleLogout();
          }
        });
      });
    }
  }

  /**
   * Validates the current session with the backend
   */
  validateSession(): Observable<boolean> {
    const token = this.tokenService.getAccessToken();
    if (!token) {
      return of(false);
    }

    return this.http.get<{ valid: boolean }>(`${this.apiUrl}/api/auth/validate`)
      .pipe(
        tap(response => {
          if (!response.valid) {
            this.handleLogout();
          }
        }),
        catchError(() => of(false)),
        tap(() => this.authError.set(null)),
        map(response => typeof response === 'boolean' ? response : response.valid)
      );
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    this.isLoading.set(true);
    this.authError.set(null);

    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.handleAuthSuccess(response);
          this.isLoading.set(false);
          this.notificationService.showSuccess('¡Bienvenido!', 'Has iniciado sesión correctamente');
        }),
        catchError(error => {
          this.isLoading.set(false);
          const errorMessage = this.extractErrorMessage(error);
          this.authError.set(errorMessage);
          this.errorHandler.handleAuthError(error);
          console.error('Login error:', error);
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    this.isLoading.set(true);
    this.authError.set(null);

    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/register`, userData)
      .pipe(
        tap(response => {
          this.handleAuthSuccess(response);
          this.isLoading.set(false);
          this.notificationService.showSuccess('¡Cuenta creada!', 'Tu cuenta ha sido creada exitosamente');
        }),
        catchError(error => {
          this.isLoading.set(false);
          const errorMessage = this.extractErrorMessage(error);
          this.authError.set(errorMessage);
          this.errorHandler.handleAuthError(error);
          console.error('Registration error:', error);
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  logout(): Observable<void> {
    this.isLoading.set(true);
    
    const token = this.tokenService.getAccessToken();
    if (!token) {
      this.handleLogout();
      return of(void 0);
    }

    return this.http.post<void>(`${this.apiUrl}/api/auth/logout`, {})
      .pipe(
        tap(() => {
          this.handleLogout();
          this.notificationService.showInfo('Sesión cerrada', 'Has cerrado sesión correctamente');
        }),
        catchError(error => {
          // Even if the server request fails, we should clear local tokens
          console.warn('Logout request failed, clearing local tokens anyway:', error);
          this.handleLogout();
          this.notificationService.showWarning('Sesión cerrada', 'Sesión cerrada localmente');
          return of(void 0);
        })
      );
  }

  /**
   * Logout with confirmation dialog
   */
  logoutWithConfirmation(): Observable<boolean> {
    return new Observable(observer => {
      if (typeof window !== 'undefined') {
        const confirmed = window.confirm('¿Estás seguro de que quieres cerrar sesión?');
        if (confirmed) {
          this.logout().subscribe({
            next: () => {
              observer.next(true);
              observer.complete();
            },
            error: (error) => {
              observer.error(error);
            }
          });
        } else {
          observer.next(false);
          observer.complete();
        }
      } else {
        // Server-side rendering fallback
        this.logout().subscribe({
          next: () => {
            observer.next(true);
            observer.complete();
          },
          error: (error) => {
            observer.error(error);
          }
        });
      }
    });
  }

  /**
   * Navigate to dashboard after successful login
   */
  navigateAfterLogin(): void {
    this.navigationService.navigateAfterLogin();
  }

  refreshToken(): Observable<AuthResponse> {
    if (this.refreshInProgress) {
      return throwError(() => new Error('Token refresh already in progress'));
    }

    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      this.handleLogout();
      return throwError(() => new Error('No refresh token available'));
    }

    this.refreshInProgress = true;

    return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/refresh`, { refreshToken })
      .pipe(
        tap(response => {
          this.handleAuthSuccess(response);
          this.refreshInProgress = false;
        }),
        catchError(error => {
          this.refreshInProgress = false;
          console.error('Token refresh failed:', error);
          this.handleLogout();
          return throwError(() => new Error('Token refresh failed'));
        })
      );
  }

  /**
   * Automatic token refresh mechanism
   */
  startAutomaticTokenRefresh(): void {
    const token = this.tokenService.getAccessToken();
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      const refreshTime = expirationTime - (5 * 60 * 1000); // 5 minutes before expiration

      if (refreshTime > currentTime) {
        timer(refreshTime - currentTime).subscribe(() => {
          this.refreshToken().subscribe({
            next: () => {
              // Token refreshed successfully, schedule next refresh
              this.startAutomaticTokenRefresh();
            },
            error: () => {
              // Refresh failed, user will be logged out
              this.handleLogout();
            }
          });
        });
      }
    } catch {
      // Invalid token, clear it
      this.handleLogout();
    }
  }

  private handleAuthSuccess(response: AuthResponse): void {
    // Convert date strings to Date objects
    const user: User = {
      ...response.user,
      createdAt: new Date(response.user.createdAt),
      updatedAt: new Date(response.user.updatedAt)
    };
    
    this.currentUser.set(user);
    this.tokenService.setTokens(response.accessToken, response.refreshToken);
    this.tokenService.scheduleTokenRefresh();
    this.startAutomaticTokenRefresh();
    this.authError.set(null);
  }

  private handleLogout(): void {
    this.currentUser.set(null);
    this.tokenService.clearTokens();
    this.isLoading.set(false);
    this.authError.set(null);
    this.refreshInProgress = false;
    
    // Clear any stored navigation state
    this.navigationService.clearNavigationState();
    
    // Only navigate if we're not already on the login page
    if (this.router.url !== '/auth/login') {
      this.router.navigate(['/auth/login']);
    }
  }

  private extractErrorMessage(error: HttpErrorResponse): string {
    if (error.error?.message) {
      return error.error.message;
    }
    
    switch (error.status) {
      case 401:
        return 'Invalid credentials. Please check your email and password.';
      case 400:
        return 'Invalid request. Please check your input.';
      case 409:
        return 'An account with this email already exists.';
      case 500:
        return 'Server error. Please try again later.';
      case 0:
        return 'Network error. Please check your connection.';
      default:
        return error.error?.details || 'An unexpected error occurred. Please try again.';
    }
  }

  // Public getters for reactive state
  getCurrentUser() {
    return this.currentUser.asReadonly();
  }

  isLoggedIn() {
    return this.isAuthenticated;
  }

  getLoadingState() {
    return this.isLoading.asReadonly();
  }

  getAuthError() {
    return this.authError.asReadonly();
  }

  clearAuthError(): void {
    this.authError.set(null);
  }

  /**
   * Check if the current user has a specific role
   */
  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user?.role.toString() === role;
  }

  /**
   * Get the current user's full name
   */
  getUserFullName(): string {
    const user = this.currentUser();
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`.trim();
  }
}