# Aplicación de Planificaciones Deportivas

## 1. Resumen del proyecto

Una aplicación para crear, compartir y ejecutar planificaciones deportivas. Permite a entrenadores y clubes definir **objetivos**, **conceptos**, **itinerarios**, **ejercicios** y generar **sesiones** automáticamente según una planificación (fechas, días, horas). Incluye un *marketplace* de planificaciones públicas y control de permisos multi-equipo.

---

## 2. Público objetivo / Roles

* **Usuario principal (Propietario de cuenta)**: se registra, crea suscripción, gestiona club/entidades y equipos.
* **Entrenador**: licencia para crear conceptos personalizados, itinerarios y entrenamientos ilimitados (según plan).
* **Director deportivo / Club**: gestiona múltiples equipos, valida resultados y asigna roles.
* **Usuario añadido (ayudante, jugador, staff)**: puede tener permisos de edición, sólo ver o ejecutar sesiones según lo asignado.
* **Administrador (sistema)**: gestión global, moderación de marketplace y suscripciones.

---

## 3. Modelado de datos (entidades principales y relaciones)

* **Usuario** — perfiles, datos de contacto y referencia a suscripción.
* **Organización / Club** — puede agrupar varios equipos.
* **Equipo** — atributos: `id`, `nombre`, `sexo` (M/F), `categoria_edad`, `nivel` (A/B/C), `activo` (bool), `club_id`.
* **Planificación** — `id`, `titulo`, `fecha_inicio`, `fecha_fin`, `dias_semana` (bitmask/array), `horas` (lista), `pista_completa` (bool), `publica` (bool).
* **Itinerario** — colección ordenada de conceptos reutilizables.
* **Concepto** — `id`, `nombre`, `categoria`, `subcategoria`, `nivel_dificultad`, `tiempo_estimado` (min), `creador_id` (app o usuario).
* **Ejercicio** — `id`, `titulo`, `descripcion`, `multimedia_url`, `duracion_estimada`, vinculo a 1..n conceptos.
* **Sesión** — `id`, `planificacion_id`, `equipo_id`, `fecha`, `lugar`, `orden_ejercicios` (json), `estado` (pendiente/completada), `editable` (solo futuras).
* **MarketplaceItem** — referencia a planificaciones públicas, `rating` (1..5), `downloads`.
* **Suscripción** — `tipo` (free, plus, club), `activo`, `fecha_inicio`, `fecha_fin`, `usuario_id` o `organizacion_id`.
* **Roles/Permisos** — asignaciones por (usuario, equipo/club) con `rol` y `alcance` (ver/editar/ejecutar).

Relaciones principales: `users` ⇄ `memberships` ⇄ `teams`; `teams` ⇄ `team_planification` ⇄ `planifications`; `planification` → `sessions`; `concepts` ⇄ `exercise_concept` ⇄ `exercises`.

---

## 4. Reglas de negocio clave y suscripciones (actualizado)

### Planes y límites

**Plan Free (Entrenador Joven – 0 €)**

* **Equipos**: hasta **1**.
* **Entrenamientos**: hasta **15** por equipo.
* **Conceptos/Ejercicios**: solo los predefinidos por la app.
* **Marketplace**: importar 1 planificación gratuita.
* **Usuarios añadidos**: ninguno.
* **Informes**: básicos (calendario + sesiones completadas).

**Plan Entrenador Plus (6 € / mes, IVA incl.)**

* **Equipos**: hasta **8**.
* **Entrenamientos**: ilimitados por equipo.
* **Conceptos/Ejercicios**: puede crear personalizados.
* **Marketplace**: importar y publicar planificaciones.
* **Usuarios añadidos**: 1 ayudante por equipo (rol limitado: ver/ejecutar).
* **Sesiones**: generación automática con itinerarios.
* **Informes**: ampliados (por equipo, % objetivos).

**Plan Club / Director Deportivo (Premium)**

