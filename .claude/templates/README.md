# SportPlanner Code Templates

This directory contains code templates to ensure consistency and best practices across the SportPlanner project.

## Available Templates

### Frontend (Angular 20+)

#### `component-template.ts`
Standard Angular component template with modern patterns:
- Standalone component architecture
- Signal-based state management
- OnPush change detection strategy
- Reactive forms with validation
- Notification service integration
- Error handling patterns
- TypeScript best practices

**Usage:**
```bash
# Copy and customize the template
cp .claude/templates/component-template.ts src/front/SportPlanner/src/app/components/new-component.component.ts

# Replace placeholders:
# [COMPONENT_NAME] → kebab-case name (e.g., 'team-list')
# [COMPONENT_CLASS] → PascalCase name (e.g., 'TeamList')
# [DATA_TYPE] → TypeScript type (e.g., 'Team')
# [ENTITY] → Entity name for messages (e.g., 'Team')
```

### Backend (.NET 8)

#### `service-template.cs`
Service layer template with enterprise patterns:
- Dependency injection ready
- Entity Framework Core integration
- Comprehensive error handling
- Structured logging
- DTO pattern implementation
- User context filtering
- Async/await patterns

**Usage:**
```bash
# Copy and customize the template
cp .claude/templates/service-template.cs src/back/SportPlanner/SportPlanner/Services/NewService.cs

# Replace placeholders:
# [SERVICE_NAME] → Service name (e.g., 'Team')
# [ENTITY] → Entity name (e.g., 'Team') 
# [ENTITY_PLURAL] → Plural form (e.g., 'Teams')
```

#### `controller-template.cs`
API controller template with RESTful design:
- RESTful endpoint structure
- Comprehensive error handling
- Authorization integration
- OpenAPI documentation
- User context integration
- Model validation
- Structured logging

**Usage:**
```bash
# Copy and customize the template
cp .claude/templates/controller-template.cs src/back/SportPlanner/SportPlanner/Controllers/NewController.cs

# Replace placeholders:
# [CONTROLLER_NAME] → Controller name (e.g., 'Teams')
# [SERVICE_NAME] → Service name (e.g., 'Team')
# [ENTITY] → Entity name (e.g., 'Team')
# Plus lowercase and plural variants
```

## Template Customization Guide

### 1. **Placeholder Replacement**
Each template contains placeholders marked with `[PLACEHOLDER_NAME]`. These must be replaced with project-specific values.

### 2. **Common Placeholders**
- `[COMPONENT_NAME]` - kebab-case component name
- `[COMPONENT_CLASS]` - PascalCase class name  
- `[SERVICE_NAME]` - PascalCase service name
- `[CONTROLLER_NAME]` - PascalCase controller name
- `[ENTITY]` - Entity name (e.g., Team, User, Planning)
- `[ENTITY_PLURAL]` - Plural entity name
- `[DATA_TYPE]` - TypeScript/C# type definition

### 3. **After Copying Template**
1. Replace all placeholders with actual values
2. Remove placeholder comments and instructions
3. Implement business logic specific to your use case
4. Add necessary imports and dependencies
5. Create corresponding HTML/CSS files for Angular components
6. Create DTOs for .NET services/controllers

## Best Practices Enforced

### Angular Components
- ✅ Standalone components (no NgModules)
- ✅ Signal-based state management
- ✅ OnPush change detection for performance
- ✅ Reactive forms with proper validation
- ✅ Notification service for user feedback
- ✅ Proper error handling and loading states
- ✅ TypeScript strict mode compliance

### .NET Services
- ✅ Interface-based design for testability
- ✅ Dependency injection patterns
- ✅ Entity Framework best practices
- ✅ Comprehensive error handling
- ✅ Structured logging with context
- ✅ DTO pattern for data transfer
- ✅ User context filtering for security

### .NET Controllers
- ✅ RESTful API design principles
- ✅ Proper HTTP status codes
- ✅ Authorization and authentication
- ✅ OpenAPI documentation
- ✅ Model validation
- ✅ Comprehensive error responses
- ✅ Structured logging

## Integration with Specialized Agents

These templates are designed to work with SportPlanner's specialized Claude agents:

- **angular-best-practices**: Automatically uses these templates when generating Angular components
- **dotnet-expert**: References these patterns when creating .NET services and controllers  
- **task-coordinator**: Coordinates template usage across multiple specialists
- **tech-documenter**: Updates documentation when new templates are added

## Custom Template Creation

When creating new templates:

1. Follow existing template structure and patterns
2. Include comprehensive placeholder documentation
3. Add usage instructions and examples
4. Follow project's coding standards and conventions
5. Include error handling and logging patterns
6. Document required dependencies and imports
7. Test templates with actual implementations

## Template Validation

Before using a template in production:

1. ✅ All placeholders properly documented
2. ✅ Usage instructions complete and accurate
3. ✅ Code follows project standards
4. ✅ Error handling implemented
5. ✅ Logging patterns included
6. ✅ Security considerations addressed
7. ✅ Performance optimizations applied

---

**Note**: These templates are living documents that evolve with the project. When patterns change or new best practices are adopted, templates should be updated to reflect these changes.