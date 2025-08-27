# SportPlanner

## Descripción
Aplicación web para la planificación y gestión de entrenamientos deportivos. Permite a entrenadores crear, compartir y gestionar planificaciones, equipos y sesiones de entrenamiento con un sistema de marketplace integrado.

## Arquitectura
- **Frontend**: Angular 20 + Tailwind CSS
- **Backend**: .NET 8 Web API
- **Base de Datos**: PostgreSQL con Supabase
- **Autenticación**: JWT Bearer tokens con backend personalizado
- **Manejo de Errores**: Sistema completo con reintentos automáticos y recuperación inteligente

## Estructura del Proyecto
```
SportPlanner/
├── src/
│   ├── front/SportPlanner/ # Aplicación Angular 20 con Tailwind 4
│   └── backend/            # API .NET 8
├── docs/                   # Documentación
├── scripts/               # Scripts de desarrollo
└── .claude/               # Configuración de agentes
```

## Requisitos Previos
- Node.js 18+
- .NET 8 SDK
- PostgreSQL (o cuenta Supabase)
- Angular CLI 20

## Instalación

### Frontend (Angular)
```bash
cd src/front/SportPlanner
npm install
ng serve
```

### Backend (.NET 8)
```bash
cd src/backend
dotnet restore
dotnet run
```

## Configuración

### Variables de Entorno
1. Copiar `.env.example` a `.env` y configurar las variables necesarias
2. Crear cuenta en Supabase y obtener las credenciales
3. Configurar los archivos de entorno de Angular:
   - `src/front/SportPlanner/src/environments/environment.ts` (desarrollo)
   - `src/front/SportPlanner/src/environments/environment.prod.ts` (producción)

### Configuración de Autenticación
1. El sistema utiliza autenticación JWT personalizada a través del backend .NET
2. Configurar las variables en los archivos de entorno:
   ```typescript
   // environment.ts
   export const environment = {
     apiUrl: 'https://localhost:7072',
     supabaseUrl: 'https://tu-proyecto.supabase.co', // Solo para base de datos
     supabaseAnonKey: 'tu_clave_anonima' // Solo para base de datos
   };
   ```
3. La autenticación se maneja completamente a través del AuthService de Angular
4. Los tokens JWT se gestionan automáticamente con refresh automático

### Configuración del Backend
```bash
cd src/back/SportPlanner
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "tu_cadena_de_conexion"
dotnet user-secrets set "Supabase:Url" "https://tu-proyecto.supabase.co"
dotnet user-secrets set "Supabase:Key" "tu_clave_anonima"
dotnet ef database update
dotnet build  # Verificar compilación exitosa
```

**SupabaseService Actualizado**: El servicio backend ha sido optimizado para usar correctamente la API del cliente Supabase C# v1.1.1, con constructor principal de C# 12 y manejo moderno de null checks. La compilación es exitosa y el servicio está listo para integración.

## Sistema de Manejo de Errores

SportPlanner incluye un sistema completo de manejo de errores que proporciona una experiencia de usuario robusta:

### Características Principales
- **Reintentos Automáticos**: Reintenta automáticamente operaciones fallidas con backoff exponencial
- **Detección Inteligente**: Distingue entre solicitudes de usuario y de fondo para mostrar indicadores apropiados
- **Recuperación Graceful**: Maneja diferentes tipos de errores con estrategias específicas
- **Notificaciones de Usuario**: Informa al usuario sobre reintentos y errores de manera clara

### Estrategias de Reintento
- **Errores de Red (0)**: Hasta 3 reintentos
- **Timeouts (408)**: Hasta 2 reintentos
- **Rate Limits (429)**: 1 reintento
- **Errores de Servidor (5xx)**: Hasta 2 reintentos
- **Errores de Cliente (4xx)**: Sin reintentos (excepto casos específicos)

### Servicios de Error
- `ErrorInterceptor`: Interceptor HTTP con lógica de reintentos
- `ErrorHandlerService`: Manejo centralizado de errores
- `RetryService`: Servicio configurable de reintentos
- `GlobalErrorHandlerService`: Manejo global de errores de aplicación
- `FormErrorHandlerService`: Manejo específico de errores de formularios

## Funcionalidades Principales
- ✅ **Autenticación JWT**: Servicio completo implementado con gestión de sesiones, login/registro, y validación JWT personalizada
- ✅ Sistema de suscripciones (Gratuita, Entrenador, Club)
- ✅ Gestión de equipos y organizaciones
- ✅ Sistema completo de manejo de errores con reintentos automáticos
- ✅ Creación de planificaciones con conceptos e itinerarios
- ✅ Generación automática de entrenamientos
- ✅ Vista dinámica de sesiones con cronómetro
- ✅ Marketplace de planificaciones compartidas
- ✅ Sistema de valoraciones y búsqueda
- ✅ Reportes y analytics

## Servicios Implementados

### AuthService
Servicio Angular que proporciona autenticación completa con backend personalizado:

**Características:**
- Gestión automática de sesiones con signals reactivos
- Métodos reactivos con RxJS Observables
- Autenticación por email/contraseña a través del backend
- Registro de usuarios con validación completa
- Refresh automático de tokens JWT
- Validación de sesiones con el backend
- Manejo de errores integrado con notificaciones

**Métodos principales:**
- `login()`: Inicio de sesión con credenciales
- `register()`: Registro de usuarios
- `logout()`: Cierre de sesión con limpieza completa
- `refreshToken()`: Renovación automática de tokens
- `validateSession()`: Validación de sesión activa
- `getCurrentUser()`: Usuario actual (signal reactivo)
- `isLoggedIn()`: Estado de autenticación (computed signal)

## Estado del Proyecto
📋 **Fase**: Desarrollo activo
🚀 **Sprint Actual**: Sprint 1 - Fundación del Sistema
📅 **Último Hito**: SupabaseService optimizado y compilación exitosa
✅ **Completado**: Servicio de autenticación backend funcional

## Documentación
- [Especificaciones Técnicas](.claude/specs/sportplanner/)
- [Plan de Sprint](.claude/project-state/sprint-plan.md)
- [Estructura de Tareas](.claude/project-state/task-structure.json)

## Contribución
Ver [CONTRIBUTING.md](CONTRIBUTING.md) para guías de desarrollo.

## Licencia
MIT License - Ver [LICENSE](LICENSE) para más detalles.