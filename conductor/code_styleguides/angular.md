# Angular Style Guide (Official Best Practices)

## General Principles
- **Standalone Default:** Always use standalone components. Do NOT set `standalone: true` manually (it is the default in v19+).
- **Strict Typing:** Use strict TypeScript configuration. Avoid `any`; use `unknown` if necessary.
- **Single Responsibility:** Keep components, services, and directives small and focused.

## Components
- **Inputs/Outputs:** Use the signal-based `input()` and `output()` functions instead of `@Input/@Output` decorators.
- **Change Detection:** Always set `changeDetection: ChangeDetectionStrategy.OnPush`.
- **Host Bindings:** Use the `host` property in the `@Component` decorator instead of `@HostBinding` or `@HostListener`.
- **Templates:**
  - Use **Native Control Flow** (`@if`, `@for`, `@switch`) instead of legacy structural directives (`*ngIf`, etc.).
  - Prefer inline templates for small components.
  - Use `class` and `style` bindings (e.g., `[class.active]="..."`) instead of `ngClass` or `ngStyle`.
- **Images:** Use `NgOptimizedImage` for static images (except inline base64).

## State Management (Signals)
- **Local State:** Use `signal()` for component-local state.
- **Derived State:** Use `computed()` for values derived from other signals.
- **Updates:** Use `.set()` or `.update()` to modify signals. Do NOT use `.mutate()`.
- **Global State:** Encapsulate global state in `providedIn: 'root'` services using signals.

## Architecture & Routing
- **Lazy Loading:** Implement lazy loading for all feature routes.
- **Services:** Use `providedIn: 'root'` for singletons.
- **Dependency Injection:** Use the `inject()` function instead of constructor injection.
- **Forms:** Prefer **Reactive Forms** over Template-driven forms.

## TypeScript Integration
- **Inference:** Prefer type inference where obvious.
- **Observables:** Use the `AsyncPipe` or convert to signals (`toSignal`) to handle observables in templates.