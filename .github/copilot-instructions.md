<!--
Guidance for AI coding assistants working in this repo.
Keep it short: read the files below first and follow the conventions.
-->
# SportPlanner - AI Assistant Quick Guide

Read-first files (context + entry points):
- `back/SportPlanner/Program.cs` (entry point, DI, AutoMapper, EF Core registration)
- `back/SportPlanner/README.md` (local dev + migrations workflow)
- `back/AGENTS.MD` (agent conventions, Clean Architecture, DTO/AutoMapper policy)
- `back/AGENTS.MD` (agent conventions, Clean Architecture, DTO/AutoMapper policy). Use `instructions` + `agents` flow described in `back/AGENTS.MD` — if you open a task, prefer using the PR/Issue template with the agent frontmatter.
- `DocSportPlanner/docs/tecnico/StackTecnologico.md` (stack and architectural rationale)

Quick architecture summary:
- Monolithic Clean Architecture: Domain / Application / Infrastructure (Data) / WebAPI.
- Controllers are used, not minimal APIs. Keep Controllers thin: they route/validate and call Application services.
- AutoMapper profiles live in `Application/Mappings`. DTOs live under `Application/DTOs`. Domain entities belong to `Models`/`Data`.
- EF Core (Npgsql) + PostgreSQL; DbContext is `back/SportPlanner/Data/AppDbContext.cs`.

Important workflows and commands:
- Build and run (backend):
  - cd to `back/SportPlanner` and run `dotnet build` and `dotnet run`.
- EF Migrations (local tool):
  - initialize: `dotnet new tool-manifest --force` (if not present)
  - install: `dotnet tool install --local dotnet-ef --version 10.*`
  - add migration: `dotnet tool run dotnet-ef migrations add InitialCreate`
  - apply migrations: `dotnet tool run dotnet-ef database update`
- Environment: use `appsettings.Development.json` or `ConnectionStrings__DefaultConnection` env var. Program.cs will throw if DefaultConnection is missing.

Conventions & patterns (do not deviate unless explicitly requested):
- NEVER expose EF Entities as API contracts; use DTOs only for requests/responses. (See `Application/DTOs` and `Application/Mappings`.)
- Register new AutoMapper profiles in `Application/Mappings` and ensure registration via `builder.Services.AddAutoMapper(...)`.
- Prefer Repository/UnitOfWork for complex persistence; use DbContext directly only for local/simple queries.
- Put validation in FluentValidation Validators under `Application/Validators` and wire them into the request pipeline.

Integration & external services:
- DB: PostgreSQL (Supabase is used in docs). Connection string is configured in `appsettings.json` and overridden by env vars.
- Supabase (Auth/Storage) is a planned integration — look at `DocSportPlanner/docs` for specifics.

Safety & secrets:
- appsettings.json in some build artifacts contains a DB connection string — treat this as a placeholder; DO NOT commit secrets. Prefer env vars and `appsettings.Development.json` for local dev.

Development constraints & PR etiquette:
- Small tasks (add property/endpoint) can be implemented directly.
- Medium/large tasks (multi-file features) require a brief 2–3 phase plan in a PR description (per `back/AGENTS.MD` guidelines).
 - To create a reproducible 'instruction', use `.github/ISSUE_TEMPLATE/agent_task.md` or the PR template `PULL_REQUEST_TEMPLATE.md` and add YAML frontmatter `agent` field. You can generate a local instruction template with `tools/generate-agent-instruction.ps1`.
- Keep changes backwards compatible (DTOs) and preserve Clear Architecture layering.

If uncertain / missing information:
- Ask where to register cross-layer changes (Program.cs/DbContext/DI) before editing multiple layers.
- Confirm DB schema changes and migration strategy before creating migrations for shared DBs.

Examples (common tasks):
- Add DTO + mapping + endpoint: add DTO under `Application/DTOs`, create `Profile` in `Application/Mappings`, map in service logic, add a `Controller` action returning DTO.
- Add a migration: create migration in `back/SportPlanner` with `dotnet tool run dotnet-ef migrations add <Name>` and then `database update`.

Files to read next for deeper context:
- `DocSportPlanner/docs/tecnico/ModeloDatos.md` (data model rationale)
- `back/AGENTS.MD` (task sizing, code guidelines, sample snippets)
- `back/SportPlanner/Program.cs` for DI and AddDbContext usage

Keep it short, targeted, and follow the project's Clean Architecture and DTO-first rules.

If you modify wiring, migration scripts, or DI, add a short PR note describing the change and include commands to reproduce locally (build/migrate/run).
