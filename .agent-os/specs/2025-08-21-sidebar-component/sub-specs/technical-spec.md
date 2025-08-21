# Technical Specification - Sidebar Component

> **Spec**: Responsive Sidebar Component with Theme Toggle  
> **Created**: 2025-08-21  
> **Type**: Frontend Component System  

## Technical Requirements

### Functionality Requirements

#### Core Sidebar Functionality
- **Collapsible Navigation**: Toggle entre estado expandido (280px) y colapsado (64px)
- **Responsive Behavior**: Adaptación automática según breakpoints
- **Navigation Routing**: Integración con Angular Router para navegación
- **State Management**: Persistencia del estado collapsed/expanded

#### User Menu System
- **User Identification**: Mostrar iniciales del usuario autenticado
- **Dropdown Menu**: Menu contextual con opciones de usuario
- **Logout Integration**: Conexión con AuthService para cerrar sesión
- **Click Outside**: Cerrar menu al hacer click fuera del componente

#### Theme System
- **Theme Toggle**: Alternancia entre light/dark mode
- **System Preference**: Detección automática de preferencia del sistema
- **Persistence**: Guardar preferencia en localStorage
- **Global Application**: Aplicar tema a toda la aplicación

### UI/UX Requirements

#### Visual Design
- **Material Design**: Seguir principios de Material Design 3
- **Icon System**: Usar iconos consistentes (Material Icons o Heroicons)
- **Typography**: Tipografía clara y legible en ambos temas
- **Spacing**: Sistema de espaciado consistente con Tailwind

#### Animations & Transitions
- **Smooth Transitions**: Animaciones de <200ms para cambios de estado
- **Easing Functions**: Usar cubic-bezier para transiciones naturales
- **Loading States**: Indicadores visuales durante carga de datos
- **Hover Effects**: Feedback visual en interacciones

#### Responsive Design
```css
/* Breakpoints */
- Mobile: <768px (overlay mode)
- Tablet: 768px-1023px (collapsed by default)
- Desktop: ≥1024px (expanded by default)
```

### Integration Requirements

#### Angular Integration
- **Standalone Components**: Usar arquitectura standalone de Angular 20+
- **Signals**: Implementar estado reactivo con Angular Signals
- **Router Integration**: Navegación mediante Angular Router
- **Service Integration**: Conexión con AuthService y otros servicios core

#### Dashboard Integration
- **Layout System**: Integración con DashboardComponent existente
- **Content Adjustment**: Ajuste automático del contenido principal
- **Z-index Management**: Manejo correcto de capas en mobile overlay
- **Scroll Behavior**: Comportamiento de scroll independiente

### Performance Requirements

#### Loading Performance
- **Lazy Loading**: Componentes cargados bajo demanda si es necesario
- **Bundle Size**: Minimizar impacto en bundle principal
- **Tree Shaking**: Código optimizado para tree shaking
- **Memory Usage**: Gestión eficiente de memoria en componentes

#### Runtime Performance
- **Change Detection**: Optimización con OnPush strategy
- **Event Handling**: Debounce en eventos de resize
- **DOM Manipulation**: Minimizar manipulaciones directas del DOM
- **CSS Performance**: Usar CSS transforms para animaciones

## External Dependencies

### Required Dependencies

#### Angular Ecosystem
```json
{
  "@angular/core": "^20.0.0",
  "@angular/common": "^20.0.0",
  "@angular/router": "^20.0.0",
  "@angular/cdk": "^20.0.0"
}
```

#### Styling Framework
```json
{
  "tailwindcss": "^4.0.0-alpha",
  "@tailwindcss/typography": "^0.5.0"
}
```

#### Icon System
```json
{
  "@angular/material": "^20.0.0",
  "@heroicons/react": "^2.0.0"
}
```

### Optional Dependencies

#### Animation Library (if needed)
```json
{
  "@angular/animations": "^20.0.0"
}
```

