import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, tap, catchError, of, map } from 'rxjs';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  sport: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: AuthUser;
  message?: string;
  data?: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: AuthUser;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private apiUrl = 'https://localhost:7061/api';
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('auth_token');
      const user = localStorage.getItem('auth_user');
      if (token && user) {
        try {
          const parsedUser = JSON.parse(user);
          // Set user immediately to prevent guard issues
          this.currentUserSubject.next(parsedUser);
          // Validate token in background without affecting current session
          this.validateToken(token).subscribe({
            error: (error) => {
              // Only sign out on explicit authentication errors
              if (error.status === 401 || error.status === 403) {
                this.signOut();
              }
              // For other errors (network, etc.), keep user logged in
            }
          });
        } catch (error) {
          // If user data is corrupted, clear everything
          this.signOut();
        }
      } else {
        // Ensure currentUser is null if no valid session
        this.currentUserSubject.next(null);
      }
    }
  }

  private validateToken(token: string): Observable<void> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(response => {
        if (response.success && (response.user || response.data?.user)) {
          const user = response.user || response.data?.user;
          if (user) {
            this.currentUserSubject.next(user);
          }
        } else {
          // Only sign out if the response explicitly indicates invalid token
          if (response.success === false) {
            this.signOut();
          }
        }
      }),
      catchError((error) => {
        // Only sign out on 401 Unauthorized, not on network errors
        if (error.status === 401) {
          this.signOut();
        }
        // For other errors (network, server down, etc.), keep the user logged in
        return of(null);
      }),
      map(() => undefined)
    );
  }

  signUp(data: RegisterRequest): Observable<AuthResponse> {
    this.loadingSubject.next(true);
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, data).pipe(
      tap(response => {
        // Handle both old format (token, user) and new format (data.accessToken, data.user)
        const token = response.token || response.data?.accessToken;
        const user = response.user || response.data?.user;
        
        if (response.success && token && user) {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('auth_token', token);
            localStorage.setItem('auth_user', JSON.stringify(user));
          }
          this.currentUserSubject.next(user);
          this.router.navigate(['/dashboard']);
        }
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        return of({ success: false, message: error.error?.message || 'Error during registration' });
      })
    );
  }

  signIn(data: LoginRequest): Observable<AuthResponse> {
    this.loadingSubject.next(true);
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, data).pipe(
      tap(response => {
        // Handle both old format (token, user) and new format (data.accessToken, data.user)
        const token = response.token || response.data?.accessToken;
        const user = response.user || response.data?.user;
        
        if (response.success && token && user) {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('auth_token', token);
            localStorage.setItem('auth_user', JSON.stringify(user));
          }
          this.currentUserSubject.next(user);
          this.router.navigate(['/dashboard']);
        }
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        return of({ success: false, message: error.error?.message || 'Error during login' });
      })
    );
  }

  signOut(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth']);
  }

  resetPassword(email: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/reset-password`, { email }).pipe(
      catchError(error => {
        return of({ success: false, message: error.error?.message || 'Error sending reset email' });
      })
    );
  }

  get currentUser(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  getAuthToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('auth_token');
    }
    return null;
  }
}