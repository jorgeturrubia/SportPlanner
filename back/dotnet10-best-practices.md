# .NET 10: Mejores Prácticas, Patrones de Diseño, Arquitectura e Infraestructura

**Última actualización:** Noviembre 2025  
**Versión:** .NET 10 LTS (Long-Term Support hasta Nov 2028)  
**Lenguaje:** C# 14

---

## Tabla de Contenidos

1. [Configuración Base .NET 10](#configuración-base-net-10)
2. [Arquitectura y Patrones](#arquitectura-y-patrones)
3. [Patrones de Diseño](#patrones-de-diseño)
4. [Infraestructura y Persistencia](#infraestructura-y-persistencia)
5. [Mejores Prácticas](#mejores-prácticas)
6. [Antipatrones a Evitar](#antipatrones-a-evitar)
7. [Seguridad](#seguridad)
8. [Performance y Optimización](#performance-y-optimización)

---

## Configuración Base .NET 10

### Creación de Proyecto Recomendado

```bash
# Crear proyecto ASP.NET Core con .NET 10
dotnet new webapi -n MyApp -f net10.0

# Actualizar desde versiones anteriores
# Cambiar en .csproj
# <TargetFramework>net9.0</TargetFramework> → net10.0
```

### Configuración Inicial en Program.cs

**✅ Correcto - Estructura moderna (2025):**

```csharp
using MyApp.Infrastructure;
using MyApp.Application;
using OpenTelemetry;
using OpenTelemetry.Trace;

var builder = WebApplication.CreateBuilder(args);

// 1. Configuración de servicios
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

// 2. Logging y Observabilidad
builder.Services.AddOpenTelemetry()
    .WithTracing(tracingBuilder =>
    {
        tracingBuilder
            .AddAspNetCoreInstrumentation()
            .AddHttpClientInstrumentation()
            .AddEntityFrameworkCoreInstrumentation()
            .AddConsoleExporter();
    });

// 3. Validación automática
builder.Services.AddValidation();

// 4. CORS y Seguridad
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", policy =>
    {
        policy.WithOrigins("https://example.com")
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

// 5. API versioning
builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
});

var app = builder.Build();

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();
app.UseCors("AllowSpecificOrigins");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
```

### appsettings.json Seguro

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=MyDb;Trusted_Connection=true;"
  },
  "Jwt": {
    "SecretKey": "NOT_HARDCODED_SEE_USER_SECRETS",
    "Issuer": "your-app",
    "Audience": "your-app-users",
    "ExpirationMinutes": 60
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning"
    }
  },
  "AllowedHosts": "*"
}
```

---

## Arquitectura y Patrones

### Clean Architecture (Recomendado)

**Estructura de carpetas:**

```
MyApp/
├── src/
│   ├── MyApp.Domain/              # Núcleo del negocio
│   │   ├── Entities/
│   │   ├── ValueObjects/
│   │   ├── Interfaces/
│   │   ├── Services/
│   │   └── Specifications/
│   │
│   ├── MyApp.Application/          # Casos de uso
│   │   ├── DTOs/
│   │   ├── Commands/
│   │   ├── Queries/
│   │   ├── Handlers/
│   │   ├── Behaviors/
│   │   ├── Mappings/
│   │   └── Abstractions/
│   │
│   ├── MyApp.Infrastructure/       # Implementaciones técnicas
│   │   ├── Persistence/
│   │   ├── Repositories/
│   │   ├── ExternalServices/
│   │   ├── Messaging/
│   │   └── Configuration/
│   │
│   └── MyApp.API/                  # Presentación
│       ├── Controllers/
│       ├── Middleware/
│       ├── Extensions/
│       └── Program.cs
│
└── tests/
    ├── MyApp.UnitTests/
    ├── MyApp.IntegrationTests/
    └── MyApp.E2ETests/
```

### Patrones Arquitectónicos

#### 1. CQRS (Command Query Responsibility Segregation)

**✅ Implementación correcta:**

```csharp
// Domain/Commands
public record CreateUserCommand(string Name, string Email) : ICommand<CreateUserResult>;

public record CreateUserResult(int UserId, string Message);

// Application/Handlers
public class CreateUserCommandHandler : ICommandHandler<CreateUserCommand, CreateUserResult>
{
    private readonly IRepository<User> _userRepository;
    private readonly IPublisher _publisher;

    public CreateUserCommandHandler(IRepository<User> userRepository, IPublisher publisher)
    {
        _userRepository = userRepository;
        _publisher = publisher;
    }

    public async Task<CreateUserResult> Handle(CreateUserCommand command, CancellationToken cancellationToken)
    {
        var user = new User(command.Name, command.Email);
        await _userRepository.AddAsync(user, cancellationToken);
        
        // Publicar evento de dominio
        user.AddDomainEvent(new UserCreatedEvent(user.Id, user.Email));
        
        await _userRepository.SaveChangesAsync(cancellationToken);
        
        return new CreateUserResult(user.Id, "Usuario creado exitosamente");
    }
}

// Query
public record GetUserByIdQuery(int UserId) : IQuery<UserDto>;

public class GetUserByIdQueryHandler : IQueryHandler<GetUserByIdQuery, UserDto>
{
    private readonly IReadRepository<User> _readRepository;

    public async Task<UserDto> Handle(GetUserByIdQuery query, CancellationToken cancellationToken)
    {
        var user = await _readRepository.GetByIdAsync(query.UserId, cancellationToken);
        return user == null ? throw new UserNotFoundException() : new UserDto(user.Id, user.Name, user.Email);
    }
}

// Controller
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;

    public UsersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<ActionResult<CreateUserResult>> CreateUser([FromBody] CreateUserDto dto)
    {
        var command = new CreateUserCommand(dto.Name, dto.Email);
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetUser), new { id = result.UserId }, result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetUser(int id)
    {
        var query = new GetUserByIdQuery(id);
        var result = await _mediator.Send(query);
        return Ok(result);
    }
}
```

#### 2. Domain-Driven Design (DDD)

**✅ Entity con validación en dominio:**

```csharp
// Domain/Entities
public class User : AggregateRoot<int>
{
    private readonly List<Order> _orders = new();

    public string Name { get; private set; }
    public Email Email { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public bool IsActive { get; private set; }

    public IReadOnlyList<Order> Orders => _orders.AsReadOnly();

    // Factory method
    public static Result<User> Create(string name, string email)
    {
        if (string.IsNullOrWhiteSpace(name))
            return Result<User>.Failure("El nombre es requerido");

        if (!Email.IsValid(email))
            return Result<User>.Failure("Email inválido");

        var user = new User
        {
            Name = name,
            Email = Email.Create(email).Value,
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        // Evento de dominio
        user.AddDomainEvent(new UserCreatedEvent(user.Id, user.Email.Value));

        return Result<User>.Success(user);
    }

    public void Deactivate()
    {
        if (!IsActive)
            throw new InvalidOperationException("Usuario ya está desactivado");

        IsActive = false;
        this.AddDomainEvent(new UserDeactivatedEvent(this.Id));
    }

    public void AddOrder(Order order)
    {
        if (order == null)
            throw new ArgumentNullException(nameof(order));

        _orders.Add(order);
    }
}

// ValueObject
public class Email : ValueObject
{
    public string Value { get; }

    private Email(string value) => Value = value;

    public static Result<Email> Create(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return Result<Email>.Failure("Email es requerido");

        email = email.Trim().ToLower();

        if (!IsValid(email))
            return Result<Email>.Failure("Formato de email inválido");

        return Result<Email>.Success(new Email(email));
    }

    public static bool IsValid(string email)
    {
        var pattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
        return Regex.IsMatch(email, pattern);
    }

    protected override IEnumerable<object> GetEqualityComponents()
    {
        yield return Value;
    }
}

// Domain Event
public record UserCreatedEvent(int UserId, string Email) : IDomainEvent;
public record UserDeactivatedEvent(int UserId) : IDomainEvent;

// Domain Service
public class UserDomainService
{
    private readonly IRepository<User> _userRepository;

    public async Task<bool> IsEmailUniqueAsync(string email)
    {
        var user = await _userRepository.FirstOrDefaultAsync(u => u.Email.Value == email);
        return user == null;
    }
}
```

#### 3. Repository Pattern

**✅ Genérico y específico:**

```csharp
// Infrastructure/Repositories
public interface IRepository<T> where T : AggregateRoot
{
    Task<T> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<IEnumerable<T>> GetAllAsync(CancellationToken cancellationToken = default);
    Task AddAsync(T entity, CancellationToken cancellationToken = default);
    Task UpdateAsync(T entity, CancellationToken cancellationToken = default);
    Task DeleteAsync(T entity, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

public class GenericRepository<T> : IRepository<T> where T : AggregateRoot
{
    private readonly ApplicationDbContext _dbContext;

    public GenericRepository(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<T> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Set<T>().FindAsync(new object[] { id }, cancellationToken: cancellationToken);
    }

    public async Task<IEnumerable<T>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.Set<T>().AsNoTracking().ToListAsync(cancellationToken);
    }

    public async Task AddAsync(T entity, CancellationToken cancellationToken = default)
    {
        await _dbContext.Set<T>().AddAsync(entity, cancellationToken);
    }

    public Task UpdateAsync(T entity, CancellationToken cancellationToken = default)
    {
        _dbContext.Set<T>().Update(entity);
        return Task.CompletedTask;
    }

    public Task DeleteAsync(T entity, CancellationToken cancellationToken = default)
    {
        _dbContext.Set<T>().Remove(entity);
        return Task.CompletedTask;
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.SaveChangesAsync(cancellationToken);
    }
}

// Específico para User si necesitas lógica especial
public interface IUserRepository : IRepository<User>
{
    Task<User> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<bool> IsEmailUniqueAsync(string email, CancellationToken cancellationToken = default);
}

public class UserRepository : GenericRepository<User>, IUserRepository
{
    private readonly ApplicationDbContext _dbContext;

    public UserRepository(ApplicationDbContext dbContext) : base(dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<User> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Email.Value == email, cancellationToken);
    }

    public async Task<bool> IsEmailUniqueAsync(string email, CancellationToken cancellationToken = default)
    {
        return !await _dbContext.Users
            .AnyAsync(u => u.Email.Value == email, cancellationToken);
    }
}
```

#### 4. Unit of Work Pattern

**✅ Implementación correcta:**

```csharp
public interface IUnitOfWork : IAsyncDisposable
{
    IUserRepository Users { get; }
    IOrderRepository Orders { get; }
    IProductRepository Products { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task BeginTransactionAsync(CancellationToken cancellationToken = default);
    Task CommitTransactionAsync(CancellationToken cancellationToken = default);
    Task RollbackTransactionAsync(CancellationToken cancellationToken = default);
}

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _dbContext;
    private IUserRepository _userRepository;
    private IOrderRepository _orderRepository;
    private IProductRepository _productRepository;

    public UnitOfWork(ApplicationDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public IUserRepository Users =>
        _userRepository ??= new UserRepository(_dbContext);

    public IOrderRepository Orders =>
        _orderRepository ??= new OrderRepository(_dbContext);

    public IProductRepository Products =>
        _productRepository ??= new ProductRepository(_dbContext);

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        await _dbContext.Database.BeginTransactionAsync(cancellationToken);
    }

    public async Task CommitTransactionAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            await SaveChangesAsync(cancellationToken);
            await _dbContext.Database.CommitTransactionAsync(cancellationToken);
        }
        catch
        {
            await RollbackTransactionAsync(cancellationToken);
            throw;
        }
    }

    public async Task RollbackTransactionAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            await _dbContext.Database.RollbackTransactionAsync(cancellationToken);
        }
        catch (InvalidOperationException) { }
    }

    public async ValueTask DisposeAsync()
    {
        await _dbContext.DisposeAsync();
    }
}

// Registro en DI
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
```

---

## Patrones de Diseño

### 1. Dependency Injection

**✅ Correcto - Constructor Injection:**

```csharp
// ❌ MALO - Service Locator
public class UserService
{
    private IUserRepository _repo = ServiceLocator.GetService<IUserRepository>();
}

// ✅ BUENO - Constructor Injection
public class UserService
{
    private readonly IUserRepository _repo;

    public UserService(IUserRepository repo)
    {
        _repo = repo;
    }
}

// Extensión para registro
public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        return services;
    }
}
```

### 2. Mediator Pattern con MediatR

**✅ Implementación recomendada:**

```csharp
// Interfaces
public interface ICommand : IRequest { }
public interface ICommand<TResponse> : IRequest<TResponse> { }
public interface ICommandHandler<TCommand> : IRequestHandler<TCommand> where TCommand : ICommand { }
public interface ICommandHandler<TCommand, TResponse> : IRequestHandler<TCommand, TResponse> where TCommand : ICommand<TResponse> { }

