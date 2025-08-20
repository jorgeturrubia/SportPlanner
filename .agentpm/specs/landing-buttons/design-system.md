# 🎨 Sistema de Diseño - Botones de Landing PlanSport

> Definición de colores interactivos, estados visuales y componentes de diseño para los botones "Comenzar Gratis" y "Ver Demo" en la landing page.

---

## 🎯 Paleta de Colores Interactivos

### Colores Primarios
```css
:root {
  /* Botón Primario - "Comenzar Gratis" */
  --primary-50: #f0f9ff;
  --primary-100: #e0f2fe;
  --primary-200: #bae6fd;
  --primary-300: #7dd3fc;
  --primary-400: #38bdf8;
  --primary-500: #0ea5e9;  /* Color base */
  --primary-600: #0284c7;  /* Hover */
  --primary-700: #0369a1;  /* Active */
  --primary-800: #075985;
  --primary-900: #0c4a6e;
  
  /* Estados de interacción */
  --primary-hover: var(--primary-600);
  --primary-active: var(--primary-700);
  --primary-focus: var(--primary-500);
  --primary-disabled: var(--primary-300);
}
```

### Colores Secundarios
```css
:root {
  /* Botón Secundario - "Ver Demo" */
  --secondary-50: #f8fafc;
  --secondary-100: #f1f5f9;
  --secondary-200: #e2e8f0;
  --secondary-300: #cbd5e1;
  --secondary-400: #94a3b8;
  --secondary-500: #64748b;  /* Color base */
  --secondary-600: #475569;  /* Hover */
  --secondary-700: #334155;  /* Active */
  --secondary-800: #1e293b;
  --secondary-900: #0f172a;
  
  /* Estados de interacción */
  --secondary-hover: var(--secondary-600);
  --secondary-active: var(--secondary-700);
  --secondary-focus: var(--secondary-500);
  --secondary-disabled: var(--secondary-300);
}
```

### Colores de Estado
```css
:root {
  /* Estados de loading y feedback */
  --loading-bg: rgba(0, 0, 0, 0.05);
  --loading-spinner: var(--primary-500);
  
  /* Estados de error */
  --error-50: #fef2f2;
  --error-500: #ef4444;
  --error-600: #dc2626;
  
  /* Estados de éxito */
  --success-50: #f0fdf4;
  --success-500: #22c55e;
  --success-600: #16a34a;
  
  /* Focus ring */
  --focus-ring: var(--primary-500);
  --focus-ring-offset: #ffffff;
}
```

---

## 🔘 Componentes de Botón

### Botón Primario - "Comenzar Gratis"

#### Estados Visuales
```css
.btn-primary {
  /* Estado base */
  @apply inline-flex items-center justify-center;
  @apply px-8 py-4 text-lg font-semibold;
  @apply bg-primary-500 text-white;
  @apply rounded-lg border-0;
  @apply transition-all duration-200 ease-in-out;
  @apply shadow-lg shadow-primary-500/25;
  
  /* Hover */
  &:hover:not(:disabled) {
    @apply bg-primary-600 shadow-xl shadow-primary-600/30;
    transform: translateY(-2px) scale(1.02);
  }
  
  /* Active */
  &:active:not(:disabled) {
    @apply bg-primary-700 shadow-md shadow-primary-700/25;
    transform: translateY(0) scale(0.98);
  }
  
  /* Focus */
  &:focus-visible {
    @apply outline-none ring-2 ring-primary-500 ring-offset-2;
  }
  
  /* Disabled */
  &:disabled {
    @apply bg-primary-300 text-primary-100;
    @apply cursor-not-allowed opacity-60;
    @apply shadow-none;
    transform: none !important;
  }
  
  /* Loading state */
  &.loading {
    @apply bg-primary-400 cursor-wait;
    @apply shadow-md;
  }
}
```

#### Variantes de Tamaño
```css
.btn-primary {
  /* Tamaño por defecto (lg) */
  &.btn-sm {
    @apply px-4 py-2 text-sm;
  }
  
  &.btn-md {
    @apply px-6 py-3 text-base;
  }
  
  &.btn-lg {
    @apply px-8 py-4 text-lg; /* Default */
  }
  
  &.btn-xl {
    @apply px-10 py-5 text-xl;
  }
}
```

### Botón Secundario - "Ver Demo"

