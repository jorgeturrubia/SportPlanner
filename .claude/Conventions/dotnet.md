---
inclusion: fileMatch
fileMatchPattern: "**/*.cs"
---

# .NET Development Conventions

These conventions are specific to .NET/C# development and build upon the shared development standards. These rules are automatically loaded when working with C# files.

## Clean Architecture Principles

### Layer Organization
- **ALWAYS** follow Clean Architecture layers: Core → Application → Infrastructure → API
- **NEVER** reference outer layers from inner layers (dependency inversion)
- **ALWAYS** use interfaces for dependencies between layers
- **ALWAYS** keep domain entities in the Core layer without external dependencies

### Project Structure
```
src/
├── ProjectName.API/          # Web API layer (controllers, endpoints)
├── ProjectName.Application/  # Application logic (CQRS, services, DTOs)
├── ProjectName.Core/         # Domain entities and business rules
└── ProjectName.Infrastructure/ # Data access, external services
```

## CQRS Implementation with MediatR

### Command Structure
```csharp
// CreateUserCommand.cs
public record CreateUserCommand(
    string Email,
    string FirstName,
    string LastName
) : IRequest<Result<UserDto>>;

// CreateUserCommandHandler.cs
public class CreateUserCommandHandler : IRequestHandler<CreateUserCommand, Result<UserDto>>
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;

    public async Task<Result<UserDto>> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var existingUser = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
        if (existingUser is not null)
        {
            return Result<UserDto>.Failure(UserErrors.EmailAlreadyExists);
        }

        var user = User.Create(request.Email, request.FirstName, request.LastName);
        
        _userRepository.Add(user);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var userDto = _mapper.Map<UserDto>(user);
        return Result<UserDto>.Success(userDto);
    }
}
```

## Minimal APIs with Carter

### Carter Module Structure
```csharp
// UserEndpoints.cs
public class UserEndpoints : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/v1/users")
            .WithTags("Users")
            .WithOpenApi()
            .RequireAuthorization();

        group.MapGet("/", GetUsers);
        group.MapGet("/{id:guid}", GetUser);
        group.MapPost("/", CreateUser);
        group.MapPut("/{id:guid}", UpdateUser);
        group.MapDelete("/{id:guid}", DeleteUser);
    }

    private static async Task<IResult> GetUser(Guid id, IMediator mediator)
    {
        var query = new GetUserQuery(id);
        var result = await mediator.Send(query);
        
        return result.IsSuccess 
            ? Results.Ok(result.Value) 
            : Results.NotFound(result.Error);
    }
}
```

## Entity Framework Core Patterns

### Entity Configuration Example
```csharp
// UserConfiguration.cs
public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");
        
        builder.HasKey(u => u.Id);
        
        builder.Property(u => u.Email)
            .HasColumnName("email")
            .HasMaxLength(255)
            .IsRequired();
            
        builder.Property(u => u.FirstName)
            .HasColumnName("first_name")
            .HasMaxLength(100)
            .IsRequired();
        
        // Indexes
        builder.HasIndex(u => u.Email)
            .IsUnique()
            .HasDatabaseName("ix_users_email");
    }
}
```

### Repository Pattern
```csharp
// IUserRepository.cs
public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<PagedResult<User>> GetPagedAsync(int page, int pageSize, CancellationToken cancellationToken = default);
    void Add(User user);
    void Update(User user);
    void Delete(User user);
}

// UserRepository.cs
public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
    }

    public void Add(User user)
    {
        _context.Users.Add(user);
    }
}
```

## Domain Entity Patterns

### Entity Implementation
```csharp
// User.cs
public class User
{
    private User() { } // For EF Core
    
    private User(Guid id, string email, string firstName, string lastName)
    {
        Id = id;
        Email = email;
        FirstName = firstName;
        LastName = lastName;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
        IsActive = true;
    }
    
    public Guid Id { get; private set; }
    public string Email { get; private set; } = string.Empty;
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public bool IsActive { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }
    
    // Factory method
    public static User Create(string email, string firstName, string lastName)
    {
        ValidateEmail(email);
        ValidateName(firstName, nameof(firstName));
        ValidateName(lastName, nameof(lastName));
        
        return new User(Guid.NewGuid(), email, firstName, lastName);
    }
    
    // Business methods
    public void UpdateProfile(string firstName, string lastName)
    {
        ValidateName(firstName, nameof(firstName));
        ValidateName(lastName, nameof(lastName));
        
        FirstName = firstName;
        LastName = lastName;
        UpdatedAt = DateTime.UtcNow;
    }
    
    private static void ValidateEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new ArgumentException("Email cannot be empty", nameof(email));
            
        if (!email.Contains('@'))
            throw new ArgumentException("Email format is invalid", nameof(email));
    }
    
    private static void ValidateName(string name, string paramName)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException($"{paramName} cannot be empty", paramName);
            
        if (name.Length < 2)
            throw new ArgumentException($"{paramName} must be at least 2 characters", paramName);
    }
}
```

