# Clean Architecture Template - .NET 8

## Estructura de Proyecto

```
src/
├── PlanSport.Domain/
│   ├── Entities/
│   │   ├── Athlete.cs
│   │   ├── Coach.cs
│   │   ├── TrainingPlan.cs
│   │   └── Common/
│   │       ├── AggregateRoot.cs
│   │       ├── Entity.cs
│   │       └── DomainEvent.cs
│   ├── ValueObjects/
│   │   ├── AthleteId.cs
│   │   ├── Email.cs
│   │   ├── PersonName.cs
│   │   └── SportType.cs
│   ├── Events/
│   │   ├── AthleteCreatedEvent.cs
│   │   └── TrainingCompletedEvent.cs
│   ├── Interfaces/
│   │   ├── IAthleteRepository.cs
│   │   ├── IUnitOfWork.cs
│   │   └── IDomainEventDispatcher.cs
│   ├── Services/
│   │   └── AthleteService.cs
│   ├── Specifications/
│   │   └── AthleteSpecifications.cs
│   └── Exceptions/
│       └── DomainException.cs
├── PlanSport.Application/
│   ├── Features/
│   │   └── Athletes/
│   │       ├── Commands/
│   │       │   ├── CreateAthlete/
│   │       │   │   ├── CreateAthleteCommand.cs
│   │       │   │   ├── CreateAthleteCommandHandler.cs
│   │       │   │   └── CreateAthleteCommandValidator.cs
│   │       │   └── UpdateAthlete/
│   │       └── Queries/
│   │           └── GetAthlete/
│   │               ├── GetAthleteQuery.cs
│   │               ├── GetAthleteQueryHandler.cs
│   │               └── AthleteResponse.cs
│   ├── Common/
│   │   ├── Interfaces/
│   │   │   ├── IApplicationDbContext.cs
│   │   │   └── ICurrentUserService.cs
│   │   ├── Behaviours/
│   │   │   ├── ValidationBehaviour.cs
│   │   │   ├── LoggingBehaviour.cs
│   │   │   └── PerformanceBehaviour.cs
│   │   ├── Mapping/
│   │   │   └── MappingProfile.cs
│   │   ├── Models/
│   │   │   ├── Result.cs
│   │   │   └── PagedResult.cs
│   │   └── Exceptions/
│   │       ├── ValidationException.cs
│   │       └── NotFoundException.cs
│   └── DependencyInjection.cs
├── PlanSport.Infrastructure/
│   ├── Persistence/
│   │   ├── ApplicationDbContext.cs
│   │   ├── Repositories/
│   │   │   ├── AthleteRepository.cs
│   │   │   └── BaseRepository.cs
│   │   ├── Configurations/
│   │   │   ├── AthleteConfiguration.cs
│   │   │   └── CoachConfiguration.cs
│   │   ├── Interceptors/
│   │   │   └── AuditableEntitySaveChangesInterceptor.cs
│   │   └── Migrations/
│   ├── Services/
│   │   ├── EmailService.cs
│   │   ├── CurrentUserService.cs
│   │   └── DateTimeService.cs
│   ├── Authentication/
│   │   └── JwtService.cs
│   └── DependencyInjection.cs
├── PlanSport.Api/
│   ├── Endpoints/
│   │   ├── AthleteEndpoints.cs
│   │   └── CoachEndpoints.cs
│   ├── Contracts/
│   │   ├── Athletes/
│   │   │   ├── CreateAthleteRequest.cs
│   │   │   └── AthleteResponse.cs
│   │   └── Common/
│   │       ├── PagedRequest.cs
│   │       └── ApiResponse.cs
│   ├── Middleware/
│   │   ├── ExceptionHandlingMiddleware.cs
│   │   └── RequestLoggingMiddleware.cs
│   ├── Configuration/
│   │   ├── ServiceCollectionExtensions.cs
│   │   └── WebApplicationExtensions.cs
│   └── Program.cs
└── PlanSport.Shared/
    ├── Constants/
    │   └── ApplicationConstants.cs
    ├── Enums/
    │   └── SportType.cs
    └── Extensions/
        ├── StringExtensions.cs
        └── DateTimeExtensions.cs
```

## Patrones Implementados

### 1. Aggregate Root Pattern
```csharp
public abstract class AggregateRoot<TId> : Entity<TId>
{
    private readonly List<DomainEvent> _domainEvents = new();

    protected AggregateRoot(TId id) : base(id) { }
    protected AggregateRoot() { }

    public IReadOnlyCollection<DomainEvent> DomainEvents => _domainEvents.AsReadOnly();

    protected void AddDomainEvent(DomainEvent domainEvent)
    {
        _domainEvents.Add(domainEvent);
    }

    public void ClearDomainEvents()
    {
        _domainEvents.Clear();
    }
}
```