* **Equipos**: ilimitados.
* **Entrenamientos**: ilimitados.
* **Conceptos/Ejercicios**: personalizados y compartidos en la organización.
* **Marketplace**: publicar e importar ilimitado.
* **Usuarios añadidos**: ilimitados con roles configurables (director, entrenador, ayudante, jugador).
* **Sesiones**: generación automática avanzada con reglas de coherencia.
* **Informes**: avanzados + validación de resultados por Director.

### Otras reglas clave

* Un usuario puede tener **como máximo 1 suscripción de pago activa**. Puede coexistir con una suscripción gratuita (por ejemplo para otra cuenta/uso) pero la app controlará límites por cuenta/organización.
* Usuarios **sin suscripción** pueden ser añadidos por admin o por un club y recibir acceso restringido.
* Planificaciones y equipos pueden marcarse `activo=false` para ocultarlos sin borrado.
* Publicar en marketplace implica aceptar T\&C de propiedad intelectual (definir legalmente).
* Generación automática: al aplicar un itinerario se crean sesiones para los días indicados entre `fecha_inicio` y `fecha_fin`.

---

## 5. Flujo de usuario (high-level)

1. Registro / Login (Supabase).
2. Selección de suscripción (Free / Plus / Club).
3. Crear Club/Entidad (si aplica) -> Crear Equipo(s).
4. Crear Planificación (o importar desde Marketplace / usar Itinerario).
5. Generar sesiones (automático si se usa itinerario) y revisar/editar futuras.
6. Ejecutar sesión (cronómetro, vista paso a paso).
7. Informes / estadísticas / calendario.
8. Publicar planificación en Marketplace (opcional).

---

## 6. Esquema de base de datos (propuesta inicial) — tablas importantes

A continuación un esquema relacional simplificado con columnas clave. Ajustar después según normalización y consultas reales.

**users**

* id (uuid, PK)
* email (unique)
* name
* password\_hash (si se maneja; con Supabase no será necesario en la app)
* created\_at

**clubs (organizations)**

* id (uuid, PK)
* nombre
* descripcion
* owner\_user\_id (fk users.id)
* created\_at

**teams**

* id (uuid, PK)
* club\_id (fk clubs.id, nullable)
* nombre
* sexo (char)
* categoria\_edad
* nivel (char)
* activo (bool)
* created\_at

**subscriptions**

* id (uuid)
* owner\_type (enum: user, club)
* owner\_id (fk users.id or clubs.id)
* tipo (enum: free, plus, club)
* activo (bool)
* inicio, fin

**memberships** (usuarios asignados a equipos/clubes con rol)

* id (uuid)
* user\_id (fk users.id)
* team\_id (fk teams.id, nullable)
* club\_id (fk clubs.id, nullable)
* rol (enum: director, entrenador, ayudante, jugador, admin)
* permisos (json) // { can\_view\:true, can\_edit\:false, can\_execute\:true }
* created\_at

**planifications**

* id (uuid)
* titulo
* descripcion
* fecha\_inicio
* fecha\_fin
* dias\_semana (json/array)
* horas (json)
* pista\_completa (bool)
* publica (bool)
* creador\_id (fk users.id)
* created\_at

**planification\_teams** (M\:N)

* id
* planification\_id
* team\_id

**itineraries**

* id
* titulo
* descripcion
* conceptos (json array ordenado de concept ids)
* created\_by

**concepts**

* id
* nombre
* categoria
* subcategoria
* nivel\_dificultad
* tiempo\_estimado
* origen (enum: system, user)
* creador\_id

**exercises**

* id
* titulo
* descripcion
* multimedia\_url
* duracion\_estimada

**exercise\_concept**

* exercise\_id
* concept\_id

**sessions**

* id
* planification\_id
* team\_id
* fecha
* lugar
* ejercicios (json: lista ordenada de exercise ids + tiempos)
* estado
* editable

**marketplace\_items**

* id
* planification\_id
* autor\_id
* rating\_avg
* downloads
* publicado\_en

**audit / logs** (opcional)

* id
* entity
* entity\_id
* action
* user\_id
* timestamp
* details(json)

---

## 7. Modelo de permisos (detallado)

### Entidades principales para permisos

