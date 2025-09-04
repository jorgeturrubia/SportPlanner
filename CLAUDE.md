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

### **Director Agent Orchestration**
**Primary Pattern**: `User Request → Director Agent → Selects Specialist → Provides Context → Executes Task`

**NEW: director-agent** - Master coordinator that:
- Analyzes incoming requests and determines optimal specialized agent
- Reminds selected agent about available documentation context (@.claude/docs/)
- Orchestrates complex tasks requiring multiple agents
- Ensures consistent patterns across all agent interactions

### **Available Specialized Agents**

**Core Agents** (Orchestrated by Director):
- **claude-memory-manager**: Memory & documentation management
- **agent-generator**: Create domain-specific agents  
- **dotnet-expert**: .NET 8 backend specialist (APIs, EF Core, Security)
- **angular-best-practices**: Angular 20+ frontend specialist (Signals, SSR, Performance)

### **Agent Delegation Flow**
```
1. User: "Create subscription management feature"
2. Director: Analyzes → Identifies need for backend + frontend + memory update
3. Director: Selects dotnet-expert → Reminds about @ARCHITECTURE.md context
4. Director: Selects angular-best-practices → Reminds about @PRODUCT.md patterns
5. Director: Selects claude-memory-manager → Updates system context
```

### **When Director Auto-Selects Agents**:
- **Backend-heavy tasks** → Delegates to `dotnet-expert` with architecture context
- **Frontend components** → Delegates to `angular-best-practices` with UX guidelines
- **New requirements** → Uses `agent-generator` to create specialized agent first
- **Documentation changes** → Ensures `claude-memory-manager` updates this file
- **Complex features** → Coordinates multiple agents in sequence

### **Usage Patterns**
```bash
# Simple delegation
/Task "[any request]"  # Director automatically selects appropriate agent

# Direct agent access (when you know exactly what you need)
/Task dotnet-expert "[backend task]"
/Task angular-best-practices "[frontend task]"

# Complex orchestration
/Task "Build complete marketplace feature with search, filters, and ratings"
# → Director coordinates: dotnet-expert + angular-best-practices + claude-memory-manager
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
   - Director analyzes requirements and selects appropriate agents
   - Agents receive context from @.claude/docs/ automatically
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
/Task "[any request]"           # Director selects and orchestrates agents
```

## Agent-Orchestrated Development Scenarios

### 1. Creating New Team Management Feature
```bash
# Director automatically coordinates:
/Task "Implement complete team CRUD with subscription limits and reactive UI"

# Director flow:
# → dotnet-expert: "Create TeamService with subscription validation (context: @ARCHITECTURE.md)"
# → angular-best-practices: "Build team management component (context: @PRODUCT.md UX patterns)"
# → claude-memory-manager: "Document new team management architecture"
```

### 2. Building Marketplace Search
```bash
# Director orchestrates backend + frontend:
/Task "Build marketplace search with filters, pagination and ratings"

# Director coordinates:
# → dotnet-expert: Backend API with filtering logic
# → angular-best-practices: Search interface with reactive forms
```

### 3. Complex Training Execution System
```bash
# Director first creates specialized agent, then uses it:
/Task "Create complete training execution system with chronometer and real-time updates"

# Director flow:
# → agent-generator: "Create sportplanner-training-agent for execution features"
# → sportplanner-training-agent: "Implement full execution system"
# → claude-memory-manager: "Update documentation with new agent and features"
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

**🚀 Quick Reference**: Simply describe what you need with `/Task "[request]"` - the Director Agent will automatically select the right specialists, provide them with relevant context from @.claude/docs/, and orchestrate the complete solution. For direct access when you know exactly what you need, use `/Task [specific-agent] "[task]"`.