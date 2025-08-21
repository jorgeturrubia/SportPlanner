import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, LoginRequest, RegisterRequest } from '../../core/services/auth.service';

interface SportOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  activeTab = signal<'login' | 'register'>('login');
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  loginForm: FormGroup;
  registerForm: FormGroup;

  // Sport options for registration
  sportOptions: SportOption[] = [
    { value: 'futbol', label: 'Fútbol' },
    { value: 'baloncesto', label: 'Baloncesto' },
    { value: 'tenis', label: 'Tenis' },
    { value: 'voleibol', label: 'Voleibol' },
    { value: 'atletismo', label: 'Atletismo' },
    { value: 'natacion', label: 'Natación' },
    { value: 'gimnasia', label: 'Gimnasia' },
    { value: 'padel', label: 'Padel' },
    { value: 'hockey', label: 'Hockey' },
    { value: 'handball', label: 'Balonmano' },
    { value: 'rugby', label: 'Rugby' },
    { value: 'otro', label: 'Otro' }
  ];

  // Password strength indicator
  passwordStrength = computed(() => {
    const password = this.registerForm?.get('password')?.value || '';
    return this.calculatePasswordStrength(password);
  });

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      sport: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  switchTab(tab: 'login' | 'register') {
    this.activeTab.set(tab);
    this.error.set(null);
    this.success.set(false);
  }

  async onLogin() {
    if (this.loginForm.valid) {
      this.loading.set(true);
      this.error.set(null);

      const loginData: LoginRequest = this.loginForm.value;
      
      this.authService.signIn(loginData).subscribe({
        next: (response) => {
          if (!response.success) {
            this.error.set(response.message || 'Error during login');
          }
          this.loading.set(false);
        },
        error: (error) => {
          this.error.set('Error de conexión');
          this.loading.set(false);
        }
      });
    }
  }

  async onRegister() {
    if (this.registerForm.valid) {
      this.loading.set(true);
      this.error.set(null);

      const registerData: RegisterRequest = {
        name: this.registerForm.value.name,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        sport: this.registerForm.value.sport
      };

      this.authService.signUp(registerData).subscribe({
        next: (response) => {
          if (response.success) {
            this.success.set(true);
          } else {
            this.error.set(response.message || 'Error during registration');
          }
          this.loading.set(false);
        },
        error: (error) => {
          this.error.set('Error de conexión');
          this.loading.set(false);
        }
      });
    }
  }

  onBackToHome() {
    this.router.navigate(['/']);
  }

  // Password strength methods
  calculatePasswordStrength(password: string): number {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 6) strength++;
    
    // Contains lowercase
    if (/[a-z]/.test(password)) strength++;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength++;
    
    // Contains numbers
    if (/\d/.test(password)) strength++;
    
    // Contains special characters
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    
    return Math.min(strength, 4);
  }

  getPasswordStrengthText(strength: number): string {
    switch (strength) {
      case 0: return '';
      case 1: return 'Muy débil';
      case 2: return 'Débil';
      case 3: return 'Fuerte';
      case 4: return 'Muy fuerte';
      default: return '';
    }
  }

  getPasswordStrengthColor(strength: number): string {
    switch (strength) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  }

  // Form getters
  get loginEmailControl() {
    return this.loginForm.get('email');
  }

  get loginPasswordControl() {
    return this.loginForm.get('password');
  }

  get registerNameControl() {
    return this.registerForm.get('name');
  }

  get registerEmailControl() {
    return this.registerForm.get('email');
  }

  get registerPasswordControl() {
    return this.registerForm.get('password');
  }

  get confirmPasswordControl() {
    return this.registerForm.get('confirmPassword');
  }

  get sportControl() {
    return this.registerForm.get('sport');
  }
}