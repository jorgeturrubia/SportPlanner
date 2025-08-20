# Tech Stack - PlanSport

## Context

Tech stack específico para PlanSport - Plataforma Multi-Deporte de Planificación.

## Frontend
- App Framework: Angular 20+
- Language: TypeScript 5.0+
- Import Strategy: Node.js modules with Angular CLI
- Package Manager: npm
- Node Version: 22 LTS
- CSS Framework: Tailwind CSS 4.0+
- UI Components: Custom components with Tailwind CSS 4
- Icons: Hero Icons (outline and solid variants)
- State Management: Angular Signals + RxJS
- Build Tool: Angular CLI with esbuild

## Backend
- API Framework: .NET 8 Web API
- Language: C# 12
- ORM: Entity Framework Core
- Database: Supabase PostgreSQL
- Authentication: Supabase Auth with JWT tokens
- Validation: FluentValidation

## Database & Storage
- Primary Database: Supabase PostgreSQL
- Authentication Provider: Supabase Auth
- File Storage: Supabase Storage
- Real-time Features: Supabase Real-time subscriptions

## Hosting & Deployment
- Frontend Hosting: Vercel with Angular SSR
- Backend Hosting: Azure App Service or Railway
- Database Hosting: Supabase managed PostgreSQL
- CDN: Vercel Edge Network
- CI/CD Platform: GitHub Actions
- Production Environment: main branch
- Staging Environment: develop branch

## Development Tools
- Development Environment: Angular CLI 20+
- Code Quality: ESLint + Prettier
- Testing Framework: Jasmine + Karma (unit), Cypress (e2e)
- Backend Testing: xUnit with .NET 8
- Version Control: Git with conventional commits
