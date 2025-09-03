# SportPlanner - Claude Agent Orchestration System

*Last updated: 2025-09-03*
*Agent Management Engine for SportPlanner Development*

## 🎯 Mission Statement

This CLAUDE.md file serves as the central orchestration engine for the SportPlanner project, managing a specialized team of AI agents designed to handle complex development workflows. Each agent brings deep expertise in their domain while working collaboratively to deliver high-quality solutions.

## 🏗️ Agent Architecture

### Core Orchestration Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  User Request   │───▶│ Task Coordinator│───▶│ Specialized     │
│                 │    │                 │    │ Agent Selection │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │                        │
                              ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Quality Gates   │◀───│ Execution &     │◀───│ Implementation  │
│ & Validation    │    │ Monitoring      │    │ Phase           │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🤖 Specialized Agents

### 1. Task Coordinator (`task-coordinator.md`)
**Primary Role**: Intelligent task analysis, agent selection, and workflow orchestration

**When to Use:**
- Complex multi-step development tasks requiring multiple specialists
- Need for strategic planning and task breakdown
- Coordination between different technology areas (backend, frontend, database)
- Workflow management and progress tracking

**Core Capabilities:**
- Requirements analysis and complexity assessment
- Agent discovery and capability matching
- Strategic planning with dependency management
- Progress monitoring and quality assurance

### 2. .NET Expert (`dotnet-expert.md`)
**Primary Role**: Modern .NET 8 backend development and architecture

**When to Use:**
- Implementing ASP.NET Core APIs and services
- Entity Framework Core data access patterns
- Modern C# 12 feature implementation
- Performance optimization and security best practices
- Code reviews for .NET components

**Core Capabilities:**
- Minimal APIs and modern ASP.NET Core patterns
- Entity Framework Core optimization
- Dependency injection and service lifetime management
- JWT authentication and authorization
- Performance profiling and optimization

### 3. Angular Best Practices (`angular-best-practices.md`)
**Primary Role**: Modern Angular v20+ frontend development

**When to Use:**
- Creating standalone components and services
- Implementing reactive state management with signals
- Modern Angular control flow (@if, @for, @switch)
- TypeScript optimization and type safety
- Component architecture and performance optimization

**Core Capabilities:**
- Standalone component architecture
- Signal-based reactive programming
- Built-in control flow implementation
- OnPush change detection strategies
- Angular CLI integration via MCP tools

### 4. Database Expert (`database-expert.md`)
**Primary Role**: PostgreSQL optimization and Entity Framework Core architecture

**When to Use:**
- Database schema design and migration strategies
- Query performance optimization and indexing
- Complex relationship modeling
- Data access pattern implementation
- Database security and backup strategies

**Core Capabilities:**
- Advanced PostgreSQL features (JSONB, full-text search)
- Entity Framework Core configuration and optimization
- Repository and Unit of Work patterns
- Query performance analysis and optimization
- Migration strategies and data seeding

### 5. DevOps Expert (`devops-expert.md`)
**Primary Role**: CI/CD, containerization, and deployment automation

**When to Use:**
- Setting up GitHub Actions workflows
- Containerizing applications with Docker
- Azure/AWS deployment configurations
- Infrastructure as Code (Terraform)
- Monitoring and observability setup

**Core Capabilities:**
- Multi-stage Docker builds
- GitHub Actions pipeline design
- Azure Container Apps deployment
- Infrastructure automation with Terraform
- Security scanning and compliance

### 6. Testing Expert (`testing-expert.md`)
**Primary Role**: Comprehensive testing strategy implementation

**When to Use:**
- Implementing unit tests with proper mocking
- Integration testing with TestServer
- E2E testing with Cypress/Playwright
- Performance testing and benchmarking
- Test automation in CI/CD pipelines

**Core Capabilities:**
- xUnit and Jest testing frameworks
- Mocking strategies with Moq/NSubstitute
- Angular component testing with TestBed
- API testing and validation
- Load testing and performance validation

### 7. Technical Documenter (`tech-documenter.md`)
**Primary Role**: Technical documentation and knowledge management

**When to Use:**
- After implementing new features or architectural changes
- Creating/updating API documentation
- Establishing coding standards and style guides
- Documenting technical decisions and rationale
- Maintaining the steering/ directory documentation

