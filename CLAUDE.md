# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SportPlanner is a full-stack sports management application with:
- **Frontend**: Angular 20+ with TypeScript, Tailwind CSS, and SSR
- **Backend**: ASP.NET Core 8 Web API with Entity Framework Core
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth with JWT

## Development Commands

### Frontend (Angular)
```bash
cd src/front/SportPlanner
npm install          # Install dependencies
npm start            # Dev server (http://localhost:4200)
npm run build        # Production build
npm test             # Run unit tests
npm run lint         # ESLint linting
```

### Backend (.NET)
```bash
cd src/back/SportPlanner
dotnet restore       # Restore packages
dotnet run           # Start API (https://localhost:7201)
dotnet build         # Build project
dotnet test          # Run tests (if any exist)
```

### Database Migrations
```bash
cd src/back/SportPlanner/SportPlanner
dotnet ef migrations add [MigrationName]
dotnet ef database update
```

## Architecture Overview

### Frontend Structure
```
src/front/SportPlanner/src/app/
├── components/          # Shared components (navbar, footer)
├── pages/              # Route components
│   ├── landing/        # Public landing page
│   ├── auth/           # Authentication page
│   └── dashboard/      # Protected dashboard area
│       ├── pages/      # Dashboard sub-pages (home, teams)
│       └── components/ # Dashboard-specific components
├── services/           # Angular services (auth, team, etc.)
├── guards/             # Route guards (authGuard, guestGuard)
├── interceptors/       # HTTP interceptors (auth.interceptor)
├── models/             # TypeScript interfaces/types
└── app.routes.ts       # Routing configuration
```

### Backend Structure
```
src/back/SportPlanner/SportPlanner/
├── Controllers/        # API controllers (Auth, Teams, Plannings)
├── Services/           # Business logic services
├── Models/
│   ├── DTOs/          # Data Transfer Objects
│   └── [Entity].cs    # Domain entities
├── Data/              # DbContext and configurations
├── Middleware/        # Custom middleware (JWT, Security, Exception)
└── Program.cs         # Application startup
```

### Key Components

**Frontend:**
- `AuthComponent`: Login/register form using Supabase Auth
- `DashboardComponent`: Protected layout with sidebar navigation
- `TeamsComponent`: Team management with CRUD operations
- `AuthGuard`/`GuestGuard`: Route protection
- `AuthInterceptor`: Adds JWT tokens to API requests

**Backend:**
- `AuthController`: Authentication endpoints
- `TeamsController`: Team CRUD operations
- `SupabaseService`: Supabase client integration
- `UserContextService`: Current user context management
- `JwtMiddleware`: JWT token validation
- `SportPlannerDbContext`: Entity Framework context

## Authentication Flow

1. Frontend uses Supabase Auth for login/register
2. Supabase returns JWT token stored in localStorage
3. AuthInterceptor adds token to API requests
4. Backend validates JWT via JwtMiddleware
5. UserContextService provides current user context

## Database Schema

Key entities:
- `User`: User information from Supabase
- `Team`: Sports teams
- `Planning`: Training/game schedules
- `Exercise`: Exercise definitions
- `Concept`: General concepts/categories

Relationships are managed through Entity Framework Core with PostgreSQL via Supabase.

## Configuration

### Frontend Environment
- Supabase URL/Key configured in `app.config.ts`
- Tailwind CSS for styling
- Angular 20+ standalone components
- SSR enabled via Angular Universal

### Backend Settings
- Connection string to Supabase PostgreSQL
- Supabase URL/Key in `appsettings.json`
- CORS configured for Angular dev server (localhost:4200)
- JWT validation setup for Supabase tokens

## Development Notes

- Frontend uses modern Angular patterns (standalone components, signals)
- Backend follows minimal API patterns where applicable
- Authentication is fully integrated with Supabase
- Database migrations handle schema changes
- Both projects have linting configured (ESLint for Angular)

## Testing

- Frontend: Jasmine/Karma for unit tests
- Backend: xUnit framework (test packages installed)
- Run `npm test` for frontend tests
- Run `dotnet test` for backend tests

## Common Issues

- CORS errors: Ensure backend CORS policy includes frontend URL
- Auth failures: Check Supabase configuration in both frontend and backend
- Database errors: Verify connection string and run migrations
- Build errors: Check TypeScript/C# versions and package compatibility