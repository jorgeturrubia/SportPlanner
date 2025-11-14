# ADR-003: Eleccion de Supabase como BaaS

**Fecha:** 2025-11-14  
**Estado:** Aprobado  
**Decisores:** Equipo SportPlanner  
**Contexto:** Necesitamos elegir como manejar autenticacion, storage y base de datos

---

## Contexto y Problema

SportPlanner necesita:
- **Autenticacion:** Registro, login, JWT tokens, refresh tokens
- **Storage:** Imagenes de ejercicios (thumbnails), canvas exportados
- **Base de Datos:** PostgreSQL con Row Level Security (RLS)
- **Realtime (Fase 2):** Notificaciones en tiempo real para Director -> Entrenadores

Restricciones:
- Presupuesto minimo (MVP debe ser < $10/mes)
- Equipo de 1 persona (no tiempo para implementar auth desde cero)
- Seguridad multi-tenant critica (cada usuario solo ve sus datos)

---

## Opciones Consideradas

### Opcion 1: Supabase (ELEGIDA)

**Servicios:** Auth + Storage + PostgreSQL + Realtime

**Pros:**
- PostgreSQL nativo con RLS (Row Level Security)
- Auth ya resuelto (email/password, JWT, refresh tokens)
- Storage con CDN integrado
- Realtime via WebSocket (PostgreSQL pub/sub)
- Dashboard para queries y gestion
- Open-source (no total vendor lock-in)
- **Free tier generoso:**
  - 50,000 usuarios activos mensuales
  - 500MB storage
  - 2GB bandwidth
  - Autenticacion ilimitada
- Integracion facil con .NET y Angular

**Contras:**
- Vendor lock-in parcial (aunque es open-source)
- Realtime puede tener latencia (no critico para SportPlanner)
- Menos maduro que AWS/Azure

**Costo:** $0/mes (free tier) hasta ~500 usuarios

---

### Opcion 2: Firebase

**Servicios:** Auth + Storage + Firestore

**Pros:**
- Muy maduro (Google)
- Ecosistema gigante
- Realtime Database excelente
- Free tier generoso

**Contras:**
- **Firestore es NoSQL** (SportPlanner necesita SQL para relaciones complejas)
- Queries limitadas (no JOINs nativos)
- Migracion a SQL seria costosa
- Sin RLS nativo (seguridad manual)

**Costo:** $0/mes inicial, pero escala caro

**Razon de descarte:** NoSQL no es adecuado para modelo de datos relacional complejo (planificaciones -> objetivos -> ejercicios -> sesiones)

---

### Opcion 3: Auth0 + AWS S3 + RDS PostgreSQL

**Servicios:** Auth0 (auth) + S3 (storage) + RDS (PostgreSQL)

**Pros:**
- Mejor en su clase cada uno
- Auth0 es el estandar de autenticacion
- S3 es el mas confiable
- RDS PostgreSQL es robusto

**Contras:**
- **3 servicios separados** (complejidad de integracion)
- Configuracion compleja (RLS manual)
- Costo mas alto ($25-30/mes minimo)
- Overhead de mantenimiento

**Costo:** $25-30/mes (Auth0 $23 + S3 $3 + RDS $15)

**Razon de descarte:** Demasiado complejo y caro para MVP de 1 persona

---

### Opcion 4: Implementar Auth propio + S3 + PostgreSQL (Railway)

**Servicios:** Auth custom (.NET) + S3 + PostgreSQL (Railway)

**Pros:**
- Control total
- Sin vendor lock-in
- Costo razonable ($8-10/mes)

**Contras:**
- **Mucho tiempo de desarrollo** (auth seguro requiere semanas)
- Riesgo de bugs de seguridad (auth es dificil)
- Mantenimiento continuo (refresh tokens, password reset, etc.)
- No es core business (reinventar la rueda)

**Costo:** $8-10/mes (Railway + S3)

**Razon de descarte:** No vale la pena gastar 2-3 semanas implementando auth cuando Supabase lo da gratis

---

## Decision

**Elegimos Opcion 1: Supabase**

**Razones principales:**

1. **PostgreSQL nativo:** SportPlanner necesita SQL (relaciones complejas), no NoSQL
2. **RLS built-in:** Seguridad multi-tenant sin codigo backend adicional
3. **Auth gratis:** No gastar 2-3 semanas implementando auth desde cero
4. **Storage integrado:** Un solo proveedor para todo
5. **Free tier generoso:** Soporta MVP completo sin costo
6. **DX excelente:** Dashboard, SDK bien documentado, comunidad activa
7. **Realtime ready:** Cuando Fase 2 llegue, ya esta disponible
8. **Open-source:** Si Supabase falla, podemos self-host PostgreSQL

---

## Estrategia de Uso

### Fase 1 (MVP):
- Supabase Auth para login/registro
- Supabase Storage para imagenes
- Supabase PostgreSQL para datos
- **Backend .NET** sigue manejando logica de negocio (no serverless)

### Fase 2:
- Supabase Realtime para notificaciones Director -> Entrenadores

### Migracion futura (si necesario):
- Auth: Migrar a Auth0 (JWT tokens son estandar)
- Storage: Migrar a AWS S3 (URLs cambian, pero migracion simple)
- DB: Exportar PostgreSQL dump, importar a RDS

---

## Consecuencias

**Positivas:**
- Desarrollo 3x mas rapido (auth ya resuelto)
- $0 costo en MVP
- Seguridad robusta (RLS + Auth de Supabase)
- Escalabilidad hasta 50K usuarios sin cambios

**Negativas:**
- Vendor lock-in parcial (mitigado por ser open-source)
- Si Supabase tiene downtime, afecta a SportPlanner
- Menos control sobre infraestructura

**Mitigacion de riesgos:**
- Backups diarios de PostgreSQL (Supabase los hace automatico)
- Monitoreo de uptime (Sentry + status.supabase.com)
- Plan de migracion documentado (si Supabase falla)

---

## Integracion con .NET Backend

**Backend .NET NO usa Supabase Edge Functions**, solo:
- Valida JWT tokens generados por Supabase Auth
- Accede directamente a PostgreSQL (via Entity Framework)
- Sube imagenes a Supabase Storage (via SDK)

**Ventajas de este enfoque:**
- Logica de negocio en .NET (mas robusto que Edge Functions)
- Supabase solo maneja auth + storage (su fuerte)
- Migracion facil si necesario (backend desacoplado)

---

## Referencias

- Supabase Docs: https://supabase.com/docs
- Supabase vs Firebase: https://supabase.com/alternatives/supabase-vs-firebase
- Row Level Security: https://supabase.com/docs/guides/auth/row-level-security

---

**Firma:** Aprobado por equipo SportPlanner  
**Fecha:** 2025-11-14
