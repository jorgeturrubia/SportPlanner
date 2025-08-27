# SportPlanner - Autenticación y Seguridad

## Arquitectura de Autenticación

SportPlanner utiliza **autenticación JWT personalizada** a través del backend .NET, con un servicio Angular que gestiona el estado de sesión usando signals reactivos y proporciona métodos observables.

### Flujo de Autenticación

```mermaid
sequenceDiagram
    participant U as Usuario
    participant A as Angular App
    participant AS as AuthService
    participant API as Backend API
    participant DB as PostgreSQL

    U->>A: Accede a la aplicación
    A->>AS: Inicializa AuthService
    AS->>AS: Verifica token local
    AS->>API: validateSession()
    API-->>AS: Sesión válida/inválida
    AS->>A: Emite estado de autenticación
    
    alt Usuario no autenticado
        U->>A: Introduce credenciales
        A->>AS: login(credentials)
        AS->>API: POST /api/auth/login
        API->>DB: Verifica credenciales
        DB-->>API: Usuario válido
        API-->>AS: AuthResponse con JWT tokens
        AS->>AS: Almacena tokens y usuario
        AS->>A: Observable con resultado
        A->>U: Redirige a dashboard
    end
    
    alt Llamadas a API
        AS->>AS: getAccessToken()
        AS-->>A: JWT token
        A->>API: Request con Bearer token
        API->>API: Valida JWT internamente
        API-->>A: Respuesta autorizada
    end
    
    alt Refresh de Token
        AS->>AS: Token próximo a expirar
        AS->>API: POST /api/auth/refresh
        API-->>AS: Nuevos tokens JWT
        AS->>AS: Actualiza tokens almacenados
    end
```

## AuthService - Implementación

### Inicialización y Configuración

```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private currentUser = signal<User | null>(null);
  private isAuthenticated = computed(() => !!this.currentUser());
  private isLoading = signal<boolean>(false);
  private authError = signal<string | null>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService,
    private navigationService: NavigationService,
    private notificationService: NotificationService,
    private errorHandler: ErrorHandlerService
  ) {
    this.initializeAuth();
    this.setupTokenRefreshListener();
  }

  private initializeAuth(): void {
    const token = this.tokenService.getAccessToken();
    if (token && !this.tokenService.isTokenExpired(token)) {
      this.validateSession().subscribe({
        next: (isValid) => {
          if (isValid) {
            this.tokenService.scheduleTokenRefresh();
          } else {
            this.handleLogout();
          }
        },
        error: () => this.handleLogout()
      });
    } else {
      this.tokenService.clearTokens();
    }
  }
}
```

### Gestión de Estado Reactivo

El servicio utiliza **Angular Signals** para mantener el estado de la sesión de forma reactiva:

```typescript
// Componente puede acceder al estado de autenticación
export class DashboardComponent {
  private authService = inject(AuthService);
  
  // Signals reactivos
  currentUser = this.authService.getCurrentUser();
  isLoggedIn = this.authService.isLoggedIn();
  isLoading = this.authService.getLoadingState();
  
  constructor() {
    // Reaccionar a cambios de autenticación
    effect(() => {
      if (!this.isLoggedIn()) {
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
```

### Métodos de Autenticación

