---
inclusion: always
---

# SportPlanner Project Structure & Organization

## Current Monorepo Layout
```
SportPlanner/
├── frontend/              # Angular 18 application
│   ├── src/
│   │   ├── app/
│   │   │   ├── features/  # Feature-based modules
│   │   │   ├── core/      # Singleton services, guards
│   │   │   └── shared/    # Reusable components, pipes
│   │   └── assets/
│   ├── angular.json
│   └── package.json
├── backend/               # .NET 8 Web API (Simple Architecture)
│   ├── Controllers/       # API endpoints
│   ├── Models/           # Data models & DTOs (duplicated with frontend)
│   ├── Services/         # Business logic services
│   ├── Data/             # Entity Framework DbContext
│   └── appsettings.json
├── docs/                 # Project documentation
└── README.md
```

## Current Issues & Planned Improvements
- **Missing shared/ Directory**: Models/DTOs are currently duplicated between frontend and backend
- **Simple Architecture**: Backend uses basic MVC pattern, planned migration to Clean Architecture
- **Code Duplication**: Types and interfaces exist in both projects separately

## Naming Conventions

### Angular Frontend
- **Components**: kebab-case files, PascalCase classes (`user-profile.component.ts` → `UserProfileComponent`)
- **Services**: kebab-case files, PascalCase classes (`auth.service.ts` → `AuthService`)
- **Features**: kebab-case directories (`user-management/`, `event-planning/`)
- **Models**: PascalCase interfaces and classes (`User`, `Event`, `TrainingSession`)

### .NET Backend
- **Controllers**: PascalCase (`UsersController`, `EventsController`)
- **Models**: PascalCase (`User`, `Event`, `CreateUserRequest`)
- **Services**: Interface + Implementation pattern (`IUserService`, `UserService`)
- **Directories**: PascalCase (`Controllers/`, `Models/`, `Services/`)

### Shared Resources (Future)
- **TypeScript Types**: PascalCase interfaces (`User`, `Event`, `ApiResponse<T>`)
- **DTOs**: Descriptive names (`CreateUserRequest`, `EventSummaryResponse`)

## Feature Organization Pattern

### Angular Features Structure
```
features/
├── user-management/
│   ├── components/
│   ├── services/
│   ├── models/           # Feature-specific interfaces
│   └── user-management.module.ts
├── event-planning/
│   ├── components/
│   ├── services/
│   ├── models/
│   └── event-planning.module.ts
└── training-sessions/
    ├── components/
    ├── services/
    ├── models/
    └── training-sessions.module.ts
```

### Backend Controllers Organization
- One controller per main entity (`UsersController`, `EventsController`, `TrainingSessionsController`)
- RESTful endpoint naming
- Clear separation of concerns between Controllers and Services

## Future Evolution Plan

### Phase 1: Create Shared Directory
```
shared/
├── types/
│   ├── entities/         # Core business entities (User, Event, etc.)
│   ├── dtos/            # API request/response types
│   └── enums/           # Shared enumerations
└── constants/           # Shared constants and configurations
```

### Phase 2: Clean Architecture Migration (Backend)
```
backend/
├── SportPlanner.API/           # Web API layer
├── SportPlanner.Application/   # Use cases, interfaces
├── SportPlanner.Domain/        # Business entities, rules
├── SportPlanner.Infrastructure/ # Data access, external services
└── SportPlanner.Shared/        # Common utilities
```

### Phase 3: Type Safety Integration
- Generate TypeScript types from C# models
- Implement shared validation schemas
- Unified error handling patterns

## Configuration Management

### Environment Configuration
- **Frontend**: `src/environments/` (environment.ts, environment.prod.ts)
- **Backend**: appsettings.json, appsettings.Development.json
- **Future**: Shared configuration constants in shared/ directory

### Build Configuration
- **Angular**: angular.json for build settings
- **ASP.NET**: .csproj files for build configuration
- **Monorepo**: Root-level scripts for coordinated builds

## Development Workflow Structure

### Branch Organization
- Feature branches: `feature/user-management-enhancement`
- Bug fixes: `fix/login-validation-issue`
- Architecture changes: `arch/clean-architecture-migration`

### Testing Structure (Future)
```
tests/
├── frontend/
│   ├── unit/
│   ├── integration/
│   └── e2e/
└── backend/
    ├── unit/
    ├── integration/
    └── api/
```

## Key Principles

1. **Clear Separation**: Frontend and backend remain independent but coordinated
2. **Feature-Based Development**: Organize by business capabilities, not technical layers
3. **Eliminate Duplication**: Shared types and DTOs in dedicated directory
4. **Gradual Evolution**: Migrate to Clean Architecture without disrupting current development
5. **Type Safety**: Maintain strong typing across the full stack
6. **Documentation-First**: Keep documentation alongside relevant code