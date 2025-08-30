# Documentación de API - SportPlanner

## Descripción General

La API de SportPlanner es una API RESTful construida con ASP.NET Core 8.0 que proporciona endpoints para la gestión completa de equipos deportivos, planificaciones de entrenamiento y autenticación de usuarios. Utiliza autenticación JWT integrada con Supabase y maneja respuestas en formato JSON.

## Configuración Base

### URL Base
```
Desarrollo: https://localhost:7000
Producción: https://api.sportplanner.com
```

### Autenticación
La API utiliza autenticación Bearer JWT. Incluir el token en el header `Authorization`:

```http
Authorization: Bearer <jwt_token>
```

### Headers Comunes
```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer <jwt_token>
```

### Códigos de Estado HTTP
- `200 OK`: Operación exitosa
- `201 Created`: Recurso creado exitosamente
- `400 Bad Request`: Datos de entrada inválidos
- `401 Unauthorized`: Token inválido o ausente
- `403 Forbidden`: Sin permisos para la operación
- `404 Not Found`: Recurso no encontrado
- `500 Internal Server Error`: Error interno del servidor

## Endpoints de Autenticación

### 1. Iniciar Sesión
Autentica un usuario y devuelve tokens de acceso.

**POST** `/api/auth/login`

#### Request Body
```json
{
  "email": "usuario@ejemplo.com",
  "password": "mi_password_seguro",
  "rememberMe": true
}
```

#### Response (200 OK)
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "usuario@ejemplo.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "supabaseId": "auth_user_id",
    "role": 2,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_string",
  "expiresIn": 3600
}
```

#### Errores
```json
// 401 Unauthorized
{
  "message": "Invalid email or password"
}

// 400 Bad Request
{
  "errors": {
    "Email": ["The Email field is required."]
  }
}
```

### 2. Registrar Usuario
Crea una nueva cuenta de usuario.

**POST** `/api/auth/register`

#### Request Body
```json
{
  "email": "nuevo@ejemplo.com",
  "password": "password_seguro123",
  "firstName": "María",
  "lastName": "González"
}
```

#### Response (200 OK)
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "email": "nuevo@ejemplo.com",
    "firstName": "María",
    "lastName": "González",
    "supabaseId": "new_auth_user_id",
    "role": 2,
    "createdAt": "2024-01-15T10:35:00Z",
    "updatedAt": "2024-01-15T10:35:00Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_string",
  "expiresIn": 3600
}
```

### 3. Cerrar Sesión
Revoca el token de acceso del usuario.

**POST** `/api/auth/logout`
**Requiere:** Autenticación

#### Response (200 OK)
```json
{
  "message": "Logged out successfully"
}
```

### 4. Actualizar Token
Genera nuevos tokens usando el refresh token.

**POST** `/api/auth/refresh`

#### Request Body
```json
{
  "refreshToken": "refresh_token_string"
}
```

#### Response (200 OK)
```json
{
  "user": { /* UserDto */ },
  "accessToken": "new_jwt_token",
  "refreshToken": "new_refresh_token",
  "expiresIn": 3600
}
```

### 5. Validar Token
Verifica la validez del token actual y retorna información del usuario.

**GET** `/api/auth/validate`
**Requiere:** Autenticación

#### Response (200 OK)
```json
{
  "valid": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "usuario@ejemplo.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": 2
  }
}
```

### 6. Restablecer Contraseña
Envía email de restablecimiento de contraseña.

**POST** `/api/auth/reset-password`

#### Request Body
```json
{
  "email": "usuario@ejemplo.com"
}
```

#### Response (200 OK)
```json
{
  "message": "Password reset email sent"
}
```

## Endpoints de Gestión de Equipos

### 1. Listar Equipos del Usuario
Obtiene todos los equipos asociados al usuario autenticado.

**GET** `/api/teams`
**Requiere:** Autenticación

#### Response (200 OK)
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "name": "Juvenil Masculino A",
    "sport": "Baloncesto",
    "category": "Juvenil",
    "gender": 0,
    "level": 0,
    "description": "Equipo juvenil de élite",
    "organizationId": "550e8400-e29b-41d4-a716-446655440003",
    "createdBy": "Juan Pérez",
    "createdAt": "2024-01-10T15:00:00Z",
    "updatedAt": "2024-01-10T15:00:00Z",
    "memberCount": 12,
    "isActive": true,
    "isVisible": true
  }
]
```

### 2. Obtener Equipo por ID
Obtiene detalles específicos de un equipo.

**GET** `/api/teams/{id}`
**Requiere:** Autenticación

#### Parámetros de URL
- `id` (UUID): ID del equipo

#### Response (200 OK)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "name": "Juvenil Masculino A",
  "sport": "Baloncesto",
  "category": "Juvenil",
  "gender": 0,
  "level": 0,
  "description": "Equipo juvenil de élite",
  "organizationId": "550e8400-e29b-41d4-a716-446655440003",
  "createdBy": "Juan Pérez",
  "createdAt": "2024-01-10T15:00:00Z",
  "updatedAt": "2024-01-10T15:00:00Z",
  "memberCount": 12,
  "isActive": true,
  "isVisible": true
}
```

