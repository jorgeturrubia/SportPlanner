# Esquema de Base de Datos - SportPlanner

## Descripción General

SportPlanner utiliza PostgreSQL como sistema de gestión de base de datos relacional. El esquema está diseñado para soportar un ecosistema completo de gestión deportiva, incluyendo usuarios, equipos, planificaciones de entrenamiento, ejercicios y un sistema de suscripciones.

## Diagrama de Relaciones (ERD)

```
                    ┌─────────────────┐
                    │   Subscription  │
                    │ ─────────────── │
                    │ Id (PK)         │
                    │ Name            │
                    │ Type            │
                    │ Price           │
                    │ Features...     │
                    └─────────────────┘
                             │
                             │ 1:N
                             ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UserSubscr.   │    │      User       │    │  Organization   │
│ ─────────────── │    │ ─────────────── │    │ ─────────────── │
│ Id (PK)         │◄───┤ Id (PK)         │───►│ Id (PK)         │
│ UserId (FK)     │    │ Email           │    │ Name            │
│ SubscriptionId  │    │ FirstName       │    │ CreatedByUserId │
│ StartDate       │    │ LastName        │    │ CreatedAt       │
│ EndDate         │    │ SupabaseId      │    └─────────────────┘
│ IsActive        │    │ Role            │             │
└─────────────────┘    │ CreatedAt       │             │ 1:N
                       └─────────────────┘             ▼
                                │                ┌─────────────────┐
                                │ 1:N            │      Team       │
                                ▼                │ ─────────────── │
┌─────────────────┐       ┌─────────────────┐   │ Id (PK)         │
│    UserTeam     │       │     Concept     │   │ Name            │
│ ─────────────── │       │ ─────────────── │   │ Sport           │
│ Id (PK)         │       │ Id (PK)         │   │ Category        │
│ UserId (FK)     │◄──────┤ Name            │   │ Gender          │
│ TeamId (FK)     │       │ Description     │   │ Level           │
│ Role            │       │ Category        │   │ OrganizationId  │
│ AssignedAt      │       │ Subcategory     │   │ CreatedByUserId │
│ IsActive        │       │ DifficultyLevel │   └─────────────────┘
└─────────────────┘       │ CreatedByUserId │            │
         ▲                │ IsSystemConcept │            │ N:M
         │                └─────────────────┘            ▼
         │                         │                ┌─────────────────┐
         │                         │ N:M            │  PlanningTeam   │
         │                         ▼                │ ─────────────── │
         │                ┌─────────────────┐       │ PlanningId (FK) │
         │                │ ExerciseConcept │       │ TeamId (FK)     │
         │                │ ─────────────── │       │ AssignedAt      │
         │                │ ExerciseId (FK) │       └─────────────────┘
         │                │ ConceptId (FK)  │                ▲
         │                └─────────────────┘                │
         │                         ▲                         │
         │                         │                         │
         │                ┌─────────────────┐                │
         │                │    Exercise     │                │
         │                │ ─────────────── │                │
         │                │ Id (PK)         │                │
         │                │ Name            │                │
         │                │ Description     │                │
         │                │ Instructions    │                │
         │                │ DurationMinutes │                │
         │                │ MinPlayers      │                │
         │                │ MaxPlayers      │                │
         │                │ DifficultyLevel │                │
         │                │ CreatedByUserId │                │
         │                │ IsSystemExercise│                │
         │                └─────────────────┘                │
         │                         │                         │
         │                         │ 1:N                     │
         │                         ▼                         │
         │                ┌─────────────────┐                │
         │                │ SessionExercise │                │
         │                │ ─────────────── │                │
         │                │ Id (PK)         │                │
         │                │ SessionId (FK)  │                │
         │                │ ExerciseId (FK) │                │
         │                │ Order           │                │
         │                │ Duration        │                │
         │                │ Repetitions     │                │
         │                │ Notes           │                │
         │                └─────────────────┘                │
         │                         ▲                         │
         │                         │                         │
         │                ┌─────────────────┐                │
         │                │ TrainingSession │                │
         │                │ ─────────────── │                │
         │                │ Id (PK)         │                │
         │                │ Name            │                │
         │                │ Date            │                │
         │                │ StartTime       │                │
         │                │ EndTime         │                │
         │                │ PlanningId (FK) │◄───────────────┤
         │                │ CreatedByUserId │                │
         │                │ IsCompleted     │                │
         │                └─────────────────┘                │
         │                         ▲                         │
         │                         │                         │
         │                ┌─────────────────┐                │
         │                │    Planning     │◄───────────────┘
         │                │ ─────────────── │
         │                │ Id (PK)         │
         │                │ Name            │
         │                │ Description     │
         │                │ StartDate       │
         │                │ EndDate         │
         │                │ TrainingDays    │
         │                │ StartTime       │
         │                │ EndTime         │
         │                │ IsFullCourt     │
         │                │ ItineraryId     │
         │                │ CreatedByUserId │
         │                │ IsPublic        │
         │                │ AverageRating   │
         │                └─────────────────┘
                                   ▲
                                   │
                          ┌─────────────────┐
                          │    Itinerary    │
                          │ ─────────────── │
                          │ Id (PK)         │
                          │ Name            │
                          │ Description     │
                          │ Sport           │
                          │ CreatedByUserId │
                          │ AverageRating   │
                          └─────────────────┘
```

