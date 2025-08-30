import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, SupabaseClient, User as SupabaseUser, Session } from '@supabase/supabase-js';
import { BehaviorSubject, Observable, from, throwError, timer, EMPTY } from 'rxjs';
import { switchMap, catchError, tap, filter, take } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User, LoginRequest, RegisterRequest, AuthResponse, UserRole } from '../models/user.model';
import { NotificationService } from './notification.service';

interface StoredAuthData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly supabase: SupabaseClient;
  private readonly router = inject(Router);
  private readonly notificationService = inject(NotificationService);

  // Auth state signals
  private readonly _isAuthenticated = signal<boolean>(false);
  private readonly _currentUser = signal<User | null>(null);
  private readonly _isLoading = signal<boolean>(true);
  private readonly _isInitialized = signal<boolean>(false);

  // Session management
  private session: Session | null = null;
  private refreshTimer?: number;
  
  // Storage keys
  private readonly STORAGE_KEY = 'sportplanner_auth';
  private readonly REMEMBER_ME_KEY = 'sportplanner_remember_me';

  // Public computed signals
  public readonly isAuthenticated = computed(() => this._isAuthenticated());
  public readonly currentUser = computed(() => this._currentUser());
  public readonly isLoading = computed(() => this._isLoading());
  public readonly isInitialized = computed(() => this._isInitialized());
  public readonly isGuest = computed(() => !this._isAuthenticated());

  constructor() {
    // Initialize Supabase client
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: false, // We'll handle session persistence manually
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    });

    // Initialize auth state
    this.initializeAuthState();

    // Set up auth state listener
    this.setupAuthStateListener();

    // Token refresh is handled by the auth state listener
  }

  /**
   * Initialize authentication state from stored data
   */
  private async initializeAuthState(): Promise<void> {
    try {
      this._isLoading.set(true);
      
      // Check for stored auth data
      const storedAuth = this.getStoredAuthData();
      
      if (storedAuth && storedAuth.expiresAt > Date.now()) {
        // Validate stored session with Supabase
        const { data: { session }, error } = await this.supabase.auth.setSession({
          access_token: storedAuth.accessToken,
          refresh_token: storedAuth.refreshToken
        });

        if (session && !error) {
          this.session = session;
          this._currentUser.set(storedAuth.user);
          this._isAuthenticated.set(true);
          this.scheduleTokenRefresh();
        } else {
          // Invalid session, clear stored data
          this.clearStoredAuthData();
        }
      }
    } catch (error) {
      console.error('Failed to initialize auth state:', error);
      this.clearStoredAuthData();
    } finally {
      this._isLoading.set(false);
      this._isInitialized.set(true);
    }
  }

  /**
   * Set up auth state change listener
   */
  private setupAuthStateListener(): void {
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      this.session = session;
      
      if (session?.user && event === 'SIGNED_IN') {
        // User signed in
        try {
          const user = await this.createUserFromSupabaseUser(session.user);
          this._currentUser.set(user);
          this._isAuthenticated.set(true);
          this.scheduleTokenRefresh();
        } catch (error) {
          console.error('Failed to create user from Supabase user:', error);
          this.handleAuthError('Failed to authenticate user');
        }
      } else if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        if (event === 'SIGNED_OUT') {
          this._currentUser.set(null);
          this._isAuthenticated.set(false);
          this.clearTokenRefresh();
          this.clearStoredAuthData();
        } else if (event === 'TOKEN_REFRESHED' && session) {
          // Update stored tokens after refresh
          const currentUser = this._currentUser();
          if (currentUser) {
            this.storeAuthData(session, currentUser);
            this.scheduleTokenRefresh();
          }
        }
      }
    });
  }

  /**
   * Login with email and password
   */
  async login(loginData: LoginRequest): Promise<AuthResponse> {
    try {
      this._isLoading.set(true);

      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.session || !data.user) {
        throw new Error('Login failed: No session or user data received');
      }

      const user = await this.createUserFromSupabaseUser(data.user);
      
      // Store auth data based on remember me preference
      this.storeAuthData(data.session, user, loginData.rememberMe);

      const authResponse: AuthResponse = {
        user,
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresIn: data.session.expires_in || 3600
      };

      this.notificationService.showSuccess('¡Bienvenido! Sesión iniciada correctamente.');
      
      return authResponse;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al iniciar sesión';
      this.notificationService.showError(message);
      throw error;
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Register new user
   */
  async register(registerData: RegisterRequest): Promise<AuthResponse> {
    try {
      this._isLoading.set(true);

      const { data, error } = await this.supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          data: {
            first_name: registerData.firstName,
            last_name: registerData.lastName
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('Registration failed: No user data received');
      }

      // Check if email confirmation is required
      if (!data.session) {
        this.notificationService.showInfo('Por favor, confirma tu email antes de iniciar sesión.');
        throw new Error('Email confirmation required');
      }

      const user = await this.createUserFromSupabaseUser(data.user);
      
      // Auto-login after successful registration
      this.storeAuthData(data.session, user, false);

      const authResponse: AuthResponse = {
        user,
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresIn: data.session.expires_in || 3600
      };

      this.notificationService.showSuccess('¡Cuenta creada exitosamente! Bienvenido a SportPlanner.');
      
      return authResponse;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al crear la cuenta';
      this.notificationService.showError(message);
      throw error;
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      this._isLoading.set(true);
      
      // Sign out from Supabase
      const { error } = await this.supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase logout error:', error);
      }

      // Clear local state regardless of Supabase response
      this._currentUser.set(null);
      this._isAuthenticated.set(false);
      this.session = null;
      this.clearTokenRefresh();
      this.clearStoredAuthData();

      this.notificationService.showInfo('Sesión cerrada correctamente.');
      
      // Navigate to home page
      await this.router.navigate(['/']);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if there's an error
      this._currentUser.set(null);
      this._isAuthenticated.set(false);
      this.clearStoredAuthData();
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<boolean> {
    try {
      if (!this.session?.refresh_token) {
        throw new Error('No refresh token available');
      }

      const { data, error } = await this.supabase.auth.refreshSession({
        refresh_token: this.session.refresh_token
      });

      if (error || !data.session) {
        throw new Error(error?.message || 'Failed to refresh token');
      }

      this.session = data.session;
      const currentUser = this._currentUser();
      
      if (currentUser) {
        this.storeAuthData(data.session, currentUser);
        this.scheduleTokenRefresh();
      }

      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Force logout on refresh failure
      await this.logout();
      return false;
    }
  }

  /**
   * Check if user is authenticated (useful for guards)
   */
  async checkAuthState(): Promise<boolean> {
    // Wait for initialization if not completed
    if (!this._isInitialized()) {
      await new Promise<void>(resolve => {
        const unsubscribe = effect(() => {
          if (this._isInitialized()) {
            unsubscribe.destroy();
            resolve();
          }
        });
      });
    }
    
    return this._isAuthenticated();
  }

  /**
   * Get current auth token
   */
  getAccessToken(): string | null {
    return this.session?.access_token || null;
  }

  /**
   * Create User object from Supabase user
   */
  private async createUserFromSupabaseUser(supabaseUser: SupabaseUser): Promise<User> {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      firstName: supabaseUser.user_metadata?.['first_name'] || '',
      lastName: supabaseUser.user_metadata?.['last_name'] || '',
      supabaseId: supabaseUser.id,
      role: UserRole.Coach, // Default role, should be determined by backend
      createdAt: new Date(supabaseUser.created_at),
      updatedAt: new Date()
    };
  }

  /**
   * Store auth data in local/session storage
   */
  private storeAuthData(session: Session, user: User, rememberMe: boolean = false): void {
    const authData: StoredAuthData = {
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresAt: Date.now() + ((session.expires_in || 3600) * 1000),
      user
    };

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(this.STORAGE_KEY, JSON.stringify(authData));
    
    // Store remember me preference
    localStorage.setItem(this.REMEMBER_ME_KEY, rememberMe.toString());
  }

  /**
   * Get stored auth data
   */
  private getStoredAuthData(): StoredAuthData | null {
    try {
      // Check remember me preference first
      const rememberMe = localStorage.getItem(this.REMEMBER_ME_KEY) === 'true';
      const storage = rememberMe ? localStorage : sessionStorage;
      
      const stored = storage.getItem(this.STORAGE_KEY);
      if (!stored) return null;

      const authData: StoredAuthData = JSON.parse(stored);
      
      // Check if token is expired
      if (authData.expiresAt <= Date.now()) {
        this.clearStoredAuthData();
        return null;
      }

      return authData;
    } catch (error) {
      console.error('Failed to parse stored auth data:', error);
      this.clearStoredAuthData();
      return null;
    }
  }

  /**
   * Clear stored auth data
   */
  private clearStoredAuthData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    sessionStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.REMEMBER_ME_KEY);
  }

  /**
   * Schedule automatic token refresh
   */
  private scheduleTokenRefresh(): void {
    this.clearTokenRefresh();

    const session = this.session;
    if (!session?.expires_at) return;

    // Refresh 5 minutes before expiration
    const refreshTime = (session.expires_at * 1000) - Date.now() - (5 * 60 * 1000);
    
    if (refreshTime > 0) {
      this.refreshTimer = window.setTimeout(() => {
        this.refreshToken();
      }, refreshTime);
    }
  }

  /**
   * Clear token refresh timer
   */
  private clearTokenRefresh(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = undefined;
    }
  }

  /**
   * Handle authentication errors
   */
  private handleAuthError(message: string): void {
    console.error('Auth error:', message);
    this.notificationService.showError(message);
    this.logout();
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<void> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) {
        throw new Error(error.message);
      }

      this.notificationService.showSuccess('Se ha enviado un email para restablecer tu contraseña.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al enviar email de recuperación';
      this.notificationService.showError(message);
      throw error;
    }
  }

  /**
   * Update password
   */
  async updatePassword(newPassword: string): Promise<void> {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw new Error(error.message);
      }

      this.notificationService.showSuccess('Contraseña actualizada correctamente.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al actualizar contraseña';
      this.notificationService.showError(message);
      throw error;
    }
  }
}