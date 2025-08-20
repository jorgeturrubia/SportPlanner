# Plantilla para style.css - Design System

## Propósito
Esta plantilla genera automáticamente un archivo `style.css` o `globals.css` basado en las definiciones del `design-system.md` del spec correspondiente.

## Uso
1. **Leer design-system.md** del spec actual
2. **Extraer valores** definidos por el usuario
3. **Generar CSS** usando esta plantilla
4. **Validar** que todos los componentes usen estas variables

## Estructura del CSS Generado

### 1. Variables CSS Root
```css
:root {
  /* =================================== */
  /* COLORES - Basado en design-system.md */
  /* =================================== */
  
  /* Colores Principales */
  --color-primary: [VALOR_DEL_DESIGN_SYSTEM];
  --color-primary-light: [VARIANTE_CLARA_AUTO];
  --color-primary-dark: [VARIANTE_OSCURA_AUTO];
  
  --color-secondary: [VALOR_DEL_DESIGN_SYSTEM];
  --color-secondary-light: [VARIANTE_CLARA_AUTO];
  --color-secondary-dark: [VARIANTE_OSCURA_AUTO];
  
  /* Colores Semánticos */
  --color-success: #10b981;
  --color-success-light: #34d399;
  --color-success-dark: #059669;
  
  --color-warning: #f59e0b;
  --color-warning-light: #fbbf24;
  --color-warning-dark: #d97706;
  
  --color-error: #ef4444;
  --color-error-light: #f87171;
  --color-error-dark: #dc2626;
  
  --color-info: #3b82f6;
  --color-info-light: #60a5fa;
  --color-info-dark: #2563eb;
  
  /* Colores Neutros */
  --color-white: #ffffff;
  --color-black: #000000;
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;
  
  /* =================================== */
  /* TIPOGRAFÍA - Basado en design-system.md */
  /* =================================== */
  
  /* Familias de Fuentes */
  --font-primary: [FUENTE_DEFINIDA], -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-secondary: [FUENTE_SECUNDARIA_SI_EXISTE], Georgia, serif;
  --font-mono: 'Fira Code', 'Cascadia Code', Consolas, monospace;
  
  /* Pesos de Fuente */
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  /* Tamaños de Fuente */
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */
  --font-size-5xl: 3rem;      /* 48px */
  
  /* Line Heights */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  
  /* =================================== */
  /* ESPACIADO - Basado en design-system.md */
  /* =================================== */
  
  /* Unidad Base */
  --spacing-unit: [UNIDAD_BASE_DEFINIDA]px; /* 4px, 8px, o 16px según preferencia */
  
  /* Escala de Espaciado */
  --spacing-0: 0;
  --spacing-px: 1px;
  --spacing-0-5: calc(var(--spacing-unit) * 0.125); /* 0.5x */
  --spacing-1: calc(var(--spacing-unit) * 0.25);    /* 0.25x */
  --spacing-2: calc(var(--spacing-unit) * 0.5);     /* 0.5x */
  --spacing-3: calc(var(--spacing-unit) * 0.75);    /* 0.75x */
  --spacing-4: var(--spacing-unit);                 /* 1x */
  --spacing-5: calc(var(--spacing-unit) * 1.25);    /* 1.25x */
  --spacing-6: calc(var(--spacing-unit) * 1.5);     /* 1.5x */
  --spacing-8: calc(var(--spacing-unit) * 2);       /* 2x */
  --spacing-10: calc(var(--spacing-unit) * 2.5);    /* 2.5x */
  --spacing-12: calc(var(--spacing-unit) * 3);      /* 3x */
  --spacing-16: calc(var(--spacing-unit) * 4);      /* 4x */
  --spacing-20: calc(var(--spacing-unit) * 5);      /* 5x */
  --spacing-24: calc(var(--spacing-unit) * 6);      /* 6x */
  --spacing-32: calc(var(--spacing-unit) * 8);      /* 8x */
  --spacing-40: calc(var(--spacing-unit) * 10);     /* 10x */
  --spacing-48: calc(var(--spacing-unit) * 12);     /* 12x */
  --spacing-56: calc(var(--spacing-unit) * 14);     /* 14x */
  --spacing-64: calc(var(--spacing-unit) * 16);     /* 16x */
  
  /* =================================== */
  /* BREAKPOINTS - Responsive */
  /* =================================== */
  
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
  
  /* =================================== */
  /* SOMBRAS Y EFECTOS */
  /* =================================== */
  
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  
  /* Bordes */
  --border-radius-sm: 0.125rem;
  --border-radius: 0.25rem;
  --border-radius-md: 0.375rem;
  --border-radius-lg: 0.5rem;
  --border-radius-xl: 0.75rem;
  --border-radius-2xl: 1rem;
  --border-radius-full: 9999px;
  
  /* Transiciones */
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 250ms ease-in-out;
  --transition-slow: 350ms ease-in-out;
}
```

### 2. Reset y Base Styles
```css
/* =================================== */
/* RESET Y BASE STYLES */
/* =================================== */

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-family: var(--font-primary);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  color: var(--color-gray-900);
  background-color: var(--color-white);
}

body {
  min-height: 100vh;
  text-rendering: optimizeSpeed;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Elementos de texto */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-primary);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--color-gray-900);
}

h1 { font-size: var(--font-size-4xl); }
h2 { font-size: var(--font-size-3xl); }
h3 { font-size: var(--font-size-2xl); }
h4 { font-size: var(--font-size-xl); }
h5 { font-size: var(--font-size-lg); }
h6 { font-size: var(--font-size-base); }

p {
  margin-bottom: var(--spacing-4);
  color: var(--color-gray-700);
}

a {
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--transition-fast);
}

a:hover {
  color: var(--color-primary-dark);
}

code {
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  background-color: var(--color-gray-100);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-sm);
}
```

