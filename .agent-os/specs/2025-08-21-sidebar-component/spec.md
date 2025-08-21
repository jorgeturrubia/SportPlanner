# Sidebar Component Specification

> **Spec**: Responsive Sidebar Component with Theme Toggle  
> **Created**: 2025-08-21  
> **Status**: Draft  
> **Priority**: High  

## Overview

Creación de un componente sidebar responsive para el dashboard de PlanSport que incluye navegación colapsible, menú de usuario y toggle de tema dark/light.

## Business Requirements

### Core Functionality
- **Sidebar Responsive**: Componente que se adapta a diferentes tamaños de pantalla
- **Toggle Collapse**: Capacidad de colapsar el sidebar mostrando solo iconos
- **Navegación**: Items de navegación con nombre e icono
- **Menú Usuario**: Botón con iniciales del usuario que despliega menú con logout
- **Theme Toggle**: Botón en navbar para alternar entre tema claro y oscuro

### User Stories

**Como usuario del dashboard, quiero:**
1. Poder colapsar el sidebar para tener más espacio de trabajo
2. Ver los items de navegación con iconos claros y nombres descriptivos
3. Acceder fácilmente a mi perfil y opción de logout
4. Cambiar entre tema claro y oscuro según mi preferencia
5. Que el sidebar se adapte correctamente en dispositivos móviles

## Technical Requirements

### Frontend Components

#### SidebarComponent
- **Path**: `src/app/shared/components/sidebar/sidebar.component.ts`
- **Responsabilidades**:
  - Renderizar navegación principal
  - Manejar estado collapsed/expanded
  - Integrar menú de usuario
  - Responsive behavior

#### UserMenuComponent
- **Path**: `src/app/shared/components/user-menu/user-menu.component.ts`
- **Responsabilidades**:
  - Mostrar iniciales del usuario
  - Dropdown menu con opciones
  - Logout functionality

#### ThemeToggleComponent
- **Path**: `src/app/shared/components/theme-toggle/theme-toggle.component.ts`
- **Responsabilidades**:
  - Toggle entre light/dark theme
  - Persistir preferencia del usuario
  - Aplicar tema globalmente

### Services

#### ThemeService
- **Path**: `src/app/core/services/theme.service.ts`
- **Responsabilidades**:
  - Gestionar estado del tema actual
  - Persistir preferencia en localStorage
  - Aplicar clases CSS globalmente
  - Detectar preferencia del sistema

### Styling (Tailwind CSS v4)

#### Theme Configuration
```css
@import "tailwindcss";

@theme {
  /* Light theme colors */
  --color-primary: oklch(47.8% 0.224 264.5);
  --color-secondary: oklch(69.7% 0.329 192.2);
  --color-background: oklch(100% 0 0);
  --color-surface: oklch(98% 0 0);
  --color-text: oklch(15% 0 0);
  --color-text-muted: oklch(45% 0 0);
  
  /* Sidebar specific */
  --sidebar-width: 280px;
  --sidebar-width-collapsed: 64px;
  --sidebar-bg: var(--color-surface);
  --sidebar-border: oklch(90% 0 0);
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-background: oklch(12% 0 0);
    --color-surface: oklch(15% 0 0);
    --color-text: oklch(95% 0 0);
    --color-text-muted: oklch(65% 0 0);
    --sidebar-bg: oklch(13% 0 0);
    --sidebar-border: oklch(25% 0 0);
  }
}

.dark {
  --color-background: oklch(12% 0 0);
  --color-surface: oklch(15% 0 0);
  --color-text: oklch(95% 0 0);
  --color-text-muted: oklch(65% 0 0);
  --sidebar-bg: oklch(13% 0 0);
  --sidebar-border: oklch(25% 0 0);
}
```

## Implementation Details

