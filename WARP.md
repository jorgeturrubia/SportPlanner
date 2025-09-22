# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## High-Level Architecture

This is a full-stack project with an Angular frontend and an ASP.NET Core backend.

- **Frontend**: Angular 20+ located in `src/front/SportPlanner`. It uses Standalone Components, Signals, and Tailwind CSS.
- **Backend**: ASP.NET Core 8 located in `src/back/SportPlanner`. It uses Minimal APIs, C# 12, and Entity Framework Core.
- **Database**: PostgreSQL via Supabase with multi-tenancy using Row Level Security (RLS).
- **Authentication**: Supabase Auth with JWT tokens.

## Common Commands

### Development
- `npm start`: Starts the Angular development server.
- `dotnet run --project src/back/SportPlanner`: Starts the .NET backend API server.
- `npm test`: Runs the Angular unit tests.
- `dotnet test src/back/SportPlanner`: Runs the .NET backend tests.
- `npm run build`: Creates a production build of the Angular application.
- `dotnet build src/back/SportPlanner`: Compiles the backend application.
- `npm run lint`: Lints the Angular code.

### Database Migrations
- `dotnet ef migrations add [MigrationName] --project src/back/SportPlanner`: Creates a new Entity Framework migration.
- `dotnet ef database update --project src/back/SportPlanner`: Applies pending migrations to the database.

## Development Workflow

### Backend
To run the backend, navigate to `src/back/SportPlanner` and run `dotnet run`. The API will be available at `https://localhost:7201`.

### Frontend
To run the frontend, navigate to `src/front/SportPlanner` and run `npm install && npm start`. The application will be available at `http://localhost:4200`.

## Project-Specific Notes

### Angular Best Practices
- **Standalone Components**: Always use standalone components.
- **Control Flow**: Use the new built-in control flow (`@if`, `@for`, `@switch`).
- **State Management**: Use Signals for reactive state.
- **Dependency Injection**: Prefer the `inject()` function over constructor injection.
- **Notifications**: Use the `NotificationService` for user feedback on actions.

### .NET Best Practices
- **APIs**: Use Minimal APIs for simple endpoints.
- **C# 12**: Utilize modern C# features like primary constructors and collection expressions.
- **Data Access**: Use the Repository Pattern for data abstraction.

### Security
- **Multi-tenancy**: Ensure all data access respects user and organization boundaries.
- **User Context**: Use the `UserContextService` to get the current user's context.
- **Subscription Limits**: Enforce subscription limits in all relevant business logic.