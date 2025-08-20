# Spec de Botones de Landing - PlanSport

## 🎯 Objetivo

Arreglar y mejorar los botones de "Comenzar Gratis" y "Ver Demo" en la landing page que actualmente no funcionan (solo hacen console.log) y implementar la navegación correcta hacia el sistema de autenticación.

## 📋 Descripción General

Este spec se enfoca específicamente en:

### Problema Actual:
- Los botones "Comenzar Gratis" y "Ver Demo" en el Hero component solo ejecutan console.log
- No hay navegación hacia las páginas de autenticación
- Falta integración con el sistema de rutas existente
- No hay feedback visual para el usuario

### Solución Propuesta:
1. **Botón "Comenzar Gratis"**: Debe navegar a `/auth?tab=register` para registro directo
2. **Botón "Ver Demo"**: Debe navegar a `/auth?tab=login` para acceso rápido
3. **Mejoras UX**: Agregar estados de loading, animaciones y feedback visual
4. **Integración**: Conectar con el sistema de autenticación ya existente

## 🔗 Dependencias

### Specs Relacionados:
- **Autenticación**: Este spec depende del sistema de autenticación ya implementado
- **Rutas**: Utiliza las rutas `/auth` ya configuradas

### Componentes Afectados:
- `Hero` component (`src/app/components/hero/`)
- Posible integración con `AuthService` para verificar estado de autenticación

## 🎨 Características Técnicas

### Framework y Tecnologías:
- **Angular 20** con Standalone Components
- **Angular Router** para navegación
- **Tailwind CSS 4.1** para estilos
- **Lucide Angular** para iconos (si es necesario)

### Funcionalidades a Implementar:
1. **Navegación Inteligente**:
   - Si el usuario ya está autenticado → redirigir a `/dashboard`
   - Si no está autenticado → redirigir a `/auth` con el tab correspondiente

2. **Estados Visuales**:
   - Loading state durante navegación
   - Hover effects mejorados
   - Animaciones de transición

3. **Accesibilidad**:
   - ARIA labels apropiados
   - Navegación por teclado
   - Contraste adecuado

## 🚀 Flujo de Usuario Esperado

### Escenario 1: Usuario No Autenticado
1. Usuario hace clic en "Comenzar Gratis"
2. Navegación a `/auth?tab=register`
3. Se abre la página de autenticación con el tab de registro activo

### Escenario 2: Usuario No Autenticado (Demo)
1. Usuario hace clic en "Ver Demo"
2. Navegación a `/auth?tab=login`
3. Se abre la página de autenticación con el tab de login activo

### Escenario 3: Usuario Ya Autenticado
1. Usuario hace clic en cualquier botón
2. Redirección directa a `/dashboard`
3. No pasa por la página de autenticación

## 📊 Estado Actual

**🟢 COMPLETADO** - Los botones ahora navegan correctamente según el estado de autenticación

### Funcionalidad Actual:
- ✅ Botones "Comenzar Gratis" y "Ver Demo" están visibles
- ✅ Eventos de click están configurados
- ✅ Navegación inteligente basada en estado de autenticación
- ✅ Integración completa con AuthService
- ✅ Estados de loading y feedback visual implementados
- ✅ Manejo de errores robusto

**Última actualización**: 2025-01-27 15:35

## 📊 Criterios de Éxito

### Funcionales:
- ✅ Botón "Comenzar Gratis" navega correctamente
- ✅ Botón "Ver Demo" navega correctamente
- ✅ Detección de estado de autenticación funciona
- ✅ Query parameters se pasan correctamente
- ✅ No hay errores de consola

### UX/UI:
- ✅ Transiciones suaves entre páginas
- ✅ Estados de loading visibles
- ✅ Animaciones no interfieren con usabilidad
- ✅ Accesibilidad WCAG AA compliant

### Técnicos:
- ✅ Código limpio y mantenible
- ✅ Integración sin conflictos con sistema existente
- ✅ Performance optimizada
- ✅ Tests unitarios pasan

---

**Estimación**: 4-6 horas de desarrollo
**Prioridad**: Alta (funcionalidad crítica para conversión de usuarios)
**Sprint**: Puede implementarse independientemente del sistema de autenticación