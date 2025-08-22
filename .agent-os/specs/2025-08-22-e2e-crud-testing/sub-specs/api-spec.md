# API Specification - E2E CRUD Testing Endpoints

## Teams API Endpoints

### GET /api/teams
**Purpose**: Retrieve all teams for authenticated user
**Parameters**: 
- Query: `page` (optional), `limit` (optional), `sport` (optional filter)
**Response**: 
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "sport": "string",
      "category": "string",
      "level": "A|B|C",
      "gender": "Masculino|Femenino",
      "createdAt": "datetime",
      "updatedAt": "datetime",
      "userId": "uuid"
    }
  ],
  "totalCount": "number",
  "page": "number",
  "limit": "number"
}
```
**Test Requirements**: Verify pagination, filtering, and user isolation

### POST /api/teams
**Purpose**: Create new team
**Request Body**:
```json
{
  "name": "string (required, max 100 chars)",
  "sport": "string (required)",
  "category": "string (required)",
  "level": "A|B|C (required)",
  "gender": "Masculino|Femenino (required)"
}
```
**Response**: Created team object with HTTP 201
**Test Requirements**: Validate required fields, subscription tier limits, duplicate name handling

### PUT /api/teams/{id}
**Purpose**: Update existing team
**Parameters**: `id` (UUID in route)
**Request Body**: Same as POST with all fields optional
**Response**: Updated team object with HTTP 200
**Test Requirements**: Verify ownership validation, partial update support

### DELETE /api/teams/{id}
**Purpose**: Delete team
**Parameters**: `id` (UUID in route)
**Response**: HTTP 204 No Content
**Test Requirements**: Verify cascading deletes, ownership validation

## Exercises API Endpoints

### GET /api/exercises
**Purpose**: Retrieve exercises with filtering and pagination
**Parameters**:
- Query: `page`, `limit`, `sport`, `difficulty`, `conceptId`
**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "description": "string",
      "sport": "string",
      "difficulty": "number (1-5)",
      "estimatedTime": "number (minutes)",
      "instructions": "string",
      "mediaUrls": ["string"],
      "conceptIds": ["uuid"],
      "createdAt": "datetime",
      "userId": "uuid"
    }
  ],
  "totalCount": "number"
}
```
**Test Requirements**: Test complex filtering, media URL validation

### POST /api/exercises
**Purpose**: Create new exercise
**Request Body**:
```json
{
  "name": "string (required, max 200 chars)",
  "description": "string (required)",
  "sport": "string (required)",
  "difficulty": "number (1-5, required)",
  "estimatedTime": "number (required)",
  "instructions": "string (optional)",
  "conceptIds": ["uuid"] (optional)
}
```
**Response**: Created exercise with HTTP 201
**Test Requirements**: Validate concept associations, subscription limits

### PUT /api/exercises/{id}
**Purpose**: Update exercise
**Parameters**: `id` (UUID in route)
**Request Body**: Same as POST with optional fields
**Response**: Updated exercise with HTTP 200
**Test Requirements**: Test concept relationship updates

### DELETE /api/exercises/{id}
**Purpose**: Delete exercise
**Parameters**: `id` (UUID in route)
**Response**: HTTP 204 No Content
**Test Requirements**: Verify concept relationship cleanup

## Objectives API Endpoints

### GET /api/objectives
**Purpose**: Retrieve objectives for user
**Parameters**:
- Query: `page`, `limit`, `teamId`, `status`
**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "string",
      "description": "string",
      "targetValue": "number",
      "currentValue": "number",
      "unit": "string",
      "status": "Active|Completed|Paused",
      "dueDate": "date",
      "teamId": "uuid",
      "createdAt": "datetime"
    }
  ]
}
```

### POST /api/objectives
**Purpose**: Create new objective
**Request Body**:
```json
{
  "title": "string (required, max 150 chars)",
  "description": "string (required)",
  "targetValue": "number (required)",
  "unit": "string (required)",
  "dueDate": "date (optional)",
  "teamId": "uuid (required)"
}
```
**Response**: Created objective with HTTP 201
**Test Requirements**: Validate team ownership, target value constraints

### PUT /api/objectives/{id}
**Purpose**: Update objective
**Parameters**: `id` (UUID in route)
**Request Body**: Partial objective update
**Response**: Updated objective with HTTP 200
**Test Requirements**: Test progress tracking updates

### DELETE /api/objectives/{id}
**Purpose**: Delete objective
**Parameters**: `id` (UUID in route)
**Response**: HTTP 204 No Content
**Test Requirements**: Verify planning reference cleanup

## Authentication & Error Handling

### Authentication Headers
All endpoints require:
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

### Standard Error Responses
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object (optional)"
  }
}
```

**Error Codes to Test**:
- `401 Unauthorized`: Invalid or expired token
- `403 Forbidden`: Insufficient permissions or subscription limits
- `404 Not Found`: Entity not found or not owned by user
- `409 Conflict`: Duplicate names, constraint violations
- `422 Unprocessable Entity`: Validation errors
- `500 Internal Server Error`: Server errors

## Test-Specific API Requirements

### Bulk Operations (For Testing Efficiency)
- `POST /api/test/teams/bulk` - Create multiple teams for testing
- `DELETE /api/test/cleanup/{userId}` - Clean up test data for specific user
- `POST /api/test/seed` - Seed baseline test data

### Health Check Endpoints
- `GET /api/health` - Basic API health check
- `GET /api/health/database` - Database connectivity check
- `GET /api/health/auth` - Authentication service check

## Performance Testing Endpoints

### Metrics Collection
- Response time headers: `X-Response-Time-Ms`
- Database query count: `X-DB-Query-Count`
- Memory usage: `X-Memory-Usage-MB`

### Load Testing Support
- Rate limiting configuration for test environments
- Concurrent request handling validation
- Database connection pool monitoring