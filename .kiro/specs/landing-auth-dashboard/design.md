# Design Document

## Overview

Este documento describe el diseño arquitectónico y técnico para la implementación del sistema SportPlanner, que incluye una landing page moderna, sistema de autenticación integrado con Supabase, y un dashboard administrativo. La aplicación utilizará Angular con standalone components, Tailwind CSS v4 para el diseño, y un backend .NET que se conectará a PostgreSQL a través de Supabase.

## Architecture

### Frontend Architecture (Angular)
- **Framework**: Angular 20+ con standalone components
- **State Management**: Angular Signals para estado local y reactivo
- **Styling**: Tailwind CSS v4 con tema personalizado
- **Icons**: HeroIcons
- **HTTP Client**: Angular HttpClient con interceptors para autenticación
- **Routing**: Angular Router con guards para protección de rutas

### Backend Architecture (.NET)
- **Framework**: .NET 8 Web API
- **Database**: PostgreSQL a través de Supabase
- **Authentication**: Integración con Supabase Auth
- **Architecture Pattern**: Clean Architecture con separación de capas
- **ORM**: Entity Framework Core con provider PostgreSQL

### Database & Authentication
- **Database**: PostgreSQL hospedado en Supabase
- **Authentication Provider**: Supabase Auth
- **Session Management**: JWT tokens con renovación automática
- **Security**: Row Level Security (RLS) en PostgreSQL

## Components and Interfaces

### 1. Landing Page Components

#### Header Component
```typescript
interface HeaderComponent {
  logo: string;
  navigationItems: NavigationItem[];
  authButtons: AuthButton[];
  isScrolled: boolean;
}

interface NavigationItem {
  label: string;
  targetSection: string;
  isActive: boolean;
}
```

#### Navigation Sections
- **Características**: Sección que muestra las funcionalidades principales
- **Entrenamientos**: Información sobre planes de entrenamiento
- **Marketplace**: Tienda de productos deportivos
- **Suscripciones**: Planes de suscripción disponibles

#### Footer Component
```typescript
interface FooterComponent {
  companyInfo: CompanyInfo;
  socialLinks: SocialLink[];
  legalLinks: LegalLink[];
}
```

### 2. Authentication Components

#### Auth Layout Component
```typescript
interface AuthLayoutComponent {
  currentTab: 'login' | 'register';
  isLoading: boolean;
  errorMessage?: string;
  successMessage?: string;
}
```

#### Login Form Component
```typescript
interface LoginFormComponent {
  email: FormControl<string>;
  password: FormControl<string>;
  rememberMe: FormControl<boolean>;
  onSubmit(): void;
  onForgotPassword(): void;
}
```

#### Register Form Component
```typescript
interface RegisterFormComponent {
  email: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
  acceptTerms: FormControl<boolean>;
  onSubmit(): void;
}
```

### 3. Dashboard Components

#### Dashboard Layout Component
```typescript
interface DashboardLayoutComponent {
  user: User;
  sidebarCollapsed: boolean;
  navigationItems: DashboardNavItem[];
  toggleSidebar(): void;
  onLogout(): void;
}
```

#### Sidebar Component
```typescript
interface SidebarComponent {
  isCollapsed: boolean;
  navigationItems: DashboardNavItem[];
  currentRoute: string;
  onNavigate(route: string): void;
  onToggleCollapse(): void;
}

interface DashboardNavItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  isActive: boolean;
}
```

#### Dashboard Navbar Component
```typescript
interface DashboardNavbarComponent {
  user: User;
  notifications: Notification[];
  onProfileClick(): void;
  onLogout(): void;
}
```

## Data Models

### User Model
```typescript
interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  COACH = 'coach'
}
```

### Authentication Models
```typescript
interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface TokenRefreshRequest {
  refreshToken: string;
}
```

### Team Model (Dashboard)
```typescript
interface Team {
  id: string;
  name: string;
  description?: string;
  sport: string;
  members: TeamMember[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TeamMember {
  userId: string;
  user: User;
  role: TeamRole;
  joinedAt: Date;
}

enum TeamRole {
  MEMBER = 'member',
  CAPTAIN = 'captain',
  COACH = 'coach'
}
```

## Design System & Theming

### Tailwind CSS v4 Configuration
```css
@import "tailwindcss";

@theme {
  /* Color Palette - Verde claro como principal */
  --color-primary-50: oklch(0.97 0.02 142);
  --color-primary-100: oklch(0.94 0.05 142);
  --color-primary-200: oklch(0.87 0.10 142);
  --color-primary-300: oklch(0.78 0.15 142);
  --color-primary-400: oklch(0.68 0.20 142);
  --color-primary-500: oklch(0.58 0.25 142); /* Verde claro principal */
  --color-primary-600: oklch(0.48 0.22 142);
  --color-primary-700: oklch(0.38 0.18 142);
  --color-primary-800: oklch(0.28 0.14 142);
  --color-primary-900: oklch(0.18 0.10 142);
  --color-primary-950: oklch(0.10 0.06 142);

  /* Dark Theme Support */
  --color-dark-bg: oklch(0.12 0.02 240);
  --color-dark-surface: oklch(0.16 0.02 240);
  --color-dark-text: oklch(0.92 0.01 240);

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-display: 'Inter', system-ui, sans-serif;

  /* Spacing personalizado */
  --spacing-18: 4.5rem;
  --spacing-88: 22rem;

  /* Breakpoints */
  --breakpoint-3xl: 120rem;

  /* Animations */
  --ease-smooth: cubic-bezier(0.25, 0.1, 0.25, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Dark theme variables */
[data-theme="dark"] {
  --color-bg: var(--color-dark-bg);
  --color-surface: var(--color-dark-surface);
  --color-text: var(--color-dark-text);
}
```

