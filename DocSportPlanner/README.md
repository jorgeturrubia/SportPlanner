# SPORTPLANNER - Documentacion Completa del Proyecto

> **Sistema de Planificacion Deportiva para Entrenadores Amateurs**

---

## Resumen Ejecutivo

**SportPlanner** es una plataforma de planificacion deportiva que permite a entrenadores de nivel amateur crear planificaciones progresivas y entrenamientos visuales de forma rapida y eficiente, con acceso a un marketplace de contenidos validados por la comunidad.

**Proposito en 1 linea:**
"Crea entrenamientos progresivos en 30 minutos (no 4 horas) con un editor visual tipo 'cancha digital' y marketplace de ejercicios validados."

---

## Metricas Clave

- **Usuarios objetivo MVP:** 500 entrenadores en 12 meses
- **Plazo de lanzamiento MVP:** 12 meses (desarrollo part-time)
- **Equipo:** 1 persona (fundador/desarrollador part-time)
- **Stack principal:** Angular 20+ / .NET 10 / Supabase (PostgreSQL)

---

## Modelo de Negocio

| Plan | Precio | Descripcion |
|------|--------|-------------|
| **Free** | 0 euros | Periodo prueba limitado, 1 planificacion |
| **Personal** | 5,99 euros/mes | Equipos y planificaciones ilimitadas |
| **Pro** | 9,99 euros/mes | + Acceso completo Marketplace |
| **Director** | 15,99 euros/mes | + Gestion equipos + Director deportivo |
| **Club** | 19,99 euros/mes | + CRM completo + Licencias multiples |

**Estrategia de lanzamiento:** MVP con Free + Personal (primeros 6 meses)

---

## Deportes Soportados (MVP)

1. Futbol (11v11, 7v7, 5v5)
2. Baloncesto (5v5, 3v3)
3. Balonmano (7v7, 6v6)

---

## Estructura de Documentacion

### 1. Documentacion de Negocio
- [Vision y Objetivos](docs/01-vision-negocio.md)
- [Reglas de Negocio](docs/negocio/)
- [Casos de Uso](docs/negocio/)

### 2. Documentacion Tecnica
- [Stack Tecnologico](docs/tecnico/StackTecnologico.md)
- [Modelo de Datos](docs/tecnico/ModeloDatos.md)
- **[Tailwind CSS v4 - Guía de Estilos](docs/tecnico/TailwindCSS.md)** ⭐ NUEVO
- [OpenAPI Specification](docs/tecnico/openapi.yaml)

### 3. Arquitectura
- [Decisiones Arquitectonicas (ADR)](docs/ADR/)
- [Diagramas de Arquitectura](docs/arquitectura/)

### 4. Guías para Agentes de IA
- **[Backend - AGENTS.MD](../back/AGENTS.MD)** - Guía completa .NET 10 + EF Core
- **[Frontend - AGENTS.MD](../front/AGENTS.md)** - Guía completa Angular 20 + Tailwind CSS v4
- **[.NET 10 Best Practices](../back/dotnet10-best-practices.md)**
- **[TypeScript Best Practices](../back/typescript-best-practices.md)**

---

## 🎨 Stack Tecnológico Frontend

### Angular 20 + Tailwind CSS v4

**Decisiones clave de diseño:**

1. **Tailwind CSS v4 como único framework de estilos**
   - ✅ Utility-first approach para consistencia
   - ✅ Dark mode nativo (class-based)
   - ✅ Performance con tree-shaking automático
   - 📖 **[Documentación completa](docs/tecnico/TailwindCSS.md)**

2. **Modo Light y Dark obligatorio**
   - Todos los componentes deben soportar ambos modos
   - Uso de clases `dark:` de Tailwind
   - Toggle de tema persistido en localStorage

3. **Componentización exhaustiva**
   - Atomic Design (atoms, molecules, organisms)
   - Componentes reutilizables en `shared/components/`
   - Separación obligatoria: `.ts`, `.html`, `.scss`

4. **Control Flow moderno**
   - Bloques `@if`, `@for`, `@switch` (no `*ngIf`, `*ngFor`)
   - Signals para estado local
   - Standalone components por defecto

5. **MCP Server de Angular**
   - Acceso a best practices oficiales actualizadas
   - Búsqueda en documentación oficial (angular.dev)
   - **Obligatorio consultar antes de programar**

