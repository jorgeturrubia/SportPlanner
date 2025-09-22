<!--
Sync Impact Report:
Version change: v0.0.0 → v1.0.0
Added sections: Code Quality Standards, Testing Standards, User Experience Standards, Performance Standards, Multi-tenant Security
Principles added: 5 core principles covering all required areas
Templates requiring updates: ✅ All templates reviewed and aligned
Follow-up TODOs: None - constitution is complete and comprehensive
-->

# SportPlanner Constitution

## Core Principles

### I. Code Quality & Standards (NON-NEGOTIABLE)
**Modern Tech Stack Adherence**: All code MUST follow Angular 20+ and .NET 8 best practices. Frontend MUST use standalone components, signals, and @if/@for control flow (never NgModules or *ngIf/*ngFor). Backend MUST use minimal APIs, C# 12 features (primary constructors, collection expressions), and dependency injection patterns. Code reviews MUST verify adherence to framework-specific patterns.

**Rationale**: Ensures maintainability, leverages latest framework optimizations, and prevents technical debt accumulation in a rapidly evolving multi-tenant platform.

### II. Test-First Development (NON-NEGOTIABLE)
**TDD Mandatory Workflow**: Tests MUST be written before implementation in strict Red-Green-Refactor cycles. Contract tests MUST exist for all API endpoints. Integration tests MUST cover all user stories. Frontend components MUST have unit tests with >80% coverage. Backend services MUST have unit tests with >90% coverage. No pull request merges without passing tests.

**Rationale**: Prevents regressions in a complex multi-tenant system where failures affect multiple organizations and subscription tiers.

### III. User Experience Consistency
**Design System Compliance**: All UI components MUST follow Tailwind CSS design system with consistent spacing, typography, and color schemes. Interactive elements MUST have `cursor: pointer` styling. Loading states MUST be implemented for all async operations >500ms. Error messages MUST be user-friendly with actionable guidance. Responsive design MUST support mobile-first approach (sm: 640px+, md: 768px+, lg: 1024px+).

**Rationale**: Creates professional, cohesive experience critical for SaaS platform user retention and subscription conversion.

### IV. Performance Standards (NON-NEGOTIABLE)
**Response Time Requirements**: API endpoints MUST respond within 200ms (p95). Frontend page loads MUST complete within 2 seconds. Database queries MUST use proper indexing and pagination. Angular components MUST use OnPush change detection and signals for optimal rendering. EF Core queries MUST avoid N+1 problems through proper eager loading and projections.

**Rationale**: Performance directly impacts user experience and subscription retention in a real-time sports planning platform with chronometer features.

### V. Multi-tenant Security
**Data Isolation Enforcement**: All database queries MUST respect Row Level Security (RLS) policies. API endpoints MUST validate user access to organization/team resources. JWT tokens MUST be validated on every request. User context MUST be injected via UserContextService. Subscription limitations MUST be enforced at service layer (team limits, training limits, marketplace access).

**Rationale**: Security breaches in multi-tenant SaaS can expose multiple organizations' data and destroy business trust.

## Code Quality Standards

**TypeScript Strictness**: `strict: true`, `noImplicitAny: true`, `noImplicitReturns: true` in all TypeScript configurations. All variables MUST be properly typed. No `any` types except in migration scenarios with explicit TODO comments for type definition.

**C# Standards**: Nullable reference types enabled. All public APIs MUST have XML documentation. Async methods MUST follow async/await patterns consistently. LINQ expressions preferred over traditional loops for readability and performance.

**Linting Enforcement**: ESLint for Angular with angular-eslint rules. All code MUST pass linting before commit. Prettier formatting enforced with consistent configuration. No lint rule overrides without architectural justification.

## Testing Standards

**Test Categories Required**:
- **Contract Tests**: OpenAPI/Swagger schema validation for all endpoints
- **Unit Tests**: Individual component/service testing with mocking
- **Integration Tests**: End-to-end user story validation
- **Performance Tests**: Load testing for critical paths (user registration, training execution)

**Testing Framework Standards**: Jasmine/Karma for Angular frontend. xUnit for .NET backend. Moq for mocking. Test data builders for complex entity creation. No hardcoded test data - use factories and builders.

**Test Environment**: Isolated test database with fresh migrations. Supabase test project for auth testing. Parallel test execution where possible to maintain fast feedback loops.

## User Experience Standards

**Accessibility Requirements**: WCAG 2.1 AA compliance. Semantic HTML elements. Proper ARIA labels. Keyboard navigation support. Screen reader compatibility. Color contrast ratios >4.5:1.

**Loading & Error States**: Skeleton loaders for data fetching. Optimistic UI updates where safe. Graceful degradation for offline scenarios. Toast notifications for success/error feedback. Form validation with real-time feedback.

**Navigation & Information Architecture**: Breadcrumb navigation for deep page hierarchies. Clear visual hierarchy with proper heading structure. Search functionality with autocomplete. Logical menu grouping by user role (Admin, Director, Coach, Assistant).

## Performance Standards

**Frontend Performance**: Bundle size <500KB gzipped. First Contentful Paint <1.5s. Largest Contentful Paint <2.5s. Cumulative Layout Shift <0.1. Lazy loading for routes and heavy components. Service workers for static asset caching.

**Backend Performance**: Database connection pooling. Response caching for frequently accessed data. Background job processing for heavy operations. Memory usage monitoring and optimization. SQL query performance monitoring with execution plan analysis.

**Monitoring Requirements**: Application performance monitoring (APM) integration. Error tracking and alerting. Performance budget enforcement in CI/CD pipeline. Regular performance regression testing.

## Multi-tenant Security

**Authentication & Authorization**: Supabase Auth integration with proper JWT validation. Role-based access control (RBAC) with granular permissions. Session management with secure token refresh. Multi-factor authentication for admin roles.

**Data Protection**: Encryption at rest and in transit. PII data handling compliance. Audit logging for sensitive operations. Data retention policies per subscription tier. Secure file upload validation and storage.

**Subscription Enforcement**: Service layer validation of subscription limits. Feature flagging based on subscription tier. Usage tracking and billing integration. Graceful handling of subscription downgrades.

## Governance

**Constitution Authority**: This constitution supersedes all other development practices and guidelines. All code reviews MUST verify constitutional compliance. Architecture decisions MUST align with core principles.

**Amendment Process**: Constitution changes require documentation of impact analysis, stakeholder approval, and migration plan for existing code. Version increments follow semantic versioning: MAJOR for principle changes, MINOR for new sections, PATCH for clarifications.

**Compliance Review**: Weekly constitution compliance audits during development cycles. Automated checks in CI/CD pipeline for testable principles. Technical debt items MUST include constitutional compliance timeline.

**Development Guidance**: Use `CLAUDE.md` for runtime development guidance and agent coordination. Refer to `.claude/docs/` for architectural patterns and domain-specific guidance.

**Version**: 1.0.0 | **Ratified**: 2025-09-22 | **Last Amended**: 2025-09-22