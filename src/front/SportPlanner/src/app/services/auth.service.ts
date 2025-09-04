import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { createClient, SupabaseClient, User as SupabaseUser, Session } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, LoginRequest, RegisterRequest, AuthResponse, UserRole } from '../models/user.model';
import { NotificationService } from './notification.service';

// Types for stored auth data
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
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser: boolean;

  // Auth state signals
  private readonly _isAuthenticated = signal<boolean>(false);
  private readonly _currentUser = signal<User | null>(null);
  private readonly _isLoading = signal<boolean>(true);
  private readonly _isInitialized = signal<boolean>(false);

  // Session management
  private refreshTimer?: ReturnType<typeof setTimeout>;
  private readonly STORAGE_KEY = 'sportplanner-auth';
  private readonly REMEMBER_ME_KEY = 'sportplanner-remember-me';
  private session = new BehaviorSubject<Session | null>(null);

  // Public computed signals
  public readonly isAuthenticated = computed(() => this._isAuthenticated());
  public readonly currentUser = computed(() => this._currentUser());
  public readonly isLoading = computed(() => this._isLoading());
  public readonly isInitialized = computed(() => this._isInitialized());
  public readonly isGuest = computed(() => !this._isAuthenticated());

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    // Initialize Supabase client with lock-safe configuration
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey, {
      auth: {
        autoRefreshToken: false, // Disable auto refresh to prevent lock conflicts
        persistSession: false, // We handle persistence manually
        detectSessionInUrl: true,
        flowType: 'pkce'
      }
    });

    // Initialize auth state synchronously first (SSR safe)
    this.initializeAuthStateSync();

    // Set up auth state listener (only in browser)
    if (this.isBrowser) {
      this.setupAuthStateListener();
      // Initialize async operations in browser only
      this.initializeAuthStateAsync();
    }

    // Token refresh is handled by the auth state listener
  }

  /**
   * Initialize authentication state synchronously (for SSR compatibility)
   */
  private initializeAuthStateSync(): void {
    // Set default unauthenticated state immediately
    this._isAuthenticated.set(false);
    this._currentUser.set(null);
    this._isLoading.set(true);
    
    // Mark as initialized once basic setup is done
    // Actual auth state will be resolved in initializeAuthStateAsync
    setTimeout(() => {
      if (!this.isBrowser) {
        this._isInitialized.set(true);
        this._isLoading.set(false);
      }
    }, 0);
  }

  /**
   * Initialize authentication state from stored data (browser only)
   */
  private async initializeAuthStateAsync(): Promise<void> {
    if (!this.isBrowser) return;

    try {
      // Check for stored auth data
      const storedAuth = this.getStoredAuthData();
      
      if (storedAuth && storedAuth.expiresAt > Date.now()) {
        // Validate stored session with Supabase
        const { data: { session }, error } = await this.supabase.auth.setSession({
          access_token: storedAuth.accessToken,
          refresh_token: storedAuth.refreshToken
        });

        if (!error && session) {
          console.log('✅ Restored auth session from storage');
          const user = this.mapSupabaseUser(session.user);
          this.updateAuthState(session, user);
        } else {
          console.log('❌ Stored session invalid, clearing auth data');
          this.clearStoredAuthData();
          this.updateAuthState(null, null);
        }
      } else {
        // No valid stored session
        console.log('ℹ️ No valid stored auth session found');
        if (storedAuth) {
          this.clearStoredAuthData();
        }
        this.updateAuthState(null, null);
      }
    } catch (error) {
      console.error('❌ Error initializing auth state:', error);
      this.clearStoredAuthData();
      this.updateAuthState(null, null);
    } finally {
      this._isLoading.set(false);
      this._isInitialized.set(true);
    }
  }

  /**
   * Set up auth state listener
   */
  private setupAuthStateListener(): void {
    this.supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state change:', event, session?.user?.email);
      
      if (session && session.user) {
        const user = this.mapSupabaseUser(session.user);
        this.updateAuthState(session, user);
        this.scheduleTokenRefresh();
      } else {
        this.updateAuthState(null, null);
        this.clearTokenRefresh();
        
        // Handle logout/sign out
        if (event === 'SIGNED_OUT') {
          this.clearStoredAuthData();
          await this.router.navigate(['/auth']);
        }
      }
    });
  }

  /**
   * Update auth state
   */
  private updateAuthState(session: Session | null, user: User | null): void {
    this.session.next(session);
    this._currentUser.set(user);
    this._isAuthenticated.set(!!session && !!user);
    
    if (!this._isInitialized()) {
      this._isLoading.set(false);
      this._isInitialized.set(true);
    }
  }

  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      this._isLoading.set(true);

      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        console.error('Login error:', error);
        this.notificationService.showError(`Error de inicio de sesión: ${error.message}`);
        throw error;
      }

      if (!data.session || !data.user) {
        const errorMsg = 'No se recibió sesión válida del servidor';
        this.notificationService.showError(errorMsg);
        throw new Error(errorMsg);
      }

      // Map user data and store auth info
      const user = this.mapSupabaseUser(data.user);
      this.storeAuthData(data.session, user, credentials.rememberMe || false);

      console.log('✅ Login successful:', user.email);
      this.notificationService.showSuccess(`¡Bienvenido, ${user.firstName || user.email}!`);

      return {
        user,
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresIn: data.session.expires_in || 3600
      };

    } catch (error: unknown) {
      console.error('Login failed:', error);
      
      let errorMessage = 'Error desconocido durante el inicio de sesión';
      if (error instanceof Error) {
        if (error.message?.includes('Invalid login credentials')) {
          errorMessage = 'Credenciales incorrectas. Verifica tu email y contraseña.';
        } else if (error.message?.includes('Email not confirmed')) {
          errorMessage = 'Por favor confirma tu email antes de iniciar sesión.';
        } else {
          errorMessage = error.message;
        }
      }

      throw new Error(errorMessage);
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      this._isLoading.set(true);

      const { data, error } = await this.supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            role: UserRole.Coach
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        this.notificationService.showError(`Error de registro: ${error.message}`);
        throw error;
      }

      if (!data.user) {
        const errorMsg = 'No se pudo crear el usuario';
        this.notificationService.showError(errorMsg);
        throw new Error(errorMsg);
      }

      const user = this.mapSupabaseUser(data.user);

      // If session exists (email confirmation not required), store auth data
      if (data.session) {
        this.storeAuthData(data.session, user, false);
        console.log('✅ Registration successful with immediate login:', user.email);
        this.notificationService.showSuccess(`¡Bienvenido, ${user.firstName}! Tu cuenta ha sido creada.`);
      } else {
        console.log('✅ Registration successful, confirmation needed:', user.email);
        this.notificationService.showInfo('Revisa tu email para confirmar tu cuenta antes de iniciar sesión.');
      }

      if (data.session) {
        return {
          user,
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
          expiresIn: data.session.expires_in || 3600
        };
      } else {
        // No session means email confirmation required
        throw new Error('Registro exitoso. Confirma tu email para continuar.');
      }

    } catch (error: unknown) {
      console.error('Registration failed:', error);
      
      let errorMessage = 'Error desconocido durante el registro';
      if (error instanceof Error) {
        if (error.message?.includes('User already registered')) {
          errorMessage = 'Este email ya está registrado. Intenta iniciar sesión.';
        } else if (error.message?.includes('Password should be')) {
          errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
        } else {
          errorMessage = error.message;
        }
      }

      throw new Error(errorMessage);
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
      
      // Clear local state first
      this.clearStoredAuthData();
      this.clearTokenRefresh();
      
      // Supabase logout
      await this.supabase.auth.signOut();
      
      // Update local state
      this.updateAuthState(null, null);
      
      console.log('✅ Logout successful');
      this.notificationService.showInfo('Sesión cerrada correctamente');
      
      // Navigate to auth page
      await this.router.navigate(['/auth']);
      
    } catch (error) {
      console.error('Logout error:', error);
      // Even if Supabase logout fails, clear local state
      this.updateAuthState(null, null);
      await this.router.navigate(['/auth']);
    } finally {
      this._isLoading.set(false);
    }
  }

  /**
   * Map Supabase user to our User model
   */
  private mapSupabaseUser(supabaseUser: SupabaseUser): User {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      firstName: supabaseUser.user_metadata?.['first_name'] || '',
      lastName: supabaseUser.user_metadata?.['last_name'] || '',
      supabaseId: supabaseUser.id,
      role: (supabaseUser.user_metadata?.['role'] as UserRole) || UserRole.Coach,
      organizationId: supabaseUser.user_metadata?.['organization_id'],
      createdAt: new Date(supabaseUser.created_at),
      updatedAt: new Date()
    };
  }

  /**
   * Store auth data in local/session storage
   */
  private storeAuthData(session: Session, user: User, rememberMe = false): void {
    // Only store auth data in browser environment
    if (!this.isBrowser) {
      return;
    }
    
    const authData: StoredAuthData = {
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresAt: Date.now() + ((session.expires_in || 3600) * 1000),
      user
    };

    try {
      // Additional safety check for storage availability
      if (typeof localStorage === 'undefined' || typeof sessionStorage === 'undefined') {
        return;
      }
      
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(this.STORAGE_KEY, JSON.stringify(authData));
      
      // Store remember me preference
      localStorage.setItem(this.REMEMBER_ME_KEY, rememberMe.toString());
    } catch (error) {
      console.warn('Failed to store auth data:', error);
    }
  }

  /**
   * Get stored auth data
   */
  private getStoredAuthData(): StoredAuthData | null {
    // Only access storage in browser environment
    if (!this.isBrowser) {
      return null;
    }
    
    try {
      // Additional safety check for localStorage availability
      if (typeof localStorage === 'undefined' || typeof sessionStorage === 'undefined') {
        return null;
      }
      
      // Check remember me preference first
      const rememberMe = localStorage.getItem(this.REMEMBER_ME_KEY) === 'true';
      const storage = rememberMe ? localStorage : sessionStorage;
      
      const stored = storage.getItem(this.STORAGE_KEY);
      if (!stored) return null;

      const authData: StoredAuthData = JSON.parse(stored);
      
      // Validate structure
      if (!authData.accessToken || !authData.refreshToken || !authData.user) {
        console.warn('Invalid stored auth data structure');
        return null;
      }

      return authData;
    } catch (error) {
      console.error('Error parsing stored auth data:', error);
      return null;
    }
  }

  /**
   * Clear stored auth data
   */
  private clearStoredAuthData(): void {
    // Only clear storage in browser environment
    if (!this.isBrowser) {
      return;
    }
    
    try {
      // Additional safety check for storage availability
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(this.STORAGE_KEY);
        localStorage.removeItem(this.REMEMBER_ME_KEY);
      }
      
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(this.STORAGE_KEY);
      }
    } catch (error) {
      console.warn('Failed to clear stored auth data:', error);
    }
  }

  /**
   * Schedule automatic token refresh
   */
  private scheduleTokenRefresh(): void {
    // Only schedule token refresh in browser environment
    if (!this.isBrowser) {
      return;
    }
    
    this.clearTokenRefresh();

    const sessionValue = this.session.getValue();
    if (!sessionValue?.expires_at) return;

    // Refresh 5 minutes before expiration
    const refreshTime = (sessionValue.expires_at * 1000) - Date.now() - (5 * 60 * 1000);
    
    if (refreshTime > 0) {
      this.refreshTimer = setTimeout(async () => {
        await this.supabase.auth.refreshSession();
      }, refreshTime);
    }
  }

  /**
   * Clear token refresh timer
   */
  private clearTokenRefresh(): void {
    // Only clear timer in browser environment
    if (!this.isBrowser) {
      return;
    }
    
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = undefined;
    }
  }

  /**
   * Check authentication state
   */
  async checkAuthState(): Promise<boolean> {
    // Wait for initialization if still loading
    if (!this.isInitialized()) {
      await new Promise<void>((resolve) => {
        const checkInterval = setInterval(() => {
          if (this.isInitialized()) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 50);
      });
    }

    return this.isAuthenticated();
  }

  /**
   * Get current access token
   */
  getAccessToken(): string | null {
    const sessionValue = this.session.getValue();
    return sessionValue?.access_token || null;
  }

  /**
   * Handle authentication errors
   */
  private handleAuthError(error: unknown): void {
    console.error('Authentication error:', error);
    this.notificationService.showError('Error de autenticación. Por favor, inicia sesión nuevamente.');
    this.logout();
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<void> {
    try {
      const redirectTo = this.isBrowser 
        ? `${window.location.origin}/auth/reset-password`
        : 'https://localhost:4200/auth/reset-password'; // Fallback for SSR
        
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo
      });

      if (error) {
        throw new Error(error.message);
      }

      this.notificationService.showSuccess('Se ha enviado un email para restablecer tu contraseña.');
    } catch (error: unknown) {
      console.error('Password reset error:', error);
      const message = error instanceof Error ? error.message : 'Error desconocido';
      this.notificationService.showError(`Error: ${message}`);
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
    } catch (error: unknown) {
      console.error('Password update error:', error);
      const message = error instanceof Error ? error.message : 'Error desconocido';
      this.notificationService.showError(`Error: ${message}`);
      throw error;
    }
  }

  /**
   * Refresh current session
   */
  async refreshSession(): Promise<void> {
    try {
      const { data, error } = await this.supabase.auth.refreshSession();
      
      if (error) throw error;
      
      if (data.session && data.user) {
        const user = this.mapSupabaseUser(data.user);
        this.updateAuthState(data.session, user);
        
        // Update stored auth data
        const rememberMe = localStorage?.getItem(this.REMEMBER_ME_KEY) === 'true';
        this.storeAuthData(data.session, user, rememberMe);
      }
    } catch (error) {
      console.error('Session refresh failed:', error);
      this.handleAuthError(error);
    }
  }

  /**
   * Get current session observable
   */
  getSession(): Observable<Session | null> {
    return this.session.asObservable();
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: UserRole): boolean {
    return this.currentUser()?.role === role;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: UserRole[]): boolean {
    const userRole = this.currentUser()?.role;
    return userRole ? roles.includes(userRole) : false;
  }
}