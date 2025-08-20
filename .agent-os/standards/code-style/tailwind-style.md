# Tailwind CSS 4 Style Guide - PlanSport

## Context

Estándares específicos de Tailwind CSS 4 para PlanSport (Angular 20), enfocado en aplicaciones deportivas modernas, diseño responsivo y patrones utility-first optimizados.

## Core Principles

### 1. Utility-First Approach
- Priorizar utilidades atómicas sobre componentes CSS personalizados
- Evitar CSS personalizado excepto para casos muy específicos
- Usar `@apply` únicamente en componentes reutilizables complejos

### 2. Modern CSS-in-JS with @config
```css
/* app.css - Configuración base */
@import "tailwindcss";
@config "./tailwind.config.js";

@theme {
  /* Paleta de colores deportiva */
  --color-sport-primary: #1e40af;
  --color-sport-secondary: #059669;
  --color-sport-accent: #dc2626;
  --color-sport-neutral: #64748b;
  
  /* Espaciado específico para interfaces deportivas */
  --spacing-team-card: 1.5rem;
  --spacing-exercise-list: 1rem;
  --spacing-marketplace-grid: 2rem;
}
```

### 3. Mobile-First Design
- Implementar diseño mobile-first para coaches y atletas
- Usar breakpoints estándar: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Priorizar funcionalidad en dispositivos móviles

## Component Patterns

### 1. Angular Component Structure
```typescript
@Component({
  selector: 'app-team-card',
  template: `
    <div class="bg-white rounded-lg shadow-md overflow-hidden
                hover:shadow-lg transition-shadow duration-200
                border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ teamName() }}
          </h3>
          <span class="px-2 py-1 text-xs font-medium rounded-full
                       bg-sport-primary/10 text-sport-primary">
            {{ playerCount() }} jugadores
          </span>
        </div>
        
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div class="text-center">
            <span class="block text-2xl font-bold text-gray-900 dark:text-white">
              {{ winRate() }}%
            </span>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              Victorias
            </span>
          </div>
          <div class="text-center">
            <span class="block text-2xl font-bold text-gray-900 dark:text-white">
              {{ nextMatch() }}
            </span>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              Próximo partido
            </span>
          </div>
        </div>
        
        <button class="w-full bg-sport-primary hover:bg-sport-primary/90
                       text-white font-medium py-2 px-4 rounded-md
                       transition-colors duration-200
                       focus:outline-none focus:ring-2 focus:ring-sport-primary/50">
          Gestionar Equipo
        </button>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamCardComponent {
  teamName = input.required<string>();
  playerCount = input.required<number>();
  winRate = input.required<number>();
  nextMatch = input.required<string>();
}
```

### 2. Responsive Design Patterns

#### Sports Dashboard Layout
```html
<!-- Dashboard responsive para coaches -->
<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
  <!-- Header -->
  <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center space-x-4">
          <img class="h-8 w-8" src="/logo.svg" alt="PlanSport">
          <h1 class="text-xl font-semibold text-gray-900 dark:text-white hidden sm:block">
            Panel de Control
          </h1>
        </div>
        
        <nav class="flex items-center space-x-4">
          <button class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700
                         lg:hidden">
            <heroicon name="bars-3" class="h-5 w-5"></heroicon>
          </button>
        </nav>
      </div>
    </div>
  </header>
  
  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Cards responsivas -->
    </div>
  </main>
</div>
```

#### Exercise Planning Interface
```html
<!-- Interface de planificación de ejercicios -->
<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-screen">
  <!-- Lista de ejercicios - Colapsa en móvil -->
  <div class="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow
              overflow-hidden order-2 lg:order-1">
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
        Biblioteca de Ejercicios
      </h2>
    </div>
    
    <div class="overflow-y-auto h-96 lg:h-full">
      <div class="p-4 space-y-3">
        @for (exercise of exercises(); track exercise.id) {
          <div class="p-3 border border-gray-200 dark:border-gray-600 rounded-md
                      hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer
                      transition-colors duration-150">
            <h3 class="font-medium text-gray-900 dark:text-white">
              {{ exercise.name }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ exercise.description }}
            </p>
            <div class="flex items-center mt-2 space-x-2">
              <span class="px-2 py-1 text-xs bg-sport-secondary/10 
                           text-sport-secondary rounded">
                {{ exercise.category }}
              </span>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ exercise.duration }} min
              </span>
            </div>
          </div>
        }
      </div>
    </div>
  </div>
  
  <!-- Planificador principal -->
  <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow
              order-1 lg:order-2">
    <!-- Contenido del planificador -->
  </div>
