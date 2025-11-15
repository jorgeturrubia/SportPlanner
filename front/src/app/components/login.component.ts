import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  template: `
    <div>
      <h2>Login</h2>
      <div *ngIf="message()" style="color: red">{{ message() }}</div>
      <label>Email: <input #email type="email" /></label><br />
      <label>Password: <input #password type="password" /></label><br />
      <button (click)="login(email.value, password.value)">Sign in</button>
    </div>
  `,
  imports: [NgIf]
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  protected message = signal('');

  async login(email: string, password: string) {
    this.message.set('');
    try {
      const result = await this.auth.signIn(email, password);
      if (result && result.data?.session) {
        // redirect to profile
        await this.router.navigate(['/profile']);
      } else if (result.error) {
        this.message.set(result.error.message || 'Login failed');
      }
    } catch (ex: any) {
      this.message.set(ex?.message ?? 'Error');
    }
  }
}
