import { Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public isAuthenticated = signal(false);

  constructor(private supabase: SupabaseService) {
    const session = this.supabase.session$.getValue();
    this.isAuthenticated.set(!!session);
    this.supabase.session$.subscribe((s) => {
      this.isAuthenticated.set(!!s);
    });
  }

  signUp(email: string, password: string, name?: string) {
    return this.supabase.signUp(email, password, { name });
  }

  signIn(email: string, password: string) {
    return this.supabase.signIn(email, password);
  }

  signOut() {
    return this.supabase.signOut();
  }

  async getAccessToken() {
    return this.supabase.getAccessToken();
  }

  async getUser() {
    return this.supabase.getUser();
  }
}
