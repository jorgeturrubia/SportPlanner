# Arquitectura Frontend - SportPlanner

## Descripción General

El frontend de SportPlanner está construido con Angular 20+ utilizando la nueva arquitectura standalone components y las características más modernas del framework. La aplicación implementa Server-Side Rendering (SSR) para optimización SEO y utiliza Tailwind CSS v4 para un sistema de diseño cohesivo.

## Stack Tecnológico

### Core Technologies
- **Angular 20+**: Framework principal con standalone components
- **TypeScript 5.8+**: Tipado fuerte y características ES2023
- **Tailwind CSS v4**: Utility-first CSS framework con OKLCH color system
- **RxJS 7.8+**: Programación reactiva y manejo de estado
- **Angular SSR**: Server-Side Rendering para mejoras de SEO y performance

### Herramientas y Librerías
- **@ng-icons/heroicons**: Iconografía consistente con Heroicons
- **Angular Reactive Forms**: Formularios reactivos con validación
- **PostCSS**: Procesamiento CSS avanzado
- **Zone.js**: Change detection automática

## Arquitectura de Componentes

```
src/app/
├── app.ts                    # Root component (standalone)
├── app.routes.ts             # Configuración de rutas
├── app.config.ts             # Configuración de la aplicación
├── app.config.server.ts      # Configuración SSR
│
├── components/               # Componentes reutilizables
│   ├── navbar/              
│   │   ├── navbar.component.ts
│   │   ├── navbar.component.html
│   │   └── navbar.component.css
│   └── footer/
│       ├── footer.component.ts
│       ├── footer.component.html
│       └── footer.component.css
│
├── pages/                   # Páginas principales (feature components)
│   ├── landing/
│   │   ├── landing.component.ts
│   │   ├── landing.component.html
│   │   └── landing.component.css
│   ├── auth/
│   │   ├── auth.component.ts
│   │   ├── auth.component.html
│   │   └── auth.component.css
│   └── dashboard/
│       ├── dashboard.component.ts
│       ├── dashboard.component.html
│       └── dashboard.component.css
│
├── services/                # Servicios de Angular
│   └── theme.service.ts     # Gestión de temas dark/light
│
├── models/                  # Interfaces y tipos TypeScript
│   └── user.model.ts        # Modelos de usuario
│
└── environments/            # Configuraciones de entorno
    ├── environment.ts
    └── environment.prod.ts
```

## Patrones de Arquitectura Implementados

### 1. Standalone Components
Todos los componentes utilizan la nueva arquitectura standalone de Angular 20+:

```typescript
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, NgIconComponent, NavbarComponent, FooterComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent { }
```

**Beneficios:**
- Mejor tree shaking automático
- Lazy loading optimizado
- Dependencias explícitas por componente
- Bundle size reducido

### 2. Signals (Angular 20+)
Implementación de Signals para gestión de estado reactivo:

```typescript
export class AuthComponent {
  currentTab = signal<'login' | 'register'>('login');
  showPassword = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  switchTab(tab: 'login' | 'register'): void {
    this.currentTab.set(tab);
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(current => !current);
  }
}
```

**Ventajas:**
- Change detection más eficiente
- Estado reactivo simplificado
- Mejor performance en comparación con observables para estado local

### 3. OnPush Change Detection
Optimización de performance con OnPush strategy:

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent { }
```

### 4. Reactive Forms
Formularios reactivos con validación robusta:

```typescript
export class AuthComponent {
  registerForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
    acceptTerms: [false, Validators.requiredTrue]
  }, { validators: this.passwordMatchValidator });
}
```

## Sistema de Diseño (Tailwind CSS v4)

### Color System (OKLCH)
El proyecto utiliza el sistema de colores OKLCH para mejor percepción visual:

```css
:root {
  --background: oklch(0.9551 0 0);
  --foreground: oklch(0.3211 0 0);
  --primary: oklch(0.4891 0 0);
  --primary-green: oklch(0.58 0.25 142);
}