## Component Architecture

### Component Structure

```typescript
// Component Hierarchy
SidebarComponent
├── NavigationComponent
│   ├── NavigationItemComponent
│   └── NavigationGroupComponent
├── UserMenuComponent
│   ├── UserAvatarComponent
│   └── DropdownMenuComponent
└── SidebarToggleComponent

// Separate Components
ThemeToggleComponent (in navbar)
ThemeService (global service)
```

### State Management

```typescript
// Sidebar State
interface SidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  activeRoute: string;
}

// Theme State
interface ThemeState {
  currentTheme: 'light' | 'dark' | 'system';
  systemPreference: 'light' | 'dark';
}

// User State (from AuthService)
interface UserState {
  user: User | null;
  isAuthenticated: boolean;
}
```

### Service Architecture

```typescript
// Core Services
ThemeService {
  theme$: Signal<ThemeState>
  toggleTheme(): void
  setTheme(theme: Theme): void
  detectSystemPreference(): void
}

SidebarService {
  state$: Signal<SidebarState>
  toggle(): void
  collapse(): void
  expand(): void
  setMobileOpen(open: boolean): void
}
```

## Implementation Details

### Tailwind CSS v4 Configuration

```css
/* styles/themes.css */
@import "tailwindcss";

@theme {
  /* Sidebar Variables */
  --sidebar-width: 280px;
  --sidebar-width-collapsed: 64px;
  --sidebar-transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Light Theme */
  --color-sidebar-bg: oklch(100% 0 0);
  --color-sidebar-border: oklch(90% 0 0);
  --color-sidebar-text: oklch(15% 0 0);
  --color-sidebar-text-muted: oklch(45% 0 0);
  --color-sidebar-hover: oklch(96% 0 0);
  --color-sidebar-active: oklch(47.8% 0.224 264.5);
  
  /* Dark Theme */
  --color-sidebar-bg-dark: oklch(13% 0 0);
  --color-sidebar-border-dark: oklch(25% 0 0);
  --color-sidebar-text-dark: oklch(95% 0 0);
  --color-sidebar-text-muted-dark: oklch(65% 0 0);
  --color-sidebar-hover-dark: oklch(18% 0 0);
  --color-sidebar-active-dark: oklch(47.8% 0.224 264.5);
}

/* Dark mode overrides */
.dark {
  --color-sidebar-bg: var(--color-sidebar-bg-dark);
  --color-sidebar-border: var(--color-sidebar-border-dark);
  --color-sidebar-text: var(--color-sidebar-text-dark);
  --color-sidebar-text-muted: var(--color-sidebar-text-muted-dark);
  --color-sidebar-hover: var(--color-sidebar-hover-dark);
  --color-sidebar-active: var(--color-sidebar-active-dark);
}

/* System preference detection */
@media (prefers-color-scheme: dark) {
  :root:not(.light) {
    --color-sidebar-bg: var(--color-sidebar-bg-dark);
    --color-sidebar-border: var(--color-sidebar-border-dark);
    --color-sidebar-text: var(--color-sidebar-text-dark);
    --color-sidebar-text-muted: var(--color-sidebar-text-muted-dark);
    --color-sidebar-hover: var(--color-sidebar-hover-dark);
    --color-sidebar-active: var(--color-sidebar-active-dark);
  }
}
```

### Component Implementation Patterns

#### Standalone Component Pattern
```typescript
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, NavigationComponent, UserMenuComponent],
  template: `...`,
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  // Implementation using Signals
}
```

#### Signal-based State Management
```typescript
export class SidebarComponent {
  private sidebarService = inject(SidebarService);
  
  // Reactive state
  isCollapsed = this.sidebarService.state().isCollapsed;
  isMobileOpen = this.sidebarService.state().isMobileOpen;
  
  // Computed values
  sidebarClasses = computed(() => ({
    'w-64': !this.isCollapsed(),
    'w-16': this.isCollapsed(),
    'translate-x-0': this.isMobileOpen(),
    '-translate-x-full': !this.isMobileOpen()
  }));
}
```