## Entidades Principales

### 1. Gestión de Usuarios y Autenticación

#### Users
Almacena información básica de los usuarios del sistema.

```sql
CREATE TABLE Users (
    Id UUID PRIMARY KEY,
    Email VARCHAR(100) UNIQUE NOT NULL,
    FirstName VARCHAR(100) NOT NULL,
    LastName VARCHAR(100) NOT NULL,
    SupabaseId VARCHAR(100) UNIQUE NOT NULL,
    Role INTEGER NOT NULL DEFAULT 2, -- UserRole enum
    CreatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    UpdatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    IsActive BOOLEAN NOT NULL DEFAULT TRUE
);
```

**Campos Clave:**
- `SupabaseId`: Vinculación con el sistema de autenticación de Supabase
- `Role`: Enum que define permisos (Administrator=0, Director=1, Coach=2, Assistant=3)
- `IsActive`: Soft delete para mantener integridad referencial

#### Subscriptions
Define los diferentes planes de suscripción disponibles.

```sql
CREATE TABLE Subscriptions (
    Id SERIAL PRIMARY KEY,
    Name VARCHAR(50) NOT NULL,
    Type INTEGER NOT NULL, -- SubscriptionType enum
    Price DECIMAL(10,2) NOT NULL,
    Description VARCHAR(500),
    MaxTeams INTEGER NOT NULL,
    MaxTrainingSessions INTEGER NOT NULL,
    CanCreateCustomConcepts BOOLEAN NOT NULL DEFAULT FALSE,
    CanCreateItineraries BOOLEAN NOT NULL DEFAULT FALSE,
    HasDirectorMode BOOLEAN NOT NULL DEFAULT FALSE,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE
);
```

**Características:**
- `MaxTeams/MaxTrainingSessions`: -1 indica ilimitado
- Diferentes niveles: Free (0), Coach (1), Club (2)
- Control granular de características por plan

#### UserSubscriptions
Tabla de unión que maneja las suscripciones activas de usuarios.

```sql
CREATE TABLE UserSubscriptions (
    Id UUID PRIMARY KEY,
    UserId UUID REFERENCES Users(Id) ON DELETE CASCADE,
    SubscriptionId INTEGER REFERENCES Subscriptions(Id) ON DELETE RESTRICT,
    StartDate TIMESTAMP NOT NULL,
    EndDate TIMESTAMP NULL,
    IsActive BOOLEAN NOT NULL DEFAULT TRUE
);
```

### 2. Gestión Organizacional

#### Organizations
Organizaciones deportivas (clubes, escuelas, etc.) que agrupan equipos.

```sql
CREATE TABLE Organizations (
    Id UUID PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Description VARCHAR(500),
    CreatedByUserId UUID REFERENCES Users(Id) ON DELETE RESTRICT,
    CreatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    UpdatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    IsActive BOOLEAN NOT NULL DEFAULT TRUE
);
```

#### Teams
Equipos deportivos asociados a organizaciones o entrenadores independientes.

```sql
CREATE TABLE Teams (
    Id UUID PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Sport VARCHAR(50) NOT NULL,
    Category VARCHAR(50) NOT NULL, -- Alevín, Infantil, etc.
    Gender INTEGER NOT NULL, -- Male=0, Female=1, Mixed=2
    Level INTEGER NOT NULL, -- A=0, B=1, C=2
    Description VARCHAR(500),
    OrganizationId UUID REFERENCES Organizations(Id) ON DELETE SET NULL,
    CreatedByUserId UUID REFERENCES Users(Id) ON DELETE RESTRICT,
    CreatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    UpdatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    IsVisible BOOLEAN NOT NULL DEFAULT TRUE
);
```

**Características:**
- `IsVisible`: Permite ocultar equipos de temporadas anteriores
- Categorización completa por deporte, género y nivel
- Soporte para equipos independientes (sin organización)

#### UserTeams
Relación many-to-many entre usuarios y equipos con roles específicos.

```sql
CREATE TABLE UserTeams (
    Id UUID PRIMARY KEY,
    UserId UUID REFERENCES Users(Id) ON DELETE CASCADE,
    TeamId UUID REFERENCES Teams(Id) ON DELETE CASCADE,
    Role INTEGER NOT NULL, -- UserRole enum
    AssignedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    
    UNIQUE(UserId, TeamId)
);
```

