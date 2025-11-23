<!--
Guidance for AI coding assistants working in this repo.
CRITICAL: This file provides the entry point. Always read the referenced AGENTS files for detailed guidelines.
-->
# SportPlanner - AI Assistant Quick Guide

## 🚨 CRITICAL: Read This First

This project follows a **structured agent-based workflow** with comprehensive documentation. You MUST follow this hierarchy:

### 📖 Priority 1: Agent Guidelines (MANDATORY)

**Backend Development:**
1. **`back/AGENTS.MD`** - Complete backend development guide
   - Clean Architecture patterns
   - DTO/AutoMapper policy (NEVER expose EF entities)
   - EF Core migrations workflow
   - FluentValidation
   - Task sizing and workflow
   - **References `back/dotnet10-best-practices.md`** (MUST READ for patterns/antipatterns)

**Frontend Development:**
2. **`front/AGENTS.md`** - Complete frontend development guide
   - **MCP Server de Angular** (MUST use for best practices)
   - Angular 20 with control flow blocks (@if, @for, @switch)
   - **Tailwind CSS v4 ONLY** (no custom CSS without justification)
   - **Dark mode MANDATORY** in all components
   - **Componentization exhaustive** (Atomic Design)
   - **File separation MANDATORY** (.ts, .html, .scss always separated)
   - **References `back/typescript-best-practices.md`**

### 📋 Priority 2: Project Documentation

**Business Context:**
- `DocSportPlanner/README.md` - Project overview and navigation
- `DocSportPlanner/docs/01-vision-negocio.md` - Business vision and goals
- `DocSportPlanner/docs/negocio/` - Business rules, use cases, domain terminology
- `DocSportPlanner/EstadoProyecto.md` - Current project state
- `DocSportPlanner/backlog/backlog.yaml` - Feature backlog

**Technical Documentation:**
- `DocSportPlanner/docs/tecnico/StackTecnologico.md` - Stack and architectural decisions
- `DocSportPlanner/docs/tecnico/ModeloDatos.md` - Data model and rationale
- `DocSportPlanner/docs/tecnico/TailwindCSS.md` - **Tailwind CSS v4 complete guide**
- `DocSportPlanner/docs/arquitectura/` - Architecture diagrams
- `DocSportPlanner/docs/ADR/` - Architecture Decision Records

### 📌 Priority 3: Code Entry Points

**Backend:**
- `back/SportPlanner/Program.cs` - Entry point, DI, AutoMapper, EF Core registration
- `back/SportPlanner/README.md` - Local dev + migrations workflow
- `back/SportPlanner/Data/AppDbContext.cs` - EF Core DbContext

**Frontend:**
- `front/src/main.ts` - Angular entry point
- `front/angular.json` - Angular configuration
- `front/tailwind.config.js` - Tailwind CSS configuration

---

## 🏗️ Architecture Overview

### Backend: .NET 10 Clean Architecture (Monolithic)

**Layers (Dependency Rule: Dependencies point inward to Domain):**
```
WebAPI (Controllers)
    ↓
Application (DTOs, Mappings, Validators, Services)
    ↓
Domain (Models - Pure business logic)
    ↓
Infrastructure (Data, EF Core, External Services)
```

**Key Rules:**
- ✅ Controllers are thin: route/validate and call Application services
- ✅ NEVER expose EF Entities as API contracts - use DTOs only
- ✅ AutoMapper profiles in `Application/Mappings`
- ✅ DTOs in `Application/DTOs`
- ✅ Domain entities in `Models`
- ✅ FluentValidation in `Application/Validators`
- ✅ EF Core DbContext: `back/SportPlanner/Data/AppDbContext.cs`

### Frontend: Angular 20 + Tailwind CSS v4

**Architecture:**
```
src/
├── shared/
│   ├── components/    # Atomic Design (atoms, molecules, organisms)
│   ├── services/      # Shared services
│   └── models/        # Shared interfaces
├── features/          # Feature modules (domain-driven)
│   ├── users/
│   ├── teams/
│   └── training/
└── core/              # Singleton services, guards, interceptors
```

**Key Rules:**
- ✅ **MCP Server de Angular FIRST** - Always consult before coding
- ✅ **Tailwind CSS v4 ONLY** - No custom CSS without justification
- ✅ **Dark mode MANDATORY** - All components support light/dark
- ✅ **File separation MANDATORY** - .ts, .html, .scss always separated
- ✅ **Componentization exhaustive** - Reuse before creating new
- ✅ Control flow blocks: @if, @for, @switch (NO *ngIf, *ngFor, *ngSwitch)
- ✅ Standalone components by default
- ✅ Signals for local state, RxJS for global/complex state

---

## 🔄 Workflow for Agents

### 1. Before Starting ANY Task

