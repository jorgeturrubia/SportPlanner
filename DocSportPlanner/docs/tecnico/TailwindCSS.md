# Tailwind CSS v4 - Guía de Estilos SportPlanner

**Última actualización:** Noviembre 2025  
**Versión:** Tailwind CSS 4.x  
**Proyecto:** SportPlanner Frontend

---

## 📋 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Configuración del Proyecto](#configuración-del-proyecto)
3. [Modo Light y Dark](#modo-light-y-dark)
4. [Componentización con Tailwind](#componentización-con-tailwind)
5. [Convenciones y Estándares](#convenciones-y-estándares)
6. [Ejemplos de Componentes](#ejemplos-de-componentes)
7. [Antipatrones a Evitar](#antipatrones-a-evitar)
8. [Checklist](#checklist)

---

## 🎯 Introducción

SportPlanner utiliza **Tailwind CSS v4** como framework de estilos oficial. Esta decisión arquitectónica busca:

- ✅ **Consistencia visual** en toda la aplicación
- ✅ **Velocidad de desarrollo** con utility classes
- ✅ **Mantenibilidad** con estilos predecibles y documentados
- ✅ **Dark mode nativo** con soporte first-class
- ✅ **Performance** con tree-shaking automático

### Reglas Fundamentales

1. **Tailwind ÚNICAMENTE** - No escribir CSS custom sin justificación
2. **Dark mode OBLIGATORIO** - Todos los componentes deben soportar ambos modos
3. **Componentización exhaustiva** - Reutilizar antes de duplicar
4. **Separación de archivos** - `.ts`, `.html`, `.scss` siempre separados

---

## ⚙️ Configuración del Proyecto

### Instalación

```bash
npm install -D tailwindcss@^4.0.0 postcss autoprefixer
npx tailwindcss init
```

### tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class', // Modo class-based para control manual
  theme: {
    extend: {
      colors: {
        // Colores personalizados SportPlanner
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',  // Color principal
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        success: {
          light: '#10b981',
          DEFAULT: '#059669',
          dark: '#047857',
        },
        warning: {
          light: '#f59e0b',
          DEFAULT: '#d97706',
          dark: '#b45309',
        },
        danger: {
          light: '#ef4444',
          DEFAULT: '#dc2626',
          dark: '#b91c1c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

### styles.css (Global)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Variables CSS para temas personalizados */
:root {
  --color-primary: 59 130 246; /* RGB de primary-500 */
  --color-background: 255 255 255;
  --color-foreground: 0 0 0;
}

.dark {
  --color-background: 17 24 39; /* gray-900 */
  --color-foreground: 255 255 255;
}

/* Utility classes custom (solo si es absolutamente necesario) */
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 
           dark:bg-primary-500 dark:hover:bg-primary-600 
           transition-colors duration-200 font-semibold;
  }
}
```

---

## 🌓 Modo Light y Dark

### Principio Fundamental

**TODOS los componentes deben verse bien en modo light Y dark.**

### Implementación

#### 1. Toggle de Dark Mode (Servicio)

```typescript
// src/core/services/theme.service.ts
import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal(false);

  constructor() {
    // Leer preferencia guardada o del sistema
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    this.isDarkMode.set(savedTheme === 'dark' || (!savedTheme && prefersDark));
    
    // Aplicar tema al DOM
    effect(() => {
      if (this.isDarkMode()) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    });
  }

  toggleTheme() {
    this.isDarkMode.update(dark => !dark);
  }
}
```

#### 2. Componente Toggle

```typescript
// shared/components/theme-toggle/theme-toggle.component.ts
import { Component, inject } from '@angular/core';
import { ThemeService } from '@core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  templateUrl: './theme-toggle.component.html',
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);
}
```

```html
<!-- theme-toggle.component.html -->
<button
  (click)="themeService.toggleTheme()"
  class="p-2 rounded-lg transition-colors
         bg-gray-200 hover:bg-gray-300 
         dark:bg-gray-700 dark:hover:bg-gray-600"
  [attr.aria-label]="themeService.isDarkMode() ? 'Switch to light mode' : 'Switch to dark mode'"
>
  @if (themeService.isDarkMode()) {
    <!-- Icon: Sun -->
    <svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
    </svg>
  } @else {
    <!-- Icon: Moon -->
    <svg class="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    </svg>
  }
</button>
```

#### 3. Patrón de Clases Dark

```html
<!-- ✅ CORRECTO: Siempre incluir variante dark: -->
<div class="bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100">
  <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Título</h1>
  <p class="text-gray-600 dark:text-gray-300">Descripción</p>
</div>

<!-- ❌ INCORRECTO: Sin variante dark -->
<div class="bg-white text-gray-900">
  <h1 class="text-2xl font-bold">Título</h1>
</div>
```

### Colores Recomendados

| Elemento | Light Mode | Dark Mode |
|----------|-----------|-----------|
| Background principal | `bg-white` | `dark:bg-gray-900` |
| Background secundario | `bg-gray-50` | `dark:bg-gray-800` |
| Texto primario | `text-gray-900` | `dark:text-white` |
| Texto secundario | `text-gray-600` | `dark:text-gray-300` |
| Bordes | `border-gray-200` | `dark:border-gray-700` |
| Hover background | `hover:bg-gray-100` | `dark:hover:bg-gray-700` |

---

## 🧩 Componentización con Tailwind

### Estrategia de Componentes Atómicos

SportPlanner sigue **Atomic Design** para componentes UI:

```
src/shared/components/
├── atoms/              # Componentes básicos
│   ├── button/
│   ├── input/
│   ├── badge/
│   ├── icon/
│   └── spinner/
├── molecules/          # Combinaciones simples
│   ├── form-field/
│   ├── card/
│   ├── dropdown/
│   └── search-bar/
└── organisms/          # Secciones completas
    ├── navbar/
    ├── sidebar/
    ├── data-table/
    └── modal/
```

### Ejemplo: Button Component

**button.component.ts**

```typescript
import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './button.component.html',
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled = false;
  @Input() fullWidth = false;
  @Input() loading = false;

  get classes(): string {
    const baseClasses = [
      'inline-flex items-center justify-center',
      'font-semibold rounded-lg transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ];

    const sizeClasses: Record<ButtonSize, string> = {
      xs: 'px-2.5 py-1.5 text-xs',
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-5 py-2.5 text-lg',
      xl: 'px-6 py-3 text-xl',
    };

    const variantClasses: Record<ButtonVariant, string> = {
      primary: [
        'bg-primary-600 text-white hover:bg-primary-700',
        'dark:bg-primary-500 dark:hover:bg-primary-600',
        'focus:ring-primary-500',
      ].join(' '),
      
      secondary: [
        'bg-gray-200 text-gray-900 hover:bg-gray-300',
        'dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
        'focus:ring-gray-500',
      ].join(' '),
      
      success: [
        'bg-green-600 text-white hover:bg-green-700',
        'dark:bg-green-500 dark:hover:bg-green-600',
        'focus:ring-green-500',
      ].join(' '),
      
      danger: [
        'bg-red-600 text-white hover:bg-red-700',
        'dark:bg-red-500 dark:hover:bg-red-600',
        'focus:ring-red-500',
      ].join(' '),
      
      ghost: [
        'bg-transparent text-gray-700 hover:bg-gray-100',
        'dark:text-gray-300 dark:hover:bg-gray-800',
        'focus:ring-gray-400',
      ].join(' '),
    };

    const widthClass = this.fullWidth ? 'w-full' : '';

    return [
      ...baseClasses,
      sizeClasses[this.size],
      variantClasses[this.variant],
      widthClass,
    ].filter(Boolean).join(' ');
  }
}
```

**button.component.html**

```html
<button
  [disabled]="disabled || loading"
  [class]="classes"
  type="button"
>
  @if (loading) {
    <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  }
  <ng-content></ng-content>
</button>
```

**Uso:**

```html
<!-- Diferentes variantes -->
<app-button variant="primary">Primary</app-button>
<app-button variant="secondary">Secondary</app-button>
<app-button variant="danger" size="sm">Delete</app-button>
<app-button variant="ghost" [disabled]="true">Disabled</app-button>
<app-button variant="primary" [loading]="true">Loading...</app-button>
```

---

## 📏 Convenciones y Estándares

### 1. Orden de Clases Tailwind

Seguir un orden consistente mejora la legibilidad:

```html
<!-- Orden recomendado: -->
<!-- 1. Layout (display, position, flex, grid) -->
<!-- 2. Box model (width, height, padding, margin) -->
<!-- 3. Typography (font, text) -->
<!-- 4. Visual (background, border, shadow) -->
<!-- 5. Misc (cursor, transition, transform) -->
<!-- 6. Responsive modifiers (sm:, md:, lg:) -->
<!-- 7. State modifiers (hover:, focus:, active:) -->
<!-- 8. Dark mode (dark:) -->

<div 
  class="
    flex items-center justify-between
    w-full p-4 mb-4
    text-lg font-semibold
    bg-white border border-gray-200 rounded-lg shadow-sm
    cursor-pointer transition-colors
    hover:bg-gray-50
    dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700
  "
>
  Content
</div>
```

### 2. Extracción de Clases Complejas

Para evitar templates con clases muy largas, usar computed properties:

```typescript
export class CardComponent {
  @Input() variant: 'default' | 'outlined' | 'elevated' = 'default';

  get cardClasses(): string {
    const base = 'rounded-lg p-6 transition-shadow';
    
    const variants = {
      default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
      outlined: 'bg-transparent border-2 border-primary-500',
      elevated: 'bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl',
    };

    return `${base} ${variants[this.variant]}`;
  }
}
```

```html
<div [class]="cardClasses">
  <ng-content></ng-content>
</div>
```

### 3. Uso de @apply (Moderado)

Solo usar `@apply` para componentes base muy reutilizados:

```scss
// button.component.scss
.btn-base {
  @apply px-4 py-2 rounded-lg font-semibold transition-colors duration-200;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-primary {
  @apply btn-base;
  @apply bg-primary-600 text-white hover:bg-primary-700;
  @apply dark:bg-primary-500 dark:hover:bg-primary-600;
  @apply focus:ring-primary-500;
}
```

**Nota:** Preferir utility classes en el template sobre `@apply` cuando sea posible.

### 4. Responsive Design

Mobile-first approach con breakpoints:

```html
<!-- Mobile por defecto, tablet y desktop con prefijos -->
<div class="
  grid grid-cols-1 gap-4
  sm:grid-cols-2 sm:gap-6
  md:grid-cols-3
  lg:grid-cols-4 lg:gap-8
  xl:grid-cols-6
">
  <!-- Content -->
</div>
```

**Breakpoints de Tailwind:**

| Prefijo | Min Width | Descripción |
|---------|-----------|-------------|
| `sm:` | 640px | Tablet pequeña |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Desktop |
| `xl:` | 1280px | Desktop grande |
| `2xl:` | 1536px | Desktop extra grande |

---

## 💡 Ejemplos de Componentes

### Card Component

```typescript
// card.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  templateUrl: './card.component.html',
})
export class CardComponent {
  @Input() elevated = false;
  @Input() padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
}
```

```html
<!-- card.component.html -->
<div [class]="[
  'rounded-lg border transition-shadow',
  'bg-white dark:bg-gray-800',
  'border-gray-200 dark:border-gray-700',
  elevated ? 'shadow-lg hover:shadow-xl' : 'shadow-sm',
  padding === 'none' ? '' : '',
  padding === 'sm' ? 'p-4' : '',
  padding === 'md' ? 'p-6' : '',
  padding === 'lg' ? 'p-8' : ''
].filter(Boolean).join(' ')">
  <ng-content></ng-content>
</div>
```

### Input Component

```typescript
// input.component.ts
import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  templateUrl: './input.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputComponent),
    multi: true
  }]
})
export class InputComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' = 'text';
  @Input() error?: string;
  @Input() disabled = false;

  value = '';
  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }
}
```

```html
<!-- input.component.html -->
<div class="w-full">
  @if (label) {
    <label class="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
      {{ label }}
    </label>
  }
  
  <input
    [type]="type"
    [value]="value"
    [placeholder]="placeholder"
    [disabled]="disabled"
    (input)="onInput($event)"
    (blur)="onTouched()"
    class="
      w-full px-4 py-2 rounded-lg border transition-colors
      bg-white dark:bg-gray-800
      border-gray-300 dark:border-gray-600
      text-gray-900 dark:text-white
      placeholder-gray-400 dark:placeholder-gray-500
      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
      disabled:opacity-50 disabled:cursor-not-allowed
    "
    [class.border-red-500]="error"
    [class.dark:border-red-400]="error"
  />
  
  @if (error) {
    <p class="mt-1 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </p>
  }
