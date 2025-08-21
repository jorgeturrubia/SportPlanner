import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';

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
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: AuthUser;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = 'https://localhost:7001/api';
  private currentUserSubject = new BehaviorSubject<AuthUser | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth() {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.validateToken(token).subscribe();
    }
  }

  private validateToken(token: string): Observable<void> {
    this.http.get<AuthResponse>(`${this.apiUrl}/auth/validate`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      tap(response => {
        if (response.success && response.user) {
          this.currentUserSubject.next(response.user);
        } else {
          this.signOut();
        }
      }),
      catchError(() => {
        this.signOut();
        return of(null);
      })
    ).subscribe();
    
    return of(undefined);
  }

  signUp(data: RegisterRequest): Observable<AuthResponse> {
    this.loadingSubject.next(true);
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, data).pipe(
      tap(response => {
        if (response.success && response.token && response.user) {
          localStorage.setItem('auth_token', response.token);
          this.currentUserSubject.next(response.user);
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
        if (response.success && response.token && response.user) {
          localStorage.setItem('auth_token', response.token);
          this.currentUserSubject.next(response.user);
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
    localStorage.removeItem('auth_token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
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
    return localStorage.getItem('auth_token');
  }
}