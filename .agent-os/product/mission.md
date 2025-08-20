# Product Mission

## Pitch

PlanSport es una plataforma integral de planificación deportiva multi-deporte que permite a entrenadores crear, compartir y ejecutar planificaciones de entrenamiento de manera colaborativa. Con muy pocos clicks, los usuarios pueden acceder a planificaciones completas con objetivos, ejercicios y entrenamientos creados por la comunidad de entrenadores, facilitando el desarrollo deportivo a través de un marketplace de conocimiento deportivo.

## Users

### Primary Customers

- **Entrenadores**: Profesionales y amateur que necesitan crear planificaciones eficientes para sus equipos
- **Clubes Deportivos**: Organizaciones que gestionan múltiples equipos y requieren supervisión directiva
- **Entrenadores Freelance**: Profesionales independientes que trabajan con equipos de diferentes clubes

### User Personas

**Entrenador de Equipo** (25-55 años)
- **Rol:** Entrenador principal de equipo
- **Contexto:** Entrena equipos específicos 2-4 días por semana, necesita planificaciones estructuradas
- **Pain Points:** Crear planificaciones desde cero consume mucho tiempo, falta de ejercicios variados, dificultad para seguir el progreso
- **Goals:** Acceder rápidamente a planificaciones probadas, personalizar entrenamientos según nivel del equipo, hacer seguimiento efectivo

**Director Deportivo** (35-60 años)
- **Rol:** Responsable de múltiples equipos en un club
- **Contexto:** Supervisa el trabajo de varios entrenadores, debe asegurar calidad y coherencia
- **Pain Points:** Falta de visibilidad sobre planificaciones, dificultad para evaluar efectividad de entrenamientos
- **Goals:** Supervisar y validar planificaciones, acceder a reportes de progreso, mantener estándares de calidad

**Entrenador Novato** (20-35 años)
- **Rol:** Entrenador con poca experiencia
- **Contexto:** Necesita aprender y aplicar metodologías probadas
- **Pain Points:** Falta de conocimiento para crear planificaciones efectivas, inseguridad sobre ejercicios apropiados
- **Goals:** Acceder a planificaciones de entrenadores experimentados, aprender metodologías, ganar confianza

## The Problem

### Planificación Deportiva Fragmentada

Los entrenadores crean planificaciones aisladamente, reinventando constantemente ejercicios y metodologías ya probadas por otros. Esto resulta en pérdida de tiempo, inconsistencia en la calidad y aprovechamiento subóptimo del conocimiento colectivo deportivo.

**Nuestra Solución:** Marketplace de planificaciones donde entrenadores pueden compartir, valorar y reutilizar planificaciones completas con muy pocos clicks.

### Creación Manual Intensiva

Crear una planificación completa desde cero requiere semanas de trabajo: definir objetivos, buscar ejercicios, programar sesiones, calcular progresiones. Esto consume 70-80% del tiempo disponible del entrenador.

**Nuestra Solución:** Sistema de generación automática de entrenamientos basado en itinerarios predefinidos y planificaciones de la comunidad, reduciendo el tiempo de setup a minutos.

### Falta de Seguimiento Estructurado

Los entrenadores carecen de herramientas para hacer seguimiento efectivo del cumplimiento de objetivos y progreso real de sus planificaciones, resultando en entrenamientos sin rumbo claro.

**Nuestra Solución:** Dashboard de seguimiento en tiempo real con informes automáticos de progreso, cumplimiento de objetivos y análisis de efectividad.

## Differentiators

### Marketplace de Conocimiento Deportivo

A diferencia de aplicaciones genéricas de planificación, PlanSport crea una comunidad donde entrenadores experimentados comparten planificaciones completas valoradas por la comunidad. Esto permite acceso inmediato a metodologías probadas con sistema de rating de 5 estrellas.

### Configuración Ultra-Rápida

Mientras otras aplicaciones requieren configuración manual extensa, PlanSport permite crear planificaciones completas en 3 clicks: seleccionar deporte, elegir itinerario, generar entrenamientos automáticamente para todo el período.

### Multi-Deporte con Especialización

Unlike sport-specific apps, PlanSport maneja múltiples deportes manteniendo la especialización necesaria para cada uno, con conceptos, ejercicios y metodologías específicas por disciplina deportiva.

## Key Features

### Core Features

- **Autenticación con Supabase:** Sistema seguro de login con roles diferenciados (gratuito, entrenador, club)
- **Gestión de Equipos Multi-Nivel:** Creación de clubes, equipos con categorización por edad, género y nivel (A, B, C)
- **Conceptos y Objetivos Categorizados:** Sistema jerárquico de objetivos deportivos con categoría/subcategoría y nivel de dificultad
- **Planificaciones Inteligentes:** Creación automática basada en itinerarios o configuración manual de conceptos

### Collaboration Features

- **Marketplace de Planificaciones:** Importar y compartir planificaciones con sistema de valoración comunitaria
- **Ejercicios Vinculados:** Base de datos de ejercicios conectados a conceptos específicos para entrenamiento efectivo
- **Gestión de Permisos:** Sistema granular de permisos por usuario y equipo dentro de organizaciones
- **Calendario Integrado:** Vista de entrenamientos pasados y futuros con restricciones de modificación

### Advanced Features

- **Generación Automática de Entrenamientos:** Creación completa de sesiones para período definido basado en planificación
- **Vista Dinámica de Entrenamiento:** Interfaz paso a paso con cronómetro para ejecución en tiempo real
- **Reportes y Analytics:** Informes de distribución de objetivos, progreso y cumplimiento de planificaciones
- **Personalización vs Templates:** Balance entre facilidad de uso (pocos clicks) y personalización avanzada

## Subscription Model

### Versión Gratuita (0€)
- 1 equipo máximo
- 15 entrenamientos límite
- Acceso básico a marketplace
- Funcionalidades esenciales

### Versión Entrenador
- Equipos ilimitados para un entrenador
- Conceptos personalizados
- Itinerarios propios
- Entrenamientos ilimitados
- Acceso completo a marketplace

### Versión Club
- Gestión de múltiples equipos
- Rol de director para validación
- Usuarios adicionales sin suscripción propia
- Funcionalidades avanzadas de supervisión
- Analytics organizacionales

## Technical Architecture

### Multi-Tenancy y Permisos
- Usuarios pueden tener suscripción gratuita + una suscripción premium simultáneamente
- Sistema de roles: Administrador, Director, Entrenador con permisos granulares por equipo
- Usuarios invitados (sin suscripción) con acceso limitado asignado por administradores

### Data Relationships
- Club → Múltiples Equipos
- Equipo → Múltiples Planificaciones (many-to-many)
- Planificación → Conceptos directos o Itinerarios (que contienen conceptos)
- Conceptos → Múltiples Ejercicios (many-to-many)
- Sistema de visibilidad con flags para ocultar equipos/planificaciones obsoletas