</div>
```

### Badge Component

```typescript
// badge.component.ts
import { Component, Input } from '@angular/core';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `
    <span [class]="classes">
      <ng-content></ng-content>
    </span>
  `,
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'default';
  @Input() size: BadgeSize = 'md';

  get classes(): string {
    const base = 'inline-flex items-center font-medium rounded-full';
    
    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-0.5 text-sm',
      lg: 'px-3 py-1 text-base',
    };

    const variants = {
      default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    };

    return `${base} ${sizes[this.size]} ${variants[this.variant]}`;
  }
}
```

---

## ❌ Antipatrones a Evitar

### 1. CSS Inline o Styles en .ts

```typescript
// ❌ MAL
@Component({
  template: `<div style="background: red;">Bad</div>`,
  styles: [`div { color: blue; }`]
})

// ✅ BIEN
@Component({
  templateUrl: './component.html', // Con clases Tailwind
  styleUrls: ['./component.scss']  // Vacío o solo @apply si es necesario
})
```

### 2. No Considerar Dark Mode

```html
<!-- ❌ MAL: Solo light mode -->
<div class="bg-white text-black border-gray-300">
  Content
</div>

<!-- ✅ BIEN: Ambos modos -->
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-700">
  Content
</div>
```

### 3. Hardcodear Colores

```html
<!-- ❌ MAL: Colores hardcodeados -->
<div class="bg-[#3b82f6] text-[#ffffff]">
  Content
