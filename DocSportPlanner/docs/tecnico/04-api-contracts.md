```markdown
# 4. API REST Contracts (OpenAPI starter)

---

## Notas
Se recomienda generar la especificación OpenAPI 3.0 desde .NET controllers y exponer Swagger UI en `/docs`.

### OpenAPI Spec
Se incluye un `openapi.yaml` base en `docs/tecnico/openapi.yaml`. Esta especificación es un punto de partida y debe generarse automáticamente o mantenerse sincronizada con los controllers.
Link: `docs/tecnico/openapi.yaml`

## Endpoints principales (ejemplos)

### POST /auth/register
- Request: {email, password, nombre, deporte}
- Response 201: {user_id, email, role}
- Errors: 400 Bad Request, 409 Conflict

### POST /auth/login
- Request: {email, password}
- Response 200: {accessToken, refreshToken, user: {id, email, role}}
- Errors: 401 Unauthorized

### GET /planificaciones
- Query: ?userId={userId}&month={YYYY-MM}
- Response 200: [{id, nombre, fecha_inicio, fecha_fin, progreso_porcentaje}]

### POST /planificaciones
- Request: {nombre, fecha_inicio, fecha_fin, entrenamientos_por_semana, duracion_sesion_minutos}
- Response 201: {planificacion_id}
- Errors: 400, 401

### POST /sesiones/{id}/complete
- Request: {user_id, fecha_finalizacion_real}
- Response: 200 OK
- Effects: update progreso en planificacion, registrar timestamp

### POST /planificaciones/{planificacionId}/preview-distribute
- Request: { objetivos: [{id, dificultad, objetivo_padre_id}], totalWeeks }
- Response 200: { assignment: [{objetivo_id, semana_inicio, semana_fin}] }
- Errors: 400 Bad Request (bad data), 401 Unauthorized

### GET /marketplace/ejercicios
- Query: ?deporte=futbol&categoria=tecnica&dificultad=1..5
- Response: list of marketplace exercises

### POST /marketplace/eject/import
- Request: {marketplace_ejercicio_id}
- Response: 201: {user_ejercicio_id}
- Errors: 403 if user plan insufficient (free) or 401

## Autenticación
- JWT Bearer token required for all `/user/*` and write endpoints. Supabase integration for auth via validation of JWTs.

### Autenticación con Supabase (detalles)
- El frontend obtiene el token de Supabase mediante sesiones y lo envía al backend utilizando el header `Authorization: Bearer <token>`.
- El backend valida el JWT usando JWKS (predeterminado con Supabase) o una clave simétrica de desarrollo (configurada en `Supabase:JwtSecret`).
- Reclamaciones esperadas en el JWT: `sub` (Supabase user id), `email`, `name`, `preferred_username` o `username` (opcional).
- En el backend, el middleware `AuthenticatedUserMiddleware` intentará crear o recuperar el usuario local a partir del `sub` claim. Posteriormente los controllers pueden leer la entidad `UserDto` desde `HttpContext.Items["AppUser"]`.

Example header to call protected API:

```
Authorization: Bearer <supabase-jwt>
```

Endpoint `/api/auth/me` details:
- Method: GET
- Authorization: `Bearer` token required (Supabase JWT)
- Returns `200 OK` with `UserDto` of the application user (created if necessary), or `401` if the token is invalid.


## Versioning
- Base path: `/api/v1` (próximo: `/api/v2` para breaking changes)

---
**Estado:** borrador — Genear OpenAPI con controllers y completar modelos (DTOs) para cada endpoint.
```
