---
inclusion: fileMatch
fileMatchPattern: "**/*.ts"
---

# Angular Development Conventions

These conventions are specific to Angular/TypeScript development and build upon the shared development standards. These rules are automatically loaded when working with TypeScript files.

## Angular Architecture Rules

### Component Development
- **ALWAYS** use standalone components (no NgModules except for legacy integration)
- **ALWAYS** use OnPush change detection strategy for performance
- **ALWAYS** implement proper lifecycle hooks and cleanup (OnDestroy)
- **ALWAYS** use TypeScript strict mode and maintain type safety
- **ALWAYS** separate template and styles into separate files for complex components
- **NEVER** manipulate DOM directly - use Angular APIs instead

### Service Implementation
- **ALWAYS** use dependency injection with inject() function (Angular 14+)
- **ALWAYS** provide services at the appropriate level (root, component, or module)
- **ALWAYS** implement proper error handling in services
- **ALWAYS** use RxJS operators for reactive programming
- **ALWAYS** unsubscribe from observables to prevent memory leaks

## Modern Angular Patterns

### Control Flow (Angular 17+)
- **ALWAYS** use modern control flow syntax: @if, @for, @switch
- **NEVER** use structural directives (*ngIf, *ngFor) in new code
- **ALWAYS** use trackBy functions with @for for performance

### Signal-based State Management
- **ALWAYS** use signals for component state when appropriate
- **ALWAYS** use computed() for derived state
- **ALWAYS** use effect() sparingly and only for side effects
- **PREFER** signals over traditional reactive forms for simple state

### Reactive Forms
- **ALWAYS** use typed reactive forms with FormBuilder
- **ALWAYS** implement proper form validation with custom validators when needed
- **ALWAYS** handle form submission errors gracefully
- **NEVER** use template-driven forms for complex scenarios

## File Structure and Naming

### Component Organization
```
src/app/features/user-management/
├── components/
│   ├── user-profile/
│   │   ├── user-profile.component.ts
│   │   ├── user-profile.component.html
│   │   ├── user-profile.component.scss
│   │   └── user-profile.component.spec.ts
│   └── user-list/
├── services/
│   ├── user.service.ts
│   └── user.service.spec.ts
├── models/
│   ├── user.interface.ts
│   └── user-dto.interface.ts
└── guards/
    ├── user-auth.guard.ts
    └── user-auth.guard.spec.ts
```

### Naming Conventions
- **Components**: kebab-case for files, PascalCase for classes (`user-profile.component.ts`, `UserProfileComponent`)
- **Services**: kebab-case for files, PascalCase for classes (`user.service.ts`, `UserService`)
- **Interfaces**: PascalCase with descriptive names (`User`, `CreateUserRequest`, `UserResponse`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `DEFAULT_PAGE_SIZE`)

## Component Implementation Standards

### Component Structure Template
```typescript
import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  
  // Signal-based state
  user = signal<User | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);
  
  // Computed values
  displayName = computed(() => {
    const user = this.user();
    return user ? `${user.firstName} ${user.lastName}` : '';
  });
  
  ngOnInit(): void {
    this.loadUser();
  }
  
  private loadUser(): void {
    this.isLoading.set(true);
    this.userService.getCurrentUser()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (user) => {
          this.user.set(user);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.error.set('Failed to load user');
          this.isLoading.set(false);
          console.error('User load error:', error);
        }
      });
  }
}
```

### Service Implementation Template
```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/v1/users`;
  
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  updateUser(user: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/me`, user)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  private handleError(error: any): Observable<never> {
    console.error('User service error:', error);
    return throwError(() => new Error('An error occurred while processing the request'));
  }
}
```

## State Management Patterns

### Simple Component State (Signals)
```typescript
// For simple, local component state
export class ProductListComponent {
  products = signal<Product[]>([]);
  selectedProduct = signal<Product | null>(null);
  isLoading = signal(false);
  
  // Computed properties
  filteredProducts = computed(() => {
    const products = this.products();
    const selected = this.selectedProduct();
    return selected ? products.filter(p => p.category === selected.category) : products;
  });
}
```

## Testing Standards

### Component Testing Template
```typescript
describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;
  let userService: jasmine.SpyObj<UserService>;
  
  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getCurrentUser']);
    
    await TestBed.configureTestingModule({
      imports: [UserProfileComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should load user on init', () => {
    const mockUser: User = { id: '1', firstName: 'John', lastName: 'Doe' };
    userService.getCurrentUser.and.returnValue(of(mockUser));
    
    component.ngOnInit();
    
    expect(component.user()).toEqual(mockUser);
    expect(component.isLoading()).toBeFalse();
  });
});
```

## Performance Optimization

### Change Detection Optimization
- **ALWAYS** use OnPush change detection strategy
- **ALWAYS** use trackBy functions in @for loops
- **ALWAYS** use async pipe for observable data
- **ALWAYS** unsubscribe from observables to prevent memory leaks
- **CONSIDER** using signals for better performance in Angular 17+

## Styling Standards (Tailwind CSS)

### Tailwind Usage
- **ALWAYS** use Tailwind utility classes for styling
- **ALWAYS** create component-specific CSS classes only when necessary
- **ALWAYS** follow mobile-first responsive design principles
- **ALWAYS** use Tailwind's design tokens for consistent spacing, colors, and typography

### Component Styling Example
```html
<!-- user-profile.component.html -->
<div class="max-w-4xl mx-auto p-6">
  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex items-center space-x-4">
      <img [src]="user()?.avatar" 
           [alt]="displayName()"
           class="w-16 h-16 rounded-full object-cover">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ displayName() }}</h1>
        <p class="text-gray-600">{{ user()?.email }}</p>
      </div>
    </div>
  </div>
</div>
```

## Error Handling and User Feedback

### User Feedback Pattern
```typescript
export class UserProfileComponent {
  user = signal<User | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  
  saveProfile(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.successMessage.set(null);
    
    this.userService.updateUser(this.user()!)
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (user) => {
          this.user.set(user);
          this.successMessage.set('Profile updated successfully');
          this.isLoading.set(false);
        },
        error: (error) => {
          this.error.set('Failed to update profile. Please try again.');
          this.isLoading.set(false);
          console.error('Profile update error:', error);
        }
      });
  }
}
```

These Angular conventions ensure consistent, performant, and maintainable frontend code that integrates seamlessly with the overall project architecture.