public interface IQuery<TResponse> : IRequest<TResponse> { }
public interface IQueryHandler<TQuery, TResponse> : IRequestHandler<TQuery, TResponse> where TQuery : IQuery<TResponse> { }

// Configuración
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssemblies(typeof(Program).Assembly);
    cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));
    cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
    cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(PerformanceBehavior<,>));
});

// Behaviors
public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
{
    private readonly ILogger<TRequest> _logger;

    public LoggingBehavior(ILogger<TRequest> logger) => _logger = logger;

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Iniciando request: {RequestName}", typeof(TRequest).Name);
        var response = await next();
        _logger.LogInformation("Completado request: {RequestName}", typeof(TRequest).Name);
        return response;
    }
}

public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse> where TRequest : IRequest<TResponse>
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators) => _validators = validators;

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var validationFailures = new List<ValidationFailure>();

        foreach (var validator in _validators)
        {
            var validationResult = await validator.ValidateAsync(request, cancellationToken);
            validationFailures.AddRange(validationResult.Errors);
        }

        if (validationFailures.Any())
            throw new ValidationException(validationFailures);

        return await next();
    }
}

public class PerformanceBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
{
    private readonly ILogger<TRequest> _logger;
    private readonly Stopwatch _timer = new();

    public PerformanceBehavior(ILogger<TRequest> logger) => _logger = logger;

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        _timer.Start();
        var response = await next();
        _timer.Stop();

