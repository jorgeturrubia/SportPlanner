# Documentación Técnica - SportPlanner

## Descripción General

SportPlanner es una aplicación full-stack para la gestión integral de equipos deportivos y planificación de entrenamientos. La plataforma está diseñada para entrenadores, clubes deportivos y organizaciones que buscan una solución completa para organizar, planificar y gestionar sus actividades deportivas.

### Stack Tecnológico

- **Backend**: ASP.NET Core 8.0 + Entity Framework Core + PostgreSQL
- **Frontend**: Angular 20+ + Tailwind CSS v4 + TypeScript
- **Autenticación**: Supabase JWT
- **Base de Datos**: PostgreSQL con migraciones automáticas
- **Deployment**: Docker, Azure, IIS/Nginx

## Índice de Documentación

### 🏗️ [1. Arquitectura del Sistema](./01-system-architecture.md)
Descripción completa de la arquitectura de la aplicación, patrones implementados y decisiones de diseño.

**Contenido:**
- Arquitectura de alto nivel
- Componentes principales (Frontend, Backend, Base de Datos)
- Patrones de arquitectura utilizados
- Configuración de seguridad
- Escalabilidad y performance

### 🗄️ [2. Esquema de Base de Datos](./02-database-schema.md)
Documentación detallada del esquema de base de datos, entidades y relaciones.

**Contenido:**
- Diagrama ERD completo
- Descripción de todas las entidades
- Relaciones y constraints
- Índices y optimizaciones
- Estrategia de migraciones

### 🔌 [3. Documentación de API](./03-api-documentation.md)
Guía completa de todos los endpoints de la API REST con ejemplos.

**Contenido:**
- Endpoints de autenticación
- Endpoints de gestión de equipos
- Endpoints de planificaciones
- Modelos de datos y DTOs
- Manejo de errores y códigos HTTP

### 🎨 [4. Arquitectura Frontend](./04-frontend-architecture.md)
Documentación de la arquitectura del frontend Angular y patrones utilizados.

**Contenido:**
- Estructura de componentes standalone
- Sistema de diseño con Tailwind CSS v4
- Gestión de estado con Signals
- Server-Side Rendering (SSR)
- Optimizaciones de performance

### 🛠️ [5. Guía de Desarrollo](./05-development-guide.md)
Manual completo para configurar el entorno de desarrollo local.

**Contenido:**
- Requisitos del sistema
- Setup paso a paso
- Configuración de base de datos
- Comandos de desarrollo
- Debugging y testing
- Herramientas recomendadas

### 🚀 [6. Guía de Deployment](./06-deployment-guide.md)
Instrucciones completas para desplegar la aplicación en diferentes entornos.

**Contenido:**
- Deployment tradicional (IIS/Linux)
- Cloud deployment (Azure/AWS)
- Containerización con Docker
- CI/CD con GitHub Actions
- Monitoreo y logging

## Quick Start

### Para Desarrolladores Nuevos

1. **Leer la documentación base**:
   - [Arquitectura del Sistema](./01-system-architecture.md) - Para entender la estructura general
   - [Guía de Desarrollo](./05-development-guide.md) - Para configurar el entorno

2. **Configurar entorno local**:
   ```bash
   # Clonar repositorio
   git clone https://github.com/tu-usuario/sportplanner.git
   cd sportplanner
   
   # Ver guía completa de setup
   cat docs/05-development-guide.md
   ```

3. **Ejecutar aplicación**:
   ```bash
   # Backend (Terminal 1)
   cd src/back/SportPlanner/SportPlanner
   dotnet watch run
   
   # Frontend (Terminal 2)
   cd src/front/SportPlanner
   ng serve
   ```

### Para DevOps/Deployment

1. **Revisar guías de deployment**:
   - [Guía de Deployment](./06-deployment-guide.md) - Para todas las opciones de deployment

2. **Configurar entorno de producción**:
   - Seguir checklist de pre-deployment
   - Configurar variables de entorno
   - Ejecutar pipeline de CI/CD

