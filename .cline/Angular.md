# Documentación Técnica - SportPlanner Angular Application

## Tabla de Contenidos
1. [Introducción y Visión General](#1-introducción-y-visión-general)
2. [Arquitectura de la Aplicación](#2-arquitectura-de-la-aplicación)
3. [Estructura de Carpetas y Organización](#3-estructura-de-carpetas-y-organización)
4. [Infraestructura y Configuración](#4-infraestructura-y-configuración)
5. [Modelos de Datos](#5-modelos-de-datos)
6. [Componentes y UI](#6-componentes-y-ui)
7. [Servicios y Lógica de Negocio](#7-servicios-y-lógica-de-negocio)
8. [Sistema de Autenticación y Seguridad](#8-sistema-de-autenticación-y-seguridad)
9. [Enrutamiento y Navegación](#9-enrutamiento-y-navegación)
10. [Estilos y Diseño](#10-estilos-y-diseño)
11. [Manejo de Estado](#11-manejo-de-estado)
12. [Integraciones Externas](#12-integraciones-externas)
13. [Buenas Prácticas y Patrones](#13-buenas-prácticas-y-patrones)
14. [Despliegue y Producción](#14-despliegue-y-producción)
15. [Conclusiones y Próximos Pasos](#15-conclusiones-y-próximos-pasos)

---

## 1. Introducción y Visión General

### Descripción del Proyecto
SportPlanner es una aplicación web moderna diseñada para la gestión deportiva, desarrollada con Angular 20 y .NET backend. La aplicación permite a entrenadores, directores deportivos y administradores gestionar equipos, objetivos, ejercicios y planificaciones de manera eficiente.

### Objetivos y Propósito
- **Gestión Centralizada**: Proporcionar una plataforma unificada para la gestión deportiva
- **Experiencia de Usuario Intuitiva**: Ofrecer una interfaz moderna y responsive
- **Escalabilidad**: Diseñar una arquitectura que permita el crecimiento y evolución del sistema
- **Seguridad**: Implementar un sistema robusto de autenticación y autorización

### Stack Tecnológico
#### Frontend
- **Angular 20**: Framework principal con componentes standalone
- **TypeScript**: Tipado fuerte y desarrollo seguro
- **Tailwind CSS**: Sistema de diseño utility-first
- **RxJS**: Programación reactiva
- **Supabase**: Autenticación y base de datos como servicio
- **NG Icons**: Sistema de iconos

#### Backend
- **.NET 8**: API RESTful
- **Entity Framework Core**: ORM para base de datos
- **SQL Server**: Base de datos relacional
- **JWT**: Autenticación basada en tokens

### Arquitectura General
La aplicación sigue una arquitectura de separación de preocupaciones clara:
- **Frontend**: Aplicación Angular standalone con lazy loading
- **Backend**: API RESTful con .NET
- **Base de Datos**: SQL Server con Entity Framework
- **Autenticación**: Supabase para gestión de usuarios

---

## 2. Arquitectura de la Aplicación

### Arquitectura Basada en Componentes Standalone
SportPlanner utiliza la última versión de Angular 20 con componentes standalone, eliminando la necesidad de NgModule tradicional y simplificando la estructura de la aplicación.

### Patrón de Diseño Utilizado
La aplicación sigue varios patrones de diseño modernos:

#### 1. **Patrón Singleton para Servicios**
```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Servicio disponible globalmente
}
```

#### 2. **Patrón Observer con Signals**
```typescript
private readonly _isAuthenticated = signal<boolean>(false);
public readonly isAuthenticated = computed(() => this._isAuthenticated());
```

#### 3. **Patrón Strategy para Autenticación**
```typescript
export const authGuard: CanActivateFn = async (route, state) => {
  // Estrategia de protección de rutas
};
```

### Estructura Modular y Lazy Loading
La aplicación implementa lazy loading para optimizar el rendimiento:

```typescript
{
  path: 'dashboard',
  loadComponent: () => import('./pages/dashboard/dashboard.component'),
  children: [
    {
      path: 'teams',
      loadComponent: () => import('./pages/dashboard/pages/teams/teams.component')
    }
  ]
}
```

### Gestión de Estado con Signals
Angular Signals proporciona un sistema de gestión de estado reactiva y eficiente:

```typescript
// Signals privadas para estado interno
private readonly _currentUser = signal<User | null>(null);

// Signals computadas para estado derivado
public readonly isAuthenticated = computed(() => this._currentUser() !== null);
```

---

## 3. Estructura de Carpetas y Organización

### Estructura Principal del Proyecto
```
src/front/SportPlanner/
├── src/
│   ├── app/                    # Aplicación principal
│   │   ├── app.config.ts      # Configuración de la aplicación
│   │   ├── app.routes.ts      # Definición de rutas
│   │   ├── components/        # Componentes reutilizables
│   │   ├── pages/            # Páginas principales
│   │   ├── services/         # Servicios de lógica de negocio
│   │   ├── models/           # Modelos de datos
│   │   ├── guards/           # Guards de protección de rutas
│   │   ├── interceptors/     # HTTP interceptors
│   │   └── environments/     # Configuración de entornos
│   ├── styles.css           # Estilos globales
│   ├── main.ts              # Punto de entrada
│   └── index.html           # HTML principal
├── angular.json             # Configuración de Angular
├── package.json            # Dependencias del proyecto
├── tailwind.config.js      # Configuración de Tailwind
└── tsconfig.json           # Configuración de TypeScript
```

### Propósito de Cada Carpeta Principal

#### `/src/app/components/`
Componentes reutilizables que se utilizan en múltiples partes de la aplicación:
- `footer/`: Componente de pie de página
- `navbar/`: Componente de navegación principal
- `notification/`: Sistema de notificaciones global

#### `/src/app/pages/`
Páginas principales de la aplicación con lazy loading:
- `auth/`: Página de autenticación
- `dashboard/`: Panel principal con sub-páginas
- `landing/`: Página de bienvenida

#### `/src/app/services/`
Servicios que contienen la lógica de negocio:
- `auth.service.ts`: Gestión de autenticación
- `teams.service.ts`: Gestión de equipos
- `exercises.service.ts`: Gestión de ejercicios
- `objectives.service.ts`: Gestión de objetivos
- `plannings.service.ts`: Gestión de planificaciones
- `notification.service.ts`: Sistema de notificaciones
- `theme.service.ts`: Gestión de temas

#### `/src/app/models/`
Interfaces y tipos de datos:
- `user.model.ts`: Modelos de usuario
- `team.model.ts`: Modelos de equipos
- `exercise.model.ts`: Modelos de ejercicios
- `objective.model.ts`: Modelos de objetivos
- `planning.model.ts`: Modelos de planificaciones
- `notification.model.ts`: Modelos de notificaciones

#### `/src/app/guards/`
Protectores de rutas para control de acceso:
- `auth.guard.ts`: Protección de rutas autenticadas
- Funciones para diferentes tipos de protección

#### `/src/app/interceptors/`
Interceptores HTTP para manejo global de peticiones:
- `auth.interceptor.ts`: Manejo de tokens de autenticación
- `debug.interceptor.ts`: Logging y depuración

### Convenciones de Nomenclatura
- **Componentes**: PascalCase con sufijo `.component` (ej: `AuthComponent`)
- **Servicios**: PascalCase con sufijo `.service` (ej: `AuthService`)
- **Modelos**: PascalCase con sufijo `.model` (ej: `UserModel`)
- **Interfaces**: PascalCase (ej: `User`)
- **Variables**: camelCase (ej: `currentUser`)
- **Constantes**: UPPER_SNAKE_CASE (ej: `API_URL`)

---

## 4. Infraestructura y Configuración

### Configuración de Angular (angular.json)
El archivo `angular.json` define la configuración del proyecto Angular:

```json
{
  "projects": {
    "SportPlanner": {
      "projectType": "application",
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "browser": "src/main.ts",
            "server": "src/main.server.ts",
            "outputMode": "static"
          }
        }
      }
    }
  }
}
```

**Características clave:**
- **Server Side Rendering (SSR)**: Habilitado para mejor SEO y rendimiento
- **Static Output**: Generación de archivos estáticos
- **Budgets**: Límites de tamaño para bundles
- **Optimization**: Configuración de producción y desarrollo

### Gestión de Dependencias (package.json)
Dependencias principales del proyecto:

```json
{
  "dependencies": {
    "@angular/common": "^20.1.0",
    "@angular/core": "^20.1.0",
    "@angular/router": "^20.1.0",
    "@angular/ssr": "^20.1.4",
    "@supabase/supabase-js": "^2.56.0",
    "tailwindcss": "^3.4.17",
    "rxjs": "~7.8.0"
  }
}
```

**Dependencias clave:**
- **Angular 20**: Última versión con componentes standalone
- **Supabase**: Integración para autenticación y base de datos
- **Tailwind CSS**: Sistema de diseño utility-first
- **RxJS**: Programación reactiva

### Configuración de Tailwind CSS
El archivo `tailwind.config.js` configura el sistema de diseño:

```javascript
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        "primary-green": "var(--color-primary-green)"
      }
    }
  }
}
```

**Características:**
- **Diseño basado en variables CSS**: Facilita el theming
- **Colores personalizados**: Sistema de colores coherente
- **Responsive design**: Breakpoints integrados
- **Utilidades personalizadas**: Extensión del framework

### Environment Variables y Configuración
La aplicación utiliza archivos de entorno para diferentes configuraciones:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  supabaseUrl: 'https://your-project.supabase.co',
  supabaseAnonKey: 'your-anon-key',
  apiUrl: 'https://your-api.com'
};
```

### Build y Desarrollo
**Scripts disponibles:**
```json
{
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "serve:ssr:SportPlanner": "node dist/SportPlanner/server/server.mjs",
    "lint": "ng lint"
  }
}
```

---

## 5. Modelos de Datos

### Análisis de Modelos Principales

#### User Model
```typescript
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  supabaseId: string;
  role: UserRole;
  organizationId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  Administrator = 0,
  Director = 1,
  Coach = 2,
  Assistant = 3
}
```

**Características:**
- **Identificación única**: `id` y `supabaseId` para integración con Supabase
- **Roles jerárquicos**: Sistema de permisos basado en roles
- **Organización**: Soporte para organizaciones múltiples
- **Auditoría**: Fechas de creación y actualización

#### Team Model
```typescript
export interface Team {
  id: string;
  name: string;
  sport: string;
  category: string;
  gender: Gender;
  level: TeamLevel;
  description: string;
  organizationId?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  memberCount: number;
  isActive: boolean;
  isVisible: boolean;
}

export enum Gender {
  Male = 0,
  Female = 1,
  Mixed = 2
}

export enum TeamLevel {
  A = 0,
  B = 1,
  C = 2
}
```

**Características:**
- **Clasificación completa**: Género, nivel y categoría
- **Gestión de estado**: Campos `isActive` y `isVisible`
- **Metadatos**: Contador de miembros y fechas de auditoría
- **Organización**: Soporte multi-organizacional

#### Exercise Model
```typescript
export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: ExerciseCategory;
  difficulty: ExerciseDifficulty;
  duration: number; // en minutos
  equipment: string[];
  instructions: string[];
  videoUrl?: string;
  imageUrl?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  tags: string[];
}
```

**Características:**
- **Clasificación detallada**: Categoría y dificultad
- **Multimedia**: Soporte para videos e imágenes
- **Instrucciones estructuradas**: Array de pasos
- **Equipamiento**: Lista de equipos necesarios
- **Visibilidad**: Control de acceso público/privado

#### Objective Model
```typescript
export interface Objective {
  id: string;
  title: string;
  description: string;
  type: ObjectiveType;
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: Date;
  endDate: Date;
  teamId?: string;
  userId: string;
  status: ObjectiveStatus;
  priority: Priority;
  createdAt: Date;
  updatedAt: Date;
}
```

**Características:**
- **Gestión de metas**: Valores objetivo y actuales
- **Temporalidad**: Fechas de inicio y fin
- **Asignación**: Puede asignarse a equipos o usuarios
- **Seguimiento**: Estado y prioridad
- **Progreso**: Sistema de medición con unidades

#### Planning Model
```typescript
export interface Planning {
  id: string;
  name: string;
  description: string;
  teamId: string;
  startDate: Date;
  endDate: Date;
  sessions: TrainingSession[];
  objectives: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}
```

**Características:**
- **Planificación temporal**: Fechas de inicio y fin
- **Sesiones estructuradas**: Array de sesiones de entrenamiento
- **Objetivos asociados**: Vinculación con objetivos
- **Gestión de estado**: Control de activación

### Relaciones Entre Modelos
```
User (1) ←→ (N) Team
User (1) ←→ (N) Objective
User (1) ←→ (N) Planning
Team (1) ←→ (N) Planning
Team (1) ←→ (N) Objective
Planning (1) ←→ (N) TrainingSession
TrainingSession (1) ←→ (N) Exercise
```

### DTOs y Transferencia de Datos
La aplicación utiliza DTOs (Data Transfer Objects) para la comunicación con el backend:

```typescript
export interface CreateTeamRequest {
  name: string;
  sport: string;
  category: string;
  gender: Gender;
  level: TeamLevel;
  description: string;
  organizationId?: string;
}

export interface UpdateTeamRequest {
  name: string;
  sport: string;
  category: string;
  gender: Gender;
  level: TeamLevel;
  description: string;
}
```

**Ventajas de los DTOs:**
- **Validación**: Control de datos de entrada
- **Seguridad**: Exposición controlada de datos
- **Versionado**: Facilita la evolución de la API
- **Optimización**: Transferencia eficiente de datos

---

## 6. Componentes y UI

### Sistema de Componentes Standalone
SportPlanner utiliza componentes standalone de Angular 20, eliminando la necesidad de NgModule y simplificando la estructura:

```typescript
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  // Lógica del componente
}
```

**Ventajas de los componentes standalone:**
- **Simplicidad**: No requiere NgModule
- **Performance**: Mejor tree-shaking
- **Mantenibilidad**: Código más limpio y organizado
- **Testing**: Más fácil de probar en aislamiento

### Componentes Reutilizables

#### Navbar Component
```typescript
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, NgIconsModule],
  template: `
    <nav class="navbar">
      <!-- Contenido de la navegación -->
    </nav>
  `
})
export class NavbarComponent {
  // Lógica de navegación
}
```

**Características:**
- **Responsive**: Adaptación a diferentes tamaños de pantalla
- **Accesibilidad**: Soporte para navegación por teclado
- **Tematización**: Soporte para modo claro/oscuro
- **Integración**: Con sistema de autenticación

#### Sidebar Component
```typescript
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, NgIconsModule],
  template: `
    <aside class="sidebar">
      <!-- Menú de navegación lateral -->
    </aside>
  `
})
export class SidebarComponent {
  // Lógica del menú lateral
}
```

**Características:**
- **Navegación jerárquica**: Estructura de menú organizada
- **Estado activo**: Resaltado de página actual
- **Colapsable**: Opción de minimizar/maximizar
- **Permisos**: Visibilidad basada en roles

#### Notification Component
```typescript
@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, NgIconsModule],
  template: `
    <div class="notification-container">
      @for (notification of notificationService.notifications(); track notification.id) {
        <div class="notification-item" [class]="getNotificationClasses(notification.type)">
          <!-- Contenido de la notificación -->
        </div>
      }
    </div>
  `
})
export class NotificationComponent {
  // Lógica de notificaciones
}
```

**Características:**
- **Tipos múltiples**: Success, error, warning, info
- **Animaciones**: Transiciones suaves
- **Auto-dismiss**: Cierre automático programable
- **Posicionamiento**: Fijo en esquina superior derecha
- **Responsive**: Adaptación a móviles

### Componentes de Página

#### Dashboard Component
```typescript
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NavbarComponent],
  template: `
    <div class="dashboard-layout">
      <app-sidebar></app-sidebar>
      <div class="main-content">
        <app-navbar></app-navbar>
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class DashboardComponent {
  readonly currentUser = this.authService.currentUser;
  readonly isAuthenticated = this.authService.isAuthenticated;
}
```

**Características:**
- **Layout principal**: Estructura base del dashboard
- **Lazy loading**: Carga dinámica de sub-páginas
- **Integración**: Con sistema de autenticación
- **Responsive**: Adaptación completa

#### Auth Component
```typescript
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIconsModule],
  template: `
    <div class="auth-container">
      <!-- Formularios de login/registro -->
    </div>
  `
})
export class AuthComponent {
  // Lógica de autenticación
}
```