**Core Capabilities:**
- Structured documentation in steering/ directory
- API documentation and architectural guides
- Style guide creation and maintenance
- Decision logging and technical history
- Cross-referenced documentation systems

## 🔄 Workflow Orchestration

### Standard Development Workflow

1. **Request Analysis** (`task-coordinator`)
   - Parse user requirements
   - Identify complexity and scope
   - Determine required specialists

2. **Planning Phase** (`task-coordinator` + specialists)
   - Break down tasks into manageable components
   - Define dependencies and milestones
   - Create execution plan with quality gates

3. **Implementation Phase** (specialized agents)
   - Execute tasks with domain expertise
   - Apply best practices and standards
   - Maintain code quality and performance

4. **Quality Assurance** (multiple agents)
   - Code review and validation
   - Testing implementation (`testing-expert`)
   - Security and performance validation

5. **Documentation** (`tech-documenter`)
   - Update technical documentation in steering/
   - Document decisions and architectural changes
   - Maintain style guides and standards

6. **Deployment** (`devops-expert`)
   - Container packaging and deployment
   - Pipeline execution and monitoring
   - Post-deployment validation

### Agent Selection Matrix

| Task Type | Primary Agent | Supporting Agents |
|-----------|---------------|-------------------|
| Feature Implementation | `task-coordinator` → domain expert | `testing-expert`, `tech-documenter` |
| Bug Fixes | Domain expert directly | `testing-expert` for validation |
| Performance Issues | Domain expert + `database-expert` | `testing-expert` for benchmarks |
| Deployment Issues | `devops-expert` | `database-expert` if data-related |
| Architecture Decisions | `task-coordinator` + domain experts | `tech-documenter` |
| Code Reviews | Domain expert | `testing-expert`, `tech-documenter` |

## 🛠️ Project Context Integration

### SportPlanner Technology Stack

- **Backend**: ASP.NET Core 8, Entity Framework Core, PostgreSQL
- **Frontend**: Angular 20+, TypeScript, Tailwind CSS, Signals
- **Authentication**: Supabase Auth integration
- **Deployment**: Docker, Azure Container Apps
- **Testing**: xUnit, Jest, Cypress
- **CI/CD**: GitHub Actions

### Key Project Standards

1. **Code Quality**
   - Follow established style guides in steering/style-guides.md
   - Implement comprehensive test coverage
   - Use modern framework patterns and best practices

2. **Security**
   - JWT authentication with proper validation
   - Input sanitization and SQL injection prevention
   - HTTPS enforcement and secure headers

3. **Performance**
   - Database query optimization
   - Angular OnPush change detection
   - Efficient caching strategies
   - Bundle size optimization

4. **Documentation**
   - Maintain steering/ directory structure
   - Document all architectural decisions
   - Keep API documentation current

## 📋 Quality Gates & Standards

### Code Quality Requirements

- **Test Coverage**: 80%+ for unit tests, critical path coverage for integration
- **Performance**: API responses < 200ms, bundle size < 2MB
- **Security**: All security scans pass, no exposed credentials
- **Documentation**: All new features documented in steering/

### Deployment Gates

1. All automated tests pass
2. Security scans complete successfully  
3. Performance benchmarks met
4. Documentation updated
5. Code review approved

## 🚀 Getting Started

### For New Features
```
1. Submit request to task-coordinator
2. Review generated execution plan
3. Approve plan and begin implementation
4. Follow quality gates throughout process
```

### For Bug Fixes
```
1. Identify appropriate domain expert
2. Implement fix with proper testing
3. Validate solution meets requirements
```

### For Architecture Changes
```
1. Use task-coordinator for analysis
2. Involve multiple domain experts as needed
3. Document decisions in steering/decision-log.md
4. Update relevant steering/ documentation
```

## 📊 Agent Performance Metrics

- **Task Completion Rate**: Track successful task completion by agent
- **Code Quality Metrics**: Test coverage, security scan results, performance benchmarks
- **Documentation Coverage**: Percentage of features with complete documentation
- **Deployment Success Rate**: Successful deployments without rollbacks

---

This orchestration system ensures that every aspect of SportPlanner development is handled by the most qualified specialist while maintaining cohesive project standards and documentation. The task-coordinator serves as the intelligent dispatcher, ensuring optimal resource allocation and workflow management.