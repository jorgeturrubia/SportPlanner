import { Component, inject, signal } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-profile',
  template: `
    <div>
      <h2>Profile</h2>
      <div *ngIf="loading()">Loading...</div>
      <pre *ngIf="user()">{{ user() | json }}</pre>
      <button (click)="signOut()">Sign out</button>
    </div>
  `,
  imports: [NgIf]
})
export class ProfileComponent {
  private userSvc = inject(UserService);
  private auth = inject(AuthService);
  protected user = signal<any | null>(null);
  protected loading = signal(false);

  constructor() {
    this.loadMe();
  }

  loadMe() {
    this.loading.set(true);
    this.userSvc.me().subscribe((u) => {
      this.user.set(u);
      this.loading.set(false);
    }, (err) => {
      this.loading.set(false);
      this.user.set(null);
      console.warn('me() error', err);
    });
  }

  signOut() {
    this.auth.signOut();
  }
}
