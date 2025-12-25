# C# Style Guide

## General Principles
- Follow Microsoft's C# Coding Conventions.
- Use **Clean Architecture** principles.
- Code should be readable, maintainable, and testable.

## Naming Conventions
- **Classes/Interfaces/Methods/Properties:** `PascalCase`
- **Private Fields:** `_camelCase`
- **Parameters/Local Variables:** `camelCase`
- **Interfaces:** Prefix with `I` (e.g., `IUserService`)
- **Async Methods:** Suffix with `Async` (e.g., `GetDataAsync`)

## Formatting
- Use 4 spaces for indentation.
- Braces `{}` should always be on a new line.
- Use file-scoped namespaces: `namespace MyNamespace;`

## Best Practices
- **Async/Await:** Use `async/await` for all I/O bound operations. Avoid `.Result` or `.Wait()`.
- **Nullability:** Enable Nullable Reference Types (`<Nullable>enable</Nullable>`).
- **Dependency Injection:** Use Constructor Injection.
- **LINQ:** Use LINQ for readability, but be mindful of performance in hot paths.
- **Records:** Use `record` for DTOs and immutable data structures.

## Error Handling
- Use Global Exception Handling Middleware.
- Validate inputs early.
- Use custom exceptions for domain errors.

## Testing
- Use xUnit for unit tests.
- Follow AAA (Arrange, Act, Assert) pattern.