        if (_timer.ElapsedMilliseconds > 500)
            _logger.LogWarning("Request lento: {RequestName} ({ElapsedMilliseconds}ms)", typeof(TRequest).Name, _timer.ElapsedMilliseconds);

        return response;
    }
}
```

### 3. Specification Pattern

**✅ Para queries complejas:**

```csharp
public abstract class Specification<T> where T : AggregateRoot
{
    public Expression<Func<T, bool>> Criteria { get; protected set; }
    public List<Expression<Func<T, object>>> Includes { get; } = new();
    public Expression<Func<T, object>> OrderBy { get; protected set; }
    public Expression<Func<T, object>> OrderByDescending { get; protected set; }
    public int Take { get; protected set; }
    public int Skip { get; protected set; }
    public bool IsPagingEnabled { get; protected set; }
}

// Ejemplo
public class ActiveUsersWithOrdersSpecification : Specification<User>
{
    public ActiveUsersWithOrdersSpecification()
    {
        Criteria = u => u.IsActive;
        Includes.Add(u => u.Orders);
        OrderByDescending = u => u.CreatedAt;
        Take = 10;
        Skip = 0;
        IsPagingEnabled = true;
    }
}

// Extension para DbSet
public static class SpecificationEvaluator
{
    public static IQueryable<T> GetQuery<T>(IQueryable<T> inputQuery, Specification<T> specification)
        where T : AggregateRoot
    {
        var query = inputQuery;

        if (specification.Criteria != null)
            query = query.Where(specification.Criteria);

        query = specification.Includes.Aggregate(query, (current, include) => current.Include(include));

        if (specification.OrderBy != null)
            query = query.OrderBy(specification.OrderBy);

        if (specification.OrderByDescending != null)
            query = query.OrderByDescending(specification.OrderByDescending);

        if (specification.IsPagingEnabled)
        {
            query = query.Skip(specification.Skip).Take(specification.Take);
        }

        return query;
    }
}
```

### 4. Factory Pattern

**✅ Para crear objetos complejos:**

```csharp
public class UserFactory
{
    public static Result<User> CreateAdmin(string name, string email, string password)
    {
        var userResult = User.Create(name, email);
        if (!userResult.IsSuccess)
            return userResult;

        var user = userResult.Value;
        user.AssignRole(UserRole.Admin);
        
        return Result<User>.Success(user);
    }

