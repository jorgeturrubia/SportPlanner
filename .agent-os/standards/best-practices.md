# Development Best Practices - PlanSport

## Context

Mejores prácticas específicas para el desarrollo de PlanSport (Angular 20 + .NET 8).

## Core Principles

### Keep It Simple
- Implement code in the fewest lines possible
- Avoid over-engineering solutions
- Choose straightforward approaches over clever ones
- Use Angular's built-in features before adding external libraries

### Optimize for Readability
- Prioritize code clarity over micro-optimizations
- Write self-documenting code with clear variable names
- **NO ADD COMMENTS** unless explicitly requested
- Use TypeScript types for self-documentation

### DRY (Don't Repeat Yourself)
- Extract repeated business logic to Angular services
- Create reusable Angular components with Tailwind CSS
- Use Angular pipes for data transformation
- Create utility functions in shared modules

### Angular-Specific Practices
- **Standalone Components**: Always use standalone components
- **Signals Over Observables**: Prefer signals for simple state
- **OnPush Strategy**: Use OnPush for performance optimization
- **Typed Forms**: Always use strongly typed reactive forms
- **Modern Control Flow**: Use @if, @for, @switch syntax

### .NET API Practices
- **Minimal APIs**: Use for simple CRUD operations
- **Controller APIs**: Use for complex business logic
- **Dependency Injection**: Use built-in DI container
- **Async/Await**: Use async patterns for all I/O operations
- **DTOs**: Always use DTOs for API contracts

### File Structure
- **Angular**: Feature-based modules with shared components
- **.NET**: Clean architecture with Controllers/Services/Models
- **Shared**: Create shared utilities and types
- **Consistent Naming**: Follow established conventions
</conditional-block>

<conditional-block context-check="dependencies" task-condition="choosing-external-library">
IF current task involves choosing an external library:
  IF Dependencies section already read in current context:
    SKIP: Re-reading this section
    NOTE: "Using Dependencies guidelines already in context"
  ELSE:
    READ: The following guidelines
ELSE:
  SKIP: Dependencies section not relevant to current task

## Dependencies

### Choose Libraries Wisely
When adding third-party dependencies:
- Select the most popular and actively maintained option
- Check the library's GitHub repository for:
  - Recent commits (within last 6 months)
  - Active issue resolution
  - Number of stars/downloads
  - Clear documentation
</conditional-block>
