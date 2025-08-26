import { Component, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { AuthService } from '../../services';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, NgIcon],
  template: `
    <div>
      <h2 class="text-2xl font-bold text-center text-secondary-900 mb-6">
        Crear Cuenta
      </h2>

      <form
        [formGroup]="registerForm"
        (ngSubmit)="onSubmit()"
        class="space-y-6"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              for="firstName"
              class="block text-sm font-medium text-secondary-700 mb-2"
            >
              Nombre
            </label>
            <input
              id="firstName"
              type="text"
              formControlName="firstName"
              class="input-field"
              placeholder="Tu nombre"
            />
            @if (getFieldError('firstName')) {
              <p class="text-error-500 text-sm mt-1">{{ getFieldError('firstName') }}</p>
            }
          </div>

          <div>
            <label
              for="lastName"
              class="block text-sm font-medium text-secondary-700 mb-2"
            >
              Apellido
            </label>
            <input
              id="lastName"
              type="text"
              formControlName="lastName"
              class="input-field"
              placeholder="Tu apellido"
            />
            @if (getFieldError('lastName')) {
              <p class="text-error-500 text-sm mt-1">{{ getFieldError('lastName') }}</p>
            }
          </div>
        </div>

        <div>
          <label
            for="email"
            class="block text-sm font-medium text-secondary-700 mb-2"
          >
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
          <label
            for="password"
            class="block text-sm font-medium text-secondary-700 mb-2"
          >
            Contraseña
          </label>
          <div class="relative">
            <input
              id="password"
              [type]="showPassword() ? 'text' : 'password'"
              formControlName="password"
              class="input-field pr-10"
              placeholder="Mínimo 8 caracteres"
            />
            <button
              type="button"
              (click)="togglePassword()"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <ng-icon
                [name]="showPassword() ? 'heroEyeSlash' : 'heroEye'"
                class="h-5 w-5 text-secondary-400"
              ></ng-icon>
            </button>
          </div>
          @if (getFieldError('password')) {
            <p class="text-error-500 text-sm mt-1">{{ getFieldError('password') }}</p>
          }
        </div>

        <div>
          <label
            for="confirmPassword"
            class="block text-sm font-medium text-secondary-700 mb-2"
          >
            Confirmar Contraseña
          </label>
          <div class="relative">
            <input
              id="confirmPassword"
              [type]="showConfirmPassword() ? 'text' : 'password'"
              formControlName="confirmPassword"
              class="input-field pr-10"
              placeholder="Repite tu contraseña"
            />
            <button
              type="button"
              (click)="toggleConfirmPassword()"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <ng-icon
                [name]="showConfirmPassword() ? 'heroEyeSlash' : 'heroEye'"
                class="h-5 w-5 text-secondary-400"
              ></ng-icon>
            </button>
          </div>
          @if (getFieldError('confirmPassword')) {
            <p class="text-error-500 text-sm mt-1">{{ getFieldError('confirmPassword') }}</p>
          }
        </div>

        <div class="flex items-center">
          <input
            id="accept-terms"
            type="checkbox"
            formControlName="acceptTerms"
            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
          />
          <label
            for="accept-terms"
            class="ml-2 block text-sm text-secondary-700"
          >
            Acepto los
            <a href="#" class="text-primary-600 hover:text-primary-700"
              >términos y condiciones</a
            >
          </label>
        </div>
        @if (getFieldError('acceptTerms')) {
          <p class="text-error-500 text-sm mt-1">{{ getFieldError('acceptTerms') }}</p>
        } @if (errorMessage()) {
        <div
          class="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg"
        >
          <div class="flex items-center">
            <ng-icon
              name="heroExclamationTriangle"
              class="h-5 w-5 mr-2"
            ></ng-icon>
            {{ errorMessage() }}
          </div>
        </div>
        } @if (successMessage()) {
        <div
          class="bg-success-50 border border-success-200 text-success-700 px-4 py-3 rounded-lg"
        >
          <div class="flex items-center">
            <ng-icon name="heroCheckCircle" class="h-5 w-5 mr-2"></ng-icon>
            {{ successMessage() }}
          </div>
        </div>
        }

        <button
          type="submit"
          [disabled]="registerForm.invalid || isLoading()"
          class="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          @if (isLoading()) {
          <span>Creando cuenta...</span>
          } @else {
          <span>Crear Cuenta</span>
          }
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-secondary-600">
          ¿Ya tienes cuenta?
          <a
            routerLink="/auth/login"
            class="text-primary-600 hover:text-primary-700 font-medium"
          >
            Inicia sesión aquí
          </a>
        </p>
      </div>

      <div class="mt-4 text-center">
        <a
          href="/#suscripciones"
          class="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
        >
          <ng-icon name="heroInformationCircle" class="h-4 w-4 mr-1"></ng-icon>
          Ver planes de suscripción
        </a>
      </div>
    </div>
  `,
})
export class RegisterComponent implements OnDestroy {
  registerForm: FormGroup;
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  successMessage = signal('');
  private destroy$ = new Subject<void>();

  // Auth service signals
  isLoading: any;
  errorMessage: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        acceptTerms: [false, [Validators.requiredTrue]],
      },
      { validators: this.passwordMatchValidator }
    );

    // Initialize auth service signals
    this.isLoading = this.authService.getLoadingState();
    this.errorMessage = this.authService.getAuthError();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  passwordMatchValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  togglePassword(): void {
    this.showPassword.set(!this.showPassword());
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.clearMessages();
      this.markFormGroupTouched();

      const { firstName, lastName, email, password } = this.registerForm.value;
      
      this.authService.register({ 
        firstName,
        lastName,
        email, 
        password
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.successMessage.set('¡Cuenta creada exitosamente! Redirigiendo...');
          // Small delay to show success message before navigation
          setTimeout(() => {
            this.authService.navigateAfterLogin();
          }, 1500);
        },
        error: (error) => {
          // Error is handled by the auth service and displayed via subscription
          console.error('Registration error:', error);
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
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
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
      if (field.errors['passwordMismatch']) {
        return 'Las contraseñas no coinciden';
      }
      if (field.errors['requiredTrue']) {
        return 'Debes aceptar los términos y condiciones';
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      firstName: 'El nombre',
      lastName: 'El apellido',
      email: 'El correo electrónico',
      password: 'La contraseña',
      confirmPassword: 'La confirmación de contraseña',
      acceptTerms: 'Los términos y condiciones'
    };
    return labels[fieldName] || fieldName;
  }
}
