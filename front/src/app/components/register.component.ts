import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-register',
  template: `
    <div>
      <h2>Register</h2>
      <div *ngIf="message()" style="color: red">{{ message() }}</div>
      <label>Email: <input #email type="email" /></label><br />
      <label>Password: <input #password type="password" /></label><br />
      <button (click)="register(email.value, password.value)">Sign up</button>
    </div>
  `,
  imports: [NgIf]
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  protected message = signal('');

  async register(email: string, password: string) {
    this.message.set('');
    try {
      const result = await this.auth.signUp(email, password);
      if (result && result.data?.user) {
        // optional: auto-login or just navigate to login
        await this.router.navigate(['/login']);
      } else if (result.error) {
        this.message.set(result.error.message || 'Register failed');
      }
    } catch (ex: any) {
      this.message.set(ex?.message ?? 'Error');
    }
  }
}