### 3. Sistema de Conceptos y Ejercicios

#### Concepts
Conceptos técnicos y tácticos deportivos (ej: "Bote", "Defensa individual").

```sql
CREATE TABLE Concepts (
    Id UUID PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Description VARCHAR(500),
    Category VARCHAR(100) NOT NULL, -- "Técnica Individual"
    Subcategory VARCHAR(100) NOT NULL, -- "Bote"
    DifficultyLevel INTEGER NOT NULL, -- 1-5
    EstimatedLearningTimeMinutes INTEGER NOT NULL,
    IsSystemConcept BOOLEAN NOT NULL DEFAULT FALSE,
    CreatedByUserId UUID REFERENCES Users(Id) ON DELETE SET NULL,
    CreatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    UpdatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    IsActive BOOLEAN NOT NULL DEFAULT TRUE
);
```

#### Exercises
Catálogo de ejercicios deportivos con detalles técnicos.

```sql
CREATE TABLE Exercises (
    Id UUID PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Description VARCHAR(1000),
    Instructions VARCHAR(2000),
    DurationMinutes INTEGER NOT NULL,
    MinPlayers INTEGER NOT NULL,
    MaxPlayers INTEGER NOT NULL,
    MaterialNeeded VARCHAR(500),
    DifficultyLevel INTEGER NOT NULL, -- 1-5
    IsSystemExercise BOOLEAN NOT NULL DEFAULT FALSE,
    CreatedByUserId UUID REFERENCES Users(Id) ON DELETE SET NULL,
    IsPublic BOOLEAN NOT NULL DEFAULT FALSE,
    AverageRating DECIMAL(3,2) NOT NULL DEFAULT 0,
    RatingCount INTEGER NOT NULL DEFAULT 0,
    CreatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    UpdatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    IsActive BOOLEAN NOT NULL DEFAULT TRUE
);
```

#### ExerciseConcepts
Relación many-to-many entre ejercicios y conceptos.

```sql
CREATE TABLE ExerciseConcepts (
    ExerciseId UUID REFERENCES Exercises(Id) ON DELETE CASCADE,
    ConceptId UUID REFERENCES Concepts(Id) ON DELETE CASCADE,
    
    PRIMARY KEY (ExerciseId, ConceptId)
);
```

### 4. Planificación y Sesiones de Entrenamiento

#### Itineraries
Plantillas de planificación reutilizables.

```sql
CREATE TABLE Itineraries (
    Id UUID PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Description VARCHAR(500),
    Sport VARCHAR(50) NOT NULL,
    CreatedByUserId UUID REFERENCES Users(Id) ON DELETE SET NULL,
    IsPublic BOOLEAN NOT NULL DEFAULT FALSE,
    AverageRating DECIMAL(3,2) NOT NULL DEFAULT 0,
    RatingCount INTEGER NOT NULL DEFAULT 0,
    CreatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    UpdatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    IsActive BOOLEAN NOT NULL DEFAULT TRUE
);
```

#### Plannings
Planificaciones específicas de entrenamiento para equipos.

```sql
CREATE TABLE Plannings (
    Id UUID PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Description VARCHAR(500),
    StartDate TIMESTAMP NOT NULL,
    EndDate TIMESTAMP NOT NULL,
    TrainingDays VARCHAR(50) NOT NULL, -- JSON: [1,3,5]
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    IsFullCourt BOOLEAN NOT NULL DEFAULT TRUE,
    ItineraryId UUID REFERENCES Itineraries(Id) ON DELETE SET NULL,
    CreatedByUserId UUID REFERENCES Users(Id) ON DELETE RESTRICT,
    IsPublic BOOLEAN NOT NULL DEFAULT FALSE,
    AverageRating DECIMAL(3,2) NOT NULL DEFAULT 0,
    RatingCount INTEGER NOT NULL DEFAULT 0,
    CreatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    UpdatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    IsActive BOOLEAN NOT NULL DEFAULT TRUE,
    IsVisible BOOLEAN NOT NULL DEFAULT TRUE
);
```

#### PlanningTeams
Asignación de planificaciones a equipos específicos.

```sql
CREATE TABLE PlanningTeams (
    PlanningId UUID REFERENCES Plannings(Id) ON DELETE CASCADE,
    TeamId UUID REFERENCES Teams(Id) ON DELETE CASCADE,
    AssignedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    
    PRIMARY KEY (PlanningId, TeamId)
);
```

#### TrainingSessions
Sesiones individuales de entrenamiento dentro de una planificación.