</div>
```

### 3. Container Queries for Component Adaptability
```html
<!-- Componente adaptable según el contenedor -->
<div class="@container">
  <div class="p-4 @md:p-6 @lg:p-8">
    <div class="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 gap-4">
      <!-- Elementos que se adaptan al contenedor padre -->
    </div>
  </div>
</div>
```

## Design System Integration

### 1. Color Palette - Sports Focused
```css
@theme {
  /* Colores principales del deporte */
  --color-sport-primary: #1e40af;      /* Azul profesional */
  --color-sport-secondary: #059669;    /* Verde éxito/victorias */
  --color-sport-accent: #dc2626;       /* Rojo energía/urgencia */
  --color-sport-warning: #f59e0b;      /* Amarillo advertencias */
  --color-sport-neutral: #64748b;      /* Gris neutro */
  
  /* Estados específicos */
  --color-victory: #10b981;            /* Verde victoria */
  --color-defeat: #ef4444;             /* Rojo derrota */
  --color-training: #8b5cf6;           /* Morado entrenamiento */
  --color-competition: #f97316;        /* Naranja competición */
  
  /* Backgrounds */
  --color-field-green: #16a34a;        /* Verde campo */
  --color-court-blue: #2563eb;         /* Azul cancha */
  --color-track-red: #dc2626;          /* Rojo pista */
}
```

### 2. Typography Scale
```html
<!-- Jerarquía tipográfica para aplicaciones deportivas -->
<h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
  Título Principal
</h1>

<h2 class="text-2xl sm:text-3xl font-semibold text-gray-800 dark:text-gray-100">
  Título Sección
</h2>

<h3 class="text-lg sm:text-xl font-medium text-gray-700 dark:text-gray-200">
  Título Componente
</h3>

<p class="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
  Texto principal de contenido
</p>

<span class="text-sm text-gray-500 dark:text-gray-400">
  Texto secundario/metadatos
</span>

<span class="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">
  Etiquetas y labels