    public static Result<User> CreateRegularUser(string name, string email)
    {
        var userResult = User.Create(name, email);
        if (!userResult.IsSuccess)
            return userResult;

        var user = userResult.Value;
        user.AssignRole(UserRole.User);
        
        return Result<User>.Success(user);
    }
}

// Uso
var adminResult = UserFactory.CreateAdmin("Admin", "admin@test.com", "password");
```

---

## Infraestructura y Persistencia

### Entity Framework Core 10 - Configuración

**✅ DbContext optimizado:**

```csharp
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<Product> Products { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Aplicar todas las configuraciones
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

        // Named Filters para soft delete
        modelBuilder.Entity<User>().HasQueryFilter(u => !u.IsDeleted);
        modelBuilder.Entity<Order>().HasQueryFilter(o => !o.IsDeleted);

        // Complex Types (Nuevo en EF Core 10)
        modelBuilder.Entity<User>().ComplexProperty(u => u.Email);
        modelBuilder.Entity<Order>().ComplexProperty(o => o.ShippingAddress);

        // Multitenancy filter
        modelBuilder.Entity<User>().HasQueryFilter(u => u.TenantId == this.CurrentTenantId);
    }

    private int CurrentTenantId => 1; // Implementar con HttpContext

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Publicar eventos de dominio
        var domainEvents = ChangeTracker.Entries<AggregateRoot>()
            .SelectMany(x => x.Entity.GetDomainEvents())
            .ToList();

        var result = await base.SaveChangesAsync(cancellationToken);

        foreach (var @event in domainEvents)
        {
            // Publicar evento (implementar con IPublisher)
        }

        return result;
    }
}