## Funcionalidades Principales

### ⚽ Gestión de Equipos
- Creación y administración de equipos deportivos
- Categorización por deporte, edad, género y nivel
- Gestión de miembros y roles
- Integración con organizaciones

### 📅 Planificación de Entrenamientos
- Creación de planificaciones temporalizadas
- Generación automática de sesiones
- Gestión de conceptos técnicos y ejercicios
- Sistema de itinerarios reutilizables

### 👥 Sistema de Usuarios
- Autenticación segura con Supabase
- Roles diferenciados (Entrenador, Director, Administrator)
- Sistema de suscripciones (Free, Coach, Club)
- Gestión de permisos granular

### 🏪 Marketplace
- Compartir planificaciones públicamente
- Sistema de calificaciones y comentarios
- Búsqueda y filtros avanzados
- Reutilización de contenido de la comunidad

## Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Angular 20+)                   │
│  • Components Standalone  • Signals  • SSR  • Tailwind     │
└─────────────────────────────────────────────────────────────┘
                               │ HTTPS/REST API
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (ASP.NET Core 8.0)                │
│  • Controllers  • Services  • Middleware  • EF Core        │
└─────────────────────────────────────────────────────────────┘
                               │ Entity Framework
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                DATABASE (PostgreSQL)                       │
│  • Normalized Schema  • Migrations  • Indexes              │
└─────────────────────────────────────────────────────────────┘
                               │ JWT Authentication
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE SERVICES                       │
│  • Authentication  • User Management  • JWT Tokens         │
└─────────────────────────────────────────────────────────────┘
```

## Contribución al Proyecto

### Workflow de Desarrollo

1. **Crear feature branch**:
   ```bash
   git checkout -b feature/nueva-funcionalidad develop
   ```

2. **Desarrollar con testing**:
   ```bash
   # Backend tests
   dotnet test
   
   # Frontend tests
   ng test --watch=false
   ```

3. **Commit y push**:
   ```bash
   git commit -m "feat: agregar nueva funcionalidad"
   git push -u origin feature/nueva-funcionalidad
   ```

4. **Pull Request**: Crear PR a `develop` branch

### Estándares de Código

- **Backend**: Seguir convenciones de C# y .NET
- **Frontend**: Seguir Angular Style Guide y ESLint rules
- **Commits**: Usar Conventional Commits (`feat:`, `fix:`, `docs:`, etc.)
- **Testing**: Mantener cobertura > 80%

## Support y Contacto

### Documentación Adicional
- **Swagger API**: `https://localhost:7000/swagger` (development)
- **Angular DevTools**: Para debugging de componentes
- **Entity Framework**: Para gestión de base de datos

### Recursos Externos
- [Angular Documentation](https://angular.io/docs)
- [ASP.NET Core Documentation](https://docs.microsoft.com/aspnet/core)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase Documentation](https://supabase.com/docs)

### Troubleshooting
- Ver sección de troubleshooting en [Guía de Desarrollo](./05-development-guide.md#troubleshooting-común)
- Revisar logs de aplicación en `logs/` directory
- Verificar configuración de variables de entorno

## Roadmap Técnico

### Q1 2024
- [ ] Implementación de PWA (Progressive Web App)
- [ ] Optimizaciones de performance frontend
- [ ] Tests E2E con Cypress
- [ ] Mejoras de accesibilidad (WCAG 2.1)

### Q2 2024
- [ ] Arquitectura de microservicios
- [ ] Cache distribuido con Redis
- [ ] Message queues para procesos asíncronos
- [ ] Monitoring avanzado con Application Insights

### Q3 2024
- [ ] Mobile app con Capacitor/Ionic
- [ ] Internacionalización (i18n) completa
- [ ] Integración con APIs de deportes
- [ ] Machine learning para recomendaciones

---

**SportPlanner v1.0** - Documentación técnica completa para desarrollo y deployment

*Última actualización: Enero 2024*