#### Errores
```json
// 404 Not Found
{
  "message": "Team with ID 550e8400-e29b-41d4-a716-446655440002 not found or access denied"
}
```

### 3. Crear Equipo
Crea un nuevo equipo deportivo.

**POST** `/api/teams`
**Requiere:** Autenticación

#### Request Body
```json
{
  "name": "Infantil Femenino B",
  "sport": "Baloncesto",
  "category": "Infantil",
  "gender": 1,
  "level": 1,
  "description": "Equipo de desarrollo femenino",
  "organizationId": "550e8400-e29b-41d4-a716-446655440003"
}
```

#### Response (201 Created)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440004",
  "name": "Infantil Femenino B",
  "sport": "Baloncesto",
  "category": "Infantil",
  "gender": 1,
  "level": 1,
  "description": "Equipo de desarrollo femenino",
  "organizationId": "550e8400-e29b-41d4-a716-446655440003",
  "createdBy": "Juan Pérez",
  "createdAt": "2024-01-15T16:30:00Z",
  "updatedAt": "2024-01-15T16:30:00Z",
  "memberCount": 0,
  "isActive": true,
  "isVisible": true
}
```

### 4. Actualizar Equipo
Modifica un equipo existente.

**PUT** `/api/teams/{id}`
**Requiere:** Autenticación

#### Parámetros de URL
- `id` (UUID): ID del equipo

#### Request Body
```json
{
  "name": "Infantil Femenino A",
  "sport": "Baloncesto",
  "category": "Infantil",
  "gender": 1,
  "level": 0,
  "description": "Equipo de élite femenino"
}
```

#### Response (200 OK)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440004",
  "name": "Infantil Femenino A",
  "sport": "Baloncesto",
  "category": "Infantil",
  "gender": 1,
  "level": 0,
  "description": "Equipo de élite femenino",
  "updatedAt": "2024-01-15T17:00:00Z"
}
```

#### Errores
```json
// 403 Forbidden
{
  "message": "You do not have permission to update this team"
}

// 404 Not Found
{
  "message": "Team with ID 550e8400-e29b-41d4-a716-446655440004 not found"
}
```

### 5. Eliminar Equipo
Realiza soft delete de un equipo.

**DELETE** `/api/teams/{id}`
**Requiere:** Autenticación

#### Parámetros de URL
- `id` (UUID): ID del equipo

#### Response (204 No Content)
_Sin contenido en la respuesta_

## Endpoints de Planificaciones

### 1. Listar Planificaciones
Obtiene todas las planificaciones activas.

**GET** `/api/plannings`

#### Response (200 OK)
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440005",
    "name": "Pretemporada 2024",
    "description": "Planificación de pretemporada",
    "startDate": "2024-02-01T00:00:00Z",
    "endDate": "2024-02-28T00:00:00Z",
    "trainingDays": "[1,3,5]",
    "startTime": "18:00:00",
    "endTime": "19:30:00",
    "isFullCourt": true,
    "itineraryId": null,
    "createdByUserId": "550e8400-e29b-41d4-a716-446655440000",
    "isPublic": false,
    "averageRating": 4.5,
    "ratingCount": 8,
    "createdAt": "2024-01-20T10:00:00Z",
    "updatedAt": "2024-01-20T10:00:00Z",
    "isActive": true,
    "isVisible": true,
    "planningTeams": [
      {
        "planningId": "550e8400-e29b-41d4-a716-446655440005",
        "teamId": "550e8400-e29b-41d4-a716-446655440002",
        "assignedAt": "2024-01-20T10:00:00Z",
        "team": {
          "id": "550e8400-e29b-41d4-a716-446655440002",
          "name": "Juvenil Masculino A"
        }
      }
    ]
  }
]
```

### 2. Obtener Planificación por ID
Obtiene detalles completos de una planificación incluyendo sesiones de entrenamiento.

**GET** `/api/plannings/{id}`

#### Parámetros de URL
- `id` (UUID): ID de la planificación

#### Response (200 OK)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440005",
  "name": "Pretemporada 2024",
  "description": "Planificación de pretemporada",
  "startDate": "2024-02-01T00:00:00Z",
  "endDate": "2024-02-28T00:00:00Z",
  "trainingDays": "[1,3,5]",
  "startTime": "18:00:00",
  "endTime": "19:30:00",
  "isFullCourt": true,
  "planningConcepts": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440006",
      "planningId": "550e8400-e29b-41d4-a716-446655440005",
      "conceptId": "550e8400-e29b-41d4-a716-446655440007",
      "order": 1,
      "plannedSessions": 8,
      "completedSessions": 3,
      "concept": {
        "id": "550e8400-e29b-41d4-a716-446655440007",
        "name": "Fundamentos de Bote",
        "category": "Técnica Individual"
      }
    }
  ],
  "trainingSessions": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440008",
      "name": "Entrenamiento 01/02/2024",
      "scheduledDate": "2024-02-01T18:00:00Z",
      "status": "Completed"
    }
  ]
}
```

