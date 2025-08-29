import { Component, OnInit, OnDestroy, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
  
  currentTab = signal<'login' | 'register'>('login');
  showPassword = signal<boolean>(false);
  showConfirmPassword = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  
  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.createLoginForm();
    this.registerForm = this.createRegisterForm();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createLoginForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
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

  onLogin(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      
      // Simulate API call
      setTimeout(() => {
        console.log('Login attempted with:', this.loginForm.value);
        this.isLoading.set(false);
        // Here you would integrate with your authentication service
        // For now, just navigate to a success page or dashboard
        this.router.navigate(['/dashboard']);
      }, 1500);
    } else {
      this.markFormGroupTouched(this.loginForm);
    }
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      
      // Simulate API call
      setTimeout(() => {
        console.log('Registration attempted with:', this.registerForm.value);
        this.isLoading.set(false);
        // Here you would integrate with your authentication service
        // For now, just switch to login tab
        this.switchTab('login');
      }, 1500);
    } else {
      this.markFormGroupTouched(this.registerForm);
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
}