import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { SupabaseService } from '../services/supabase.service';
import { CommonModule, NgIf, NgFor, JsonPipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-profile',
  template: `
    <div style="padding: 20px; max-width: 1200px;">
      <h2>Profile</h2>

      <div *ngIf="loading()">Loading...</div>

      <div *ngIf="error()" style="color: red; padding: 10px; border: 1px solid red; margin: 10px 0; border-radius: 4px;">
        <strong>Error:</strong> {{ error() }}
        <div *ngIf="errorDetails()" style="margin-top: 10px; font-size: 12px;">
          <strong>Details:</strong>
          <pre style="white-space: pre-wrap;">{{ errorDetails() }}</pre>
        </div>
      </div>

      <div *ngIf="!loading() && !error() && user()">
        <h3>User Data from Backend:</h3>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px;">{{ user() | json }}</pre>
      </div>

      <div *ngIf="!loading() && !error() && !user()">
        <p>No user data available</p>
      </div>

      <hr>

      <div style="background: #e8f4f8; padding: 15px; border-radius: 4px; margin: 15px 0;">
        <h3>JWT Claims from Backend</h3>
        <button (click)="loadClaims()" [disabled]="loadingClaims()"
                style="padding: 8px 16px; margin-bottom: 10px; cursor: pointer;">
          {{ loadingClaims() ? 'Loading...' : 'Fetch Claims' }}
        </button>

        <div *ngIf="claims()">
          <p><strong>Is Authenticated:</strong> {{ claims()!.isAuthenticated }}</p>
          <p><strong>Claims Count:</strong> {{ claims()!.claimsCount }}</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;" *ngIf="claims()!.claims.length > 0">
            <thead>
              <tr style="background: #d0e8f0;">
                <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Claim Type</th>
                <th style="border: 1px solid #ccc; padding: 8px; text-align: left;">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let claim of claims()!.claims">
                <td style="border: 1px solid #ccc; padding: 8px; font-family: monospace; font-size: 12px;">{{ claim.type }}</td>
                <td style="border: 1px solid #ccc; padding: 8px; word-break: break-all;">{{ claim.value }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <hr>

      <div>
        <h4>Debug Info:</h4>
        <p><strong>Has Token:</strong> {{ hasToken() }}</p>
        <p><strong>Token:</strong> <span style="font-family: monospace; font-size: 11px;">{{ token()?.substring(0, 100) }}...</span></p>
      </div>

      <hr>

      <button (click)="signOut()" style="padding: 10px 20px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">
        Sign out
      </button>
    </div>
  `,
  imports: [CommonModule, NgIf, NgFor, JsonPipe]
})
export class ProfileComponent {
  private userSvc = inject(UserService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private supabase = inject(SupabaseService);
  protected user = signal<any | null>(null);
  protected loading = signal(false);
  protected error = signal<string | null>(null);
  protected errorDetails = signal<string | null>(null);
  protected hasToken = signal(false);
  protected token = signal<string | null>(null);
  protected claims = signal<any>(null);
  protected loadingClaims = signal(false);

  constructor() {
    this.checkToken();
    this.loadClaims();
    this.loadMe();
  }

  checkToken() {
    const token = this.supabase.getAccessToken();
    this.hasToken.set(!!token);
    this.token.set(token);
    console.log('Access token:', token);
  }

  loadClaims() {
    this.loadingClaims.set(true);
    this.userSvc.debugClaims().subscribe({
      next: (c) => {
        console.log('Claims received:', c);
        this.claims.set(c);
        this.loadingClaims.set(false);
      },
      error: (err) => {
        console.error('debugClaims() error:', err);
        this.loadingClaims.set(false);
      }
    });
  }

  loadMe() {
    this.loading.set(true);
    this.error.set(null);
    this.errorDetails.set(null);
    this.userSvc.me().subscribe({
      next: (u) => {
        console.log('User data received:', u);
        this.user.set(u);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('me() error:', err);
        this.loading.set(false);
        this.user.set(null);
        const errorMsg = err.error?.error || err.error?.message || err.message || 'Unknown error';
        const stackTrace = err.error?.stackTrace || '';
        this.error.set(`${err.status} ${err.statusText}: ${errorMsg}`);
        if (stackTrace) {
          this.errorDetails.set(stackTrace);
        }
      }
    });
  }

  async signOut() {
    await this.auth.signOut();
    await this.router.navigate(['/login']);
  }
}
