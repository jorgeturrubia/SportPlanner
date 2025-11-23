# SportPlanner Backend - Guía para Agentes de IA

**Última actualización:** Noviembre 2025  
**Stack:** .NET 10 + C# 14 + EF Core 10 + PostgreSQL  
**Arquitectura:** Clean Architecture (Monolítica)

---

## 📋 Tabla de Contenidos

1. [Contexto del Proyecto](#contexto-del-proyecto)
2. [Arquitectura y Estructura](#arquitectura-y-estructura)
3. [Mejores Prácticas Obligatorias](#mejores-prácticas-obligatorias)
4. [Flujo de Trabajo para Nuevas Funcionalidades](#flujo-de-trabajo-para-nuevas-funcionalidades)
5. [Patrones y Convenciones](#patrones-y-convenciones)
6. [Validación y Testing](#validación-y-testing)
7. [Ejemplos de Implementación](#ejemplos-de-implementación)
8. [Checklist Pre-Commit](#checklist-pre-commit)

---

## 🎯 Contexto del Proyecto

SportPlanner es una aplicación monolítica backend construida con .NET 10 que sigue **Clean Architecture** para gestionar planificación deportiva, equipos, sesiones de entrenamiento y conceptos deportivos.

### Archivos de Referencia Obligatorios

**ANTES de crear/modificar código backend, debes consultar:**

#### 📘 Mejores Prácticas y Configuración Técnica

1. **`back/dotnet10-best-practices.md`** - Mejores prácticas de .NET 10, patrones de diseño, arquitectura, infraestructura y antipatrones a evitar.
2. **`back/SportPlanner/Program.cs`** - Entry point, configuración de DI, AutoMapper y EF Core.
3. **`back/SportPlanner/README.md`** - Workflow de desarrollo local y migraciones.

#### 📐 Arquitectura y Stack Tecnológico

4. **`DocSportPlanner/docs/tecnico/StackTecnologico.md`** - Stack tecnológico y decisiones arquitectónicas.
5. **`DocSportPlanner/docs/tecnico/ModeloDatos.md`** - Modelo de datos y rationale.
6. **`DocSportPlanner/docs/arquitectura/`** - Diagramas y decisiones arquitectónicas (ADR).

#### 💼 Contexto de Negocio y Dominio

7. **`DocSportPlanner/docs/01-vision-negocio.md`** - Visión general del negocio, objetivos y alcance del proyecto.
8. **`DocSportPlanner/docs/negocio/`** - Reglas de negocio, casos de uso y requisitos funcionales específicos del dominio deportivo.
9. **`DocSportPlanner/README.md`** - Introducción al proyecto y estado actual.
10. **`DocSportPlanner/EstadoProyecto.md`** - Estado actual del desarrollo y roadmap.
11. **`DocSportPlanner/backlog/backlog.yaml`** - Backlog de funcionalidades y tareas pendientes.

**⚠️ Importante:** La documentación en `DocSportPlanner/` contiene información crítica sobre las reglas de negocio, terminología del dominio deportivo y requisitos funcionales. Consúltala para entender el contexto antes de implementar funcionalidades relacionadas con conceptos deportivos, planificación de entrenamientos, o gestión de equipos.

---

## 🏗️ Arquitectura y Estructura

### Estructura de Carpetas (Clean Architecture)

```
back/SportPlanner/
├── Program.cs                    # Entry point, DI, configuración
├── appsettings.json              # Configuración base (NO SECRETOS)
├── appsettings.Development.json  # Config local
│
├── Controllers/                  # Capa de Presentación (WebAPI)
│   ├── AuthController.cs
│   ├── TeamsController.cs
│   └── ...
│
├── Application/                  # Capa de Aplicación (Casos de Uso)
│   ├── DTOs/                    # Data Transfer Objects
│   ├── Mappings/                # AutoMapper Profiles
│   └── Validators/              # FluentValidation Validators
│
├── Models/                       # Capa de Dominio (Entidades)
│   ├── ApplicationUser.cs
│   ├── Team.cs
│   ├── SportConcept.cs
│   └── ...
│
├── Data/                         # Capa de Infraestructura (EF Core)
│   └── AppDbContext.cs          # DbContext principal
│
├── Migrations/                   # EF Core Migrations
│   └── ...
│
├── Middleware/                   # Middleware personalizado
│   └── AuthenticatedUserMiddleware.cs
│
└── Services/                     # Servicios de aplicación
    └── ...
```

### Principios Arquitectónicos

1. **Separation of Concerns:** Cada capa tiene una responsabilidad única.
2. **Dependency Rule:** Las dependencias apuntan hacia el dominio (Models).
3. **DTO-First:** NUNCA exponer entidades EF Core directamente en APIs.
4. **Repository Pattern:** Para lógica de persistencia compleja.
5. **AutoMapper:** Para mapeo entre entidades y DTOs.

---

## ✅ Mejores Prácticas Obligatorias

### 1. Consultar `dotnet10-best-practices.md` SIEMPRE

**Antes de escribir código, revisa:**

- ✅ Configuración base .NET 10
- ✅ Patrones arquitectónicos (CQRS, DDD, Repository, Unit of Work)
- ✅ Patrones de diseño (DI, Mediator, Specification, Factory)
- ✅ Infraestructura y persistencia (EF Core 10)
- ✅ Async/Await correcto
- ✅ Validación con FluentValidation
- ✅ Logging estructurado (Serilog)
- ✅ Error handling con Result Pattern
- ✅ Seguridad (JWT, SQL Injection, XSS, CSRF)
- ✅ Performance (Span<T>, ValueTask, Query Optimization)
- ❌ **Antipatrones a EVITAR** (God Class, Magic Strings, N+1 Queries, etc.)

### 2. Reglas de DTOs y AutoMapper

**Regla de oro:** NUNCA exponer entidades EF Core como contratos de API.

#### Ejemplo Correcto

```csharp
// ❌ MAL - Exponer entidad directamente
[HttpGet("{id}")]
public async Task<ActionResult<Team>> GetTeam(int id)
{
    return await _context.Teams.FindAsync(id); // ¡NUNCA!
}

// ✅ BIEN - Usar DTO
[HttpGet("{id}")]
public async Task<ActionResult<TeamDto>> GetTeam(int id)
{
    var team = await _context.Teams.FindAsync(id);
    return team == null 
        ? NotFound() 
        : Ok(_mapper.Map<TeamDto>(team));
}
```

#### Crear DTOs

**Ubicación:** `Application/DTOs/`

```csharp
// Application/DTOs/TeamDto.cs
namespace SportPlanner.Application.DTOs;

public record TeamDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Category { get; init; }
    public string? Level { get; init; }
}

public record CreateTeamDto
{
    public string Name { get; init; } = string.Empty;
    public int? CategoryId { get; init; }
    public int? LevelId { get; init; }
}

public record UpdateTeamDto
{
    public string? Name { get; init; }
    public int? CategoryId { get; init; }
    public int? LevelId { get; init; }
}
```

#### Crear Mappings (AutoMapper Profile)

**Ubicación:** `Application/Mappings/`

```csharp
// Application/Mappings/TeamMappingProfile.cs
using AutoMapper;
using SportPlanner.Application.DTOs;
using SportPlanner.Models;

namespace SportPlanner.Application.Mappings;

public class TeamMappingProfile : Profile
{
    public TeamMappingProfile()
    {
        // Entity -> DTO
        CreateMap<Team, TeamDto>()
            .ForMember(dest => dest.Category, 
                opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null))
            .ForMember(dest => dest.Level, 
                opt => opt.MapFrom(src => src.Level != null ? src.Level.Name : null));

        // CreateDto -> Entity
        CreateMap<CreateTeamDto, Team>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());

        // UpdateDto -> Entity (solo actualizar propiedades no nulas)
        CreateMap<UpdateTeamDto, Team>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}
```

**Registrar AutoMapper en `Program.cs`:**

```csharp
// Ya registrado en Program.cs
builder.Services.AddAutoMapper(typeof(Program).Assembly);
```

### 3. Reglas de Validación

**Usar FluentValidation** para validación de DTOs.

**Ubicación:** `Application/Validators/`

```csharp
// Application/Validators/CreateTeamDtoValidator.cs
using FluentValidation;
using SportPlanner.Application.DTOs;

namespace SportPlanner.Application.Validators;

public class CreateTeamDtoValidator : AbstractValidator<CreateTeamDto>
{
    public CreateTeamDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("El nombre del equipo es obligatorio")
            .MaximumLength(100).WithMessage("El nombre no puede exceder 100 caracteres");

        RuleFor(x => x.CategoryId)
            .GreaterThan(0).When(x => x.CategoryId.HasValue)
            .WithMessage("CategoryId debe ser mayor que 0");

        RuleFor(x => x.LevelId)
            .GreaterThan(0).When(x => x.LevelId.HasValue)
            .WithMessage("LevelId debe ser mayor que 0");
    }
}
```

**Registrar FluentValidation en `Program.cs`:**

```csharp
using FluentValidation;
using FluentValidation.AspNetCore;

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
```

### 4. Entity Framework Core - Mejores Prácticas

#### Configuración de Entidades

**Ubicación:** `Data/AppDbContext.cs` o en clases `IEntityTypeConfiguration<T>` separadas.

```csharp
// Data/Configurations/TeamConfiguration.cs
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SportPlanner.Models;

namespace SportPlanner.Data.Configurations;

public class TeamConfiguration : IEntityTypeConfiguration<Team>
{
    public void Configure(EntityTypeBuilder<Team> builder)
    {
        builder.ToTable("Teams");
        
        builder.HasKey(t => t.Id);
        
        builder.Property(t => t.Name)
            .IsRequired()
            .HasMaxLength(100);
        
        builder.Property(t => t.CreatedAt)
            .HasDefaultValueSql("CURRENT_TIMESTAMP");
        
        builder.HasOne(t => t.Category)
            .WithMany()
            .HasForeignKey(t => t.CategoryId)
            .OnDelete(DeleteBehavior.SetNull);
        
        builder.HasOne(t => t.Level)
            .WithMany()
            .HasForeignKey(t => t.LevelId)
            .OnDelete(DeleteBehavior.SetNull);
        
        builder.HasIndex(t => t.Name);
    }
}

// Aplicar en AppDbContext
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.ApplyConfiguration(new TeamConfiguration());
    // O aplicar todas automáticamente:
    modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
}
```

#### Evitar N+1 Queries

```csharp
// ❌ MAL - N+1 Query
var teams = await _context.Teams.ToListAsync();
foreach (var team in teams)
{
    var members = await _context.TeamMembers.Where(m => m.TeamId == team.Id).ToListAsync();
}

// ✅ BIEN - Eager Loading
var teams = await _context.Teams
    .Include(t => t.Members)
    .Include(t => t.Category)
    .Include(t => t.Level)
    .ToListAsync();
```

#### Proyecciones (Select) en lugar de Include cuando sea posible

```csharp
// ✅ MEJOR - Solo traer lo necesario
var teamDtos = await _context.Teams
    .Select(t => new TeamDto
    {
        Id = t.Id,
        Name = t.Name,
        Category = t.Category != null ? t.Category.Name : null,
        Level = t.Level != null ? t.Level.Name : null
    })
    .ToListAsync();
```

### 5. Controllers - Mantenerlos Delgados

Los controllers deben ser **thin** - solo routing, validación básica y llamar a servicios.

```csharp
[ApiController]
[Route("api/[controller]")]
public class TeamsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<TeamsController> _logger;

    public TeamsController(
        AppDbContext context, 
        IMapper mapper, 
        ILogger<TeamsController> logger)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TeamDto>>> GetTeams()
    {
        var teams = await _context.Teams
            .Include(t => t.Category)
            .Include(t => t.Level)
            .ToListAsync();

        return Ok(_mapper.Map<IEnumerable<TeamDto>>(teams));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TeamDto>> GetTeam(int id)
    {
        var team = await _context.Teams
            .Include(t => t.Category)
            .Include(t => t.Level)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (team == null)
        {
            _logger.LogWarning("Team with ID {TeamId} not found", id);
            return NotFound();
        }

        return Ok(_mapper.Map<TeamDto>(team));
    }

    [HttpPost]
    public async Task<ActionResult<TeamDto>> CreateTeam(CreateTeamDto dto)
    {
        var team = _mapper.Map<Team>(dto);
        team.CreatedAt = DateTime.UtcNow;

        _context.Teams.Add(team);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Team created with ID {TeamId}", team.Id);

        var teamDto = _mapper.Map<TeamDto>(team);
        return CreatedAtAction(nameof(GetTeam), new { id = team.Id }, teamDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTeam(int id, UpdateTeamDto dto)
    {
        var team = await _context.Teams.FindAsync(id);
        if (team == null)
        {
            return NotFound();
        }

        _mapper.Map(dto, team);
        team.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation("Team with ID {TeamId} updated", id);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTeam(int id)
    {
        var team = await _context.Teams.FindAsync(id);
        if (team == null)
        {
            return NotFound();
        }

        _context.Teams.Remove(team);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Team with ID {TeamId} deleted", id);

        return NoContent();
    }
}
```

### 6. Migraciones de EF Core

**Workflow obligatorio:**

```powershell
# 1. Navegar al directorio del proyecto
cd back/SportPlanner

# 2. Asegurar que dotnet-ef está instalado localmente
dotnet new tool-manifest --force
dotnet tool install --local dotnet-ef --version 10.*

# 3. Crear una migración
dotnet tool run dotnet-ef migrations add NombreDeLaMigracion

# 4. Revisar la migración generada en Migrations/

# 5. Aplicar la migración a la BD local
dotnet tool run dotnet-ef database update

# 6. Si hay errores, eliminar la última migración
dotnet tool run dotnet-ef migrations remove
```

**NUNCA modifiques la base de datos directamente - siempre usa migraciones.**

---

## 🔄 Flujo de Trabajo para Nuevas Funcionalidades

### Tareas Pequeñas (1-2 archivos)

Puedes implementar directamente:
- Agregar una propiedad a un DTO existente
- Crear un endpoint simple CRUD
- Añadir una validación a un validator existente

### Tareas Medianas (3-10 archivos)

1. **Planificar** - Crear un plan breve (2-3 fases)
2. **Implementar por fases:**
   - Fase 1: Modelo y Migración
   - Fase 2: DTOs y Mappings
   - Fase 3: Controller y Validadores
3. **Validar** - Probar con `dotnet build` y `dotnet run`

### Tareas Grandes (>10 archivos o múltiples capas)

Usar el template de instrucciones para agentes con frontmatter YAML.

**Ubicación:** `.github/ISSUE_TEMPLATE/agent_task.md` o `PULL_REQUEST_TEMPLATE.md`

**Generar template local:**

```powershell
.\tools\generate-agent-instruction.ps1
```

**Estructura del template:**

```yaml
---
agent: copilot
task_type: feature | bugfix | refactor | test
priority: high | medium | low
estimated_files: number
---

# Título de la Tarea

## Descripción
Descripción detallada de la funcionalidad a implementar.

## Fases de Implementación

### Fase 1: Domain Layer
- [ ] Crear entidades en `Models/`
- [ ] Configurar EF Core en `Data/`
- [ ] Crear y aplicar migración

### Fase 2: Application Layer
- [ ] Crear DTOs en `Application/DTOs/`
- [ ] Crear Mappings en `Application/Mappings/`
- [ ] Crear Validators en `Application/Validators/`

### Fase 3: API Layer
- [ ] Crear Controller en `Controllers/`
- [ ] Documentar endpoints (Swagger)

### Fase 4: Testing
- [ ] Tests unitarios
- [ ] Tests de integración

## Archivos Afectados
- `Models/NuevaEntidad.cs`
- `Data/AppDbContext.cs`
- `Application/DTOs/NuevaEntidadDto.cs`
- ...

## Criterios de Aceptación
- [ ] Build exitoso (`dotnet build`)
- [ ] Migración aplicada correctamente
- [ ] Endpoints funcionando
- [ ] Validaciones implementadas
- [ ] Tests pasando
```

---

## 🎨 Patrones y Convenciones

### Nombres de Archivos y Clases

- **Entidades (Models/):** `PascalCase`, singular (e.g., `Team.cs`, `SportConcept.cs`)
- **DTOs:** Sufijo `Dto` (e.g., `TeamDto`, `CreateTeamDto`, `UpdateTeamDto`)
- **Validators:** Sufijo `Validator` (e.g., `CreateTeamDtoValidator`)
- **Controllers:** Sufijo `Controller`, plural (e.g., `TeamsController`)
- **Mappings:** Sufijo `MappingProfile` (e.g., `TeamMappingProfile`)

### Convenciones de Código

```csharp
// ✅ BIEN - Record para DTOs inmutables
public record TeamDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
}

// ✅ BIEN - Async/Await siempre
public async Task<ActionResult<TeamDto>> GetTeam(int id)
{
    var team = await _context.Teams.FindAsync(id);
    return Ok(_mapper.Map<TeamDto>(team));
}

// ✅ BIEN - Usar nullable reference types
public string? Description { get; set; }

// ✅ BIEN - Logging estructurado
_logger.LogInformation("Team {TeamId} created by user {UserId}", teamId, userId);

// ❌ MAL - Magic strings
if (user.Role == "admin") { }

// ✅ BIEN - Enums o constantes
public enum UserRole { Admin, User, Guest }
if (user.Role == UserRole.Admin) { }
```

### Dependency Injection

**Siempre usar constructor injection:**

```csharp
public class TeamsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<TeamsController> _logger;

    public TeamsController(
        AppDbContext context, 
        IMapper mapper, 
        ILogger<TeamsController> logger)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }
}
```

**Registrar servicios en `Program.cs`:**

```csharp
// DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// AutoMapper
builder.Services.AddAutoMapper(typeof(Program).Assembly);

// FluentValidation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// Servicios personalizados
builder.Services.AddScoped<ITeamService, TeamService>();
```

---

## 🧪 Validación y Testing

### Tests Unitarios

**Ubicación:** `back/SportPlanner.Tests/`

```csharp
// Tests/Validators/CreateTeamDtoValidatorTests.cs
using FluentValidation.TestHelper;
using SportPlanner.Application.DTOs;
using SportPlanner.Application.Validators;
using Xunit;

namespace SportPlanner.Tests.Validators;

public class CreateTeamDtoValidatorTests
{
    private readonly CreateTeamDtoValidator _validator;

    public CreateTeamDtoValidatorTests()
    {
        _validator = new CreateTeamDtoValidator();
    }

    [Fact]
    public void Should_Have_Error_When_Name_Is_Empty()
    {
        var dto = new CreateTeamDto { Name = "" };
        var result = _validator.TestValidate(dto);
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Should_Not_Have_Error_When_Name_Is_Valid()
    {
        var dto = new CreateTeamDto { Name = "Team A" };
        var result = _validator.TestValidate(dto);
        result.ShouldNotHaveValidationErrorFor(x => x.Name);
    }
}
```

### Tests de Integración

```csharp
// Tests/Integration/TeamsControllerTests.cs
using Microsoft.AspNetCore.Mvc.Testing;
using SportPlanner.Application.DTOs;
using System.Net;
using System.Net.Http.Json;
using Xunit;

namespace SportPlanner.Tests.Integration;

public class TeamsControllerTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public TeamsControllerTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task GetTeams_ReturnsSuccessStatusCode()
    {
        var response = await _client.GetAsync("/api/teams");
        response.EnsureSuccessStatusCode();
    }

    [Fact]
    public async Task CreateTeam_WithValidData_ReturnsCreated()
    {
        var dto = new CreateTeamDto { Name = "Test Team" };
        var response = await _client.PostAsJsonAsync("/api/teams", dto);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }
}
```

---

## 📝 Ejemplos de Implementación

### Ejemplo Completo: Agregar Entidad `Player`

#### 1. Crear Entidad (Models/Player.cs)

```csharp
namespace SportPlanner.Models;

public class Player
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Email { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public int? TeamId { get; set; }
    public Team? Team { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
```

#### 2. Actualizar DbContext

```csharp
// Data/AppDbContext.cs
public DbSet<Player> Players => Set<Player>();

protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    // ... código existente ...
    
    modelBuilder.Entity<Player>(entity =>
    {
        entity.ToTable("Players");
        entity.HasKey(p => p.Id);
        entity.Property(p => p.Name).IsRequired().HasMaxLength(100);
        entity.Property(p => p.Email).HasMaxLength(100);
        entity.HasOne(p => p.Team)
            .WithMany()
            .HasForeignKey(p => p.TeamId)
            .OnDelete(DeleteBehavior.SetNull);
        entity.HasIndex(p => p.Email);
    });
}
```

#### 3. Crear Migración

```powershell
cd back/SportPlanner
dotnet tool run dotnet-ef migrations add AddPlayerEntity
dotnet tool run dotnet-ef database update
```

#### 4. Crear DTOs

```csharp
// Application/DTOs/PlayerDto.cs
namespace SportPlanner.Application.DTOs;

public record PlayerDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string? Email { get; init; }
    public DateTime? DateOfBirth { get; init; }
    public int? TeamId { get; init; }
    public string? TeamName { get; init; }
}

public record CreatePlayerDto
{
    public string Name { get; init; } = string.Empty;
    public string? Email { get; init; }
    public DateTime? DateOfBirth { get; init; }
    public int? TeamId { get; init; }
}

public record UpdatePlayerDto
{
    public string? Name { get; init; }
    public string? Email { get; init; }
    public DateTime? DateOfBirth { get; init; }
    public int? TeamId { get; init; }
}
```

#### 5. Crear Mapping Profile

```csharp
// Application/Mappings/PlayerMappingProfile.cs
using AutoMapper;
using SportPlanner.Application.DTOs;
using SportPlanner.Models;

namespace SportPlanner.Application.Mappings;

public class PlayerMappingProfile : Profile
{
    public PlayerMappingProfile()
    {
        CreateMap<Player, PlayerDto>()
            .ForMember(dest => dest.TeamName, 
                opt => opt.MapFrom(src => src.Team != null ? src.Team.Name : null));

        CreateMap<CreatePlayerDto, Player>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());

        CreateMap<UpdatePlayerDto, Player>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}
```

#### 6. Crear Validator

```csharp
// Application/Validators/CreatePlayerDtoValidator.cs
using FluentValidation;
using SportPlanner.Application.DTOs;

namespace SportPlanner.Application.Validators;

public class CreatePlayerDtoValidator : AbstractValidator<CreatePlayerDto>
{
    public CreatePlayerDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("El nombre es obligatorio")
            .MaximumLength(100).WithMessage("El nombre no puede exceder 100 caracteres");

        RuleFor(x => x.Email)
            .EmailAddress().When(x => !string.IsNullOrEmpty(x.Email))
            .WithMessage("El email no es válido");

        RuleFor(x => x.DateOfBirth)
            .LessThan(DateTime.UtcNow).When(x => x.DateOfBirth.HasValue)
            .WithMessage("La fecha de nacimiento no puede ser futura");

        RuleFor(x => x.TeamId)
            .GreaterThan(0).When(x => x.TeamId.HasValue)
            .WithMessage("TeamId debe ser mayor que 0");
    }
}
```

#### 7. Crear Controller

```csharp
// Controllers/PlayersController.cs
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SportPlanner.Application.DTOs;
using SportPlanner.Data;
using SportPlanner.Models;

namespace SportPlanner.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PlayersController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<PlayersController> _logger;

    public PlayersController(
        AppDbContext context, 
        IMapper mapper, 
        ILogger<PlayersController> logger)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PlayerDto>>> GetPlayers()
    {
        var players = await _context.Players
            .Include(p => p.Team)
            .ToListAsync();

        return Ok(_mapper.Map<IEnumerable<PlayerDto>>(players));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PlayerDto>> GetPlayer(int id)
    {
        var player = await _context.Players
            .Include(p => p.Team)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (player == null)
        {
            _logger.LogWarning("Player with ID {PlayerId} not found", id);
            return NotFound();
        }

        return Ok(_mapper.Map<PlayerDto>(player));
    }

    [HttpPost]
    public async Task<ActionResult<PlayerDto>> CreatePlayer(CreatePlayerDto dto)
    {
        var player = _mapper.Map<Player>(dto);
        player.CreatedAt = DateTime.UtcNow;

        _context.Players.Add(player);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Player created with ID {PlayerId}", player.Id);

        var playerDto = _mapper.Map<PlayerDto>(player);
        return CreatedAtAction(nameof(GetPlayer), new { id = player.Id }, playerDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePlayer(int id, UpdatePlayerDto dto)
    {
        var player = await _context.Players.FindAsync(id);
        if (player == null)
        {
            return NotFound();
        }

        _mapper.Map(dto, player);
        player.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation("Player with ID {PlayerId} updated", id);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePlayer(int id)
    {
        var player = await _context.Players.FindAsync(id);
        if (player == null)
        {
            return NotFound();
        }

        _context.Players.Remove(player);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Player with ID {PlayerId} deleted", id);

        return NoContent();
    }
}
```

#### 8. Crear Tests

```csharp
// Tests/Validators/CreatePlayerDtoValidatorTests.cs
using FluentValidation.TestHelper;
using SportPlanner.Application.DTOs;
using SportPlanner.Application.Validators;
using Xunit;

namespace SportPlanner.Tests.Validators;

public class CreatePlayerDtoValidatorTests
{
    private readonly CreatePlayerDtoValidator _validator;

    public CreatePlayerDtoValidatorTests()
    {
        _validator = new CreatePlayerDtoValidator();
    }

    [Fact]
    public void Should_Have_Error_When_Name_Is_Empty()
    {
        var dto = new CreatePlayerDto { Name = "" };
        var result = _validator.TestValidate(dto);
        result.ShouldHaveValidationErrorFor(x => x.Name);
    }

    [Fact]
    public void Should_Have_Error_When_Email_Is_Invalid()
    {
        var dto = new CreatePlayerDto { Name = "John", Email = "invalid-email" };
        var result = _validator.TestValidate(dto);
        result.ShouldHaveValidationErrorFor(x => x.Email);
    }

    [Fact]
    public void Should_Not_Have_Error_When_All_Valid()
    {
        var dto = new CreatePlayerDto 
        { 
            Name = "John Doe", 
            Email = "john@example.com",
            DateOfBirth = DateTime.UtcNow.AddYears(-25)
        };
        var result = _validator.TestValidate(dto);
        result.ShouldNotHaveAnyValidationErrors();
    }
}
```

---

## ✅ Checklist Pre-Commit

Antes de hacer commit, asegúrate de:

- [ ] **Build exitoso:** `dotnet build` sin errores
- [ ] **No exponer entidades EF Core:** Solo DTOs en controllers
- [ ] **AutoMapper configurado:** Profile creado y registrado
- [ ] **FluentValidation implementada:** Validators para DTOs de entrada
- [ ] **Migraciones aplicadas:** `dotnet ef database update` ejecutado
- [ ] **Logging estructurado:** Usar `ILogger` con placeholders
- [ ] **Async/Await correcto:** NUNCA usar `.Result` o `.Wait()`
- [ ] **Consultar `dotnet10-best-practices.md`:** Verificar que no estás cometiendo antipatrones
- [ ] **Tests pasando:** `dotnet test` exitoso (si existen tests)
- [ ] **Nombres consistentes:** Seguir convenciones de nombres
- [ ] **No hay secretos en código:** Connection strings en `appsettings.Development.json` o variables de entorno
- [ ] **Documentación actualizada:** Si es necesario, actualizar README o docs

---

## 📚 Referencias Rápidas

### Comandos Frecuentes

```powershell
# Build
dotnet build

# Run (con hot reload)
dotnet watch run

# Tests
dotnet test

# EF Core Migrations
dotnet tool run dotnet-ef migrations add NombreMigracion
dotnet tool run dotnet-ef database update
dotnet tool run dotnet-ef migrations remove  # Si necesitas eliminar la última

# Restaurar dependencias
dotnet restore

# Limpiar build artifacts
dotnet clean
```

### Archivos Clave

| Archivo | Propósito |
|---------|-----------|
| `Program.cs` | Entry point, DI, configuración |
| `appsettings.json` | Config base (NO SECRETOS) |
| `appsettings.Development.json` | Config local de desarrollo |
| `Data/AppDbContext.cs` | EF Core DbContext |
| `dotnet10-best-practices.md` | **Mejores prácticas obligatorias** |

### Recursos Externos

- [.NET 10 Docs](https://learn.microsoft.com/en-us/dotnet/)
- [EF Core 10 Docs](https://learn.microsoft.com/en-us/ef/core/)
- [AutoMapper Docs](https://docs.automapper.org/)
- [FluentValidation Docs](https://docs.fluentvalidation.net/)
- [Clean Architecture by Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

## 🚀 Resumen Ejecutivo para Agentes

**Cuando te pidan crear/modificar código backend:**

### 📖 Antes de Programar

1. **Lee primero:** `back/dotnet10-best-practices.md` (patrones y antipatrones técnicos)
2. **Entiende el negocio:** `DocSportPlanner/docs/` (reglas de negocio, casos de uso, terminología del dominio)
3. **Revisa el modelo:** `DocSportPlanner/docs/tecnico/ModeloDatos.md` (entidades y relaciones)

### 🏗️ Al Implementar

4. **Usa DTOs:** NUNCA expongas entidades EF Core
5. **AutoMapper:** Crea `Profile` para mapeos
6. **FluentValidation:** Valida DTOs de entrada (incluye reglas de negocio)
7. **Migraciones:** Crea y aplica con `dotnet ef`
8. **Controllers delgados:** Solo routing y llamadas a servicios
9. **Async/Await:** Siempre asíncrono
10. **Logging estructurado:** Usa `ILogger` con placeholders
11. **Tests:** Unitarios y de integración
12. **Build antes de commit:** `dotnet build` exitoso

### 🎯 Checklist por Tipo de Tarea

**Funcionalidades relacionadas con el dominio deportivo** (conceptos, entrenamientos, equipos):
- [ ] Revisar `DocSportPlanner/docs/negocio/` para reglas de negocio
- [ ] Verificar terminología correcta en `DocSportPlanner/docs/01-vision-negocio.md`
- [ ] Validar que la implementación refleja las reglas del dominio
- [ ] Consultar `DocSportPlanner/backlog/backlog.yaml` para contexto de la funcionalidad

**Cambios en el modelo de datos**:
- [ ] Revisar `DocSportPlanner/docs/tecnico/ModeloDatos.md`
- [ ] Verificar coherencia con el dominio de negocio
- [ ] Documentar decisiones arquitectónicas si son significativas

**Tareas técnicas** (infraestructura, performance, seguridad):
- [ ] Seguir `back/dotnet10-best-practices.md` estrictamente
- [ ] Documentar ADR en `DocSportPlanner/docs/ADR/` si es necesario

### 📚 ¿Dónde buscar información?

| Pregunta | Archivo |
|----------|---------|
| ¿Cómo implementar X patrón? | `back/dotnet10-best-practices.md` |
| ¿Qué significa "concepto deportivo"? | `DocSportPlanner/docs/negocio/` |
| ¿Qué entidades existen? | `DocSportPlanner/docs/tecnico/ModeloDatos.md` |
| ¿Por qué usamos PostgreSQL? | `DocSportPlanner/docs/tecnico/StackTecnologico.md` |
| ¿Cuál es el estado del proyecto? | `DocSportPlanner/EstadoProyecto.md` |
| ¿Qué funcionalidades faltan? | `DocSportPlanner/backlog/backlog.yaml` |

**¿Tarea grande?** → Usa template con frontmatter YAML y fases.

**¿Dudas técnicas?** → Consulta `back/dotnet10-best-practices.md` para patrones y antipatrones.

**¿Dudas de negocio?** → Consulta `DocSportPlanner/docs/` para entender el dominio.

---

**¡Mantén el código limpio, seguro y mantenible! 🚀**
