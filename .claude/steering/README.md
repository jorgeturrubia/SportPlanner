# Technical Documentation - SportPlanner

## Overview

SportPlanner is a full-stack application for comprehensive sports team management and training planning. The platform is designed for coaches, sports clubs, and organizations seeking a complete solution to organize, plan, and manage their sports activities.

### Technology Stack

- **Backend**: ASP.NET Core 8.0 + Entity Framework Core + PostgreSQL
- **Frontend**: Angular 20+ + Tailwind CSS v4 + TypeScript
- **Authentication**: Supabase JWT
- **Database**: PostgreSQL with automatic migrations
- **Deployment**: Docker, Azure, IIS/Nginx

## Documentation Index

### 🏗️ [1. System Architecture](./01-system-architecture.md)
Complete description of application architecture, implemented patterns, and design decisions.

**Content:**
- High-level architecture
- Main components (Frontend, Backend, Database)
- Implemented architecture patterns
- Security configuration
- Scalability and performance

### 🗄️ [2. Database Schema](./02-database-schema.md)
Detailed documentation of database schema, entities, and relationships.

**Content:**
- Complete ERD diagram
- Description of all entities
- Relationships and constraints
- Indexes and optimizations
- Migration strategy

### 🔌 [3. API Documentation](./03-api-documentation.md)
Complete guide of all REST API endpoints with examples.

**Content:**
- Authentication endpoints
- Team management endpoints
- Planning endpoints
- Data models and DTOs
- Error handling and HTTP codes

### 🎨 [4. Frontend Architecture](./04-frontend-architecture.md)
Documentation of Angular frontend architecture and patterns used.

**Content:**
- Standalone component structure
- Design system with Tailwind CSS v4
- State management with Signals
- Server-Side Rendering (SSR)
- Performance optimizations

### 🛠️ [5. Development Guide](./05-development-guide.md)
Complete manual for setting up local development environment.

**Content:**
- System requirements
- Step-by-step setup
- Database configuration
- Development commands
- Debugging and testing
- Recommended tools

### 🚀 [6. Deployment Guide](./06-deployment-guide.md)
Complete instructions for deploying the application in different environments.

**Content:**
- Traditional deployment (IIS/Linux)
- Cloud deployment (Azure/AWS)
- Containerization with Docker
- CI/CD with GitHub Actions
- Monitoring and logging

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

### For DevOps/Deployment

1. **Review deployment guides**:
   - [Deployment Guide](./06-deployment-guide.md) - For all deployment options

2. **Configure production environment**:
   - Follow pre-deployment checklist
   - Configure environment variables
   - Execute CI/CD pipeline

## Main Features

### ⚽ Team Management
- Creation and administration of sports teams
- Categorization by sport, age, gender, and level
- Member and role management
- Organization integration

### 📅 Training Planning
- Creation of time-based plannings
- Automatic session generation
- Technical concept and exercise management
- Reusable itinerary system

### 👥 User System
- Secure authentication with Supabase
- Differentiated roles (Coach, Director, Administrator)
- Subscription system (Free, Coach, Club)
- Granular permission management

### 🏪 Marketplace
- Share plannings publicly
- Rating and comment system
- Advanced search and filters
- Community content reusability

## High-Level Architecture

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