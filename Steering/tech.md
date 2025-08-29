---
inclusion: always
---

# Technology Stack & Development Conventions

## Core Technologies
- **Frontend**: Angular 20 with Angular Material UI and Tailwind CSS
- **Backend**: .NET 8 Web API with Entity Framework Core
- **Database**: Supabase (PostgreSQL with authentication and real-time features)
- **Architecture**: Clean Architecture with 4-layer structure and Domain-Driven Design

## Development Rules

### ALWAYS Rules
- **ALWAYS** implement unit tests for new components and services
- **ALWAYS** use Clean Architecture with strict separation of concerns
- **ALWAYS** implement Dependency Injection patterns
- **ALWAYS** organize code into feature modules per domain
- **ALWAYS** use Swagger documentation for API endpoints
- **ALWAYS** configure Tailwind CSS only via .postcssrc.json file
- **ALWAYS** use external template and style files (no inline templates/styles)
- **ALWAYS** follow the established folder structure conventions

### NEVER Rules
- **NEVER** mix business logic with presentation logic
- **NEVER** bypass the dependency injection container
- **NEVER** use inline templates or styles in Angular components
- **NEVER** configure Tailwind outside of .postcssrc.json
- **NEVER** skip unit test implementation for new features

## Architecture Pattern

### Clean Architecture (4 Layers)
1. **Domain Layer**: Core business entities and rules
2. **Application Layer**: Use cases and application services
3. **Infrastructure Layer**: External concerns (database, external APIs)
4. **Presentation Layer**: Controllers, components, and user interface

### Domain-Driven Design
- Feature modules organized by business domains
- Clear bounded contexts
- Shared kernel for common functionality

## Framework Conventions

### Angular 20 Frontend
- **Component Structure**: External template (.html) and style (.scss) files
- **Module Organization**: Feature modules with shared/core module structure
- **UI Framework**: Angular Material UI components
- **Styling**: Tailwind CSS configured via .postcssrc.json
- **State Management**: Angular services with dependency injection

### .NET 8 Backend
- **API Pattern**: Web API with RESTful endpoints
- **Data Access**: Entity Framework Core with Supabase PostgreSQL
- **Architecture**: Clean Architecture implementation
- **Documentation**: Swagger/OpenAPI integration
- **Dependency Injection**: Built-in .NET DI container

## Code Organization

### Folder Structure
```
src/
├── front/SportPlanner/
│   ├── src/app/
│   │   ├── core/                    # Singleton services, guards
│   │   ├── shared/                  # Reusable components, pipes, directives
│   │   ├── features/               # Feature modules by domain
│   │   │   ├── [domain-name]/
│   │   │   │   ├── components/
│   │   │   │   ├── services/
│   │   │   │   └── [domain].module.ts
│   │   └── app.module.ts
├── back/SportPlanner.API/
│   ├── Controllers/
│   ├── Domain/
│   ├── Application/
│   ├── Infrastructure/
│   └── Presentation/
```

### Naming Conventions
- **Files**: kebab-case (user-profile.component.ts)
- **Classes**: PascalCase (UserProfileComponent, UserService)
- **Methods**: camelCase (getUserProfile, updateUserData)
- **Interfaces**: PascalCase with 'I' prefix (IUserService)
- **Components**: Suffix with .component (UserProfileComponent)
- **Services**: Suffix with .service (UserProfileService)
- **Modules**: Suffix with .module (UserProfileModule)

## Development Workflow

### Development Process
1. **Feature Development**: Create feature branch from main
2. **Implementation**: Follow Clean Architecture patterns
3. **Testing**: Write unit tests for all new code
4. **Code Review**: Peer review before merge
5. **Integration**: Merge to main after approval

### Testing Strategy
- **Angular Frontend**:
  - Jest for unit tests
  - Cypress for end-to-end testing
  - Component testing with TestBed
- **.NET Backend**:
  - xUnit for unit and integration tests
  - Moq for mocking dependencies
  - Test coverage reporting in CI pipeline

### Quality Standards
- **Code Coverage**: Enforced via CI pipeline
- **API Documentation**: Swagger/OpenAPI required for all endpoints
- **Code Style**: Consistent formatting and linting
- **Architecture Compliance**: Strict adherence to Clean Architecture principles
- **Dependency Management**: Proper use of dependency injection patterns

## Technology Integration

### Supabase Integration
- **Authentication**: Supabase Auth for user management
- **Database**: PostgreSQL via Supabase
- **Real-time**: Supabase real-time subscriptions for live updates
- **Storage**: Supabase storage for file management

### Build and Deployment
- **Frontend**: Angular CLI build process
- **Backend**: .NET build and publish
- **Configuration**: Environment-specific settings
- **CI/CD**: Automated testing and deployment pipeline