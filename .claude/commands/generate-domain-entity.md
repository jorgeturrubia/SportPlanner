---
allowed-tools: Write, Edit, Read
argument-hint: [entity-name] [description]
description: Generate complete domain entity with business logic, value objects, and domain events
---

Generate a rich domain entity with Clean Architecture patterns:

**Entity**: $ARGUMENTS

**Domain Entity Generation**:
1. **Rich Domain Model**:
   - Entity with encapsulated business logic
   - Private setters and factory methods
   - Business rule validation
   - Domain events for important changes

2. **Value Objects**:
   - Strongly typed IDs
   - Domain concepts as value objects
   - Validation and business rules
   - Immutable design

3. **Aggregate Design**:
   - Aggregate root identification
   - Consistency boundaries
   - Domain event publishing
   - Business invariants enforcement

4. **Repository Interface**:
   - Domain repository contract
   - Specification pattern support
   - Query abstractions
   - Unit of Work integration

5. **Domain Services**:
   - Complex business logic coordination
   - Cross-aggregate operations
   - Domain rule enforcement
   - External service abstractions

6. **Application Layer**:
   - CQRS Commands and Queries
   - Command/Query handlers
   - DTOs and mapping
   - FluentValidation rules

Use api-architect agent to generate complete domain-driven entity with all supporting patterns.
