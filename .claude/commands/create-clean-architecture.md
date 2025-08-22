---
allowed-tools: Write, Edit, Bash(dotnet:*), Read
argument-hint: [project-name]
description: Create Clean Architecture solution structure with layers and modern patterns
---

Create a complete Clean Architecture .NET 8 solution:

**Project Name**: $ARGUMENTS

**Architecture Setup**:
1. **Solution Structure**:
   - Domain Layer (Entities, Value Objects, Aggregates)
   - Application Layer (CQRS, Commands, Queries, DTOs)
   - Infrastructure Layer (Repositories, EF Core, External Services)
   - API Layer (Minimal APIs, Endpoints, Middleware)
   - Shared Kernel (Common utilities, extensions)

2. **Design Patterns**:
   - Domain-Driven Design (DDD)
   - Command Query Responsibility Segregation (CQRS)
   - Repository Pattern with Unit of Work
   - Specification Pattern
   - Domain Events
   - Result Pattern for error handling

3. **Technologies & Libraries**:
   - MediatR for CQRS
   - FluentValidation for validation
   - AutoMapper for object mapping
   - Entity Framework Core for persistence
   - Supabase integration
   - Global exception handling

4. **Project Features**:
   - Rich domain models with business logic
   - Strongly typed IDs
   - Value objects for domain concepts
   - Domain services for complex business rules
   - Application services with validation
   - Clean API endpoints

Use api-architect agent to implement Clean Architecture patterns and best practices.