### 2. Result Pattern
```csharp
public class Result
{
    public bool IsSuccess { get; }
    public bool IsFailure => !IsSuccess;
    public string Error { get; }

    protected Result(bool isSuccess, string error)
    {
        IsSuccess = isSuccess;
        Error = error;
    }

    public static Result Success() => new(true, string.Empty);
    public static Result Failure(string error) => new(false, error);
}

public class Result<T> : Result
{
    public T Value { get; }

    protected Result(T value, bool isSuccess, string error) : base(isSuccess, error)
    {
        Value = value;
    }

    public static Result<T> Success(T value) => new(value, true, string.Empty);
    public static Result<T> Failure(string error) => new(default!, false, error);
}
```

### 3. Repository Pattern
```csharp
public interface IRepository<T, TId> where T : AggregateRoot<TId>
{
    Task<T?> GetByIdAsync(TId id, CancellationToken cancellationToken = default);
    Task<IEnumerable<T>> GetBySpecificationAsync(ISpecification<T> specification, CancellationToken cancellationToken = default);
    Task<PagedResult<T>> GetPagedAsync(ISpecification<T> specification, int pageNumber, int pageSize, CancellationToken cancellationToken = default);
    Task AddAsync(T entity, CancellationToken cancellationToken = default);
    void Update(T entity);
    void Remove(T entity);
}
```

### 4. Unit of Work Pattern
```csharp
public interface IUnitOfWork
{
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task BeginTransactionAsync(CancellationToken cancellationToken = default);
    Task CommitTransactionAsync(CancellationToken cancellationToken = default);
    Task RollbackTransactionAsync(CancellationToken cancellationToken = default);
}

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private IDbContextTransaction? _transaction;

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        _transaction = await _context.Database.BeginTransactionAsync(cancellationToken);
    }

    public async Task CommitTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (_transaction != null)
        {
            await _transaction.CommitAsync(cancellationToken);
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync(cancellationToken);
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }
}
```

### 5. CQRS Pattern
```csharp
// Command
public record CreateAthleteCommand(
    string Email,
    string FirstName,
    string LastName,
    string Sport
) : IRequest<Result<Guid>>;

// Command Handler
public class CreateAthleteCommandHandler : IRequestHandler<CreateAthleteCommand, Result<Guid>>
{
    private readonly IAthleteRepository _athleteRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateAthleteCommandHandler(IAthleteRepository athleteRepository, IUnitOfWork unitOfWork)
    {
        _athleteRepository = athleteRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<Guid>> Handle(CreateAthleteCommand request, CancellationToken cancellationToken)
    {
        // Business logic
        var emailResult = Email.Create(request.Email);
        if (emailResult.IsFailure)
            return Result<Guid>.Failure(emailResult.Error);

        var nameResult = PersonName.Create(request.FirstName, request.LastName);
        if (nameResult.IsFailure)
            return Result<Guid>.Failure(nameResult.Error);

        var sportResult = SportType.FromString(request.Sport);
        if (sportResult.IsFailure)
            return Result<Guid>.Failure(sportResult.Error);

        var athlete = Athlete.Create(emailResult.Value, nameResult.Value, sportResult.Value);
        
        await _athleteRepository.AddAsync(athlete, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<Guid>.Success(athlete.Id);
    }
}

// Query
public record GetAthleteByIdQuery(Guid AthleteId) : IRequest<Result<AthleteDetailResponse>>;

// Query Handler
public class GetAthleteByIdQueryHandler : IRequestHandler<GetAthleteByIdQuery, Result<AthleteDetailResponse>>
{
    private readonly IAthleteRepository _athleteRepository;
    private readonly IMapper _mapper;

    public GetAthleteByIdQueryHandler(IAthleteRepository athleteRepository, IMapper mapper)
    {
        _athleteRepository = athleteRepository;
        _mapper = mapper;
    }

    public async Task<Result<AthleteDetailResponse>> Handle(GetAthleteByIdQuery request, CancellationToken cancellationToken)
    {
        var athleteId = AthleteId.From(request.AthleteId);
        var athlete = await _athleteRepository.GetByIdAsync(athleteId, cancellationToken);

        if (athlete == null)
            return Result<AthleteDetailResponse>.Failure("Athlete not found");

        var response = _mapper.Map<AthleteDetailResponse>(athlete);
        return Result<AthleteDetailResponse>.Success(response);
    }
}
```