**Backend:**
1. Read `back/AGENTS.MD` completely
2. Read `back/dotnet10-best-practices.md` for patterns/antipatterns
3. Review `DocSportPlanner/docs/` for business context
4. Check `DocSportPlanner/docs/tecnico/ModeloDatos.md` for data model

**Frontend:**
1. **Use MCP Server:** `mcp_angular-cli_get_best_practices`
2. Read `front/AGENTS.md` completely
3. Read `DocSportPlanner/docs/tecnico/TailwindCSS.md` for styling
4. Review `back/typescript-best-practices.md` for TypeScript patterns
5. Review `DocSportPlanner/docs/` for business context

### 2. Task Sizing (from `back/AGENTS.MD`)

**Small tasks (1-2 files):** Implement directly
- Add property to DTO
- Create simple endpoint
- Add validation rule

**Medium tasks (3-10 files):** Create 2-3 phase plan
- Phase 1: Domain/Models + Migration
- Phase 2: DTOs + Mappings + Validators
- Phase 3: Controllers + Tests

**Large tasks (>10 files):** Use template with YAML frontmatter
- Use `.github/ISSUE_TEMPLATE/agent_task.md`
- Or `PULL_REQUEST_TEMPLATE.md`
- Generate with `tools/generate-agent-instruction.ps1`

### 3. Implementation Checklist

**Backend:**
- [ ] Consulted `back/dotnet10-best-practices.md`
- [ ] DTOs created (NO EF entities exposed)
- [ ] AutoMapper Profile created and registered
- [ ] FluentValidation Validator created
- [ ] Migration created and applied (if DB changes)
- [ ] Controller is thin (only routing)
- [ ] Async/await used correctly (NO .Result or .Wait())
- [ ] Logging with structured placeholders
- [ ] Tests created (if applicable)

**Frontend:**
- [ ] **MCP Server consulted** (`mcp_angular-cli_get_best_practices`)
- [ ] Tailwind CSS v4 used exclusively
- [ ] Dark mode implemented with `dark:` classes
- [ ] Files separated: .ts, .html, .scss
- [ ] Component reused from `shared/components/` or created if needed
- [ ] Control flow blocks used (@if, @for, @switch)
- [ ] Standalone component
- [ ] OnPush change detection
- [ ] Tested in light AND dark mode

---

## 📚 Common Workflows

### Backend: Add New Entity

```bash
# 1. Create entity in Models/
# 2. Update AppDbContext.cs
cd back/SportPlanner
dotnet tool run dotnet-ef migrations add AddNewEntity
dotnet tool run dotnet-ef database update

# 3. Create DTOs in Application/DTOs/
# 4. Create AutoMapper Profile in Application/Mappings/
# 5. Create Validator in Application/Validators/
# 6. Create Controller in Controllers/
# 7. Test
dotnet build
dotnet run
```

### Frontend: Add New Component

```bash
# 1. Consult MCP Server first
# 2. Check if component exists in shared/components/
# 3. If creating new:
cd front
ng generate component features/domain/component-name --standalone

# 4. Implement with:
#    - Tailwind CSS v4 classes
#    - Dark mode support
#    - Separated files (.ts, .html, .scss)
#    - Control flow blocks
# 5. Test in light and dark mode
```

---

## 🎨 Frontend Styling Standards

### Tailwind CSS v4 - MANDATORY

**DO:**
- ✅ Use Tailwind utility classes for ALL styles
- ✅ Implement dark mode with `dark:` prefix
- ✅ Test in both light and dark modes
- ✅ Use responsive breakpoints (`sm:`, `md:`, `lg:`, etc.)
- ✅ Reuse components from `shared/components/`
- ✅ Keep .scss files empty or minimal (only @apply if needed)

**DON'T:**
- ❌ Write custom CSS without strong justification
- ❌ Use inline styles or templates in .ts files
- ❌ Hardcode colors without dark mode variants
- ❌ Duplicate component code
- ❌ Skip dark mode implementation

**Example:**
```html
<!-- ✅ CORRECT -->
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 rounded-lg">
  Content
</div>

<!-- ❌ WRONG -->
<div style="background: white; color: black; padding: 16px;">
  Content
</div>
```

See: `DocSportPlanner/docs/tecnico/TailwindCSS.md` for complete guide.

---

## 🔧 Important Commands

### Backend (.NET 10)

```powershell
# Navigate to project
cd back/SportPlanner

# Build
dotnet build

# Run with hot reload
dotnet watch run

# Tests
dotnet test

# EF Core Migrations
dotnet new tool-manifest --force  # First time only
dotnet tool install --local dotnet-ef --version 10.*
dotnet tool run dotnet-ef migrations add MigrationName
dotnet tool run dotnet-ef database update
dotnet tool run dotnet-ef migrations remove  # Undo last migration
```

### Frontend (Angular 20)

