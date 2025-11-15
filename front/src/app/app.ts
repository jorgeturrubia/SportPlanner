import { Component, signal, inject, effect } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('sportplanner-frontend');
  private readonly auth = inject(AuthService);
  private readonly userService = inject(UserService);

  constructor() {
    // Log auth state and call backend when auth changes
    effect(() => {
      const v = this.auth.isAuthenticated();
      console.debug('[App] isAuthenticated', v);
      if (v) {
        this.userService.me().subscribe((u) => console.debug('[App] backend user', u), (err) => console.warn('[App] me() error', err));
      }
    });
  }
}