### Sidebar Structure
```
┌─────────────────────────┐
│ Logo / Brand            │
├─────────────────────────┤
│ 📊 Dashboard           │
│ 👥 Athletes            │
│ 📋 Plans               │
│ 📈 Analytics           │
│ ⚙️  Settings           │
├─────────────────────────┤
│        Spacer           │
├─────────────────────────┤
│ [JD] User Menu         │
└─────────────────────────┘
```

### Collapsed State
```
┌───┐
│ 🏠 │
├───┤
│ 📊 │
│ 👥 │
│ 📋 │
│ 📈 │
│ ⚙️ │
├───┤
│   │
├───┤
│JD │
└───┘
```

### Navigation Items
```typescript
interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

const navigationItems: NavigationItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
  { id: 'athletes', label: 'Atletas', icon: 'people', route: '/athletes' },
  { id: 'plans', label: 'Planes', icon: 'assignment', route: '/plans' },
  { id: 'analytics', label: 'Analíticas', icon: 'analytics', route: '/analytics' },
  { id: 'settings', label: 'Configuración', icon: 'settings', route: '/settings' }
];
```

### Responsive Behavior
- **Desktop (≥1024px)**: Sidebar visible por defecto, toggle disponible
- **Tablet (768px-1023px)**: Sidebar colapsado por defecto
- **Mobile (<768px)**: Sidebar como overlay, se oculta automáticamente

## Acceptance Criteria

### Sidebar Component
- [ ] Sidebar se renderiza correctamente en el dashboard
- [ ] Toggle button colapsa/expande el sidebar
- [ ] Items de navegación muestran icono y texto
- [ ] En estado colapsado solo se muestran iconos
- [ ] Navegación funciona correctamente (routing)
- [ ] Responsive en todos los breakpoints

### User Menu
- [ ] Botón muestra iniciales del usuario actual
- [ ] Click abre dropdown menu
- [ ] Menu incluye opción de logout
- [ ] Logout redirige correctamente a /auth
- [ ] Menu se cierra al hacer click fuera

### Theme Toggle
- [ ] Botón toggle en navbar del dashboard
- [ ] Cambia entre light y dark theme
- [ ] Preferencia se persiste en localStorage
- [ ] Tema se aplica globalmente
- [ ] Respeta preferencia del sistema por defecto

### Integration
- [ ] Sidebar integrado en DashboardComponent
- [ ] No interfiere con contenido principal
- [ ] Animaciones suaves en transiciones
- [ ] Accesibilidad (ARIA labels, keyboard navigation)

## Dependencies

### Angular
- Angular 20+ (standalone components)
- Angular Router
- Angular Signals

### Styling
- Tailwind CSS v4
- CSS custom properties
- CSS animations/transitions

### Icons
- Material Icons o Heroicons
- SVG icons para mejor rendimiento

## Files to Create/Modify

### New Files
```
src/app/shared/components/sidebar/
├── sidebar.component.ts
├── sidebar.component.html
└── sidebar.component.css

src/app/shared/components/user-menu/
├── user-menu.component.ts
├── user-menu.component.html
└── user-menu.component.css

src/app/shared/components/theme-toggle/
├── theme-toggle.component.ts
├── theme-toggle.component.html
└── theme-toggle.component.css

src/app/core/services/
└── theme.service.ts

src/styles/
└── themes.css
```

### Modified Files
```
src/app/pages/dashboard/dashboard.component.ts
src/app/pages/dashboard/dashboard.component.html
src/styles.css
```

## Success Metrics

- **Usabilidad**: Sidebar fácil de usar y navegar
- **Performance**: Transiciones suaves (<200ms)
- **Responsive**: Funciona correctamente en todos los dispositivos
- **Accesibilidad**: Cumple estándares WCAG 2.1
- **Consistencia**: Tema se aplica consistentemente en toda la app

## Notes

- Usar Tailwind CSS v4 con CSS custom properties para temas
- Implementar usando Angular Signals para estado reactivo
- Seguir patrones de standalone components
- Considerar animaciones para mejor UX
- Implementar lazy loading si es necesario