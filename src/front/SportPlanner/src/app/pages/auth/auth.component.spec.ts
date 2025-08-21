import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

import { AuthComponent } from './auth.component';
import { AuthService } from '../../core/services/auth.service';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['signIn', 'signUp']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        AuthComponent,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with login tab active', () => {
      expect(component.activeTab()).toBe('login');
    });

    it('should initialize forms with correct structure', () => {
      expect(component.loginForm).toBeDefined();
      expect(component.registerForm).toBeDefined();
      
      // Login form structure
      expect(component.loginForm.get('email')).toBeTruthy();
      expect(component.loginForm.get('password')).toBeTruthy();
      
      // Register form structure
      expect(component.registerForm.get('name')).toBeTruthy();
      expect(component.registerForm.get('email')).toBeTruthy();
      expect(component.registerForm.get('password')).toBeTruthy();
      expect(component.registerForm.get('confirmPassword')).toBeTruthy();
      // expect(component.registerForm.get('sport')).toBeTruthy();
    });

    it('should initialize all signals with correct default values', () => {
      expect(component.loading()).toBe(false);
      expect(component.error()).toBeNull();
      expect(component.success()).toBe(false);
    });
  });

  describe('Tab Navigation', () => {
    it('should switch between login and register tabs', () => {
      component.switchTab('register');
      expect(component.activeTab()).toBe('register');

      component.switchTab('login');
      expect(component.activeTab()).toBe('login');
    });

    it('should clear error and success state when switching tabs', () => {
      component.error.set('Test error');
      component.success.set(true);

      component.switchTab('register');

      expect(component.error()).toBeNull();
      expect(component.success()).toBe(false);
    });

    it('should show correct tab content in template', () => {
      fixture.detectChanges();
      
      // Should show login form initially
      const loginForm = fixture.debugElement.query(By.css('form'));
      expect(loginForm).toBeTruthy();

      // Switch to register and check
      component.switchTab('register');
      fixture.detectChanges();
      
      const registerForm = fixture.debugElement.query(By.css('form'));
      expect(registerForm).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    describe('Login Form', () => {
      it('should be invalid when empty', () => {
        expect(component.loginForm.valid).toBeFalsy();
      });

      it('should require email and password', () => {
        const emailControl = component.loginForm.get('email');
        const passwordControl = component.loginForm.get('password');

        expect(emailControl?.hasError('required')).toBeTruthy();
        expect(passwordControl?.hasError('required')).toBeTruthy();
      });

      it('should validate email format', () => {
        const emailControl = component.loginForm.get('email');
        emailControl?.setValue('invalid-email');

        expect(emailControl?.hasError('email')).toBeTruthy();

        emailControl?.setValue('valid@email.com');
        expect(emailControl?.hasError('email')).toBeFalsy();
      });

      it('should validate password minimum length', () => {
        const passwordControl = component.loginForm.get('password');
        passwordControl?.setValue('123');

        expect(passwordControl?.hasError('minlength')).toBeTruthy();

        passwordControl?.setValue('123456');
        expect(passwordControl?.hasError('minlength')).toBeFalsy();
      });

      it('should be valid with correct data', () => {
        component.loginForm.patchValue({
          email: 'test@example.com',
          password: 'password123'
        });

        expect(component.loginForm.valid).toBeTruthy();
      });
    });

    describe('Register Form', () => {
      it('should be invalid when empty', () => {
        expect(component.registerForm.valid).toBeFalsy();
      });

      it('should require all fields', () => {
        const nameControl = component.registerForm.get('name');
        const emailControl = component.registerForm.get('email');
        const passwordControl = component.registerForm.get('password');
        const confirmPasswordControl = component.registerForm.get('confirmPassword');
        // const sportControl = component.registerForm.get('sport');

        expect(nameControl?.hasError('required')).toBeTruthy();
        expect(emailControl?.hasError('required')).toBeTruthy();
        expect(passwordControl?.hasError('required')).toBeTruthy();
        expect(confirmPasswordControl?.hasError('required')).toBeTruthy();
        // expect(sportControl?.hasError('required')).toBeTruthy();
      });

      it('should validate name minimum length', () => {
        const nameControl = component.registerForm.get('name');
        nameControl?.setValue('A');

        expect(nameControl?.hasError('minlength')).toBeTruthy();

        nameControl?.setValue('John Doe');
        expect(nameControl?.hasError('minlength')).toBeFalsy();
      });

      it('should validate password confirmation match', () => {
        component.registerForm.patchValue({
          password: 'password123',
          confirmPassword: 'differentpassword'
        });

        expect(component.registerForm.hasError('passwordMismatch')).toBeTruthy();

        component.registerForm.patchValue({
          confirmPassword: 'password123'
        });

        expect(component.registerForm.hasError('passwordMismatch')).toBeFalsy();
      });

      it('should be valid with correct data', () => {
        component.registerForm.patchValue({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          confirmPassword: 'password123'
        });

        expect(component.registerForm.valid).toBeTruthy();
      });
    });
  });

  // Password Strength Indicator tests - commented out as these methods are not implemented yet
  // describe('Password Strength Indicator', () => {
  //   it('should calculate password strength correctly', () => {
  //     expect(component.calculatePasswordStrength('123')).toBe(1);
  //     expect(component.calculatePasswordStrength('password')).toBe(2);
  //     expect(component.calculatePasswordStrength('Password123')).toBe(3);
  //     expect(component.calculatePasswordStrength('Password123!')).toBe(4);
  //   });

  //   it('should return strength level text in Spanish', () => {
  //     expect(component.getPasswordStrengthText(1)).toBe('Muy débil');
  //     expect(component.getPasswordStrengthText(2)).toBe('Débil');
  //     expect(component.getPasswordStrengthText(3)).toBe('Fuerte');
  //     expect(component.getPasswordStrengthText(4)).toBe('Muy fuerte');
  //   });

    // it('should update password strength when password changes', () => {
    //   const passwordControl = component.registerForm.get('password');
    //   passwordControl?.setValue('weak');
    //   
    //   expect(component.passwordStrength()).toBe(2);

    //   passwordControl?.setValue('StrongPassword123!');
    //   expect(component.passwordStrength()).toBe(4);
    // });
  // });

  describe('Form Submission', () => {
    describe('Login', () => {
      beforeEach(() => {
        component.loginForm.patchValue({
          email: 'test@example.com',
          password: 'password123'
        });
      });

      it('should not submit if form is invalid', async () => {
        component.loginForm.patchValue({ email: 'invalid-email' });
        
        await component.onLogin();
        
        expect(mockAuthService.signIn).not.toHaveBeenCalled();
      });

      it('should call authService.signIn with correct data', async () => {
        mockAuthService.signIn.and.returnValue(of({ success: true, user: { id: '1', email: 'test@example.com', name: 'Test User' } }));
        
        await component.onLogin();
        
        expect(mockAuthService.signIn).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123'
        });
      });

      it('should set loading state during login', async () => {
        mockAuthService.signIn.and.returnValue(of({ success: true }));
        
        const loginPromise = component.onLogin();
        expect(component.loading()).toBe(true);
        
        await loginPromise;
        expect(component.loading()).toBe(false);
      });

      it('should handle successful login', async () => {
        mockAuthService.signIn.and.returnValue(of({ success: true, user: { id: '1', email: 'test@example.com', name: 'Test User' } }));
        
        await component.onLogin();
        
        expect(component.error()).toBeNull();
      });

      it('should handle login error from service', async () => {
        mockAuthService.signIn.and.returnValue(of({ success: false, message: 'Invalid credentials' }));
        
        await component.onLogin();
        
        expect(component.error()).toBe('Invalid credentials');
        expect(component.loading()).toBe(false);
      });

      it('should handle login network error', async () => {
        mockAuthService.signIn.and.returnValue(throwError(() => new Error('Network error')));
        
        await component.onLogin();
        
        expect(component.error()).toBe('Error de conexión');
        expect(component.loading()).toBe(false);
      });
    });

    describe('Register', () => {
      beforeEach(() => {
        component.registerForm.patchValue({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          confirmPassword: 'password123'
        });
      });

      it('should not submit if form is invalid', async () => {
        component.registerForm.patchValue({ email: 'invalid-email' });
        
        await component.onRegister();
        
        expect(mockAuthService.signUp).not.toHaveBeenCalled();
      });

      it('should call authService.signUp with correct data', async () => {
        mockAuthService.signUp.and.returnValue(of({ success: true, user: { id: '1', email: 'john@example.com', name: 'John Doe' } }));
        
        await component.onRegister();
        
        expect(mockAuthService.signUp).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123'
        });
      });

      it('should set loading state during registration', async () => {
        mockAuthService.signUp.and.returnValue(of({ success: true }));
        
        const registerPromise = component.onRegister();
        expect(component.loading()).toBe(true);
        
        await registerPromise;
        expect(component.loading()).toBe(false);
      });

      it('should handle successful registration', async () => {
        mockAuthService.signUp.and.returnValue(of({ success: true, user: { id: '1', email: 'john@example.com', name: 'John Doe' } }));
        
        await component.onRegister();
        
        expect(component.success()).toBe(true);
        expect(component.error()).toBeNull();
      });

      it('should handle registration error from service', async () => {
        mockAuthService.signUp.and.returnValue(of({ success: false, message: 'Email already exists' }));
        
        await component.onRegister();
        
        expect(component.error()).toBe('Email already exists');
        expect(component.success()).toBe(false);
        expect(component.loading()).toBe(false);
      });

      it('should handle registration network error', async () => {
        mockAuthService.signUp.and.returnValue(throwError(() => new Error('Network error')));
        
        await component.onRegister();
        
        expect(component.error()).toBe('Error de conexión');
        expect(component.loading()).toBe(false);
      });
    });
  });

  describe('Navigation', () => {
    it('should navigate back to home when onBackToHome is called', () => {
      component.onBackToHome();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('Form Getters', () => {
    it('should return correct form controls', () => {
      expect(component.loginEmailControl).toBe(component.loginForm.get('email'));
      expect(component.loginPasswordControl).toBe(component.loginForm.get('password'));
      expect(component.registerNameControl).toBe(component.registerForm.get('name'));
      expect(component.registerEmailControl).toBe(component.registerForm.get('email'));
      expect(component.registerPasswordControl).toBe(component.registerForm.get('password'));
      expect(component.confirmPasswordControl).toBe(component.registerForm.get('confirmPassword'));
      // expect(component.sportControl).toBe(component.registerForm.get('sport'));
    });
  });

  // Sport Selection tests - commented out as sport field is not implemented
  // describe('Sport Selection', () => {
  //   it('should have sport options available', () => {
  //     expect(component.sportOptions.length).toBeGreaterThan(0);
  //     expect(component.sportOptions[0]).toEqual(jasmine.objectContaining({
  //       value: jasmine.any(String),
  //       label: jasmine.any(String)
  //     }));
  //   });

  //   it('should validate sport selection', () => {
  //     const sportControl = component.registerForm.get('sport');
  //     expect(sportControl?.hasError('required')).toBeTruthy();

  //     sportControl?.setValue('futbol');
  //     expect(sportControl?.hasError('required')).toBeFalsy();
  //   });
  // });

  describe('Error Messages', () => {
    it('should show validation errors in Spanish', () => {
      component.loginForm.get('email')?.setValue('');
      component.loginForm.get('email')?.markAsTouched();
      
      fixture.detectChanges();
      
      const errorElement = fixture.debugElement.query(By.css('.text-red-600'));
      expect(errorElement?.nativeElement.textContent).toContain('El email es requerido');
    });

    it('should show API errors in Spanish', () => {
      component.error.set('Usuario no encontrado');
      fixture.detectChanges();
      
      const errorElement = fixture.debugElement.query(By.css('.bg-red-50'));
      expect(errorElement?.nativeElement.textContent).toContain('Usuario no encontrado');
    });
  });

  describe('Success Messages', () => {
    it('should show success message after registration', () => {
      component.success.set(true);
      fixture.detectChanges();
      
      const successElement = fixture.debugElement.query(By.css('.bg-green-50'));
      expect(successElement?.nativeElement.textContent).toContain('¡Registro exitoso!');
    });
  });

  describe('Loading States', () => {
    it('should disable submit button when loading', () => {
      component.loading.set(true);
      fixture.detectChanges();
      
      const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
      expect(submitButton?.nativeElement.disabled).toBe(true);
    });

    it('should show loading text on submit button', () => {
      component.loading.set(true);
      fixture.detectChanges();
      
      const submitButton = fixture.debugElement.query(By.css('button[type="submit"]'));
      expect(submitButton?.nativeElement.textContent).toContain('...');
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for form inputs', () => {
      const emailLabel = fixture.debugElement.query(By.css('label[for="login-email"]'));
      const passwordLabel = fixture.debugElement.query(By.css('label[for="login-password"]'));
      
      expect(emailLabel).toBeTruthy();
      expect(passwordLabel).toBeTruthy();
    });

    it('should have proper ARIA attributes on form controls', () => {
      const emailInput = fixture.debugElement.query(By.css('#login-email'));
      const passwordInput = fixture.debugElement.query(By.css('#login-password'));
      
      expect(emailInput?.nativeElement.getAttribute('required')).not.toBeNull();
      expect(passwordInput?.nativeElement.getAttribute('required')).not.toBeNull();
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive classes in template', () => {
      const mainContainer = fixture.debugElement.query(By.css('.sm\\:mx-auto'));
      expect(mainContainer).toBeTruthy();
    });
  });
});