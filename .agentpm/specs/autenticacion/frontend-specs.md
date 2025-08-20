# 🔧 Especificaciones Técnicas Frontend - Autenticación PlanSport

> Documentación técnica completa para la implementación del módulo de autenticación con Angular 20, incluyendo arquitectura, componentes, servicios y patrones de desarrollo.

---

## 🏗️ Arquitectura General

### 📁 Estructura de Carpetas

```
src/app/features/auth/
├── components/
│   ├── auth-page/
│   │   ├── auth-page.component.ts
│   │   ├── auth-page.component.html
│   │   └── auth-page.component.scss
│   ├── login-form/
│   │   ├── login-form.component.ts
│   │   ├── login-form.component.html
│   │   └── login-form.component.scss
│   ├── register-form/
│   │   ├── register-form.component.ts
│   │   ├── register-form.component.html
│   │   └── register-form.component.scss
│   └── shared/
│       ├── auth-input/
│       ├── auth-button/
│       └── password-strength/
├── services/
│   ├── auth.service.ts
│   ├── token.service.ts
│   └── auth-state.service.ts
├── guards/
│   ├── auth.guard.ts
│   ├── guest.guard.ts
│   └── role.guard.ts
├── interceptors/
│   ├── auth.interceptor.ts
│   ├── error.interceptor.ts
│   └── token-refresh.interceptor.ts
├── models/
│   ├── auth-user.interface.ts
│   ├── auth-request.interface.ts
│   ├── auth-response.interface.ts
│   └── auth-state.interface.ts
├── validators/
│   ├── custom-validators.ts
│   └── async-validators.ts
└── auth.routes.ts
```

### 🎯 Principios Arquitectónicos

1. **Standalone Components**: Todos los componentes serán standalone para aprovechar las nuevas características de Angular 20
2. **Signals**: Estado reactivo usando Angular Signals para mejor performance
3. **Reactive Forms**: Formularios reactivos con validaciones robustas
4. **Lazy Loading**: Carga diferida del módulo de autenticación
5. **Separation of Concerns**: Separación clara entre presentación, lógica de negocio y datos

---

## 🧩 Componentes

### 🏠 AuthPageComponent (Principal)

```typescript
@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [CommonModule, RouterModule, LoginFormComponent, RegisterFormComponent],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthPageComponent implements OnInit {
  // Signals para estado reactivo
  activeTab = signal<'login' | 'register'>('login');
  isLoading = signal(false);
  
  // Inyección de dependencias
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  
  ngOnInit() {
    // Leer tab desde query params
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab === 'login' || tab === 'register') {
        this.activeTab.set(tab);
      }
    });
  }
  
  switchTab(tab: 'login' | 'register') {
    this.activeTab.set(tab);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab },
      queryParamsHandling: 'merge'
    });
  }
}
```

**Responsabilidades**:
- Manejo de navegación entre tabs
- Sincronización con query parameters
- Layout principal de la página de autenticación
- Coordinación entre componentes hijos

### 🔐 LoginFormComponent

```typescript
@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AuthInputComponent, AuthButtonComponent],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent implements OnInit {
  // Signals para estado
  isLoading = signal(false);
  showPassword = signal(false);
  errorMessage = signal<string | null>(null);
  
  // Form reactivo
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });
  
  // Inyección de dependencias
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  
  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);
      
      try {
        const credentials = this.loginForm.value as LoginRequest;
        await this.authService.login(credentials);
        this.router.navigate(['/dashboard']);
      } catch (error) {
        this.errorMessage.set(this.getErrorMessage(error));
      } finally {
        this.isLoading.set(false);
      }
    }
  }
}
```

**Características**:
- Validación en tiempo real
- Estados de carga y error
- Mostrar/ocultar contraseña
- Checkbox "Recordarme"
- Integración con AuthService

### 📋 RegisterFormComponent