### Component Styling Guidelines
- Usar utility classes de Tailwind CSS v4
- Implementar hover states y transiciones suaves
- Mantener consistencia en spacing y colores
- Aplicar principios de accesibilidad (contraste, focus states)

## Services Architecture

### Authentication Service
```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabaseUrl = environment.supabaseUrl;
  private readonly supabaseKey = environment.supabaseAnonKey;
  private readonly apiUrl = environment.apiUrl;
  
  private currentUser = signal<User | null>(null);
  private isAuthenticated = computed(() => !!this.currentUser());
  
  login(credentials: LoginRequest): Observable<AuthResponse>;
  register(userData: RegisterRequest): Observable<AuthResponse>;
  logout(): Observable<void>;
  refreshToken(): Observable<AuthResponse>;
  getCurrentUser(): Signal<User | null>;
  isLoggedIn(): Signal<boolean>;
}
```

### HTTP Interceptor para Autenticación
```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.tokenService.getAccessToken();
    if (token) {
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      return next.handle(authReq);
    }
    return next.handle(req);
  }
}
```

### Token Management Service
```typescript
@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'sp_access_token';
  private readonly REFRESH_TOKEN_KEY = 'sp_refresh_token';
  
  setTokens(accessToken: string, refreshToken: string): void;
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  clearTokens(): void;
  isTokenExpired(token: string): boolean;
  scheduleTokenRefresh(): void;
}
```

## Routing Structure

### App Routing
```typescript
const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    title: 'SportPlanner - Planifica tu entrenamiento'
  },
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth-layout.component'),
    children: [
      { path: 'login', loadComponent: () => import('./auth/login.component') },
      { path: 'register', loadComponent: () => import('./auth/register.component') },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard-layout.component'),
    canActivate: [AuthGuard],
    children: [
      { path: 'home', loadComponent: () => import('./dashboard/home.component') },
      { path: 'teams', loadComponent: () => import('./dashboard/teams.component') },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
```

### Route Guards
```typescript
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  canActivate(): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigate(['/auth/login']);
        }
      })
    );
  }
}
```

## Backend Integration

### .NET API Controllers
```csharp
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request);
    
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request);
    
    [HttpPost("refresh")]
    public async Task<ActionResult<AuthResponse>> RefreshToken([FromBody] TokenRefreshRequest request);
    
    [HttpPost("logout")]
    [Authorize]
    public async Task<ActionResult> Logout();
}
```

### Supabase Integration Service
```csharp
public interface ISupabaseService
{
    Task<AuthResponse> AuthenticateAsync(string email, string password);
    Task<AuthResponse> RegisterUserAsync(string email, string password);
    Task<bool> ValidateTokenAsync(string token);
    Task<AuthResponse> RefreshTokenAsync(string refreshToken);
}
```

## Error Handling

### Frontend Error Handling
```typescript
@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  handleAuthError(error: any): string {
    switch (error.status) {
      case 401: return 'Credenciales inválidas';
      case 403: return 'Acceso denegado';
      case 429: return 'Demasiados intentos. Intenta más tarde';
      default: return 'Error de autenticación';
    }
  }
  
  handleNetworkError(error: any): string {
    return 'Error de conexión. Verifica tu internet';
  }
}
```

### Global Error Handler
```typescript
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    console.error('Global error:', error);
    this.notificationService.showError('Ha ocurrido un error inesperado');
  }
}
```

## Testing Strategy

### Unit Testing
- Componentes: Testing con Angular Testing Library
- Servicios: Testing con Jasmine/Jest
- Guards: Testing de lógica de autenticación
- Interceptors: Testing de manejo de tokens

### Integration Testing
- Flujos de autenticación completos
- Navegación entre rutas protegidas
- Integración con backend APIs

### E2E Testing
- Flujo com de registro/login
- Navegación en dashboard
- Responsive design testing

## Performance Considerations

### Frontend Optimizations
- Lazy loading de rutas y componentes
- OnPush change detection strategy
- Optimización de imágenes con NgOptimizedImage
- Tree shaking automático con standalone components

### nd Optimizations
- Connection pooling para PostgreSQL
- Caching de tokens de autenticación
- Rate limiting en endpoints de auth
- Compresión de respuestas HTTP

## Security Considerations

### Frontend Security
- Sanitización de inputs en formularios
- Validación client-side y server-side
- Secure storage de tokens (httpOnly cookies recomendado)
- CSP headers para prevenir XSS

### Backend Security
- Validación de tokens JWT
- Rate limiting en endpoints críticos
- CORS configurado correctamente
- Logging de eventos de seguridad

### Database Security
- Row Level Security (RLS) habilitado
- Políticas de acceso por usuario
- Encriptación de datos sensibles
- Auditoría de cambios críticos