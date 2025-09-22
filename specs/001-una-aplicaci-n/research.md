# Research: SportPlanner Technology Stack

## Angular 20+ Best Practices

### Decision: Angular 20+ with Standalone Components
**Rationale**: Angular 20+ provides latest performance optimizations, standalone components eliminate NgModules, and signals offer superior reactivity for real-time features like chronometer.

**Key Patterns**:
- Standalone components with `bootstrapApplication()`
- Signal-based state management for reactive UI
- `@if/@for/@switch` control flow (no structural directives)
- `inject()` function instead of constructor injection
- OnPush change detection strategy for performance

**Alternatives Considered**: Angular 18/19, but 20+ provides better signals integration and performance optimizations critical for real-time training execution.

## Tailwind CSS 4.1 Implementation

### Decision: Tailwind CSS 4.1 with Dark/Light Mode Support
**Rationale**: Tailwind 4.1 provides improved performance, better dark mode support, and consistent design system essential for professional SaaS appearance.

**Implementation Strategy**:
- CSS-in-JS approach with Angular integration
- Design tokens for dark/light theme switching
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Component-level theming with CSS custom properties

**Alternatives Considered**: Bootstrap, Material UI, but Tailwind provides better customization and performance for SaaS applications.

## .NET 8 Backend Architecture

### Decision: ASP.NET Core 8 with Minimal APIs
**Rationale**: .NET 8 provides native AOT compilation, improved performance, and C# 12 features. Minimal APIs reduce boilerplate for API-focused backend.

**Architecture Patterns**:
- Minimal APIs for endpoints
- Primary constructors (C# 12) for dependency injection
- Collection expressions for cleaner syntax
- Repository pattern with EF Core
- UserContextService for multi-tenant context injection

**Alternatives Considered**: .NET 6/7, but .NET 8 provides significant performance improvements and C# 12 features essential for maintainable code.

## Entity Framework Core 8 with PostgreSQL

### Decision: EF Core 8 with PostgreSQL via Supabase
**Rationale**: EF Core 8 provides complex type support, improved performance, and native JSON columns. PostgreSQL offers advanced features like Row Level Security for multi-tenancy.

**Database Strategy**:
- Code-first migrations with EF Core
- Row Level Security (RLS) policies for multi-tenant isolation
- Proper indexing for performance (<200ms API responses)
- Connection pooling and query optimization
- Audit fields (CreatedAt, UpdatedAt, CreatedBy) on entities

**Alternatives Considered**: SQL Server, MySQL, but PostgreSQL provides superior multi-tenant features via RLS and JSON support.

## Supabase Integration

### Decision: Supabase for Authentication and Database Hosting
**Rationale**: Supabase provides integrated auth with JWT tokens, PostgreSQL hosting with RLS policies, and real-time subscriptions for collaborative features.

**Integration Approach**:
- Supabase Auth for user management and JWT tokens
- Row Level Security policies for data isolation
- Real-time subscriptions for training execution updates
- File storage for exercise media/documents
- Webhook integration for subscription management

**Alternatives Considered**: Auth0 + separate database, but Supabase provides integrated solution with better multi-tenant support.

## Testing Strategy

### Decision: Comprehensive Testing with TDD Approach
**Rationale**: Multi-tenant SaaS requires extensive testing to prevent data leaks and subscription violations. TDD ensures requirements are met before implementation.

**Testing Framework Stack**:
- **Frontend**: Jasmine/Karma for unit tests, Cypress for E2E
- **Backend**: xUnit for unit tests, Moq for mocking
- **Contract Testing**: OpenAPI schema validation
- **Integration Testing**: TestContainers for database testing
- **Performance Testing**: NBomber for load testing

**Coverage Targets**:
- Frontend: >80% unit test coverage
- Backend: >90% unit test coverage
- Contract tests for all API endpoints
- Integration tests for all user stories

## Performance Optimization

### Decision: Multi-layered Performance Strategy
**Rationale**: Real-time features (chronometer) and SaaS performance expectations require comprehensive optimization.

**Frontend Optimization**:
- Angular OnPush change detection
- Signal-based reactivity for minimal re-renders
- Lazy loading for routes and heavy components
- Service workers for static asset caching
- Bundle size target: <500KB gzipped

**Backend Optimization**:
- EF Core query optimization (projections, eager loading)
- Response caching for frequently accessed data
- Database connection pooling
- Background job processing for heavy operations
- API response target: <200ms (p95)

## Security Implementation

### Decision: Multi-layered Security for Multi-tenant SaaS
**Rationale**: Data isolation and subscription enforcement are critical for business trust and compliance.

**Security Stack**:
- JWT token validation on all endpoints
- Row Level Security (RLS) policies in PostgreSQL
- UserContextService for consistent user context injection
- Subscription limit enforcement at service layer
- Input validation and sanitization
- HTTPS enforcement with security headers

**Multi-tenant Isolation**:
- Database-level isolation via RLS policies
- API-level validation of user access to resources
- Organization/team-based data scoping
- Audit logging for sensitive operations

## Development Workflow

### Decision: Modern Development Practices
**Rationale**: Constitution requires TDD, code quality, and consistent patterns.

**Workflow Components**:
- Git-based feature branching
- TDD with Red-Green-Refactor cycles
- ESLint + Prettier for code formatting
- Pre-commit hooks for quality gates
- Automated testing in CI/CD pipeline
- Code review requirements for constitutional compliance

## Deployment Strategy

### Decision: Cloud-native Deployment
**Rationale**: SaaS application requires scalable, reliable hosting with global availability.

**Deployment Architecture**:
- **Frontend**: Static hosting (Vercel/Netlify) with CDN
- **Backend**: Containerized deployment (Docker + Azure/AWS)
- **Database**: Supabase PostgreSQL (managed)
- **Monitoring**: Application performance monitoring (APM)
- **CI/CD**: GitHub Actions with automated testing

---

## Research Conclusions

All technology choices align with constitutional requirements and provide optimal foundation for SportPlanner's multi-tenant SaaS architecture. No significant technical risks identified. Architecture supports real-time features, subscription management, and marketplace functionality with appropriate performance and security characteristics.