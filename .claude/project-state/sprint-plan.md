# SportPlanner - Plan de Sprint

## Sprint 1: Fundación del Sistema (2 semanas)
**Objetivo**: Establecer la base técnica y funcionalidades core

### Backend Tasks (Prioridad Alta)
- **BACK-001**: Configurar proyecto .NET 8 con arquitectura limpia
- **BACK-002**: Implementar autenticación con Supabase
- **BACK-003**: Crear modelos de datos y DbContext
- **BACK-004**: Implementar endpoints de usuarios y suscripciones
- **BACK-005**: Crear sistema de roles y permisos

### Frontend Tasks (Prioridad Alta)
- **FRONT-001**: Configurar proyecto Angular 20 con Tailwind CSS
- **FRONT-002**: Implementar componentes de autenticación
- **FRONT-003**: Crear páginas de suscripción
- **FRONT-004**: Desarrollar layout principal y navegación
- **FRONT-005**: Implementar guards de autenticación

### Database Tasks (Prioridad Alta)
- **DB-001**: Configurar Supabase y PostgreSQL
- **DB-002**: Crear tablas principales (Users, Subscriptions, Organizations)
- **DB-003**: Configurar RLS (Row Level Security)
- **DB-004**: Crear triggers y funciones básicas

## Sprint 2: Gestión de Equipos y Planificaciones (2 semanas)
**Objetivo**: Implementar funcionalidades de equipos y planificaciones básicas

### Backend Tasks
- **BACK-006**: Endpoints para organizaciones y equipos
- **BACK-007**: Sistema de planificaciones y conceptos
- **BACK-008**: Implementar lógica de itinerarios
- **BACK-009**: Validaciones de negocio para equipos

### Frontend Tasks
- **FRONT-006**: Componentes de gestión de equipos
- **FRONT-007**: Interfaz de creación de planificaciones
- **FRONT-008**: Sistema de selección de conceptos
- **FRONT-009**: Dashboard principal

### Database Tasks
- **DB-005**: Tablas de equipos y planificaciones
- **DB-006**: Relaciones many-to-many
- **DB-007**: Índices de rendimiento

## Sprint 3: Sistema de Entrenamientos (2 semanas)
**Objetivo**: Desarrollar funcionalidades de entrenamientos y ejercicios

### Backend Tasks
- **BACK-010**: Endpoints de entrenamientos y ejercicios
- **BACK-011**: Lógica de generación automática de entrenamientos
- **BACK-012**: Sistema de seguimiento de progreso

### Frontend Tasks
- **FRONT-010**: Vista dinámica de entrenamientos
- **FRONT-011**: Cronómetro y control de sesiones
- **FRONT-012**: Calendario de entrenamientos

## Sprint 4: Marketplace y Funcionalidades Avanzadas (2 semanas)
**Objetivo**: Implementar marketplace y características premium

### Backend Tasks
- **BACK-013**: Sistema de compartir planificaciones
- **BACK-014**: API de búsqueda y filtros
- **BACK-015**: Sistema de valoraciones

### Frontend Tasks
- **FRONT-013**: Interfaz de marketplace
- **FRONT-014**: Sistema de búsqueda avanzada
- **FRONT-015**: Reportes y analytics

## Estimaciones de Esfuerzo
- **Total estimado**: 8 semanas
- **Backend**: ~120 horas
- **Frontend**: ~100 horas
- **Database**: ~40 horas
- **Testing & QA**: ~30 horas

## Dependencias Críticas
1. Configuración de Supabase (bloquea autenticación)
2. Modelos de datos (bloquea desarrollo backend)
3. Componentes base (bloquea desarrollo frontend)

## Riesgos Identificados
- **Alto**: Complejidad del sistema de permisos multi-nivel
- **Medio**: Integración con Supabase para funcionalidades avanzadas
- **Bajo**: Rendimiento con grandes volúmenes de datos

## Criterios de Aceptación por Sprint
### Sprint 1
- Usuario puede registrarse y autenticarse
- Sistema de suscripciones funcional
- Roles básicos implementados

### Sprint 2
- Creación y gestión de equipos
- Planificaciones básicas operativas
- Dashboard funcional

### Sprint 3
- Entrenamientos generados automáticamente
- Vista dinámica operativa
- Calendario funcional

### Sprint 4
- Marketplace operativo
- Sistema de búsqueda funcional
- Reportes básicos disponibles