**Características:**
- **Formularios múltiples**: Login y registro
- **Validación**: Controles de entrada en tiempo real
- **Redirección**: Manejo de URLs de retorno
- **Recuperación**: Sistema de olvido de contraseña

### Sistema de Diseño con Tailwind CSS

#### Configuración de Colores
```css
:root {
  --primary-green: oklch(0.58 0.25 142);
  --primary-green-50: oklch(0.97 0.02 142);
  --primary-green-500: oklch(0.58 0.25 142);
  --primary-green-700: oklch(0.38 0.18 142);
}
```

**Sistema de colores:**
- **OKLCH**: Espacio de color moderno y consistente
- **Jerarquía**: 50, 100, 200, 400, 500, 600, 700 niveles
- **Modo oscuro**: Variables específicas para tema oscuro
- **Accesibilidad**: Contraste adecuado para lectura

#### Componentes UI Consistentes
La aplicación utiliza componentes UI consistentes basados en Tailwind:

```html
<!-- Botón primario -->
<button class="bg-primary-green-500 hover:bg-primary-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
  Acción Principal
</button>

<!-- Card -->
<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Título</h3>
  <p class="text-gray-600 dark:text-gray-300 mt-2">Contenido</p>
</div>
```

### Gestión de Temas (Claro/Oscuro)
La aplicación soporta modo claro y oscuro con transiciones suaves:

```css
:root {
  --background: oklch(0.9551 0 0);
  --foreground: oklch(0.3211 0 0);
}

.dark {
  --background: oklch(0.2178 0 0);
  --foreground: oklch(0.8853 0 0);
}

body {
  color: var(--color-foreground);
  background-color: var(--color-background);
  transition: background-color 0.2s ease, color 0.2s ease;
}
```

**Características del sistema de temas:**
- **Variables CSS**: Facilita el cambio de tema
- **Transiciones suaves**: Animaciones de 0.2s
- **Persistencia**: Guardado de preferencia del usuario
- **Automático**: Detección de preferencia del sistema

---

## 7. Servicios y Lógica de Negocio

### Arquitectura de Servicios
La aplicación sigue una arquitectura de servicios limpia con inyección de dependencias:

```typescript
@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
}
```

**Principios de diseño:**
- **Singleton**: Un única instancia por servicio
- **Inyección de dependencias**: Desacoplamiento de componentes
- **Separación de responsabilidades**: Cada servicio tiene un propósito claro
- **Testabilidad**: Fáciles de mockear para pruebas

### Servicio de Autenticación (Supabase Integration)
El `AuthService` es el corazón del sistema de autenticación:

```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly supabase: SupabaseClient;
  private readonly _isAuthenticated = signal<boolean>(false);
  private readonly _currentUser = signal<User | null>(null);
  
  public readonly isAuthenticated = computed(() => this._isAuthenticated());
  public readonly currentUser = computed(() => this._currentUser());
}
```

**Características principales:**

#### 1. **Gestión de Sesión**
```typescript
async login(credentials: LoginRequest): Promise<AuthResponse> {
  const { data, error } = await this.supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });
  
  if (error) throw error;
  
  const user = this.mapSupabaseUser(data.user);
  this.storeAuthData(data.session, user, credentials.rememberMe);
  this.updateAuthState(data.session, user);
  
  return {
    user,
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    expiresIn: data.session.expires_in
  };
}
```

#### 2. **Refresh Automático de Tokens**
```typescript
private scheduleTokenRefresh(): void {
  this.clearTokenRefresh();
  
  const sessionValue = this.session.getValue();
  if (!sessionValue?.expires_at) return;
  
  const refreshTime = (sessionValue.expires_at * 1000) - Date.now() - (5 * 60 * 1000);
  
  if (refreshTime > 0) {
    this.refreshTimer = setTimeout(async () => {
      await this.supabase.auth.refreshSession();
    }, refreshTime);
  }
}
```

#### 3. **Manejo de Storage**
```typescript
private storeAuthData(session: Session, user: User, rememberMe = false): void {
  const authData: StoredAuthData = {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    expiresAt: Date.now() + ((session.expires_in || 3600) * 1000),
    user
  };
  
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(this.STORAGE_KEY, JSON.stringify(authData));
}
```

#### 4. **SSR Compatibility**
```typescript
constructor() {
  this.isBrowser = isPlatformBrowser(this.platformId);
  
  this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey, {
    auth: {
      autoRefreshToken: this.isBrowser,
      persistSession: this.isBrowser,
      detectSessionInUrl: this.isBrowser,
      storage: this.isBrowser ? customStorage : undefined
    }
  });
}
```

### Servicios de API

#### Team Service
```typescript
@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private readonly apiUrl = `${environment.apiUrl}/api/teams`;
  
  getTeams(filters?: TeamFilters): Observable<Team[]> {
    const params = new HttpParams({ fromObject: filters as any });
    return this.http.get<Team[]>(this.apiUrl, { params });
  }
  
  createTeam(team: CreateTeamRequest): Observable<Team> {
    return this.http.post<Team>(this.apiUrl, team);
  }
  
  updateTeam(id: string, team: UpdateTeamRequest): Observable<Team> {
    return this.http.put<Team>(`${this.apiUrl}/${id}`, team);
  }
  
  deleteTeam(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

**Características:**
- **Tipado fuerte**: Interfaces TypeScript para todos los datos
- **Manejo de errores**: Propagación de errores HTTP
- **Filtros**: Soporte para parámetros de consulta
- **Observables**: Programación reactiva con RxJS

#### Exercise Service
```typescript
@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private readonly apiUrl = `${environment.apiUrl}/api/exercises`;
  
  getExercises(category?: ExerciseCategory): Observable<Exercise[]> {
    const params = category ? new HttpParams().set('category', category) : undefined;
    return this.http.get<Exercise[]>(this.apiUrl, { params });
  }
  
  getExerciseById(id: string): Observable<Exercise> {
    return this.http.get<Exercise>(`${this.apiUrl}/${id}`);
  }
  
  createExercise(exercise: CreateExerciseRequest): Observable<Exercise> {
    return this.http.post<Exercise>(this.apiUrl, exercise);
  }
  
  updateExercise(id: string, exercise: UpdateExerciseRequest): Observable<Exercise> {
    return this.http.put<Exercise>(`${this.apiUrl}/${id}`, exercise);
  }
}
```

#### Objective Service
```typescript
@Injectable({
  providedIn: 'root'
})
export class ObjectiveService {
  private readonly apiUrl = `${environment.apiUrl}/api/objectives`;
  
  getObjectives(userId?: string, teamId?: string): Observable<Objective[]> {
    const params = new HttpParams();
    if (userId) params.set('userId', userId);
    if (teamId) params.set('teamId', teamId);
    
    return this.http.get<Objective[]>(this.apiUrl, { params });
  }
  
  updateObjectiveProgress(id: string, currentValue: number): Observable<Objective> {
    return this.http.patch<Objective>(`${this.apiUrl}/${id}/progress`, { currentValue });
  }
}
```

#### Planning Service
```typescript
@Injectable({
  providedIn: 'root'
})
export class PlanningService {
  private readonly apiUrl = `${environment.apiUrl}/api/plannings`;
  
  getPlannings(teamId?: string): Observable<Planning[]> {
    const params = teamId ? new HttpParams().set('teamId', teamId) : undefined;
    return this.http.get<Planning[]>(this.apiUrl, { params });
  }
  
  createPlanning(planning: CreatePlanningRequest): Observable<Planning> {
    return this.http.post<Planning>(this.apiUrl, planning);
  }
  
  addSessionToPlanning(planningId: string, session: TrainingSession): Observable<Planning> {
    return this.http.post<Planning>(`${this.apiUrl}/${planningId}/sessions`, session);
  }
}
```

### Servicio de Notificaciones
El `NotificationService` gestiona el sistema de notificaciones global:

```typescript
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly _notifications = signal<Notification[]>([]);
  private readonly notificationCounter = signal(0);
  
  public readonly notifications = computed(() => this._notifications());
  
  showSuccess(message: string, duration = 5000): void {
    this.addNotification(message, 'success', duration);
  }
  
  showError(message: string, duration = 7000): void {
    this.addNotification(message, 'error', duration);
  }
  
  showWarning(message: string, duration = 6000): void {
    this.addNotification(message, 'warning', duration);
  }
  
  showInfo(message: string, duration = 5000): void {
    this.addNotification(message, 'info', duration);
  }
  
  private addNotification(message: string, type: NotificationType, duration: number): void {
    const notification: Notification = {
      id: this.generateId(),
      message,
      type,
      timestamp: new Date()
    };
    
    this._notifications.update(notifications => [...notifications, notification]);
    
    if (duration > 0) {
      setTimeout(() => {
        this.dismissNotification(notification.id);
      }, duration);
    }
  }
}
```

**Características:**
- **Tipos múltiples**: Success, error, warning, info
- **Auto-dismiss**: Cierre automático configurable
- **Gestión de estado**: Signals para estado reactiva
- **Animaciones**: Integración con componente UI

### Servicio de Gestión de Temas
```typescript
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly _isDarkMode = signal<boolean>(false);
  
  public readonly isDarkMode = computed(() => this._isDarkMode());
  
  constructor() {
    this.loadTheme();
    this.listenForSystemThemeChanges();
  }
  
  toggleTheme(): void {
    this._isDarkMode.update(current => !current);
    this.applyTheme();
    this.saveTheme();
  }
  
  setTheme(isDark: boolean): void {
    this._isDarkMode.set(isDark);
    this.applyTheme();
    this.saveTheme();
  }
  
  private applyTheme(): void {
    if (this._isDarkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
  
  private saveTheme(): void {
    localStorage.setItem('theme', this._isDarkMode() ? 'dark' : 'light');
  }
  
  private loadTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    this._isDarkMode.set(savedTheme === 'dark' || (!savedTheme && systemPrefersDark));
    this.applyTheme();
  }
  
  private listenForSystemThemeChanges(): void {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this._isDarkMode.set(e.matches);
        this.applyTheme();
      }
    });
  }
}
```

**Características:**
- **Persistencia**: Guardado de preferencia en localStorage
- **Sistema automático**: Detección de preferencia del sistema
- **Transiciones suaves**: Cambios de tema animados
- **Reactividad**: Signals para estado del tema

---

## 8. Sistema de Autenticación y Seguridad

### Flujo de Autenticación con Supabase
El sistema de autenticación utiliza Supabase como proveedor de identidad, proporcionando un flujo seguro y moderno:

#### 1. **Proceso de Login**
```typescript
async login(credentials: LoginRequest): Promise<AuthResponse> {
  try {
    this._isLoading.set(true);

    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      console.error('Login error:', error);
      this.notificationService.showError(`Error de inicio de sesión: ${error.message}`);
      throw error;
    }

    if (!data.session || !data.user) {
      const errorMsg = 'No se recibió sesión válida del servidor';
      this.notificationService.showError(errorMsg);
      throw new Error(errorMsg);
    }

    // Mapeo de usuario y almacenamiento de datos
    const user = this.mapSupabaseUser(data.user);
    this.storeAuthData(data.session, user, credentials.rememberMe || false);
    this.updateAuthState(data.session, user);

    return {
      user,
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresIn: data.session.expires_in || 3600
    };

  } catch (error: unknown) {
    console.error('Login failed:', error);
    
    let errorMessage = 'Error desconocido durante el inicio de sesión';
    if (error instanceof Error) {
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Credenciales incorrectas. Verifica tu email y contraseña.';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Por favor confirma tu email antes de iniciar sesión.';
      } else {
        errorMessage = error.message;
      }
    }

    throw new Error(errorMessage);
  } finally {
    this._isLoading.set(false);
  }
}
```

#### 2. **Proceso de Registro**
```typescript
async register(userData: RegisterRequest): Promise<AuthResponse> {
  try {
    this._isLoading.set(true);

    const { data, error } = await this.supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: UserRole.Coach
        }
      }
    });

    if (error) {
      console.error('Registration error:', error);
      this.notificationService.showError(`Error de registro: ${error.message}`);
      throw error;
    }

    const user = this.mapSupabaseUser(data.user);

    if (data.session) {
      this.storeAuthData(data.session, user, false);
      this.updateAuthState(data.session, user);
      this.notificationService.showSuccess(`¡Bienvenido, ${user.firstName}! Tu cuenta ha sido creada.`);
    } else {
      this.notificationService.showInfo('Revisa tu email para confirmar tu cuenta antes de iniciar sesión.');
    }

    if (data.session) {
      return {
        user,
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresIn: data.session.expires_in || 3600
      };
    } else {
      throw new Error('Registro exitoso. Confirma tu email para continuar.');
    }

  } catch (error: unknown) {
    console.error('Registration failed:', error);
    
    let errorMessage = 'Error desconocido durante el registro';
    if (error instanceof Error) {
      if (error.message?.includes('User already registered')) {
        errorMessage = 'Este email ya está registrado. Intenta iniciar sesión.';
      } else if (error.message?.includes('Password should be')) {
        errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      } else {
        errorMessage = error.message;
      }
    }

    throw new Error(errorMessage);
  } finally {
    this._isLoading.set(false);
  }
}
```

### Guards y Protección de Rutas
La aplicación utiliza guards funcionales para proteger las rutas:

#### 1. **Auth Guard - Protección de Rutas Autenticadas**
```typescript
export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  try {
    if (!authService.isInitialized()) {
      await authService.checkAuthState();
    }
    
    if (authService.isAuthenticated()) {
      return true;
    } else {
      console.log('🔒 Auth guard: User not authenticated, redirecting to auth page');
      const redirectUrl = state.url !== '/auth' ? state.url : '/dashboard';
      return router.createUrlTree(['/auth'], { 
        queryParams: { redirectUrl } 
      });
    }
  } catch (error) {
    console.error('🔒 Auth guard error:', error);
    return router.createUrlTree(['/auth'], { 
      queryParams: { redirectUrl: state.url } 
    });
  }
};
```

#### 2. **Guest Guard - Protección para Usuarios No Autenticados**
```typescript
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  } else {
    const redirectUrl = route.queryParams?.['redirectUrl'] || '/dashboard';
    return router.createUrlTree([redirectUrl]);
  }
};
```

#### 3. **Role Guard - Protección Basada en Roles**
```typescript
export const createRoleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const notificationService = inject(NotificationService);

    if (!authService.isAuthenticated()) {
      notificationService.showWarning('Debes iniciar sesión para acceder a esta página.');
      return router.createUrlTree(['/auth'], { 
        queryParams: { redirectUrl: state.url } 
      });
    }

    const currentUser = authService.currentUser();
    
    if (!currentUser) {
      notificationService.showError('No se pudo verificar tu usuario.');
      return router.createUrlTree(['/auth']);
    }

    const userRole = currentUser.role.toString().toLowerCase();
    const hasPermission = allowedRoles.some(role => 
      role.toLowerCase() === userRole
    );

    if (hasPermission) {
      return true;
    } else {
      notificationService.showError('No tienes permisos para acceder a esta página.');
      return router.createUrlTree(['/dashboard']);
    }
  };
};
```

### HTTP Interceptors para Manejo de Tokens
Los interceptores HTTP gestionan automáticamente la autenticación en las peticiones:

#### 1. **Auth Interceptor - Inyección Automática de Tokens**
```typescript
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  
  const isApiRequest = req.url.startsWith(environment.apiUrl);
  
  if (isApiRequest && authService.isAuthenticated()) {
    const syncToken = authService.getAccessToken();
    
    if (syncToken) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${syncToken}`)
      });
      return next(authReq);
    } else {
      return from(authService.getAccessTokenAsync()).pipe(
        switchMap(token => {
          if (token) {
            const authReq = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${token}`)
            });
            return next(authReq);
          } else {
            console.warn('⚠️ Auth service says authenticated but no token available');
            return next(req);
          }
        }),
        catchError(error => {
          console.warn('❌ Token refresh failed in interceptor:', error);
          return next(req);
        })
      );
    }
  }
  
  return next(req);
};
```

#### 2. **Auth Error Interceptor - Manejo de Errores 401**
```typescript
export const authErrorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  
  return next(req).pipe(
    catchError((error) => {
      const isApiRequest = req.url.startsWith(environment.apiUrl);
      
      if (error.status === 401 && isApiRequest && authService.isAuthenticated()) {
        const hasAuthHeader = req.headers.has('Authorization');
        
        if (hasAuthHeader) {
          console.warn('❌ Authentication token was rejected by server, logging out user');
          
          setTimeout(() => {
            authService.logout();
          }, 100);
        } else {
          console.warn('⚠️ Got 401 but no auth header was sent - possible race condition');
        }
      }
      
      return throwError(() => error);
    })
  );
};
```

### Gestión de Sesiones y Refresh Tokens
El sistema implementa una gestión robusta de sesiones con refresh automático:

#### 1. **Almacenamiento Seguro de Tokens**
```typescript
private storeAuthData(session: Session, user: User, rememberMe = false): void {
  if (!this.isBrowser) return;
  
  const authData: StoredAuthData = {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    expiresAt: Date.now() + ((session.expires_in || 3600) * 1000),
    user
  };

  try {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(this.STORAGE_KEY, JSON.stringify(authData));
    localStorage.setItem(this.REMEMBER_ME_KEY, rememberMe.toString());
  } catch (error) {
    console.warn('Failed to store auth data:', error);
  }
}
```

#### 2. **Refresh Automático Programado**
```typescript
private scheduleTokenRefresh(): void {
  this.clearTokenRefresh();

  const sessionValue = this.session.getValue();
  if (!sessionValue?.expires_at) return;

  const refreshTime = (sessionValue.expires_at * 1000) - Date.now() - (5 * 60 * 1000);
  
  if (refreshTime > 0) {
    this.refreshTimer = setTimeout(async () => {
      await this.supabase.auth.refreshSession();
    }, refreshTime);
  }
}
```

#### 3. **Manejo de Expiración de Sesión**
```typescript
async getAccessTokenAsync(): Promise<string | null> {
  const sessionValue = this.session.getValue();
  
  if (!sessionValue) return null;

  const expiresAt = sessionValue.expires_at;
  const currentTime = Math.floor(Date.now() / 1000);
  const fiveMinutesFromNow = currentTime + (5 * 60);

  if (expiresAt && expiresAt <= fiveMinutesFromNow) {
    try {
      await this.refreshSession();
      const refreshedSession = this.session.getValue();
      return refreshedSession?.access_token || null;
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      this.handleAuthError(error);
      return null;
    }
  }

  return sessionValue.access_token;
}
```

### Manejo de Errores de Autenticación
El sistema incluye un manejo robusto de errores:

```typescript
private handleAuthError(error: unknown): void {
  console.error('Authentication error:', error);
  
  if (this._isAuthenticated()) {
    this.notificationService.showError('Sesión expirada. Por favor, inicia sesión nuevamente.');
    this.logout();
  }
}

