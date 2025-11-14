# ESTADO DEL PROYECTO - SportPlanner

**Ultima actualizacion:** 2025-11-14  
**Version documentacion:** 1.0

---

## RESUMEN EJECUTIVO

### Fase Actual: FASE 2 - Requisitos y Diseno de Producto

**Progreso global:** 40% completo

| Fase | Estado | Completitud |
|------|--------|-------------|
| Fase 1: Vision y Objetivos | ✅ COMPLETADO | 100% |
| Fase 2: Requisitos y Diseno | 🔄 EN PROGRESO | 60% |
| Fase 3: Arquitectura Tecnica | ⏳ PENDIENTE | 0% |
| Fase 4: Planificacion | ⏳ PENDIENTE | 0% |
| Fase 5: Operaciones | ⏳ PENDIENTE | 0% |

---

## DOCUMENTOS CREADOS

### Documentacion de Negocio (/docs/negocio/)

1. **✅ 01-vision-objetivos.md** - COMPLETO
   - Proposito del producto (elevator pitch)
   - 5 objetivos de negocio con KPIs medibles
   - Funcionalidades core (Must-Have, Should-Have, Could-Have)
   - Exclusiones (7 items fuera de alcance MVP)
   - Modelo de negocio (5 planes: Free a Club)
   - Stakeholders y matriz RACI
   - Restricciones del proyecto

2. **✅ 02-user-personas.md** - COMPLETO
   - Persona 1: Carlos - Entrenador Amateur (usuario primario)
   - Persona 2: Laura - Directora Deportiva (usuario secundario Fase 3)
   - Perfiles demograficos completos
   - Objetivos, frustraciones, motivaciones, barreras
   - Escenarios de uso tipicos (user journeys)
   - Implicaciones de diseno

3. **⏳ 03-user-stories.md** - PENDIENTE
   - 20 User Stories Must-Have ya definidas en conversacion
   - Falta: persistir en documento .md
   - Falta: agrupar en epicas
   - Falta: estimaciones detalladas

4. **🔄 04-modelo-negocio.md** - EN PROGRESO (draft created)
   - Expansion del modelo de pricing
   - Estrategia de monetizacion por fases
   - Proyecciones financieras basicas

5. **🔄 05-roadmap.md** - EN PROGRESO (skeleton created)
   - Timeline de 12-18 meses
   - Hitos y milestones
   - Dependencias criticas

6. **🔄 06-metodologia.md** - EN PROGRESO (skeleton created)
   - Framework agil (Scrum/Kanban)
   - Ceremonias
   - Definition of Done

### Documentacion Tecnica (/docs/tecnico/)

1. **⏳ 01-stack-tecnologico.md** - PENDIENTE
   - Frontend: Angular 20+, Tailwind 4
   - Backend: .NET 8, EF Core
   - Base de datos: Supabase (PostgreSQL)
   - Hosting y DevOps

2. **✅ 02-modelo-datos.md** - COMPLETO
   - **Decision Arquitectonica:** Modelo Separado Marketplace ✅
   - 13 tablas documentadas:
     - 4 tablas marketplace (planificaciones, sesiones, ejercicios, objetivos)
     - 7 tablas user (planificaciones, sesiones, ejercicios, objetivos + relaciones M-N)
     - 2 tablas tracking (imports, ratings)
   - RLS (Row Level Security) definido
   - Indices optimizados
   - Funciones y triggers
   - Diagrama ER completo

3. **🔄 03-arquitectura-marketplace.md** - EN PROGRESO (draft created)
   - Logica de importacion detallada
   - Flujos de sincronizacion
   - Estrategia de versionado

4. **🔄 04-api-contracts.md** - EN PROGRESO (starter created)
   - Endpoints REST documentados
   - Request/Response schemas
   - Codigos de error

5. **🔄 05-algoritmo-progresion.md** - EN PROGRESO (draft created)
   - **CRITICO:** Algoritmo de distribucion automatica de objetivos
   - Logica de dependencias (objetivos padre-hijo)
   - Calculo de semanas optimas por dificultad