📖 **Ver guía completa:** [front/AGENTS.md](../front/AGENTS.md)

---

## 🔧 Stack Tecnológico Backend

### .NET 10 + EF Core 10 + PostgreSQL

**Decisiones clave de arquitectura:**

1. **Clean Architecture monolítica**
   - Domain Layer (Models)
   - Application Layer (DTOs, Mappings, Validators)
   - Infrastructure Layer (Data, EF Core)
   - WebAPI Layer (Controllers)

2. **DTO-First approach**
   - ✅ NUNCA exponer entidades EF Core en APIs
   - ✅ AutoMapper para mapeos
   - ✅ FluentValidation para validación

3. **Entity Framework Core 10**
   - Code-First con Migrations
   - Repository Pattern para lógica compleja
   - Proyecciones en lugar de Include cuando sea posible

4. **Best Practices obligatorias**
   - Async/Await siempre
   - Logging estructurado (Serilog)
   - Dependency Injection (constructor injection)
   - Result Pattern para error handling

📖 **Ver guías completas:**
- [back/AGENTS.MD](../back/AGENTS.MD) - Guía de desarrollo
- [back/dotnet10-best-practices.md](../back/dotnet10-best-practices.md) - Patrones y antipatrones

---

## 📚 Documentación Adicional
- [User Personas](docs/negocio/UserPersonas.md)
- [User Stories](docs/negocio/UserStories.md)
- [Modelo de Negocio](docs/negocio/04-modelo-negocio.md)

### 2. Documentacion Tecnica
- [Stack Tecnologico](docs/tecnico/01-stack-tecnologico.md)
- [Modelo de Datos](docs/tecnico/02-modelo-datos.md)
- [Arquitectura Marketplace](docs/tecnico/03-arquitectura-marketplace.md)
- [API REST Contracts](docs/tecnico/04-api-contracts.md)
- [Algoritmo de Progresion](docs/tecnico/05-algoritmo-progresion.md)

### 3. Documentacion de Arquitectura
- [Diagramas de Arquitectura](docs/arquitectura/01-diagramas.md)
- [Decisiones Arquitectonicas (ADRs)](docs/arquitectura/ADR/)

### 4. Plan de Proyecto
- [Roadmap](docs/negocio/05-roadmap.md)
- [Metodologia Agil](docs/negocio/06-metodologia.md)

---

## Estado Actual

**Ultima actualizacion:** 2025-11-14

### Fase 1: Vision y Objetivos - COMPLETADO
- Proposito definido
- 5 objetivos con KPIs
- Funcionalidades core identificadas
- Exclusiones documentadas
- Modelo de negocio definido

### Fase 2: Requisitos y Diseno - EN PROGRESO
- User Personas: Completado (2 personas)
- User Stories: Completado (20 Must-Have)
- Modelo de Datos: Completado (estrategia marketplace)
- Requisitos No Funcionales: [docs/tecnico/03-nfrs.md](docs/tecnico/03-nfrs.md)
- Diseno UI/UX: Pendiente

### Fase 3: Arquitectura Tecnica - PENDIENTE
- Stack tecnologico
- Diagramas de arquitectura
- Patrones de diseno

### Fase 4: Planificacion - PENDIENTE
- Roadmap detallado
- Metodologia
- Backlog inicial

### Fase 5: Operaciones - PENDIENTE
- Estrategia de pruebas
- Monitoring

---

## Quick Start (Para Desarrolladores)

### Requisitos Previos
- Node.js 20+
- .NET 10 SDK
- Cuenta Supabase

### Configuracion
```bash
# Frontend (Angular)
cd frontend
npm install
ng serve

# Backend (.NET)
cd backend
dotnet restore
dotnet run
```

---

## Contacto y Equipo

| Rol | Nombre | Contacto |
|-----|--------|----------|
| Product Owner / Fundador | [Tu Nombre] | [Tu Email] |
| Tech Lead | [Tu Nombre] | [Tu Email] |
| Frontend Dev | [Tu Nombre] | [Tu Email] |
| Backend Dev | [Tu Nombre] | [Tu Email] |

---

## Licencia

[Definir licencia]

---

**Version:** 1.0  
**Ultima actualizacion:** 2025-11-14