// Entity Configuration
public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.Id);

        builder.Property(u => u.Name)
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(u => u.IsActive)
            .HasDefaultValue(true);

        builder.Property(u => u.IsDeleted)
            .HasDefaultValue(false);

        // Value Object
        builder.OwnsOne(u => u.Email, ownedBuilder =>
        {
            ownedBuilder.Property(e => e.Value)
                .HasColumnName("Email")
                .HasMaxLength(255)
                .IsRequired();

            ownedBuilder.HasIndex(e => e.Value)
                .IsUnique();
        });

        // Relationship
        builder.HasMany(u => u.Orders)
            .WithOne(o => o.User)
            .HasForeignKey(o => o.UserId)
            .IsRequired()
            .OnDelete(DeleteBehavior.Cascade);

        // Index
        builder.HasIndex(u => u.Email)
            .IsUnique();
    }
}

// Registro
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions
            .EnableRetryOnFailure(maxRetryCount: 3)
            .CommandTimeout(30)
    )
    .EnableSensitiveDataLogging(app.Environment.IsDevelopment())
);
```

### Migrations

```bash
# Crear migration
dotnet ef migrations add InitialCreate

# Aplicar migration
dotnet ef database update

# Ver migration pendiente
dotnet ef migrations list
```

### Connection String Segura

**✅ Usar User Secrets en desarrollo:**

```bash
# Inicializar secretos
dotnet user-secrets init

# Establecer secret
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost;Database=MyDb;Trusted_Connection=true;"

# En producción, usar Azure Key Vault
```

---

## Mejores Prácticas

### 1. Async/Await Correcto

**✅ Correcto:**

```csharp
// Totalmente asíncrono
public async Task<User> GetUserAsync(int id)
{
    return await _repository.GetByIdAsync(id);
}

public async Task ProcessUsersAsync()
{
    var users = await _repository.GetAllAsync();
    foreach (var user in users)
    {
        await ProcessUserAsync(user);
    }
}

// ✅ Bueno: usar Task.WhenAll para paralelismo
public async Task ProcessAllUsersAsync()
{
    var users = await _repository.GetAllAsync();
    var tasks = users.Select(u => ProcessUserAsync(u));
    await Task.WhenAll(tasks);
}
```

**❌ Evitar:**

```csharp
// NUNCA usar .Result o .Wait()
var user = _repository.GetByIdAsync(1).Result; // ¡Deadlock posible!

// No mezclar sync/async
public void ProcessUsers()
{
    var users = _repository.GetAllAsync().Result; // ¡Malo!
}
```

### 2. Validación Robusta

**✅ Con FluentValidation:**

```csharp
public class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
{
    public CreateUserCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("El nombre es requerido")
            .Length(2, 100).WithMessage("El nombre debe tener entre 2 y 100 caracteres");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("El email es requerido")
            .EmailAddress().WithMessage("Email inválido");
    }
}

// Registro automático
builder.Services.AddValidatorsFromAssemblyContaining<CreateUserCommandValidator>();
```

### 3. Logging Estructurado

**✅ Con Serilog y OpenTelemetry:**

```csharp
using Serilog;
using Serilog.Context;