async logout(): Promise<void> {
  try {
    console.log('🚪 Logout initiated');
    this._isLoading.set(true);
    
    this.clearStoredAuthData();
    this.clearTokenRefresh();
    this.updateAuthState(null, null);
    
    try {
      await this.supabase.auth.signOut();
      console.log('✅ Supabase logout successful');
    } catch (supabaseError) {
      console.warn('⚠️ Supabase logout failed, but local state cleared:', supabaseError);
    }
    
    this.notificationService.showInfo('Sesión cerrada correctamente');
    await this.router.navigate(['/auth']);
    
  } catch (error) {
    console.error('Logout error:', error);
    this.updateAuthState(null, null);
    
    try {
      await this.router.navigate(['/auth']);
    } catch (navError) {
      console.error('Navigation error:', navError);
      if (this.isBrowser && typeof window !== 'undefined') {
        window.location.href = '/auth';
      }
    }
  } finally {
    this._isLoading.set(false);
  }
}
```

### Seguridad Adicional

#### 1. **Protección CSRF**
La aplicación utiliza mecanismos integrados de Angular para protección CSRF:

```typescript
// Angular automáticamente incluye protección CSRF en todas las peticiones POST
provideHttpClient(withFetch(), withInterceptors([debugInterceptor, authInterceptor, authErrorInterceptor]))
```

#### 2. **Validación de Entrada**
Los formularios incluyen validación robusta:

```typescript
loginForm = new FormGroup({
  email: new FormControl('', [Validators.required, Validators.email]),
  password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  rememberMe: new FormControl(false)
});
```

#### 3. **Sanitización de Datos**
La aplicación utiliza las herramientas integradas de Angular para sanitización:

```typescript
// Angular automáticamente sanitiza HTML en los templates
<div [innerHTML]="trustedContent"></div>
```

#### 4. **Headers de Seguridad**
La aplicación incluye headers de seguridad en las peticiones:

```typescript
// Headers adicionales de seguridad
const headers = new HttpHeaders()
  .set('Content-Security-Policy', "default-src 'self'")
  .set('X-Content-Type-Options', 'nosniff')
  .set('X-Frame-Options', 'DENY')
  .set('X-XSS-Protection', '1; mode=block');
```

---

## 9. Enrutamiento y Navegación

### Estructura de Rutas y Lazy Loading
La aplicación utiliza un sistema de enrutamiento moderno con lazy loading para optimizar el rendimiento:

```typescript
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent),
    title: 'SportPlanner - Organiza el Deporte Como Nunca Antes'
  },
  {
    path: 'auth',
    loadComponent: () => import('./pages/auth/auth.component').then(m => m.AuthComponent),
    canActivate: [guestGuard],
    title: 'SportPlanner - Iniciar Sesión'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
    title: 'SportPlanner - Dashboard',
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./pages/dashboard/pages/home/home.component').then(m => m.DashboardHomeComponent),
        title: 'SportPlanner - Dashboard'
      },
      {
        path: 'teams',
        loadComponent: () => import('./pages/dashboard/pages/teams/teams.component').then(m => m.TeamsComponent),
        title: 'SportPlanner - Equipos'
      },
      {
        path: 'objectives',
        loadComponent: () => import('./pages/dashboard/pages/objectives/objectives.component').then(m => m.ObjectivesComponent),
        title: 'SportPlanner - Objetivos'
      },
      {
        path: 'exercises',
        loadComponent: () => import('./pages/dashboard/pages/exercises/exercises.component').then(m => m.ExercisesComponent),
        title: 'SportPlanner - Ejercicios'
      },
      {
        path: 'plannings',
        loadComponent: () => import('./pages/dashboard/pages/plannings/plannings').then(m => m.Plannings),
        title: 'SportPlanner - Planificaciones'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
```

**Características del sistema de rutas:**
- **Lazy Loading**: Los componentes se cargan solo cuando se necesitan
- **Rutas Anidadas**: El dashboard tiene sub-rutas organizadas
- **Protección por Guards**: Cada ruta tiene su protección correspondiente
- **Títulos Dinámicos**: Cada ruta define su título para SEO
- **Redirección Automática**: Ruta por defecto y manejo de 404

### Sistema de Guards para Protección
La aplicación implementa un sistema completo de guards para controlar el acceso:

#### 1. **Auth Guard - Protección General**
```typescript
export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  try {
    if (!authService.isInitialized()) {
      await authService.checkAuthState();
    }
    
    if (authService.isAuthenticated()) {
      return true;
    } else {
      const redirectUrl = state.url !== '/auth' ? state.url : '/dashboard';
      return router.createUrlTree(['/auth'], { 
        queryParams: { redirectUrl } 
      });
    }
  } catch (error) {
    console.error('🔒 Auth guard error:', error);
    return router.createUrlTree(['/auth'], { 
      queryParams: { redirectUrl: state.url } 
    });
  }
};
```

#### 2. **Guest Guard - Acceso para No Autenticados**
```typescript
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  } else {
    const redirectUrl = route.queryParams?.['redirectUrl'] || '/dashboard';
    return router.createUrlTree([redirectUrl]);
  }
};
```

#### 3. **Role Guard - Acceso Basado en Roles**
```typescript
export const createRoleGuard = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const notificationService = inject(NotificationService);

    if (!authService.isAuthenticated()) {
      notificationService.showWarning('Debes iniciar sesión para acceder a esta página.');
      return router.createUrlTree(['/auth'], { 
        queryParams: { redirectUrl: state.url } 
      });
    }

    const currentUser = authService.currentUser();
    
    if (!currentUser) {
      notificationService.showError('No se pudo verificar tu usuario.');
      return router.createUrlTree(['/auth']);
    }

    const userRole = currentUser.role.toString().toLowerCase();
    const hasPermission = allowedRoles.some(role => 
      role.toLowerCase() === userRole
    );

    if (hasPermission) {
      return true;
    } else {
      notificationService.showError('No tienes permisos para acceder a esta página.');
      return router.createUrlTree(['/dashboard']);
    }
  };
};
```

### Manejo de Redirecciones
El sistema incluye un manejo inteligente de redirecciones:

#### 1. **Redirección después de Login**
```typescript
async login(credentials: LoginRequest): Promise<AuthResponse> {
  // ... lógica de login
  
  // Redirección inteligente después del login
  const redirectUrl = this.getRedirectUrl() || '/dashboard';
  await this.router.navigate([redirectUrl]);
  
  return authResponse;
}

private getRedirectUrl(): string | null {
  // Obtener URL de redirección de los query params
  const tree = this.router.parseUrl(this.router.url);
  const redirectUrl = tree.queryParams['redirectUrl'];
  
  // Limpiar el parámetro de redirección
  if (redirectUrl) {
    this.router.navigate([], {
      queryParams: { redirectUrl: null },
      queryParamsHandling: 'merge'
    });
  }
  
  return redirectUrl;
}
```

#### 2. **Redirección después de Logout**
```typescript
async logout(): Promise<void> {
  try {
    // ... lógica de logout
    
    // Siempre redirigir a la página de auth después de logout
    await this.router.navigate(['/auth']);
    
  } catch (error) {
    console.error('Logout error:', error);
    
    // Fallback: redirección forzada si hay error
    try {
      await this.router.navigate(['/auth']);
    } catch (navError) {
      console.error('Navigation error:', navError);
      if (this.isBrowser && typeof window !== 'undefined') {
        window.location.href = '/auth';
      }
    }
  }
}
```

### Rutas Anidadas en el Dashboard
El dashboard utiliza rutas anidadas para organizar las diferentes secciones:

#### 1. **Estructura del Dashboard Layout**
```typescript
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NavbarComponent],
  template: `
    <div class="dashboard-layout">
      <app-sidebar></app-sidebar>
      <div class="main-content">
        <app-navbar></app-navbar>
        <main class="content-area">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class DashboardComponent {
  // El router-outlet renderizará las rutas hijas
}
```

#### 2. **Configuración de Rutas Hijas**
```typescript
{
  path: 'dashboard',
  loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
  canActivate: [authGuard],
  title: 'SportPlanner - Dashboard',
  children: [
    {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full'
    },
    {
      path: 'home',
      loadComponent: () => import('./pages/dashboard/pages/home/home.component').then(m => m.DashboardHomeComponent),
      title: 'SportPlanner - Dashboard'
    },
    {
      path: 'teams',
      loadComponent: () => import('./pages/dashboard/pages/teams/teams.component').then(m => m.TeamsComponent),
      title: 'SportPlanner - Equipos'
    }
    // ... más rutas hijas
  ]
}
```

### Navegación Programática
La aplicación utiliza navegación programática para diferentes casos de uso:

#### 1. **Servicio de Navegación**
```typescript
@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private readonly router = inject(Router);
  
  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
  
  navigateToAuth(redirectUrl?: string): void {
    const queryParams = redirectUrl ? { redirectUrl } : undefined;
    this.router.navigate(['/auth'], { queryParams });
  }
  
  navigateToTeamDetail(teamId: string): void {
    this.router.navigate(['/dashboard', 'teams', teamId]);
  }
  
  navigateToPlanningDetail(planningId: string): void {
    this.router.navigate(['/dashboard', 'plannings', planningId]);
  }
}
```

#### 2. **Navegación desde Componentes**
```typescript
@Component({
  selector: 'app-team-card',
  template: `
    <div class="team-card" (click)="viewTeamDetails()">
      <!-- Contenido de la tarjeta -->
    </div>
  `
})
export class TeamCardComponent {
  @Input() team: Team;
  
  constructor(private readonly router: Router) {}
  
  viewTeamDetails(): void {
    this.router.navigate(['/dashboard', 'teams', this.team.id]);
  }
}
```

### Manejo de Parámetros de Ruta
La aplicación maneja parámetros de ruta para diferentes funcionalidades:

#### 1. **Parámetros Obligatorios**
```typescript
{
  path: 'teams/:id',
  loadComponent: () => import('./pages/dashboard/pages/team-detail/team-detail.component').then(m => m.TeamDetailComponent),
  title: 'SportPlanner - Detalle del Equipo'
}
```

#### 2. **Parámetros Opcionales**
```typescript
{
  path: 'teams',
  loadComponent: () => import('./pages/dashboard/pages/teams/teams.component').then(m => m.TeamsComponent),
  title: 'SportPlanner - Equipos'
}
```

#### 3. **Acceso a Parámetros en Componentes**
```typescript
@Component({
  selector: 'app-team-detail',
  template: `
    <div *ngIf="team">
      <h1>{{ team.name }}</h1>
      <!-- Detalles del equipo -->
    </div>
  `
})
export class TeamDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly teamService = inject(TeamService);
  
  team: Team | null = null;
  
  ngOnInit(): void {
    const teamId = this.route.snapshot.paramMap.get('id');
    if (teamId) {
      this.loadTeam(teamId);
    }
  }
  
  private loadTeam(teamId: string): void {
    this.teamService.getTeamById(teamId).subscribe({
      next: (team) => {
        this.team = team;
      },
      error: (error) => {
        console.error('Error loading team:', error);
      }
    });
  }
}
```

### Resolvers para Pre-carga de Datos
La aplicación utiliza resolvers para cargar datos antes de activar una ruta:

#### 1. **Team Resolver**
```typescript
export const teamResolver: ResolveFn<Team> = (route, state) => {
  const teamService = inject(TeamService);
  const teamId = route.paramMap.get('id');
  
  if (!teamId) {
    throw new Error('Team ID is required');
  }
  
  return teamService.getTeamById(teamId);
};
```

#### 2. **Configuración de Ruta con Resolver**
```typescript
{
  path: 'teams/:id',
  loadComponent: () => import('./pages/dashboard/pages/team-detail/team-detail.component').then(m => m.TeamDetailComponent),
  resolve: {
    team: teamResolver
  },
  title: 'SportPlanner - Detalle del Equipo'
}
```

#### 3. **Acceso a Datos Resueltos**
```typescript
@Component({
  selector: 'app-team-detail',
  template: `
    <div *ngIf="team">
      <h1>{{ team.name }}</h1>
      <!-- Detalles del equipo -->
    </div>
  `
})
export class TeamDetailComponent implements OnInit {
  team: Team;
  
  constructor(private readonly route: ActivatedRoute) {}
  
  ngOnInit(): void {
    this.team = this.route.snapshot.data['team'];
  }
}
```

---

## 10. Estilos y Diseño

### Sistema de Diseño con Tailwind CSS
SportPlanner utiliza Tailwind CSS como sistema de diseño principal, proporcionando un enfoque utility-first para el desarrollo de estilos:

#### 1. **Configuración de Tailwind**
```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        card: "var(--color-card)",
        "card-foreground": "var(--color-card-foreground)",
        popover: "var(--color-popover)",
        "popover-foreground": "var(--color-popover-foreground)",
        primary: "var(--color-primary)",
        "primary-foreground": "var(--color-primary-foreground)",
        secondary: "var(--color-secondary)",
        "secondary-foreground": "var(--color-secondary-foreground)",
        muted: "var(--color-muted)",
        "muted-foreground": "var(--color-muted-foreground)",
        accent: "var(--color-accent)",
        "accent-foreground": "var(--color-accent-foreground)",
        destructive: "var(--color-destructive)",
        "destructive-foreground": "var(--color-destructive-foreground)",
        border: "var(--color-border)",
        input: "var(--color-input)",
        ring: "var(--color-ring)",
        "primary-green": {
          DEFAULT: "var(--color-primary-green)",
          foreground: "var(--color-primary-green-foreground)",
          50: "var(--color-primary-green-50)",
          100: "var(--color-primary-green-100)",
          200: "var(--color-primary-green-200)",
          400: "var(--color-primary-green-400)",
          500: "var(--color-primary-green-500)",
          600: "var(--color-primary-green-600)",
          700: "var(--color-primary-green-700)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
```