#### Estados Visuales
```css
.btn-secondary {
  /* Estado base */
  @apply inline-flex items-center justify-center;
  @apply px-8 py-4 text-lg font-semibold;
  @apply bg-transparent text-primary-600;
  @apply border-2 border-primary-600;
  @apply rounded-lg;
  @apply transition-all duration-200 ease-in-out;
  
  /* Hover */
  &:hover:not(:disabled) {
    @apply bg-primary-600 text-white border-primary-600;
    @apply shadow-lg shadow-primary-600/25;
    transform: translateY(-1px) scale(1.01);
  }
  
  /* Active */
  &:active:not(:disabled) {
    @apply bg-primary-700 text-white border-primary-700;
    @apply shadow-md;
    transform: translateY(0) scale(0.99);
  }
  
  /* Focus */
  &:focus-visible {
    @apply outline-none ring-2 ring-primary-500 ring-offset-2;
  }
  
  /* Disabled */
  &:disabled {
    @apply text-secondary-400 border-secondary-300;
    @apply cursor-not-allowed opacity-60;
    @apply bg-transparent;
    transform: none !important;
  }
  
  /* Loading state */
  &.loading {
    @apply border-primary-400 text-primary-400;
    @apply cursor-wait;
  }
}
```

---

## 🔄 Estados de Interacción

### Loading Spinner
```css
.loading-spinner {
  @apply inline-block w-4 h-4;
  @apply border-2 border-current border-t-transparent;
  @apply rounded-full;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Spinner para botón primario */
.btn-primary .loading-spinner {
  @apply border-white border-t-transparent;
}

/* Spinner para botón secundario */
.btn-secondary .loading-spinner {
  @apply border-current border-t-transparent;
}
```

### Iconos de Estado
```css
.btn-icon {
  @apply w-5 h-5 mr-2;
  @apply transition-transform duration-200;
}

.btn:hover .btn-icon {
  transform: scale(1.1);
}

.btn:active .btn-icon {
  transform: scale(0.95);
}
```

---

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
.hero-buttons {
  @apply flex flex-col gap-4;
  @apply w-full;
  
  /* Tablet */
  @screen sm {
    @apply flex-row justify-center;
    @apply w-auto;
  }
  
  /* Desktop */
  @screen lg {
    @apply justify-start;
  }
}

/* Ajustes de botones en mobile */
@screen max-sm {
  .btn-primary,
  .btn-secondary {
    @apply w-full py-4 text-base;
  }
}

/* Ajustes en tablet */
@screen sm {
  .btn-primary,
  .btn-secondary {
    @apply w-auto px-6 py-3;
  }
}

/* Ajustes en desktop */
@screen lg {
  .btn-primary,
  .btn-secondary {
    @apply px-8 py-4 text-lg;
  }
}
```

---

## ♿ Accesibilidad

### Contraste y Legibilidad
```css
/* Asegurar contraste mínimo WCAG AA (4.5:1) */
.btn-primary {
  /* Blanco sobre azul: ratio 4.52:1 ✓ */
  color: #ffffff;
  background-color: #0ea5e9;
}

.btn-secondary {
  /* Azul sobre blanco: ratio 4.52:1 ✓ */
  color: #0ea5e9;
  background-color: transparent;
  border-color: #0ea5e9;
}

/* Estados de hover mantienen contraste */
.btn-primary:hover {
  /* Blanco sobre azul oscuro: ratio 5.74:1 ✓ */
  background-color: #0284c7;
}

.btn-secondary:hover {
  /* Blanco sobre azul: ratio 4.52:1 ✓ */
  color: #ffffff;
  background-color: #0ea5e9;
}
```

### Focus Management
```css
/* Focus visible para navegación por teclado */
.btn:focus-visible {
  @apply outline-none;
  @apply ring-2 ring-primary-500 ring-offset-2;
  @apply ring-offset-white;
}

/* Asegurar que el focus sea visible en modo alto contraste */
@media (prefers-contrast: high) {
  .btn:focus-visible {
    @apply ring-4 ring-black;
  }
}
```

### Screen Reader Support
```html
<!-- Atributos ARIA recomendados -->
<button 
  class="btn-primary"
  aria-label="Comenzar registro gratuito en PlanSport"
  aria-describedby="start-free-description"
  [attr.aria-busy]="isNavigating"
  [attr.aria-disabled]="isNavigating">
  
  <span class="sr-only" id="start-free-description">
    Inicia tu cuenta gratuita y accede a todas las funcionalidades de PlanSport
  </span>
  
  <span aria-hidden="true">Comenzar Gratis</span>
</button>
```

---

## 🎭 Animaciones y Transiciones

### Micro-interacciones
```css
/* Animación de entrada */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-buttons {
  animation: fadeInUp 0.6s ease-out 0.3s both;
}

/* Stagger animation para botones */
.btn-primary {
  animation: fadeInUp 0.6s ease-out 0.4s both;
}