### 3. Crear Planificación
Crea una nueva planificación de entrenamiento.

**POST** `/api/plannings`

#### Request Body
```json
{
  "name": "Temporada Regular 2024",
  "description": "Planificación para la temporada regular",
  "startDate": "2024-03-01T00:00:00Z",
  "endDate": "2024-05-31T00:00:00Z",
  "trainingDays": [2, 4, 6],
  "startTime": "19:00:00",
  "endTime": "20:30:00",
  "isFullCourt": true,
  "itineraryId": null,
  "createdByUserId": "550e8400-e29b-41d4-a716-446655440000",
  "teamIds": ["550e8400-e29b-41d4-a716-446655440002"]
}
```

#### Response (201 Created)
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440009",
  "name": "Temporada Regular 2024",
  "description": "Planificación para la temporada regular",
  "startDate": "2024-03-01T00:00:00Z",
  "endDate": "2024-05-31T00:00:00Z",
  "trainingDays": "[2,4,6]",
  "startTime": "19:00:00",
  "endTime": "20:30:00",
  "isFullCourt": true,
  "createdAt": "2024-01-25T14:00:00Z",
  "updatedAt": "2024-01-25T14:00:00Z"
}
```

### 4. Generar Sesiones de Entrenamiento
Genera automáticamente sesiones de entrenamiento basadas en la planificación.

**POST** `/api/plannings/{id}/generate-sessions`

#### Parámetros de URL
- `id` (UUID): ID de la planificación

#### Response (200 OK)
```json
{
  "message": "Se generaron 24 sesiones de entrenamiento",
  "sessionsCount": 24
}
```

### 5. Marketplace de Planificaciones
Obtiene planificaciones públicas con filtros opcionales.

**GET** `/api/plannings/marketplace`

#### Parámetros de Query (opcionales)
- `sport` (string): Filtrar por deporte
- `category` (string): Filtrar por categoría
- `level` (int): Filtrar por nivel (0=A, 1=B, 2=C)
- `page` (int): Página (default: 1)
- `pageSize` (int): Elementos por página (default: 10)

#### Ejemplo de Request
```
GET /api/plannings/marketplace?sport=Baloncesto&category=Juvenil&page=1&pageSize=5
```

#### Response (200 OK)
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "name": "Fundamentos Juveniles",
    "description": "Planificación enfocada en fundamentos",
    "averageRating": 4.8,
    "ratingCount": 15,
    "createdBy": {
      "firstName": "Ana",
      "lastName": "Martín"
    },
    "createdAt": "2024-01-15T10:00:00Z"
  }
]
```

## Modelos de Datos

### UserRole (Enum)
```typescript
enum UserRole {
  Administrator = 0,
  Director = 1,
  Coach = 2,
  Assistant = 3
}
```

### Gender (Enum)
```typescript
enum Gender {
  Male = 0,
  Female = 1,
  Mixed = 2
}
```

### TeamLevel (Enum)
```typescript
enum TeamLevel {
  A = 0,  // Nivel alto
  B = 1,  // Nivel medio
  C = 2   // Nivel básico
}
```

### SessionStatus (Enum)
```typescript
enum SessionStatus {
  Planned = 0,
  InProgress = 1,
  Completed = 2,
  Cancelled = 3
}
```

## Manejo de Errores

### Formato de Error Estándar
```json
{
  "message": "Descripción del error",
  "details": "Información adicional opcional"
}
```

### Errores de Validación
```json
{
  "errors": {
    "Name": ["El campo Name es requerido."],
    "Email": ["El formato del email es inválido."]
  }
}
```

### Errores Comunes

#### 401 Unauthorized
```json
{
  "message": "Token expired or invalid"
}
```

#### 403 Forbidden
```json
{
  "message": "Insufficient permissions for this operation"
}
```

#### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

#### 500 Internal Server Error
```json
{
  "message": "An internal error occurred. Please try again later."
}
```

## Rate Limiting

### Límites por Endpoint
- **Autenticación**: 5 requests/minuto por IP
- **Operaciones generales**: 100 requests/minuto por usuario
- **Consultas intensivas**: 20 requests/minuto por usuario

### Headers de Rate Limiting
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1642680000
```

## Versionado de API

### Estrategia de Versionado
- **Versión actual**: v1
- **Header de versión**: `Accept: application/vnd.sportplanner.v1+json`
- **URL alternativa**: `/api/v1/teams` (para compatibilidad)

### Ciclo de Vida de Versiones
- **v1**: Versión actual (estable)
- **Deprecación**: 6 meses de aviso antes de remover
- **Soporte**: Máximo 2 versiones simultáneas

## Testing y Postman

### Collection de Postman
Se proporciona una colección de Postman con todos los endpoints configurados:
- Variables de entorno para desarrollo y producción
- Tests automáticos de validación
- Scripts de pre-request para tokens
- Ejemplos de todos los casos de uso

### Ambiente de Testing
```
URL Base Testing: https://api-test.sportplanner.com
Swagger UI: https://api-test.sportplanner.com/swagger
```

---

*Documentación de API para SportPlanner v1.0 - Última actualización: Enero 2024*