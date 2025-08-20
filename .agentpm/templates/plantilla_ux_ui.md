# Plantilla para Documentación UX/UI

## Propósito
Esta plantilla define cómo crear documentación UX/UI completa y actualizada para cualquier proyecto, garantizando excelencia en experiencia de usuario mediante buenas prácticas actualizadas.

## Uso OBLIGATORIO de FETCH

**SIEMPRE** usar FETCH para obtener información actualizada sobre:

### 1. Design Systems y Frameworks
- **Material Design:** Últimas guidelines y componentes
- **Human Interface Guidelines (Apple):** Patrones iOS/macOS actualizados
- **Fluent Design (Microsoft):** Principios Windows/Web actualizados
- **Ant Design, Chakra UI, MUI:** Componentes y patrones específicos del framework usado

### 2. Accessibility (Accesibilidad)
- **WCAG 2.1/2.2:** Últimas guidelines de accesibilidad
- **ARIA patterns:** Patrones de accesibilidad para componentes interactivos
- **Color contrast:** Herramientas y estándares actualizados
- **Screen reader compatibility:** Mejores prácticas actuales

### 3. Performance UX
- **Core Web Vitals:** Métricas actualizadas (LCP, FID, CLS)
- **Performance budgets:** Estándares de carga y respuesta
- **Progressive loading:** Técnicas de carga progresiva
- **Image optimization:** Formatos y técnicas actuales

### 4. Responsive Design
- **Breakpoints modernos:** Estándares actuales para diferentes dispositivos
- **Mobile-first approach:** Mejores prácticas actualizadas
- **Flexible layouts:** CSS Grid, Flexbox patterns modernos
- **Touch interactions:** Guidelines para interfaces táctiles

### 5. Framework-Specific Best Practices
- **React:** Hooks patterns, component composition, accessibility
- **Vue:** Composition API, reactivity patterns, UI libraries
- **Angular:** Material Design integration, CDK patterns
- **Svelte:** Component patterns, animations, accessibility

## Estructura de Documentación UX/UI

### 1. Principios de Diseño
```markdown
# Principios de Diseño - [Nombre del Proyecto]

## Usabilidad
- **Claridad:** [Criterios específicos]
- **Consistencia:** [Patrones a seguir]
- **Eficiencia:** [Métricas de usabilidad]
- **Feedback:** [Tipos de retroalimentación]

## Accesibilidad
- **WCAG Level:** [AA/AAA según proyecto]
- **Screen readers:** [Compatibilidad requerida]
- **Keyboard navigation:** [Patrones de navegación]
- **Color contrast:** [Ratios mínimos]

## Performance UX
- **Loading time:** [Máximo aceptable]
- **Response time:** [Interacciones < 100ms]
- **Animation duration:** [60fps, < 300ms]
- **Bundle size:** [Límites por página]
```

### 2. Design System
```markdown
# Design System - [Nombre del Proyecto]

## Colores
- **Primary:** [Paleta principal con códigos hex/hsl]
- **Secondary:** [Paleta secundaria]
- **Semantic:** [Success, warning, error, info]
- **Neutral:** [Grises y backgrounds]

## Tipografía
- **Font family:** [Fuentes principales y fallbacks]
- **Scale:** [Tamaños y line-heights]
- **Weights:** [Pesos disponibles]
- **Usage:** [Cuándo usar cada variante]

## Spacing
- **Base unit:** [4px, 8px, etc.]
- **Scale:** [Múltiplos del base unit]
- **Component spacing:** [Padding/margin patterns]

## Components
- **Buttons:** [Variantes, estados, sizes]
- **Forms:** [Inputs, validation, labels]
- **Navigation:** [Menus, breadcrumbs, pagination]
- **Feedback:** [Alerts, toasts, modals]
```

### 3. Patrones de Interacción
```markdown
# Patrones de Interacción

## Navegación
- **Primary navigation:** [Estructura principal]
- **Secondary navigation:** [Submenús y filtros]
- **Breadcrumbs:** [Cuándo y cómo usar]
- **Search:** [Patrones de búsqueda]

## Estados de UI
- **Loading states:** [Skeletons, spinners, progress]
- **Empty states:** [Ilustraciones, CTAs]
- **Error states:** [Mensajes, recovery actions]
- **Success states:** [Confirmaciones, next steps]

## Formularios
- **Validation:** [Real-time vs submit]
- **Error handling:** [Inline vs summary]
- **Progressive disclosure:** [Multi-step patterns]
- **Accessibility:** [Labels, descriptions, errors]
```

### 4. Responsive Behavior
```markdown
# Responsive Design

## Breakpoints
- **Mobile:** [320px - 767px]
- **Tablet:** [768px - 1023px]
- **Desktop:** [1024px+]
- **Large screens:** [1440px+]

## Layout Patterns
- **Mobile-first:** [Progressive enhancement]
- **Grid systems:** [12-column, CSS Grid]
- **Component adaptation:** [Cómo cambian los componentes]
- **Navigation adaptation:** [Mobile menus, collapsing]

## Touch Interactions
- **Touch targets:** [Mínimo 44px]
- **Gestures:** [Swipe, pinch, tap patterns]
- **Hover alternatives:** [Para dispositivos táctiles]
```

### 5. Validación y Testing
```markdown
# Validación UX/UI

## Checklist de Calidad
- [ ] Cumple principios de usabilidad definidos
- [ ] Pasa validación WCAG [Level AA/AAA]
- [ ] Responsive en todos los breakpoints
- [ ] Performance UX dentro de estándares
- [ ] Consistencia con design system
- [ ] Touch-friendly en dispositivos móviles
- [ ] Keyboard navigation funcional
- [ ] Screen reader compatible
- [ ] Color contrast adecuado
- [ ] Loading states implementados

## Testing Tools
- **Accessibility:** [axe-core, WAVE, Lighthouse]
- **Performance:** [PageSpeed Insights, WebPageTest]
- **Responsive:** [Browser DevTools, BrowserStack]
- **Usability:** [User testing, heatmaps]
```

## Implementación

### Flujo de Trabajo
1. **Research:** Usar FETCH para obtener mejores prácticas actualizadas
2. **Design:** Crear mockups siguiendo los principios definidos
3. **Prototype:** Validar interacciones y flujos
4. **Implement:** Seguir las guidelines técnicas
5. **Test:** Validar con herramientas automatizadas
6. **Iterate:** Mejorar basado en feedback y métricas

### Herramientas Recomendadas
- **Design:** Figma, Sketch, Adobe XD
- **Prototyping:** Framer, Principle, InVision
- **Testing:** Storybook, Chromatic, Percy
- **Accessibility:** axe DevTools, Colour Contrast Analyser
- **Performance:** Lighthouse, WebPageTest, SpeedCurve

## Mantenimiento

### Actualizaciones Regulares
- **Quarterly:** Revisar y actualizar guidelines usando FETCH
- **Per release:** Validar nuevos componentes y patrones
- **Continuous:** Monitorear métricas de UX y performance

### Documentación Viva
- Mantener ejemplos actualizados
- Documentar decisiones de diseño
- Registrar cambios y versioning
- Compartir learnings con el equipo