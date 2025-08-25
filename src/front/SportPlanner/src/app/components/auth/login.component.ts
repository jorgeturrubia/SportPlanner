import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';

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
          @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
            <p class="text-error-500 text-sm mt-1">Por favor ingresa un email válido</p>
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
          @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
            <p class="text-error-500 text-sm mt-1">La contraseña es requerida</p>
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
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  togglePassword(): void {
    this.showPassword.set(!this.showPassword());
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');
      
      // TODO: Implement actual login logic
      console.log('Login form submitted:', this.loginForm.value);
      
      // Simulate API call
      setTimeout(() => {
        this.isLoading.set(false);
        this.errorMessage.set('Funcionalidad de login por implementar');
      }, 1000);
    }
  }
}