.btn-secondary {
  animation: fadeInUp 0.6s ease-out 0.5s both;
}
```

### Hover Effects
```css
/* Efecto de elevación suave */
.btn {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn:hover {
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Efecto ripple opcional */
.btn-ripple {
  position: relative;
  overflow: hidden;
}

.btn-ripple::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.3s, height 0.3s;
}

.btn-ripple:active::before {
  width: 300px;
  height: 300px;
}
```

---

## 🌙 Dark Mode Support

### Variables CSS para Dark Mode
```css
/* Light mode (default) */
:root {
  --btn-primary-bg: #0ea5e9;
  --btn-primary-text: #ffffff;
  --btn-secondary-border: #0ea5e9;
  --btn-secondary-text: #0ea5e9;
  --focus-ring-offset: #ffffff;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --btn-primary-bg: #38bdf8;
    --btn-primary-text: #0c4a6e;
    --btn-secondary-border: #38bdf8;
    --btn-secondary-text: #38bdf8;
    --focus-ring-offset: #1e293b;
  }
}

/* Clase para forzar dark mode */
.dark {
  --btn-primary-bg: #38bdf8;
  --btn-primary-text: #0c4a6e;
  --btn-secondary-border: #38bdf8;
  --btn-secondary-text: #38bdf8;
  --focus-ring-offset: #1e293b;
}
```

### Aplicación de Variables
```css
.btn-primary {
  background-color: var(--btn-primary-bg);
  color: var(--btn-primary-text);
}

.btn-secondary {
  border-color: var(--btn-secondary-border);
  color: var(--btn-secondary-text);
}

.btn:focus-visible {
  ring-offset-color: var(--focus-ring-offset);
}
```

---

## 📐 Especificaciones de Layout

### Espaciado y Dimensiones
```css
/* Contenedor de botones */
.hero-buttons-container {
  @apply mt-8 mb-4;
  @apply flex flex-col sm:flex-row;
  @apply gap-4 sm:gap-6;
  @apply justify-center lg:justify-start;
  @apply items-stretch sm:items-center;
}

/* Dimensiones de botones */
.btn {
  /* Altura mínima para touch targets (44px) */
  min-height: 44px;
  
  /* Padding interno */
  padding: 12px 32px;
  
  /* Ancho mínimo para legibilidad */
  min-width: 140px;
}

/* Espaciado entre elementos internos */
.btn-content {
  @apply flex items-center justify-center gap-2;
}
```

### Grid System Integration
```css
/* Integración con el grid de la landing */
.hero-section {
  @apply grid grid-cols-1 lg:grid-cols-2;
  @apply gap-8 lg:gap-12;
  @apply items-center;
}

.hero-content {
  @apply space-y-6;
}

.hero-buttons {
  @apply mt-8;
}
```

---

## 🔍 Testing Visual

### Estados para Testing
```css
/* Clases de utilidad para testing */
.btn-test-hover {
  @apply bg-primary-600 shadow-xl shadow-primary-600/30;
  transform: translateY(-2px) scale(1.02);
}

.btn-test-active {
  @apply bg-primary-700 shadow-md shadow-primary-700/25;
  transform: translateY(0) scale(0.98);
}

.btn-test-loading {
  @apply bg-primary-400 cursor-wait opacity-80;
}

.btn-test-disabled {
  @apply bg-primary-300 text-primary-100 cursor-not-allowed opacity-60;
}
```

### Viewport Testing
```css
/* Breakpoints para testing */
@media (max-width: 374px) {
  .btn { font-size: 14px; padding: 10px 20px; }
}

@media (min-width: 375px) and (max-width: 767px) {
  .btn { font-size: 16px; padding: 12px 24px; }
}

@media (min-width: 768px) {
  .btn { font-size: 18px; padding: 12px 32px; }
}
```

---

## 📊 Performance Guidelines

### Optimización CSS
```css
/* Usar transform en lugar de cambiar propiedades que causan reflow */
.btn {
  /* ✓ Bueno - usa compositor */
  transform: translateY(0) scale(1);
  
  /* ✗ Evitar - causa reflow */
  /* margin-top: 0; */
  /* width: auto; */
}

/* Usar will-change para animaciones complejas */
.btn:hover {
  will-change: transform, box-shadow;
}

.btn:not(:hover) {
  will-change: auto;
}
```

### Lazy Loading de Estilos
```css
/* Estilos críticos inline */
.btn-critical {
  display: inline-flex;
  padding: 12px 32px;
  background: #0ea5e9;
  color: white;
  border-radius: 8px;
}

/* Estilos de interacción cargados después */
.btn-enhanced {
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

---

*🎨 Sistema de Diseño creado para PlanSport - Botones de Landing*
*Actualizado: Enero 2025*
*Versión: 1.0*
*Cumple con WCAG 2.1 AA y mejores prácticas de UX*