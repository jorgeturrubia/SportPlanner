# Arquitectura del Sistema - SportPlanner

## Descripción General

SportPlanner es una aplicación full-stack diseñada para la gestión integral de equipos deportivos y planificación de entrenamientos. La arquitectura sigue el patrón de separación clara entre frontend y backend, implementando principios de Clean Architecture y Domain-Driven Design.

## Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Angular 20+)                   │
├─────────────────────────────────────────────────────────────┤
│  • Landing Page                                            │
│  • Dashboard                                               │
│  • Authentication                                          │
│  • Team Management                                         │
│  • Training Planning                                       │
└─────────────────────────────────────────────────────────────┘
                               │
                          HTTPS/REST API
                               │
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (ASP.NET Core 8.0)                │
├─────────────────────────────────────────────────────────────┤
│  • Controllers (API Endpoints)                            │
│  • Services (Business Logic)                              │
│  • Middleware (Security, CORS, Exceptions)                │
│  • Data Access Layer (Entity Framework Core)              │
└─────────────────────────────────────────────────────────────┘
                               │
                          Entity Framework
                               │
┌─────────────────────────────────────────────────────────────┐
│                DATABASE (PostgreSQL)                       │
├─────────────────────────────────────────────────────────────┤
│  • Users & Authentication                                 │
│  • Teams & Organizations                                  │
│  • Training Plans & Sessions                              │
│  • Exercises & Concepts                                   │
│  • Subscriptions & Ratings                                │
└─────────────────────────────────────────────────────────────┘
                               │
                          JWT Authentication
                               │
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE SERVICES                       │
├─────────────────────────────────────────────────────────────┤
│  • Authentication Service                                 │
│  • User Management                                        │
│  • JWT Token Validation                                   │
└─────────────────────────────────────────────────────────────┘
```

## Componentes Principales

### 1. Frontend (Angular 20+)

**Tecnologías:**
- Angular 20+ con arquitectura standalone components
- Tailwind CSS v4 para estilos
- TypeScript para tipado fuerte
- Angular Router para navegación
- RxJS para programación reactiva
- SSR (Server-Side Rendering) habilitado

**Estructura:**
```
src/app/
├── components/          # Componentes reutilizables
│   ├── navbar/
│   └── footer/
├── pages/              # Páginas principales
│   ├── landing/        # Página de inicio
│   ├── auth/          # Autenticación
│   └── dashboard/     # Panel principal
├── services/          # Servicios de Angular
│   └── theme.service.ts
├── models/           # Interfaces y tipos
│   └── user.model.ts
└── environments/     # Configuraciones
```

**Características Clave:**
- Arquitectura basada en Signals (Angular 20+)
- Lazy loading de módulos para optimización
- Theme service con soporte dark/light mode
- Configuración SSR para SEO
- Responsive design con Tailwind CSS

### 2. Backend (ASP.NET Core 8.0)

**Tecnologías:**
- ASP.NET Core 8.0
- Entity Framework Core 8.0
- PostgreSQL como base de datos
- Supabase para autenticación JWT
- Swagger para documentación API

**Estructura:**
```
SportPlanner/
├── Controllers/         # Controladores API
│   ├── AuthController.cs
│   ├── TeamsController.cs
│   └── PlanningsController.cs
├── Services/           # Lógica de negocio
│   ├── ISupabaseService.cs
│   ├── SupabaseService.cs
│   ├── ITeamService.cs
│   ├── TeamService.cs
│   ├── IUserContextService.cs
│   └── UserContextService.cs
├── Models/             # Entidades del dominio
│   ├── User.cs
│   ├── Team.cs
│   ├── Planning.cs
│   ├── Exercise.cs
│   ├── Concept.cs
│   └── Subscription.cs
├── Data/              # Acceso a datos
│   └── SportPlannerDbContext.cs
├── Middleware/        # Middleware personalizado
│   ├── SecurityHeadersMiddleware.cs
│   ├── GlobalExceptionMiddleware.cs
│   └── JwtMiddleware.cs
└── Migrations/        # Migraciones EF
```

**Características Clave:**
- Arquitectura en capas con separación de responsabilidades
- Inyección de dependencias nativa de .NET
- Middleware personalizado para seguridad y manejo de errores
- Configuración CORS para comunicación con frontend
- Validación de modelos con Data Annotations

### 3. Base de Datos (PostgreSQL)

**Características:**
- Esquema relacional normalizado
- Soporte para migraciones automáticas
- Índices optimizados para consultas frecuentes
- Constraints de integridad referencial
- Datos seed para configuración inicial

**Entidades Principales:**
- **Users**: Gestión de usuarios y autenticación
- **Teams**: Equipos deportivos y organizaciones
- **Plannings**: Planificaciones de entrenamiento
- **Exercises**: Catálogo de ejercicios
- **Concepts**: Conceptos técnicos deportivos
- **Subscriptions**: Planes de suscripción

### 4. Autenticación (Supabase)

**Funcionalidades:**
- Autenticación JWT integrada
- Gestión de sesiones de usuario
- Validación de tokens automática
- Integración con backend ASP.NET Core

## Patrones de Arquitectura Implementados

### 1. Separation of Concerns
- **Frontend**: Maneja únicamente la presentación y UX
- **Backend**: Lógica de negocio y acceso a datos
- **Database**: Persistencia y integridad de datos

### 2. Dependency Injection
- Servicios registrados en el contenedor DI
- Interfaces para abstracción de implementaciones
- Fácil testing y mantenimiento

### 3. Repository Pattern (Implícito con EF Core)
- DbContext actúa como Unit of Work
- DbSets funcionan como repositorios
- Abstracción del acceso a datos

### 4. Middleware Pipeline
- Manejo de headers de seguridad
- Captura global de excepciones
- Procesamiento de tokens JWT
- Configuración CORS

## Seguridad

### Frontend
- Validación de formularios con Angular Reactive Forms
- Sanitización de inputs
- Headers de seguridad desde backend

### Backend
- Validación de tokens JWT con Supabase
- Headers de seguridad (HSTS, CSP, etc.)
- Validación de modelos
- CORS configurado para orígenes específicos

### Base de Datos
- Conexión segura con PostgreSQL
- Constraints de integridad
- Auditoría con timestamps
- Soft deletes con campos IsActive

## Escalabilidad y Performance

### Frontend
- Lazy loading de componentes
- Tree shaking automático
- Build optimizado para producción
- SSR para mejores Core Web Vitals

### Backend
- Arquitectura stateless
- Caching a nivel de EF Core
- Consultas optimizadas con LINQ
- Paginación en endpoints que lo requieren

### Base de Datos
- Índices estratégicos
- Normalización apropiada
- Consultas optimizadas
- Connection pooling

## Monitoreo y Logging

- Logging integrado de ASP.NET Core
- Captura de excepciones globales
- Logs estructurados para producción
- Métricas de performance disponibles

## Próximos Pasos de Evolución

1. **Implementación de Redis** para caching distribuido
2. **Message Queue** para procesos asíncronos
3. **Containerización** con Docker
4. **CI/CD Pipeline** automatizado
5. **Monitoring avanzado** con Application Insights
6. **Microservicios** para funcionalidades específicas

---

*Documentación generada para SportPlanner v1.0 - Arquitectura Full-Stack*