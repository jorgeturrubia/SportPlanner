---
inclusion: always
---

# Technology Stack & Development Conventions

## Core Technologies
- **Frontend**: Angular 20 with standalone components
- **Styling**: Tailwind CSS v4 with Hero Icons
- **Backend**: .NET 8 with Clean Architecture + Domain-Driven Design (DDD)
- **Data Access**: Entity Framework Core
- **Database**: PostgreSQL hosted on Supabase
- **API Design**: RESTful APIs
- **Architecture**: Clean Architecture backend, component-based frontend

## Development Rules
- **ALWAYS** use single responsibility principle for functions and components
- **ALWAYS** follow consistent naming conventions (camelCase for Angular, PascalCase for .NET)
- **ALWAYS** write self-documenting code with descriptive variable and function names
- **ALWAYS** implement proper error handling for all operations
- **NEVER** write comments to explain "what" the code does - only "why" when necessary
- **NEVER** create duplicate code - refactor to eliminate redundancy

## Framework Conventions

### Angular (Frontend)
- Use standalone components architecture
- Follow camelCase naming for variables, methods, and properties
- Organize components with clear separation of concerns
- Implement proper TypeScript typing
- Use Angular's built-in dependency injection

### .NET 8 (Backend)
- Follow Clean Architecture principles with DDD
- Use PascalCase naming for classes, methods, and properties
- Implement proper layered architecture (Domain, Application, Infrastructure, API)
- Leverage Entity Framework Core for data access
- Follow SOLID principles

## Code Organization
- **Business Logic**: Separate from presentation and data layers
- **Component Structure**: Standalone Angular components with clear responsibilities
- **API Structure**: RESTful endpoints following consistent patterns
- **Database Access**: Repository pattern with Entity Framework Core
- **Error Handling**: Consistent error handling across all layers

## Development Workflow
1. **Code Development**: Write clean, readable code following naming conventions
2. **Self Review**: Always review your own code before considering it complete
3. **Manual Testing**: Test all functionality including edge cases and error scenarios
4. **Refactoring**: Regular refactoring to eliminate duplicate code and improve maintainability
5. **Integration**: Verify existing functionality isn't broken when adding new features
6. **Git Operations**: Manual branching and Git operations as needed

## Quality Standards
- **Code Quality**: Small functions with single responsibility
- **Readability**: Self-documenting code that's easy to understand and maintain
- **Testing**: Manual testing of all functionality before integration
- **Architecture**: Follow appropriate patterns for the technology stack
- **Maintainability**: Regular refactoring and clean code practices

## Recommended Testing Frameworks
- **Frontend**: Jest for unit testing Angular components
- **Backend**: xUnit for .NET unit and integration testing
- **E2E**: Consider Playwright or Cypress for end-to-end testing
- **API Testing**: Use tools like Postman or REST Client extensions

## Database & Infrastructure
- **Database**: PostgreSQL with proper indexing and relationships
- **Hosting**: Supabase for database and potential backend services
- **ORM**: Entity Framework Core with code-first migrations
- **Authentication**: Leverage Supabase Auth if needed