---
allowed-tools: Write, Edit, Read
argument-hint: [feature-name] [operation-type]
description: Generate CQRS commands and queries with handlers, validation, and mapping
---

Generate complete CQRS implementation for a feature:

**Feature**: $ARGUMENTS

**CQRS Implementation**:
1. **Commands**:
   - Create, Update, Delete operations
   - Command DTOs with validation
   - Command handlers with business logic
   - Result pattern implementation
   - Domain event triggering

2. **Queries**:
   - Get by ID, Get list, Search operations
   - Query DTOs and response models
   - Query handlers with data access
   - Pagination and filtering support
   - Projection and mapping

3. **Validation**:
   - FluentValidation rules
   - Business rule validation
   - Cross-field validation
   - Async validation for uniqueness
   - Custom validation messages

4. **Mapping**:
   - AutoMapper profiles
   - Entity to DTO mapping
   - Command to entity mapping
   - Response model mapping
   - Value object conversions

5. **Behaviors**:
   - Validation pipeline behavior
   - Logging pipeline behavior
   - Performance monitoring behavior
   - Transaction management behavior

6. **API Endpoints**:
   - Minimal API endpoint definitions
   - Request/Response models
   - HTTP status code handling
   - OpenAPI documentation
   - Error response formatting

Use api-architect agent to implement complete CQRS pattern with MediatR.
