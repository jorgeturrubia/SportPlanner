# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🤖 Specialized Agents System

This project uses specialized Claude agents to handle different aspects of development. **Always use the Task tool with the appropriate agent for specialized work:**

### Available Agents

#### 🎯 **task-coordinator** 
- **Purpose**: Analyzes user requests, selects appropriate agents, and coordinates complex workflows
- **Usage**: For complex tasks requiring multiple specialists or when unsure which agent to use
- **Key Role**: Plans execution, delegates to specialists, supervises progress

#### 🔧 **dotnet-expert**
- **Purpose**: .NET 8 backend development with modern C# 12 patterns
- **Usage**: API endpoints, services, Entity Framework, security implementation
- **Specialties**: Minimal APIs, dependency injection, JWT middleware, performance optimization

#### ⚡ **angular-best-practices**  
- **Purpose**: Angular 20+ frontend development with modern patterns
- **Usage**: Components, services, reactive forms, state management
- **Specialties**: Standalone components, signals, @if/@for control flow, OnPush change detection

#### 📚 **tech-documenter**
- **Purpose**: Creates and maintains technical documentation in `steering/` directory
- **Usage**: After implementing features, architecture changes, or when documentation is needed
- **Output**: Creates `steering/tech-product.md`, `steering/style-guides.md`, `steering/decision-log.md`

### Agent Usage Guidelines

1. **For Complex Tasks**: Start with `task-coordinator` to analyze and plan
2. **For Backend Work**: Use `dotnet-expert` for .NET/C# implementation
3. **For Frontend Work**: Use `angular-best-practices` for Angular components/services
4. **For Documentation**: Use `tech-documenter` to create/update `steering/` documentation
5. **When Unsure**: Use `task-coordinator` to determine the right approach

## 📁 Steering Directory

The `steering/` directory contains authoritative technical documentation:

```
steering/
├── tech-product.md     # System architecture, API specs, deployment
├── style-guides.md     # Code standards, conventions, best practices  
├── decision-log.md     # Technical decisions with rationale and dates
├── angular-guides.md   # Angular 20+ specific patterns (optional)
└── dotnet-guides.md    # .NET 8 specific patterns (optional)
```

**Important**: The `tech-documenter` agent maintains this structure. Documentation in `docs/` folder is auxiliary - the `steering/` directory is the authoritative source.

## Project Architecture

SportPlanner is a full-stack sports team management and training planning application with:

**Backend**: ASP.NET Core 8.0 Web API with Entity Framework Core
- Location: `src/back/SportPlanner/SportPlanner/`
- Database: PostgreSQL with Entity Framework migrations
- Authentication: JWT tokens via Supabase integration
- Architecture: Controller-Service pattern with dependency injection

**Frontend**: Angular 20+ standalone components with Tailwind CSS v4
- Location: `src/front/SportPlanner/`
- Styling: Tailwind CSS with custom color palette (light green theme)
- State: Signals and services
- Authentication: Supabase client integration

## Development Commands

### Backend (.NET 8.0)
```bash
# Navigate to backend
cd src/back/SportPlanner/SportPlanner

# Build and run
dotnet build
dotnet run

# Database migrations
dotnet ef migrations add <MigrationName>
dotnet ef database update

# Run tests
dotnet test
```

### Frontend (Angular 20+)
```bash
# Navigate to frontend
cd src/front/SportPlanner

# Install dependencies and run
npm install
ng serve

# Build for production
ng build

# Run tests
ng test

# Generate components (standalone)
ng generate component component-name --standalone
```

## Install Tailwind CSS with Angular 
Setting up Tailwind CSS in an Angular project. 

### 01 Create your project 
Start by creating a new Angular project if you don’t have one set up already. The most common approach is to use Angular CLI. 

```bash
ng new my-project --style css 
cd my-project
```

### 02 Install Tailwind CSS 
Install `@tailwindcss/postcss` and its peer dependencies via npm. 

```bash
npm install tailwindcss @tailwindcss/postcss postcss --force
```

### 03 Configure PostCSS Plugins 
Create a `.postcssrc.json` file in the root of your project and add the `@tailwindcss/postcss` plugin to your PostCSS configuration. 

