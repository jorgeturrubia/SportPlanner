# ADR-002: Eleccion de Angular + .NET sobre alternativas

**Fecha:** 2025-11-14  
**Estado:** Aprobado  
**Decisores:** Equipo SportPlanner  
**Contexto:** Necesitamos elegir el stack tecnologico para frontend y backend

---

## Contexto y Problema

SportPlanner requiere:
- **Frontend:** Editor visual complejo (canvas), formularios avanzados, dashboard con graficos
- **Backend:** API REST robusta, manejo de logica de negocio compleja (algoritmo progresion)
- **Equipo:** 1 desarrollador part-time con experiencia en TypeScript y C#
- **Timeline:** MVP en 5-6 meses
- **Escalabilidad:** De 100 a 500+ usuarios en el primer ano

Necesitamos un stack que equilibre:
- Velocidad de desarrollo (DX)
- Mantenibilidad a largo plazo
- Escalabilidad tecnica
- Costo razonable

---

## Opciones Consideradas

### Opcion 1: Angular + .NET (ELEGIDA)

**Frontend:** Angular 20+ con TypeScript  
**Backend:** .NET 8 con C#

**Pros:**
- TypeScript end-to-end (Angular) + C# type-safe (similar)
- Angular es empresarial, estructura clara, escalable
- .NET tiene performance excepcional (top 3 en benchmarks)
- Ecosistemas maduros (NPM + NuGet)
- Soporte LTS (.NET 8 hasta 2026)
- Experiencia del equipo (conoce ambos)
- Entity Framework Core para ORM robusto
- Inyeccion de dependencias nativa en ambos

**Contras:**
- Angular tiene curva de aprendizaje mas pronunciada que React
- .NET es mas "pesado" que Node.js (pero no importa en PaaS)
- Dos lenguajes distintos (TypeScript vs C#)

**Costo de infraestructura:** $5-6/mes (Railway + Vercel)

---

### Opcion 2: React + Node.js

**Frontend:** React 18+ con TypeScript  
**Backend:** Node.js + NestJS con TypeScript

**Pros:**
- Un solo lenguaje (TypeScript) end-to-end
- React tiene ecosistema mas grande que Angular
- Node.js es rapido para I/O-bound operations
- NestJS tiene estructura similar a Angular (familiar)
- Menor curva de aprendizaje (React es mas simple)

**Contras:**
- React requiere mas decisiones (state management, routing, etc.)
- Node.js no es ideal para CPU-intensive tasks (algoritmo progresion)
- Performance inferior a .NET para logica de negocio compleja
- Menos estructurado que Angular (equipo de 1 persona necesita disciplina)

**Costo de infraestructura:** $5-6/mes (similar)

---

### Opcion 3: Vue + Laravel

**Frontend:** Vue 3 con TypeScript  
**Backend:** Laravel (PHP)

**Pros:**
- Vue es mas simple que Angular/React
- Laravel tiene ORM excelente (Eloquent)
- Desarrollo rapido con convenciones Laravel

**Contras:**
- Equipo NO tiene experiencia con PHP/Laravel
- PHP tiene estigma (aunque Laravel es excelente)
- Ecosistema menor que TypeScript/C#
- Performance inferior a .NET

**Costo de infraestructura:** $8-10/mes (hosting PHP mas caro)

---

### Opcion 4: Full-Stack JavaScript (Next.js + Supabase Edge Functions)

**Frontend:** Next.js 15 (React framework)  
**Backend:** Supabase Edge Functions (Deno)

**Pros:**
- Un solo lenguaje (TypeScript/JavaScript)
- Next.js es moderno y rapido
- Supabase maneja mucho (menos codigo backend)
- Serverless (escalado automatico)

**Contras:**
- Edge Functions son inmaduras (Deno, no Node.js)
- Vendor lock-in total a Supabase
- Logica de negocio compleja dificil en Edge Functions
- Menos control sobre backend

**Costo de infraestructura:** $0-5/mes (Supabase free tier)

---

## Decision

**Elegimos Opcion 1: Angular + .NET**

**Razones principales:**

1. **Experiencia del equipo:** Ya conoce TypeScript y C#, sin curva de aprendizaje
2. **Performance:** .NET es superior para logica compleja (algoritmo progresion, calculos)
3. **Estructura:** Angular fuerza buenas practicas (importante para equipo de 1)
4. **Type-safety:** TypeScript + C# minimizan bugs en tiempo de compilacion
5. **Ecosistemas maduros:** NPM + NuGet son gigantes, cualquier problema tiene solucion
6. **LTS:** .NET 8 tiene soporte hasta 2026, estabilidad garantizada
7. **Escalabilidad:** Ambos escalan bien (Angular con lazy loading, .NET con async/await)
8. **Separacion clara:** Frontend y Backend totalmente desacoplados (facil distribuir trabajo si crece equipo)

---

## Consecuencias

**Positivas:**
- Desarrollo rapido gracias a experiencia previa
- Codigo type-safe reduce bugs
- Estructura clara facilita mantenimiento
- Performance excelente desde el inicio
- Facil contratar desarrolladores (Angular y .NET son populares)

**Negativas:**
- Dos lenguajes (aunque similares en filosofia)
- Angular es mas "pesado" que React (pero no importa con lazy loading)
- .NET requiere mas RAM que Node.js (pero Railway lo maneja bien)

**Mitigacion de riesgos:**
- Usar standalone components de Angular (reduce complejidad)
- Lazy loading agresivo (chunks pequenos)
- Monitoreo de performance desde dia 1 (Sentry)

---

## Alternativas futuras

Si el proyecto crece y necesita optimizaciones:
- Considerar microservicios (.NET + Node.js para tareas especificas)
- Migrar logica intensiva a Rust/Go (si .NET no es suficiente)
- Cachear con Redis (Railway tiene plugin)

---

## Referencias

- Benchmarks .NET vs Node.js: https://www.techempower.com/benchmarks/
- Angular 20 Standalone: https://angular.dev/guide/components/importing
- .NET 8 LTS: https://dotnet.microsoft.com/platform/support/policy

---

**Firma:** Aprobado por equipo SportPlanner  
**Fecha:** 2025-11-14