```powershell
# Navigate to project
cd front

# Install dependencies
npm install

# Development server
ng serve
# or
npm start

# Build
ng build
# or
npm run build

# Tests
ng test

# Linting
ng lint

# Generate component (standalone)
ng generate component path/component-name --standalone

# Update Angular and migrate control flow
ng update @angular/core --name=control-flow-migration
```

---

## 🚨 Critical Antipatterns to AVOID

### Backend

❌ **NEVER expose EF entities directly**
```csharp
// ❌ WRONG
[HttpGet("{id}")]
public async Task<Team> GetTeam(int id) => await _context.Teams.FindAsync(id);

// ✅ CORRECT
[HttpGet("{id}")]
public async Task<TeamDto> GetTeam(int id) {
    var team = await _context.Teams.FindAsync(id);
    return _mapper.Map<TeamDto>(team);
}
```

❌ **NEVER use .Result or .Wait()**
```csharp
// ❌ WRONG - Can cause deadlocks
var user = _repository.GetByIdAsync(1).Result;

// ✅ CORRECT
var user = await _repository.GetByIdAsync(1);
```

❌ **NEVER modify database directly**
```powershell
# ❌ WRONG - Direct SQL changes
# ✅ CORRECT - Always use migrations
dotnet tool run dotnet-ef migrations add DescriptiveName
dotnet tool run dotnet-ef database update
```

### Frontend

❌ **NEVER use deprecated directives**
```html
<!-- ❌ WRONG - Deprecated in Angular 20 -->
<div *ngIf="condition">Content</div>
<div *ngFor="let item of items">{{ item }}</div>

<!-- ✅ CORRECT - Use control flow blocks -->
@if (condition) {
  <div>Content</div>
}
@for (item of items; track item.id) {
  <div>{{ item }}</div>
}
```

❌ **NEVER skip dark mode**
```html
<!-- ❌ WRONG - Only light mode -->
<div class="bg-white text-black">Content</div>

<!-- ✅ CORRECT - Light and dark -->
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">Content</div>
```

❌ **NEVER inline templates or styles**
```typescript
// ❌ WRONG
@Component({
  template: `<div>Inline template</div>`,
  styles: [`div { color: red; }`]
})

// ✅ CORRECT
@Component({
  templateUrl: './component.html',
  styleUrls: ['./component.scss']
})
```

---

## 📋 Task Templates

### Using YAML Frontmatter for Large Tasks

Create issues or PRs with agent frontmatter:

```yaml
---
agent: copilot
task_type: feature | bugfix | refactor | test
priority: high | medium | low
estimated_files: number
---

# Task Title

## Description
Detailed description...

## Fases de Implementación
### Fase 1: Domain Layer
- [ ] Task 1
- [ ] Task 2

### Fase 2: Application Layer
- [ ] Task 3

## Archivos Afectados
- `path/to/file1.cs`
- `path/to/file2.ts`

## Criterios de Aceptación
- [ ] Build exitoso
- [ ] Tests pasando
- [ ] Documentación actualizada
```

Generate template:
```powershell
.\tools\generate-agent-instruction.ps1
```

---

## 🔍 When You Need Help

### For Business Logic Questions
→ Read `DocSportPlanner/docs/negocio/`

### For Data Model Questions
→ Read `DocSportPlanner/docs/tecnico/ModeloDatos.md`

### For Backend Patterns
→ Read `back/dotnet10-best-practices.md`

### For Frontend Patterns
→ Use MCP Server: `mcp_angular-cli_search_documentation`
→ Read `front/AGENTS.md`

### For Styling
→ Read `DocSportPlanner/docs/tecnico/TailwindCSS.md`

### For TypeScript
→ Read `back/typescript-best-practices.md`

---

## 📞 Integration Points

### Database
- PostgreSQL (via Supabase in production)
- Connection string in `appsettings.Development.json` (local)
- Environment variable `ConnectionStrings__DefaultConnection` (production)

### Authentication
- Supabase Auth (planned integration)
- See `DocSportPlanner/docs/` for auth strategy

### Storage
- Supabase Storage (planned for media files)

---

## ✅ Final Checklist Before Commit

**All changes:**
- [ ] Consulted appropriate AGENTS.md file
- [ ] Reviewed relevant best practices documentation
- [ ] Understood business context from `DocSportPlanner/`
- [ ] Build successful (no errors)
- [ ] Tests passing (if applicable)
- [ ] No secrets committed
- [ ] Documentation updated (if needed)

**Backend specific:**
- [ ] DTOs used (no EF entities exposed)
- [ ] AutoMapper configured
- [ ] Validators created
- [ ] Migrations applied
- [ ] Async/await correct

**Frontend specific:**
- [ ] MCP Server consulted
- [ ] Tailwind CSS v4 used exclusively
- [ ] Dark mode implemented and tested
- [ ] Files separated (.ts, .html, .scss)
- [ ] Component reused or properly componentized
- [ ] Control flow blocks used (no deprecated directives)

---
