# Plantilla: Sistema Deportivo

## Entidades Principales

### Athlete (Atleta)
```typescript
interface Athlete {
  id: string;
  email: string;
  name: string;
  dateOfBirth: Date;
  sportSpecialization: string;
  physicalMetrics: PhysicalMetrics;
  coachId?: string;
  teamId?: string;
  goals: Goal[];
}
```

### Coach (Entrenador)
```typescript
interface Coach {
  id: string;
  name: string;
  certifications: Certification[];
  specializations: string[];
  athletes: string[]; // athlete IDs
}
```

### TrainingPlan (Plan de Entrenamiento)
```typescript
interface TrainingPlan {
  id: string;
  name: string;
  description: string;
  sport: SportType;
  difficultyLevel: 1 | 2 | 3 | 4 | 5;
  durationWeeks: number;
  phases: TrainingPhase[];
  targetMetrics: PerformanceMetric[];
}
```

## Esquema de Base de Datos

### Tablas Principales
```sql
-- Atletas
CREATE TABLE athletes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  date_of_birth DATE,
  sport_specialization TEXT,
  height_cm INTEGER,
  weight_kg DECIMAL(5,2),
  coach_id UUID REFERENCES coaches(id),
  team_id UUID REFERENCES teams(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sesiones de Entrenamiento
CREATE TABLE training_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES training_plans(id),
  scheduled_date TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER,
  intensity_level INTEGER CHECK (intensity_level BETWEEN 1 AND 10),
  calories_burned INTEGER,
  notes TEXT,
  completed_at TIMESTAMPTZ
);

-- Métricas de Rendimiento
CREATE TABLE performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL, -- 'strength', 'endurance', 'speed', etc.
  value DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL,
  recorded_date TIMESTAMPTZ DEFAULT NOW(),
  session_id UUID REFERENCES training_sessions(id)
);
```

## APIs de Negocio

### Endpoints de Atletas
```csharp
// GET /api/athletes/{id}/progress
// POST /api/athletes/{id}/assign-plan
// GET /api/athletes/{id}/metrics
// POST /api/athletes/{id}/log-workout
```

### Endpoints de Entrenamiento
```csharp
// GET /api/training/plans
// POST /api/training/sessions
// PUT /api/training/sessions/{id}/complete
// GET /api/training/analytics/{athleteId}
```

## Componentes UI Específicos

### Dashboard de Atleta
- Progreso de entrenamientos
- Métricas de rendimiento
- Próximas sesiones
- Historial de logros

### Panel de Entrenador
- Lista de atletas asignados
- Diseño de planes de entrenamiento
- Análisis de progreso grupal
- Comunicación con atletas

## Reglas de Negocio

1. **Asignación de Planes**: Un atleta solo puede tener un plan activo
2. **Intensidad Progresiva**: La intensidad debe aumentar gradualmente
3. **Días de Descanso**: Obligatorios según el tipo de entrenamiento
4. **Métricas Válidas**: Solo registrar métricas en rangos realistas
5. **Acceso a Datos**: Entrenadores solo ven sus atletas asignados
