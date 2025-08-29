---
inclusion: always
---

# SportPlanner Project Structure & Organization

## Root Directory Layout
```
SportPlanner/
├── src/
│   ├── front/SportPlanner/     # Angular frontend application
│   └── back/SportPlanner/      # .NET Core backend API
├── Steering/                   # Project documentation & context
├── README.md
```

## Frontend Structure (src/front/SportPlanner)

### Core Directory Layout
```
src/front/SportPlanner/
├── src/
│   ├── app/
│   │   ├── core/               # Singleton services & cross-cutting concerns
│   │   │   ├── services/       # Auth, interceptors, logger services
│   │   │   ├── guards/         # Route guards
│   │   │   ├── core.module.ts
│   │   │   └── index.ts
│   │   ├── shared/             # Reusable components & utilities
│   │   │   ├── components/     # Reusable UI (buttons, modals, spinners)
│   │   │   ├── pipes/          # Shared pipes
│   │   │   ├── directives/     # Shared directives
│   │   │   ├── models/         # Global models & TypeScript interfaces
│   │   │   ├── shared.module.ts
│   │   │   └── index.ts
│   │   ├── features/           # Feature-based organization
│   │   │   ├── training/       # Training management feature
│   │   │   │   ├── components/ # Training-specific components
│   │   │   │   ├── services/   # Training business logic
│   │   │   │   ├── models/     # Training domain models
│   │   │   │   └── training.module.ts
│   │   │   └── users/          # User management feature
│   │   │       ├── components/ # User-specific components
│   │   │       ├── services/   # User business logic
│   │   │       ├── models/     # User domain models
│   │   │       └── users.module.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.css
│   │   ├── app.module.ts
│   │   └── app-routing.module.ts
│   ├── assets/
│   │   ├── images/             # PNG, SVG, JPG files
│   │   ├── fonts/              # Custom fonts
│   │   ├── styles/             # Global CSS styles
│   │   └── tailwind.css        # Tailwind CSS entry point
│   ├── environments/
│   │   ├── environment.ts      # Development configuration
│   │   └── environment.prod.ts # Production configuration
│   ├── index.html
│   └── main.ts
├── angular.json                # Angular CLI configuration
├── package.json               # Dependencies & scripts
├── tailwind.config.js         # Tailwind configuration
└── tsconfig.json              # TypeScript configuration
```

## Backend Structure (src/back/SportPlanner)

### Clean Architecture Layout
```
SportPlanner/
├── Api/                       # Presentation Layer
│   ├── Controllers/           # API endpoints (thin controllers)
│   │   ├── TrainingController.cs
│   │   ├── UsersController.cs
│   │   ├── AuthController.cs
│   │   ├── TeamsController.cs
│   │   └── PlanningsController.cs
│   ├── DTOs/                  # Request/response contracts
│   │   ├── AuthenticationDTOs.cs
│   │   └── TeamDTOs.cs
│   ├── Program.cs             # Application entry point
│   └── Startup.cs             # (if not using minimal hosting)
├── Application/               # Application Layer
│   ├── Services/              # Business logic services
│   │   ├── TrainingService.cs
│   │   ├── UserService.cs
│   │   ├── TeamService.cs
│   │   └── SupabaseService.cs
│   ├── Interfaces/            # Service abstractions
│   │   ├── ITeamService.cs
│   │   ├── IUserContextService.cs
│   │   └── ISupabaseService.cs
│   └── Validators/            # FluentValidation classes
├── Domain/                    # Domain Layer
│   ├── Entities/              # Core domain models
│   │   ├── TrainingSession.cs
│   │   ├── User.cs
│   │   ├── Team.cs
│   │   ├── Planning.cs
│   │   ├── Exercise.cs
│   │   ├── Concept.cs
│   │   ├── Itinerary.cs
│   │   ├── Organization.cs
│   │   └── Subscription.cs
│   ├── ValueObjects/          # Domain-specific value types
│   └── Enums/                 # Domain enumerations
├── Infrastructure/            # Infrastructure Layer
│   ├── Persistence/
│   │   ├── SportPlannerDbContext.cs # EF Core DbContext
│   │   ├── Configurations/    # EF entity configurations
│   │   └── Migrations/        # Database migrations
│   ├── Repositories/          # Data access implementations
│   │   ├── TrainingRepository.cs
│   │   └── UserRepository.cs
│   ├── Messaging/             # RabbitMQ, event bus integration
│   ├── Caching/               # Redis cache layer
│   └── ExternalServices/      # Third-party integrations
├── Tests/                     # Test Projects
│   ├── UnitTests/            # Unit test classes
│   │   └── UserContextServiceTests.cs
│   └── IntegrationTests/     # Integration test classes
├── Middleware/               # Custom middleware
│   ├── GlobalExceptionMiddleware.cs
│   ├── JwtMiddleware.cs
│   └── SecurityHeadersMiddleware.cs
├── appsettings.json         # Configuration files
├── appsettings.Development.json
└── SportPlanner.csproj      # Project file
```

