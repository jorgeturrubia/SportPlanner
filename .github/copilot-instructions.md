<!-- GitHub Copilot instructions for AI agents (SportPlanner) -->
# SportPlanner: Copilot / AI agent guidance

This repo is a documentation-driven specification for SportPlanner — an Angular (frontend) + .NET (backend) application with Supabase as BaaS. Use repository docs to stay aligned with architectural choices, conventions, and workflows.

Key locations (read these first):
- `README.md` — project overview & quickstart (frontend `ng serve`, backend `dotnet run`).
- `docs/tecnico/StackTecnologico.md` — detailed stack choices and dev patterns for frontend/backend.
- `docs/tecnico/openapi.yaml` and `docs/tecnico/04-api-contracts.md` — API contract and examples (base path `/api/v1`).
- `docs/ADR/` — Architectural Decision Records (important for why decisions were made).
- `instructions.md` — project-specific agent instructions and conventions (how to present content, validation, output artifacts).

Primary architecture summary:
- Frontend: Angular 20+ (standalone components, Signals, Tailwind CSS, Fabric.js for canvas and GSAP for animations).
- Backend: .NET 8 (minimal APIs, EF Core with code-first migrations, FluentValidation, Serilog); API base path `/api/v1`.
- Data/Integration: Supabase (Auth, Storage, Realtime) backed by PostgreSQL; hosting strategy TO_BE_DEFINED (we will use `appsettings.json` for local configuration).

Repository-specific conventions (follow these):
- Language: Spanish — produce user-facing text and docs in Spanish by default.
- Frontend patterns: standalone components, prefer Signals over RxJS for local state, bundle Tailwind utility classes; canvas state is serialized as JSON (refer `Fabric.js` usage in stack doc).
- Backend patterns: minimal APIs, DTOs + FluentValidation, use named folders: `Controllers`, `Services`, `Repositories`, `Models`, `Data` (DbContext & migrations).
- API docs: Keep `docs/tecnico/openapi.yaml` in sync with controllers. When adding endpoints, update OpenAPI and `/docs` swagger exposure.

- Developer quick start & workflows (doc-derived):
- Frontend: cd to `frontend`, run `npm install`, `ng serve` for local dev. Use `ng build` for production artifacts (hosting TBD).
- Backend: cd to `backend` (or `SportPlanner.API`), run `dotnet restore` then `dotnet run`. Manage EF migrations via `dotnet ef migrations add` and `dotnet ef database update`.
- Auth: Supabase JWTs validated server-side via `Microsoft.AspNetCore.Authentication.JwtBearer`.

Editing & PR guidance for AI agents:
- Preserve file language and naming, prefer Spanish. If generating content, reuse vocabulary found in `docs/negocio/*` (e.g., `planificaciones`, `ejercicios`, `sesiones`).
- When editing API behavior, update `docs/tecnico/openapi.yaml` and the `docs/tecnico/04-api-contracts.md` examples.
- If proposing schema changes, add or update EF Core migrations and the `docs/tecnico/ModeloDatos.md`.
- Add or update ADRs in `docs/ADR/` for significant architectural changes (new infra, major library changes, re-architecture).

What to avoid:
- Don’t add secrets, credentials, or env variables to source files or docs. Use placeholders and reference `.env.example` patterns if needed.
- Don’t modify the stack choices (Angular + .NET + Supabase) without adding an ADR explaining the rationale.

If you make code changes, also provide the minimal validation steps in PR description (build + smoke test):
- Frontend: `ng build --configuration=development` and a short visual test (canvas editing + saving JSON).
- Backend: `dotnet build` + `dotnet run`, minimal integration check hitting `GET /planificaciones` (use `docs/tecnico/openapi.yaml` to know routes and security).

When you generate new API surface, update both the controller and `docs/tecnico/openapi.yaml` and add/update examples in `docs/tecnico/04-api-contracts.md`.

If uncertain about a decision, consult `docs/ADR/` & `docs/tecnico/StackTecnologico.md` before proposing changes.

Thanks — keep outputs concise and localized (Spanish). Ask for clarifications if the intent is ambiguous or external services change.

Edge cases & guidance for agents:
- This repository is documentation-first; if source code (frontend/backend folders) is missing, prefer to propose minimal scaffolding rather than inventing whole implementations.
- When missing files are required for a task (e.g., controllers, components), ask clarifying questions or create a PR with a tiny, safe change and guidance for the developer to fill in secrets, configs, or other environment-specific items.
- When adding or altering API endpoints: update `docs/tecnico/openapi.yaml`, `docs/tecnico/04-api-contracts.md`, and add a short example request/response in the same format used in the repository.