</span>
```

### 3. Spacing System
```css
@theme {
  /* Espaciado específico para PlanSport */
  --spacing-card-padding: 1.5rem;      /* 24px - Padding interno de cards */
  --spacing-section-gap: 2rem;         /* 32px - Separación entre secciones */
  --spacing-list-item: 0.75rem;        /* 12px - Separación items de lista */
  --spacing-button-group: 0.5rem;      /* 8px - Separación entre botones */
  --spacing-form-field: 1rem;          /* 16px - Separación campos de formulario */
}
```

## Dark Mode Implementation

### 1. Dark Mode Strategy
```typescript
// theme.service.ts
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private isDark = signal(false);
  
  isDarkMode = this.isDark.asReadonly();
  
  constructor() {
    // Detectar preferencia del sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    this.isDark.set(savedTheme === 'dark' || (!savedTheme && prefersDark));
    this.applyTheme();
  }
  
  toggleTheme(): void {
    this.isDark.update(isDark => !isDark);
    this.applyTheme();
    localStorage.setItem('theme', this.isDark() ? 'dark' : 'light');
  }
  
  private applyTheme(): void {
    if (this.isDark()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
```

### 2. Dark Mode Component Patterns
```html
<!-- Toggle de tema -->
<button (click)="themeService.toggleTheme()"
        class="p-2 rounded-md transition-colors duration-200
               bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600
               text-gray-700 dark:text-gray-200">
  @if (themeService.isDarkMode()) {
    <heroicon name="sun" class="h-5 w-5"></heroicon>
  } @else {
    <heroicon name="moon" class="h-5 w-5"></heroicon>
  }
</button>

<!-- Card con soporte dark mode -->
<div class="bg-white dark:bg-gray-800 
            border border-gray-200 dark:border-gray-700
            shadow-md dark:shadow-gray-900/20
            rounded-lg overflow-hidden">
  <div class="p-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
      Título del Card
    </h3>
    <p class="text-gray-600 dark:text-gray-300 mt-2">
      Contenido que se adapta automáticamente al tema.
    </p>
  </div>
</div>
```

## Performance Optimization

### 1. CSS Purging and Tree Shaking
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{html,ts}',
    './src/**/*.component.html'
  ],
  safelist: [
    // Clases dinámicas que no se detectan automáticamente
    'bg-victory',
    'bg-defeat',
    'text-training',
    {
      pattern: /grid-cols-(1|2|3|4|5|6)/,
      variants: ['sm', 'md', 'lg', 'xl']
    }
  ]
};
```

### 2. Component @apply Patterns
```css
/* Solo para componentes complejos reutilizables */
@layer components {
  .sport-card {
    @apply bg-white dark:bg-gray-800 rounded-lg shadow-md 
           border border-gray-200 dark:border-gray-700
           overflow-hidden transition-shadow duration-200
           hover:shadow-lg;
  }
  
  .sport-button-primary {
    @apply bg-sport-primary hover:bg-sport-primary/90 
           text-white font-medium py-2 px-4 rounded-md
           transition-colors duration-200
           focus:outline-none focus:ring-2 focus:ring-sport-primary/50
           disabled:opacity-50 disabled:cursor-not-allowed;
  }
  
  .sport-input {
    @apply w-full px-3 py-2 border border-gray-300 dark:border-gray-600
           rounded-md shadow-sm bg-white dark:bg-gray-800
           text-gray-900 dark:text-white
           placeholder-gray-500 dark:placeholder-gray-400
           focus:outline-none focus:ring-2 focus:ring-sport-primary/50
           focus:border-sport-primary dark:focus:border-sport-primary;
  }
}
```

### 3. Critical CSS Loading
```html
<!-- En index.html - CSS crítico inline -->
<style>
  /* CSS crítico para above-the-fold */
  .loading-spinner {
    @apply animate-spin rounded-full h-8 w-8 border-b-2 border-sport-primary;
  }
</style>
```

## Angular Integration Best Practices

### 1. Signal-Based Reactive Styling
```typescript
@Component({
  selector: 'app-team-status',
  template: `
    <div [class]="cardClasses()">
      <div [class]="statusClasses()">
        {{ team().status }}
      </div>
    </div>
  `
})
export class TeamStatusComponent {
  team = input.required<Team>();
  
  cardClasses = computed(() => {
    const base = 'p-4 rounded-lg border transition-colors duration-200';
    const status = this.team().status;
    
    return `${base} ${this.getStatusClasses(status)}`;
  });
  
  statusClasses = computed(() => {
    const status = this.team().status;
    return {
      'active': 'bg-victory/10 border-victory text-victory',
      'inactive': 'bg-gray-100 dark:bg-gray-800 border-gray-300 text-gray-600',
      'training': 'bg-training/10 border-training text-training'
    }[status] || 'bg-gray-100 border-gray-300 text-gray-600';
  });
  
  private getStatusClasses(status: string): string {
    const statusMap = {
      'active': 'bg-victory/10 border-victory',
      'inactive': 'bg-gray-100 dark:bg-gray-800 border-gray-300',
      'training': 'bg-training/10 border-training'
    };
    return statusMap[status] || statusMap['inactive'];
  }
}
```

### 2. Conditional Class Binding
```typescript
@Component({
  template: `
    <button 
      [class.bg-sport-primary]="!isDisabled()"
      [class.bg-gray-400]="isDisabled()"
      [class.cursor-not-allowed]="isDisabled()"
      [class.hover:bg-sport-primary/90]="!isDisabled()"
      class="px-4 py-2 rounded-md text-white font-medium transition-colors">
      {{ buttonText() }}
    </button>
  `
})
export class ActionButtonComponent {
  isDisabled = input(false);
  buttonText = input.required<string>();
}
```

### 3. Host Element Styling
```typescript
@Component({
  selector: 'app-modal',
  host: {
    'class': 'fixed inset-0 z-50 flex items-center justify-center',
    '[class.bg-black/50]': 'isOpen()',
    '[class.pointer-events-none]': '!isOpen()',
    '(click)': 'onBackdropClick($event)'
  },
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4
                transform transition-all duration-200"
         [class.scale-100]="isOpen()"
         [class.scale-95]="!isOpen()"
         [class.opacity-100]="isOpen()"
         [class.opacity-0]="!isOpen()">
      <ng-content></ng-content>
    </div>
  `
})
export class ModalComponent {
  isOpen = input(false);
  
  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      // Cerrar modal
    }
  }
}
```

## Spanish Sports App UI Patterns

### 1. Team Management Interface
```html
<div class="space-y-6">
  <!-- Header de gestión de equipos -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        Gestión de Equipos
      </h1>
      <p class="text-gray-600 dark:text-gray-400">
        Administra tus equipos y jugadores
      </p>
    </div>
    
    <button class="sport-button-primary">
      <heroicon name="plus" class="h-5 w-5 mr-2"></heroicon>
      Nuevo Equipo
    </button>
  </div>
  
  <!-- Grid de equipos -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    @for (team of teams(); track team.id) {
      <div class="sport-card group">
        <div class="aspect-video bg-gradient-to-br from-sport-primary to-sport-secondary 
                    rounded-t-lg flex items-center justify-center">
          <span class="text-2xl font-bold text-white">
            {{ team.initials }}
          </span>
        </div>
        
        <div class="p-4">
          <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-sport-primary transition-colors">
            {{ team.name }}
          </h3>
          
          <div class="flex items-center justify-between mt-3 text-sm text-gray-500 dark:text-gray-400">
            <span>{{ team.players.length }} jugadores</span>
            <span>{{ team.category }}</span>
          </div>
          
          <div class="flex gap-2 mt-4">
            <button class="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 
                           text-gray-700 dark:text-gray-300 py-2 px-3 rounded text-sm font-medium transition-colors">
              Ver Detalles
            </button>
            <button class="px-3 py-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <heroicon name="ellipsis-horizontal" class="h-5 w-5"></heroicon>
            </button>
          </div>
        </div>
      </div>
    }
  </div>