```typescript
@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AuthInputComponent, PasswordStrengthComponent],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterFormComponent implements OnInit {
  // Signals para estado
  isLoading = signal(false);
  passwordStrength = signal(0);
  errorMessage = signal<string | null>(null);
  
  // Form reactivo con validaciones complejas
  registerForm = this.fb.group({
    fullName: ['', [Validators.required, CustomValidators.fullName]],
    email: ['', [Validators.required, Validators.email], [AsyncValidators.emailExists]],
    password: ['', [Validators.required, CustomValidators.strongPassword]],
    confirmPassword: ['', [Validators.required]],
    acceptTerms: [false, [Validators.requiredTrue]]
  }, {
    validators: [CustomValidators.passwordMatch('password', 'confirmPassword')]
  });
  
  // Computed signals
  passwordsMatch = computed(() => {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    return password === confirmPassword;
  });
}
```

**Características**:
- Validaciones síncronas y asíncronas
- Indicador de fortaleza de contraseña
- Validación de confirmación de contraseña
- Términos y condiciones
- Auto-login después del registro

### 🎨 Componentes Compartidos

#### AuthInputComponent
```typescript
@Component({
  selector: 'app-auth-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="auth-input-container">
      <label [for]="inputId" class="auth-label">
        {{ label }}
        <span *ngIf="required" class="text-red-500">*</span>
      </label>
      
      <div class="relative">
        <input
          [id]="inputId"
          [type]="inputType()"
          [formControl]="control"
          [placeholder]="placeholder"
          class="auth-input"
          [class.error]="hasError()"
          [class.success]="isValid()"
        />
        
        <!-- Toggle password visibility -->
        <button
          *ngIf="type === 'password'"
          type="button"
          (click)="togglePasswordVisibility()"
          class="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          <lucide-icon [name]="showPassword() ? 'eye-off' : 'eye'"></lucide-icon>
        </button>
      </div>
      
      <!-- Error messages -->
      <div *ngIf="hasError()" class="auth-error">
        {{ getErrorMessage() }}
      </div>
      
      <!-- Help text -->
      <div *ngIf="helpText && !hasError()" class="auth-help">
        {{ helpText }}
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthInputComponent {
  @Input() label!: string;
  @Input() type: 'text' | 'email' | 'password' = 'text';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() helpText = '';
  @Input() control!: FormControl;
  
  inputId = `auth-input-${Math.random().toString(36).substr(2, 9)}`;
  showPassword = signal(false);
  
  inputType = computed(() => {
    if (this.type === 'password') {
      return this.showPassword() ? 'text' : 'password';
    }
    return this.type;
  });
  
  hasError = computed(() => {
    return this.control.invalid && (this.control.dirty || this.control.touched);
  });
  
  isValid = computed(() => {
    return this.control.valid && this.control.dirty;
  });
}
```

---

## 🔧 Servicios

### 🔐 AuthService (Principal)

```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl;
  
  // Signals para estado global
  private _currentUser = signal<AuthUser | null>(null);
  private _isAuthenticated = signal(false);
  private _isLoading = signal(false);
  
  // Getters públicos (readonly)
  currentUser = this._currentUser.asReadonly();
  isAuthenticated = this._isAuthenticated.asReadonly();
  isLoading = this._isLoading.asReadonly();
  
  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.initializeAuth();
  }
  
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    this._isLoading.set(true);
    
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials)
      );
      
      this.handleAuthSuccess(response);
      return response;
    } catch (error) {
      throw this.handleAuthError(error);
    } finally {
      this._isLoading.set(false);
    }
  }
  
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    this._isLoading.set(true);
    
    try {
      const response = await firstValueFrom(
        this.http.post<AuthResponse>(`${this.API_URL}/auth/register`, userData)
      );
      
      this.handleAuthSuccess(response);
      return response;
    } catch (error) {
      throw this.handleAuthError(error);
    } finally {
      this._isLoading.set(false);
    }
  }
  
  async logout(): Promise<void> {
    try {
      const refreshToken = this.tokenService.getRefreshToken();
      if (refreshToken) {
        await firstValueFrom(
          this.http.post(`${this.API_URL}/auth/logout`, { refreshToken })
        );
      }
    } catch (error) {
      console.warn('Error during logout:', error);
    } finally {
      this.clearAuthState();
      this.router.navigate(['/']);
    }
  }
  
  private handleAuthSuccess(response: AuthResponse): void {
    this.tokenService.setTokens(response.accessToken, response.refreshToken);
    this._currentUser.set(response.user);
    this._isAuthenticated.set(true);
  }
  
  private clearAuthState(): void {
    this.tokenService.clearTokens();
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
  }
}
```

