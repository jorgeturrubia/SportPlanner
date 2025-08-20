# 🎨 Design System - Autenticación PlanSport

> Sistema de diseño completo para el módulo de autenticación con colores suaves, tipografía moderna y espaciado optimizado para desktop.

---

## 🌈 Paleta de Colores

### 🟢 Verde Principal (Soft Green Theme)

Nuestra paleta principal utiliza tonos verdes suaves que transmiten confianza, crecimiento y naturaleza deportiva.

```css
/* Escala de Verde Principal */
--color-primary-50: #f0fdf4;   /* Verde muy claro - Fondos sutiles */
--color-primary-100: #dcfce7;  /* Verde claro - Hover states */
--color-primary-200: #bbf7d0;  /* Verde suave - Bordes */
--color-primary-300: #86efac;  /* Verde medio claro - Iconos secundarios */
--color-primary-400: #4ade80;  /* Verde medio - Elementos interactivos */
--color-primary-500: #22c55e;  /* Verde base - Color principal */
--color-primary-600: #16a34a;  /* Verde intenso - Botones primarios */
--color-primary-700: #15803d;  /* Verde oscuro - Hover de botones */
--color-primary-800: #166534;  /* Verde muy oscuro - Estados activos */
--color-primary-900: #14532d;  /* Verde profundo - Texto sobre fondos claros */
```

### 🎯 Uso de Colores en Autenticación

| Elemento | Color | Uso |
|----------|-------|-----|
| **Botones Primarios** | `primary-600` | Login, Registro, Confirmar |
| **Botones Hover** | `primary-700` | Estados de interacción |
| **Enlaces** | `primary-600` | "¿Olvidaste tu contraseña?", "Crear cuenta" |
| **Iconos de Estado** | `primary-500` | Éxito, validación correcta |
| **Fondos Sutiles** | `primary-50` | Tarjetas, secciones destacadas |
| **Bordes** | `primary-200` | Inputs focus, divisores |

### 🎨 Colores Complementarios

```css
/* Escala de Grises */
--color-gray-50: #f9fafb;   /* Fondos muy claros */
--color-gray-100: #f3f4f6;  /* Fondos de cards */
--color-gray-200: #e5e7eb;  /* Bordes sutiles */
--color-gray-300: #d1d5db;  /* Bordes normales */
--color-gray-400: #9ca3af;  /* Placeholders */
--color-gray-500: #6b7280;  /* Texto secundario */
--color-gray-600: #4b5563;  /* Texto principal */
--color-gray-700: #374151;  /* Títulos */
--color-gray-800: #1f2937;  /* Texto enfático */
--color-gray-900: #111827;  /* Texto muy oscuro */

/* Colores de Estado */
--color-green-300: #86efac; /* Éxito suave */
--color-green-500: #22c55e; /* Éxito */
--color-yellow-400: #facc15; /* Advertencia */
--color-orange-500: #f97316; /* Alerta */
--color-red-500: #ef4444;   /* Error */
```

---

## 🔤 Tipografía

### 📱 Fuente Principal: Inter

**Inter** es una fuente sans-serif moderna diseñada específicamente para interfaces digitales, optimizada para legibilidad en pantallas.

```css
/* Configuración de Fuentes */
--font-display: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-body: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
```

### 📏 Escala Tipográfica

| Elemento | Tamaño | Peso | Uso en Autenticación |
|----------|--------|------|----------------------|
| **Hero Title** | `clamp(2.5rem, 5vw, 4rem)` | 700 | "Bienvenido a PlanSport" |
| **Section Title** | `clamp(2rem, 4vw, 3rem)` | 700 | "Iniciar Sesión", "Crear Cuenta" |
| **Card Title** | `1.5rem (24px)` | 600 | Títulos de formularios |
| **Body Large** | `1.125rem (18px)` | 400 | Texto descriptivo |
| **Body** | `1rem (16px)` | 400 | Labels, texto general |
| **Body Small** | `0.875rem (14px)` | 400 | Ayuda, validaciones |
| **Caption** | `0.75rem (12px)` | 500 | Términos, políticas |

### 🎯 Aplicación en Componentes de Autenticación

```css
/* Títulos de Formularios */
.auth-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-gray-800);
  line-height: 1.2;
}

/* Labels de Inputs */
.auth-label {
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-gray-700);
}

/* Texto de Ayuda */
.auth-help {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--color-gray-500);
}
```

---

## 📐 Espaciado y Layout

### 🎯 Sistema de Espaciado

Basado en múltiplos de 4px para consistencia visual y facilidad de implementación.

```css
/* Escala de Espaciado */
--spacing-0: 0;
--spacing-1: 0.25rem;  /* 4px */
--spacing-2: 0.5rem;   /* 8px */
--spacing-3: 0.75rem;  /* 12px */
--spacing-4: 1rem;     /* 16px */
--spacing-5: 1.25rem;  /* 20px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-8: 2rem;     /* 32px */
--spacing-10: 2.5rem;  /* 40px */
--spacing-12: 3rem;    /* 48px */
--spacing-16: 4rem;    /* 64px */
--spacing-20: 5rem;    /* 80px */
```

