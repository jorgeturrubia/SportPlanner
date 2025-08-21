# Especificación: Sistema de Autenticación y Notificaciones - PlanSport

## Resumen Ejecutivo

Esta especificación define la implementación de un sistema completo de autenticación que conecta el frontend Angular 20 con el backend .NET 8 y Supabase Auth, junto con un sistema global de notificaciones para toda la aplicación PlanSport.

## Objetivos del Sistema

### Funcionales
- **Autenticación Completa**: Login/register con flujo completo hasta el dashboard
- **Gestión de Sesión**: Manejo seguro de tokens JWT con renovación automática
- **Protección de Rutas**: Redirección inteligente basada en estado de autenticación
- **Sistema de Notificaciones**: Feedback visual para toda la aplicación
- **Selección de Deporte**: Durante el registro para personalizar la experiencia

### No Funcionales
- **Seguridad**: Protección contra XSS, CSRF y manejo seguro de tokens
- **Performance**: Carga rápida y transiciones suaves
- **Usabilidad**: Interfaz en español, diseño responsive
- **Accesibilidad**: Cumplimiento ARIA y navegación por teclado

## Arquitectura del Sistema

### Frontend (Angular 20)
```
src/app/
├── core/
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── notification.service.ts
│   │   └── token-manager.service.ts
│   ├── interceptors/
│   │   ├── auth.interceptor.ts
│   │   └── error.interceptor.ts
│   └── guards/
│       ├── auth.guard.ts
│       └── public.guard.ts
├── pages/
│   └── auth/
│       ├── auth.component.ts
│       ├── login/
│       └── register/
└── shared/
    └── components/
        └── notification/
            └── notification.component.ts
```

### Backend (.NET 8)
```
src/back/SportPlanner/
├── Controllers/
│   └── AuthController.cs
├── Services/
│   ├── AuthService.cs
│   └── SupabaseService.cs
├── Models/
│   ├── AuthModels.cs
│   └── UserModels.cs
└── Middleware/
    └── AuthMiddleware.cs
```

## Flujos de Usuario

### 1. Registro de Usuario
1. Usuario accede a `/auth/register`
2. Completa formulario con email, password, nombre y deporte
3. Frontend envía datos al backend .NET 8
4. Backend registra en Supabase y asigna tier gratuito
5. Respuesta con JWT token
6. Redirección automática al dashboard

### 2. Login de Usuario
1. Usuario accede a `/auth/login`
2. Introduce email y password
3. Frontend envía credenciales al backend
4. Backend valida con Supabase
5. Respuesta con JWT token
6. Almacenamiento seguro del token
7. Redirección al dashboard o ruta prevista

### 3. Protección de Rutas
1. Usuario intenta acceder a ruta protegida
2. AuthGuard verifica token válido
3. Si no autenticado: redirección a login con ruta de destino
4. Si autenticado: acceso permitido
5. Token inválido: renovación automática o logout

## Especificaciones Técnicas

### Autenticación
- **Provider**: Supabase Auth
- **Tokens**: JWT con refresh automático
- **Persistencia**: localStorage con cifrado básico
- **Expiración**: 1 hora (access token), 30 días (refresh token)

### Notificaciones
- **Tipos**: Success, Error, Warning, Info
- **Posición**: Top-right corner
- **Duración**: 5s (configurable)
- **Límite**: Máximo 5 notificaciones simultáneas

### Seguridad
- **HTTPS**: Obligatorio en producción
- **Validación**: Input sanitization en frontend y backend
- **Headers**: Security headers configurados
- **CORS**: Configuración restrictiva

## Interfaces y Modelos

### AuthService (Angular)
```typescript
interface AuthService {
  login(email: string, password: string): Observable<AuthResponse>
  register(userData: RegisterData): Observable<AuthResponse>
  logout(): void
  refreshToken(): Observable<string>
  getCurrentUser(): Observable<User | null>
  isAuthenticated(): Signal<boolean>
}
```

### NotificationService (Angular)
```typescript
interface NotificationService {
  show(message: string, type: NotificationType): void
  success(message: string): void
  error(message: string): void
  warning(message: string): void
  info(message: string): void
  clear(): void
}
```

### API Endpoints (.NET 8)
- `POST /api/auth/login` - Autenticación de usuario
- `POST /api/auth/register` - Registro de nuevo usuario
- `POST /api/auth/logout` - Cierre de sesión
- `POST /api/auth/refresh` - Renovación de token
- `GET /api/auth/profile` - Datos del usuario actual

## Criterios de Aceptación

### Autenticación
- [x] Usuario puede registrarse con email, password y deporte
- [x] Usuario puede hacer login con credenciales válidas
- [x] Tokens se renuevan automáticamente antes de expirar
- [x] Usuario se redirige al dashboard tras autenticación exitosa
- [x] Rutas protegidas requieren autenticación válida

### Notificaciones
- [x] Notificaciones aparecen en respuesta a acciones del usuario
- [x] Se auto-eliminan después del tiempo configurado
- [x] Usuario puede cerrar notificaciones manualmente
- [x] Máximo 5 notificaciones simultáneas

### UX/UI
- [x] Interfaz completamente en español
- [x] Diseño responsive con Tailwind CSS 4
- [x] Transiciones suaves entre estados
- [x] Feedback visual inmediato en formularios

## Dependencias y Tecnologías

### Frontend
- Angular 20 con standalone components
- Angular Signals para estado
- Reactive Forms para formularios
- Tailwind CSS 4 para estilos
- Hero Icons para iconografía

### Backend
- .NET 8 Web API
- Supabase SDK para .NET
- Entity Framework Core
- JWT Bearer Authentication

### Testing
- Jasmine/Karma para frontend
- xUnit para backend
- Cypress para E2E testing

## Plan de Implementación

1. **Fase 1**: Backend authentication API (.NET 8)
2. **Fase 2**: Frontend authentication services (Angular)
3. **Fase 3**: UI components y formularios
4. **Fase 4**: Sistema de notificaciones
5. **Fase 5**: Protección de rutas
6. **Fase 6**: Testing e integración
7. **Fase 7**: Polish y optimización

## Métricas de Éxito

- **Performance**: Login < 2s, carga inicial < 3s
- **Seguridad**: 0 vulnerabilidades críticas
- **Usabilidad**: 95% task completion rate
- **Accesibilidad**: WCAG 2.1 AA compliance