</div>

<!-- ✅ BIEN: Usar palette de Tailwind -->
<div class="bg-primary-600 text-white dark:bg-primary-500">
  Content
</div>
```

### 4. Duplicar Componentes

```html
<!-- ❌ MAL: Duplicar código de botón en cada lugar -->
<button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700...">
  Submit
</button>

<!-- ✅ BIEN: Usar componente reutilizable -->
<app-button variant="primary">Submit</app-button>
```

### 5. Clases Desordenadas

```html
<!-- ❌ MAL: Sin orden -->
<div class="dark:bg-gray-800 text-white p-4 hover:bg-blue-600 bg-blue-500 rounded-lg flex">
  Content
</div>

<!-- ✅ BIEN: Orden lógico -->
<div class="flex p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-gray-800">
  Content
</div>
```

---

## ✅ Checklist

### Antes de Commit

- [ ] Todos los componentes usan Tailwind CSS v4
- [ ] CERO CSS custom sin justificación documentada
- [ ] Todos los componentes soportan modo light Y dark
- [ ] Probado en ambos modos (light/dark)
- [ ] Componentes reutilizables están en `shared/components/`
- [ ] No hay duplicación de estilos
- [ ] Archivos `.ts`, `.html`, `.scss` separados (NO inline)
- [ ] Responsive design implementado con breakpoints
- [ ] Clases ordenadas lógicamente
- [ ] No hay hardcodeo de colores (usar palette)
- [ ] Variables CSS usadas para temas si es necesario
- [ ] Documentación de componentes actualizada

### Revisión de Componente Reutilizable

- [ ] Props bien tipados con `@Input()`
- [ ] Valores por defecto sensatos
- [ ] Variantes documentadas (size, variant, etc.)
- [ ] Ejemplos en Storybook (si aplica)
- [ ] Tests unitarios cubriendo variantes principales
- [ ] Accesibilidad (aria-labels, keyboard navigation)
- [ ] Performance (ChangeDetection OnPush)

---

## 📚 Referencias

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/)
- [Tailwind CSS Dark Mode Guide](https://tailwindcss.com/docs/dark-mode)
- [Atomic Design Methodology](https://atomicdesign.bradfrost.com/)
- `front/AGENTS.md` - Guía completa de Angular y patrones

---

**Mantenido por:** Equipo SportPlanner  
**Última revisión:** Noviembre 2025