* **Scope**: `club`, `team`, `planification`, `session`, `marketplace`
* **Roles** (definidos por scope):

  * `owner` (full)
  * `director` (club-level management)
  * `coach` / `entrenador` (create/edit plans & sessions)
  * `assistant` (ver/ejecutar limitado)
  * `player` (ver/ejecutar solo)
  * `viewer` (solo ver)

### Permisos (ejemplos)

* `create_planification`, `edit_planification`, `delete_planification` (limitado por rol)
* `execute_session`, `mark_complete` (coaches + assistants + players según asignación)
* `publish_marketplace`, `import_marketplace` (coach plus / club)
* `manage_users`, `assign_roles` (director / admin)

### Implementación recomendada

* Guardar roles en `memberships` con `permisos` en JSON para excepciones/overrides.
* Calcular permisos efectivos en backend: combinar role defaults + overrides (ACL pattern).
* En frontend mostrar solo las acciones permitidas (backend es la fuente de verdad).

---

## 8. Tecnologías y arquitectura propuesta (actualizado)

* **Auth / Login**: Supabase (Auth) + JWT para sesiones y verificación en backend.
* **Backend**: .NET 8 Web API con EF Core (Postgres). Implementar capa de servicios, repositorios y jobs para generación de sesiones.
* **BBDD**: PostgreSQL (hosted) y uso de EF Core para migraciones y modelos.
* **Frontend**: Angular 20 + Tailwind CSS v4. UI responsiva, componente de ejecución de sesión (cronómetro) y editor visual.
* **Storage**: S3 compatible para multimedia (ejercicios y videos).
* **Jobs / Background**: Hangfire o worker service en .NET para generación masiva de sesiones y tareas periódicas.
* **Analíticas / BI**: almacenar eventos y usar Metabase / BI para dashboards.
* **Despliegue**: contenedores Docker, CI/CD (GitHub Actions / GitLab CI), deploy a cloud (Azure / AWS / DigitalOcean).

---

## 9. Endpoints API (esbozo)

* `POST /auth/signup`, `POST /auth/login` (Supabase-forwarded)
* `GET /clubs`, `POST /clubs`
* `GET /teams`, `POST /teams`, `PATCH /teams/:id`
* `POST /plans`, `GET /plans/:id`, `POST /plans/:id/generate-sessions`
* `GET /marketplace`, `POST /marketplace/:id/import`, `POST /marketplace/:id/publish`
* `POST /sessions/:id/execute`, `PATCH /sessions/:id/mark-complete`
* `POST /subscriptions/checkout`, `GET /subscriptions/status`
* `POST /memberships` (asignar roles), `GET /memberships/:userId`

---

## 10. Criterios de aceptación (ejemplos)

* Un equipo en cuenta gratuita: máximo 15 sesiones. (Nota: la limitación puede aplicarse a nivel de creación masiva o conteo de sesiones almacenadas).
* Al aplicar un itinerario y confirmar, se crean sesiones para cada día entre `fecha_inicio` y `fecha_fin`.
* Usuarios añadidos por admin acceden sólo a los equipos/planificaciones asignados.

---

## 11. Riesgos y preguntas abiertas

* Confirmar límite exacto para Entrenador Plus (8 equipos confirmado).
* Definir precios y modelo de facturación (mensual/anual, trials, impuestos).
* Aclarar políticas de propiedad intelectual para planificaciones publicadas.
* Reglas finas de coherencia en generación automática (qué se prioriza: dificultad, tiempo, % cumplimiento).

---

## 12. Próximos pasos propuestos

1. Revisar y aprobar este documento con el cliente para cerrar detalles de suscripciones y T\&C.
2. Diseñar el esquema físico de base de datos (DDL) y crear primeras migraciones con EF Core.
3. Priorizar backlog y escribir historias de usuario para MVP-1.
4. Prototipo UI (wireframes) de Dashboard, Editor de Planificación y Vista de Sesión.

---

> Documento actualizado con los límites solicitados (Free = 1 equipo, Entrenador Plus = 8 equipos) y con esquema de base de datos y modelo de permisos.
