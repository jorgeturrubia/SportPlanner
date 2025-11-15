import { Component, signal, inject, effect } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, NgIf],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('sportplanner-frontend');
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  constructor() {
    // Log auth state when auth changes. Avoid calling backend here to prevent duplicate
    // requests; individual components should fetch user data when needed.
    effect(() => {
      const v = this.auth.isAuthenticated();
      console.debug('[App] isAuthenticated', v);
      // NOTE: Kept for visibility but removed backend call to avoid duplicate HTTP requests
      // (ProfileComponent and other components should call userService.me() themselves).
    });
  }

  async signOut() {
    try {
      await this.auth.signOut();
    } finally {
      // Always navigate to login to clear protected UI
      await this.router.navigate(['/login']);
    }
  }
}