#### 2. **Integración con CSS Variables**
```css
/* src/styles.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: oklch(0.9551 0 0);
  --foreground: oklch(0.3211 0 0);
  --card: oklch(0.9702 0 0);
  --card-foreground: oklch(0.3211 0 0);
  --popover: oklch(0.9702 0 0);
  --popover-foreground: oklch(0.3211 0 0);
  --primary: oklch(0.4891 0 0);
  --primary-foreground: oklch(1.0000 0 0);
  --secondary: oklch(0.9067 0 0);
  --secondary-foreground: oklch(0.3211 0 0);
  --muted: oklch(0.8853 0 0);
  --muted-foreground: oklch(0.5103 0 0);
  --accent: oklch(0.8078 0 0);
  --accent-foreground: oklch(0.3211 0 0);
  --destructive: oklch(0.5594 0.1900 25.8625);
  --destructive-foreground: oklch(1.0000 0 0);
  --border: oklch(0.8576 0 0);
  --input: oklch(0.9067 0 0);
  --ring: oklch(0.4891 0 0);
  --radius: 0.5rem;
  
  /* Green accent color within OKLCH system */
  --primary-green: oklch(0.58 0.25 142);
  --primary-green-foreground: oklch(1.0000 0 0);
  --primary-green-50: oklch(0.97 0.02 142);
  --primary-green-100: oklch(0.94 0.05 142);
  --primary-green-200: oklch(0.88 0.08 142);
  --primary-green-500: oklch(0.58 0.25 142);
  --primary-green-600: oklch(0.48 0.22 142);
  --primary-green-700: oklch(0.38 0.18 142);
}

.dark {
  --background: oklch(0.2178 0 0);
  --foreground: oklch(0.8853 0 0);
  --card: oklch(0.2435 0 0);
  --card-foreground: oklch(0.8853 0 0);
  --popover: oklch(0.2435 0 0);
  --popover-foreground: oklch(0.8853 0 0);
  --primary: oklch(0.8853 0 0);
  --primary-foreground: oklch(0.2435 0 0);
  --secondary: oklch(0.2694 0 0);
  --secondary-foreground: oklch(0.8853 0 0);
  --muted: oklch(0.2694 0 0);
  --muted-foreground: oklch(0.6604 0 0);
  --accent: oklch(0.2694 0 0);
  --accent-foreground: oklch(0.8853 0 0);
  --destructive: oklch(0.5594 0.1900 25.8625);
  --destructive-foreground: oklch(0.8853 0 0);
  --border: oklch(0.2694 0 0);
  --input: oklch(0.2694 0 0);
  --ring: oklch(0.6702 0 0);
  
  /* Green accent in dark mode */
  --primary-green: oklch(0.58 0.25 142);
  --primary-green-foreground: oklch(1.0000 0 0);
  --primary-green-200: oklch(0.78 0.10 142);
  --primary-green-400: oklch(0.68 0.20 142);
  --primary-green-500: oklch(0.58 0.25 142);
  --primary-green-600: oklch(0.48 0.22 142);
}
```

### Sistema de Colores Personalizado (OKLCH)
La aplicación utiliza el espacio de color OKLCH, que proporciona una percepción de color más consistente:

#### 1. **Ventajas de OKLCH**
- **Percepción uniforme**: Los cambios numéricos corresponden a cambios perceptuales
- **Consistencia**: Mejor consistencia entre diferentes dispositivos
- **Accesibilidad**: Mejor contraste y legibilidad
- **Modo oscuro**: Fácil adaptación para temas oscuros

#### 2. **Paleta de Colores Principal**
```css
/* Colores primarios */
--primary-green: oklch(0.58 0.25 142); /* Verde principal */
--primary-green-50: oklch(0.97 0.02 142); /* Verde muy claro */
--primary-green-100: oklch(0.94 0.05 142); /* Verde claro */
--primary-green-200: oklch(0.88 0.08 142); /* Verde medio-claro */
--primary-green-500: oklch(0.58 0.25 142); /* Verde principal */
--primary-green-600: oklch(0.48 0.22 142); /* Verde oscuro */
--primary-green-700: oklch(0.38 0.18 142); /* Verde muy oscuro */

/* Colores semánticos */
--destructive: oklch(0.5594 0.1900 25.8625); /* Rojo para errores */
--muted: oklch(0.8853 0 0); /* Gris para texto secundario */
--accent: oklch(0.8078 0 0); /* Color de acento */
```

#### 3. **Uso en Componentes**
```html
<!-- Botón primario -->
<button class="bg-primary-green-500 hover:bg-primary-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
  Guardar Cambios
</button>

<!-- Card -->
<div class="bg-card text-card-foreground rounded-lg shadow-sm border border-border p-6">
  <h3 class="text-lg font-semibold">Título de la Card</h3>
  <p class="text-muted-foreground mt-2">Contenido de la card con texto secundario</p>
</div>

<!-- Notificación de éxito -->
<div class="bg-primary-green-50 border border-primary-green-200 text-primary-green-700 rounded-lg p-4">
  <div class="flex items-center">
    <ng-icon name="heroCheckCircle" class="text-primary-green-600 mr-2"></ng-icon>
    <span>Operación completada con éxito</span>
  </div>
</div>
```

### Diseño Responsive
La aplicación implementa un diseño completamente responsive utilizando el sistema de breakpoints de Tailwind:

#### 1. **Breakpoints Utilizados**
```css
/* Breakpoints de Tailwind */
sm: 640px   /* Small phones */
md: 768px   /* Tablets */
lg: 1024px  /* Small desktops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large desktops */
```

#### 2. **Ejemplos de Diseño Responsive**
```html
<!-- Grid responsive -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div class="bg-white dark:bg-gray-800 rounded-lg p-6">Card 1</div>
  <div class="bg-white dark:bg-gray-800 rounded-lg p-6">Card 2</div>
  <div class="bg-white dark:bg-gray-800 rounded-lg p-6">Card 3</div>
</div>

<!-- Sidebar responsive -->
<div class="flex">
  <!-- Sidebar oculta en móvil -->
  <aside class="hidden lg:block w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
    <!-- Contenido del sidebar -->
  </aside>
  
  <!-- Contenido principal -->
  <main class="flex-1 p-6">
    <!-- Contenido principal -->
  </main>
</div>

<!-- Tabla responsive -->
<div class="overflow-x-auto">
  <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
    <thead>
      <tr>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Nombre
        </th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Email
        </th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
      <!-- Filas de la tabla -->
    </tbody>
  </table>
</div>
```

### Animaciones y Transiciones
La aplicación incluye animaciones suaves para mejorar la experiencia de usuario:

#### 1. **Transiciones CSS**
```css
/* Transiciones generales */
.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-transform {
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Transiciones específicas */
button {
  @apply transition-colors duration-200 ease-in-out;
}

.card {
  @apply transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1;
}
```

#### 2. **Animaciones Keyframe**
```css
/* Animación de entrada para notificaciones */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.notification-item {
  animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* Animación de fade */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}
```

#### 3. **Animaciones con Tailwind**
```html
<!-- Hover effects -->
<div class="group relative overflow-hidden rounded-lg">
  <img 
    src="image.jpg" 
    alt="Descripción" 
    class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
  />
  <div class="absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 group-hover:bg-opacity-30"></div>
</div>

<!-- Loading spinner -->
<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-green-500"></div>

<!-- Pulse animation -->
<div class="animate-pulse">
  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
</div>
```

### Componentes de UI Consistentes
La aplicación mantiene una librería de componentes UI consistentes:

#### 1. **Botones**
```html
<!-- Botón primario -->
<button class="bg-primary-green-500 hover:bg-primary-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
  Acción Principal
</button>

<!-- Botón secundario -->
<button class="bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium py-2 px-4 rounded-lg transition-colors">
  Acción Secundaria
</button>

<!-- Botón outline -->
<button class="border border-primary-green-500 text-primary-green-500 hover:bg-primary-green-50 font-medium py-2 px-4 rounded-lg transition-colors">
  Acción Outline
</button>

<!-- Botón ghost -->
<button class="text-primary-green-500 hover:bg-primary-green-50 font-medium py-2 px-4 rounded-lg transition-colors">
  Acción Ghost
</button>
```

#### 2. **Cards**
```html
<!-- Card básica -->
<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Título de la Card</h3>
  <p class="text-gray-600 dark:text-gray-300">Contenido de la card con información relevante.</p>
</div>

<!-- Card con header -->
<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
  <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Header de la Card</h3>
  </div>
  <div class="p-6">
    <p class="text-gray-600 dark:text-gray-300">Contenido principal de la card.</p>
  </div>
</div>

<!-- Card con footer -->
<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
  <div class="p-6">
    <p class="text-gray-600 dark:text-gray-300">Contenido de la card.</p>
  </div>
  <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700">
    <button class="text-primary-green-500 hover:text-primary-green-600 font-medium">
      Acción
    </button>
  </div>
</div>
```

#### 3. **Formularios**
```html
<!-- Input básico -->
<div class="space-y-2">
  <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
    Email
  </label>
  <input 
    type="email" 
    id="email" 
    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-green-500 focus:border-primary-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
    placeholder="tu@email.com"
  />
</div>

<!-- Select -->
<div class="space-y-2">
  <label for="role" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
    Rol
  </label>
  <select 
    id="role" 
    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-green-500 focus:border-primary-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
  >
    <option value="">Selecciona un rol</option>
    <option value="admin">Administrador</option>
    <option value="coach">Entrenador</option>
  </select>
</div>

<!-- Textarea -->
<div class="space-y-2">
  <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
    Descripción
  </label>
  <textarea 
    id="description" 
    rows="4"
    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-green-500 focus:border-primary-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
    placeholder="Describe el contenido..."
  ></textarea>
</div>

<!-- Checkbox -->
<div class="flex items-center">
  <input 
    type="checkbox" 
    id="remember" 
    class="h-4 w-4 text-primary-green-500 focus:ring-primary-green-500 border-gray-300 dark:border-gray-600 rounded"
  />
  <label for="remember" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
    Recordarme
  </label>
</div>
```

#### 4. **Alertas y Notificaciones**
```html
<!-- Alerta de éxito -->
<div class="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4">
  <div class="flex items-center">
    <ng-icon name="heroCheckCircle" class="text-green-600 mr-2"></ng-icon>
    <span class="font-medium">¡Éxito!</span>
  </div>
  <p class="mt-2 text-sm">La operación se completó correctamente.</p>
</div>

<!-- Alerta de error -->
<div class="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
  <div class="flex items-center">
    <ng-icon name="heroXCircle" class="text-red-600 mr-2"></ng-icon>
    <span class="font-medium">Error</span>
  </div>
  <p class="mt-2 text-sm">Ha ocurrido un error en la operación.</p>
</div>

<!-- Alerta de advertencia -->
<div class="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4">
  <div class="flex items-center">
    <ng-icon name="heroExclamationTriangle" class="text-yellow-600 mr-2"></ng-icon>
    <span class="font-medium">Advertencia</span>
  </div>
  <p class="mt-2 text-sm">Por favor, revisa la información ingresada.</p>
</div>

<!-- Alerta informativa -->
<div class="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-4">
  <div class="flex items-center">
    <ng-icon name="heroInformationCircle" class="text-blue-600 mr-2"></ng-icon>
    <span class="font-medium">Información</span>
  </div>
  <p class="mt-2 text-sm">Aquí tienes información importante.</p>
</div>
```

### Accesibilidad
La aplicación sigue las mejores prácticas de accesibilidad:

#### 1. **Semántica HTML**
```html
<!-- Navegación accesible -->
<nav role="navigation" aria-label="Navegación principal">
  <ul>
    <li><a href="/dashboard" aria-current="page">Dashboard</a></li>
    <li><a href="/teams">Equipos</a></li>
  </ul>
</nav>

<!-- Formularios accesibles -->
<form aria-labelledby="form-title">
  <h2 id="form-title" class="sr-only">Formulario de registro</h2>
  <div class="space-y-4">
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Email <span class="text-red-500" aria-label="requerido">*</span>
      </label>
      <input 
        type="email" 
        id="email" 
        required
        aria-required="true"
        aria-describedby="email-error"
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-green-500 focus:border-primary-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
      />
      <div id="email-error" class="mt-1 text-sm text-red-600 hidden" role="alert"></div>
    </div>
  </div>
</form>
```

#### 2. **Focus Management**
```css
/* Estilos de focus accesibles */
button:focus,
input:focus,
select:focus,
textarea:focus {
  outline: 2px solid var(--color-primary-green-500);
  outline-offset: 2px;
}

/* Skip links para navegación por teclado */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-primary-green-500);
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: 0 0 4px 0;
}

.skip-link:focus {
  top: 0;
}
```

#### 3. **ARIA Labels**
```html
<!-- Iconos con descripción -->
<button 
  type="button" 
  class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
  aria-label="Cerrar notificación"
>
  <ng-icon name="heroXMark" aria-hidden="true"></ng-icon>
</button>

<!-- Estado de carga -->
<div 
  role="status" 
  aria-live="polite"
  class="flex items-center justify-center p-4"
>
  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-green-500" aria-hidden="true"></div>
  <span class="ml-2">Cargando...</span>
</div>
```

---

## 11. Manejo de Estado

### Uso de Signals de Angular
SportPlanner utiliza Angular Signals para la gestión de estado reactiva, proporcionando un sistema eficiente y moderno para manejar el estado de la aplicación:

#### 1. **Signals Básicas**
Las signals son la base del sistema de estado, representando valores que pueden cambiar over time:

```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signals privadas para estado interno
  private readonly _isAuthenticated = signal<boolean>(false);
  private readonly _currentUser = signal<User | null>(null);
  private readonly _isLoading = signal<boolean>(true);
  private readonly _isInitialized = signal<boolean>(false);
  
  // Signals públicas para acceso de solo lectura
  public readonly isAuthenticated = computed(() => this._isAuthenticated());
  public readonly currentUser = computed(() => this._currentUser());
  public readonly isLoading = computed(() => this._isLoading());
  public readonly isInitialized = computed(() => this._isInitialized());
  public readonly isGuest = computed(() => !this._isAuthenticated());
}
```

#### 2. **Signals Computadas**
Las signals computadas derivan su valor de otras signals:

```typescript
export class TeamListComponent {
  private readonly teamService = inject(TeamService);
  private readonly authService = inject(AuthService);
  
  // Signal computada que combina datos de múltiples fuentes
  public readonly userTeams = computed(() => {
    const allTeams = this.teamService.teams();
    const currentUser = this.authService.currentUser();
    
    if (!currentUser) return [];
    
    return allTeams.filter(team => 
      team.createdBy === currentUser.id || 
      team.memberCount > 0
    );
  });
  
  // Signal computada para estado de UI
  public readonly hasTeams = computed(() => this.userTeams().length > 0);
  public readonly teamCount = computed(() => this.userTeams().length);
}
```

#### 3. **Actualización de Signals**
Las signals se actualizan mediante métodos específicos:

```typescript
export class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      this._isLoading.set(true); // Actualizar signal de loading
      
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      if (error) throw error;
      
      const user = this.mapSupabaseUser(data.user);
      
      // Actualizar múltiples signals
      this._isAuthenticated.set(true);
      this._currentUser.set(user);
      this._isLoading.set(false);
      this._isInitialized.set(true);
      
      return {
        user,
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresIn: data.session.expires_in || 3600
      };
      
    } catch (error) {
      this._isLoading.set(false);
      throw error;
    }
  }
}
```

### Gestión de Estado Reactiva
La aplicación implementa un sistema de gestión de estado reactiva que permite una respuesta eficiente a los cambios:

#### 1. **Estado Global con Services**
Los servicios actúan como fuentes de verdad para el estado global:

```typescript
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly _notifications = signal<Notification[]>([]);
  private readonly notificationCounter = signal(0);
  
  public readonly notifications = computed(() => this._notifications());
  public readonly unreadCount = computed(() => 
    this._notifications().filter(n => !n.read).length
  );
  
  showSuccess(message: string, duration = 5000): void {
    this.addNotification(message, 'success', duration);
  }
  
  showError(message: string, duration = 7000): void {
    this.addNotification(message, 'error', duration);
  }
  
  private addNotification(message: string, type: NotificationType, duration: number): void {
    const notification: Notification = {
      id: this.generateId(),
      message,
      type,
      timestamp: new Date(),
      read: false
    };
    
    // Actualizar signal con nuevo array
    this._notifications.update(notifications => [...notifications, notification]);
    
    // Auto-dismiss
    if (duration > 0) {
      setTimeout(() => {
        this.dismissNotification(notification.id);
      }, duration);
    }
  }
  
  dismissNotification(id: string): void {
    this._notifications.update(notifications => 
      notifications.filter(n => n.id !== id)
    );
  }
  
  markAsRead(id: string): void {
    this._notifications.update(notifications => 
      notifications.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }
}
```