## Error Handling with Result Pattern

### Result Implementation
```csharp
// Result.cs
public class Result<T>
{
    protected Result(T value)
    {
        IsSuccess = true;
        Value = value;
        Error = Error.None;
    }
    
    protected Result(Error error)
    {
        IsSuccess = false;
        Value = default!;
        Error = error;
    }
    
    public bool IsSuccess { get; }
    public bool IsFailure => !IsSuccess;
    public T Value { get; }
    public Error Error { get; }
    
    public static Result<T> Success(T value) => new(value);
    public static Result<T> Failure(Error error) => new(error);
}

// Error.cs
public sealed record Error(string Code, string Message)
{
    public static readonly Error None = new(string.Empty, string.Empty);
    public static readonly Error NullValue = new("Error.NullValue", "Null value was provided");
}

// UserErrors.cs
public static class UserErrors
{
    public static Error NotFound(Guid id) => new(
        "User.NotFound", 
        $"User with ID '{id}' was not found");
        
    public static readonly Error EmailAlreadyExists = new(
        "User.EmailAlreadyExists", 
        "User with this email already exists");
}
```

## Validation with FluentValidation

### Command Validation
```csharp
// CreateUserCommandValidator.cs
public class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
{
    public CreateUserCommandValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Email format is invalid")
            .MaximumLength(255).WithMessage("Email must not exceed 255 characters");

        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("First name is required")
            .MinimumLength(2).WithMessage("First name must be at least 2 characters")
            .MaximumLength(100).WithMessage("First name must not exceed 100 characters");

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Last name is required")
            .MinimumLength(2).WithMessage("Last name must be at least 2 characters")
            .MaximumLength(100).WithMessage("Last name must not exceed 100 characters");
    }
}
```

## Dependency Injection Configuration

### Service Registration
```csharp
// ServiceCollectionExtensions.cs
public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(CreateUserCommand).Assembly));
        
        services.AddScoped(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
        services.AddScoped(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));
        
        services.AddValidatorsFromAssembly(typeof(CreateUserCommandValidator).Assembly);
        
        services.AddAutoMapper(typeof(UserMappingProfile).Assembly);
        
        return services;
    }
    
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));
            
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IUserRepository, UserRepository>();
        
        return services;
    }
}
```

## Testing Patterns

### Unit Testing
```csharp
// CreateUserCommandHandlerTests.cs
[TestClass]
public class CreateUserCommandHandlerTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly Mock<IMapper> _mapperMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly CreateUserCommandHandler _handler;

    public CreateUserCommandHandlerTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();
        _mapperMock = new Mock<IMapper>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();
        _handler = new CreateUserCommandHandler(
            _userRepositoryMock.Object,
            _mapperMock.Object,
            _unitOfWorkMock.Object);
    }

    [TestMethod]
    public async Task Handle_WithValidRequest_ReturnsSuccessResult()
    {
        // Arrange
        var command = new CreateUserCommand("john@example.com", "John", "Doe");
        var user = User.Create(command.Email, command.FirstName, command.LastName);
        var userDto = new UserDto { Id = user.Id, Email = user.Email };

        _userRepositoryMock
            .Setup(x => x.GetByEmailAsync(command.Email, It.IsAny<CancellationToken>()))
            .ReturnsAsync((User?)null);
            
        _mapperMock
            .Setup(x => x.Map<UserDto>(It.IsAny<User>()))
            .Returns(userDto);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.IsTrue(result.IsSuccess);
        Assert.AreEqual(userDto, result.Value);
        
        _userRepositoryMock.Verify(x => x.Add(It.IsAny<User>()), Times.Once);
        _unitOfWorkMock.Verify(x => x.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
```

## Performance and Security Best Practices

### Performance
- **ALWAYS** use async/await for I/O operations
- **ALWAYS** use IQueryable projections for DTOs to avoid over-fetching
- **ALWAYS** implement pagination for large datasets
- **ALWAYS** use appropriate indexes in database
- **ALWAYS** use connection pooling and proper DbContext lifecycle

### Security
- **ALWAYS** validate input at API boundaries
- **ALWAYS** use parameterized queries (EF Core does this automatically)
- **ALWAYS** implement proper authentication and authorization
- **ALWAYS** log security-related events
- **NEVER** expose internal errors to API consumers
- **NEVER** log sensitive information

These .NET conventions ensure robust, scalable, and maintainable backend code that follows Clean Architecture principles and integrates seamlessly with the frontend and database layers.