### Accessibility Implementation

#### ARIA Labels and Roles
```html
<nav role="navigation" aria-label="Main navigation">
  <button 
    aria-expanded="{{!isCollapsed()}}"
    aria-controls="sidebar-content"
    aria-label="Toggle sidebar">
  </button>
  
  <ul role="menubar" id="sidebar-content">
    <li role="none">
      <a role="menuitem" 
         [attr.aria-current]="isActive ? 'page' : null">
      </a>
    </li>
  </ul>
</nav>
```

#### Keyboard Navigation
```typescript
@HostListener('keydown', ['$event'])
onKeyDown(event: KeyboardEvent) {
  switch (event.key) {
    case 'Escape':
      if (this.isMobileOpen()) {
        this.sidebarService.setMobileOpen(false);
      }
      break;
    case 'Tab':
      // Handle tab navigation
      break;
  }
}
```

## Testing Strategy

### Unit Testing
- **Component Testing**: Probar cada componente individualmente
- **Service Testing**: Validar lógica de ThemeService y SidebarService
- **Integration Testing**: Probar interacción entre componentes
- **Accessibility Testing**: Validar cumplimiento de estándares WCAG

### E2E Testing
- **Navigation Flow**: Probar navegación completa
- **Responsive Behavior**: Validar comportamiento en diferentes dispositivos
- **Theme Switching**: Probar cambio de temas
- **User Interactions**: Validar todas las interacciones de usuario

## Security Considerations

### Authentication Integration
- **Token Validation**: Validar tokens antes de mostrar información de usuario
- **Route Protection**: Asegurar que solo usuarios autenticados accedan
- **Logout Security**: Limpiar completamente el estado al hacer logout
- **XSS Prevention**: Sanitizar cualquier contenido dinámico

### Data Privacy
- **Local Storage**: Encriptar datos sensibles en localStorage
- **User Information**: Minimizar información de usuario mostrada
- **Session Management**: Manejar correctamente expiración de sesiones

## Performance Optimization

### Bundle Optimization
- **Code Splitting**: Separar componentes no críticos
- **Tree Shaking**: Eliminar código no utilizado
- **Lazy Loading**: Cargar componentes bajo demanda
- **Asset Optimization**: Optimizar iconos y recursos

### Runtime Optimization
- **Change Detection**: Usar OnPush strategy
- **Event Debouncing**: Debounce en eventos de resize
- **Memory Management**: Cleanup de subscriptions
- **CSS Performance**: Usar CSS transforms para animaciones

## Deployment Considerations

### Build Configuration
- **Production Build**: Configuración optimizada para producción
- **Environment Variables**: Configuración por ambiente
- **Asset Hashing**: Versionado de assets para cache busting
- **Compression**: Gzip/Brotli compression

### Browser Compatibility
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **CSS Custom Properties**: Soporte nativo requerido
- **ES2020**: Sintaxis moderna de JavaScript
- **Polyfills**: Mínimos polyfills necesarios

## Monitoring & Analytics

### Performance Monitoring
- **Core Web Vitals**: Monitorear LCP, FID, CLS
- **Bundle Size**: Tracking del tamaño del bundle
- **Load Times**: Tiempo de carga de componentes
- **Error Tracking**: Monitoreo de errores en producción

### User Analytics
- **Usage Patterns**: Tracking de uso del sidebar
- **Theme Preferences**: Análisis de preferencias de tema
- **Navigation Patterns**: Rutas más utilizadas
- **Device Analytics**: Distribución de dispositivos

---

**Version Policy**: Usar siempre las versiones más recientes de las dependencias. Consultar documentación oficial para configuraciones específicas de Tailwind CSS v4 y Angular 20+.