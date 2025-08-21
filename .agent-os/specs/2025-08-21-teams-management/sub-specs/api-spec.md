# API Specification

This is the API specification for the spec detailed in @.agent-os/specs/2025-08-21-teams-management/spec.md

## Endpoints

### GET /api/teams

**Purpose:** Obtener la lista completa de equipos del usuario autenticado
**Parameters:** 
- Authorization Header (Bearer Token)
- Query Parameters (opcional):
  - `page`: número de página para paginación
  - `pageSize`: tamaño de página (default: 10)
  - `search`: término de búsqueda para filtrar equipos

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "guid",
      "name": "string",
      "sport": "string",
      "description": "string",
      "memberCount": "number",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ],
  "pagination": {
    "currentPage": "number",
    "totalPages": "number",
    "totalItems": "number"
  }
}
```

**Errors:** 
- 401: No autorizado
- 500: Error interno del servidor

### POST /api/teams

**Purpose:** Crear un nuevo equipo
**Parameters:**
- Authorization Header (Bearer Token)
- Request Body:
```json
{
  "name": "string (required, max 100 chars)",
  "sport": "string (required, max 50 chars)",
  "description": "string (optional, max 500 chars)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "guid",
    "name": "string",
    "sport": "string",
    "description": "string",
    "memberCount": 0,
    "createdAt": "datetime",
    "updatedAt": "datetime"
  },
  "message": "Team created successfully"
}
```

**Errors:**
- 400: Datos de entrada inválidos
- 401: No autorizado
- 409: Equipo con el mismo nombre ya existe
- 500: Error interno del servidor

### PUT /api/teams/{id}

**Purpose:** Actualizar un equipo existente
**Parameters:**
- Authorization Header (Bearer Token)
- Path Parameter: `id` (GUID del equipo)
- Request Body:
```json
{
  "name": "string (required, max 100 chars)",
  "sport": "string (required, max 50 chars)",
  "description": "string (optional, max 500 chars)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "guid",
    "name": "string",
    "sport": "string",
    "description": "string",
    "memberCount": "number",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  },
  "message": "Team updated successfully"
}
```

**Errors:**
- 400: Datos de entrada inválidos
- 401: No autorizado
- 403: Sin permisos para editar este equipo
- 404: Equipo no encontrado
- 409: Equipo con el mismo nombre ya existe
- 500: Error interno del servidor

### DELETE /api/teams/{id}

**Purpose:** Eliminar un equipo existente
**Parameters:**
- Authorization Header (Bearer Token)
- Path Parameter: `id` (GUID del equipo)

**Response:**
```json
{
  "success": true,
  "message": "Team deleted successfully"
}
```

**Errors:**
- 401: No autorizado
- 403: Sin permisos para eliminar este equipo
- 404: Equipo no encontrado
- 409: No se puede eliminar equipo con miembros activos
- 500: Error interno del servidor

## Controllers

### TeamsController

**Action Names:**
- `GetTeams()` - Obtener lista de equipos
- `CreateTeam(CreateTeamRequest request)` - Crear nuevo equipo
- `UpdateTeam(Guid id, UpdateTeamRequest request)` - Actualizar equipo
- `DeleteTeam(Guid id)` - Eliminar equipo

**Business Logic:**
- Validación de permisos de usuario para cada operación
- Validación de datos de entrada según reglas de negocio
- Manejo de transacciones para operaciones que afecten múltiples entidades
- Logging de operaciones para auditoría

**Error Handling:**
- Captura y manejo de excepciones específicas del dominio
- Retorno de códigos de estado HTTP apropiados
- Mensajes de error localizados y descriptivos
- Logging de errores para debugging

## Authentication & Authorization

- **JWT Bearer Token** - Requerido en todas las operaciones
- **User Context** - Los equipos están asociados al usuario autenticado
- **Role-based Access** - Verificación de permisos según rol del usuario
- **Team Ownership** - Solo el creador del equipo puede editarlo/eliminarlo

## Data Validation

- **Server-side Validation** - Validación completa en el backend usando FluentValidation
- **Model Binding** - Validación automática de modelos de entrada
- **Business Rules** - Validación de reglas de negocio específicas
- **Sanitization** - Limpieza de datos de entrada para prevenir ataques