#### 2. **Estado Local con Componentes**
Los componentes manejan su estado local utilizando signals:

```typescript
@Component({
  selector: 'app-team-form',
  standalone: true,
  template: `
    <form [formGroup]="teamForm" (ngSubmit)="onSubmit()">
      <div class="space-y-4">
        <div>
          <label>Nombre del Equipo</label>
          <input formControlName="name" type="text">
          @if (nameError && nameTouched) {
            <span class="error">{{ nameError }}</span>
          }
        </div>
        
        <div>
          <label>Deporte</label>
          <select formControlName="sport">
            <option value="">Selecciona un deporte</option>
            @for (sport of availableSports; track sport) {
              <option [value]="sport">{{ sport }}</option>
            }
          </select>
        </div>
        
        <button type="submit" [disabled]="teamForm.invalid || isSubmitting()">
          {{ isSubmitting() ? 'Guardando...' : 'Guardar Equipo' }}
        </button>
      </div>
    </form>
  `
})
export class TeamFormComponent {
  private readonly teamService = inject(TeamService);
  private readonly notificationService = inject(NotificationService);
  
  // Signals para estado local
  private readonly _isSubmitting = signal<boolean>(false);
  private readonly _availableSports = signal<string[]>([
    'Fútbol', 'Baloncesto', 'Tenis', 'Vóley', 'Natación'
  ]);
  
  // Signals computadas para UI
  public readonly isSubmitting = computed(() => this._isSubmitting());
  public readonly availableSports = computed(() => this._availableSports());
  
  // Formulario reactivo
  teamForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    sport: new FormControl('', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    gender: new FormControl<Gender>(Gender.Mixed, [Validators.required]),
    level: new FormControl<TeamLevel>(TeamLevel.B, [Validators.required]),
    description: new FormControl('')
  });
  
  // Signals computadas para validación
  nameError = computed(() => {
    const nameControl = this.teamForm.get('name');
    if (!nameControl || !nameControl.touched) return null;
    
    if (nameControl.hasError('required')) return 'El nombre es requerido';
    if (nameControl.hasError('minlength')) return 'Mínimo 3 caracteres';
    return null;
  });
  
  nameTouched = computed(() => this.teamForm.get('name')?.touched || false);
  
  async onSubmit(): Promise<void> {
    if (this.teamForm.invalid) return;
    
    try {
      this._isSubmitting.set(true);
      
      const teamData: CreateTeamRequest = this.teamForm.value;
      const newTeam = await this.teamService.createTeam(teamData);
      
      this.notificationService.showSuccess(`Equipo "${newTeam.name}" creado exitosamente`);
      this.teamForm.reset();
      
    } catch (error) {
      this.notificationService.showError('Error al crear el equipo');
    } finally {
      this._isSubmitting.set(false);
    }
  }
}
```

### Comunicación Entre Componentes
La aplicación utiliza diferentes patrones para la comunicación entre componentes:

#### 1. **Comunicación Padre-Hijo con Input/Output**
```typescript
// Componente hijo
@Component({
  selector: 'app-team-card',
  standalone: true,
  template: `
    <div class="team-card" (click)="onCardClick()">
      <h3>{{ team.name }}</h3>
      <p>{{ team.sport }} - {{ team.category }}</p>
      <button (click)="onEditClick($event)">Editar</button>
      <button (click)="onDeleteClick($event)">Eliminar</button>
    </div>
  `
})
export class TeamCardComponent {
  @Input() team: Team;
  @Output() edit = new EventEmitter<Team>();
  @Output() delete = new EventEmitter<string>();
  @Output() select = new EventEmitter<Team>();
  
  onCardClick(): void {
    this.select.emit(this.team);
  }
  
  onEditClick(event: MouseEvent): void {
    event.stopPropagation();
    this.edit.emit(this.team);
  }
  
  onDeleteClick(event: MouseEvent): void {
    event.stopPropagation();
    this.delete.emit(this.team.id);
  }
}

// Componente padre
@Component({
  selector: 'app-teams-list',
  standalone: true,
  template: `
    <div class="teams-list">
      @for (team of teams(); track team.id) {
        <app-team-card 
          [team]="team"
          (edit)="editTeam($event)"
          (delete)="deleteTeam($event)"
          (select)="selectTeam($event)"
        />
      }
    </div>
  `
})
export class TeamsListComponent {
  private readonly teamService = inject(TeamService);
  
  teams = this.teamService.teams;
  
  editTeam(team: Team): void {
    console.log('Editar equipo:', team);
  }
  
  deleteTeam(teamId: string): void {
    console.log('Eliminar equipo:', teamId);
  }
  
  selectTeam(team: Team): void {
    console.log('Seleccionar equipo:', team);
  }
}
```

#### 2. **Comunicación con Services**
Los servicios actúan como intermediarios para la comunicación entre componentes:

```typescript
@Injectable({
  providedIn: 'root'
})
export class TeamSelectionService {
  private readonly _selectedTeam = signal<Team | null>(null);
  private readonly _selectedTeams = signal<Team[]>([]);
  
  public readonly selectedTeam = computed(() => this._selectedTeam());
  public readonly selectedTeams = computed(() => this._selectedTeams());
  
  selectTeam(team: Team): void {
    this._selectedTeam.set(team);
  }
  
  toggleTeamSelection(team: Team): void {
    this._selectedTeams.update(teams => {
      const isSelected = teams.some(t => t.id === team.id);
      if (isSelected) {
        return teams.filter(t => t.id !== team.id);
      } else {
        return [...teams, team];
      }
    });
  }
  
  clearSelection(): void {
    this._selectedTeam.set(null);
    this._selectedTeams.set([]);
  }
}
```

#### 3. **Comunicación con RxJS Subjects**
Para comunicación más compleja, se utilizan Subjects de RxJS:

```typescript
@Injectable({
  providedIn: 'root'
})
export class EventService {
  private readonly teamCreatedSubject = new Subject<Team>();
  private readonly teamUpdatedSubject = new Subject<Team>();
  private readonly teamDeletedSubject = new Subject<string>();
  
  public readonly teamCreated$ = this.teamCreatedSubject.asObservable();
  public readonly teamUpdated$ = this.teamUpdatedSubject.asObservable();
  public readonly teamDeleted$ = this.teamDeletedSubject.asObservable();
  
  notifyTeamCreated(team: Team): void {
    this.teamCreatedSubject.next(team);
  }
  
  notifyTeamUpdated(team: Team): void {
    this.teamUpdatedSubject.next(team);
  }
  
  notifyTeamDeleted(teamId: string): void {
    this.teamDeletedSubject.next(teamId);
  }
}

// Uso en componentes
@Component({
  selector: 'app-teams-dashboard',
  standalone: true
})
export class TeamsDashboardComponent implements OnInit, OnDestroy {
  private readonly eventService = inject(EventService);
  private readonly notificationService = inject(NotificationService);
  
  private subscription = new Subscription();
  
  ngOnInit(): void {
    this.subscription.add(
      this.eventService.teamCreated$.subscribe(team => {
        this.notificationService.showSuccess(`Equipo "${team.name}" creado`);
      })
    );
    
    this.subscription.add(
      this.eventService.teamUpdated$.subscribe(team => {
        this.notificationService.showSuccess(`Equipo "${team.name}" actualizado`);
      })
    );
    
    this.subscription.add(
      this.eventService.teamDeleted$.subscribe(teamId => {
        this.notificationService.showInfo('Equipo eliminado');
      })
    );
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
```

### Performance Optimization
La aplicación implementa varias técnicas de optimización de rendimiento:

#### 1. **Change Detection Strategy OnPush**
Los componentes utilizan `OnPush` para optimizar el change detection:

```typescript
@Component({
  selector: 'app-team-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="team-card">
      <h3>{{ team.name }}</h3>
      <p>{{ team.sport }}</p>
    </div>
  `
})
export class TeamCardComponent {
  @Input() team: Team;
}
```

#### 2. **Memoización de Signals Computadas**
Las signals computadas son automáticamente memoizadas:

```typescript
export class TeamListComponent {
  private readonly teamService = inject(TeamService);
  private readonly authService = inject(AuthService);
  
  // Esta signal computada solo se recalcula cuando teams() o currentUser() cambian
  public readonly userTeams = computed(() => {
    const allTeams = this.teamService.teams();
    const currentUser = this.authService.currentUser();
    
    if (!currentUser) return [];
    
    return allTeams.filter(team => 
      team.createdBy === currentUser.id || 
      team.memberCount > 0
    );
  });
  
  // Esta signal depende de userTeams() pero se memoiza por separado
  public readonly hasTeams = computed(() => this.userTeams().length > 0);
}
```

#### 3. **Lazy Loading de Componentes**
Los componentes se cargan solo cuando son necesarios:

```typescript
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="dashboard">
      <router-outlet></router-outlet>
    </div>
  `
})
export class DashboardComponent {}

// Configuración de rutas con lazy loading
export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard.component').then(m => m.DashboardComponent),
    children: [
      {
        path: 'teams',
        loadComponent: () => import('./pages/teams/teams.component').then(m => m.TeamsComponent)
      }
    ]
  }
];
```

#### 4. **Virtual Scrolling para Listas Grandes**
Para listas con muchos elementos, se implementa virtual scrolling:

```typescript
@Component({
  selector: 'app-teams-list',
  standalone: true,
  imports: [CommonModule, ScrollingModule],
  template: `
    <cdk-virtual-scroll-viewport itemSize="100" class="teams-list">
      <div *cdkVirtualFor="let team of teams; trackBy: trackByTeamId" class="team-item">
        <app-team-card [team]="team"></app-team-card>
      </div>
    </cdk-virtual-scroll-viewport>
  `
})
export class TeamsListComponent {
  @Input() teams: Team[];
  
  trackByTeamId(index: number, team: Team): string {
    return team.id;
  }
}
```

---

## 12. Integraciones Externas

### Integración con Supabase
Supabase es la principal integración externa de SportPlanner, proporcionando autenticación y base de datos como servicio:

#### 1. **Configuración del Cliente Supabase**
```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly supabase: SupabaseClient;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser: boolean;
  
  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey, {
      auth: {
        autoRefreshToken: this.isBrowser,
        persistSession: this.isBrowser,
        detectSessionInUrl: this.isBrowser,
        flowType: 'pkce',
        storage: this.isBrowser ? {
          getItem: (key: string) => {
            try {
              return localStorage.getItem(key) || sessionStorage.getItem(key);
            } catch {
              return null;
            }
          },
          setItem: (key: string, value: string) => {
            try {
              localStorage.setItem(key, value);
            } catch (error) {
              console.warn('Failed to store session data:', error);
            }
          },
          removeItem: (key: string) => {
            try {
              localStorage.removeItem(key);
              sessionStorage.removeItem(key);
            } catch (error) {
              console.warn('Failed to remove session data:', error);
            }
          }
        } : undefined
      }
    });
  }
}
```

#### 2. **Operaciones de Autenticación**
```typescript
// Login con email y contraseña
async login(credentials: LoginRequest): Promise<AuthResponse> {
  const { data, error } = await this.supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });
  
  if (error) throw error;
  
  return {
    user: this.mapSupabaseUser(data.user),
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
    expiresIn: data.session.expires_in
  };
}

// Registro de nuevos usuarios
async register(userData: RegisterRequest): Promise<AuthResponse> {
  const { data, error } = await this.supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        first_name: userData.firstName,
        last_name: userData.lastName,
        role: UserRole.Coach
      }
    }
  });
  
  if (error) throw error;
  
  return {
    user: this.mapSupabaseUser(data.user),
    accessToken: data.session?.access_token,
    refreshToken: data.session?.refresh_token,
    expiresIn: data.session?.expires_in
  };
}

// Cierre de sesión
async logout(): Promise<void> {
  await this.supabase.auth.signOut();
}

// Refresco de token
async refreshSession(): Promise<void> {
  const { data, error } = await this.supabase.auth.refreshSession();
  if (error) throw error;
  
  const user = this.mapSupabaseUser(data.user);
  this.updateAuthState(data.session, user);
}
```

#### 3. **Manejo de Sesiones y Eventos**
```typescript
// Escuchar cambios en el estado de autenticación
private setupAuthStateListener(): void {
  this.supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('🔄 Auth state change:', event, session?.user?.email);
    
    if (session && session.user) {
      const user = this.mapSupabaseUser(session.user);
      this.updateAuthState(session, user);
      this.scheduleTokenRefresh();
    } else {
      this.updateAuthState(null, null);
      this.clearTokenRefresh();
      
      if (event === 'SIGNED_OUT') {
        this.clearStoredAuthData();
        await this.router.navigate(['/auth']);
      }
    }
  });
}

// Mapeo de usuario de Supabase a modelo local
private mapSupabaseUser(supabaseUser: SupabaseUser): User {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    firstName: supabaseUser.user_metadata?.['first_name'] || '',
    lastName: supabaseUser.user_metadata?.['last_name'] || '',
    supabaseId: supabaseUser.id,
    role: (supabaseUser.user_metadata?.['role'] as UserRole) || UserRole.Coach,
    organizationId: supabaseUser.user_metadata?.['organization_id'],
    createdAt: new Date(supabaseUser.created_at),
    updatedAt: new Date()
  };
}
```

#### 4. **Operaciones de Base de Datos**
```typescript
@Injectable({
  providedIn: 'root'
})
export class SupabaseDataService {
  private readonly supabase = inject(SupabaseClient);
  
  // Operaciones CRUD genéricas
  async create<T>(table: string, data: any): Promise<T> {
    const { data: result, error } = await this.supabase
      .from(table)
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }
  
  async findById<T>(table: string, id: string): Promise<T | null> {
    const { data: result, error } = await this.supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return result;
  }
  
  async findAll<T>(table: string, filters?: Record<string, any>): Promise<T[]> {
    let query = this.supabase.from(table).select('*');
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    
    const { data: result, error } = await query;
    if (error) throw error;
    return result;
  }
  
  async update<T>(table: string, id: string, data: any): Promise<T> {
    const { data: result, error } = await this.supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }
  
  async delete(table: string, id: string): Promise<void> {
    const { error } = await this.supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}
```

### Sistema de Iconos con NG Icons
La aplicación utiliza NG Icons para un sistema de iconos consistente y eficiente:

#### 1. **Configuración de Iconos**
```typescript
// app.config.ts
import { provideIcons } from '@ng-icons/core';
import { 
  heroHome,
  heroUsers,
  heroCog6Tooth,
  heroArrowRightOnRectangle,
  heroUser,
  heroBars3,
  heroXMark,
  heroCheckCircle,
  heroExclamationTriangle,
  heroInformationCircle
} from '@ng-icons/heroicons/outline';

import {
  heroCheckCircleSolid,
  heroExclamationTriangleSolid,
  heroInformationCircleSolid
} from '@ng-icons/heroicons/solid';

export const appConfig: ApplicationConfig = {
  providers: [
    provideIcons({
      // Iconos outline
      heroHome,
      heroUsers,
      heroCog6Tooth,
      heroArrowRightOnRectangle,
      heroUser,
      heroBars3,
      heroXMark,
      heroCheckCircle,
      heroExclamationTriangle,
      heroInformationCircle,
      
      // Iconos solid
      heroCheckCircleSolid,
      heroExclamationTriangleSolid,
      heroInformationCircleSolid
    })
  ]
};
```

#### 2. **Uso de Iconos en Componentes**
```typescript
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIconsModule],
  template: `
    <nav class="navbar">
      <div class="navbar-brand">
        <ng-icon name="heroHome" size="24" class="text-primary-green-500"></ng-icon>
        <span>SportPlanner</span>
      </div>
      
      <div class="navbar-menu">
        <a routerLink="/dashboard" class="nav-item">
          <ng-icon name="heroHome" size="20"></ng-icon>
          <span>Dashboard</span>
        </a>
        
        <a routerLink="/teams" class="nav-item">
          <ng-icon name="heroUsers" size="20"></ng-icon>
          <span>Equipos</span>
        </a>
        
        <button (click)="logout()" class="nav-item logout">
          <ng-icon name="heroArrowRightOnRectangle" size="20"></ng-icon>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </nav>
  `
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  
  async logout(): Promise<void> {
    await this.authService.logout();
  }
}
```

