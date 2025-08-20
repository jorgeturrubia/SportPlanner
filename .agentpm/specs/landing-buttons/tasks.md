# 📋 Tasks - Botones de Landing PlanSport

> Checklist detallado para arreglar los botones "Comenzar Gratis" y "Ver Demo" que actualmente no funcionan en la landing page.

---

## 🎯 Resumen del Proyecto

**Problema**: Los botones de la landing page solo ejecutan console.log y no navegan
**Objetivo**: Implementar navegación correcta hacia el sistema de autenticación
**Tecnologías**: Angular 20, Angular Router, AuthService existente
**Estimación Total**: 4-6 horas

---

## 📊 Resumen de Progreso
- Total tasks: 12
- Completadas: 8 ✅
- En progreso: 0
- Pendientes: 4
- Última actualización: 2025-01-27 15:35

---

## ✅ Validaciones Obligatorias por Task

### 🔍 Checklist de Consistencia Técnica (APLICAR A CADA TASK)
- [ ] **Interfaces Completas:** Verificar que todas las propiedades estén definidas
- [ ] **Naming Conventions:** Seguir convenciones establecidas (ej: *.component.ts)
- [ ] **Null Safety:** Manejar explícitamente null/undefined con ? o !
- [ ] **Paradigma Consistente:** Usar solo Observables O Signals, no mezclar
- [ ] **Imports Correctos:** Verificar rutas de importación antes de implementar
- [ ] **Componentes Referenciados:** Crear todos los componentes mencionados en rutas
- [ ] **Router Integration:** Verificar que las rutas existan y funcionen
- [ ] **AuthService Integration:** Verificar integración con servicio de autenticación

---

## 🚀 Tasks de Implementación

### 📱 1. Análisis y Preparación (1h)
- [✅] **1.1** Revisar implementación actual del Hero component ✅ 2025-01-27 14:00
  - [✅] Analizar métodos `onStartFree()` y `onViewDemo()` existentes
  - [✅] Verificar imports y dependencias actuales
  - [✅] Documentar estado actual del componente
  - **Estimación**: 15 min

- [✅] **1.2** Verificar integración con AuthService ✅ 2025-01-27 14:15
  - [✅] Confirmar que AuthService existe y está disponible
  - [✅] Revisar método para verificar estado de autenticación
  - [✅] Verificar que las rutas `/auth` y `/dashboard` funcionan
  - **Estimación**: 15 min

- [✅] **1.3** Planificar estructura de navegación ✅ 2025-01-27 14:30
  - [✅] Definir lógica de redirección basada en estado de auth
  - [✅] Planificar manejo de query parameters
  - [✅] Definir estados de loading y error
  - **Estimación**: 30 min

### 🔧 2. Implementación Core (2-3h)
- [✅] **2.1** Actualizar imports del Hero component ✅ 2025-01-27 14:45
  - [✅] Importar `Router` de `@angular/router`
  - [✅] Importar `AuthService` (si existe) o crear inyección
  - [✅] Importar `inject` para dependency injection
  - **Estimación**: 15 min
  - **Dependencias**: Task 1.2

- [✅] **2.2** Implementar inyección de dependencias ✅ 2025-01-27 15:00
  - [✅] Inyectar Router service
  - [✅] Inyectar AuthService (si está disponible)
  - [✅] Configurar constructor o inject() según patrón del proyecto
  - **Estimación**: 15 min
  - **Dependencias**: Task 2.1

- [✅] **2.3** Implementar método `onStartFree()` mejorado ✅ 2025-01-27 15:15
  - [✅] Verificar estado de autenticación del usuario
  - [✅] Si está autenticado → navegar a `/dashboard`
  - [✅] Si no está autenticado → navegar a `/auth?tab=register`
  - [✅] Agregar manejo de errores de navegación
  - **Estimación**: 45 min
  - **Dependencias**: Task 2.2

- [✅] **2.4** Implementar método `onViewDemo()` mejorado ✅ 2025-01-27 15:30
  - [✅] Verificar estado de autenticación del usuario
  - [✅] Si está autenticado → navegar a `/dashboard`
  - [✅] Si no está autenticado → navegar a `/auth?tab=login`
  - [✅] Agregar manejo de errores de navegación
  - **Estimación**: 45 min
  - **Dependencias**: Task 2.2

- [✅] **2.5** Agregar estados de loading (opcional) ✅ 2025-01-27 15:45
  - [✅] Crear property `isNavigating: boolean = false`
  - [✅] Mostrar loading durante navegación
  - [✅] Actualizar template para mostrar estado de loading
  - **Estimación**: 30 min
  - **Dependencias**: Tasks 2.3, 2.4

