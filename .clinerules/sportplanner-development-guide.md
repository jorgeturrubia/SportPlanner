## Brief overview
  This guide provides comprehensive development standards and best practices for the SportPlanner project - a modern sports management application built with Angular 20 frontend and .NET 8 backend. The guidelines cover architecture, coding standards, UI/UX preferences, and deployment practices specific to this project's technology stack and design patterns.

## Architecture guidelines
  - Use Angular 20 standalone components exclusively - no NgModule required
  - Implement reactive state management with Angular Signals for all stateful operations
  - Structure the application with lazy-loaded modules and routes for optimal performance
  - Follow the established folder structure: src/app/{components,pages,services,models,guards,interceptors}
  - Implement dependency injection with providedIn: 'root' for singleton services
  - Use the Supabase integration for all authentication and database operations
  - Maintain separation of concerns between UI components, services, and data models

## Development workflow
  - Follow the established naming conventions: PascalCase for components/services, camelCase for variables/properties
  - Create feature-based folder structure under pages/ for complex functionality
  - Implement all services as injectable singletons with proper error handling
  - Use functional guards for route protection instead of class-based guards
  - Implement HTTP interceptors for cross-cutting concerns like authentication
  - Follow the request-response pattern with proper DTOs for API communication
  - Use Angular Signals for all reactive state management instead of BehaviorSubjects

## Coding standards
  - Use strict TypeScript with strong typing for all variables, parameters, and return types
  - Implement interfaces and enums for all data models and constants
  - Follow SOLID principles throughout the codebase
  - Use ChangeDetectionStrategy.OnPush for all components to optimize performance
  - Implement proper error handling with try-catch blocks and RxJS catchError operators
  - Use async/await for asynchronous operations instead of .then() chains
  - Follow the established file naming: component-name.component.ts, service-name.service.ts
  - Implement proper null checking and optional chaining where appropriate

## UI/UX preferences
  - Use Tailwind CSS for all styling with the established OKLCH color system
  - Implement the dark/light theme system using CSS custom properties
  - Follow the responsive design patterns with Tailwind's breakpoint system
  - Use the established component library patterns for consistent UI
  - Implement proper loading states and error messages for all async operations
  - Use NG Icons for all iconography with the established naming convention
  - Follow the accessibility guidelines with proper ARIA labels and keyboard navigation
  - Implement smooth transitions and animations using Tailwind's utility classes

## Technology stack
  - Frontend: Angular 20 with standalone components, TypeScript, RxJS
  - Backend: .NET 8 Web API with Entity Framework Core
  - Authentication: Supabase Auth with JWT tokens
  - Database: Supabase PostgreSQL with Entity Framework integration
  - Styling: Tailwind CSS with OKLCH color space
  - Icons: NG Icons with Heroicons integration
  - State Management: Angular Signals (no NgRx or other state libraries)
  - HTTP: Angular HttpClient with custom interceptors
  - Build: Angular CLI with SSR support

## Security best practices
  - Implement route guards for all protected routes (authGuard, guestGuard, roleGuard)
  - Use HTTP interceptors for automatic token injection and refresh
  - Validate all user inputs both on client and server sides
  - Implement proper CORS policies for API endpoints
  - Use HTTPS for all API communications in production
  - Implement proper session management with token refresh mechanisms
  - Sanitize all user-generated content to prevent XSS attacks
  - Use proper error handling that doesn't expose sensitive information

## Performance optimization
  - Implement lazy loading for all routes and heavy components
  - Use Angular Signals with computed values for efficient state management
  - Optimize images with proper formats (WebP) and lazy loading
  - Implement virtual scrolling for large lists and data grids
  - Use ChangeDetectionStrategy.OnPush for all components
  - Implement proper caching strategies for API responses
  - Optimize bundle size with tree-shaking and code splitting
  - Use proper memoization techniques for expensive computations

## Testing strategy
  - Write unit tests for all services and complex logic using Jasmine
  - Implement component tests with proper mocking of dependencies
  - Use Angular Testing utilities for component testing
  - Write integration tests for API endpoints and database operations
  - Implement E2E tests for critical user flows
  - Mock all external dependencies (Supabase, APIs) in tests
  - Aim for minimum 80% code coverage for critical business logic
  - Test both success and error scenarios for all async operations

## Deployment guidelines
  - Use Angular CLI build with production configuration for deployments
  - Implement Server Side Rendering (SSR) for better SEO and performance
  - Configure proper environment variables for different deployment stages
  - Use proper asset optimization and compression
  - Implement proper logging and monitoring in production
  - Use CDN for static assets and images
  - Configure proper caching strategies for API responses
  - Implement proper health checks and monitoring endpoints

## Other guidelines
  - Follow the established Git workflow with proper branching strategy
  - Write clear, concise commit messages following conventional commits
  - Implement proper documentation for all complex features and APIs
  - Use the established error handling patterns with notification service
  - Follow the established patterns for form validation and error display
  - Implement proper internationalization (i18n) support for multi-language
  - Use proper analytics and monitoring for user behavior tracking
  - Follow the established patterns for responsive design and mobile optimization
