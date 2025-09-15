import { Component, OnInit, OnDestroy, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { Subject, firstValueFrom, filter, timeout, throwError, take } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { ThemeService } from '../../services/theme.service';
import { SubscriptionService } from '../../services/subscription.service';
import { LoginRequest, RegisterRequest } from '../../models/user.model';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIconComponent],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly themeService = inject(ThemeService);
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  
  currentTab = signal<'login' | 'register'>('login');
  showPassword = signal<boolean>(false);
  showConfirmPassword = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  
  // Theme integration
  readonly isDarkMode = this.themeService.isDarkMode;
  
  loginForm: FormGroup;
  registerForm: FormGroup;
  private redirectUrl = '/dashboard';

  constructor() {
    this.loginForm = this.createLoginForm();
    this.registerForm = this.createRegisterForm();
  }

  ngOnInit(): void {
    // Get redirect URL from query params
    this.activatedRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        if (params['redirectUrl']) {
          this.redirectUrl = params['redirectUrl'];
        }
      });

    // Check if user is already authenticated
    if (this.authService.isAuthenticated()) {
      this.router.navigate([this.redirectUrl]);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createLoginForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  private createRegisterForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { passwordMismatch: true };
    }
    
    if (confirmPassword?.errors?.['mismatch']) {
      delete confirmPassword.errors['mismatch'];
      if (Object.keys(confirmPassword.errors).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
    
    return null;
  }

  switchTab(tab: 'login' | 'register'): void {
    this.currentTab.set(tab);
    // Reset forms when switching tabs
    this.loginForm.reset();
    this.registerForm.reset();
    this.showPassword.set(false);
    this.showConfirmPassword.set(false);
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(current => !current);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update(current => !current);
  }

  async onLogin(): Promise<void> {
    if (this.loginForm.valid) {
      this.isLoading.set(true);

      try {
        const formValue = this.loginForm.value;
        const loginRequest: LoginRequest = {
          email: formValue.email,
          password: formValue.password,
          rememberMe: formValue.rememberMe || false
        };

        const response = await this.authService.login(loginRequest);

        console.log('🔍 LOGIN DEBUG:');
        console.log('  ✅ Login response:', response);
        console.log('  🔒 Is authenticated after login:', this.authService.isAuthenticated());
        console.log('  👤 Current user after login:', this.authService.currentUser()?.email);
        console.log('  🎯 Redirect URL:', this.redirectUrl);

        // Wait for session to be available with timeout
        await this.waitForSession();

        // Handle post-login redirection based on subscription status
        await this.handlePostAuthRedirection();

      } catch (error) {
        console.error('Login error:', error);
        // Error notification is handled by AuthService
      } finally {
        this.isLoading.set(false);
      }
    } else {
      this.markFormGroupTouched(this.loginForm);
      this.notificationService.showWarning('Por favor, completa todos los campos requeridos.');
    }
  }

  async onRegister(): Promise<void> {
    if (this.registerForm.valid) {
      this.isLoading.set(true);

      try {
        const formValue = this.registerForm.value;
        const registerRequest: RegisterRequest = {
          email: formValue.email,
          password: formValue.password,
          firstName: formValue.firstName,
          lastName: formValue.lastName
        };

        const response = await this.authService.register(registerRequest);

        // Wait for session to be available with timeout (only if registration provided immediate session)
        if (response) {
          await this.waitForSession();
        }

        // Handle post-registration redirection based on subscription status
        await this.handlePostAuthRedirection();

      } catch (error) {
        console.error('Registration error:', error);

        // Handle specific registration errors
        const errorMessage = error instanceof Error ? error.message : 'Error al crear la cuenta';

        if (errorMessage.includes('Email confirmation required')) {
          // User needs to confirm email, switch to login tab
          this.switchTab('login');
        }
        // Other error notifications are handled by AuthService
      } finally {
        this.isLoading.set(false);
      }
    } else {
      this.markFormGroupTouched(this.registerForm);
      this.notificationService.showWarning('Por favor, completa todos los campos requeridos.');
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      
      if (control && 'controls' in control) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  // Helper methods for template
  getFormControl(formName: 'login' | 'register', controlName: string) {
    const form = formName === 'login' ? this.loginForm : this.registerForm;
    return form.get(controlName);
  }

  hasError(formName: 'login' | 'register', controlName: string, errorType: string): boolean {
    const control = this.getFormControl(formName, controlName);
    return !!(control?.errors?.[errorType] && control?.touched);
  }

  async onForgotPassword(): Promise<void> {
    const emailControl = this.loginForm.get('email');

    if (!emailControl?.value) {
      this.notificationService.showWarning('Por favor, ingresa tu correo electrónico.');
      emailControl?.markAsTouched();
      return;
    }

    if (emailControl.errors?.['email']) {
      this.notificationService.showWarning('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    try {
      await this.authService.resetPassword(emailControl.value);
    } catch (error) {
      console.error('Password reset error:', error);
      // Error notification is handled by AuthService
    }
  }

  /**
   * Wait for authentication session to be available
   */
  private async waitForSession(): Promise<void> {
    console.log('  ⏳ Waiting for session to be available...');

    try {
      await firstValueFrom(
        this.authService.getSession().pipe(
          filter(session => !!session && !!session.access_token),
          take(1),
          timeout({
            each: 5000,
            with: () => throwError(() => new Error('Timeout waiting for session'))
          })
        )
      );
      console.log('  ✅ Session confirmed available');
    } catch (error) {
      console.warn('  ⚠️ Session wait timeout or error:', error);
      // Continue anyway - session might still be valid
    }
  }

  /**
   * Handle redirection after successful authentication based on subscription status
   */
  private async handlePostAuthRedirection(): Promise<void> {
    try {
      console.log('  🔍 Checking subscription status...');

      // Get subscription status with timeout
      const subscriptionStatus = await firstValueFrom(
        this.subscriptionService.getSubscriptionStatus().pipe(
          timeout({
            each: 10000,
            with: () => throwError(() => new Error('Timeout checking subscription status'))
          })
        )
      );

      console.log('  📋 Subscription status:', subscriptionStatus);

      // Determine redirect URL based on subscription status
      let finalRedirectUrl = this.redirectUrl;
      if (!subscriptionStatus.hasActiveSubscription) {
        finalRedirectUrl = '/subscription';
        console.log('  🔄 No active subscription, redirecting to subscription page...');
      } else {
        console.log('  ✅ Active subscription found, redirecting to dashboard...');
      }

      // Navigate to final redirect URL
      console.log('  🚀 Attempting navigation to:', finalRedirectUrl);
      await this.router.navigate([finalRedirectUrl]);
      console.log('  ✅ Navigation completed');

    } catch (error) {
      console.error('  ❌ Error checking subscription status:', error);

      // In case of error, redirect to subscription page for safety
      console.log('  🔄 Error occurred, redirecting to subscription page for safety...');
      try {
        await this.router.navigate(['/subscription']);
      } catch (navError) {
        console.error('  ❌ Navigation error:', navError);
        // Fallback: redirect to dashboard
        this.router.navigate(['/dashboard']);
      }
    }
  }
}
