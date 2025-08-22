# PlanSport - Sistema de Gestión Deportiva

## Stack Tecnológico
- **Frontend**: Angular 20 (standalone components, signals, modern control flow)
- **Backend**: .NET 8 (Clean Architecture, minimal APIs, DDD patterns)
- **Database**: Supabase (PostgreSQL, RLS, real-time)
- **Styling**: Tailwind CSS v4 (modern syntax, responsive design)
- **Icons**: Hero Icons (SVG implementation)

## Agentes Especializados Disponibles

### 🎯 stack-coordinator
Coordinador principal que orquesta todo el workflow y delega a agentes especializados.

### 📱 angular-specialist
Experto en Angular 20 con standalone components, signals y control flow moderno (@if/@for).

### 🔧 api-architect
Especialista en .NET 8 Clean Architecture con DDD, CQRS, Repository pattern y código limpio.

### 🏗️ clean-code-architect
Experto en principios SOLID, patrones de diseño, código limpio y arquitectura maintible.

### 📊 business-analyst
Analista de dominio que traduce requerimientos de negocio a especificaciones técnicas.

### 🔗 integration-validator
Valida la integración end-to-end entre frontend, backend y base de datos.

### 🗄️ supabase-manager
Gestiona esquemas de base de datos, RLS policies y subscripciones real-time.

### 🎨 ui-designer
Experto en Tailwind CSS v4, Hero Icons y diseño responsive moderno.

## Comandos Disponibles

### Desarrollo
- `/init-stack [nombre]` - Inicializar proyecto completo
- `/create-clean-architecture [nombre]` - Crear arquitectura limpia .NET 8
- `/generate-domain-entity [entidad] [descripción]` - Generar entidad rica del dominio
- `/generate-cqrs-feature [feature] [operación]` - Implementar CQRS completo
- `/create-feature [nombre] [descripción]` - Crear feature completa
- `/validate-stack` - Validar compatibilidad integral
- `/fix-integration` - Debug de problemas de integración
- `/stack-status` - Estado completo del sistema
- `/configure-domain [tipo] [proyecto] [descripción]` - Configurar contexto de dominio
- `/analyze-domain [dominio] [descripción]` - Análisis de dominio específico

## Arquitectura .NET 8 Clean Architecture

### Capas de la Arquitectura
1. **Domain Layer** - Entidades ricas, value objects, agregados, eventos de dominio
2. **Application Layer** - CQRS, commands, queries, validación, DTOs
3. **Infrastructure Layer** - Repositories, EF Core, servicios externos
4. **API Layer** - Minimal APIs, endpoints, middleware
5. **Shared Kernel** - Utilidades comunes, extensiones

### Patrones Implementados
- **Domain-Driven Design (DDD)** - Modelado rico del dominio
- **CQRS** - Separación de comandos y consultas
- **Repository Pattern** - Abstracción de acceso a datos
- **Unit of Work** - Gestión de transacciones
- **Specification Pattern** - Consultas complejas encapsuladas
- **Result Pattern** - Manejo de errores sin excepciones
- **Domain Events** - Comunicación entre agregados
- **Strongly Typed IDs** - Evitar primitive obsession

### Principios SOLID Aplicados
- **SRP**: Una responsabilidad por clase
- **OCP**: Abierto para extensión, cerrado para modificación
- **LSP**: Subtipos sustituibles
- **ISP**: Interfaces segregadas y cohesivas
- **DIP**: Dependencias hacia abstracciones

## Estándares de Desarrollo

### .NET 8 Clean Architecture
- ✅ Entidades ricas con lógica de negocio
- ✅ Value objects para conceptos del dominio
- ✅ Agregados con consistencia transaccional
- ✅ CQRS con MediatR
- ✅ Validación con FluentValidation
- ✅ Mapeo con AutoMapper
- ✅ Repository pattern con especificaciones
- ✅ Unit of Work para transacciones
- ✅ Domain events para desacoplamiento
- ✅ Result pattern para manejo de errores

### Angular 20
- ✅ Componentes standalone únicamente
- ✅ Signals para manejo de estado
- ✅ Control flow moderno (@if/@for/@switch)
- ✅ Formularios tipados y reactivos
- ✅ Lazy loading con loadComponent
- ✅ OnPush change detection

### Supabase
- ✅ Row Level Security en todas las tablas
- ✅ Constraints y validaciones apropiadas
- ✅ Índices en foreign keys
- ✅ Triggers para updated_at
- ✅ Funciones PostgreSQL para lógica compleja
- ✅ Real-time solo en tablas necesarias

### Tailwind CSS v4
- ✅ Sintaxis moderna v4
- ✅ Diseño mobile-first
- ✅ Dark mode support
- ✅ Hero Icons como SVG inline
- ✅ Accessibility-first
- ✅ Utilidades de performance

## Contexto de Dominio Deportivo

### Entidades Principales
- **Athlete** - Atleta con métricas de rendimiento
- **Coach** - Entrenador con especialización deportiva
- **TrainingPlan** - Plan de entrenamiento estructurado
- **TrainingSession** - Sesión individual de entrenamiento
- **PerformanceMetric** - Métrica de rendimiento del atleta
- **Team** - Equipo deportivo con roster de atletas

### Reglas de Negocio
- Los atletas solo pueden tener un plan de entrenamiento activo
- Las sesiones de entrenamiento no pueden solaparse
- Las métricas de rendimiento deben estar en rangos válidos
- Los entrenadores solo pueden ver sus atletas asignados
- La intensidad de entrenamiento debe progresar gradualmente

### APIs de Negocio
- `/api/athletes` - Gestión de atletas
- `/api/coaches` - Gestión de entrenadores
- `/api/training/plans` - Planes de entrenamiento
- `/api/training/sessions` - Sesiones de entrenamiento
- `/api/performance/metrics` - Métricas de rendimiento
- `/api/teams` - Gestión de equipos

## Integración y Compatibilidad

### Validaciones Automáticas
- ❌ Bloquea violaciones de principios SOLID
- ❌ Previene dependencias incorrectas entre capas
- ❌ Detecta primitive obsession
- ❌ Identifica falta de encapsulación en entidades
- ❌ Valida que commands y queries estén separados
- ❌ Verifica que repositories implementen especificaciones

## Flujo de Desarrollo Arquitectural

1. **Análisis de Dominio**: `/analyze-domain sports "Gestión deportiva avanzada"`
2. **Arquitectura Limpia**: `/create-clean-architecture PlanSport`
3. **Entidad de Dominio**: `/generate-domain-entity Athlete "Atleta con métricas"`
4. **Feature CQRS**: `/generate-cqrs-feature AthleteManagement "CRUD completo"`
5. **Validación**: `/validate-stack`

¡El sistema está completamente preparado para desarrollo con Clean Architecture y código limpio! 🚀