// Configurar Serilog
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.File("logs/app-.txt", rollingInterval: RollingInterval.Day)
    .Enrich.FromLogContext()
    .Enrich.WithProperty("Application", "MyApp")
    .CreateLogger();

builder.Host.UseSerilog();

// Uso en aplicación
[HttpPost]
public async Task<ActionResult> CreateUser([FromBody] CreateUserDto dto)
{
    using (LogContext.PushProperty("UserId", User.FindFirst(ClaimTypes.NameIdentifier)?.Value))
    {
        _logger.LogInformation("Creando usuario: {UserName} ({Email})", dto.Name, dto.Email);
        
        try
        {
            var result = await _mediator.Send(new CreateUserCommand(dto.Name, dto.Email));
            _logger.LogInformation("Usuario creado exitosamente: {UserId}", result.UserId);
            return CreatedAtAction(nameof(GetUser), result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear usuario");
            throw;
        }
    }
}
```

### 4. Caché Distribuido

**✅ Con Redis:**

```csharp
// Configuración
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis");
});

// Uso
public class CachedUserRepository : IUserRepository
{
    private readonly IUserRepository _innerRepository;
    private readonly IDistributedCache _cache;
    private const string CACHE_KEY_PREFIX = "user_";

    public CachedUserRepository(IUserRepository innerRepository, IDistributedCache cache)
    {
        _innerRepository = innerRepository;
        _cache = cache;
    }

    public async Task<User> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var cacheKey = $"{CACHE_KEY_PREFIX}{id}";
        var cachedUser = await _cache.GetStringAsync(cacheKey, cancellationToken);

        if (!string.IsNullOrEmpty(cachedUser))
            return JsonSerializer.Deserialize<User>(cachedUser);

        var user = await _innerRepository.GetByIdAsync(id, cancellationToken);

        await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(user), cancellationToken: cancellationToken);

        return user;
    }
}
```

### 5. Error Handling Consistente

**✅ Usar Result Pattern:**

```csharp
public abstract record Result
{
    public sealed record Success : Result;
    public sealed record Failure(string Error) : Result;
    public sealed record ValidationFailure(Dictionary<string, string[]> Errors) : Result;
}

public abstract record Result<T> : Result
{
    public sealed record Success(T Value) : Result<T>;
    public new sealed record Failure(string Error) : Result<T>;
}

// Extension methods
public static class ResultExtensions
{
    public static async Task<Result<TOut>> MapAsync<TIn, TOut>(
        this Result<TIn> result,
        Func<TIn, Task<TOut>> mapper)
    {
        return result switch
        {
            Result<TIn>.Success success => Result<TOut>.Success(await mapper(success.Value)),
            Result<TIn>.Failure failure => Result<TOut>.Failure(failure.Error),
            _ => throw new InvalidOperationException()
        };
    }
}

// Global Exception Handler
public class GlobalExceptionHandlerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandlerMiddleware> _logger;

    public GlobalExceptionHandlerMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlerMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception occurred");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var response = new { error = exception.Message };

        return context.Response.WriteAsJsonAsync(response);
    }
}

// Registrar middleware
app.UseMiddleware<GlobalExceptionHandlerMiddleware>();
```

### 6. OpenTelemetry Obligatorio

**✅ Observabilidad desde el inicio:**

```csharp
builder.Services
    .AddOpenTelemetry()
    .WithTracing(tracingBuilder =>
    {
        tracingBuilder
            .AddAspNetCoreInstrumentation()
            .AddHttpClientInstrumentation()
            .AddEntityFrameworkCoreInstrumentation()
            .AddSqlClientInstrumentation()
            .AddConsoleExporter()
            .AddJaegerExporter(options =>
            {
                options.AgentHost = "localhost";
                options.AgentPort = 6831;
            });
    })
    .WithMetrics(metricsBuilder =>
    {
        metricsBuilder
            .AddAspNetCoreInstrumentation()
            .AddHttpClientInstrumentation()
            .AddProcessInstrumentation()
            .AddRuntimeInstrumentation()
            .AddConsoleExporter();
    });