### 🎫 TokenService

```typescript
@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'planSport_accessToken';
  private readonly REFRESH_TOKEN_KEY = 'planSport_refreshToken';
  private readonly TOKEN_EXPIRY_KEY = 'planSport_tokenExpiry';
  
  setTokens(accessToken: string, refreshToken: string, expiresIn?: number): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    
    if (expiresIn) {
      const expiryTime = Date.now() + (expiresIn * 1000);
      localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
    }
  }
  
  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }
  
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }
  
  isTokenExpired(): boolean {
    const expiryTime = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    if (!expiryTime) return false;
    
    return Date.now() > parseInt(expiryTime);
  }
  
  isTokenExpiringSoon(minutesThreshold: number = 5): boolean {
    const expiryTime = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    if (!expiryTime) return false;
    
    const thresholdTime = Date.now() + (minutesThreshold * 60 * 1000);
    return thresholdTime > parseInt(expiryTime);
  }
  
  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
  }
}
```

---

## 🛡️ Guards

### 🔒 AuthGuard

```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    if (this.authService.isAuthenticated()) {
      return true;
    }
    
    // Guardar la URL intentada para redirección después del login
    const returnUrl = state.url;
    return this.router.createUrlTree(['/auth'], {
      queryParams: { returnUrl, tab: 'login' }
    });
  }
}
```

### 👤 GuestGuard

```typescript
@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
  
  canActivate(): boolean | UrlTree {
    if (!this.authService.isAuthenticated()) {
      return true;
    }
    
    // Usuario ya autenticado, redirigir al dashboard
    return this.router.createUrlTree(['/dashboard']);
  }
}
```

---

## 🔄 Interceptors

### 🎫 AuthInterceptor

```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.tokenService.getAccessToken();
    
    if (token && !this.isAuthEndpoint(req.url)) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(authReq);
    }
    
    return next.handle(req);
  }
  
  private isAuthEndpoint(url: string): boolean {
    const authEndpoints = ['/auth/login', '/auth/register', '/auth/refresh'];
    return authEndpoints.some(endpoint => url.includes(endpoint));
  }
}
```

### ⚠️ ErrorInterceptor

```typescript
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 401:
            this.handle401Error();
            break;
          case 403:
            this.handle403Error();
            break;
          case 422:
            this.handle422Error(error);
            break;
          default:
            this.handleGenericError(error);
        }
        
        return throwError(() => error);
      })
    );
  }
  
  private handle401Error(): void {
    this.authService.logout();
    this.notificationService.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
  }
}
```

---

## 📝 Modelos e Interfaces

### 👤 AuthUser Interface

```typescript
export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  organizationId?: string;
  emailConfirmed: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  ADMIN = 'admin',
  COACH = 'coach',
  ATHLETE = 'athlete',
  VIEWER = 'viewer'
}
```

### 🔐 Auth Requests/Responses

```typescript
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  acceptTerms: boolean;
  organizationId?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: AuthUser;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}
```

### 🎯 Auth State

```typescript
export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastActivity: number;
}
```

---

## ✅ Validadores Personalizados

### 🔍 CustomValidators

```typescript
export class CustomValidators {
  static fullName(control: AbstractControl): ValidationErrors | null {
    const value = control.value?.trim();
    if (!value) return null;
    
    const words = value.split(' ').filter(word => word.length > 0);
    if (words.length < 2) {
      return { fullName: { message: 'Ingresa tu nombre completo (nombre y apellido)' } };
    }
    
    return null;
  }
  
  static strongPassword(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isLongEnough = value.length >= 8;
    
    const errors: any = {};
    
    if (!hasUpperCase) errors.uppercase = true;
    if (!hasLowerCase) errors.lowercase = true;
    if (!hasNumbers) errors.numbers = true;
    if (!hasSpecialChar) errors.specialChar = true;
    if (!isLongEnough) errors.minLength = true;
    
    return Object.keys(errors).length > 0 ? { strongPassword: errors } : null;
  }
  
  static passwordMatch(passwordField: string, confirmPasswordField: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get(passwordField);
      const confirmPassword = formGroup.get(confirmPasswordField);
      
      if (!password || !confirmPassword) return null;
      
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordMatch: true });
        return { passwordMatch: true };
      }
      
      // Limpiar error si las contraseñas coinciden
      if (confirmPassword.errors?.['passwordMatch']) {
        delete confirmPassword.errors['passwordMatch'];
        if (Object.keys(confirmPassword.errors).length === 0) {
          confirmPassword.setErrors(null);
        }
      }
      
      return null;
    };
  }
}
```