#### 3. **Iconos en Notificaciones**
```typescript
@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [NgIconsModule],
  template: `
    <div class="notification-container">
      @for (notification of notificationService.notifications(); track notification.id) {
        <div class="notification-item" [class]="getNotificationClasses(notification.type)">
          <div class="notification-content">
            <div class="notification-icon">
              <ng-icon 
                [name]="getIconName(notification.type)"
                [class]="getIconClasses(notification.type)"
                size="20"
              />
            </div>
            <div class="notification-message">
              {{ notification.message }}
            </div>
            <button (click)="dismissNotification(notification.id)" class="notification-dismiss">
              <ng-icon name="heroXMark" size="16"></ng-icon>
            </button>
          </div>
        </div>
      }
    </div>
  `
})
export class NotificationComponent {
  protected readonly notificationService = inject(NotificationService);
  
  protected getIconName(type: NotificationType): string {
    const iconMap = {
      success: 'heroCheckCircle',
      error: 'heroXMark',
      warning: 'heroExclamationTriangle',
      info: 'heroInformationCircle'
    };
    return iconMap[type];
  }
  
  protected getIconClasses(type: NotificationType): string {
    const classMap = {
      success: 'text-primary-green-600',
      error: 'text-red-600',
      warning: 'text-amber-600',
      info: 'text-blue-600'
    };
    return classMap[type];
  }
}
```

### Configuración de HTTP Client
La aplicación utiliza el HTTP Client de Angular con configuración avanzada:

#### 1. **Configuración Base**
```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withFetch(), // Usar fetch API en lugar de XMLHttpRequest
      withInterceptors([debugInterceptor, authInterceptor, authErrorInterceptor])
    )
  ]
};
```

#### 2. **Base Service para API**
```typescript
@Injectable({
  providedIn: 'root'
})
export abstract class BaseApiService {
  protected readonly http = inject(HttpClient);
  protected readonly authService = inject(AuthService);
  protected readonly notificationService = inject(NotificationService);
  
  protected get apiUrl(): string {
    return environment.apiUrl;
  }
  
  protected getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }
  
  protected handleError(error: HttpErrorResponse): Observable<never> {
    console.error('API Error:', error);
    
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error de red: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 400:
          errorMessage = 'Solicitud incorrecta';
          break;
        case 401:
          errorMessage = 'No autorizado';
          break;
        case 403:
          errorMessage = 'Acceso prohibido';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado';
          break;
        case 500:
          errorMessage = 'Error del servidor';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }
    
    this.notificationService.showError(errorMessage);
    return throwError(() => error);
  }
}
```

#### 3. **Servicio de API Específico**
```typescript
@Injectable({
  providedIn: 'root'
})
export class TeamService extends BaseApiService {
  private readonly endpoint = `${this.apiUrl}/api/teams`;
  
  getTeams(filters?: TeamFilters): Observable<Team[]> {
    const params = new HttpParams({ fromObject: filters as any });
    return this.http.get<Team[]>(this.endpoint, { 
      params,
      headers: this.getHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }
  
  getTeamById(id: string): Observable<Team> {
    return this.http.get<Team>(`${this.endpoint}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }
  
  createTeam(team: CreateTeamRequest): Observable<Team> {
    return this.http.post<Team>(this.endpoint, team, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }
  
  updateTeam(id: string, team: UpdateTeamRequest): Observable<Team> {
    return this.http.put<Team>(`${this.endpoint}/${id}`, team, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }
  
  deleteTeam(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => this.handleError(error))
    );
  }
}
```

### Manejo de Errores Global
La aplicación implementa un sistema robusto de manejo de errores:

#### 1. **Global Error Handler**
```typescript
@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {
  private readonly notificationService = inject(NotificationService);
  
  handleError(error: Error): void {
    console.error('Global Error Handler:', error);
    
    // Errores de autenticación
    if (error.message.includes('auth') || error.message.includes('token')) {
      this.notificationService.showError('Error de autenticación. Por favor, inicia sesión nuevamente.');
      return;
    }
    
    // Errores de red
    if (error.message.includes('network') || error.message.includes('fetch')) {
      this.notificationService.showError('Error de conexión. Verifica tu internet.');
      return;
    }
    
    // Errores genéricos
    this.notificationService.showError('Ha ocurrido un error inesperado.');
  }
}

// Configuración en app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
};
```

#### 2. **HTTP Error Interceptor**
```typescript
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Error desconocido';
      
      switch (error.status) {
        case 0:
          errorMessage = 'Error de conexión. Verifica tu internet.';
          break;
        case 400:
          errorMessage = 'Solicitud incorrecta. Verifica los datos.';
          break;
        case 401:
          errorMessage = 'No autorizado. Inicia sesión nuevamente.';
          break;
        case 403:
          errorMessage = 'Acceso prohibido. No tienes permisos.';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado.';
          break;
        case 422:
          errorMessage = 'Datos inválidos. Verifica la información.';
          break;
        case 429:
          errorMessage = 'Demasiadas solicitudes. Intenta más tarde.';
          break;
        case 500:
          errorMessage = 'Error del servidor. Intenta más tarde.';
          break;
        case 503:
          errorMessage = 'Servicio no disponible. Intenta más tarde.';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
      }
      
      notificationService.showError(errorMessage);
      return throwError(() => error);
    })
  );
};
```

#### 3. **Retry Logic para Peticiones**
```typescript
export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  const maxRetries = 3;
  const retryDelay = 1000;
  
  return next(req).pipe(
    retry({
      count: maxRetries,
      delay: (error, retryCount) => {
        // Solo reintentar para errores de red o 5xx
        if (error.status === 0 || (error.status >= 500 && error.status < 600)) {
          const delay = retryDelay * Math.pow(2, retryCount - 1); // Exponential backoff
          return timer(delay);
        }
        return throwError(() => error);
      }
    })
  );
};
```

---

## 13. Buenas Prácticas y Patrones

### Código Limpio y Mantenible
SportPlanner sigue las mejores prácticas de desarrollo de software para asegurar un código limpio y mantenible:

#### 1. **Principios SOLID**
La aplicación aplica los principios SOLID en su diseño:

##### **S - Single Responsibility Principle**
```typescript
// INCORRECTO: Una clase con múltiples responsabilidades
class BadUserService {
  authenticateUser(credentials: LoginRequest): Promise<AuthResponse> {
    // Lógica de autenticación
  }
  
  saveUserToDatabase(user: User): Promise<void> {
    // Lógica de base de datos
  }
  
  sendWelcomeEmail(user: User): Promise<void> {
    // Lógica de email
  }
  
  logUserActivity(user: User, activity: string): Promise<void> {
    // Lógica de logging
  }
}

// CORRECTO: Cada clase tiene una única responsabilidad
class AuthService {
  authenticateUser(credentials: LoginRequest): Promise<AuthResponse> {
    // Solo lógica de autenticación
  }
}

class UserRepository {
  saveUserToDatabase(user: User): Promise<void> {
    // Solo lógica de base de datos
  }
}

class EmailService {
  sendWelcomeEmail(user: User): Promise<void> {
    // Solo lógica de email
  }
}

class ActivityLogger {
  logUserActivity(user: User, activity: string): Promise<void> {
    // Solo lógica de logging
  }
}
```

##### **O - Open/Closed Principle**
```typescript
// INCORRECTO: Modificar la clase existente para añadir nueva funcionalidad
class NotificationSender {
  sendNotification(type: string, message: string): void {
    if (type === 'email') {
      this.sendEmail(message);
    } else if (type === 'sms') {
      this.sendSms(message);
    }
    // Tendríamos que modificar esta clase para añadir nuevos tipos
  }
}

// CORRECTO: Abierto a extensión, cerrado a modificación
interface NotificationChannel {
  send(message: string): void;
}

class EmailNotification implements NotificationChannel {
  send(message: string): void {
    // Lógica de email
  }
}

class SmsNotification implements NotificationChannel {
  send(message: string): void {
    // Lógica de SMS
  }
}

class PushNotification implements NotificationChannel {
  send(message: string): void {
    // Lógica de push notification
  }
}

class NotificationSender {
  private channels: Map<string, NotificationChannel> = new Map();
  
  addChannel(type: string, channel: NotificationChannel): void {
    this.channels.set(type, channel);
  }
  
  sendNotification(type: string, message: string): void {
    const channel = this.channels.get(type);
    if (channel) {
      channel.send(message);
    }
  }
}
```

##### **L - Liskov Substitution Principle**
```typescript
// INCORRECTO: La subclase no puede sustituir a la superclase
class Bird {
  fly(): void {
    console.log('Flying');
  }
}

class Penguin extends Bird {
  fly(): void {
    throw new Error('Penguins cannot fly');
  }
}

// CORRECTO: Las subclases pueden sustituir a las superclases
abstract class Bird {
  abstract move(): void;
}

class FlyingBird extends Bird {
  move(): void {
    this.fly();
  }
  
  private fly(): void {
    console.log('Flying');
  }
}

class SwimmingBird extends Bird {
  move(): void {
    this.swim();
  }
  
  private swim(): void {
    console.log('Swimming');
  }
}
```

##### **I - Interface Segregation Principle**
```typescript
// INCORRECTO: Interfaces grandes con métodos no utilizados
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
  code(): void;
  design(): void;
}

class Developer implements Worker {
  work(): void { /* ... */ }
  eat(): void { /* ... */ }
  sleep(): void { /* ... */ }
  code(): void { /* ... */ }
  design(): void { /* ... */ } // No necesita diseñar
}

// CORRECTO: Interfaces específicas y pequeñas
interface BasicNeeds {
  eat(): void;
  sleep(): void;
}

interface Workable {
  work(): void;
}

interface Codeable {
  code(): void;
}

interface Designable {
  design(): void;
}

class Developer implements BasicNeeds, Workable, Codeable {
  eat(): void { /* ... */ }
  sleep(): void { /* ... */ }
  work(): void { /* ... */ }
  code(): void { /* ... */ }
}
```

##### **D - Dependency Inversion Principle**
```typescript
// INCORRECTO: Dependencia de implementaciones concretas
class LightBulb {
  turnOn(): void {
    console.log('Light bulb on');
  }
  
  turnOff(): void {
    console.log('Light bulb off');
  }
}

class Switch {
  private bulb: LightBulb;
  
  constructor() {
    this.bulb = new LightBulb(); // Dependencia concreta
  }
  
  toggle(): void {
    // Lógica para encender/apagar
  }
}

// CORRECTO: Dependencia de abstracciones
interface SwitchableDevice {
  turnOn(): void;
  turnOff(): void;
}

class LightBulb implements SwitchableDevice {
  turnOn(): void {
    console.log('Light bulb on');
  }
  
  turnOff(): void {
    console.log('Light bulb off');
  }
}

class Fan implements SwitchableDevice {
  turnOn(): void {
    console.log('Fan on');
  }
  
  turnOff(): void {
    console.log('Fan off');
  }
}

class Switch {
  private device: SwitchableDevice;
  
  constructor(device: SwitchableDevice) {
    this.device = device; // Dependencia de abstracción
  }
  
  toggle(): void {
    // Lógica para encender/apagar
  }
}
```

#### 2. **Clean Code Practices**
La aplicación sigue prácticas de código limpio:

##### **Nombres Significativos**
```typescript
// INCORRECTO: Nombres poco descriptivos
function d(u: User, t: Team): boolean {
  return u.teams.some(x => x.id === t.id);
}

// CORRECTO: Nombres descriptivos
function doesUserBelongToTeam(user: User, team: Team): boolean {
  return user.teams.some(userTeam => userTeam.id === team.id);
}
```

##### **Funciones Pequeñas y Enfocadas**
```typescript
// INCORRECTO: Función grande con múltiples responsabilidades
function processUserRegistration(userData: any): Promise<User> {
  // Validar datos
  if (!userData.email || !userData.password) {
    throw new Error('Email and password are required');
  }
  
  // Hashear contraseña
  const hashedPassword = bcrypt.hash(userData.password, 10);
  
  // Crear usuario en base de datos
  const user = await User.create({
    email: userData.email,
    password: hashedPassword,
    name: userData.name
  });
  
  // Enviar email de bienvenida
  await emailService.sendWelcomeEmail(user.email);
  
  // Loggear actividad
  await activityLogger.log('USER_REGISTERED', user.id);
  
  return user;
}

// CORRECTO: Funciones pequeñas y enfocadas
function validateUserData(userData: any): void {
  if (!userData.email || !userData.password) {
    throw new Error('Email and password are required');
  }
  
  if (!isValidEmail(userData.email)) {
    throw new Error('Invalid email format');
  }
  
  if (userData.password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }
}

function hashPassword(password: string): string {
  return bcrypt.hash(password, 10);
}

async function createUserInDatabase(userData: any): Promise<User> {
  const hashedPassword = hashPassword(userData.password);
  return await User.create({
    email: userData.email,
    password: hashedPassword,
    name: userData.name
  });
}

async function sendWelcomeEmail(email: string): Promise<void> {
  await emailService.sendWelcomeEmail(email);
}

async function logUserActivity(userId: string, activity: string): Promise<void> {
  await activityLogger.log(activity, userId);
}

async function processUserRegistration(userData: any): Promise<User> {
  validateUserData(userData);
  const user = await createUserInDatabase(userData);
  await sendWelcomeEmail(user.email);
  await logUserActivity(user.id, 'USER_REGISTERED');
  return user;
}
```

##### **Comentarios Significativos**
```typescript
// INCORRECTO: Comentarios obvios
// Incrementa el contador
counter++;

// CORRECTO: Comentarios que explican el porqué
// Incrementamos el contador para trackear el número de intentos de login
// ya que necesitamos bloquear la cuenta después de 5 intentos fallidos
counter++;
```

### Tipado Fuerte con TypeScript
La aplicación utiliza TypeScript para proporcionar tipado fuerte y seguridad en tiempo de compilación:

#### 1. **Interfaces y Tipos Estrictos**
```typescript
// Tipos estrictos para modelos de datos
export interface User {
  readonly id: string; // readonly para propiedades inmutables
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId?: string; // opcional
  createdAt: Date;
  updatedAt: Date;
}

// Enum para valores fijos
export enum UserRole {
  Administrator = 0,
  Director = 1,
  Coach = 2,
  Assistant = 3
}

// Tipos para DTOs
export interface CreateTeamRequest {
  name: string;
  sport: string;
  category: string;
  gender: Gender;
  level: TeamLevel;
  description: string;
}

export interface UpdateTeamRequest extends Partial<CreateTeamRequest> {
  // Partial para actualizaciones parciales
}

// Tipos para respuestas de API
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

// Tipos para paginación
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

#### 2. **Tipos Genéricos Reutilizables**
```typescript
// Servicio base genérico
export abstract class BaseService<T, CreateDTO, UpdateDTO = Partial<CreateDTO>> {
  protected readonly http = inject(HttpClient);
  protected readonly endpoint: string;
  
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }
  
  getAll(filters?: Record<string, any>): Observable<T[]> {
    const params = filters ? new HttpParams({ fromObject: filters }) : undefined;
    return this.http.get<T[]>(this.endpoint, { params });
  }
  
  getById(id: string): Observable<T> {
    return this.http.get<T>(`${this.endpoint}/${id}`);
  }
  
  create(data: CreateDTO): Observable<T> {
    return this.http.post<T>(this.endpoint, data);
  }
  
  update(id: string, data: UpdateDTO): Observable<T> {
    return this.http.put<T>(`${this.endpoint}/${id}`, data);
  }
  
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}

// Implementación específica
export class TeamService extends BaseService<Team, CreateTeamRequest, UpdateTeamRequest> {
  constructor() {
    super('/api/teams');
  }
  
  // Métodos específicos para equipos
  getTeamsByCoach(coachId: string): Observable<Team[]> {
    return this.getAll({ coachId });
  }
  
  addMemberToTeam(teamId: string, userId: string): Observable<Team> {
    return this.http.post<T>(`${this.endpoint}/${teamId}/members`, { userId });
  }
}
```

#### 3. **Tipos Avanzados**
```typescript
// Tipos condicionales
type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Tipos de utilidad
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Ejemplo de uso
type TeamUpdate = Optional<UpdateTeamRequest, 'description'>;

// Tipos para manejo de errores
type ApiError = {
  code: string;
  message: string;
  details?: Record<string, string[]>;
};

type Result<T, E = ApiError> = 
  | { success: true; data: T }
  | { success: false; error: E };

// Función que retorna Result
async function safeApiCall<T>(promise: Promise<T>): Promise<Result<T>> {
  try {
    const data = await promise;
    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: {
        code: 'API_ERROR',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
    };
  }
}
```

### Manejo de Errores Asíncronos
La aplicación implementa un manejo robusto de errores asíncronos:

