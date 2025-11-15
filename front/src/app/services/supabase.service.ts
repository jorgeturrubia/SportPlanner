import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, Session, User } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private client: SupabaseClient;
  public session$ = new BehaviorSubject<Session | null>(null);
  public user$ = new BehaviorSubject<User | null>(null);

  constructor() {
    this.client = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.init();
  }

  private async init() {
    const { data } = await this.client.auth.getSession();
    const session = data.session ?? null;
    this.session$.next(session);
    this.user$.next(session?.user ?? null);

    this.client.auth.onAuthStateChange((_event, session) => {
      this.session$.next(session ?? null);
      this.user$.next(session?.user ?? null);
    });
  }

  public signUp(email: string, password: string) {
    return this.client.auth.signUp({ email, password });
  }

  public signIn(email: string, password: string) {
    return this.client.auth.signInWithPassword({ email, password });
  }

  public signOut() {
    return this.client.auth.signOut();
  }

  public getAccessToken(): string | null {
    return this.session$.getValue()?.access_token ?? null;
  }

  public async getUser() {
    const { data } = await this.client.auth.getUser();
    return data.user ?? null;
  }

  public getClient() {
    return this.client;
  }
}
