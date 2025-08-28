---
allowed-tools: Read, LS, Glob, Bash
argument-hint: [feature-name or spec-path]
description: Coordinate feature implementation by delegating tasks to specialized development agents (angular-developer, dotnet-developer, etc.)
---

# Develop Feature Implementation

Use the development-coordinator agent to orchestrate the implementation of a feature by delegating tasks to specialized technology agents.

## What This Command Does

This command activates the `development-coordinator` agent which will:

1. **Analyze Specifications**: Read and understand requirements, design, and tasks
2. **Technology Detection**: Identify which specialized agents are needed for each task
3. **Agent Delegation**: Route tasks to appropriate development agents
4. **Progress Coordination**: Monitor implementation progress across all agents
5. **Integration Management**: Ensure different technology components work together

## Supported Development Agents

The coordinator can delegate to these specialized agents:

### **angular-developer**
- **Handles**: Angular/TypeScript frontend development
- **Files**: `*.ts`, `*.html`, `*.scss`, `*.spec.ts`
- **Tasks**: Components, services, routing, forms, testing
- **Conventions**: Uses Conventions/shared.md + Conventions/angular.md

### **dotnet-developer** 
- **Handles**: .NET/C# backend development
- **Files**: `*.cs`, `*.csproj`, configuration files
- **Tasks**: APIs, business logic, data access, validation
- **Conventions**: Uses Conventions/shared.md + Conventions/dotnet.md

### **integration-developer**
- **Handles**: Cross-technology integration and coordination
- **Tasks**: API integration, configuration alignment, end-to-end features
- **Conventions**: Uses all relevant convention files

## Development Process

### Phase 1: Specification Analysis
1. **Read Complete Specs**: Load requirements.md, design.md, tasks.md
2. **Context Integration**: Reference all steering files and conventions from Conventions/ directory
3. **Task Inventory**: Analyze all implementation tasks
4. **Agent Mapping**: Determine which agent handles each task

### Phase 2: Agent Availability Check
1. **Verify Agents Exist**: Confirm required specialized agents are available
2. **Missing Agent Handling**: Alert user if required agents are not found
3. **Capability Assessment**: Ensure agents can handle assigned tasks

### Phase 3: Coordinated Execution
1. **Task Delegation**: Route each task to appropriate specialized agent
2. **Context Provision**: Provide full project context to each agent
3. **Progress Monitoring**: Track implementation across all agents
4. **Integration Oversight**: Ensure components work together

### Phase 4: Quality Assurance
1. **Integration Testing**: Verify components integrate properly
2. **Convention Compliance**: Ensure adherence to project standards
3. **Documentation Updates**: Update relevant docs if needed
4. **Completion Reporting**: Provide comprehensive implementation summary

## How to Use

### Option 1: By Feature Name
```bash
/develop-feature user-authentication
# Automatically finds specs/user-authentication/ and implements
```

### Option 2: By Spec Path
```bash
/develop-feature specs/user-management/
# Implements the specific specification
```

### Option 3: Direct Agent Invocation
```bash
Use the development-coordinator agent to implement the user-authentication feature
```

## Task Routing Logic

The coordinator uses smart routing based on:

### **File Extensions**
- `.ts`, `.html`, `.scss` → **angular-developer**
- `.cs`, `.csproj` → **dotnet-developer**
- Configuration files → Appropriate specialist

### **Directory Patterns**
- `src/app/`, `src/components/` → **angular-developer**
- `Controllers/`, `Services/`, `Data/` → **dotnet-developer**
- Cross-cutting concerns → **integration-developer**

### **Task Keywords**
- "component", "service", "routing" → **angular-developer**
- "controller", "entity", "repository" → **dotnet-developer**
- "integration", "API connection" → **integration-developer**

## Error Handling

### Missing Agent Scenario
```
⚠️ **Specialized Agent Not Found**

The task "Create React component" requires a **react-developer** agent, 
but it's not currently available.

**Action Required**: 
1. Create a react-developer agent
2. Install from agent library
3. Ask for implementation guidance

Would you like me to:
- Provide a template for this agent?
- Continue with available agents only?
```

### Dependency Management
```
🔗 **Task Dependencies Detected**

Task "Frontend integration" depends on:
- "Create User API" (Status: pending)
- "Setup authentication" (Status: complete)

**Action**: Deferring task until dependencies are resolved.
```

## Progress Reporting

### Real-time Updates
```
📊 **Development Progress Update**

**Completed**: 
- ✅ User Entity Creation (dotnet-developer)
- ✅ User Repository Setup (dotnet-developer)

**In Progress**:
- 🔄 User Profile Component (angular-developer)

**Pending**:
- ⏳ API Integration (integration-developer)
- ⏳ Form Validation (angular-developer)
```

## Quality Standards

The coordinator ensures:

- **Accurate Delegation**: Each task goes to the most appropriate specialist
- **Complete Context**: Agents receive all necessary steering and convention files
- **Dependency Management**: Tasks execute in proper order
- **Integration Focus**: Cross-technology components work together seamlessly
- **Progress Transparency**: Clear reporting on implementation status

## Integration with Specs

The coordinator seamlessly integrates with specifications created by `specs-generator`:

1. **Reads Complete Context**: All steering files, conventions, and specifications
2. **Understands Dependencies**: Respects task ordering and prerequisites  
3. **Maintains Traceability**: Links implementation back to original requirements
4. **Ensures Quality**: Validates against design decisions and acceptance criteria

Ready to coordinate a professional development workflow that leverages specialized agents for optimal results!
