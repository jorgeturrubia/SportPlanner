# TypeScript/Angular Style Guide - PlanSport

## Angular 20 Specific Standards

### Component Architecture
- **Mandatory**: Use standalone components (no NgModules)
- **File Structure**: Separate .ts, .html, .css files (never inline)
- **Control Flow**: Use `@if`, `@for`, `@switch` instead of structural directives
- **Signals**: Primary state management with Angular Signals
- **Change Detection**: OnPush strategy where applicable

### TypeScript Standards
- **Strict Mode**: Enable strict TypeScript configuration
- **Types**: Explicit typing for all public methods and properties
- **Interfaces**: Use interfaces for complex data structures
- **Enums**: Use const enums for better performance

### Reactive Forms
- **Form Type**: Use typed reactive forms over template-driven
- **Validation**: FormControl with validators, avoid template validation
- **Form Groups**: Strongly typed FormGroup declarations

### Dependency Injection
- **Modern DI**: Use `inject()` function in functional guards/interceptors
- **Services**: Injectable with providedIn: 'root' for singletons
- **Providers**: Configure providers in component or route level when needed

### Component Structure Example
```typescript
@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './team-list.component.html',
  styleUrl: './team-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamListComponent {
  private teamService = inject(TeamService);
  
  teams = signal<Team[]>([]);
  loading = signal(false);
}
```

### Naming Conventions
- **Components**: kebab-case files, PascalCase classes
- **Services**: camelCase with Service suffix
- **Interfaces**: PascalCase with I prefix
- **Types**: PascalCase with Type suffix

### Import Organization
1. Angular core imports
2. Angular common imports  
3. Third-party libraries
4. Application imports (services, models)
5. Relative imports

### Error Handling
- Use RxJS operators for error handling in services
- Implement global error handler for unhandled errors
- User-friendly error messages in Spanish