### 🎨 3. Mejoras UX/UI (1h)
- [ ] **3.1** Mejorar feedback visual de botones
  - [ ] Agregar estados disabled durante navegación
  - [ ] Mejorar animaciones hover existentes
  - [ ] Agregar cursor pointer y estados focus
  - **Estimación**: 20 min
  - **Dependencias**: Task 2.5

- [ ] **3.2** Agregar iconos a botones (opcional)
  - [ ] Importar iconos de Lucide Angular si están disponibles
  - [ ] Agregar icono de "play" o "arrow-right" a botones
  - [ ] Mantener consistencia con design system
  - **Estimación**: 20 min

- [ ] **3.3** Mejorar accesibilidad
  - [ ] Agregar `aria-label` descriptivos a botones
  - [ ] Verificar contraste de colores
  - [ ] Asegurar navegación por teclado
  - **Estimación**: 20 min

### 🧪 4. Testing y Validación (1h)
- [ ] **4.1** Pruebas manuales de navegación
  - [ ] Probar "Comenzar Gratis" sin autenticación
  - [ ] Probar "Ver Demo" sin autenticación
  - [ ] Probar ambos botones con usuario autenticado
  - [ ] Verificar query parameters en URL
  - **Estimación**: 20 min
  - **Dependencias**: Tasks 2.3, 2.4

- [ ] **4.2** Verificar integración con sistema de auth
  - [ ] Confirmar que `/auth?tab=register` abre tab correcto
  - [ ] Confirmar que `/auth?tab=login` abre tab correcto
  - [ ] Verificar redirección a dashboard funciona
  - **Estimación**: 20 min
  - **Dependencias**: Task 4.1

- [ ] **4.3** Testing de edge cases
  - [ ] Probar con rutas inexistentes
  - [ ] Probar con AuthService no disponible
  - [ ] Verificar comportamiento en mobile
  - **Estimación**: 20 min
  - **Dependencias**: Task 4.2

### ✅ 5. Validación Final
- [ ] **Build Success:** `ng build` sin errores de compilación
- [ ] **Type Safety:** Todas las interfaces implementadas correctamente
- [ ] **Import Consistency:** Todas las rutas de importación funcionan
- [ ] **Navigation Works:** Botones navegan correctamente
- [ ] **Auth Integration:** Detección de estado de autenticación funciona
- [ ] **Query Parameters:** Se pasan correctamente a la página de auth
- [ ] **No Console Errors:** No hay errores en consola del navegador
- [ ] **UX Smooth:** Transiciones y animaciones funcionan correctamente

---

## 📝 Notas Técnicas

### 🔧 Consideraciones de Implementación
- **Router Navigation**: Usar `router.navigate()` con query parameters
- **Auth State**: Verificar si existe `AuthService.isAuthenticated()` o similar
- **Error Handling**: Manejar casos donde la navegación falla
- **Performance**: Evitar verificaciones innecesarias del estado de auth

### 🎯 Código de Ejemplo
```typescript
// Ejemplo de implementación esperada
async onStartFree(): Promise<void> {
  try {
    const isAuthenticated = await this.authService.isAuthenticated();
    if (isAuthenticated) {
      await this.router.navigate(['/dashboard']);
    } else {
      await this.router.navigate(['/auth'], { queryParams: { tab: 'register' } });
    }
  } catch (error) {
    console.error('Navigation error:', error);
  }
}
```

### ⚠️ Riesgos y Mitigaciones
- **Riesgo**: AuthService no disponible
  - **Mitigación**: Implementar fallback que siempre navegue a `/auth`
- **Riesgo**: Rutas no configuradas correctamente
  - **Mitigación**: Verificar rutas antes de implementar navegación
- **Riesgo**: Query parameters no funcionan
  - **Mitigación**: Probar navegación con parámetros en desarrollo

---

## 🎉 Criterios de Éxito

### 📊 Validación Funcional
- ✅ Usuario puede hacer clic en "Comenzar Gratis" y llegar a registro
- ✅ Usuario puede hacer clic en "Ver Demo" y llegar a login
- ✅ Usuario autenticado es redirigido a dashboard
- ✅ Query parameters se pasan correctamente
- ✅ No hay errores de navegación

### 🎨 Validación UX
- ✅ Botones responden visualmente al hover/click
- ✅ Estados de loading son claros (si implementados)
- ✅ Transiciones son suaves
- ✅ Accesibilidad cumple estándares básicos

---

*📋 Checklist creado para PlanSport - Botones de Landing*
*Actualizado: Enero 2025*
*Estimación total: 4-6 horas*