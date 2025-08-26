import { Component, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { AuthService } from '../../services';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NgIcon],
  template: `
    <div>
      <h2 class="text-2xl font-bold text-center text-secondary-900 mb-6">Iniciar Sesión</h2>
      
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-secondary-700 mb-2">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            formControlName="email"
            class="input-field"
            placeholder="tu@email.com"
          />
          @if (getFieldError('email')) {
            <p class="text-error-500 text-sm mt-1">{{ getFieldError('email') }}</p>
          }
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-secondary-700 mb-2">
            Contraseña
          </label>
          <div class="relative">
            <input
              id="password"
              [type]="showPassword() ? 'text' : 'password'"
              formControlName="password"
              class="input-field pr-10"
              placeholder="Tu contraseña"
            />
            <button
              type="button"
              (click)="togglePassword()"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <ng-icon [name]="showPassword() ? 'heroEyeSlash' : 'heroEye'" class="h-5 w-5 text-secondary-400"></ng-icon>
            </button>
          </div>
          @if (getFieldError('password')) {
            <p class="text-error-500 text-sm mt-1">{{ getFieldError('password') }}</p>
          }
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              formControlName="rememberMe"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-secondary-700">
              Recordarme
            </label>
          </div>
          <a href="#" class="text-sm text-primary-600 hover:text-primary-700">
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        @if (errorMessage()) {
          <div class="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
            <div class="flex items-center">
              <ng-icon name="heroExclamationTriangle" class="h-5 w-5 mr-2"></ng-icon>
              {{ errorMessage() }}
            </div>
          </div>
        }

        @if (successMessage()) {
          <div class="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg">
            <div class="flex items-center">
              <ng-icon name="heroCheckCircle" class="h-5 w-5 mr-2"></ng-icon>
              {{ successMessage() }}
            </div>
          </div>
        }

        <button
          type="submit"
          [disabled]="loginForm.invalid || isLoading()"
          class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          @if (isLoading()) {
            <span>Iniciando sesión...</span>
          } @else {
            <span>Iniciar Sesión</span>
          }
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-secondary-600">
          ¿No tienes cuenta?
          <a routerLink="/auth/register" class="text-primary-600 hover:text-primary-700 font-medium">
            Regístrate aquí
          </a>
        </p>
      </div>

      <div class="mt-4 text-center">
        <a href="/#suscripciones" class="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
          <ng-icon name="heroInformationCircle" class="h-4 w-4 mr-1"></ng-icon>
          Ver planes de suscripción
        </a>
      </div>
    </div>
  `
})
export class LoginComponent implements OnDestroy {
  loginForm: FormGroup;
  showPassword = signal(false);
  successMessage = signal('');
  private destroy$ = new Subject<void>();

  // Auth service signals
  isLoading: any;
  errorMessage: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });

    // Initialize auth service signals
    this.isLoading = this.authService.getLoadingState();
    this.errorMessage = this.authService.getAuthError();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  togglePassword(): void {
    this.showPassword.set(!this.showPassword());
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.clearMessages();
      this.markFormGroupTouched();
      
      const { email, password, rememberMe } = this.loginForm.value;
      
      this.authService.login({ email, password, rememberMe })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.successMessage.set('¡Inicio de sesión exitoso! Redirigiendo...');
            // Small delay to show success message before navigation
            setTimeout(() => {
              this.authService.navigateAfterLogin();
            }, 1000);
          },
          error: (error) => {
            // Error is handled by the auth service and displayed via subscription
            console.error('Login error:', error);
          }
        });
    } else {
      this.markFormGroupTouched();
    }
  }

  private clearMessages(): void {
    this.successMessage.set('');
    this.authService.clearAuthError();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} es requerido`;
      }
      if (field.errors['email']) {
        return 'Por favor ingresa un email válido';
      }
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      email: 'El correo electrónico',
      password: 'La contraseña'
    };
    return labels[fieldName] || fieldName;
  }
}