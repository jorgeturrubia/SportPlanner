# Tasks del Módulo Dashboard Deportivo

## Resumen de Progreso
- Total tasks: 18
- Completadas: 18
- En progreso: 0
- Pendientes: 0

## Validaciones Obligatorias por Task

### ✅ Checklist de Consistencia Técnica (APLICAR A CADA TASK)
- [x] **Interfaces Completas:** Verificar que todas las propiedades estén definidas
- [x] **Naming Conventions:** Seguir convenciones establecidas (*.interfaces.ts, *.component.ts)
- [x] **Null Safety:** Manejar explícitamente null/undefined con ? o !
- [x] **Paradigma Consistente:** Usar solo Signals (Angular 20+), no Observables para estado
- [x] **Mapeo Form-Interface:** Cada campo del formulario debe tener su propiedad en la interface
- [x] **Imports Correctos:** Verificar rutas de importación antes de implementar
- [x] **Componentes Referenciados:** Crear todos los componentes mencionados en rutas

## Tasks

### 🏗️ Sprint 1: Estructura Base y Layout (6h)

### 📐 1. Configuración del Módulo
- [x] **1.1** Crear estructura de carpetas
  - [x] `/pages/dashboard/`
  - [x] Componentes, servicios, interfaces
  - [x] Lazy loading configurado
- [x] **1.2** Configurar rutas
  - [x] Ruta principal `/dashboard`
  - [x] Rutas anidadas para secciones
  - [x] Protección con AuthGuard
- [x] **1.3** Integración con autenticación
  - [x] Verificación de sesión activa
  - [x] Redirección si no autenticado
  - [x] Permisos por rol de usuario

### Header Dashboard
- [x] Crear componente DashboardHeaderComponent standalone (1h)
- [x] Implementar logo y navegación básica en header (45min)
- [x] Integrar toggle de tema dark/light en header (1h)
- [x] Crear menú de usuario con avatar de iniciales (1.5h)
- [x] Implementar funcionalidad de logout en menú usuario (30min)

### Sidebar Navigation
- [x] Crear componente SidebarComponent standalone y colapsible (2h)
- [x] Implementar navegación: Inicio, Equipos, con iconos Lucide (1h)
- [x] Añadir animaciones de colapso/expansión con TailwindCSS (1h)
- [x] Integrar estado de sidebar con localStorage para persistencia (45min)

### Gestión de Equipos
- [x] Crear página TeamsComponent para listar equipos (1.5h)
- [x] Implementar TeamCardComponent con acciones (editar, eliminar) (2h)
- [x] Crear modal TeamModalComponent para crear/editar equipos (2.5h)
- [x] Implementar formulario reactivo para datos del equipo (1.5h)
- [x] Añadir confirmación de eliminación de equipos (45min)

### Validación Final
- [x] **Build Success:** ng build sin errores de compilación
- [x] **Type Safety:** Todas las interfaces implementadas correctamente
- [x] **Import Consistency:** Todas las rutas de importación funcionan
- [x] **Component Creation:** Todos los componentes referenciados existen
- [x] **Responsive Design:** Dashboard funcional en mobile y desktop
- [x] **Theme Toggle:** Cambio de tema funciona correctamente
- [x] **Navigation:** Todas las rutas del dashboard funcionan
- [x] **CRUD Teams:** Crear, leer, actualizar y eliminar equipos funciona

### Notas Técnicas Importantes:
- Usar Angular 20+ con standalone components (NO NgModules)
- Implementar signals para estado local, NO Observables
- Usar control flow nativo (@if, @for) en lugar de *ngIf, *ngFor
- Aplicar ChangeDetectionStrategy.OnPush en todos los componentes
- Usar input() y output() functions en lugar de decoradores
- Implementar lazy loading para las rutas del dashboard
- Seguir convenciones de naming: *.interfaces.ts, *.service.ts, *.component.ts
- Usar TailwindCSS para todos los estilos
- Iconos con Lucide Angular
- Formularios reactivos con validaciones