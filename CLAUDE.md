# SportPlanner - Sports Planning Platform

## Product Vision & Context
@.claude/docs/PRODUCT.md

SportPlanner is a **collaborative sports planning platform** that revolutionizes training management through:
- **Automated Training Generation**: Create complete schedules in few clicks
- **5-Star Marketplace**: Share and import proven training plans
- **Real-time Execution**: Dynamic training view with integrated chronometer
- **Multi-tenant SaaS**: Free → Coach → Club subscription tiers

**Core Value**: Reduce planning time by 80% while improving training quality through community collaboration.

## Technical Architecture
@.claude/docs/ARCHITECTURE.md

**Full-Stack Modern Setup**:
- **Frontend**: Angular 20+ (Standalone Components, Signals, Tailwind CSS 4.1)
- **Backend**: ASP.NET Core 8 (Minimal APIs, C# 12, Entity Framework Core)
- **Database**: PostgreSQL via Supabase (Multi-tenant with RLS)
- **Auth**: Supabase Auth with JWT tokens

**Domain Model**: Users→Subscriptions→Organizations→Teams→Plannings→Concepts→Exercises→Trainings

## Agent Architecture System
@.claude/docs/AGENTS.md

### **Available Specialized Agents**

**Core Agents**:
- **claude-memory-manager**: Memory & documentation management
- **agent-generator**: Create domain-specific agents  
- **dotnet-expert**: .NET 8 backend specialist (APIs, EF Core, Security)
- **angular-best-practices**: Angular 20+ frontend specialist (Signals, SSR, Performance)
- **general-purpose**: Research, analysis, and multi-step task execution

### **Agent Usage Patterns**
```bash
# Backend development
/Task dotnet-expert "[backend task with context]"

# Frontend development  
/Task angular-best-practices "[frontend task with context]"

# Research and analysis
/Task general-purpose "[research/analysis task]"

# Memory and documentation updates
/Task claude-memory-manager "[documentation task]"

# Create new specialized agents
/Task agent-generator "[agent creation request]"
```

## Development Workflows

### Quick Start Development
```bash
# Backend (.NET 8)
cd src/back/SportPlanner
dotnet restore && dotnet run    # API at https://localhost:7201

# Frontend (Angular 20+)
cd src/front/SportPlanner
npm install && npm start        # App at http://localhost:4200
```

### SportPlanner-Specific Patterns
1. **New Feature Development**:
   - Use appropriate specialized agents for backend/frontend work
   - Provide context from @.claude/docs/ when needed
   - Follow multi-tenant security (user/org isolation)
   - Respect subscription limits in business logic

2. **Database Changes**:
   ```bash
   cd src/back/SportPlanner/SportPlanner
   dotnet ef migrations add [MigrationName]
   dotnet ef database update
   ```

3. **Authentication Flow**:
   - Frontend: Supabase Auth → JWT → localStorage
   - Backend: JwtMiddleware → UserContextService → RLS

## Critical Business Rules

### Subscription Limits (Enforced in Backend)
- **Free**: 1 team, 15 trainings max
- **Coach**: Unlimited trainings, custom concepts, marketplace access
- **Club**: Multi-team management, role-based permissions

### Role-Based Permissions
- **Admin**: Full organization control
- **Director**: Team management, user assignment
- **Coach**: Team planning and training execution
- **Assistant**: Training execution only

### Marketplace Rules
- Only published plannings visible to others
- 5-star rating system (1-5 ⭐)
- Import respects original creator attribution

## Essential Commands

### Development
```bash
# Start full development environment
npm start                       # Frontend dev server
dotnet run                      # Backend API server

# Testing
npm test                        # Angular unit tests
dotnet test                     # .NET backend tests

# Building
npm run build                   # Production frontend build
dotnet build                    # Backend compilation

# Code quality
npm run lint                    # ESLint for Angular
```

### Claude Code System
```bash
/initsystem                     # System health check
/generate-product-docs update   # Refresh documentation
/Task [agent-name] "[request]"    # Execute specific agent for task
```

## Development Scenarios with Specialized Agents

### 1. Creating New Team Management Feature
```bash
# Backend API development:
/Task dotnet-expert "Create complete TeamService with subscription validation and CRUD operations (context: @ARCHITECTURE.md)"

# Frontend component development:
/Task angular-best-practices "Build team management component with reactive UI (context: @PRODUCT.md UX patterns)"

# Documentation update:
/Task claude-memory-manager "Document new team management architecture"
```

### 2. Building Marketplace Search
```bash
# Backend search API:
/Task dotnet-expert "Implement marketplace search API with filtering, pagination and ratings"

# Frontend search interface:
/Task angular-best-practices "Create search interface with reactive forms and filter components"
```

### 3. Complex Training Execution System
```bash
# Create specialized agent:
/Task agent-generator "Create sportplanner-training-agent for training execution features"

# Use specialized agent:
/Task sportplanner-training-agent "Implement complete training execution system with chronometer"

# Update documentation:
/Task claude-memory-manager "Update documentation with new training execution features"
```

## Project-Specific Notes

### Angular 20+ Patterns (Always Use)
- **Standalone Components**: No NgModules
- **Modern Control Flow**: `@if`, `@for`, `@switch`
- **Signals**: `signal()`, `computed()`, `effect()`
- **Injection**: `inject()` instead of constructor injection

### Frontend UX Guidelines (Critical)
- **Button Cursor Styling**: 
  - Always ensure buttons have `cursor: pointer` in global styles
  - Global button resets must include `cursor: pointer` for interactive elements
  - Disabled buttons should have `cursor: not-allowed`
  - This prevents buttons from appearing non-clickable even when styled properly

### .NET 8 Patterns (Always Use)
- **Minimal APIs**: For simple endpoints
- **Primary Constructors**: C# 12 syntax
- **Collection Expressions**: Modern array/list syntax
- **Repository Pattern**: For data access abstraction

### Security & Multi-tenancy
- All entities must respect user/organization boundaries
- Use UserContextService for current user context
- Implement Row Level Security policies in Supabase
- Validate subscription limits in all business operations

### Performance Considerations
- Use OnPush change detection in Angular components
- Implement proper EF Core query optimization
- Leverage Supabase RLS for data isolation
- Consider lazy loading for large datasets

---

**🚀 Quick Reference**: Use specialized agents for focused development: `/Task dotnet-expert "[backend task]"`, `/Task angular-best-practices "[frontend task]"`, `/Task general-purpose "[research/analysis]"`. Always provide relevant context from @.claude/docs/ when needed.