#### Inicio de Sesión
```typescript
login(credentials: LoginRequest): Observable<AuthResponse> {
  this.isLoading.set(true);
  this.authError.set(null);

  return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/login`, credentials)
    .pipe(
      tap(response => {
        this.handleAuthSuccess(response);
        this.isLoading.set(false);
        this.notificationService.showSuccess('¡Bienvenido!', 'Has iniciado sesión correctamente');
      }),
      catchError(error => {
        this.isLoading.set(false);
        const errorMessage = this.extractErrorMessage(error);
        this.authError.set(errorMessage);
        this.errorHandler.handleAuthError(error);
        return throwError(() => new Error(errorMessage));
      })
    );
}
```

#### Registro de Usuario
```typescript
register(userData: RegisterRequest): Observable<AuthResponse> {
  this.isLoading.set(true);
  this.authError.set(null);

  return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/register`, userData)
    .pipe(
      tap(response => {
        this.handleAuthSuccess(response);
        this.isLoading.set(false);
        this.notificationService.showSuccess('¡Cuenta creada!', 'Tu cuenta ha sido creada exitosamente');
      }),
      catchError(error => {
        this.isLoading.set(false);
        const errorMessage = this.extractErrorMessage(error);
        this.authError.set(errorMessage);
        this.errorHandler.handleAuthError(error);
        return throwError(() => new Error(errorMessage));
      })
    );
}
```

#### Cierre de Sesión
```typescript
logout(): Observable<void> {
  this.isLoading.set(true);
  
  const token = this.tokenService.getAccessToken();
  if (!token) {
    this.handleLogout();
    return of(void 0);
  }

  return this.http.post<void>(`${this.apiUrl}/api/auth/logout`, {})
    .pipe(
      tap(() => {
        this.handleLogout();
        this.notificationService.showInfo('Sesión cerrada', 'Has cerrado sesión correctamente');
      }),
      catchError(error => {
        console.warn('Logout request failed, clearing local tokens anyway:', error);
        this.handleLogout();
        this.notificationService.showWarning('Sesión cerrada', 'Sesión cerrada localmente');
        return of(void 0);
      })
    );
}
```

#### Refresh de Token
```typescript
refreshToken(): Observable<AuthResponse> {
  if (this.refreshInProgress) {
    return throwError(() => new Error('Token refresh already in progress'));
  }

  const refreshToken = this.tokenService.getRefreshToken();
  if (!refreshToken) {
    this.handleLogout();
    return throwError(() => new Error('No refresh token available'));
  }

  this.refreshInProgress = true;

  return this.http.post<AuthResponse>(`${this.apiUrl}/api/auth/refresh`, { refreshToken })
    .pipe(
      tap(response => {
        this.handleAuthSuccess(response);
        this.refreshInProgress = false;
      }),
      catchError(error => {
        this.refreshInProgress = false;
        this.handleLogout();
        return throwError(() => new Error('Token refresh failed'));
      })
    );
}
```

### Métodos de Utilidad

#### Verificación de Autenticación
```typescript
validateSession(): Observable<boolean> {
  const token = this.tokenService.getAccessToken();
  if (!token) {
    return of(false);
  }

  return this.http.get<{ valid: boolean }>(`${this.apiUrl}/api/auth/validate`)
    .pipe(
      tap(response => {
        if (!response.valid) {
          this.handleLogout();
        }
      }),
      catchError(() => of(false)),
      map(response => typeof response === 'boolean' ? response : response.valid)
    );
}

// Getters reactivos para el estado
getCurrentUser() {
  return this.currentUser.asReadonly();
}

isLoggedIn() {
  return this.isAuthenticated;
}

getLoadingState() {
  return this.isLoading.asReadonly();
}

getAuthError() {
  return this.authError.asReadonly();
}
```

## Integración con Backend

### Validación de Tokens JWT

El backend .NET utiliza una configuración personalizada de JWT Bearer tokens con validación propia:

```csharp
// Configuración en Program.cs
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = supabaseUrl;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = false, // Supabase handles signing key validation
            ValidIssuer = supabaseUrl,
            ValidAudience = "authenticated",
            ClockSkew = TimeSpan.FromMinutes(5)
        };

        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
                logger.LogWarning("JWT Authentication failed: {Error}", context.Exception?.Message);
                return Task.CompletedTask;
            }
        };
    });

// Servicios de autenticación personalizados
builder.Services.AddScoped<ISupabaseService, SupabaseService>();
builder.Services.AddScoped<IUserContextService, UserContextService>();
```

**Características de la Configuración:**
- **Integración híbrida**: Utiliza Supabase para validación de tokens pero maneja autenticación en el backend
- **ClockSkew = 5 minutos**: Tolerancia para diferencias de tiempo entre servidores
- **OnAuthenticationFailed**: Logging de errores de autenticación
- **Servicios personalizados**: ISupabaseService y IUserContextService para lógica de negocio

### Interceptor HTTP para Tokens

```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.tokenService.getAccessToken();
    
    if (token && !this.tokenService.isTokenExpired(token)) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(authReq);
    }
    
    return next.handle(req);
  }
}
```

## Configuración de Entorno

### Variables de Entorno Requeridas

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7072',
  supabaseUrl: 'https://tu-proyecto.supabase.co', // Solo para base de datos
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // Solo para base de datos
  appName: 'SportPlanner',
  version: '1.0.0'
};
```

### Configuración del Backend

#### SupabaseService - Implementación Actualizada

El `SupabaseService` ha sido actualizado para usar la API correcta del cliente Supabase C#:

**Características principales:**
- **Constructor principal**: Utiliza la sintaxis moderna de C# 12
- **Validación de tokens JWT**: Verificación local de expiración + validación con Supabase
- **Gestión de sesiones**: Acceso a tokens a través de `CurrentSession`
- **Manejo de errores mejorado**: Logging detallado y manejo de excepciones
- **Null checks simplificados**: Uso de `is null` en lugar de `== null`

#### appsettings.json
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "postgresql://postgres.xxx:password@aws-0-eu-west-3.pooler.supabase.com:5432/postgres"
  },
  "Supabase": {
    "Url": "https://tu-proyecto.supabase.co",
    "Key": "tu_clave_anonima"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

#### User Secrets (Desarrollo)
Para desarrollo, usar user secrets para datos sensibles:

```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "tu_cadena_de_conexion"
dotnet user-secrets set "Supabase:Url" "https://tu-proyecto.supabase.co"
dotnet user-secrets set "Supabase:Key" "tu_clave_anonima"
```

#### Variables de Entorno (Producción)
```bash
# Supabase Configuration
SUPABASE__URL=https://tu-proyecto.supabase.co
SUPABASE__KEY=tu_clave_anonima
CONNECTIONSTRINGS__DEFAULTCONNECTION=tu_cadena_de_conexion_produccion
```

## Políticas de Seguridad (RLS)

### Configuración en Supabase

```sql
-- Habilitar RLS en tablas principales
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Política para usuarios: solo pueden ver/editar sus propios datos
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = supabase_id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = supabase_id);