### Documentacion de Arquitectura (/docs/arquitectura/)

1. **🔄 01-diagramas.md** - EN PROGRESO (skeleton created)
   - Diagrama de contexto (C4 Level 1)
   - Diagrama de contenedores (C4 Level 2)
   - Diagramas de flujo de datos

2. **⏳ ADR/** (Architecture Decision Records) - PENDIENTE
   - ADR-001: Modelo Separado Marketplace (ya definido en 02-modelo-datos.md)
   - ADR-002: Angular 20+ vs React
   - ADR-003: .NET 8 vs Node.js
   - ADR-004: Supabase vs Firebase

---

## DECISIONES CLAVE TOMADAS

### 1. Modelo de Negocio ✅

| Plan | Precio | Target |
|------|--------|--------|
| Free | 0 euros | Periodo prueba |
| Personal | 5,99 euros/mes | Entrenadores individuales |
| Pro | 9,99 euros/mes | + Marketplace completo |
| Director | 15,99 euros/mes | + Gestion equipos |
| Club | 19,99 euros/mes | + CRM + Licencias multiples |

**Estrategia de lanzamiento:** MVP con Free + Personal (primeros 6 meses)

---

### 2. Deportes Soportados (MVP) ✅

1. **Futbol** (11v11, 7v7, 5v5)
2. **Baloncesto** (5v5, 3v3)
3. **Balonmano** (7v7, 6v6)

**Expansion futura:** Voleibol, Rugby, Hockey

---

### 3. Arquitectura de Datos - Marketplace ✅

**Decision:** Modelo Separado con Trazabilidad

**Tablas:**
- `marketplace_*` (contenido del sistema/comunidad)
- `user_*` (contenido del usuario, copias editables)
- `user_marketplace_imports` (log de importaciones)

**Razon:** 
- Separacion clara de concerns
- Usuario puede editar sin afectar originales
- Trazabilidad completa (campo `source_marketplace_id`)
- RLS (Row Level Security) simple

**Flujo de importacion:**
1. Usuario ve contenido en marketplace
2. Click "Importar" → Sistema copia a tablas `user_*`
3. Usuario edita su copia (flag `fue_modificado` = true)
4. Original del marketplace intacto

---

### 4. Stack Tecnologico (Definido, pendiente documentar) ⏳

**Frontend:**
- Angular 20+ (signals, standalone components)
- TypeScript 5+
- Tailwind CSS 4
- Animaciones: Angular Animations / GSAP

**Backend:**
- .NET 8
- Entity Framework Core
- ASP.NET Core Web API

**Base de Datos:**
- PostgreSQL (via Supabase)
- Row Level Security (RLS)
- Realtime subscriptions (Supabase)

**Auth:**
- Supabase Auth (JWT)

**Hosting:**
- Frontend: Vercel (o Angular Universal en Railway)
- Backend: Railway / Azure App Service
- DB: Supabase (managed PostgreSQL)
- Storage: Supabase Storage (imagenes/thumbnails)

---

## PROXIMOS PASOS

### Inmediato (Siguiente sesion)

1. **✍️ Persistir User Stories en 03-user-stories.md**
   - 20 stories Must-Have ya definidas
   - Agrupar en 8 epicas
   - Anadir criterios de aceptacion detallados

2. **✍️ Crear 05-algoritmo-progresion.md**
   - **CRITICO:** Definir logica del algoritmo
   - Input: objetivos + dependencias + duracion temporada
   - Output: distribucion por semanas
   - Pseudocodigo o flowchart

3. **✍️ Crear 01-stack-tecnologico.md**
   - Documentar stack completo
   - Justificaciones (ADRs)
   - Setup inicial

### Corto plazo (Proximas 2-3 sesiones)

4. **Requisitos No Funcionales (NFRs)**
   - Performance (< 2s carga, < 500ms API)
   - Escalabilidad (500 usuarios concurrentes)
   - Seguridad (OWASP Top 10)

5. **API Contracts**
   - Endpoints REST completos
   - OpenAPI/Swagger spec

6. **Diagramas de Arquitectura**
   - C4 Model (Context, Containers)
   - Flujos de datos
   - Canvas visual (arquitectura del editor)

### Medio plazo (Proximas semanas)

7. **Roadmap detallado**
   - Timeline 12-18 meses
   - Fases con hitos
   - Estimaciones de esfuerzo

8. **Metodologia y Definition of Done**
   - Framework agil
   - Sprints y ceremonias
   - Backlog inicial (exportable a Jira/Linear)

9. **Plan de Testing**
   - Estrategia de pruebas
   - Cobertura minima
   - CI/CD basico

---

## PENDIENTES CRITICOS

### Decisiones Tecnicas Necesarias

1. **Editor Visual (Canvas):**
   - ¿Libreria? (Fabric.js, Konva.js, Canvas nativo, SVG?)
   - ¿Como almacenar animaciones en JSON?
   - ¿Como renderizar en modo reproduccion?

2. **Algoritmo de Progresion:**
   - ¿Como calcular semanas optimas por objetivo?
   - ¿Como manejar dependencias (grafo dirigido)?
   - ¿Machine learning futuro o reglas heuristicas?

3. **Sincronizacion Offline (PWA):**
   - ¿MVP necesita offline?
   - ¿Service Workers para cache?

4. **Autenticacion Social:**
   - ¿Login con Google/Apple en MVP?
   - ¿Solo email/password?

---

## RIESGOS IDENTIFICADOS

| Riesgo | Probabilidad | Impacto | Mitigacion |
|--------|--------------|---------|------------|
| Complejidad del editor visual (canvas) | Alta | Alto | Usar libreria probada (Fabric.js), MVP con funcionalidad basica |
| Algoritmo de progresion demasiado complejo | Media | Alto | Empezar con reglas simples, iterar con feedback de usuarios |
| Desarrollo part-time lento (1 persona) | Alta | Medio | Priorizacion extrema, usar servicios managed (Supabase) |
| Marketplace vacio al lanzar | Media | Medio | Crear 50-100 ejercicios semilla antes de lanzar |
| Adopcion baja de usuarios | Media | Alto | Beta con 10-20 entrenadores reales, iterar antes de lanzamiento publico |

---

## METRICAS DE PROGRESO

### Documentacion

- **Documentos completados:** 3/15 (20%)
- **Secciones criticas completadas:** 2/5 (40%)
  - ✅ Vision y Objetivos
  - ✅ Modelo de Datos
  - ⏳ User Stories
  - ⏳ Algoritmo de Progresion
  - ⏳ Stack Tecnologico

### Claridad del Proyecto

- **Vision:** ✅ Clara (9/10)
- **Modelo de negocio:** ✅ Definido (8/10)
- **Arquitectura de datos:** ✅ Completa (9/10)
- **Stack tecnologico:** ⏳ Parcial (6/10)
- **Roadmap:** ⏳ Pendiente (2/10)

---

## CONTACTO Y SIGUIENTE SESION

**Para continuar la documentacion:**

¿Que quieres que hagamos en la proxima sesion?

1. **Opcion A:** Persistir las 20 User Stories + crear documento 03-user-stories.md
2. **Opcion B:** Definir el Algoritmo de Progresion (critico para MVP)
3. **Opcion C:** Documentar el Stack Tecnologico completo + ADRs
4. **Opcion D:** Crear diagramas de arquitectura (C4 Model)
5. **Opcion E:** Roadmap detallado con timeline

**Recomendacion:** Opcion B (Algoritmo de Progresion) es la decision mas critica y compleja. Cuanto antes la definamos, mejor.

---

**Version:** 1.0  
**Ultima actualizacion:** 2025-11-14