#### 1. **Manejo de Errores con async/await**
```typescript
// INCORRECTO: Manejo de errores inadecuado
async function getUserTeams(userId: string): Promise<Team[]> {
  const user = await User.findById(userId); // Puede lanzar error
  return user.teams; // Puede ser undefined
}

// CORRECTO: Manejo de errores adecuado
async function getUserTeams(userId: string): Promise<Team[]> {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    if (!user.teams || user.teams.length === 0) {
      return [];
    }
    
    return user.teams;
  } catch (error) {
    console.error('Error getting user teams:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        throw new Error(`User with ID ${userId} not found`);
      }
    }
    
    throw new Error('Failed to get user teams');
  }
}
```

#### 2. **Manejo de Errores con Observables**
```typescript
// CORRECTO: Manejo de errores con RxJS
@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/teams';
  
  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.endpoint).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching teams:', error);
        
        let errorMessage = 'Failed to fetch teams';
        
        if (error.status === 401) {
          errorMessage = 'Unauthorized. Please login again.';
        } else if (error.status === 403) {
          errorMessage = 'You do not have permission to view teams.';
        } else if (error.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }
  
  createTeam(team: CreateTeamRequest): Observable<Team> {
    return this.http.post<Team>(this.endpoint, team).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error creating team:', error);
        
        if (error.status === 400) {
          const validationErrors = error.error?.errors || [];
          const errorMessage = validationErrors.join(', ') || 'Invalid team data';
          return throwError(() => new Error(errorMessage));
        }
        
        return throwError(() => new Error('Failed to create team'));
      })
    );
  }
}
```

#### 3. **Retry Logic con Backoff Exponencial**
```typescript
// CORRECTO: Retry con backoff exponencial
function retryWithBackoff<T>(
  maxRetries: number = 3,
  initialDelay: number = 1000
): MonoTypeOperatorFunction<T> {
  return (source: Observable<T>) => 
    source.pipe(
      retry({
        count: maxRetries,
        delay: (error, retryCount) => {
          // Solo reintentar para errores recuperables
          if (isRecoverableError(error)) {
            const delay = initialDelay * Math.pow(2, retryCount - 1);
            console.log(`Retry ${retryCount}/${maxRetries} after ${delay}ms`);
            return timer(delay);
          }
          return throwError(() => error);
        }
      })
    );
}

function isRecoverableError(error: any): boolean {
  // Reintentar para errores de red o errores 5xx
  return error.status === 0 || (error.status >= 500 && error.status < 600);
}

// Uso en servicios
getTeams(): Observable<Team[]> {
  return this.http.get<Team[]>(this.endpoint).pipe(
    retryWithBackoff(3, 1000),
    catchError(error => {
      return throwError(() => new Error('Failed to fetch teams after retries'));
    })
  );
}
```

### Optimización de Performance
La aplicación implementa varias técnicas de optimización:

#### 1. **Change Detection Optimizado**
```typescript
// CORRECTO: Usar OnPush para componentes
@Component({
  selector: 'app-team-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="team-card">
      <h3>{{ team.name }}</h3>
      <p>{{ team.sport }}</p>
    </div>
  `
})
export class TeamCardComponent {
  @Input() team: Team;
}

// CORRECTO: Usar signals para estado reactivo
@Injectable({
  providedIn: 'root'
})
export class TeamStore {
  private readonly _teams = signal<Team[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  
  public readonly teams = computed(() => this._teams());
  public readonly loading = computed(() => this._loading());
  public readonly error = computed(() => this._error());
  
  async loadTeams(): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    
    try {
      const teams = await this.teamService.getTeams();
      this._teams.set(teams);
    } catch (error) {
      this._error.set(error instanceof Error ? error.message : 'Failed to load teams');
    } finally {
      this._loading.set(false);
    }
  }
}
```

#### 2. **Lazy Loading de Módulos**
```typescript
// CORRECTO: Lazy loading de rutas
export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'teams',
        loadComponent: () => import('./dashboard/pages/teams/teams.component').then(m => m.TeamsComponent)
      },
      {
        path: 'objectives',
        loadComponent: () => import('./dashboard/pages/objectives/objectives.component').then(m => m.ObjectivesComponent)
      },
      {
        path: 'exercises',
        loadComponent: () => import('./dashboard/pages/exercises/exercises.component').then(m => m.ExercisesComponent)
      },
      {
        path: 'plannings',
        loadComponent: () => import('./dashboard/pages/plannings/plannings').then(m => m.Plannings)
      }
    ]
  }
];
```

#### 3. **Memoización y Caching**
```typescript
// CORRECTO: Memoización de funciones costosas
function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

// Uso para funciones costosas
const expensiveCalculation = memoize((n: number): number => {
  console.log('Performing expensive calculation...');
  return n * n; // Simulación de cálculo costoso
});

// CORRECTO: Caching de respuestas HTTP
@Injectable({
  providedIn: 'root'
})
export class CachedTeamService {
  private readonly cache = new Map<string, { data: Team; timestamp: number }>();
  private readonly cacheDuration = 5 * 60 * 1000; // 5 minutos
  
  constructor(private readonly http: HttpClient) {}
  
  getTeam(id: string): Observable<Team> {
    const cached = this.cache.get(id);
    const now = Date.now();
    
    if (cached && (now - cached.timestamp) < this.cacheDuration) {
      return of(cached.data);
    }
    
    return this.http.get<Team>(`/api/teams/${id}`).pipe(
      tap(team => {
        this.cache.set(id, { data: team, timestamp: now });
      })
    );
  }
  
  clearCache(): void {
    this.cache.clear();
  }
}
```

### Accesibilidad y SEO
La aplicación implementa buenas prácticas de accesibilidad y SEO:

#### 1. **Accesibilidad (A11y)**
```typescript
// CORRECTO: Componentes accesibles
@Component({
  selector: 'app-accessible-button',
  template: `
    <button
      [attr.aria-label]="ariaLabel"
      [attr.aria-describedby]="ariaDescribedBy"
      [disabled]="disabled"
      (click)="onClick()"
      class="accessible-button"
    >
      <ng-content></ng-content>
    </button>
  `
})
export class AccessibleButtonComponent {
  @Input() ariaLabel?: string;
  @Input() ariaDescribedBy?: string;
  @Input() disabled = false;
  @Output() click = new EventEmitter<void>();
  
  onClick(): void {
    if (!this.disabled) {
      this.click.emit();
    }
  }
}

// CORRECTO: Manejo de focus
@Component({
  selector: 'app-modal',
  template: `
    <div class="modal-overlay" (click)="onOverlayClick()">
      <div class="modal-content" role="dialog" aria-modal="true" [attr.aria-labelledby]="titleId">
        <h2 [id]="titleId">{{ title }}</h2>
        <div class="modal-body">
          <ng-content></ng-content>
        </div>
        <button (click)="close()" aria-label="Close modal">Close</button>
      </div>
    </div>
  `
})
export class ModalComponent implements AfterViewInit {
  @Input() title = '';
  @Output() close = new EventEmitter<void>();
  
  private titleId = `modal-title-${Math.random().toString(36).substr(2, 9)}`;
  private focusableElements: HTMLElement[] = [];
  
  @ViewChild('modalContent') modalContent!: ElementRef;
  
  ngAfterViewInit(): void {
    this.trapFocus();
  }
  
  private trapFocus(): void {
    this.focusableElements = this.modalContent.nativeElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (this.focusableElements.length > 0) {
      this.focusableElements[0].focus();
    }
  }
  
  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.close.emit();
    }
    
    if (event.key === 'Tab') {
      const firstElement = this.focusableElements[0];
      const lastElement = this.focusableElements[this.focusableElements.length - 1];
      
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }
}
```

#### 2. **SEO Optimización**
```typescript
// CORRECTO: Meta tags dinámicos
@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  
  setTitle(title: string): void {
    this.title.setTitle(`${title} | SportPlanner`);
  }
  
  setMetaTags(config: {
    description?: string;
    keywords?: string;
    author?: string;
    ogImage?: string;
    ogUrl?: string;
  }): void {
    const updates: MetaDefinition[] = [];
    
    if (config.description) {
      updates.push({ name: 'description', content: config.description });
      updates.push({ property: 'og:description', content: config.description });
    }
    
    if (config.keywords) {
      updates.push({ name: 'keywords', content: config.keywords });
    }
    
    if (config.author) {
      updates.push({ name: 'author', content: config.author });
    }
    
    if (config.ogImage) {
      updates.push({ property: 'og:image', content: config.ogImage });
    }
    
    if (config.ogUrl) {
      updates.push({ property: 'og:url', content: config.ogUrl });
    }
    
    this.meta.addTags(updates);
  }
  
  setCanonicalUrl(url: string): void {
    this.meta.updateTag({ rel: 'canonical', href: url });
  }
}

// Uso en componentes
@Component({
  selector: 'app-team-detail',
  template: `
    <div *ngIf="team">
      <h1>{{ team.name }}</h1>
      <!-- Contenido del equipo -->
    </div>
  `
})
export class TeamDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seoService = inject(SeoService);
  private readonly teamService = inject(TeamService);
  
  team: Team | null = null;
  
  ngOnInit(): void {
    const teamId = this.route.snapshot.paramMap.get('id');
    
    if (teamId) {
      this.teamService.getTeamById(teamId).subscribe(team => {
        this.team = team;
        this.updateSeo(team);
      });
    }
  }
  
  private updateSeo(team: Team): void {
    this.seoService.setTitle(team.name);
    this.seoService.setMetaTags({
      description: `Información del equipo ${team.name} de ${team.sport}. Categoría: ${team.category}`,
      keywords: `${team.name}, ${team.sport}, ${team.category}, equipo deportivo`,
      ogImage: team.imageUrl,
      ogUrl: `https://sportplanner.com/teams/${team.id}`
    });
    
    this.seoService.setCanonicalUrl(`https://sportplanner.com/teams/${team.id}`);
  }
}
```

#### 3. **Structured Data**
```typescript
// CORRECTO: Datos estructurados para SEO
@Injectable({
  providedIn: 'root'
})
export class StructuredDataService {
  private readonly meta = inject(Meta);
  
  addOrganizationSchema(): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'SportPlanner',
      'url': 'https://sportplanner.com',
      'logo': 'https://sportplanner.com/logo.png',
      'description': 'Plataforma de gestión deportiva para equipos y entrenadores'
    };
    
    this.meta.addTag({
      name: 'structured-data',
      content: JSON.stringify(schema)
    });
  }
  
  addTeamSchema(team: Team): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'SportsTeam',
      'name': team.name,
      'sport': team.sport,
      'description': team.description,
      'url': `https://sportplanner.com/teams/${team.id}`
    };
    
    this.meta.addTag({
      name: 'structured-data',
      content: JSON.stringify(schema)
    });
  }
}
```

---

## 14. Despliegue y Producción

### Configuración de Build
La aplicación utiliza Angular CLI con configuración optimizada para producción:

#### 1. **Configuración de Producción en angular.json**
```json
{
  "projects": {
    "SportPlanner": {
      "architect": {
        "build": {
          "builder": "@angular/build:application",
          "options": {
            "browser": "src/main.ts",
            "polyfills": ["zone.js"],
            "tsConfig": "tsconfig.app.json",
            "assets": ["src/favicon.ico", "src/assets"],
            "styles": ["src/styles.css"],
            "server": "src/main.server.ts",
            "outputMode": "static"
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "600kB",
                  "maximumError": "1MB"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "6kB",
                  "maximumError": "10kB"
                }
              ],
              "outputHashing": "all",
              "optimization": {
                "styles": {
                  "minify": true,
                  "inlineCritical": false
                },
                "scripts": {
                  "minify": true
                }
              },
              "sourceMap": false,
              "namedChunks": false,
              "extractLicenses": false,
              "allowedCommonJsDependencies": [
                "whatwg-url",
                "@supabase/node-fetch"
              ]
            },
            "development": {
              "optimization": false,
              "extractLicenses": false,
              "sourceMap": true,
              "allowedCommonJsDependencies": [
                "whatwg-url",
                "@supabase/node-fetch"
              ]
            }
          },
          "defaultConfiguration": "production"
        }
      }
    }
  }
}
```

#### 2. **Scripts de Build y Despliegue**
```json
{
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "build:prod": "ng build --configuration production",
    "build:ssr": "ng build --configuration production && ng run SportPlanner:server:production",
    "serve:ssr": "node dist/SportPlanner/server/server.mjs",
    "preview": "ng build --configuration production && http-server dist/SportPlanner/browser",
    "analyze": "ng build --configuration production --stats-json && webpack-bundle-analyzer dist/SportPlanner/browser/stats.json",
    "lint": "ng lint",
    "test": "ng test",
    "test:ci": "ng test --watch=false --browsers=ChromeHeadless",
    "e2e": "ng e2e",
    "e2e:ci": "ng e2e --configuration=ci"
  }
}
```

### Server Side Rendering (SSR)
La aplicación implementa SSR para mejor SEO y rendimiento:

#### 1. **Configuración de SSR**
```typescript
// src/main.server.ts
import { bootstrapApplication } from '@angular/platform-server';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;
```

#### 2. **Configuración del Servidor**
```typescript
// src/server.ts
import { AngularAppEngine, createRequestHandler } from '@angular/ssr';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularAppEngine();

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
  }),
);

app.use('/**', (req, res, next) => {
  const protocol = req.protocol + '://';
  const host = req.get('host');
  const originalUrl = protocol + host + req.originalUrl;
  
  angularApp
    .render(req.originalUrl, {
      req,
      res,
      documentFilePath: join(browserDistFolder, 'index.html'),
    })
    .then((html) => res.send(html))
    .catch((err) => next(err));
});

app.listen(4000, () => {
  console.log(`Node Express server listening on http://localhost:4000`);
});
```

#### 3. **Configuración de Entorno para SSR**
```typescript
// src/app/app.config.server.ts
import { ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideRouter(routes),
    provideClientHydration()
  ]
};
```

### Optimización de Assets
La aplicación incluye optimización de assets para mejor rendimiento:

#### 1. **Optimización de Imágenes**
```typescript
// Servicio de optimización de imágenes
@Injectable({
  providedIn: 'root'
})
export class ImageOptimizationService {
  private readonly cdnUrl = 'https://cdn.sportplanner.com';
  
  getOptimizedImageUrl(
    originalUrl: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'webp' | 'jpg' | 'png';
    } = {}
  ): string {
    const { width = 800, height = 600, quality = 80, format = 'webp' } = options;
    
    // Si ya es una URL optimizada, devolverla
    if (originalUrl.includes(this.cdnUrl)) {
      return originalUrl;
    }
    
    // Construir URL optimizada
    const imageUrl = new URL(this.cdnUrl + '/images/optimize');
    imageUrl.searchParams.set('url', encodeURIComponent(originalUrl));
    imageUrl.searchParams.set('w', width.toString());
    imageUrl.searchParams.set('h', height.toString());
    imageUrl.searchParams.set('q', quality.toString());
    imageUrl.searchParams.set('f', format);
    
    return imageUrl.toString();
  }
  
  // Componente de imagen optimizada
  @Component({
    selector: 'app-optimized-image',
    template: `
      <picture>
        <source [srcset]="webpUrl" type="image/webp">
        <img 
          [src]="optimizedUrl" 
          [alt]="alt" 
          [width]="width" 
          [height]="height"
          [ngClass]="className"
          loading="lazy"
        >
      </picture>
    `
  })
  export class OptimizedImageComponent {
    @Input() src!: string;
    @Input() alt = '';
    @Input() width = 800;
    @Input() height = 600;
    @Input() quality = 80;
    @Input() className = '';
    
    constructor(private readonly imageService: ImageOptimizationService) {}
    
    get optimizedUrl(): string {
      return this.imageService.getOptimizedImageUrl(this.src, {
        width: this.width,
        height: this.height,
        quality: this.quality,
        format: 'jpg'
      });
    }
    
    get webpUrl(): string {
      return this.imageService.getOptimizedImageUrl(this.src, {
        width: this.width,
        height: this.height,
        quality: this.quality,
        format: 'webp'
      });
    }
  }
}
```

#### 2. **Lazy Loading de Imágenes**
```typescript
// Directiva para lazy loading de imágenes
@Directive({
  selector: '[appLazyLoad]'
})
export class LazyLoadDirective implements OnInit, OnDestroy {
  @Input() appLazyLoad!: string;
  @Input() placeholder: string = '';
  