## Key Directories & Purposes

### Frontend Key Directories
- **core/**: Singleton services, guards, and cross-cutting concerns that should be loaded once
- **shared/**: Reusable components, pipes, directives, and models used across features
- **features/**: Feature-based modules organized by business domain (training, users, etc.)
- **assets/**: Static files organized by type (images, fonts, styles)
- **environments/**: Configuration files for different deployment environments

### Backend Key Directories
- **Api/Controllers/**: Thin controllers that handle HTTP requests and delegate to services
- **Application/Services/**: Business logic and application services
- **Domain/Entities/**: Core business entities and domain models
- **Infrastructure/**: Data access, external service integrations, and technical concerns
- **Tests/**: Unit and integration tests separated by type

## Naming Conventions

### Frontend Naming Rules
- **Files**: kebab-case (e.g., `user-profile.component.ts`)
- **Directories**: kebab-case (e.g., `user-management/`)
- **Classes**: PascalCase (e.g., `UserProfileComponent`)
- **Methods/Variables**: camelCase (e.g., `getUserProfile()`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Component Files**: Always separate .ts, .html, .css files

### Backend Naming Rules
- **Files**: PascalCase (e.g., `UserController.cs`)
- **Directories**: PascalCase (e.g., `Controllers/`)
- **Classes**: PascalCase (e.g., `UserService`)
- **Methods**: PascalCase (e.g., `GetUserProfile()`)
- **Variables**: camelCase (e.g., `userProfile`)
- **Constants**: PascalCase (e.g., `DefaultPageSize`)

## Configuration Management

### Frontend Configuration
- **environment.ts**: Development settings (API URLs, feature flags)
- **environment.prod.ts**: Production settings
- **angular.json**: Angular CLI build and serve configurations
- **tailwind.config.js**: Tailwind CSS customization

### Backend Configuration
- **appsettings.json**: Base configuration (logging, database connections)
- **appsettings.Development.json**: Development-specific overrides
- **appsettings.Production.json**: Production-specific settings
- **Program.cs**: Service registration and middleware pipeline

## Build and Deployment Structure

### Frontend Build
- **dist/**: Compiled Angular application ready for deployment
- **coverage/**: Test coverage reports
- **node_modules/**: NPM dependencies (not deployed)

### Backend Build
- **bin/**: Compiled .NET assemblies and dependencies
- **obj/**: Temporary build files (not deployed)
- **Migrations/**: Database schema migration files

## Architecture Patterns

### Frontend Architecture
- **Feature-First Organization**: Features encapsulate related components, services, and models
- **Shared Module Pattern**: Common functionality centralized in shared module
- **Core Module Pattern**: Singleton services and guards in core module
- **Lazy Loading**: Feature modules loaded on demand via routing

### Backend Architecture
- **Clean Architecture**: Strict separation of concerns across layers
- **Domain-Driven Design**: Business logic organized around domain entities
- **Repository Pattern**: Data access abstracted behind interfaces
- **Dependency Injection**: Services registered and injected via built-in DI container
- **Middleware Pipeline**: Cross-cutting concerns handled via middleware