### ⏱️ AsyncValidators

```typescript
@Injectable({
  providedIn: 'root'
})
export class AsyncValidators {
  constructor(private http: HttpClient) {}
  
  emailExists = (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }
    
    return this.http.post<{ exists: boolean }>('/auth/check-email', {
      email: control.value
    }).pipe(
      map(response => response.exists ? { emailExists: true } : null),
      catchError(() => of(null)),
      debounceTime(500),
      distinctUntilChanged()
    );
  };
}
```

---

## 🎨 Estilos y CSS

### 🎯 Clases Utilitarias Personalizadas

```scss
// auth-components.scss

// Contenedores
.auth-container {
  @apply max-w-md mx-auto p-6;
}

.auth-card {
  @apply bg-white rounded-xl p-8 shadow-lg;
}

// Formularios
.auth-form {
  @apply flex flex-col gap-4;
}

.auth-input-container {
  @apply flex flex-col gap-1;
}

// Inputs
.auth-input {
  @apply w-full px-4 py-3 border border-gray-300 rounded-lg;
  @apply font-body text-base transition-colors;
  @apply focus:outline-none focus:border-primary-500 focus:ring-3 focus:ring-primary-100;
  
  &.error {
    @apply border-red-500 focus:border-red-500 focus:ring-red-100;
  }
  
  &.success {
    @apply border-primary-500;
  }
}

// Labels y texto
.auth-label {
  @apply font-body text-sm font-medium text-gray-700;
}

.auth-error {
  @apply text-xs text-red-500 font-medium;
}

.auth-help {
  @apply text-xs text-gray-500;
}

.auth-success {
  @apply text-xs text-primary-600 font-medium;
}

// Botones
.auth-button {
  @apply px-4 py-2 rounded-lg font-medium transition-all;
  @apply focus:outline-none focus:ring-3;
  
  &.primary {
    @apply bg-primary-600 text-white;
    @apply hover:bg-primary-700 hover:-translate-y-0.5;
    @apply focus:ring-primary-200;
    @apply disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none;
  }
  
  &.secondary {
    @apply bg-white text-primary-600 border border-primary-600;
    @apply hover:bg-primary-50;
    @apply focus:ring-primary-200;
  }
}

// Tabs
.auth-tabs {
  @apply flex border-b border-gray-200 mb-6;
}

.auth-tab {
  @apply flex-1 py-3 px-4 text-center font-medium transition-colors;
  @apply border-b-2 border-transparent;
  @apply hover:text-primary-600 hover:border-primary-200;
  
  &.active {
    @apply text-primary-600 border-primary-600;
  }
}

// Estados de carga
.auth-loading {
  @apply opacity-70 pointer-events-none;
}

.auth-spinner {
  @apply animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full;
}
```

---

## 🔄 Rutas y Navegación

### 🛣️ Auth Routes

```typescript
// auth.routes.ts
export const authRoutes: Routes = [
  {
    path: '',
    component: AuthPageComponent,
    canActivate: [GuestGuard],
    title: 'Autenticación - PlanSport'
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./components/forgot-password/forgot-password.component')
      .then(c => c.ForgotPasswordComponent),
    canActivate: [GuestGuard],
    title: 'Recuperar Contraseña - PlanSport'
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./components/reset-password/reset-password.component')
      .then(c => c.ResetPasswordComponent),
    canActivate: [GuestGuard],
    title: 'Restablecer Contraseña - PlanSport'
  }
];
```

