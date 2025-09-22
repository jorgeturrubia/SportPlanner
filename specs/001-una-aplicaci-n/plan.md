
# Implementation Plan: SportPlanner - Multi-tenant Sports Planning Platform

**Branch**: `001-una-aplicaci-n` | **Date**: 2025-09-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `C:\Proyectos\SportPlanner\specs\001-una-aplicaci-n\spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
SportPlanner is a multi-tenant SaaS platform that enables sports coaches to create, share, and execute training plans with minimal clicks. Core features include automated training generation, marketplace with 5-star ratings, real-time training execution with chronometer, and subscription-based access control (Free/Coach/Club tiers). Technical approach uses Angular 20+ frontend with .NET 8 backend, Supabase for auth and PostgreSQL storage, emphasizing performance (<200ms API responses) and security (multi-tenant isolation).

## Technical Context
**Language/Version**: TypeScript 5.8+ (Frontend), C# 12 with .NET 8 (Backend)
**Primary Dependencies**: Angular 20+, Tailwind CSS 4.1, ASP.NET Core 8, Entity Framework Core 8, Supabase Auth & PostgreSQL
**Storage**: PostgreSQL via Supabase with Row Level Security (RLS) for multi-tenant isolation
**Testing**: Jasmine/Karma (Angular), xUnit (backend), Moq for mocking, contract testing with OpenAPI
**Target Platform**: Web application (Chrome/Firefox/Safari/Edge), mobile-responsive design
**Project Type**: web - frontend+backend full-stack application
**Performance Goals**: <200ms API response (p95), <2s page loads, real-time chronometer accuracy, 60fps smooth UI
**Constraints**: <200ms p95 API latency, mobile-first responsive design, WCAG 2.1 AA accessibility, dark/light mode support
**Scale/Scope**: Multi-tenant SaaS, 10k+ users, marketplace with ratings, subscription management, complex role-based permissions

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Code Quality Standards**:
- [x] Angular 20+ patterns (standalone components, signals, @if/@for)
- [x] .NET 8 patterns (minimal APIs, C# 12, dependency injection)
- [x] TypeScript strict mode enabled
- [x] Linting configuration aligned with project standards

**Testing Requirements**:
- [x] TDD approach planned (contract tests → integration tests → unit tests)
- [x] >80% frontend coverage target, >90% backend coverage target
- [x] Performance testing planned for critical paths
- [x] Test data builders/factories planned (no hardcoded data)

**User Experience Standards**:
- [x] Tailwind CSS design system compliance
- [x] Responsive design (mobile-first approach)
- [x] Loading states for async operations >500ms
- [x] Accessibility requirements (WCAG 2.1 AA)

**Performance Standards**:
- [x] API endpoints <200ms (p95) target
- [x] Frontend page loads <2s target
- [x] Database query optimization planned
- [x] Bundle size <500KB gzipped target

**Multi-tenant Security**:
- [x] Row Level Security (RLS) policies planned
- [x] User context validation planned
- [x] Subscription limit enforcement planned
- [x] JWT validation on all endpoints

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure]
```

**Structure Decision**: Option 2 - Web application (frontend + backend detected in Technical Context)

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/powershell/update-agent-context.ps1 -AgentType claude`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each API contract (auth, teams, plannings, trainings) → contract test task [P]
- Each entity (User, Team, Planning, Training, etc.) → model creation task [P]
- Each user story from spec → integration test task
- Backend services (AuthService, TeamService, PlanningService, TrainingService) → implementation tasks
- Frontend components (Dashboard, TeamManager, PlanningCreator, TrainingExecutor) → implementation tasks
- Database migrations and seeding → setup tasks
- Dark/light mode theming → UI tasks

**Ordering Strategy**:
- TDD order: Contract tests → Integration tests → Unit tests → Implementation
- Dependency order: Database setup → Models → Services → Controllers → Components
- Backend before frontend for API-dependent components
- Mark [P] for parallel execution (independent files/modules)
- Group related tasks for efficient parallel execution

**Estimated Output**: 45-55 numbered, ordered tasks in tasks.md (due to full-stack complexity)

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS (all design artifacts meet constitutional requirements)
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none - all constitutional requirements met)

---
*Based on Constitution v1.0.0 - See `.specify/memory/constitution.md`*