```

---

## Antipatrones a Evitar

### ❌ Antipatrón 1: God Class

**❌ Incorrecto:**

```csharp
public class UserService
{
    // Hace TODO: crear, actualizar, eliminar, validar, notificar, loguear, etc.
    public void CreateUser(UserDto dto) { /* 500 líneas */ }
    public void UpdateUser(UserDto dto) { /* 400 líneas */ }
    public void DeleteUser(int id) { /* 300 líneas */ }
    public void NotifyUser(int userId) { /* */ }
    public void ValidateUser(UserDto dto) { /* */ }
    public void LogUserActivity(int userId, string activity) { /* */ }
}
```

**✅ Correcto - Responsabilidad única:**

```csharp
public class CreateUserCommandHandler : ICommandHandler<CreateUserCommand, CreateUserResult>
{
    private readonly IRepository<User> _repository;
    private readonly IValidator<CreateUserCommand> _validator;
    private readonly INotificationService _notificationService;

    public async Task<CreateUserResult> Handle(CreateUserCommand command, CancellationToken cancellationToken)
    {
        // Cada clase tiene UNA responsabilidad
        var validationResult = await _validator.ValidateAsync(command, cancellationToken);
        var user = User.Create(command.Name, command.Email).Value;
        await _repository.AddAsync(user, cancellationToken);
        await _notificationService.SendWelcomeEmailAsync(user.Email, cancellationToken);
        return new CreateUserResult(user.Id, "Éxito");
    }
}
```

### ❌ Antipatrón 2: Ignorar Migraciones

**✅ Siempre usar EF Core Migrations:**

```bash
# ❌ NUNCA hacer cambios directos a la BD
# ✅ SIEMPRE crear una migration
dotnet ef migrations add AddUserTable
dotnet ef database update
```

### ❌ Antipatrón 3: No Usar Interfaces

**❌ Incorrecto:**

```csharp
public class UserController
{
    private readonly UserRepository _repo = new();
    private readonly EmailService _emailService = new();

    // Imposible de testear, altamente acoplado
}
```

**✅ Correcto:**

```csharp
public class UserController
{
    private readonly IRepository<User> _repo;
    private readonly IEmailService _emailService;

    public UserController(IRepository<User> repo, IEmailService emailService)
    {
        _repo = repo;
        _emailService = emailService;
    }
}
```

### ❌ Antipatrón 4: Magic Strings y Numbers

**❌ Incorrecto:**

```csharp
if (user.Status == "active" && user.RoleId == 1)
{
    // Qué significa "active"? Qué es el role 1?
}
```

**✅ Correcto:**

```csharp
public enum UserStatus { Active, Inactive, Suspended }
public enum UserRole { Admin = 1, User = 2, Guest = 3 }

if (user.Status == UserStatus.Active && user.Role == UserRole.Admin)
{
    // Claro y seguro
}
```

### ❌ Antipatrón 5: N+1 Queries

**❌ Incorrecto:**

```csharp
var users = _dbContext.Users.ToList(); // Query 1
foreach (var user in users)
{
    var orders = _dbContext.Orders.Where(o => o.UserId == user.Id).ToList(); // Query N
}
```

**✅ Correcto:**

```csharp
var users = _dbContext.Users
    .Include(u => u.Orders) // Una sola query con JOIN
    .ToList();
```

### ❌ Antipatrón 6: Autoexclusivo sin Casos

**Nota:** MediatR y AutoMapper pueden introducir complejidad innecesaria. Evalúa si realmente los necesitas.

**✅ Evalúa cada caso:**

```csharp
// A veces, un servicio simple es mejor que MediatR
public interface ICreateUserService
{
    Task<CreateUserResult> ExecuteAsync(CreateUserCommand command);
}

// En proyectos simples, esto es más legible que handlers MediatR
```

### ❌ Antipatrón 7: Blocking Calls en Async

**❌ NUNCA:**

```csharp
public async Task<User> GetUserAsync(int id)
{
    return _repository.GetByIdAsync(id).Result; // ¡DEADLOCK!
}

public async Task ProcessAsync()
{
    var user = GetUserAsync(1).Wait(); // ¡MALO!
}
```

**✅ SIEMPRE:**

```csharp
public async Task<User> GetUserAsync(int id)
{
    return await _repository.GetByIdAsync(id);
}

