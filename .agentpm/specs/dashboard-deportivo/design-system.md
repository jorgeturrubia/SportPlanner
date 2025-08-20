# Design System - Dashboard Deportivo PlanSport

## Sistema de Diseño Existente

Basado en el análisis del proyecto, ya tienes un sistema de diseño establecido con tema verde suave y profesional.

## Paleta de Colores Definida

### **Color Primario: Verde Suave (#22c55e)**
- **Primario 50:** #f0fdf4 (muy claro)
- **Primario 100:** #dcfce7
- **Primario 200:** #bbf7d0
- **Primario 300:** #86efac
- **Primario 400:** #4ade80
- **Primario 500:** #22c55e (base)
- **Primario 600:** #16a34a (hover states)
- **Primario 700:** #15803d (active states)
- **Primario 800:** #166534
- **Primario 900:** #14532d (muy oscuro)

### **Colores Semánticos**
- **Success:** #22c55e (verde primario)
- **Warning:** #facc15 (amarillo)
- **Error:** #f97316 (naranja)
- **Info:** #22c55e (verde primario)

### **Escala de Grises**
- **Gray 50:** #f9fafb
- **Gray 100:** #f3f4f6
- **Gray 200:** #e5e7eb
- **Gray 300:** #d1d5db
- **Gray 400:** #9ca3af
- **Gray 500:** #6b7280
- **Gray 600:** #4b5563
- **Gray 700:** #374151
- **Gray 800:** #1f2937
- **Gray 900:** #111827

## Tipografía Seleccionada

### **Fuente Principal: Inter**
- **Display:** 'Inter', system-ui, sans-serif
- **Body:** 'Inter', system-ui, sans-serif
- **Mono:** 'JetBrains Mono', 'Fira Code', Consolas
- **Personalidad:** Profesional y moderna

### **Escalas Tipográficas**
- **Hero:** clamp(2.5rem, 5vw, 4rem)
- **Section Title:** clamp(2rem, 4vw, 3rem)

## Sistema de Espaciado

### **Base: 4px (0.25rem)**
- **Enfoque:** Espacioso y limpio
- **Escala:** 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64, 72, 80, 96

### **Espaciado Específico**
- **Header Height:** 4rem (64px)
- **Footer Height:** 12rem (192px)
- **Section Padding:** 5rem desktop, 3rem mobile

## Tema Oscuro - Extensión Necesaria

### **Variables CSS para Dark Mode**
```css
/* Agregar al styles.css existente */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: #111827;
    --color-bg-secondary: #1f2937;
    --color-bg-tertiary: #374151;
    --color-text-primary: #f9fafb;
    --color-text-secondary: #d1d5db;
    --color-text-muted: #9ca3af;
    --color-border: #374151;
    --color-border-light: #4b5563;
  }
}

[data-theme="dark"] {
  --color-bg-primary: #111827;
  --color-bg-secondary: #1f2937;
  --color-bg-tertiary: #374151;
  --color-text-primary: #f9fafb;
  --color-text-secondary: #d1d5db;
  --color-text-muted: #9ca3af;
  --color-border: #374151;
  --color-border-light: #4b5563;
}

[data-theme="light"] {
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f9fafb;
  --color-bg-tertiary: #f3f4f6;
  --color-text-primary: #111827;
  --color-text-secondary: #374151;
  --color-text-muted: #6b7280;
  --color-border: #e5e7eb;
  --color-border-light: #d1d5db;
}
```

## Componentes Base Definidos

### **Botones**
- **Primary:** `.btn-primary` - Verde con hover
- **Secondary:** `.btn-secondary` - Outline verde

### **Cards**
- **Base:** `.card` - Fondo blanco, padding, sombra
- **Hover:** `.card-hover` - Efecto scale en hover

### **Utilidades**
- **Container:** `.container-custom` - Max-width responsive
- **Focus:** `.focus-ring` - Anillo de enfoque accesible
- **Gradients:** `.gradient-primary`, `.gradient-hero`

## Iconografía

### **Librería: Lucide Angular**
- **Estilo:** Outline, minimalista
- **Tamaños:** 16px, 20px, 24px, 32px
- **Colores:** Siguen la paleta de grises y verde primario

## Responsive Design

### **Breakpoints (TailwindCSS)**
- **sm:** 640px
- **md:** 768px
- **lg:** 1024px
- **xl:** 1280px
- **2xl:** 1536px

### **Enfoque:** Mobile-first
- Diseño optimizado para ambos desktop y mobile
- Navegación adaptativa (sidebar colapsa en mobile)

## Accesibilidad

### **Estándares WCAG 2.1**
- Contraste mínimo 4.5:1 para texto normal
- Contraste mínimo 3:1 para texto grande
- Focus visible en todos los elementos interactivos
- Navegación por teclado completa

## Animaciones y Transiciones

### **Duración Estándar**
- **Rápida:** 150ms
- **Normal:** 200ms
- **Lenta:** 300ms

### **Easing**
- **Ease-out:** Para entradas
- **Ease-in:** Para salidas
- **Ease-in-out:** Para transiciones de estado

## Personalidad Visual

### **Características**
- **Profesional:** Limpio y organizado
- **Deportivo:** Energético pero no agresivo
- **Moderno:** Uso de espacios en blanco y tipografía clara
- **Confiable:** Colores suaves que transmiten estabilidad

### **Aplicación al Dashboard**
- Header limpio con logo prominente
- Sidebar con iconos claros y navegación intuitiva
- Cards de equipos con hover effects sutiles
- Toggle de tema integrado naturalmente
- Menú de usuario elegante con avatar de iniciales