### 🏠 App Routes Integration

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.component')
      .then(c => c.LandingComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes')
      .then(r => r.authRoutes)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component')
      .then(c => c.DashboardComponent),
    canActivate: [AuthGuard]
  },
  // Redirecciones legacy
  { path: 'login', redirectTo: '/auth?tab=login' },
  { path: 'register', redirectTo: '/auth?tab=register' },
  { path: '**', redirectTo: '/' }
];
```

---

## 🧪 Testing

### 🔬 Configuración de Testing

```typescript
// auth.service.spec.ts
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let tokenService: jasmine.SpyObj<TokenService>;
  
  beforeEach(() => {
    const tokenServiceSpy = jasmine.createSpyObj('TokenService', [
      'setTokens', 'getAccessToken', 'clearTokens'
    ]);
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: TokenService, useValue: tokenServiceSpy }
      ]
    });
    
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
  });
  
  it('should login successfully', async () => {
    const mockResponse: AuthResponse = {
      accessToken: 'mock-token',
      refreshToken: 'mock-refresh',
      expiresIn: 3600,
      tokenType: 'Bearer',
      user: mockUser
    };
    
    const loginPromise = service.login({ email: 'test@test.com', password: 'password' });
    
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
    
    const result = await loginPromise;
    expect(result).toEqual(mockResponse);
    expect(tokenService.setTokens).toHaveBeenCalledWith(
      mockResponse.accessToken,
      mockResponse.refreshToken
    );
  });
});
```

---

## 📊 Performance y Optimización

### ⚡ Estrategias de Optimización

1. **OnPush Change Detection**: Todos los componentes usan `ChangeDetectionStrategy.OnPush`
2. **Signals**: Estado reactivo eficiente con Angular Signals
3. **Lazy Loading**: Carga diferida del módulo completo
4. **Tree Shaking**: Importaciones específicas para reducir bundle size
5. **Debounce**: Validaciones asíncronas con debounce para reducir requests

### 📈 Métricas Objetivo

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms
- **Bundle Size**: < 50KB (gzipped)

---

## 🔒 Seguridad

### 🛡️ Medidas de Seguridad

1. **Token Storage**: Tokens en localStorage con expiración
2. **HTTPS Only**: Forzar HTTPS en producción
3. **CSP Headers**: Content Security Policy configurado
4. **Input Sanitization**: Sanitización automática de inputs
5. **Rate Limiting**: Límites en intentos de login
6. **Secure Headers**: Headers de seguridad en respuestas

### 🔐 Best Practices

- Nunca almacenar contraseñas en el frontend
- Validar datos tanto en frontend como backend
- Usar HTTPS para todas las comunicaciones
- Implementar logout automático por inactividad
- Logs de seguridad para intentos fallidos

---

## 📱 Accesibilidad (WCAG 2.1 AA)

### ♿ Implementación

```typescript
// Ejemplo de componente accesible
@Component({
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" role="form" aria-labelledby="login-title">
      <h2 id="login-title" class="sr-only">Formulario de inicio de sesión</h2>
      
      <div class="auth-input-container">
        <label for="email" class="auth-label">
          Correo electrónico
          <span class="sr-only">(requerido)</span>
        </label>
        <input
          id="email"
          type="email"
          formControlName="email"
          class="auth-input"
          [attr.aria-invalid]="emailControl.invalid && emailControl.touched"
          [attr.aria-describedby]="emailControl.errors ? 'email-error' : null"
          autocomplete="email"
        />
        <div
          *ngIf="emailControl.errors && emailControl.touched"
          id="email-error"
          class="auth-error"
          role="alert"
          aria-live="polite"
        >
          {{ getEmailErrorMessage() }}
        </div>
      </div>
    </form>
  `
})
```

### 🎯 Checklist de Accesibilidad

- [ ] Navegación por teclado completa
- [ ] Focus visible en todos los elementos interactivos
- [ ] Labels asociados correctamente con inputs
- [ ] Mensajes de error anunciados por screen readers
- [ ] Contraste mínimo 4.5:1 para texto normal
- [ ] Contraste mínimo 3:1 para texto grande
- [ ] Elementos interactivos mínimo 44x44px
- [ ] Estructura semántica correcta (headings, landmarks)

---

*🔧 Especificaciones técnicas creadas para PlanSport - Módulo de Autenticación*
*Actualizado: Enero 2025*
*Versión: 1.0*