```sql
CREATE TABLE TrainingSessions (
    Id UUID PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Description VARCHAR(500),
    Date TIMESTAMP NOT NULL,
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    PlanningId UUID REFERENCES Plannings(Id) ON DELETE CASCADE,
    CreatedByUserId UUID REFERENCES Users(Id) ON DELETE RESTRICT,
    IsCompleted BOOLEAN NOT NULL DEFAULT FALSE,
    Notes VARCHAR(1000),
    CreatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    UpdatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
    IsActive BOOLEAN NOT NULL DEFAULT TRUE
);
```

#### SessionExercises
Ejercicios específicos dentro de cada sesión de entrenamiento.

```sql
CREATE TABLE SessionExercises (
    Id UUID PRIMARY KEY,
    SessionId UUID REFERENCES TrainingSessions(Id) ON DELETE CASCADE,
    ExerciseId UUID REFERENCES Exercises(Id) ON DELETE CASCADE,
    Order INTEGER NOT NULL,
    Duration INTEGER NOT NULL, -- minutos
    Repetitions INTEGER,
    Notes VARCHAR(500)
);
```

### 5. Sistema de Ratings y Feedback

Se implementan sistemas de calificación para ejercicios, itinerarios y planificaciones:

- `ExerciseRatings`: Calificaciones de ejercicios (1-5 estrellas)
- `ItineraryRatings`: Calificaciones de itinerarios
- `PlanningRatings`: Calificaciones de planificaciones

Cada tabla de rating incluye:
- Rating numérico (1-5)
- Comentario opcional
- Usuario que califica
- Timestamp de creación
- Constraints de unicidad (un usuario, un rating por elemento)

## Índices y Optimizaciones

### Índices Principales
```sql
-- Índices de unicidad
CREATE UNIQUE INDEX IX_Users_Email ON Users(Email);
CREATE UNIQUE INDEX IX_Users_SupabaseId ON Users(SupabaseId);
CREATE UNIQUE INDEX IX_UserTeams_User_Team ON UserTeams(UserId, TeamId);

-- Índices para consultas frecuentes
CREATE INDEX IX_Teams_Organization ON Teams(OrganizationId);
CREATE INDEX IX_Teams_CreatedBy ON Teams(CreatedByUserId);
CREATE INDEX IX_Plannings_Dates ON Plannings(StartDate, EndDate);
CREATE INDEX IX_Sessions_Planning_Date ON TrainingSessions(PlanningId, Date);

-- Índices para filtros comunes
CREATE INDEX IX_Teams_Active_Visible ON Teams(IsActive, IsVisible);
CREATE INDEX IX_Exercises_Public_Active ON Exercises(IsPublic, IsActive);
```

### Optimizaciones de Consultas
- **Paginación**: Implementada en queries grandes con OFFSET/LIMIT
- **Eager Loading**: Configurado en EF Core para relaciones frecuentes
- **Projections**: Uso de LINQ Select para reducir transferencia de datos
- **Filtros globales**: Configurados para IsActive en EF Core

## Migraciones y Versionado

### Estrategia de Migraciones
- **Code-First**: Migraciones generadas desde modelos C#
- **Versionado automático**: Cada migración incluye timestamp
- **Scripts de rollback**: Disponibles para cada migración
- **Datos seed**: Configurados para suscripciones por defecto

### Datos Iniciales (Seed Data)
```csharp
// Suscripciones por defecto
new Subscription { Name = "Gratuita", Type = Free, MaxTeams = 1, ... }
new Subscription { Name = "Entrenador", Type = Coach, MaxTeams = 5, ... }
new Subscription { Name = "Club", Type = Club, MaxTeams = -1, ... }
```

## Consideraciones de Seguridad

### A Nivel de Base de Datos
- **Constraints de integridad**: FK constraints configurados apropiadamente
- **Validación de datos**: CHECK constraints para rangos válidos
- **Auditoría**: CreatedAt/UpdatedAt en todas las tablas principales
- **Soft deletes**: IsActive para mantener integridad histórica

### A Nivel de Aplicación
- **Parámetros**: Todas las consultas utilizan parámetros SQL
- **Validación**: Data Annotations en todos los modelos
- **Autorización**: Verificación de permisos en servicios
- **Logging**: Registro de operaciones críticas

## Backups y Mantenimiento

### Estrategia de Backup
- **Backup completo**: Diario en horarios de baja actividad
- **Backup incremental**: Cada 4 horas durante horario activo
- **Retención**: 30 días para backups diarios, 7 días para incrementales
- **Pruebas de restore**: Semanales en ambiente de testing

### Mantenimiento Preventivo
- **Reindexación**: Semanal en índices fragmentados
- **Actualización de estadísticas**: Diaria en tablas principales
- **Limpieza de logs**: Automática según política de retención
- **Análisis de performance**: Mensual con revisión de queries lentas

---

*Documentación del esquema de base de datos para SportPlanner v1.0*