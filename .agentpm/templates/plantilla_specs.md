# Plantilla para Especificaciones Modulares

Esta plantilla define la estructura para specs modulares. Cada spec debe tener su propia carpeta con archivos específicos. Usa siempre esta estructura para mantener consistencia.

## Estructura de Carpeta por Spec
```
specs/
├── [nombre-del-spec]/
│   ├── README.md
│   ├── user-stories.md
│   ├── tasks.md
│   ├── technical-specs.md
│   └── dependencies.md
```

## 1. README.md - Descripción General
- **Título del Spec:** Nombre descriptivo del módulo
- **Descripción:** Qué hace este módulo/funcionalidad
- **Objetivos:** Metas específicas a cumplir
- **Alcance:** Qué incluye y qué no incluye
- **Prioridad:** Alta/Media/Baja
- **Estado:** Pendiente/En Progreso/Completado

## 2. user-stories.md - Historias de Usuario
- **Formato estándar:** Como [rol], quiero [función] para [beneficio]
- **Criterios de aceptación:** Condiciones específicas para considerar completada
- **Prioridad:** Por historia individual
- **Estimación:** Tiempo estimado de desarrollo
- **Notas:** Consideraciones especiales

## 3. tasks.md - Tasks Técnicas (Formato Checklist)

**FORMATO OBLIGATORIO:** Usar checkboxes markdown para tracking visual

```markdown
# Tasks para [Nombre del Spec]

## User Story 1: [Título]
- [ ] **Task 1.1:** [Descripción específica] (Estimación: Xh)
  - Dependencias: Ninguna / Task X.X
  - Notas: [Consideraciones técnicas]
- [ ] **Task 1.2:** [Descripción específica] (Estimación: Xh)
  - Dependencias: Task 1.1
  - Notas: [Consideraciones técnicas]

## User Story 2: [Título]
- [ ] **Task 2.1:** [Descripción específica] (Estimación: Xh)
- [x] **Task 2.2:** [Descripción completada] (Estimación: Xh) ✅

## Resumen de Progreso
- **Total tasks:** X
- **Completadas:** X
- **Pendientes:** X
- **En progreso:** X
```

**Reglas de uso:**
- `[ ]` = Task pendiente
- `[x]` = Task completada (agregar ✅ al final)
- **El agente de programación SOLO puede trabajar en estas tasks**
- **NO se pueden crear tasks adicionales sin actualizar este archivo**
- **Cada task debe ser específica y accionable**

## 4. technical-specs.md - Especificaciones Técnicas
- **Arquitectura:** Componentes y estructura del módulo
- **APIs necesarias:** Endpoints, métodos, parámetros
- **Base de datos:** Tablas, campos, relaciones necesarias
- **Tecnologías específicas:** Librerías, frameworks, versiones
- **Patrones de diseño:** Arquitectura a seguir
- **Buenas prácticas:** TDD, SOLID, código limpio específicas del módulo

## 5. design-system.md
**INTERACTIVO:** Define el sistema de diseño visual del proyecto mediante preguntas específicas:

### Paleta de Colores:
- **Color primario:** [Pregunta: ¿Cuál es tu color principal preferido? (hex/nombre)]
- **Color secundario:** [Pregunta: ¿Qué color complementario usarías?]
- **Colores semánticos:** [Success: #verde, Warning: #amarillo, Error: #rojo, Info: #azul]
- **Colores neutros:** [Grises para textos y backgrounds]

### Tipografía:
- **Font principal:** [Pregunta: ¿Prefieres serif, sans-serif o una fuente específica?]
- **Font secundaria:** [Para títulos o elementos especiales]
- **Escala tipográfica:** [h1-h6, body, small]

### Espaciado y Layout:
- **Unidad base:** [4px, 8px, 16px - Pregunta: ¿Prefieres espaciado compacto o amplio?]
- **Breakpoints:** [Mobile, tablet, desktop]
- **Contenedores:** [Anchos máximos y padding]

### Componentes Visuales:
- **Botones:** [Estilos: filled, outlined, text]
- **Cards:** [Sombras, bordes, padding]
- **Formularios:** [Estilos de inputs, validación]

### Variables CSS Generadas:
```css
:root {
  /* Colores */
  --color-primary: [valor definido];
  --color-secondary: [valor definido];
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
  
  /* Tipografía */
  --font-primary: [fuente definida];
  --font-secondary: [fuente definida];
  
  /* Espaciado */
  --spacing-unit: [unidad definida];
  --spacing-xs: calc(var(--spacing-unit) * 0.5);
  --spacing-sm: var(--spacing-unit);
  --spacing-md: calc(var(--spacing-unit) * 2);
  --spacing-lg: calc(var(--spacing-unit) * 3);
  --spacing-xl: calc(var(--spacing-unit) * 4);
}
```

## 6. ux-ui-guidelines.md - Guías de UX/UI
**Propósito:** Definir estándares de UX/UI específicos para este spec con buenas prácticas actualizadas

**OBLIGATORIO:** Usar FETCH para obtener información actualizada sobre:
- Mejores prácticas de UX/UI del framework específico
- Patrones de diseño modernos (Material Design, Human Interface Guidelines, etc.)
- Accessibility guidelines (WCAG 2.1/2.2)
- Responsive design patterns
- Performance UX guidelines

**Estructura:**
```markdown
# UX/UI Guidelines - [Nombre del Spec]

## Principios de Diseño
- **Usabilidad:** Criterios específicos de facilidad de uso
- **Accesibilidad:** Estándares WCAG a cumplir
- **Performance UX:** Tiempos de carga y respuesta esperados
- **Responsive:** Breakpoints y comportamiento en diferentes dispositivos

## Patrones de UI Específicos
- **Componentes:** Lista de componentes UI a usar/crear
- **Layouts:** Estructuras de página definidas
- **Navegación:** Flujos de usuario y patrones de navegación
- **Estados:** Loading, error, empty states

## Buenas Prácticas Actualizadas (FETCH)
- **Framework específico:** [Resultado de FETCH sobre mejores prácticas]
- **Accessibility:** [Resultado de FETCH sobre WCAG actualizadas]
- **Performance:** [Resultado de FETCH sobre Core Web Vitals]
- **Mobile-first:** [Resultado de FETCH sobre responsive design]

## Validación UX/UI
- [ ] Cumple principios de usabilidad
- [ ] Pasa validación de accesibilidad
- [ ] Responsive en todos los breakpoints
- [ ] Performance UX dentro de estándares
- [ ] Consistencia con design system
- [ ] **Design System implementado** (colores, tipografía, componentes)
```

## 7. dependencies.md - Dependencias
- **Dependencias externas:** Otros specs/módulos necesarios
- **Orden de implementación:** Qué debe hacerse primero
- **Interfaces:** Cómo se comunica con otros módulos
- **Datos compartidos:** Qué información intercambia
- **Conflictos potenciales:** Posibles problemas de integración

## Uso de FETCH para Información Actualizada
- **Siempre consultar:** Documentación oficial de tecnologías usadas
- **Verificar:** Mejores prácticas actuales para el tipo de funcionalidad
- **Incluir enlaces:** A documentación oficial y recursos actualizados

**IMPORTANTE:** Cada spec es un módulo independiente pero consciente de sus dependencias. Permite desarrollo incremental y modular de la aplicación.