.dark {
  --background: oklch(0.2178 0 0);
  --foreground: oklch(0.8853 0 0);
}
```

### Design Tokens
Variables CSS personalizadas para consistencia:

```css
@theme inline {
  --color-background: var(--background);
  --color-primary: var(--primary);
  --color-primary-green: var(--primary-green);
  --spacing-3: 0.75rem;
  --navbar-nav-gap: 3rem;
}
```

### Responsive Design
Sistema responsive mobile-first:
- **xs**: < 640px (móviles)
- **sm**: 640px+ (móviles grandes)
- **md**: 768px+ (tablets)
- **lg**: 1024px+ (desktops)
- **xl**: 1280px+ (desktops grandes)

## Gestión de Estado

### 1. Theme Service
Servicio para gestión de temas con soporte SSR:

```typescript
@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDarkMode = signal<boolean>(this.getInitialTheme());

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    effect(() => {
      this.applyTheme(this.isDarkMode());
    });
  }

  toggleTheme(): void {
    this.isDarkMode.update(current => !current);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.THEME_KEY, this.isDarkMode() ? 'dark' : 'light');
    }
  }
}
```

### 2. Local Component State
Estado local con Signals para componentes específicos:

```typescript
export class LandingComponent {
  features = [
    {
      icon: 'heroCalendarDays',
      title: 'Gestión de Eventos',
      description: 'Organiza y planifica torneos, entrenamientos y competencias'
    }
  ];

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
```

## Routing y Navegación

### File-based Routing
Configuración de rutas con lazy loading:

```typescript
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent),
    title: 'SportPlanner - Organiza el Deporte Como Nunca Antes'
  },
  {
    path: 'auth',
    loadComponent: () => import('./pages/auth/auth.component').then(m => m.AuthComponent),
    title: 'SportPlanner - Iniciar Sesión'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'SportPlanner - Dashboard'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
```

**Características:**
- Lazy loading automático de componentes
- Títulos de página dinámicos
- Fallback routing para URLs no encontradas
- Code splitting automático

## Server-Side Rendering (SSR)

### Configuración SSR
```typescript
// app.config.server.ts
export const appConfigServer: ApplicationConfig = {
  providers: [
    provideServerContext(),
    // Otros providers específicos del servidor
  ]
};
```

### Hydration Strategy
```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    // Replay de eventos durante hydration
  ]
};
```

**Beneficios:**
- SEO mejorado con contenido renderizado en servidor
- Faster First Contentful Paint (FCP)
- Mejor Core Web Vitals
- Event replay para transiciones suaves

## Optimizaciones de Performance

### 1. Tree Shaking
- Importación selectiva de iconos y componentes
- Standalone components para mejor eliminación de código muerto

### 2. Bundle Optimization
```json
// angular.json
"budgets": [
  {
    "type": "initial",
    "maximumWarning": "500kB",
    "maximumError": "1MB"
  },
  {
    "type": "anyComponentStyle",
    "maximumWarning": "4kB",
    "maximumError": "8kB"
  }
]
```

### 3. Lazy Loading
```typescript
// Carga diferida de componentes
loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
```

### 4. Change Detection Optimization
- OnPush strategy en todos los componentes
- Signals para estado reactivo eficiente
- Minimal re-renders con change detection optimizada

## Accesibilidad (a11y)

### ARIA Support
- Labels descriptivos en formularios
- Roles apropiados en navegación
- Focus management con `:focus-visible`

### Keyboard Navigation
```css
:focus-visible {
  outline: 2px solid var(--color-primary-green-600);
  outline-offset: 2px;
}
```

### Semantic HTML
- Uso apropiado de elementos semánticos
- Headers jerárquicos (h1, h2, h3)
- Form labels asociados correctamente

## Testing Strategy

### Unit Testing Setup
```typescript
// karma.conf.js configurado para testing
"test": {
  "builder": "@angular/build:karma",
  "options": {
    "polyfills": ["zone.js", "zone.js/testing"],
    "tsConfig": "tsconfig.spec.json"
  }
}
```

### Testing Utilities
- TestBed configuración para componentes standalone
- MockProvider para servicios
- ComponentFixture para testing de templates

## Error Handling

### Global Error Handler
```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    {
      provide: ErrorHandler,
      useClass: CustomErrorHandler
    }
  ]
};
```

### Form Validation
```typescript
private markFormGroupTouched(formGroup: FormGroup): void {
  Object.keys(formGroup.controls).forEach(key => {
    const control = formGroup.get(key);
    control?.markAsTouched();
    
    if (control && 'controls' in control) {
      this.markFormGroupTouched(control as FormGroup);
    }
  });
}
```

## Build y Deployment

### Build Configurations
```json
"configurations": {
  "production": {
    "budgets": [...],
    "outputHashing": "all"
  },
  "development": {
    "optimization": false,
    "extractLicenses": false,
    "sourceMap": true
  }
}
```

### Output Structure
```
dist/SportPlanner/
├── browser/          # Cliente (CSR)
├── server/           # Servidor (SSR)
└── assets/          # Assets estáticos
```

## Roadmap Técnico

### Próximas Implementaciones
1. **PWA Support**: Service workers y offline capabilities
2. **Micro-frontends**: Arquitectura modular escalable
3. **Web Components**: Componentes reutilizables cross-framework
4. **Angular Material**: Component library completa
5. **State Management**: NgRx o Akita para estado global complejo
6. **i18n**: Internacionalización completa
7. **Testing**: Cobertura completa con Cypress E2E

### Performance Goals
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

---

*Documentación de arquitectura frontend para SportPlanner v1.0 - Angular 20+ con SSR*