-- Política para suscripciones: solo el propietario
CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (user_id IN (
        SELECT id FROM users WHERE supabase_id = auth.uid()::text
    ));
```

## Manejo de Errores de Autenticación

### Errores Comunes y Respuestas

```typescript
// En el componente de login
this.authService.login({ email, password })
  .subscribe({
    next: (response) => {
      // Login exitoso - AuthService maneja automáticamente el estado
      this.router.navigate(['/dashboard']);
    },
    error: (error) => {
      // AuthService ya maneja los errores y notificaciones
      console.error('Error de autenticación:', error);
      
      // Acceder al error desde el signal
      const authError = this.authService.getAuthError();
      if (authError()) {
        this.errorMessage = authError();
      }
    }
  });
```

## Guards de Ruta

### AuthGuard para Proteger Rutas

```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.validateSession().pipe(
      map(isValid => {
        if (isValid && this.authService.isLoggedIn()()) {
          return true;
        } else {
          this.router.navigate(['/auth/login']);
          return false;
        }
      })
    );
  }
}
```

## Mejores Prácticas

### Seguridad
1. **Nunca exponer** la service role key en el frontend
2. **Usar HTTPS** en producción siempre
3. **Configurar CORS** apropiadamente en Supabase
4. **Implementar rate limiting** para endpoints de autenticación
5. **Delegar validación JWT** a Supabase para mayor seguridad y simplicidad
6. **Usar User Secrets** en desarrollo para credenciales sensibles
7. **Variables de entorno** en producción para configuración segura
8. **ClockSkew apropiado** (5 minutos) para tolerancia de tiempo entre servidores

### Performance
1. **Cachear el estado** de autenticación con Angular Signals
2. **Usar interceptors** para agregar tokens automáticamente
3. **Implementar refresh automático** de tokens con programación inteligente
4. **Lazy loading** de módulos protegidos por autenticación
5. **Validación eficiente** de tokens con verificación de expiración local

### UX
1. **Mostrar estados de carga** durante autenticación
2. **Manejar errores** de forma user-friendly
3. **Recordar estado** de autenticación entre sesiones
4. **Redirigir apropiadamente** después de login/logout

## Changelog

### v2.1 - SupabaseService Optimizado (Actual)
- **API Supabase corregida**: Uso correcto del cliente Supabase C# v1.1.1
- **Constructor principal**: Implementación con sintaxis moderna de C# 12
- **Validación mejorada**: Combinación de validación JWT local y verificación Supabase
- **Gestión de sesiones**: Acceso a tokens a través de `CurrentSession` del cliente
- **Null checks modernos**: Uso de `is null` para mejor legibilidad
- **Compilación exitosa**: Resolución de errores de API y tipos

### v2.0 - Autenticación Backend Personalizada
- **Migración a backend personalizado**: Eliminación de dependencia directa de Supabase Auth en frontend
- **Angular Signals**: Implementación de estado reactivo con signals en lugar de BehaviorSubject
- **Gestión completa de tokens**: Refresh automático, validación de expiración y limpieza
- **Manejo de errores mejorado**: Integración con ErrorHandlerService y NotificationService
- **TokenService**: Servicio dedicado para gestión de JWT tokens
- **Validación de sesión**: Endpoint backend para validar sesiones activas

### v1.1 - Optimización JWT
- **Simplificación de validación JWT**: Delegación completa a Supabase
- **Configuración mejorada**: ValidateIssuerSigningKey = false para compatibilidad
- **Tolerancia de tiempo**: ClockSkew de 5 minutos para sincronización de servidores
- **Logging mejorado**: OnAuthenticationFailed para debugging

### v1.0 - Implementación Base
- Implementación completa del SupabaseService
- Integración con Angular y .NET
- Configuración básica de JWT
- Guards de ruta y interceptors

---
**Estado**: Migración completa a autenticación backend personalizada
**Siguiente**: Implementación de endpoints de autenticación en backend (.NET)