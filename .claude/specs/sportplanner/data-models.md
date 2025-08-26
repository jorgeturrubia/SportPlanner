# SportPlanner - Modelos de Datos

## Diagrama de Entidad-Relación

```mermaid
erDiagram
    User ||--o{ Subscription : has
    User ||--o{ UserTeam : belongs_to
    Subscription ||--o{ Organization : owns
    Organization ||--o{ Team : contains
    Team ||--o{ UserTeam : has_members
    Team ||--o{ TeamPlanning : uses
    Planning ||--o{ TeamPlanning : assigned_to
    Planning ||--o{ PlanningConcept : includes
    Planning ||--o{ Training : generates
    Concept ||--o{ PlanningConcept : referenced_in
    Concept ||--o{ ExerciseConcept : trained_by
    Exercise ||--o{ ExerciseConcept : trains
    Exercise ||--o{ TrainingExercise : used_in
    Training ||--o{ TrainingExercise : contains
    Itinerary ||--o{ ItineraryConcept : includes
    Planning ||--o{ PlanningItinerary : uses
    Itinerary ||--o{ PlanningItinerary : assigned_to
    
    User {
        uuid id PK
        string email UK
        string first_name
        string last_name
        string supabase_id UK
        int role
        datetime created_at
        datetime updated_at
        boolean is_active
    }
    
    Subscription {
        uuid id PK
        uuid user_id FK
        string type
        decimal price
        datetime start_date
        datetime end_date
        boolean is_active
        datetime created_at
    }
    
    Organization {
        uuid id PK
        uuid subscription_id FK
        string name
        string description
        boolean is_visible
        datetime created_at
        datetime updated_at
    }
    
    Team {
        uuid id PK
        uuid organization_id FK
        string name
        string gender
        string age_category
        string level
        boolean is_visible
        datetime created_at
        datetime updated_at
    }
    
    UserTeam {
        uuid id PK
        uuid user_id FK
        uuid team_id FK
        string role
        datetime assigned_at
    }
    
    Planning {
        uuid id PK
        uuid creator_id FK
        string name
        string description
        date start_date
        date end_date
        json training_days
        json training_hours
        boolean is_full_court
        boolean is_public
        decimal rating
        int rating_count
        boolean is_visible
        datetime created_at
        datetime updated_at
    }
    
    TeamPlanning {
        uuid id PK
        uuid team_id FK
        uuid planning_id FK
        datetime assigned_at
    }
    
    Concept {
        uuid id PK
        uuid creator_id FK
        string name
        string category
        string subcategory
        int difficulty_level
        int learning_time_estimate
        boolean is_custom
        boolean is_public
        datetime created_at
        datetime updated_at
    }
    
    PlanningConcept {
        uuid id PK
        uuid planning_id FK
        uuid concept_id FK
        int priority
        datetime added_at
    }
    
    Itinerary {
        uuid id PK
        uuid creator_id FK
        string name
        string description
        string target_level
        boolean is_public
        decimal rating
        int rating_count
        datetime created_at
        datetime updated_at
    }
    
    ItineraryConcept {
        uuid id PK
        uuid itinerary_id FK
        uuid concept_id FK
        int order_index
        datetime added_at
    }
    
    PlanningItinerary {
        uuid id PK
        uuid planning_id FK
        uuid itinerary_id FK
        datetime assigned_at
    }
    
    Exercise {
        uuid id PK
        uuid creator_id FK
        string name
        string description
        string instructions
        int duration_minutes
        int difficulty_level
        boolean is_custom
        boolean is_public
        decimal rating
        int rating_count
        datetime created_at
        datetime updated_at
    }
    
    ExerciseConcept {
        uuid id PK
        uuid exercise_id FK
        uuid concept_id FK
        datetime linked_at
    }
    
    Training {
        uuid id PK
        uuid planning_id FK
        date training_date
        time start_time
        time end_time
        string location
        string status
        json execution_notes
        datetime created_at
        datetime updated_at
    }
    
    TrainingExercise {
        uuid id PK
        uuid training_id FK
        uuid exercise_id FK
        int order_index
        int duration_minutes
        boolean is_completed
        json execution_notes
        datetime added_at
    }
```

## Definiciones de Entidades

### Tipos de Suscripción
```typescript
enum SubscriptionType {
  FREE = 'free',        // €0 - 1 equipo, 15 entrenamientos
  TRAINER = 'trainer',  // Acceso completo entrenador
  CLUB = 'club'         // Gestión múltiples equipos
}
```

### Roles de Usuario
```typescript
enum UserRole {
  Administrator = 0,
  Director = 1,
  Coach = 2,
  Member = 3
}
```

### Niveles de Equipo
```typescript
enum TeamLevel {
  A = 'A',  // Alto rendimiento
  B = 'B',  // Intermedio
  C = 'C'   // Iniciación
}
```

### Estados de Entrenamiento
```typescript
enum TrainingStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}
```

## Reglas de Negocio en Base de Datos

### Constraints
1. **Suscripciones**: Un usuario puede tener máximo 1 suscripción activa no gratuita
2. **Equipos**: Limitados según tipo de suscripción
3. **Entrenamientos**: Limitados a 15 en suscripción gratuita
4. **Visibilidad**: Soft delete mediante campo `is_visible`

### Índices Recomendados
```sql
-- Performance crítico
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_subscription_user_active ON subscriptions(user_id, is_active);
CREATE INDEX idx_team_organization ON teams(organization_id);
CREATE INDEX idx_training_date ON trainings(training_date);
CREATE INDEX idx_planning_public_rating ON plannings(is_public, rating DESC);
```

### Triggers y Funciones
1. **Auto-generación entrenamientos**: Al asignar planificación a equipo
2. **Validación límites suscripción**: Antes de crear equipos/entrenamientos
3. **Actualización ratings**: Al recibir nuevas valoraciones
4. **Audit trail**: Registro de cambios en entidades críticas

---
**Estado**: Modelo completo definido
**Siguiente**: Especificación de API REST