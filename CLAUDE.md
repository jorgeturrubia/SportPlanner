# CLAUDE.md - AI Assistant Guide for SportPlanner

> **Last Updated:** 2025-11-20
> **Project Status:** Documentation Phase (90% complete) | Implementation Phase (5% complete)
> **Target:** Pre-MVP Development

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Quick Start for AI Assistants](#quick-start-for-ai-assistants)
3. [Codebase Structure](#codebase-structure)
4. [Technology Stack](#technology-stack)
5. [Development Workflows](#development-workflows)
6. [Key Conventions](#key-conventions)
7. [Architecture Patterns](#architecture-patterns)
8. [Database Schema](#database-schema)
9. [Critical Documentation References](#critical-documentation-references)
10. [Common Tasks](#common-tasks)
11. [Testing Strategy](#testing-strategy)
12. [Deployment](#deployment)

---

## Project Overview

### What is SportPlanner?

**SportPlanner** is a full-stack SaaS web application for amateur sports coaches to create progressive training programs with a visual exercise editor and marketplace for sharing content.

**Elevator Pitch:** *"Create progressive training plans in 30 minutes instead of 4 hours"*

### Core Value Proposition

- **Visual Exercise Editor** - Canvas-based editor (Fabric.js) for creating exercises with animations
- **Progressive Planning** - Automatic distribution of training objectives across weeks based on difficulty
- **Marketplace** - Community-driven library of exercises, sessions, and training plans
- **Multi-Tenant SaaS** - Each user has isolated data via Row Level Security (RLS)

### Target Users

1. **Primary:** Carlos (Amateur Coach) - Individual trainer managing 1-2 teams
2. **Secondary:** Laura (Sports Director) - Managing multiple coaches (Phase 2+)
3. **Tertiary:** Clubs - Organizational accounts (Phase 3+)

### Current State

- **Documentation:** 90% complete (exceptional quality)
- **Backend:** Minimal scaffold (sample controller only)
- **Frontend:** Not created yet
- **Database:** Schema documented, not deployed
- **Infrastructure:** Not configured

---

## Quick Start for AI Assistants

### First-Time Repository Analysis

When starting work on this repository:

1. **Read `/DocSportPlanner/EstadoProyecto.md`** - Current status and next steps
2. **Review `/DocSportPlanner/docs/tecnico/StackTecnologico.md`** - Complete tech stack
3. **Check `/DocSportPlanner/docs/tecnico/ModeloDatos.md`** - Database schema (13 tables)
4. **Read Architecture Decision Records** in `/DocSportPlanner/docs/ADR/` - Understand why tech choices were made

### Before Implementing Features

1. **Check `/DocSportPlanner/backlog/backlog.yaml`** - Verify story exists and priority
2. **Review `/DocSportPlanner/docs/negocio/03-user-stories.md`** - Acceptance criteria
3. **Consult `/DocSportPlanner/docs/tecnico/04-api-contracts.md`** - API specifications
4. **Check `/DocSportPlanner/instructions.md`** - AI agent validation protocols

### Language Convention

**CRITICAL:** All code comments, documentation, and user-facing strings MUST be in **Spanish**. This is a hard requirement.

- ✅ Variable names: English (e.g., `planificaciones`, not `planning`)
- ✅ Comments: Spanish
- ✅ Commit messages: Spanish
- ✅ User-facing text: Spanish
- ✅ Error messages: Spanish
- ❌ Do NOT use English in user-facing content

---

## Codebase Structure

```
/home/user/SportPlanner/
│
├── .github/
│   └── copilot-instructions.md    # AI agent conventions
│
├── .gitignore                      # Standard .NET + Node exclusions
├── README.md                       # Minimal root readme
│
├── back/                           # ASP.NET Core Web API
│   ├── SportPlanner.sln            # Visual Studio solution
│   └── SportPlanner/               # Main API project
│       ├── SportPlanner.csproj     # Project file with dependencies
│       ├── Program.cs              # Application entry point
│       ├── appsettings.json        # Production configuration
│       ├── appsettings.Development.json  # Dev configuration
│       ├── README.md               # Backend setup instructions
│       │
│       ├── Controllers/            # REST API endpoints
│       │   └── WeatherForecastController.cs  # Sample (TO REMOVE)
│       │
│       ├── Models/                 # DTOs and domain entities
│       │   └── WeatherForecast.cs  # Sample (TO REMOVE)
│       │
│       └── Properties/
│           └── launchSettings.json # Launch profiles (ports 5269/7146)
│
├── DocSportPlanner/                # COMPREHENSIVE PROJECT DOCUMENTATION
│   ├── README.md                   # Documentation hub
│   ├── EstadoProyecto.md           # ⭐ PROJECT STATUS - READ FIRST
│   ├── instructions.md             # ⭐ AI AGENT PROTOCOLS - READ SECOND
│   │
│   ├── backlog/
│   │   └── backlog.yaml            # User stories backlog (20 stories, 6 epics)
│   │
│   ├── docs/
│   │   ├── 01-vision-negocio.md    # Business vision summary
│   │   │
│   │   ├── negocio/                # Business documentation
│   │   │   ├── 01-vision-objetivos.md    # Vision, objectives, KPIs
│   │   │   ├── 02-user-personas.md       # Carlos & Laura personas
│   │   │   ├── 03-user-stories.md        # User stories with acceptance criteria
│   │   │   ├── 04-modelo-negocio.md      # 5 pricing tiers (€5.99-€19.99)
│   │   │   ├── 05-roadmap.md             # 12-month rollout plan
│   │   │   └── 06-metodologia.md         # Agile methodology
│   │   │
│   │   ├── tecnico/                # Technical documentation
│   │   │   ├── StackTecnologico.md       # ⭐ COMPLETE TECH STACK
│   │   │   ├── ModeloDatos.md            # ⭐ DATABASE SCHEMA (13 tables, 1000+ lines)
│   │   │   ├── 03-arquitectura-marketplace.md  # Marketplace logic
│   │   │   ├── 03-nfrs.md                # Non-functional requirements
│   │   │   ├── 04-api-contracts.md       # ⭐ REST API specifications
│   │   │   ├── 05-algoritmo-progresion.md # ⭐ CRITICAL FEATURE - Auto distribution
│   │   │   └── openapi.yaml              # OpenAPI 3.0 specification
│   │   │
│   │   ├── arquitectura/           # Architecture documentation
│   │   │   └── 01-diagramas.md     # C4 diagrams, data flow
│   │   │
│   │   └── ADR/                    # Architecture Decision Records
│   │       ├── ADR-002-Angular-DotNET.md   # Why Angular + .NET
│   │       └── ADR-003-Supabase-BaaS.md    # Why Supabase
│   │
│   └── src/                        # (Empty - future source placeholder)
│
└── frontend/                       # ⚠️ NOT YET CREATED - Angular 20+ app will go here
```

### Key Directory Purposes

| Directory | Purpose | Status |
|-----------|---------|--------|
| `/back/SportPlanner/` | ASP.NET Core Web API (port 7146) | Scaffold only |
| `/frontend/` | Angular 20+ SPA | Not created |
| `/DocSportPlanner/` | Project documentation (90% complete) | ⭐ AUTHORITATIVE |
| `/DocSportPlanner/docs/tecnico/` | Technical specs | Reference before coding |
| `/DocSportPlanner/docs/ADR/` | Architecture decisions | Understand "why" |

---

## Technology Stack

### Backend Stack

| Component | Technology | Version | Status |
|-----------|-----------|---------|--------|
| **Framework** | ASP.NET Core Web API | 8.0 LTS | ✅ Configured |
| **Language** | C# | .NET 8.0 | ✅ Active |
| **ORM** | Entity Framework Core | 8.0 | ⚠️ Not added |
| **Database Driver** | Npgsql.EntityFrameworkCore.PostgreSQL | 8.0 | ⚠️ Not added |
| **Authentication** | JWT Bearer | ASP.NET Core Auth | ⚠️ Not configured |
| **Validation** | FluentValidation | 11.3.0 | ⚠️ Not added |
| **Mapping** | AutoMapper | 12.0.1 | ⚠️ Not added |
| **Logging** | Serilog.AspNetCore | 8.0 | ⚠️ Not added |
| **API Docs** | Swashbuckle (Swagger) | 6.6.2 | ✅ Configured |

### Frontend Stack (Planned)

| Component | Technology | Version | Status |
|-----------|-----------|---------|--------|
| **Framework** | Angular | 20+ | ❌ Not created |
| **Language** | TypeScript | 5+ | ❌ Not created |
| **Styling** | Tailwind CSS | 4.0+ | ❌ Not configured |
| **Canvas Editor** | Fabric.js | 6.0+ | ❌ Critical feature |
| **Animations** | GSAP | 3.12+ | ❌ For exercises |
| **State** | Angular Signals | Built-in | ❌ Use instead of RxJS |
| **Charts** | ngx-charts | Latest | ❌ For analytics |
| **Notifications** | ngx-toastr | Latest | ❌ User feedback |
| **HTTP Client** | Angular HttpClient | Built-in | ❌ JWT interceptor |

### Database & BaaS

| Component | Technology | Purpose | Status |
|-----------|-----------|---------|--------|
| **Database** | PostgreSQL | 15+ via Supabase | ❌ Not deployed |
| **BaaS Platform** | Supabase | Auth, Storage, Realtime | ❌ Not configured |
| **Auth** | Supabase Auth | JWT tokens, RLS | ❌ Critical |
| **Storage** | Supabase Storage | Images/thumbnails | ❌ For exercises |
| **Realtime** | Supabase Realtime | WebSocket (Phase 2) | ❌ Future |

### Infrastructure (Planned)

| Service | Provider | Cost | Purpose |
|---------|----------|------|---------|
| **Frontend Hosting** | Vercel | Free | Angular SPA |
| **Backend Hosting** | Railway | $5-6/month | .NET API |
| **Database** | Supabase | Free (MVP) | PostgreSQL + Auth |
| **Email** | SendGrid | Free | Transactional emails |
| **Monitoring** | Sentry | Free | Error tracking |

**Total MVP Cost:** ~$5-6/month (Railway only)

---

## Development Workflows

### 1. Setting Up Development Environment

#### Prerequisites

```bash
# Required
- .NET SDK 8.0
- Node.js 20+
- Visual Studio 2022 / Rider (backend) or VS Code
- Git

# Optional (for full stack)
- Supabase CLI (for local development)
- PostgreSQL 15+ (local testing)
```

#### Backend Setup

```bash
cd /home/user/SportPlanner/back/SportPlanner

# Restore NuGet packages
dotnet restore

# Build project
dotnet build

# Run application
dotnet run

# Access Swagger UI
# https://localhost:7146/swagger
```

**Development Ports:**
- HTTP: `http://localhost:5269`
- HTTPS: `https://localhost:7146`

#### Frontend Setup (When Created)

```bash
cd /home/user/SportPlanner/frontend

# Install dependencies
npm install

# Run dev server
ng serve

# Access application
# http://localhost:4200
```

### 2. Creating New API Endpoints

**ALWAYS follow this order:**

1. **Check Documentation First**
   - Review `/DocSportPlanner/docs/tecnico/04-api-contracts.md`
   - Verify endpoint specification in `openapi.yaml`

2. **Create/Update Entity Model**
   - Path: `/back/SportPlanner/Models/`
   - Use data types from `ModeloDatos.md`
   - Add validation attributes

3. **Create Repository** (if needed)
   - Path: `/back/SportPlanner/Repositories/`
   - Interface + Implementation
   - Use EF Core for database access

4. **Create Service** (business logic)
   - Path: `/back/SportPlanner/Services/`
   - Interface + Implementation
   - Inject repository via DI

5. **Create Controller**
   - Path: `/back/SportPlanner/Controllers/`
   - Inherit from `ControllerBase`
   - Use attribute routing: `[Route("api/[controller]")]`
   - Add XML comments for Swagger

6. **Register in DI Container**
   - Update `Program.cs`
   - Register services and repositories

7. **Test via Swagger**
   - Run application
   - Open `https://localhost:7146/swagger`
   - Test endpoint

### 3. Database Migrations

**When adding/modifying entities:**

```bash
cd /home/user/SportPlanner/back/SportPlanner

# Add migration
dotnet ef migrations add <MigrationName> --project SportPlanner.csproj

# Review generated migration
# File in /Migrations/ folder

# Apply migration
dotnet ef database update
```

**IMPORTANT:** Migrations must match the schema in `/DocSportPlanner/docs/tecnico/ModeloDatos.md`

### 4. Frontend Component Creation (Future)

```bash
# Generate standalone component
ng generate component features/planificaciones/planificacion-list --standalone

# Generate service
ng generate service features/planificaciones/services/planificacion

# Generate guard
ng generate guard core/guards/auth
```

### 5. Git Workflow

**Branch Naming:**
- Feature: `claude/claude-md-mi79d7o4k58s45pw-<session-id>`
- Always push to branches starting with `claude/`

**Commit Message Format (Spanish):**

```
<tipo>: <descripción breve>

<cuerpo opcional>
```

**Tipos:**
- `feat:` - Nueva funcionalidad
- `fix:` - Corrección de bug
- `docs:` - Documentación
- `refactor:` - Refactorización
- `test:` - Tests
- `chore:` - Tareas de mantenimiento

**Examples:**

```bash
git commit -m "feat: implementar endpoint GET /api/planificaciones"

git commit -m "fix: corregir validación de fechas en planificación

El validador no permitía fechas futuras correctamente.
Se actualiza la lógica para validar fecha_inicio >= hoy."
```

### 6. Code Review Checklist

Before committing:

- [ ] Code follows C# conventions (PascalCase for public, camelCase for private)
- [ ] All comments and strings are in Spanish
- [ ] DTOs match API contracts in documentation
- [ ] Validation rules match business requirements
- [ ] No hardcoded credentials or secrets
- [ ] OWASP Top 10 vulnerabilities checked (SQL injection, XSS, etc.)
- [ ] Swagger documentation updated
- [ ] No console.log or debug statements

---

## Key Conventions

### 1. Language and Localization

**CRITICAL RULE:** All user-facing content MUST be in Spanish.

| Element | Language | Example |
|---------|----------|---------|
| Variable names | English/Spanish mix | `planificaciones`, `userId` |
| Class names | English | `PlanificacionService` |
| Comments | Spanish | `// Calcula la distribución semanal` |
| Error messages | Spanish | `"La fecha de inicio no puede ser anterior a hoy"` |
| API responses | Spanish | `{ "mensaje": "Planificación creada" }` |
| Documentation | Spanish | All `.md` files in `/DocSportPlanner/` |
| Commit messages | Spanish | `feat: agregar validación de objetivos` |

### 2. Naming Conventions

#### Backend (C#)

```csharp
// Classes: PascalCase
public class PlanificacionService { }

// Interfaces: IPascalCase
public interface IPlanificacionService { }

// Public properties: PascalCase
public string NombrePlanificacion { get; set; }

// Private fields: _camelCase
private readonly IPlanificacionRepository _repository;

// Methods: PascalCase
public async Task<List<PlanificacionDto>> ObtenerTodasAsync() { }

// DTOs: PascalCase + "Dto" suffix
public class PlanificacionDto { }

// Controllers: PascalCase + "Controller" suffix
public class PlanificacionesController : ControllerBase { }
```

#### Frontend (TypeScript/Angular - Future)

```typescript
// Interfaces: PascalCase
export interface Planificacion { }

// Classes: PascalCase
export class PlanificacionService { }

// Variables/parameters: camelCase
const nombrePlanificacion: string = 'Mi planificación';

// Constants: UPPER_SNAKE_CASE
const MAX_OBJETIVOS = 10;

// Components: kebab-case (file), PascalCase (class)
// File: planificacion-list.component.ts
export class PlanificacionListComponent { }

// Services: kebab-case (file), PascalCase (class)
// File: planificacion.service.ts
export class PlanificacionService { }
```

#### Database (PostgreSQL)

```sql
-- Tables: snake_case, plural
CREATE TABLE user_planificaciones (...);

-- Columns: snake_case
user_id UUID
nombre_planificacion VARCHAR(200)
fecha_inicio DATE

-- Primary keys: id or <table>_id
id UUID PRIMARY KEY
planificacion_id UUID

-- Foreign keys: <referenced_table>_id
user_id UUID REFERENCES auth.users(id)

-- Junction tables: <table1>_<table2>
user_planificacion_objetivos

-- Indexes: idx_<table>_<column>
CREATE INDEX idx_user_planificaciones_user_id ON user_planificaciones(user_id);

-- Triggers: <action>_<table>_<event>
CREATE TRIGGER update_rating_after_insert ...
```

### 3. File Organization

#### Backend Structure

```
/back/SportPlanner/
├── Controllers/
│   ├── PlanificacionesController.cs
│   ├── SesionesController.cs
│   └── EjerciciosController.cs
│
├── Services/
│   ├── IPlanificacionService.cs
│   ├── PlanificacionService.cs
│   ├── IAlgoritmoProgresion.cs
│   └── AlgoritmoProgresion.cs
│
├── Repositories/
│   ├── IPlanificacionRepository.cs
│   ├── PlanificacionRepository.cs
│   └── ...
│
├── Models/
│   ├── Entities/
│   │   ├── Planificacion.cs
│   │   ├── Sesion.cs
│   │   └── Ejercicio.cs
│   └── Dtos/
│       ├── PlanificacionDto.cs
│       ├── CrearPlanificacionDto.cs
│       └── ActualizarPlanificacionDto.cs
│
├── Data/
│   ├── AppDbContext.cs
│   └── Configurations/
│       ├── PlanificacionConfiguration.cs
│       └── ...
│
├── Middleware/
│   ├── ExceptionHandlingMiddleware.cs
│   └── JwtMiddleware.cs
│
└── Program.cs
```

#### Frontend Structure (Future)

```
/frontend/src/app/
├── core/                    # Singleton services
│   ├── services/
│   │   ├── auth.service.ts
│   │   └── http.service.ts
│   ├── guards/
│   │   └── auth.guard.ts
│   └── interceptors/
│       └── jwt.interceptor.ts
│
├── shared/                  # Reusable components
│   ├── components/
│   ├── pipes/
│   └── directives/
│
├── features/                # Feature modules (lazy-loaded)
│   ├── planificaciones/
│   │   ├── components/
│   │   │   ├── planificacion-list/
│   │   │   ├── planificacion-detail/
│   │   │   └── planificacion-form/
│   │   ├── services/
│   │   │   └── planificacion.service.ts
│   │   └── models/
│   │       └── planificacion.model.ts
│   │
│   ├── ejercicios/
│   │   ├── components/
│   │   │   └── ejercicio-editor/  # Fabric.js canvas
│   │   └── services/
│   │
│   └── marketplace/
│
└── layouts/
    ├── header/
    ├── sidebar/
    └── footer/
```

### 4. Error Handling

#### Backend Error Responses

```csharp
// Standard error response format
public class ErrorResponse
{
    public string Mensaje { get; set; }
    public string Codigo { get; set; }
    public DateTime Timestamp { get; set; }
    public Dictionary<string, string[]>? Errores { get; set; }  // Validation errors
}

// Example usage in controller
[HttpPost]
public async Task<ActionResult<PlanificacionDto>> Crear([FromBody] CrearPlanificacionDto dto)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(new ErrorResponse
        {
            Mensaje = "Datos de entrada inválidos",
            Codigo = "VALIDATION_ERROR",
            Timestamp = DateTime.UtcNow,
            Errores = ModelState.ToDictionary(
                kvp => kvp.Key,
                kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToArray()
            )
        });
    }

    // Business logic...
}
```

#### HTTP Status Codes

| Code | Usage |
|------|-------|
| 200 OK | Successful GET, PUT |
| 201 Created | Successful POST |
| 204 No Content | Successful DELETE |
| 400 Bad Request | Validation errors |
| 401 Unauthorized | Missing/invalid JWT |
| 403 Forbidden | User lacks permission |
| 404 Not Found | Resource doesn't exist |
| 409 Conflict | Duplicate resource |
| 500 Internal Server Error | Unexpected error |

### 5. Security Conventions

#### Authentication Flow

```
1. User logs in via Supabase Auth (frontend)
   → Supabase returns JWT token

2. Frontend stores JWT in localStorage/sessionStorage
   → Includes in Authorization header: "Bearer <token>"

3. Backend validates JWT using Supabase public key
   → Extracts user_id from token claims

4. Backend queries database
   → Row Level Security (RLS) automatically filters by user_id
```

#### RLS Policy Pattern

```sql
-- All user_* tables follow this pattern
CREATE POLICY "Users can only see their own data"
ON user_planificaciones FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own data"
ON user_planificaciones FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own data"
ON user_planificaciones FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own data"
ON user_planificaciones FOR DELETE
USING (auth.uid() = user_id);
```

#### Input Validation

**Backend validation with FluentValidation:**

```csharp
public class CrearPlanificacionDtoValidator : AbstractValidator<CrearPlanificacionDto>
{
    public CrearPlanificacionDtoValidator()
    {
        RuleFor(x => x.NombrePlanificacion)
            .NotEmpty().WithMessage("El nombre de la planificación es obligatorio")
            .MaximumLength(200).WithMessage("El nombre no puede exceder 200 caracteres");

        RuleFor(x => x.FechaInicio)
            .GreaterThanOrEqualTo(DateTime.Today)
            .WithMessage("La fecha de inicio no puede ser anterior a hoy");

        RuleFor(x => x.FechaFin)
            .GreaterThan(x => x.FechaInicio)
            .WithMessage("La fecha de fin debe ser posterior a la fecha de inicio");
    }
}
```

#### Prevent OWASP Top 10

- **SQL Injection:** Use EF Core parameterized queries (NEVER raw SQL concatenation)
- **XSS:** Angular auto-escapes templates; validate user input
- **Authentication:** Use Supabase Auth JWT (don't roll custom auth)
- **Sensitive Data:** Never log passwords, tokens, or PII
- **CORS:** Configure allowed origins in `Program.cs`
- **CSRF:** Not needed for stateless JWT API
- **Dependencies:** Regularly update NuGet/npm packages

---

## Architecture Patterns

### 1. Backend Architecture: Layered + Repository Pattern

```
┌─────────────────────────────────────┐
│   Presentation Layer (Controllers)  │  ← HTTP requests/responses
│   - PlanificacionesController       │
│   - SesionesController               │
└─────────────────┬───────────────────┘
                  │
                  ↓
┌─────────────────────────────────────┐
│   Business Logic Layer (Services)   │  ← Business rules, validation
│   - PlanificacionService             │
│   - AlgoritmoProgresion              │
└─────────────────┬───────────────────┘
                  │
                  ↓
┌─────────────────────────────────────┐
│   Data Access Layer (Repositories)  │  ← EF Core queries
│   - PlanificacionRepository          │
│   - SesionRepository                 │
└─────────────────┬───────────────────┘
                  │
                  ↓
┌─────────────────────────────────────┐
│   Database (PostgreSQL via Supabase)│
│   - user_planificaciones             │
│   - user_sesiones                    │
└─────────────────────────────────────┘
```

### 2. Frontend Architecture: Component-Based (Future)

```
┌─────────────────────────────────────┐
│   Smart Components (Containers)     │  ← State management, API calls
│   - PlanificacionListComponent      │
│   - EjercicioEditorComponent        │
└─────────────────┬───────────────────┘
                  │
                  ↓
┌─────────────────────────────────────┐
│   Dumb Components (Presentational)  │  ← Pure UI, @Input/@Output
│   - PlanificacionCardComponent      │
│   - ButtonComponent                 │
└─────────────────┬───────────────────┘
                  │
                  ↓
┌─────────────────────────────────────┐
│   Services (Business Logic + HTTP)  │  ← HTTP calls, state (Signals)
│   - PlanificacionService             │
│   - AuthService                      │
└─────────────────┬───────────────────┘
                  │
                  ↓
┌─────────────────────────────────────┐
│   Backend API (ASP.NET Core)        │
└─────────────────────────────────────┘
```

### 3. Database Architecture: Separated Marketplace Model

**Key Decision (ADR-001):**

Marketplace content is stored in **separate tables** from user content.

```
┌───────────────────────────────────────────────────────┐
│              MARKETPLACE TABLES (Read-Only)           │
│  - marketplace_planificaciones                        │
│  - marketplace_sesiones                               │
│  - marketplace_ejercicios                             │
│  - marketplace_objetivos                              │
│                                                       │
│  Purpose: System/community library (curated)          │
│  Access: All users can read                           │
└───────────────────┬───────────────────────────────────┘
                    │
                    │ Import (copy-on-import)
                    ↓
┌───────────────────────────────────────────────────────┐
│              USER TABLES (User-Owned)                 │
│  - user_planificaciones                               │
│  - user_sesiones                                      │
│  - user_ejercicios                                    │
│  - user_objetivos                                     │
│  - user_planificacion_objetivos (M-N)                 │
│  - user_sesion_ejercicios (M-N)                       │
│  - user_ejercicio_objetivos (M-N)                     │
│                                                       │
│  Purpose: Personal workspace (editable)               │
│  Access: RLS filters by user_id                       │
│  Traceability: source_marketplace_id column           │
└───────────────────────────────────────────────────────┘
```

**Why this pattern?**

- ✅ Users can modify imported content without affecting originals
- ✅ Simple RLS policies (`auth.uid() = user_id`)
- ✅ Clear separation of concerns
- ✅ Easy to track content provenance via `source_marketplace_id`

### 4. Dependency Injection Pattern

**Register services in `Program.cs`:**

```csharp
// Add DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add repositories
builder.Services.AddScoped<IPlanificacionRepository, PlanificacionRepository>();
builder.Services.AddScoped<ISesionRepository, SesionRepository>();

// Add services
builder.Services.AddScoped<IPlanificacionService, PlanificacionService>();
builder.Services.AddScoped<IAlgoritmoProgresion, AlgoritmoProgresion>();

// Add AutoMapper
builder.Services.AddAutoMapper(typeof(Program));

// Add FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
```

**Consume via constructor injection:**

```csharp
public class PlanificacionesController : ControllerBase
{
    private readonly IPlanificacionService _planificacionService;
    private readonly ILogger<PlanificacionesController> _logger;

    public PlanificacionesController(
        IPlanificacionService planificacionService,
        ILogger<PlanificacionesController> logger)
    {
        _planificacionService = planificacionService;
        _logger = logger;
    }
}
```

### 5. DTOs Pattern

**ALWAYS use DTOs for API contracts. NEVER expose EF entities directly.**

```csharp
// Entity (internal, maps to database)
public class Planificacion
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string NombrePlanificacion { get; set; }
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFin { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public virtual ICollection<PlanificacionObjetivo> PlanificacionObjetivos { get; set; }
}

// DTOs (external, API contracts)

// For GET requests (read)
public class PlanificacionDto
{
    public Guid Id { get; set; }
    public string NombrePlanificacion { get; set; }
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFin { get; set; }
    public int NumeroSemanas { get; set; }
    public DateTime CreatedAt { get; set; }
}

// For POST requests (create)
public class CrearPlanificacionDto
{
    [Required(ErrorMessage = "El nombre de la planificación es obligatorio")]
    [MaxLength(200, ErrorMessage = "El nombre no puede exceder 200 caracteres")]
    public string NombrePlanificacion { get; set; }

    [Required]
    public DateTime FechaInicio { get; set; }

    [Required]
    public DateTime FechaFin { get; set; }
}

// For PUT requests (update)
public class ActualizarPlanificacionDto
{
    [MaxLength(200)]
    public string? NombrePlanificacion { get; set; }

    public DateTime? FechaInicio { get; set; }
    public DateTime? FechaFin { get; set; }
}
```

**Map with AutoMapper:**

```csharp
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Planificacion, PlanificacionDto>();
        CreateMap<CrearPlanificacionDto, Planificacion>();
        CreateMap<ActualizarPlanificacionDto, Planificacion>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}
```

---

## Database Schema

### Overview

**13 tables organized in 3 groups:**

1. **Marketplace Tables (4)** - System/community library
2. **User Content Tables (7)** - Personal workspace
3. **Tracking Tables (2)** - Analytics and audit

### Critical Tables

#### 1. `user_planificaciones` (Training Plans)

```sql
CREATE TABLE user_planificaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre_planificacion VARCHAR(200) NOT NULL,
    descripcion TEXT,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    numero_semanas INTEGER GENERATED ALWAYS AS (
        CEIL((fecha_fin - fecha_inicio)::INTEGER / 7.0)
    ) STORED,
    source_marketplace_id UUID REFERENCES marketplace_planificaciones(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_planificaciones_user_id ON user_planificaciones(user_id);
```

#### 2. `user_ejercicios` (Exercises)

```sql
CREATE TABLE user_ejercicios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre_ejercicio VARCHAR(200) NOT NULL,
    descripcion TEXT,
    duracion_minutos INTEGER,
    intensidad VARCHAR(20) CHECK (intensidad IN ('baja', 'media', 'alta')),
    material TEXT[],
    canvas_data JSONB NOT NULL,  -- ⭐ Visual editor data (Fabric.js)
    thumbnail_url TEXT,
    source_marketplace_id UUID REFERENCES marketplace_ejercicios(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**`canvas_data` JSONB structure:**

```json
{
  "version": "6.0.0",
  "objects": [
    {
      "type": "rect",
      "left": 100,
      "top": 100,
      "width": 200,
      "height": 100,
      "fill": "#4CAF50",
      "stroke": "#000",
      "animation": {
        "type": "move",
        "duration": 2000,
        "to": { "left": 300, "top": 200 }
      }
    },
    {
      "type": "text",
      "text": "Jugador 1",
      "left": 150,
      "top": 120,
      "fontSize": 16,
      "fill": "#fff"
    }
  ],
  "background": "#ffffff"
}
```

#### 3. `user_planificacion_objetivos` (M-N Relationship)

```sql
CREATE TABLE user_planificacion_objetivos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    planificacion_id UUID NOT NULL REFERENCES user_planificaciones(id) ON DELETE CASCADE,
    objetivo_id UUID NOT NULL REFERENCES user_objetivos(id) ON DELETE CASCADE,
    semana_asignada INTEGER NOT NULL,
    orden INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(planificacion_id, objetivo_id, semana_asignada)
);
```

### Row Level Security (RLS) Policies

**CRITICAL:** All `user_*` tables must have RLS enabled.

```sql
-- Enable RLS
ALTER TABLE user_planificaciones ENABLE ROW LEVEL SECURITY;

-- SELECT policy
CREATE POLICY "Users can only see their own planificaciones"
ON user_planificaciones FOR SELECT
USING (auth.uid() = user_id);

-- INSERT policy
CREATE POLICY "Users can only insert their own planificaciones"
ON user_planificaciones FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- UPDATE policy
CREATE POLICY "Users can only update their own planificaciones"
ON user_planificaciones FOR UPDATE
USING (auth.uid() = user_id);

-- DELETE policy
CREATE POLICY "Users can only delete their own planificaciones"
ON user_planificaciones FOR DELETE
USING (auth.uid() = user_id);
```

### Triggers

**Auto-update `updated_at` timestamp:**

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_planificaciones_updated_at
BEFORE UPDATE ON user_planificaciones
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

### Full Schema Reference

For complete schema with all 13 tables, see:
**`/DocSportPlanner/docs/tecnico/ModeloDatos.md`** (1,000+ lines)

---

## Critical Documentation References

### Before Writing Code

| Task | Read This First | Why |
|------|----------------|-----|
| **Any implementation** | `/DocSportPlanner/EstadoProyecto.md` | Current status, next steps |
| **New API endpoint** | `/DocSportPlanner/docs/tecnico/04-api-contracts.md` | API specifications |
| **Database work** | `/DocSportPlanner/docs/tecnico/ModeloDatos.md` | Complete schema (13 tables) |
| **Tech stack questions** | `/DocSportPlanner/docs/tecnico/StackTecnologico.md` | Technologies, versions, costs |
| **New feature** | `/DocSportPlanner/docs/negocio/03-user-stories.md` | Acceptance criteria |
| **Architecture decision** | `/DocSportPlanner/docs/ADR/` | Understand "why" decisions |
| **Progression algorithm** | `/DocSportPlanner/docs/tecnico/05-algoritmo-progresion.md` | Critical feature logic |
| **AI agent protocols** | `/DocSportPlanner/instructions.md` | Validation protocols |
| **Business context** | `/DocSportPlanner/docs/negocio/01-vision-objetivos.md` | Vision, objectives, KPIs |

### Documentation Quality

**Completeness:**
- ✅ Vision & Objectives: 100%
- ✅ User Personas: 100%
- ✅ Data Model: 100%
- ✅ Tech Stack: 100%
- ✅ ADRs: 100%
- ⚠️ User Stories: 60%
- ⚠️ Business Model: 40%
- ⚠️ Roadmap: 30%

**Trust Level:**
The documentation in `/DocSportPlanner/` is **AUTHORITATIVE** and should be treated as the source of truth. When documentation conflicts with code, documentation is correct (code is incomplete).

---

## Common Tasks

### Task 1: Implement New API Endpoint

**Example: GET /api/planificaciones**

1. **Verify specification** in `/DocSportPlanner/docs/tecnico/04-api-contracts.md`

2. **Create Entity** (if not exists)

```csharp
// /back/SportPlanner/Models/Entities/Planificacion.cs
public class Planificacion
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string NombrePlanificacion { get; set; }
    // ... (see ModeloDatos.md for full schema)
}
```

3. **Create DTOs**

```csharp
// /back/SportPlanner/Models/Dtos/PlanificacionDto.cs
public class PlanificacionDto
{
    public Guid Id { get; set; }
    public string NombrePlanificacion { get; set; }
    public DateTime FechaInicio { get; set; }
    public DateTime FechaFin { get; set; }
}
```

4. **Create Repository Interface**

```csharp
// /back/SportPlanner/Repositories/IPlanificacionRepository.cs
public interface IPlanificacionRepository
{
    Task<List<Planificacion>> GetAllByUserIdAsync(Guid userId);
    Task<Planificacion?> GetByIdAsync(Guid id, Guid userId);
    Task<Planificacion> CreateAsync(Planificacion planificacion);
    Task<Planificacion> UpdateAsync(Planificacion planificacion);
    Task DeleteAsync(Guid id, Guid userId);
}
```

5. **Implement Repository**

```csharp
// /back/SportPlanner/Repositories/PlanificacionRepository.cs
public class PlanificacionRepository : IPlanificacionRepository
{
    private readonly AppDbContext _context;

    public PlanificacionRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Planificacion>> GetAllByUserIdAsync(Guid userId)
    {
        return await _context.Planificaciones
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync();
    }
}
```

6. **Create Service Interface**

```csharp
// /back/SportPlanner/Services/IPlanificacionService.cs
public interface IPlanificacionService
{
    Task<List<PlanificacionDto>> GetAllAsync(Guid userId);
    Task<PlanificacionDto?> GetByIdAsync(Guid id, Guid userId);
    Task<PlanificacionDto> CreateAsync(CrearPlanificacionDto dto, Guid userId);
}
```

7. **Implement Service**

```csharp
// /back/SportPlanner/Services/PlanificacionService.cs
public class PlanificacionService : IPlanificacionService
{
    private readonly IPlanificacionRepository _repository;
    private readonly IMapper _mapper;

    public PlanificacionService(
        IPlanificacionRepository repository,
        IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<List<PlanificacionDto>> GetAllAsync(Guid userId)
    {
        var planificaciones = await _repository.GetAllByUserIdAsync(userId);
        return _mapper.Map<List<PlanificacionDto>>(planificaciones);
    }
}
```

8. **Create Controller**

```csharp
// /back/SportPlanner/Controllers/PlanificacionesController.cs
[ApiController]
[Route("api/[controller]")]
[Authorize]  // Requires JWT
public class PlanificacionesController : ControllerBase
{
    private readonly IPlanificacionService _service;

    public PlanificacionesController(IPlanificacionService service)
    {
        _service = service;
    }

    /// <summary>
    /// Obtiene todas las planificaciones del usuario autenticado
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(List<PlanificacionDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<PlanificacionDto>>> GetAll()
    {
        var userId = Guid.Parse(User.FindFirst("sub")?.Value!);
        var planificaciones = await _service.GetAllAsync(userId);
        return Ok(planificaciones);
    }
}
```

9. **Register in DI Container** (`Program.cs`)

```csharp
builder.Services.AddScoped<IPlanificacionRepository, PlanificacionRepository>();
builder.Services.AddScoped<IPlanificacionService, PlanificacionService>();
```

10. **Test in Swagger** at `https://localhost:7146/swagger`

### Task 2: Add EF Core Migration

```bash
cd /home/user/SportPlanner/back/SportPlanner

# Add migration
dotnet ef migrations add AgregarTablaPlanificaciones

# Review generated file in /Migrations/

# Apply to database
dotnet ef database update
```

### Task 3: Implement Progression Algorithm

**This is a CRITICAL feature** - See `/DocSportPlanner/docs/tecnico/05-algoritmo-progresion.md`

**Goal:** Distribute training objectives across weeks based on:
- Objective difficulty (iniciación → perfeccionamiento)
- Dependency tree (parent-child relationships)
- Week distribution preferences

**Algorithm steps:**

1. Load all selected objectives
2. Build dependency tree (parents must come before children)
3. Sort by difficulty level and dependencies
4. Distribute across weeks proportionally
5. Return week assignments

**Implementation location:**
- `/back/SportPlanner/Services/AlgoritmoProgresion.cs`

### Task 4: Create Angular Component (Future)

```bash
cd /home/user/SportPlanner/frontend

# Generate standalone component
ng generate component features/planificaciones/planificacion-list --standalone

# Generate service
ng generate service features/planificaciones/services/planificacion

# Files created:
# - planificacion-list.component.ts
# - planificacion-list.component.html
# - planificacion-list.component.scss
# - planificacion-list.component.spec.ts
# - planificacion.service.ts
```

### Task 5: Setup Supabase Project

1. Create Supabase project at https://supabase.com
2. Copy project URL and anon key
3. Run SQL migrations from `/DocSportPlanner/docs/tecnico/ModeloDatos.md`
4. Enable RLS on all `user_*` tables
5. Create RLS policies (SELECT, INSERT, UPDATE, DELETE)
6. Set up triggers for `updated_at`
7. Configure Storage bucket for exercise thumbnails
8. Update backend connection string in `appsettings.json`

---

## Testing Strategy

### Backend Testing (Planned - Not Implemented)

**Framework:** xUnit + Moq + FluentAssertions

**Test Structure:**

```
/back/SportPlanner.Tests/
├── Unit/
│   ├── Services/
│   │   ├── PlanificacionServiceTests.cs
│   │   └── AlgoritmoProgresionTests.cs
│   └── Validators/
│       └── CrearPlanificacionDtoValidatorTests.cs
│
├── Integration/
│   ├── Controllers/
│   │   └── PlanificacionesControllerTests.cs
│   └── Repositories/
│       └── PlanificacionRepositoryTests.cs
│
└── E2E/
    └── PlanificacionFlowTests.cs
```

**Example Unit Test:**

```csharp
public class PlanificacionServiceTests
{
    private readonly Mock<IPlanificacionRepository> _mockRepo;
    private readonly Mock<IMapper> _mockMapper;
    private readonly PlanificacionService _service;

    public PlanificacionServiceTests()
    {
        _mockRepo = new Mock<IPlanificacionRepository>();
        _mockMapper = new Mock<IMapper>();
        _service = new PlanificacionService(_mockRepo.Object, _mockMapper.Object);
    }

    [Fact]
    public async Task GetAllAsync_DebeRetornarPlanificacionesDelUsuario()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var planificaciones = new List<Planificacion> { /* ... */ };
        _mockRepo.Setup(r => r.GetAllByUserIdAsync(userId))
            .ReturnsAsync(planificaciones);

        // Act
        var result = await _service.GetAllAsync(userId);

        // Assert
        result.Should().NotBeNull();
        result.Should().HaveCount(planificaciones.Count);
    }
}
```

### Frontend Testing (Planned - Not Implemented)

**Framework:** Jest + Angular Testing Library + Cypress

**Test Structure:**

```
/frontend/src/app/features/planificaciones/
├── components/
│   ├── planificacion-list/
│   │   ├── planificacion-list.component.ts
│   │   └── planificacion-list.component.spec.ts  # Unit tests
└── services/
    ├── planificacion.service.ts
    └── planificacion.service.spec.ts              # Service tests

/frontend/cypress/e2e/
└── planificaciones.cy.ts                          # E2E tests
```

**Example Component Test:**

```typescript
describe('PlanificacionListComponent', () => {
  let component: PlanificacionListComponent;
  let fixture: ComponentFixture<PlanificacionListComponent>;
  let mockService: jasmine.SpyObj<PlanificacionService>;

  beforeEach(() => {
    mockService = jasmine.createSpyObj('PlanificacionService', ['getAll']);

    TestBed.configureTestingModule({
      imports: [PlanificacionListComponent],
      providers: [
        { provide: PlanificacionService, useValue: mockService }
      ]
    });

    fixture = TestBed.createComponent(PlanificacionListComponent);
    component = fixture.componentInstance;
  });

  it('debe cargar planificaciones al inicializar', () => {
    const mockPlanificaciones = [/* ... */];
    mockService.getAll.and.returnValue(of(mockPlanificaciones));

    fixture.detectChanges();

    expect(component.planificaciones()).toEqual(mockPlanificaciones);
  });
});
```

### Testing Commands

```bash
# Backend tests
cd /home/user/SportPlanner/back/SportPlanner.Tests
dotnet test

# Frontend unit tests
cd /home/user/SportPlanner/frontend
npm run test

# Frontend E2E tests
npm run e2e

# Coverage report
npm run test:coverage
```

---

## Deployment

### Infrastructure (Planned)

| Component | Platform | URL Pattern |
|-----------|----------|-------------|
| Frontend | Vercel | `https://sportplanner.vercel.app` |
| Backend | Railway | `https://sportplanner-api.railway.app` |
| Database | Supabase | `<project-id>.supabase.co` |

### Environment Variables

#### Backend (Railway)

```bash
# Database
ConnectionStrings__DefaultConnection=<postgres-connection-string>

# Supabase
SupabaseUrl=https://<project-id>.supabase.co
SupabaseKey=<supabase-anon-key>
SupabaseServiceKey=<supabase-service-key>

# JWT
JwtSecret=<jwt-secret-key>
JwtIssuer=https://sportplanner-api.railway.app
JwtAudience=https://sportplanner.vercel.app

# CORS
AllowedOrigins=https://sportplanner.vercel.app

# Logging
ASPNETCORE_ENVIRONMENT=Production
Serilog__MinimumLevel=Information
```

#### Frontend (Vercel)

```bash
# Supabase
SUPABASE_URL=https://<project-id>.supabase.co
SUPABASE_ANON_KEY=<supabase-anon-key>

# Backend API
API_BASE_URL=https://sportplanner-api.railway.app
```

### Deployment Commands

#### Backend (Railway)

```bash
# Railway CLI deployment
railway up

# Or use GitHub integration (push to main branch)
git push origin main
```

#### Frontend (Vercel)

```bash
# Vercel CLI deployment
vercel --prod

# Or use GitHub integration (push to main branch)
git push origin main
```

### CI/CD Pipeline (Planned - GitHub Actions)

**`.github/workflows/backend-ci.yml`:**

```yaml
name: Backend CI

on:
  push:
    branches: [main]
    paths:
      - 'back/**'
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-dotnet@v3
        with:
          dotnet-version: '8.0.x'
      - name: Restore
        run: dotnet restore back/SportPlanner.sln
      - name: Build
        run: dotnet build back/SportPlanner.sln --no-restore
      - name: Test
        run: dotnet test back/SportPlanner.sln --no-build
```

**`.github/workflows/frontend-ci.yml`:**

```yaml
name: Frontend CI

on:
  push:
    branches: [main]
    paths:
      - 'frontend/**'
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install
        run: npm ci
        working-directory: ./frontend
      - name: Lint
        run: npm run lint
        working-directory: ./frontend
      - name: Test
        run: npm run test:ci
        working-directory: ./frontend
      - name: Build
        run: npm run build
        working-directory: ./frontend
```

---

## Appendix: Quick Reference

### Useful Commands

```bash
# Backend
dotnet run                              # Run API
dotnet watch run                        # Run with hot reload
dotnet ef migrations add <Name>         # Add migration
dotnet ef database update               # Apply migrations
dotnet test                             # Run tests
dotnet build                            # Build project

# Frontend (future)
ng serve                                # Run dev server
ng build --configuration production     # Production build
ng test                                 # Run unit tests
ng e2e                                  # Run E2E tests
ng generate component <name>            # Generate component

# Git
git checkout -b claude/claude-md-<session-id>  # Create branch
git add .                               # Stage changes
git commit -m "feat: <descripción>"     # Commit (Spanish)
git push -u origin <branch-name>        # Push to remote

# Database
psql <connection-string>                # Connect to PostgreSQL
\dt                                     # List tables
\d <table-name>                         # Describe table
```

### Port Reference

| Service | HTTP | HTTPS |
|---------|------|-------|
| Backend | 5269 | 7146 |
| Frontend | 4200 | - |
| Swagger UI | - | 7146/swagger |

### Critical Files Checklist

Before making changes, verify:

- [ ] `/DocSportPlanner/EstadoProyecto.md` - Am I working on the right task?
- [ ] `/DocSportPlanner/docs/tecnico/04-api-contracts.md` - Does API contract exist?
- [ ] `/DocSportPlanner/docs/tecnico/ModeloDatos.md` - Does schema match?
- [ ] `/DocSportPlanner/instructions.md` - Are validation protocols followed?
- [ ] `/.github/copilot-instructions.md` - Are conventions respected?

### Contact & Support

- **Documentation Issues:** Check `/DocSportPlanner/EstadoProyecto.md` for known gaps
- **Architecture Questions:** Review `/DocSportPlanner/docs/ADR/`
- **Tech Stack Clarifications:** See `/DocSportPlanner/docs/tecnico/StackTecnologico.md`

---

## Document Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-11-20 | Initial CLAUDE.md creation based on comprehensive repository analysis |

---

**Last AI Analysis:** 2025-11-20
**AI Assistant:** Claude (Anthropic)
**Analysis Depth:** Very Thorough (explored all directories, read 15+ documentation files)
**Documentation Quality:** Exceptional (90% complete, well-organized)
**Implementation Status:** Pre-MVP (5% code, 90% docs)

---

## For AI Assistants: How to Use This Document

1. **Read this file first** when starting work on SportPlanner
2. **Navigate to specific documentation** using the [Critical Documentation References](#critical-documentation-references) table
3. **Follow conventions strictly** - Spanish language, naming patterns, architecture
4. **Validate against documentation** - If code conflicts with docs, docs are correct
5. **Ask for clarification** if documentation is missing or unclear
6. **Update this file** if you discover new patterns or conventions

**Remember:** This is a **documentation-first** project. The extensive docs in `/DocSportPlanner/` are the source of truth. Code is being built to match the docs, not the other way around.