### 📱 Layout para Desktop (Optimizado)

| Elemento | Espaciado | Aplicación |
|----------|-----------|------------|
| **Padding de Cards** | `spacing-6` (24px) | Formularios de login/registro |
| **Margen entre Inputs** | `spacing-4` (16px) | Separación vertical |
| **Padding de Botones** | `spacing-2 spacing-4` | 8px vertical, 16px horizontal |
| **Margen de Secciones** | `spacing-12` (48px) | Entre secciones principales |
| **Gap de Grid** | `spacing-6` (24px) | Espaciado en layouts |

### 🏗️ Componentes de Layout

```css
/* Container Principal */
.auth-container {
  max-width: 28rem; /* 448px */
  margin: 0 auto;
  padding: var(--spacing-6);
}

/* Card de Autenticación */
.auth-card {
  background: white;
  border-radius: 0.75rem;
  padding: var(--spacing-8);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Espaciado de Formularios */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}
```

---

## 🎨 Componentes de UI

### 🔘 Botones

```css
/* Botón Primario */
.btn-primary {
  background-color: var(--color-primary-600);
  color: white;
  font-weight: 500;
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background-color: var(--color-primary-700);
  transform: translateY(-1px);
}

/* Botón Secundario */
.btn-secondary {
  background-color: white;
  color: var(--color-primary-600);
  font-weight: 500;
  padding: var(--spacing-2) var(--spacing-4);
  border: 1px solid var(--color-primary-600);
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: var(--color-primary-50);
}
```

### 📝 Inputs

```css
/* Input Base */
.auth-input {
  width: 100%;
  padding: var(--spacing-3) var(--spacing-4);
  border: 1px solid var(--color-gray-300);
  border-radius: 0.5rem;
  font-family: var(--font-body);
  font-size: 1rem;
  transition: all 0.2s ease;
}

.auth-input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

/* Estados de Validación */
.auth-input.error {
  border-color: var(--color-red-500);
}

.auth-input.success {
  border-color: var(--color-primary-500);
}
```

### 🏷️ Labels y Mensajes

```css
/* Label */
.auth-label {
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-gray-700);
  margin-bottom: var(--spacing-1);
}

/* Mensaje de Error */
.auth-error {
  font-size: 0.75rem;
  color: var(--color-red-500);
  margin-top: var(--spacing-1);
}

/* Mensaje de Éxito */
.auth-success {
  font-size: 0.75rem;
  color: var(--color-primary-600);
  margin-top: var(--spacing-1);
}
```

---

## 🎯 Estados y Animaciones

### ⚡ Transiciones

```css
/* Transiciones Base */
.transition-base {
  transition: all 0.2s ease;
}

.transition-colors {
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.transition-transform {
  transition: transform 0.2s ease;
}
```

### 🎭 Estados Interactivos

| Estado | Efecto | Aplicación |
|--------|--------|------------|
| **Hover** | `translateY(-1px)` | Botones principales |
| **Focus** | `box-shadow + border` | Inputs, botones |
| **Active** | `translateY(0)` | Botones presionados |
| **Loading** | `opacity: 0.7` | Estados de carga |
| **Disabled** | `opacity: 0.5` | Elementos deshabilitados |

---

## 📱 Responsive Design

### 🖥️ Breakpoints

```css
/* Mobile First Approach */
/* Base: 0px - 767px (Mobile) */
/* md: 768px+ (Tablet) */
/* lg: 1024px+ (Desktop) */
/* xl: 1280px+ (Large Desktop) */
```

### 📐 Adaptaciones para Autenticación

```css
/* Mobile */
.auth-container {
  padding: var(--spacing-4);
  max-width: 100%;
}

/* Desktop */
@media (min-width: 768px) {
  .auth-container {
    padding: var(--spacing-6);
    max-width: 28rem;
  }
  
  .auth-card {
    padding: var(--spacing-8);
  }
}
```

---

## ✅ Checklist de Implementación

### 🎨 Colores
- [x] Paleta verde suave implementada en Tailwind
- [x] Variables CSS definidas en `@theme`
- [x] Colores de estado configurados
- [x] Clases utilitarias generadas automáticamente

### 🔤 Tipografía
- [x] Fuente Inter importada desde Google Fonts
- [x] Variables de fuente configuradas
- [x] Escala tipográfica definida
- [x] Fallbacks de sistema configurados

### 📐 Espaciado
- [x] Sistema de espaciado basado en 4px
- [x] Variables de espaciado en Tailwind
- [x] Layout optimizado para desktop
- [x] Responsive design considerado

### 🎯 Componentes
- [ ] Botones de autenticación
- [ ] Inputs con validación
- [ ] Cards de formularios
- [ ] Mensajes de estado
- [ ] Loading states

---

## 🚀 Próximos Pasos

1. **Implementar Componentes**: Crear componentes Angular con el design system
2. **Validar Accesibilidad**: Verificar contraste y navegación por teclado
3. **Testing Visual**: Probar en diferentes dispositivos y navegadores
4. **Documentar Patrones**: Crear guía de uso para desarrolladores

---

*🎨 Design System creado para PlanSport - Módulo de Autenticación*
*Actualizado: Enero 2025*