### 3. Clases Utilitarias
```css
/* =================================== */
/* CLASES UTILITARIAS */
/* =================================== */

/* Colores de texto */
.text-primary { color: var(--color-primary); }
.text-secondary { color: var(--color-secondary); }
.text-success { color: var(--color-success); }
.text-warning { color: var(--color-warning); }
.text-error { color: var(--color-error); }
.text-info { color: var(--color-info); }

/* Colores de fondo */
.bg-primary { background-color: var(--color-primary); }
.bg-secondary { background-color: var(--color-secondary); }
.bg-success { background-color: var(--color-success); }
.bg-warning { background-color: var(--color-warning); }
.bg-error { background-color: var(--color-error); }
.bg-info { background-color: var(--color-info); }

/* Espaciado */
.p-1 { padding: var(--spacing-1); }
.p-2 { padding: var(--spacing-2); }
.p-4 { padding: var(--spacing-4); }
.p-8 { padding: var(--spacing-8); }

.m-1 { margin: var(--spacing-1); }
.m-2 { margin: var(--spacing-2); }
.m-4 { margin: var(--spacing-4); }
.m-8 { margin: var(--spacing-8); }

/* Tipografía */
.font-primary { font-family: var(--font-primary); }
.font-secondary { font-family: var(--font-secondary); }
.font-mono { font-family: var(--font-mono); }

.text-xs { font-size: var(--font-size-xs); }
.text-sm { font-size: var(--font-size-sm); }
.text-base { font-size: var(--font-size-base); }
.text-lg { font-size: var(--font-size-lg); }
.text-xl { font-size: var(--font-size-xl); }

/* Sombras */
.shadow-sm { box-shadow: var(--shadow-sm); }
.shadow { box-shadow: var(--shadow); }
.shadow-md { box-shadow: var(--shadow-md); }
.shadow-lg { box-shadow: var(--shadow-lg); }

/* Bordes */
.rounded-sm { border-radius: var(--border-radius-sm); }
.rounded { border-radius: var(--border-radius); }
.rounded-md { border-radius: var(--border-radius-md); }
.rounded-lg { border-radius: var(--border-radius-lg); }
.rounded-full { border-radius: var(--border-radius-full); }
```

### 4. Componentes Base
```css
/* =================================== */
/* COMPONENTES BASE */
/* =================================== */

/* Botones */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3) var(--spacing-6);
  font-family: var(--font-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-decoration: none;
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
}

.btn-secondary {
  background-color: var(--color-secondary);
  color: var(--color-white);
}

.btn-outline {
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

/* Cards */
.card {
  background-color: var(--color-white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow);
  padding: var(--spacing-6);
}

/* Formularios */
.form-input {
  width: 100%;
  padding: var(--spacing-3);
  font-family: var(--font-primary);
  font-size: var(--font-size-base);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--border-radius);
  transition: border-color var(--transition-fast);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgb(var(--color-primary) / 0.1);
}

.form-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray-700);
  margin-bottom: var(--spacing-2);
}
```

### 5. Responsive Design
```css
/* =================================== */
/* RESPONSIVE DESIGN */
/* =================================== */

/* Mobile First Approach */
@media (min-width: 640px) {
  /* sm: breakpoint */
  .sm\:text-lg { font-size: var(--font-size-lg); }
  .sm\:p-6 { padding: var(--spacing-6); }
}

@media (min-width: 768px) {
  /* md: breakpoint */
  .md\:text-xl { font-size: var(--font-size-xl); }
  .md\:p-8 { padding: var(--spacing-8); }
}

@media (min-width: 1024px) {
  /* lg: breakpoint */
  .lg\:text-2xl { font-size: var(--font-size-2xl); }
  .lg\:p-12 { padding: var(--spacing-12); }
}
```

## Instrucciones de Implementación

### Para el Agente de Programación:

1. **SIEMPRE leer design-system.md** antes de crear CSS
2. **Reemplazar valores placeholder** con los definidos por el usuario:
   - `[VALOR_DEL_DESIGN_SYSTEM]` → color hex real
   - `[FUENTE_DEFINIDA]` → nombre de fuente real
   - `[UNIDAD_BASE_DEFINIDA]` → 4, 8, o 16 según preferencia

3. **Generar variantes automáticas** de colores:
   - Light: aumentar luminosidad 20%
   - Dark: reducir luminosidad 20%

4. **Validar uso** en todos los componentes:
   - ❌ `color: #3b82f6;` (hardcoded)
   - ✅ `color: var(--color-primary);` (variable)

5. **Crear archivo** como `styles/globals.css` o `src/styles/style.css`

### Checklist de Validación:
- [ ] Todas las variables CSS están definidas
- [ ] Los valores coinciden con design-system.md
- [ ] No hay colores hardcodeados en componentes
- [ ] Las fuentes están correctamente definidas
- [ ] El sistema de espaciado es coherente
- [ ] Los componentes usan las variables CSS
- [ ] El responsive design funciona correctamente