### 6. Specification Pattern
```csharp
public interface ISpecification<T>
{
    Expression<Func<T, bool>> ToExpression();
    bool IsSatisfiedBy(T entity);
}

public abstract class BaseSpecification<T> : ISpecification<T>
{
    protected BaseSpecification(Expression<Func<T, bool>> criteria)
    {
        Criteria = criteria;
    }

    public Expression<Func<T, bool>> Criteria { get; }

    public Expression<Func<T, bool>> ToExpression() => Criteria;

    public bool IsSatisfiedBy(T entity)
    {
        var predicate = ToExpression().Compile();
        return predicate(entity);
    }
}

// Specific specifications
public class AthletesByCoachSpecification : BaseSpecification<Athlete>
{
    public AthletesByCoachSpecification(CoachId coachId) 
        : base(athlete => athlete.CoachId == coachId)
    {
    }
}

public class ActiveAthletesSpecification : BaseSpecification<Athlete>
{
    public ActiveAthletesSpecification() 
        : base(athlete => athlete.IsActive)
    {
    }
}
```

### 7. Domain Events Pattern
```csharp
public abstract record DomainEvent(DateTime OccurredAt) : INotification
{
    protected DomainEvent() : this(DateTime.UtcNow) { }
}

public record AthleteCreatedEvent(
    AthleteId AthleteId,
    string Email,
    string FullName,
    DateTime OccurredAt
) : DomainEvent(OccurredAt);

// Event Handler
public class AthleteCreatedEventHandler : INotificationHandler<AthleteCreatedEvent>
{
    private readonly IEmailService _emailService;
    private readonly ILogger<AthleteCreatedEventHandler> _logger;

    public AthleteCreatedEventHandler(IEmailService emailService, ILogger<AthleteCreatedEventHandler> logger)
    {
        _emailService = emailService;
        _logger = logger;
    }

    public async Task Handle(AthleteCreatedEvent notification, CancellationToken cancellationToken)
    {
        _logger.LogInformation("Handling athlete created event for {AthleteId}", notification.AthleteId);

        await _emailService.SendWelcomeEmailAsync(
            notification.Email, 
            notification.FullName, 
            cancellationToken);
    }
}
```

## Configuración de Dependencias

### Program.cs
```csharp
var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication();
builder.Services.AddPresentation();

var app = builder.Build();

// Configure pipeline
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

// Map endpoints
app.MapApiEndpoints();

await app.RunAsync();
```

### Dependency Injection Extensions
```csharp
// Application Layer
public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddMediatR(cfg => 
        {
            cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(LoggingBehaviour<,>));
            cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(PerformanceBehaviour<,>));
        });

        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        services.AddAutoMapper(Assembly.GetExecutingAssembly());

        return services;
    }
}

// Infrastructure Layer
public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Database
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        // Repositories
        services.AddScoped<IAthleteRepository, AthleteRepository>();
        services.AddScoped<ICoachRepository, CoachRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Services
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddSingleton<IDateTimeService, DateTimeService>();

        return services;
    }
}
```

## Mejores Prácticas

### 1. Validación en Capas
```csharp
// Domain validation (business rules)
public class Athlete : AggregateRoot<AthleteId>
{
    public Result AssignCoach(CoachId coachId)
    {
        if (CoachId == coachId)
            return Result.Failure("Athlete already assigned to this coach");

        // Business rule validation
        CoachId = coachId;
        AddDomainEvent(new AthleteCoachAssignedEvent(Id, coachId));
        return Result.Success();
    }
}

// Application validation (input validation)
public class CreateAthleteCommandValidator : AbstractValidator<CreateAthleteCommand>
{
    public CreateAthleteCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();

        RuleFor(x => x.FirstName)
            .NotEmpty()
            .MaximumLength(50);

        RuleFor(x => x.LastName)
            .NotEmpty()
            .MaximumLength(50);
    }
}
```

### 2. Error Handling Global
```csharp
public class GlobalExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandlingMiddleware> _logger;

    public GlobalExceptionHandlingMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlingMiddleware> logger)
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
            _logger.LogError(ex, "An unhandled exception occurred");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var response = exception switch
        {
            ValidationException ex => new { error = ex.Message, details = ex.Errors },
            NotFoundException ex => new { error = ex.Message },
            DomainException ex => new { error = ex.Message },
            _ => new { error = "An internal server error occurred" }
        };

        context.Response.StatusCode = exception switch
        {
            ValidationException => StatusCodes.Status400BadRequest,
            NotFoundException => StatusCodes.Status404NotFound,
            DomainException => StatusCodes.Status400BadRequest,
            _ => StatusCodes.Status500InternalServerError
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}
```

Esta plantilla proporciona una base sólida para implementar Clean Architecture con .NET 8, incluyendo todos los patrones modernos y mejores prácticas.