public async Task ProcessAsync()
{
    var user = await GetUserAsync(1);
}
```

### ❌ Antipatrón 8: Excepciones para Control de Flujo

**❌ Incorrecto:**

```csharp
try
{
    var user = _dbContext.Users.Single(u => u.Id == id);
}
catch (InvalidOperationException)
{
    // Usuario no existe - Esto NO es excepcional
}
```

**✅ Correcto:**

```csharp
var user = _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
if (user == null)
{
    throw new UserNotFoundException();
}
```

---

## Seguridad

### 1. Autenticación y Autorización

**✅ Con JWT:**

```csharp
// Configuración
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                builder.Configuration["Jwt:SecretKey"])),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy =>
        policy.RequireRole("Admin"));

    options.AddPolicy("UserManagement", policy =>
        policy.RequireClaim("permission", "manage_users"));
});

// Uso en controller
[Authorize(Policy = "AdminOnly")]
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteUser(int id)
{
    // Solo admins
}
```

### 2. Protección contra Ataques

**✅ CSRF Protection:**

```csharp
// Automático en ASP.NET Core
[ValidateAntiForgeryToken]
[HttpPost]
public async Task<IActionResult> CreateUser([FromForm] CreateUserDto dto)
{
    // Protegido contra CSRF
}

// En SPA con JSON
builder.Services.AddAntiforgery(options =>
{
    options.HeaderName = "X-CSRF-TOKEN";
});
```

**✅ SQL Injection Prevention:**

```csharp
// ❌ NUNCA
var query = $"SELECT * FROM Users WHERE Email = '{email}'";

// ✅ SIEMPRE - Entity Framework parameteriza automáticamente
var user = await _dbContext.Users
    .FirstOrDefaultAsync(u => u.Email == email);
```

**✅ XSS Prevention:**

```csharp
// En Views - Usar @Html.Encode()
<p>@Html.Encode(user.Name)</p> <!-- Seguro -->

// O usar AngleSharp para sanitizar
var context = BrowsingContext.New(Configuration.Default.WithoutScripting());
var document = await context.OpenAsync(req => req.Content(userContent));
```

### 3. Secretos Seguros

**✅ Azure Key Vault:**

```csharp
builder.Configuration.AddAzureKeyVault(
    new Uri("https://myvault.vault.azure.net/"),
    new DefaultAzureCredential());

// Uso
var apiKey = builder.Configuration["ApiKeys:ThirdParty"];
```

---

## Performance y Optimización

### 1. Span<T> y ValueTask

**✅ Para operaciones críticas:**

```csharp
// Reduce allocations
public static int Sum(Span<int> numbers)
{
    var sum = 0;
    foreach (var num in numbers)
        sum += num;
    return sum;
}

// ValueTask evita asignaciones si completa sincrónicamente
public async ValueTask<User> GetCachedUserAsync(int id)
{
    if (_cache.TryGetValue(id, out var user))
        return user; // Sin allocación

    return await _repository.GetByIdAsync(id);
}
```

### 2. Query Optimization

**✅ Proyecciones en lugar de entidades completas:**

```csharp
// ❌ Trae toda la entidad
var users = _dbContext.Users.ToList();

// ✅ Solo trae lo que necesitas
var userSummaries = _dbContext.Users
    .Select(u => new UserSummaryDto(u.Id, u.Name, u.Email))
    .ToList();
```

### 3. Índices en Bases de Datos

**✅ Crear índices estratégicos:**

```csharp
modelBuilder.Entity<User>()
    .HasIndex(u => u.Email)
    .IsUnique();

modelBuilder.Entity<Order>()
    .HasIndex(o => new { o.UserId, o.CreatedAt })
    .HasDatabaseName("IX_Orders_User_Created");
```

---

## Checklist de Implementación .NET 10

- [ ] Versión target: `<TargetFramework>net10.0</TargetFramework>`
- [ ] `strict` habilitado en compilación
- [ ] Configurar OpenTelemetry desde inicio
- [ ] Usar Dependency Injection en todo
- [ ] CQRS + MediatR para separación de responsabilidades
- [ ] DDD para dominio complejo
- [ ] Repository + Unit of Work para datos
- [ ] FluentValidation para validación
- [ ] Manejo de errores con Result Pattern
- [ ] Logging estructurado con Serilog
- [ ] Autenticación y autorización configuradas
- [ ] SQL parameterizado (Entity Framework)
- [ ] Migrations de EF Core
- [ ] Caché distribuido si needed
- [ ] Tests unitarios y de integración
- [ ] Documentación con OpenAPI/Swagger
- [ ] Secrets en User Secrets/Key Vault

---

**Recuerda: La calidad del código es una inversión en el futuro del proyecto. 🚀**
