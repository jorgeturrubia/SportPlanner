import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, AuthResponse, User, Session } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Observable, from, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private sessionSubject = new BehaviorSubject<Session | null>(null);
  public session$ = this.sessionSubject.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
    
    // Listen for auth changes
    this.supabase.auth.onAuthStateChange((event, session) => {
      console.log('Supabase auth state change:', event, session);
      this.sessionSubject.next(session);
    });

    // Initialize with current session
    this.initializeSession();
  }

  private async initializeSession(): Promise<void> {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      this.sessionSubject.next(session);
    } catch (error) {
      console.error('Error getting current session:', error);
      this.sessionSubject.next(null);
    }
  }

  // Authentication methods
  signInWithEmail(email: string, password: string): Observable<AuthResponse> {
    return from(this.supabase.auth.signInWithPassword({ email, password }));
  }

  signUpWithEmail(email: string, password: string, userData?: any): Observable<AuthResponse> {
    return from(this.supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: userData
      }
    }));
  }

  signOut(): Observable<{ error: any }> {
    return from(this.supabase.auth.signOut());
  }

  resetPassword(email: string): Observable<{ error: any }> {
    return from(this.supabase.auth.resetPasswordForEmail(email));
  }

  // Session management
  getCurrentUser(): User | null {
    return this.sessionSubject.value?.user || null;
  }

  getCurrentSession(): Session | null {
    return this.sessionSubject.value;
  }

  getAccessToken(): string | null {
    return this.sessionSubject.value?.access_token || null;
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.sessionSubject.value;
  }

  // Get Supabase client for direct access if needed
  getClient(): SupabaseClient {
    return this.supabase;
  }
}