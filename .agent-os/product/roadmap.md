# Product Roadmap

## Phase 1: Foundation & Authentication (MVP)

**Goal:** Establecer la base de la aplicación con autenticación Supabase y landing page
**Success Criteria:** Usuario puede registrarse, elegir suscripción y acceder al dashboard básico

### Features

- [ ] Landing Page - Página de presentación con información de suscripciones y características `L`
- [ ] Autenticación Supabase - Login, registro, recuperación de contraseña integrado con Supabase Auth `M`
- [ ] Sistema de Suscripciones - Gestión de planes: Gratuito (0€), Entrenador, Club `M`
- [ ] Selección de Deporte - Usuario debe elegir deporte principal al registrarse `S`
- [ ] Dashboard Básico - Interfaz principal post-login con navegación básica `M`
- [ ] Gestión de Perfil - Edición de datos de usuario y configuración de cuenta `S`
- [ ] Sistema de Roles - Implementación básica de roles: Admin, Director, Entrenador `M`

### Dependencies

- Configuración Supabase completa
- Integración Angular 20 + Tailwind CSS 4
- Hero Icons integration
- .NET 8 API base structure

## Phase 2: Core Team Management

**Goal:** Implementar gestión completa de equipos y estructura organizacional
**Success Criteria:** Usuario puede crear clubes, equipos y gestionar membresías

### Features

- [ ] Creación de Clubes/Entidades - Gestión de organizaciones deportivas `M`
- [ ] Gestión de Equipos - CRUD completo con categorización (edad, género, nivel A/B/C) `L`
- [ ] Sistema de Permisos Granular - Asignación de usuarios a equipos específicos `L`
- [ ] Invitación de Usuarios - Sistema para añadir usuarios sin suscripción propia `M`
- [ ] Dashboard de Equipos - Vista de equipos con estadísticas básicas `M`
- [ ] Configuración de Equipos - Días de entrenamiento, horarios, instalaciones `S`
- [ ] Sistema de Visibilidad - Flags para ocultar/mostrar equipos y planificaciones `S`

### Dependencies

- Phase 1 completion
- Supabase Row Level Security (RLS) implementation
- Multi-tenancy architecture

## Phase 3: Objectives & Exercise System

**Goal:** Implementar sistema de conceptos, objetivos y ejercicios deportivos
**Success Criteria:** Base de datos completa de conceptos categorizados y ejercicios vinculados

### Features

- [ ] Conceptos Deportivos - Sistema jerárquico con categoría/subcategoría por deporte `L`
- [ ] Gestión de Ejercicios - CRUD de ejercicios con vinculación a conceptos múltiples `L`
- [ ] Conceptos Personalizados - Creación de conceptos custom por entrenador `M`
- [ ] Clasificación por Dificultad - Niveles de dificultad y tiempo estimado de aprendizaje `S`
- [ ] Biblioteca de Ejercicios - Filtros por deporte, concepto, nivel, duración `M`
- [ ] Importación de Datos - Sistema para cargar conceptos y ejercicios predefinidos `M`
- [ ] Validación de Coherencia - Reglas para asegurar coherencia entre conceptos y ejercicios `S`

### Dependencies

- Phase 2 completion
- Database schema for multi-sport concepts
- Content management for default exercises/concepts

## Phase 4: Planning System

**Goal:** Sistema completo de planificaciones con itinerarios y generación automática
**Success Criteria:** Crear planificación completa en menos de 5 clicks

### Features

- [ ] Creación de Planificaciones - Configuración con fechas, horarios, días de entrenamiento `L`
- [ ] Sistema de Itinerarios - Templates predefinidos con conceptos agrupados `L`
- [ ] Generación Automática de Entrenamientos - Crear todas las sesiones del período automáticamente `XL`
- [ ] Asignación Multi-Equipo - Planificaciones compartidas entre varios equipos `M`
- [ ] Configuración de Instalaciones - Pista completa vs. partida, lugares específicos `S`
- [ ] Validación de Planificaciones - Reglas de coherencia para conceptos y progresión `M`
- [ ] Calendario de Planificaciones - Vista temporal con entrenamientos futuros y pasados `M`

### Dependencies

- Phase 3 completion
- Complex business logic for automatic session generation
- Calendar integration libraries

## Phase 5: Session Execution & Tracking

**Goal:** Herramientas para ejecutar entrenamientos en tiempo real y hacer seguimiento
**Success Criteria:** Entrenadores pueden dirigir sesiones usando la app y registrar progreso