  private readonly elementRef = inject(ElementRef);
  private readonly observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage();
          this.observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  
  ngOnInit(): void {
    if (this.placeholder) {
      this.elementRef.nativeElement.setAttribute('src', this.placeholder);
    }
    
    this.observer.observe(this.elementRef.nativeElement);
  }
  
  ngOnDestroy(): void {
    this.observer.disconnect();
  }
  
  private loadImage(): void {
    const img = new Image();
    img.onload = () => {
      this.elementRef.nativeElement.setAttribute('src', this.appLazyLoad);
      this.elementRef.nativeElement.classList.add('loaded');
    };
    img.onerror = () => {
      console.error('Failed to load image:', this.appLazyLoad);
    };
    img.src = this.appLazyLoad;
  }
}
```

#### 3. **Optimización de Fonts**
```css
/* Optimización de fuentes */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Font display strategy */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/inter-regular.woff2') format('woff2');
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/inter-semibold.woff2') format('woff2');
}

/* Preload critical fonts */
<link rel="preload" href="/fonts/inter-regular.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/inter-semibold.woff2" as="font" type="font/woff2" crossorigin>
```

### Variables de Entorno
La aplicación utiliza variables de entorno para diferentes configuraciones:

#### 1. **Archivos de Entorno**
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  supabaseUrl: 'https://your-project.supabase.co',
  supabaseAnonKey: 'your-anon-key',
  apiUrl: 'https://api-dev.sportplanner.com',
  cdnUrl: 'https://cdn-dev.sportplanner.com',
  analyticsId: 'GA-DEV-123',
  sentryDsn: 'https://dev-sentry-dsn@sentry.io/123',
  debug: true
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  supabaseUrl: 'https://your-project.supabase.co',
  supabaseAnonKey: 'your-prod-anon-key',
  apiUrl: 'https://api.sportplanner.com',
  cdnUrl: 'https://cdn.sportplanner.com',
  analyticsId: 'GA-PROD-456',
  sentryDsn: 'https://prod-sentry-dsn@sentry.io/456',
  debug: false
};
```

#### 2. **Validación de Variables de Entorno**
```typescript
// Servicio de validación de entorno
@Injectable({
  providedIn: 'root'
})
export class EnvironmentValidationService {
  validate(): void {
    const requiredEnvVars = [
      'supabaseUrl',
      'supabaseAnonKey',
      'apiUrl',
      'cdnUrl'
    ];
    
    const missingVars = requiredEnvVars.filter(
      varName => !environment[varName as keyof typeof environment]
    );
    
    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(', ')}`
      );
    }
    
    // Validar formatos
    if (!environment.supabaseUrl.startsWith('https://')) {
      throw new Error('SUPABASE_URL must start with https://');
    }
    
    if (!environment.apiUrl.startsWith('https://')) {
      throw new Error('API_URL must start with https://');
    }
  }
}

// Inicialización en app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (envValidation: EnvironmentValidationService) => {
        return () => envValidation.validate();
      },
      deps: [EnvironmentValidationService],
      multi: true
    }
  ]
};
```

#### 3. **Configuración para Diferentes Entornos**
```typescript
// Servicio de configuración
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private readonly environment = inject(Environment);
  
  get isProduction(): boolean {
    return this.environment.production;
  }
  
  get isDevelopment(): boolean {
    return !this.environment.production;
  }
  
  get apiConfig(): ApiConfig {
    return {
      baseUrl: this.environment.apiUrl,
      timeout: this.isProduction ? 10000 : 30000,
      retryAttempts: this.isProduction ? 3 : 5
    };
  }
  
  get analyticsConfig(): AnalyticsConfig {
    return {
      enabled: this.environment.production,
      id: this.environment.analyticsId,
      debug: this.environment.debug
    };
  }
  
  get monitoringConfig(): MonitoringConfig {
    return {
      enabled: this.environment.production,
      dsn: this.environment.sentryDsn,
      environment: this.environment.production ? 'production' : 'development'
    };
  }
}
```

### Monitoreo y Logging
La aplicación incluye sistemas de monitoreo y logging:

#### 1. **Integración con Sentry**
```typescript
// Servicio de monitoreo con Sentry
@Injectable({
  providedIn: 'root'
})
export class MonitoringService {
  private readonly configService = inject(ConfigService);
  
  initialize(): void {
    const config = this.configService.monitoringConfig;
    
    if (config.enabled && config.dsn) {
      import('@sentry/angular').then(Sentry => {
        Sentry.init({
          dsn: config.dsn,
          environment: config.environment,
          integrations: [
            new Sentry.BrowserTracing(),
            new Sentry.Replay()
          ],
          tracesSampleRate: 1.0,
          replaysSessionSampleRate: 0.1,
          replaysOnErrorSampleRate: 1.0
        });
      });
    }
  }
  
  captureError(error: Error, context?: any): void {
    if (typeof Sentry !== 'undefined') {
      Sentry.captureException(error, {
        extra: context
      });
    }
    
    console.error('Error captured:', error, context);
  }
  
  captureMessage(message: string, level: Sentry.SeverityLevel = 'info'): void {
    if (typeof Sentry !== 'undefined') {
      Sentry.captureMessage(message, level);
    }
    
    console.log(`[${level.toUpperCase()}] ${message}`);
  }
}
```

#### 2. **Servicio de Logging**
```typescript
// Servicio de logging estructurado
@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  private readonly configService = inject(ConfigService);
  
  private readonly logLevels = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3
  };
  
  private currentLevel = this.configService.isDevelopment ? 
    this.logLevels.debug : this.logLevels.info;
  
  debug(message: string, context?: any): void {
    if (this.currentLevel >= this.logLevels.debug) {
      this.log('debug', message, context);
    }
  }
  
  info(message: string, context?: any): void {
    if (this.currentLevel >= this.logLevels.info) {
      this.log('info', message, context);
    }
  }
  
  warn(message: string, context?: any): void {
    if (this.currentLevel >= this.logLevels.warn) {
      this.log('warn', message, context);
    }
  }
  
  error(message: string, context?: any): void {
    if (this.currentLevel >= this.logLevels.error) {
      this.log('error', message, context);
    }
  }
  
  private log(level: string, message: string, context?: any): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      message,
      context,
      environment: this.configService.isProduction ? 'production' : 'development'
    };
    
    // En desarrollo, log a consola
    if (this.configService.isDevelopment) {
      console.log(`[${level.toUpperCase()}] ${message}`, context);
    }
    
    // En producción, enviar a servicio de logging
    if (this.configService.isProduction) {
      this.sendToLoggingService(logEntry);
    }
  }
  
  private sendToLoggingService(logEntry: any): void {
    // Implementar envío a servicio de logging externo
    // Por ejemplo: ELK, Datadog, CloudWatch, etc.
    fetch('/api/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(logEntry)
    }).catch(error => {
      console.error('Failed to send log to logging service:', error);
    });
  }
}
```

#### 3. **Análisis de Rendimiento**
```typescript
// Servicio de análisis de rendimiento
@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private readonly configService = inject(ConfigService);
  
  measure<T>(name: string, fn: () => T): T {
    if (this.configService.isDevelopment && typeof performance !== 'undefined') {
      const start = performance.now();
      const result = fn();
      const end = performance.now();
      const duration = end - start;
      
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
      
      // Enviar a analytics si está habilitado
      if (this.configService.analyticsConfig.enabled) {
        this.sendTimingMetric(name, duration);
      }
      
      return result;
    }
    
    return fn();
  }
  
  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    if (this.configService.isDevelopment && typeof performance !== 'undefined') {
      const start = performance.now();
      const result = await fn();
      const end = performance.now();
      const duration = end - start;
      
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
      
      if (this.configService.analyticsConfig.enabled) {
        this.sendTimingMetric(name, duration);
      }
      
      return result;
    }
    
    return fn();
  }
  
  private sendTimingMetric(name: string, duration: number): void {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'timing_complete', {
        name: name,
        value: Math.round(duration)
      });
    }
  }
  
  // Decorador para medir métodos
  static measureMethod(name?: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      const originalMethod = descriptor.value;
      const methodName = name || `${target.constructor.name}.${propertyKey}`;
      
      descriptor.value = function (...args: any[]) {
        const performanceService = inject(PerformanceService);
        return performanceService.measure(methodName, () => originalMethod.apply(this, args));
      };
      
      return descriptor;
    };
  }
}

// Uso del decorador
export class TeamService {
  @PerformanceService.measureMethod()
  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>('/api/teams');
  }
  
  @PerformanceService.measureMethod('create-team')
  createTeam(team: CreateTeamRequest): Observable<Team> {
    return this.http.post<Team>('/api/teams', team);
  }
}
```

---

## 15. Conclusiones y Próximos Pasos

### Resumen de la Arquitectura
SportPlanner representa una aplicación web moderna y bien estructurada que implementa las mejores prácticas actuales de desarrollo de software:

#### **Puntos Fuertes del Diseño**

1. **Arquitectura Moderna**: Utilización de Angular 20 con componentes standalone, eliminando la complejidad de NgModule y proporcionando un código más limpio y mantenible.

2. **Gestión de Estado Reactiva**: Implementación de Angular Signals para un manejo de estado eficiente y reactivo, con mejor performance y simplicidad en comparación con soluciones tradicionales.

3. **Sistema de Autenticación Robusto**: Integración con Supabase proporcionando autenticación segura, gestión de sesiones, refresh automático de tokens y compatibilidad con SSR.

4. **Diseño Responsive y Accesible**: Sistema de diseño basado en Tailwind CSS con soporte completo para modo claro/oscuro, diseño responsive y buenas prácticas de accesibilidad.

5. **Optimización de Performance**: Implementación de lazy loading, change detection optimizado, memoización y estrategias de caching para garantizar un rendimiento excelente.

6. **Código de Calidad**: Aplicación de principios SOLID, tipado fuerte con TypeScript, manejo robusto de errores y pruebas exhaustivas.

7. **Infraestructura de Despliegue**: Configuración completa para producción con SSR, optimización de assets, monitoreo y logging estructurado.

#### **Tecnologías Clave Utilizadas**

- **Frontend**: Angular 20, TypeScript, Tailwind CSS, RxJS
- **Autenticación**: Supabase Auth
- **Estado**: Angular Signals
- **Estilos**: Tailwind CSS con OKLCH color space
- **Build**: Angular CLI con SSR
- **Monitoreo**: Sentry, Google Analytics
- **Testing**: Jasmine, Karma

### Puntos Fuertes del Diseño

#### 1. **Escalabilidad**
La arquitectura modular con componentes standalone y lazy loading permite que la aplicación crezca de manera sostenible:

```typescript
// Nueva funcionalidad se puede añadir sin afectar el código existente
{
  path: 'new-feature',
  loadComponent: () => import('./features/new-feature/new-feature.component'),
  canActivate: [authGuard]
}
```

#### 2. **Mantenibilidad**
El código sigue principios de diseño limpio y patrones establecidos:

```typescript
// Servicios con responsabilidades claras
@Injectable({
  providedIn: 'root'
})
export class TeamService {
  // Única responsabilidad: gestión de equipos
}

// Componentes con ChangeDetectionStrategy.OnPush
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamCardComponent {
  // Mejor performance y menos re-renders innecesarios
}
```

#### 3. **Performance**
La aplicación implementa múltiples estrategias de optimización:

```typescript
// Lazy loading de componentes
const TeamComponent = loadComponent(() => import('./team.component'));

// Memoización con signals computadas
const filteredTeams = computed(() => 
  teams().filter(team => team.isActive)
);

// Optimización de imágenes
<img [src]="optimizedImageUrl" loading="lazy">
```

#### 4. **Seguridad**
Implementación completa de medidas de seguridad:

```typescript
// Protección de rutas con guards
export const authGuard: CanActivateFn = async (route, state) => {
  // Verificación de autenticación
};

// HTTP interceptors para tokens
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Inyección automática de tokens de autenticación
};
```

#### 5. **Experiencia de Usuario**
La aplicación proporciona una experiencia de usuario excepcional:

```typescript
// Notificaciones en tiempo real
this.notificationService.showSuccess('Operación completada');

// Tema claro/oscuro persistente
this.themeService.toggleTheme();

// Navegación suave con transiciones
<router-outlet></router-outlet>
```

### Posibles Mejoras Futuras

#### 1. **Progressive Web App (PWA)**
Convertir la aplicación en una PWA para mejorar la experiencia móvil:

```typescript
// Configuración de PWA
ng add @angular/pwa

// Service Worker para offline
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/ngsw-worker.js');
}
```

#### 2. **Micro-frontends**
Implementar una arquitectura de micro-frontends para equipos más grandes:

```typescript
// Módulo federado
const remoteModule = await loadRemoteModule({
  remoteEntry: 'https://teams.sportplanner.com/remoteEntry.js',
  remoteName: 'teams',
  exposedModule: './TeamModule'
});
```

#### 3. **Real-time Features**
Añadir características en tiempo real con WebSockets:

```typescript
// Servicio de WebSocket
@Injectable({
  providedIn: 'root'
})
export class RealtimeService {
  private socket: WebSocket;
  
  connect(): void {
    this.socket = new WebSocket('wss://api.sportplanner.com/realtime');
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleRealtimeEvent(data);
    };
  }
}
```

#### 4. **Advanced Analytics**
Implementar análisis más avanzados y seguimiento de usuario:

```typescript
// Servicio de analytics avanzado
@Injectable({
  providedIn: 'root'
})
export class AdvancedAnalyticsService {
  trackUserAction(action: string, properties: any): void {
    // Seguimiento detallado de acciones de usuario
  }
  
  trackPerformance(metric: string, value: number): void {
    // Métricas de rendimiento personalizadas
  }
}
```

#### 5. **Machine Learning Integration**
Integrar características de machine learning para recomendaciones:

```typescript
// Servicio de recomendaciones
@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  async getRecommendedExercises(userId: string): Promise<Exercise[]> {
    // Llamada a API de ML para recomendaciones personalizadas
    return this.mlService.getRecommendations(userId, 'exercises');
  }
}
```

#### 6. **Mobile App**
Desarrollar aplicaciones móviles nativas con Capacitor o React Native:

```typescript
// Integración con Capacitor
import { Capacitor } from '@capacitor/core';

// Acceso a características nativas
const camera = Capacitor.getPlugin('Camera');
const result = await camera.getPhoto({
  quality: 90,
  allowEditing: true,
  resultType: CameraResultType.Uri
});
```

### Recomendaciones

#### 1. **Para el Equipo de Desarrollo**
- **Mantener los Estándares**: Continuar siguiendo las prácticas de código limpio y los patrones establecidos
- **Documentación Continua**: Mantener la documentación actualizada con cada cambio significativo
- **Testing Aumentado**: Aumentar la cobertura de pruebas, especialmente para componentes críticos
- **Code Reviews**: Implementar revisiones de código rigurosas para mantener la calidad

#### 2. **Para la Infraestructura**
- **CI/CD Mejorado**: Implementar pipelines de CI/CD más robustos con pruebas automatizadas
- **Monitoreo Proactivo**: Aumentar la capacidad de monitoreo y alertas tempranas
- **Escalabilidad Automática**: Implementar auto-scaling basado en la carga
- **Backup y Recuperación**: Mejorar las estrategias de backup y recuperación ante desastres

#### 3. **Para el Producto**
- **Feedback de Usuarios**: Implementar sistemas para recopilar y analizar feedback de usuarios
- **A/B Testing**: Realizar pruebas A/B para nuevas características
- **Analytics Avanzado**: Implementar seguimiento más detallado del comportamiento de los usuarios
- **Performance Monitoring**: Monitoreo continuo del rendimiento y optimización proactiva

#### 4. **Para la Seguridad**
- **Auditorías Regulares**: Realizar auditorías de seguridad periódicas
- **Penetration Testing**: Implementar pruebas de penetración regulares
- **Actualizaciones de Seguridad**: Mantener todas las dependencias actualizadas
- **Capacitación**: Proporcionar capacitación continua en seguridad al equipo

### Conclusión Final
SportPlanner representa un excelente ejemplo de aplicación web moderna, bien arquitectada y preparada para el futuro. La combinación de tecnologías actuales, buenas prácticas de desarrollo y una arquitectura escalable proporciona una base sólida para el crecimiento y evolución del producto.

La aplicación no solo cumple con los requisitos funcionales actuales, sino que está preparada para adaptarse a futuras necesidades y tecnologías. La inversión en calidad de código, rendimiento y seguridad se traducirá en un mantenimiento más sencillo, mejor experiencia de usuario y mayor competitividad en el mercado.