</div>
```

### 2. Exercise Planning Calendar
```html
<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
  <!-- Header del calendario -->
  <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
    <div class="flex items-center space-x-4">
      <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
        <heroicon name="chevron-left" class="h-5 w-5 text-gray-600 dark:text-gray-400"></heroicon>
      </button>
      
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ currentMonth() }} {{ currentYear() }}
      </h2>
      
      <button class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
        <heroicon name="chevron-right" class="h-5 w-5 text-gray-600 dark:text-gray-400"></heroicon>
      </button>
    </div>
    
    <div class="flex items-center space-x-2">
      <select class="sport-input text-sm">
        <option>Todos los equipos</option>
        <option>Equipo A</option>
        <option>Equipo B</option>
      </select>
      
      <button class="sport-button-primary text-sm">
        <heroicon name="plus" class="h-4 w-4 mr-1"></heroicon>
        Sesión
      </button>
    </div>
  </div>
  
  <!-- Grid del calendario -->
  <div class="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
    @for (day of weekDays; track day) {
      <div class="bg-gray-50 dark:bg-gray-800 px-3 py-2 text-center">
        <span class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
          {{ day }}
        </span>
      </div>
    }
    
    @for (date of calendarDates(); track date.day) {
      <div class="bg-white dark:bg-gray-800 min-h-[120px] p-2
                  hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
           [class.bg-gray-50]="!date.isCurrentMonth"
           [class.dark:bg-gray-700]="!date.isCurrentMonth">
        
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium"
                [class.text-gray-400]="!date.isCurrentMonth"
                [class.text-sport-primary]="date.isToday"
                [class.text-gray-900]="date.isCurrentMonth && !date.isToday"
                [class.dark:text-white]="date.isCurrentMonth && !date.isToday">
            {{ date.day }}
          </span>
          
          @if (date.hasEvents) {
            <div class="w-2 h-2 bg-sport-primary rounded-full"></div>
          }
        </div>
        
        <div class="space-y-1">
          @for (session of date.sessions; track session.id) {
            <div class="px-2 py-1 text-xs rounded text-white truncate"
                 [class]="getSessionTypeClass(session.type)">
              {{ session.title }}
            </div>
          }
        </div>
      </div>
    }
  </div>
</div>
```

### 3. Marketplace Product Grid
```html
<div class="space-y-6">
  <!-- Filtros -->
  <div class="flex flex-col sm:flex-row gap-4">
    <div class="flex-1">
      <input type="search" 
             placeholder="Buscar productos deportivos..."
             class="sport-input">
    </div>
    
    <div class="flex gap-3">
      <select class="sport-input min-w-[140px]">
        <option>Todas las categorías</option>
        <option>Equipamiento</option>
        <option>Vestuario</option>
        <option>Accesorios</option>
      </select>
      
      <select class="sport-input min-w-[120px]">
        <option>Precio</option>
        <option>Menor a mayor</option>
        <option>Mayor a menor</option>
      </select>
    </div>
  </div>
  
  <!-- Grid de productos -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
    @for (product of products(); track product.id) {
      <div class="sport-card group">
        <div class="aspect-square bg-gray-100 dark:bg-gray-700 rounded-t-lg overflow-hidden">
          <img [src]="product.image" 
               [alt]="product.name"
               class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
        </div>
        
        <div class="p-4">
          <div class="flex items-start justify-between mb-2">
            <h3 class="font-medium text-gray-900 dark:text-white text-sm leading-tight">
              {{ product.name }}
            </h3>
            
            @if (product.discount > 0) {
              <span class="bg-sport-accent text-white text-xs px-2 py-1 rounded-full ml-2 shrink-0">
                -{{ product.discount }}%
              </span>
            }
          </div>
          
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {{ product.brand }}
          </p>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              @if (product.originalPrice !== product.price) {
                <span class="text-sm text-gray-400 line-through">
                  {{ product.originalPrice | currency:'EUR':'symbol':'1.0-0' }}
                </span>
              }
              <span class="font-bold text-lg text-gray-900 dark:text-white">
                {{ product.price | currency:'EUR':'symbol':'1.0-0' }}
              </span>
            </div>
            
            <div class="flex items-center space-x-1">
              <heroicon name="star" class="h-4 w-4 text-yellow-400 fill-current"></heroicon>
              <span class="text-sm text-gray-600 dark:text-gray-400">
                {{ product.rating }}
              </span>
            </div>
          </div>
          
          <button class="w-full mt-4 sport-button-primary text-sm">
            Añadir al Carrito
          </button>
        </div>
      </div>
    }
  </div>