### Features

- [ ] Vista Dinámica de Entrenamiento - Interfaz paso a paso con cronómetro integrado `L`
- [ ] Registro de Ejecución - Marcar ejercicios como completados/modificados `M`
- [ ] Control de Asistencia - Registro de presencia de deportistas `S`
- [ ] Modificaciones en Tiempo Real - Ajustes sobre la marcha durante entrenamientos `M`
- [ ] Histórico de Sesiones - Registro completo de lo ejecutado vs. planificado `M`
- [ ] Notas y Observaciones - Comentarios por sesión y ejercicio individual `S`
- [ ] Exportación de Sesiones - PDF/Excel de entrenamientos realizados `S`

### Dependencies

- Phase 4 completion
- Real-time synchronization with Supabase
- Offline capabilities for field use

## Phase 6: Analytics & Reporting

**Goal:** Sistema completo de reportes y análisis de cumplimiento de objetivos
**Success Criteria:** Dashboards comprehensivos con insights accionables sobre progreso

### Features

- [ ] Dashboard de Objetivos - Distribución porcentual de conceptos en planificaciones `L`
- [ ] Reportes de Progreso - Análisis de planificado vs. entrenado vs. pendiente `L`
- [ ] Analytics por Equipo - Métricas específicas de rendimiento y adherencia `M`
- [ ] Comparativas Temporales - Evolución de equipos entre períodos/temporadas `M`
- [ ] Alertas de Cumplimiento - Notificaciones automáticas de desviaciones `S`
- [ ] Reportes para Directores - Vistas ejecutivas para validación y supervisión `M`
- [ ] Exportación de Informes - PDF/Excel con gráficos y análisis detallados `M`

### Dependencies

- Phase 5 completion
- Advanced analytics libraries
- Data visualization components

## Phase 7: Marketplace & Community

**Goal:** Plataforma comunitaria para compartir planificaciones valoradas
**Success Criteria:** 1000+ planificaciones compartidas con sistema de rating funcional

### Features

- [ ] Marketplace de Planificaciones - Explorar planificaciones públicas con filtros avanzados `XL`
- [ ] Sistema de Rating - Valoración de 1-5 estrellas con comentarios `M`
- [ ] Importación de Planificaciones - Un click para adoptar planificaciones del marketplace `L`
- [ ] Publicación de Planificaciones - Compartir propias planificaciones con la comunidad `M`
- [ ] Filtros Avanzados - Por deporte, categoría, nivel, valoración, autor `M`
- [ ] Perfiles de Entrenadores - Reputación y portfolio de planificaciones publicadas `M`
- [ ] Sistema de Seguimiento - Follow a entrenadores destacados `S`
- [ ] Trending y Populares - Algoritmos para destacar mejores planificaciones `S`

### Dependencies

- Phase 6 completion
- Community moderation tools
- Search and recommendation algorithms

## Phase 8: Advanced Features & Scale

**Goal:** Características avanzadas para usuarios enterprise y optimizaciones
**Success Criteria:** Soporte para organizaciones grandes (100+ equipos) con rendimiento óptimo

### Features

- [ ] API Pública - Integraciones con otras plataformas deportivas `L`
- [ ] Modo Multi-Organizacional - Gestión de múltiples clubes por usuario `L`
- [ ] Plantillas Avanzadas - Templates complejos con lógica condicional `M`
- [ ] Integración con Wearables - Datos de dispositivos para análisis de rendimiento `XL`
- [ ] Machine Learning - Recomendaciones personalizadas de ejercicios y planificaciones `XL`
- [ ] Modo Offline Avanzado - Sincronización completa para uso sin internet `L`
- [ ] White Label - Customización de marca para grandes organizaciones `M`

### Dependencies

- Phase 7 completion
- Scalable infrastructure
- ML/AI infrastructure and partnerships

## Success Metrics per Phase

### Phase 1-2: Foundation
- 100 usuarios registrados
- 50 equipos creados
- 3 suscripciones de pago

### Phase 3-4: Core Features  
- 500 conceptos en sistema
- 1000 ejercicios catalogados
- 100 planificaciones creadas

### Phase 5-6: Execution
- 1000 entrenamientos ejecutados
- 50 reportes generados mensualmente
- 80% tasa de cumplimiento de planificaciones

### Phase 7-8: Community
- 1000 planificaciones en marketplace
- 10000 importaciones de planificaciones
- 500 entrenadores activos mensualmente