# Technical Stack

## Frontend Framework
- **Application Framework:** Angular 20+ with TypeScript
- **JavaScript Framework:** Angular with RxJS for reactive programming
- **Import Strategy:** Node modules with Angular CLI build system
- **CSS Framework:** Tailwind CSS 4 with modern utilities and design system
- **UI Component Library:** Custom components built with Tailwind CSS 4
- **Icon Library:** Hero Icons (outline and solid variants)
- **State Management:** Angular Signals (Angular 17+) with RxJS for complex async operations

## Backend Framework
- **API Framework:** .NET 8 with ASP.NET Core Web API
- **Authentication:** Supabase Auth integration with JWT tokens
- **Database ORM:** Entity Framework Core with PostgreSQL
- **API Documentation:** Swagger/OpenAPI with .NET 8 native support

## Database & Storage
- **Primary Database:** Supabase PostgreSQL with Row Level Security (RLS)
- **Authentication Provider:** Supabase Auth
- **File Storage:** Supabase Storage for exercise media and documents
- **Real-time Features:** Supabase Real-time subscriptions for live updates

## Hosting & Deployment
- **Frontend Hosting:** Vercel with Angular SSR support
- **Backend Hosting:** Azure App Service or Railway
- **Database Hosting:** Supabase managed PostgreSQL
- **CDN:** Vercel Edge Network for static assets
- **CI/CD:** GitHub Actions with automated testing and deployment

## Development Tools
- **Development Environment:** Angular CLI 20+ with standalone components
- **Package Manager:** npm with package-lock.json
- **Code Quality:** ESLint + Prettier with Angular-specific rules
- **Testing Framework:** 
  - Frontend: Jasmine + Karma (unit), Cypress (e2e)
  - Backend: xUnit with .NET 8, ASP.NET Core Test Host
- **Version Control:** Git with conventional commits

## Architecture Standards

### Angular 20 Architecture

- **Standalone Components**: Mandatory use of standalone components (no NgModules)
- **Control Flow Syntax**: Use `@if`, `@for`, `@switch` instead of structural directives
- **Signals**: Primary state management with Angular Signals
- **Typed Reactive Forms**: Strict typing with Angular reactive forms
- **Dependency Injection**: Modern DI with `inject()` function in functional guards and interceptors

### Component Structure
```
feature/
├── components/
│   ├── feature-list/
│   │   ├── feature-list.component.ts
│   │   ├── feature-list.component.html
│   │   └── feature-list.component.css
│   └── feature-detail/
├── services/
├── models/
└── feature.routes.ts
```

### Tailwind CSS 4 Standards

- **Design System**: Custom design tokens in `styles.css`
- **Component Classes**: Utility-first with `@apply` for complex components
- **Responsive Design**: Mobile-first approach with modern container queries
- **Dark Mode**: CSS variables-based theme switching
- **Performance**: JIT compilation with purging of unused styles

### .NET 8 Backend Standards

- **Minimal APIs**: Use for simple CRUD operations
- **Controller-based APIs**: For complex business logic
- **Dependency Injection**: Built-in DI container with scoped services
- **Configuration**: appsettings.json with environment-specific overrides
- **Error Handling**: Global exception middleware with structured logging
- **Validation**: FluentValidation for complex business rules

### Code Organization

#### Frontend Structure
```
src/
├── app/
│   ├── features/           # Feature modules (auth, teams, planning)
│   │   ├── auth/
│   │   ├── teams/
│   │   ├── planning/
│   │   └── marketplace/
│   ├── shared/            # Shared components and services
│   │   ├── components/
│   │   ├── services/
│   │   └── models/
│   ├── pages/            # Page-level components
│   └── core/             # Core services (auth, http, etc.)
```

#### Backend Structure
```
SportPlanner.Api/
├── Controllers/          # API controllers
├── Services/            # Business logic services
├── Models/              # Data models and DTOs
├── Configuration/       # App configuration
├── Middleware/          # Custom middleware
└── Validators/          # Input validation
```

### Performance Considerations

- **Frontend**: OnPush change detection, lazy loading routes, image optimization
- **Backend**: Response caching, database query optimization, async/await patterns
- **Database**: Proper indexing, query optimization, connection pooling
- **Real-time**: Selective Supabase subscriptions to minimize data transfer

### Security Standards

- **Authentication**: Supabase Auth with JWT tokens
- **Authorization**: Role-based access control (RBAC) with row-level security
- **Input Validation**: Both client and server-side validation
- **CORS**: Properly configured for production environments
- **Rate Limiting**: API rate limiting with ASP.NET Core middleware
- **Data Protection**: GDPR compliance with data anonymization options

### Multi-Sport Architecture

- **Sport Configuration**: Configurable sport-specific concepts and categories
- **Extensible Models**: Generic models that adapt to different sports
- **Modular Exercises**: Sport-agnostic exercise framework with sport-specific implementations
- **Localization**: i18n support for multi-language sports terminology