```json
.postcssrc.json 
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

### 04 Import Tailwind CSS 
Add an `@import` to `./src/styles.css` that imports Tailwind CSS. 

```css
styles.css 
@import "tailwindcss";
```

### 05 Start your build process 
Run your build process with `ng serve`. 

```bash
ng serve
```

### 06 Start using Tailwind in your project 
Start using Tailwind’s utility classes to style your content. 

```html
app.component.html 
<h1 class="text-3xl font-bold underline"> 
  Hello world! 
</h1>
```

## Key Architecture Patterns

### Backend
- **Authentication**: JWT middleware validates Supabase tokens and populates user context
- **Services**: Business logic separated into service classes (ITeamService, ISupabaseService, IUserContextService)
- **Data Access**: Entity Framework Code First with rich domain models
- **Middleware Pipeline**: Security headers → Exception handling → CORS → JWT → Authentication/Authorization
- **Dependency Injection**: All services registered in Program.cs with appropriate lifetimes

### Frontend
- **Standalone Components**: All components are standalone (no NgModule)
- **Modern Angular**: Uses signals, control flow syntax (@if, @for), and new lifecycle hooks
- **Services**: Angular services for state management and API communication
- **Routing**: Lazy-loaded routes with route guards for authentication
- **Styling**: Utility-first CSS with Tailwind, custom color palette

## Database Schema

Core entities follow a hierarchical structure:
- `User` (with Supabase integration) → `Team` → `Planning` → `TrainingSession`
- Many-to-many relationships: UserTeam, PlanningTeam, ExerciseConcept
- Rating systems for Exercises, Itineraries, and Plannings
- Subscription-based access control (Free, Coach, Club)

## Authentication Flow

1. Frontend authenticates with Supabase
2. JWT token sent in Authorization header
3. Backend JWT middleware validates with Supabase
4. UserContextService provides typed access to current user
5. Controllers use dependency injection to access user context

## Testing

### Backend
- **Framework**: xUnit with Moq for mocking
- **Location**: `Tests/` folder within project
- **Coverage**: Services, especially UserContextService authentication flows

### Frontend
- **Framework**: Jasmine/Karma (default Angular testing)
- **Command**: `ng test`

## Configuration Files

- **Backend**: `appsettings.json` and `appsettings.Development.json` for Supabase, database, and CORS settings
- **Frontend**: `angular.json` for build configuration, `tsconfig.json` for TypeScript settings
- **Styling**: `postcss.config.js` for custom Tailwind configuration

## HTTP Testing
API endpoints can be tested using the provided `.http` files:
- `test-auth.http` - Authentication endpoints
- `test-teams.http` - Team management
- `test-middleware.http` - Middleware validation

## Security Features
- JWT token validation with Supabase
- CORS configured for localhost development
- Security headers middleware (CSP, XSS protection, etc.)
- Global exception handling with secure error responses
- Role-based authorization through UserContextService

## Current Implementation Status
- Backend authentication middleware and services: ✅ Complete
- Frontend landing page and basic auth UI: ✅ Complete  
- Database schema and migrations: ✅ Complete
- Next: Full frontend-backend integration and dashboard features

## Working with Agents

### Example Workflows:

**Complex Feature Implementation:**
```bash
# 1. Start with coordination
@task-coordinator "I need to implement user team management with CRUD operations"

# 2. Task coordinator will plan and delegate to:
# - @dotnet-expert for backend API endpoints
# - @angular-best-practices for frontend components  
# - @tech-documenter for documentation updates
```

**Backend Development:**
```bash
@dotnet-expert "Create a new API endpoint for managing team memberships"
```

**Frontend Development:**
```bash
@angular-best-practices "Create a team management component with reactive forms"
```

**Documentation Updates:**
```bash
@tech-documenter "Update technical documentation for the new team management feature"
```

### Agent Coordination
- The `task-coordinator` agent can invoke other agents automatically
- For simple, single-purpose tasks, call the specialist directly
- For complex tasks, always start with `task-coordinator` for proper planning
- The `tech-documenter` creates documentation in `steering/` - not in `docs/`