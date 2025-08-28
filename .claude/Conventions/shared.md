---
inclusion: always
---

# Shared Development Conventions

These conventions apply across all technologies and development practices in the project. All specialized agents must follow these shared standards in addition to their technology-specific conventions.

## Code Quality Standards

### General Principles
- **ALWAYS** write self-documenting code with clear variable and method names
- **ALWAYS** follow SOLID principles in design and implementation
- **ALWAYS** implement comprehensive error handling
- **ALWAYS** validate all inputs at system boundaries
- **NEVER** ignore exceptions or errors silently
- **NEVER** commit code without proper testing

### Testing Requirements
- **ALWAYS** write unit tests for business logic
- **ALWAYS** aim for minimum 80% code coverage
- **ALWAYS** test error scenarios and edge cases
- **ALWAYS** use descriptive test names that explain the scenario
- **ALWAYS** follow Arrange-Act-Assert pattern in tests

## API Design Standards

### RESTful Conventions
- Use HTTP verbs correctly: GET (read), POST (create), PUT (update), DELETE (remove)
- Use plural nouns for resource endpoints: `/api/v1/users`, `/api/v1/teams`
- Include API versioning in URLs: `/api/v1/`
- Return appropriate HTTP status codes (200, 201, 400, 401, 404, 500)
- Use consistent response formats with proper error messages

### Response Format Standards
```json
// Success Response
{
  "data": { /* actual response data */ },
  "message": "Operation completed successfully",
  "timestamp": "2024-08-27T10:30:00Z"
}

// Error Response
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Input validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email format is invalid"
      }
    ]
  },
  "timestamp": "2024-08-27T10:30:00Z"
}
```

## Security Standards

### Authentication & Authorization
- **ALWAYS** validate authentication tokens on protected endpoints
- **ALWAYS** implement proper CORS configuration
- **ALWAYS** use HTTPS in production environments
- **ALWAYS** validate user permissions before data access
- **NEVER** expose sensitive information in error messages
- **NEVER** log sensitive data (passwords, tokens, personal information)

### Input Validation
- **ALWAYS** sanitize and validate all user inputs
- **ALWAYS** use parameterized queries to prevent SQL injection
- **ALWAYS** validate file uploads for type, size, and content
- **ALWAYS** implement rate limiting on public endpoints

## Performance Standards

### General Performance
- **ALWAYS** use async/await for I/O operations
- **ALWAYS** implement proper caching strategies where appropriate
- **ALWAYS** optimize database queries to avoid N+1 problems
- **ALWAYS** implement pagination for large datasets
- **ALWAYS** use compression for API responses when beneficial

### Resource Management
- **ALWAYS** properly dispose of resources (using statements, IDisposable)
- **ALWAYS** implement proper connection pooling for databases
- **ALWAYS** monitor memory usage and prevent memory leaks
- **ALWAYS** use appropriate data structures for the use case

## Error Handling Standards

### Error Management
- **ALWAYS** provide meaningful error messages to users
- **ALWAYS** log errors with sufficient context for debugging
- **ALWAYS** implement proper error boundaries/global error handling
- **ALWAYS** return structured error responses from APIs
- **NEVER** expose internal system details in user-facing errors

### Logging Standards
- **ALWAYS** use structured logging (JSON format preferred)
- **ALWAYS** include correlation IDs for request tracking
- **ALWAYS** log at appropriate levels (Debug, Info, Warning, Error, Critical)
- **ALWAYS** include relevant context in log messages
- **NEVER** log sensitive information (passwords, tokens, PII)

## Documentation Standards

### Code Documentation
- **ALWAYS** write clear comments for complex business logic
- **ALWAYS** document public APIs with examples
- **ALWAYS** keep documentation up-to-date with code changes
- **ALWAYS** use meaningful commit messages following conventional commits
- **ALWAYS** document architectural decisions and rationale

### API Documentation
- **ALWAYS** provide OpenAPI/Swagger documentation for APIs
- **ALWAYS** include request/response examples
- **ALWAYS** document error scenarios and status codes
- **ALWAYS** specify required vs optional parameters

## Naming Conventions

### General Naming
- Use clear, descriptive names that explain purpose
- Avoid abbreviations unless they are well-known (URL, HTTP, API)
- Use consistent naming patterns throughout the codebase
- Choose names that are searchable and pronounceable

### File and Directory Naming
- Use consistent naming conventions appropriate for the technology
- Group related files in logical directory structures
- Use descriptive folder names that indicate purpose
- Avoid deep nesting (prefer flatter structures when possible)

## Environment and Configuration Management

### Configuration Standards
- **ALWAYS** use environment variables for sensitive configuration
- **ALWAYS** provide default values for non-sensitive configuration
- **ALWAYS** validate configuration at application startup
- **NEVER** commit sensitive information to version control
- Use configuration files for environment-specific settings

### Environment Management
- Maintain separate configurations for development, staging, and production
- Use connection strings and API keys from secure configuration sources
- Implement proper secrets management in production environments
- Document all required environment variables and configuration options

## Database Standards

### Data Design
- **ALWAYS** use appropriate data types for fields
- **ALWAYS** implement proper indexing for performance
- **ALWAYS** use foreign key constraints to maintain referential integrity
- **ALWAYS** implement soft deletes for important business data
- **NEVER** store sensitive data in plain text

### Migration Management
- **ALWAYS** use migration scripts for database schema changes
- **ALWAYS** test migrations in development environment first
- **ALWAYS** provide rollback scripts for migrations
- **NEVER** modify existing migration files after they've been deployed

## Accessibility and User Experience

### Accessibility Requirements
- **ALWAYS** follow WCAG 2.1 guidelines for web accessibility
- **ALWAYS** provide appropriate ARIA labels and roles
- **ALWAYS** ensure keyboard navigation is fully functional
- **ALWAYS** maintain sufficient color contrast ratios
- **ALWAYS** provide alternative text for images and media

### User Experience
- **ALWAYS** provide loading indicators for long-running operations
- **ALWAYS** implement proper error states with clear recovery actions
- **ALWAYS** ensure responsive design across different screen sizes
- **ALWAYS** provide clear feedback for user actions
- **ALWAYS** implement proper form validation with helpful error messages

## Code Review and Quality Assurance

### Review Process
- **ALWAYS** require code reviews before merging to main branch
- **ALWAYS** run automated tests before code review
- **ALWAYS** check for security vulnerabilities during review
- **ALWAYS** verify that code follows established conventions
- **ALWAYS** ensure proper documentation is included

### Quality Gates
- All tests must pass before deployment
- Code coverage must meet minimum thresholds
- Security scans must pass without critical issues
- Performance benchmarks must be maintained
- Documentation must be updated for public API changes

These shared conventions serve as the foundation for all development work across the project. Technology-specific conventions build upon these standards to provide detailed guidance for particular frameworks and tools.