</div>
```

## Animation and Transitions

### 1. Performance-First Animations
```css
/* Animaciones optimizadas para rendimiento */
@layer utilities {
  .animate-fade-in {
    animation: fadeIn 0.2s ease-out forwards;
  }
  
  .animate-slide-up {
    animation: slideUp 0.3s ease-out forwards;
  }
  
  .animate-scale-in {
    animation: scaleIn 0.2s ease-out forwards;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0; 
    transform: translateY(1rem); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

@keyframes scaleIn {
  from { 
    opacity: 0; 
    transform: scale(0.95); 
  }
  to { 
    opacity: 1; 
    transform: scale(1); 
  }
}
```

### 2. Micro-interactions
```html
<!-- Botones con micro-interacciones -->
<button class="sport-button-primary 
               transform hover:scale-105 active:scale-95
               hover:shadow-lg transition-all duration-150">
  Guardar Cambios
</button>

<!-- Cards con hover efectos -->
<div class="sport-card 
            transform hover:-translate-y-1 hover:shadow-xl
            transition-all duration-200">
  <!-- Contenido del card -->
</div>

<!-- Inputs con focus efectos -->
<input class="sport-input 
              focus:scale-105 focus:shadow-md
              transition-all duration-200">
```

## Accessibility Guidelines

### 1. Focus Management
```html
<!-- Focus visible para navegación por teclado -->
<button class="sport-button-primary 
               focus:outline-none focus:ring-4 focus:ring-sport-primary/25
               focus:border-sport-primary">
  Botón Accesible
</button>

<!-- Skip links -->
<a href="#main-content" 
   class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
          bg-sport-primary text-white px-4 py-2 rounded-md z-50">
  Saltar al contenido principal
</a>
```

### 2. Screen Reader Support
```html
<!-- Labels y descripciones apropiadas -->
<div class="relative">
  <label for="team-search" class="sr-only">
    Buscar equipos
  </label>
  <input id="team-search" 
         type="search"
         placeholder="Buscar equipos..."
         aria-describedby="search-help"
         class="sport-input">
  
  <div id="search-help" class="sr-only">
    Escribe para buscar equipos por nombre o categoría
  </div>
</div>

<!-- Estados de carga accesibles -->
<div [attr.aria-live]="isLoading() ? 'polite' : null"
     [attr.aria-busy]="isLoading()">
  @if (isLoading()) {
    <span class="sr-only">Cargando datos...</span>
    <div class="loading-spinner" aria-hidden="true"></div>
  }
</div>
```

## Common Anti-Patterns to Avoid

### ❌ Avoid
```html
<!-- Demasiadas clases inline -->
<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 space-y-4">

<!-- Uso innecesario de !important -->
<div class="!bg-red-500 !text-white">

<!-- Mezclar CSS personalizado con Tailwind -->
<div class="custom-style bg-blue-500">
```

### ✅ Prefer
```html
<!-- Usar @apply para componentes complejos -->
<div class="sport-card">

<!-- Clases condicionales con signals -->
<div [class]="cardClasses()">

<!-- Mantener especificidad de Tailwind -->
<div class="bg-red-500 text-white">
```

## File Organization

```
src/
├── styles/
│   ├── tailwind.config.js
│   ├── app.css                    # Configuración base y theme
│   └── components.css             # @apply para componentes complejos
├── app/
│   ├── shared/
│   │   └── components/
│   │       ├── ui/                # Componentes base con Tailwind
│   │       └── sport/             # Componentes específicos deportivos
│   └── features/
│       ├── teams/
│       ├── planning/
│       └── marketplace/
```

Este estilo guide asegura consistencia, rendimiento y mantenibilidad en toda la aplicación PlanSport, aprovechando al máximo las capacidades de Tailwind CSS 4 con Angular 20.