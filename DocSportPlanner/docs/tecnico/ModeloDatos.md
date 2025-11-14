# MODELO DE DATOS - SportPlanner

---

## DECISION ARQUITECTONICA: MODELO SEPARADO MARKETPLACE

### ADR-001: Estrategia de Marketplace y Modelo de Datos

**Fecha:** 2025-11-14  
**Estado:** Aprobado  
**Contexto:** Necesitamos decidir como estructurar los datos del marketplace (ejercicios, objetivos, sesiones, planificaciones del sistema) vs los datos de usuarios

**Decision:** **Modelo Separado con Trazabilidad**

**Alternativas consideradas:**
1. ❌ Modelo unificado (una sola tabla con flag `is_from_marketplace`)
2. ✅ Modelo separado (tablas `marketplace_*` vs `user_*`)

**Razon de la decision:**
- ✅ Separacion clara de concerns (datos del sistema vs datos de usuarios)
- ✅ Queries mas rapidas (indices especificos por tipo)
- ✅ Row-level security simple (RLS de Supabase)
- ✅ El usuario puede editar su copia sin afectar el original
- ✅ Facil trackear trazabilidad (de donde vino cada recurso)
- ✅ Sistema puede actualizar marketplace sin tocar datos de usuarios

**Consecuencias:**
- Duplicacion intencional de datos (pero necesaria)
- Mas tablas (pero mejor organizado)
- Estrategia clara de importacion/exportacion

---

## ESTRUCTURA GENERAL

```
MARKETPLACE (Read-Only para usuarios, Write para admins)
├── marketplace_objetivos
├── marketplace_ejercicios
├── marketplace_sesiones
└── marketplace_planificaciones

USER CONTENT (Read-Write para el usuario owner)
├── user_objetivos
├── user_ejercicios
├── user_sesiones
├── user_planificaciones
└── user_planificacion_objetivos (relacion M-N)
└── user_sesion_ejercicios (relacion M-N)

TRACKING / TRAZABILIDAD
└── user_marketplace_imports (log de importaciones)
└── marketplace_ratings (valoraciones de usuarios)
```

---

## A. TABLAS DE MARKETPLACE (Contenido del Sistema/Comunidad)

### 1. marketplace_planificaciones

**Proposito:** Planificaciones completas creadas por el sistema o usuarios verificados que otros pueden importar

```sql
CREATE TABLE marketplace_planificaciones (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Metadata basica
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    deporte VARCHAR(50) NOT NULL CHECK (deporte IN ('futbol', 'baloncesto', 'balonmano')),
    nivel VARCHAR(50), -- infantil, cadete, juvenil, senior
    
    -- Configuracion temporal
    duracion_semanas INT NOT NULL CHECK (duracion_semanas > 0),
    entrenamientos_por_semana INT NOT NULL CHECK (entrenamientos_por_semana BETWEEN 1 AND 7),
    duracion_sesion_minutos INT NOT NULL CHECK (duracion_sesion_minutos > 0),
    
    -- Autor
    created_by_user_id UUID REFERENCES auth.users(id), -- null si es del sistema
    created_by_admin BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false, -- verificado por admin SportPlanner
    
    -- Engagement y stats
    rating_promedio DECIMAL(3,2) DEFAULT 0.00 CHECK (rating_promedio BETWEEN 0 AND 5),
    num_ratings INT DEFAULT 0,
    veces_descargado INT DEFAULT 0,
    veces_visualizado INT DEFAULT 0,
    
    -- Contenido (referencias a otros recursos del marketplace)
    objetivos_ids UUID[] NOT NULL, -- array de marketplace_objetivos.id
    sesiones_template_ids UUID[], -- array de marketplace_sesiones.id (opcional, templates)
    
    -- Metadata adicional
    tags TEXT[],
    categoria VARCHAR(100), -- preparacion_fisica, tecnica, tactica, integral
    
    -- Pricing (para Fase 3 - monetizacion avanzada)
    is_premium BOOLEAN DEFAULT false,
    precio DECIMAL(6,2) DEFAULT 0.00,
    
    -- Imagen de portada
    thumbnail_url TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE -- soft delete
);

-- Indices para queries rapidas
CREATE INDEX idx_marketplace_plan_deporte ON marketplace_planificaciones(deporte);
CREATE INDEX idx_marketplace_plan_nivel ON marketplace_planificaciones(nivel);
CREATE INDEX idx_marketplace_plan_rating ON marketplace_planificaciones(rating_promedio DESC);
CREATE INDEX idx_marketplace_plan_descargas ON marketplace_planificaciones(veces_descargado DESC);
CREATE INDEX idx_marketplace_plan_verified ON marketplace_planificaciones(is_verified) WHERE is_verified = true;
CREATE INDEX idx_marketplace_plan_tags ON marketplace_planificaciones USING GIN(tags);

-- Trigger para actualizar updated_at
CREATE TRIGGER update_marketplace_plan_updated_at
BEFORE UPDATE ON marketplace_planificaciones
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

### 2. marketplace_sesiones

**Proposito:** Sesiones de entrenamiento (coleccion de ejercicios) que usuarios pueden importar

```sql
CREATE TABLE marketplace_sesiones (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Metadata
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    deporte VARCHAR(50) NOT NULL CHECK (deporte IN ('futbol', 'baloncesto', 'balonmano')),
    duracion_total_minutos INT NOT NULL CHECK (duracion_total_minutos > 0),
    
    -- Estructura de sesion (JSON con configuracion)
    estructura JSONB NOT NULL,
    /* Ejemplo de estructura:
    {
        "calentamiento": {
            "duracion_minutos": 15,
            "ejercicios": [
                {"ejercicio_id": "uuid", "duracion": 10, "orden": 1},
                {"ejercicio_id": "uuid", "duracion": 5, "orden": 2}
            ]
        },
        "parte_principal": {
            "duracion_minutos": 60,
            "ejercicios": [...]
        },
        "vuelta_calma": {
            "duracion_minutos": 15,
            "ejercicios": [...]
        }
    }
    */
    
    -- Objetivos que trabaja
    objetivos_ids UUID[] NOT NULL,
    
    -- Autor y verificacion
    created_by_user_id UUID REFERENCES auth.users(id),
    created_by_admin BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    
    -- Engagement
    rating_promedio DECIMAL(3,2) DEFAULT 0.00 CHECK (rating_promedio BETWEEN 0 AND 5),
    num_ratings INT DEFAULT 0,
    veces_descargado INT DEFAULT 0,
    
    -- Metadata
    tags TEXT[],
    nivel_dificultad INT CHECK (nivel_dificultad BETWEEN 1 AND 10),
    num_jugadores_min INT,
    num_jugadores_max INT,
    
    -- Pricing
    is_premium BOOLEAN DEFAULT false,
    precio DECIMAL(6,2) DEFAULT 0.00,
    
    -- Thumbnail
    thumbnail_url TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices
CREATE INDEX idx_marketplace_sesion_deporte ON marketplace_sesiones(deporte);
CREATE INDEX idx_marketplace_sesion_rating ON marketplace_sesiones(rating_promedio DESC);
CREATE INDEX idx_marketplace_sesion_dificultad ON marketplace_sesiones(nivel_dificultad);
CREATE INDEX idx_marketplace_sesion_tags ON marketplace_sesiones USING GIN(tags);
```

---

### 3. marketplace_ejercicios

**Proposito:** Ejercicios individuales con canvas visual que usuarios pueden importar

```sql
CREATE TABLE marketplace_ejercicios (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Metadata basica
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    deporte VARCHAR(50) NOT NULL CHECK (deporte IN ('futbol', 'baloncesto', 'balonmano')),
    
    -- Canvas visual (JSON con posiciones de elementos y animaciones)
    canvas_data JSONB NOT NULL,
    /* Ejemplo de canvas_data:
    {
        "tipo_cancha": "futbol_11v11",
        "elementos": [
            {
                "tipo": "jugador",
                "id": "j1",
                "x": 50,
                "y": 100,
                "color": "azul",
                "numero": 1
            },
            {
                "tipo": "cono",
                "id": "c1",
                "x": 100,
                "y": 150,
                "color": "rojo"
            },
            {
                "tipo": "balon",
                "id": "b1",
                "x": 60,
                "y": 110
            }
        ],
        "animaciones": [
            {
                "elemento_id": "j1",
                "tipo_movimiento": "correr",
                "trayectoria": [[50,100], [80,120], [100,150]],
                "duracion_segundos": 3,
                "orden": 1
            },
            {
                "elemento_id": "b1",
                "tipo_movimiento": "pase",
                "desde": "j1",
                "hacia": "j2",
                "orden": 2
            }
        ]
    }
    */
    
    -- Thumbnail (imagen pre-generada del canvas)
    thumbnail_url TEXT,
    
    -- Objetivos que trabaja
    objetivos_ids UUID[] NOT NULL,
    
    -- Metadata del ejercicio
    num_jugadores INT,
    espacio_necesario VARCHAR(50), -- medio_campo, campo_completo, tercio_campo, etc
    material TEXT[], -- ["conos", "balones", "petos", "aros"]
    duracion_recomendada_minutos INT,
    
    -- Autor y verificacion
    created_by_user_id UUID REFERENCES auth.users(id),
    created_by_admin BOOLEAN DEFAULT false,
    is_verified BOOLEAN DEFAULT false,
    
    -- Engagement
    rating_promedio DECIMAL(3,2) DEFAULT 0.00 CHECK (rating_promedio BETWEEN 0 AND 5),
    num_ratings INT DEFAULT 0,
    veces_descargado INT DEFAULT 0,
    
    -- Clasificacion
    tags TEXT[],
    dificultad INT CHECK (dificultad BETWEEN 1 AND 10),
    categoria VARCHAR(100), -- tecnica, tactica, fisica, psicologica
    
    -- Pricing
    is_premium BOOLEAN DEFAULT false,
    precio DECIMAL(6,2) DEFAULT 0.00,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices
CREATE INDEX idx_marketplace_ejercicio_deporte ON marketplace_ejercicios(deporte);
CREATE INDEX idx_marketplace_ejercicio_rating ON marketplace_ejercicios(rating_promedio DESC);
CREATE INDEX idx_marketplace_ejercicio_dificultad ON marketplace_ejercicios(dificultad);
CREATE INDEX idx_marketplace_ejercicio_categoria ON marketplace_ejercicios(categoria);
CREATE INDEX idx_marketplace_ejercicio_tags ON marketplace_ejercicios USING GIN(tags);
CREATE INDEX idx_marketplace_ejercicio_objetivos ON marketplace_ejercicios USING GIN(objetivos_ids);
```

---

### 4. marketplace_objetivos

**Proposito:** Conceptos/objetivos de entrenamiento (tecnica, tactica, etc) con estructura jerarquica

```sql
CREATE TABLE marketplace_objetivos (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Metadata
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    deporte VARCHAR(50) NOT NULL CHECK (deporte IN ('futbol', 'baloncesto', 'balonmano')),
    categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('tecnica', 'tactica', 'fisica', 'psicologica')),
    
    -- Progresion y dependencias
    dificultad INT NOT NULL CHECK (dificultad BETWEEN 1 AND 10),
    objetivo_padre_id UUID REFERENCES marketplace_objetivos(id), -- para jerarquia
    /* Ejemplo de jerarquia:
        - "Bote" (dificultad 3, padre: null)
            - "Bote con mano derecha" (dificultad 4, padre: "Bote")
            - "Bote con mano izquierda" (dificultad 4, padre: "Bote")
                - "Bote alternando manos" (dificultad 6, padre: "Bote con mano izquierda")
    */
    
    -- Metadata adicional
    tags TEXT[],
    
    -- Engagement (aunque sean del sistema, usuarios pueden valorar utilidad)
    veces_usado INT DEFAULT 0, -- cuantas veces se uso en planificaciones
    
    -- Sistema vs usuario
    created_by_admin BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices
CREATE INDEX idx_marketplace_objetivo_deporte ON marketplace_objetivos(deporte);
CREATE INDEX idx_marketplace_objetivo_categoria ON marketplace_objetivos(categoria);
CREATE INDEX idx_marketplace_objetivo_dificultad ON marketplace_objetivos(dificultad);
CREATE INDEX idx_marketplace_objetivo_padre ON marketplace_objetivos(objetivo_padre_id);
CREATE INDEX idx_marketplace_objetivo_tags ON marketplace_objetivos USING GIN(tags);

-- Constraint para evitar ciclos en jerarquia (objetivo no puede ser padre de si mismo)
ALTER TABLE marketplace_objetivos ADD CONSTRAINT no_self_reference 
CHECK (id != objetivo_padre_id);
```

---

## B. TABLAS DE USER CONTENT (Contenido del Usuario)

### 5. user_planificaciones

**Proposito:** Planificaciones personales del usuario (pueden ser importadas del marketplace o creadas desde cero)

```sql
CREATE TABLE user_planificaciones (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Metadata basica
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    deporte VARCHAR(50) NOT NULL CHECK (deporte IN ('futbol', 'baloncesto', 'balonmano')),
    
    -- Configuracion temporal
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    entrenamientos_por_semana INT NOT NULL CHECK (entrenamientos_por_semana BETWEEN 1 AND 7),
    duracion_sesion_minutos INT NOT NULL CHECK (duracion_sesion_minutos > 0),
    
    -- TRAZABILIDAD DE ORIGEN (clave para marketplace)
    source_marketplace_id UUID REFERENCES marketplace_planificaciones(id),
    fecha_importacion TIMESTAMP WITH TIME ZONE,
    fue_modificado BOOLEAN DEFAULT false, -- true si edito despues de importar
    
    -- Progreso y estado
    progreso_porcentaje INT DEFAULT 0 CHECK (progreso_porcentaje BETWEEN 0 AND 100),
    entrenamientos_completados INT DEFAULT 0,
    entrenamientos_totales INT NOT NULL,
    estado VARCHAR(20) DEFAULT 'activa' CHECK (estado IN ('activa', 'completada', 'archivada', 'pausada')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) - CRITICO para Supabase
ALTER TABLE user_planificaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own planificaciones"
ON user_planificaciones FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own planificaciones"
ON user_planificaciones FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own planificaciones"
ON user_planificaciones FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own planificaciones"
ON user_planificaciones FOR DELETE
USING (auth.uid() = user_id);

-- Indices
CREATE INDEX idx_user_plan_user ON user_planificaciones(user_id);
CREATE INDEX idx_user_plan_estado ON user_planificaciones(estado);
CREATE INDEX idx_user_plan_fecha_inicio ON user_planificaciones(fecha_inicio DESC);
CREATE INDEX idx_user_plan_source ON user_planificaciones(source_marketplace_id) WHERE source_marketplace_id IS NOT NULL;
```

---

### 6. user_planificacion_objetivos (Relacion M-N)

**Proposito:** Asociar objetivos a planificaciones con asignacion temporal (semanas)

```sql
CREATE TABLE user_planificacion_objetivos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    planificacion_id UUID NOT NULL REFERENCES user_planificaciones(id) ON DELETE CASCADE,
    objetivo_id UUID NOT NULL REFERENCES user_objetivos(id) ON DELETE CASCADE,
    
    -- Asignacion temporal
    semana_inicio INT NOT NULL CHECK (semana_inicio > 0),
    semana_fin INT NOT NULL CHECK (semana_fin >= semana_inicio),
    prioridad INT DEFAULT 1 CHECK (prioridad BETWEEN 1 AND 5), -- 1=baja, 5=alta
    
    -- Progreso
    veces_trabajado INT DEFAULT 0,
    completado BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraint unico
    UNIQUE(planificacion_id, objetivo_id)
);

-- Indices
CREATE INDEX idx_user_plan_obj_plan ON user_planificacion_objetivos(planificacion_id);
CREATE INDEX idx_user_plan_obj_objetivo ON user_planificacion_objetivos(objetivo_id);
CREATE INDEX idx_user_plan_obj_semanas ON user_planificacion_objetivos(semana_inicio, semana_fin);
```

---

### 7. user_sesiones

**Proposito:** Sesiones de entrenamiento individuales (pertenecen a una planificacion)

```sql
CREATE TABLE user_sesiones (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    planificacion_id UUID REFERENCES user_planificaciones(id) ON DELETE SET NULL,
    
    -- Metadata
    nombre VARCHAR(255) NOT NULL,
    fecha DATE NOT NULL,
    deporte VARCHAR(50) NOT NULL CHECK (deporte IN ('futbol', 'baloncesto', 'balonmano')),
    duracion_total_minutos INT NOT NULL CHECK (duracion_total_minutos > 0),
    
    -- TRAZABILIDAD
    source_marketplace_id UUID REFERENCES marketplace_sesiones(id),
    fecha_importacion TIMESTAMP WITH TIME ZONE,
    fue_modificado BOOLEAN DEFAULT false,
    
    -- Estado y progreso
    estado VARCHAR(20) DEFAULT 'planificada' CHECK (estado IN ('planificada', 'en_curso', 'completada', 'cancelada')),
    fecha_inicio_real TIMESTAMP WITH TIME ZONE, -- cuando inicia modo entrenador
    fecha_finalizacion_real TIMESTAMP WITH TIME ZONE, -- cuando finaliza
    
    -- Notas
    notas_previas TEXT, -- notas antes del entrenamiento
    notas_posteriores TEXT, -- reflexiones despues del entrenamiento
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE user_sesiones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own sesiones"
ON user_sesiones FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can only manage their own sesiones"
ON user_sesiones FOR ALL
USING (auth.uid() = user_id);

-- Indices
CREATE INDEX idx_user_sesion_user ON user_sesiones(user_id);
CREATE INDEX idx_user_sesion_plan ON user_sesiones(planificacion_id);
CREATE INDEX idx_user_sesion_fecha ON user_sesiones(fecha DESC);
CREATE INDEX idx_user_sesion_estado ON user_sesiones(estado);
```

---

### 8. user_sesion_ejercicios (Relacion M-N con orden)

**Proposito:** Asociar ejercicios a sesiones con orden y configuracion especifica

```sql
CREATE TABLE user_sesion_ejercicios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sesion_id UUID NOT NULL REFERENCES user_sesiones(id) ON DELETE CASCADE,
    ejercicio_id UUID NOT NULL REFERENCES user_ejercicios(id) ON DELETE CASCADE,
    
    -- Configuracion especifica de este ejercicio en esta sesion
    orden INT NOT NULL,
    parte VARCHAR(50) NOT NULL CHECK (parte IN ('calentamiento', 'principal', 'vuelta_calma')),
    duracion_minutos INT NOT NULL CHECK (duracion_minutos > 0),
    repeticiones INT,
    series INT,
    notas TEXT, -- notas especificas para este ejercicio en esta sesion
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraint unico
    UNIQUE(sesion_id, orden)
);

-- Indices
CREATE INDEX idx_user_sesion_ej_sesion ON user_sesion_ejercicios(sesion_id);
CREATE INDEX idx_user_sesion_ej_ejercicio ON user_sesion_ejercicios(ejercicio_id);
CREATE INDEX idx_user_sesion_ej_orden ON user_sesion_ejercicios(sesion_id, orden);
```

---

### 9. user_ejercicios

**Proposito:** Ejercicios personales del usuario (importados o creados)

```sql
CREATE TABLE user_ejercicios (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Metadata
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    deporte VARCHAR(50) NOT NULL CHECK (deporte IN ('futbol', 'baloncesto', 'balonmano')),
    
    -- Canvas visual (mismo formato que marketplace)
    canvas_data JSONB NOT NULL,
    thumbnail_url TEXT,
    
    -- TRAZABILIDAD
    source_marketplace_id UUID REFERENCES marketplace_ejercicios(id),
    fecha_importacion TIMESTAMP WITH TIME ZONE,
    fue_modificado BOOLEAN DEFAULT false,
    
    -- Metadata del ejercicio
    num_jugadores INT,
    espacio_necesario VARCHAR(50),
    material TEXT[],
    dificultad INT CHECK (dificultad BETWEEN 1 AND 10),
    duracion_recomendada_minutos INT,
    
    -- Stats de uso personal
    veces_usado INT DEFAULT 0,
    ultima_vez_usado TIMESTAMP WITH TIME ZONE,
    
    -- Clasificacion
    tags TEXT[],
    categoria VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE user_ejercicios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own ejercicios"
ON user_ejercicios FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can only manage their own ejercicios"
ON user_ejercicios FOR ALL
USING (auth.uid() = user_id);

-- Indices
CREATE INDEX idx_user_ejercicio_user ON user_ejercicios(user_id);
CREATE INDEX idx_user_ejercicio_deporte ON user_ejercicios(deporte);
CREATE INDEX idx_user_ejercicio_dificultad ON user_ejercicios(dificultad);
CREATE INDEX idx_user_ejercicio_tags ON user_ejercicios USING GIN(tags);
CREATE INDEX idx_user_ejercicio_source ON user_ejercicios(source_marketplace_id) WHERE source_marketplace_id IS NOT NULL;
```

---

### 10. user_ejercicio_objetivos (Relacion M-N)

**Proposito:** Asociar objetivos a ejercicios

```sql
CREATE TABLE user_ejercicio_objetivos (
    ejercicio_id UUID NOT NULL REFERENCES user_ejercicios(id) ON DELETE CASCADE,
    objetivo_id UUID NOT NULL REFERENCES user_objetivos(id) ON DELETE CASCADE,
    
    -- Primary Key compuesta
    PRIMARY KEY (ejercicio_id, objetivo_id)
);

-- Indices
CREATE INDEX idx_user_ej_obj_ejercicio ON user_ejercicio_objetivos(ejercicio_id);
CREATE INDEX idx_user_ej_obj_objetivo ON user_ejercicio_objetivos(objetivo_id);
```

---

### 11. user_objetivos

**Proposito:** Objetivos personales del usuario (importados o creados)

```sql
CREATE TABLE user_objetivos (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Metadata
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    deporte VARCHAR(50) NOT NULL CHECK (deporte IN ('futbol', 'baloncesto', 'balonmano')),
    categoria VARCHAR(50) NOT NULL CHECK (categoria IN ('tecnica', 'tactica', 'fisica', 'psicologica')),
    
    -- Progresion
    dificultad INT NOT NULL CHECK (dificultad BETWEEN 1 AND 10),
    objetivo_padre_id UUID REFERENCES user_objetivos(id), -- jerarquia personal
    
    -- TRAZABILIDAD
    source_marketplace_id UUID REFERENCES marketplace_objetivos(id),
    fecha_importacion TIMESTAMP WITH TIME ZONE,
    fue_modificado BOOLEAN DEFAULT false,
    
    -- Stats personales
    veces_trabajado INT DEFAULT 0,
    ultima_vez_trabajado TIMESTAMP WITH TIME ZONE,
    
    -- Clasificacion
    tags TEXT[],
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE user_objetivos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own objetivos"
ON user_objetivos FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can only manage their own objetivos"
ON user_objetivos FOR ALL
USING (auth.uid() = user_id);

-- Indices
CREATE INDEX idx_user_objetivo_user ON user_objetivos(user_id);
CREATE INDEX idx_user_objetivo_deporte ON user_objetivos(deporte);
CREATE INDEX idx_user_objetivo_categoria ON user_objetivos(categoria);
CREATE INDEX idx_user_objetivo_dificultad ON user_objetivos(dificultad);
CREATE INDEX idx_user_objetivo_padre ON user_objetivos(objetivo_padre_id);
CREATE INDEX idx_user_objetivo_source ON user_objetivos(source_marketplace_id) WHERE source_marketplace_id IS NOT NULL;

-- Constraint
ALTER TABLE user_objetivos ADD CONSTRAINT no_self_reference 
CHECK (id != objetivo_padre_id);
```

---

## C. TABLAS DE TRACKING / TRAZABILIDAD

### 12. user_marketplace_imports

**Proposito:** Log de todas las importaciones del marketplace (para analytics y posible re-sincronizacion)

```sql
CREATE TABLE user_marketplace_imports (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Que se importo
    tipo_recurso VARCHAR(50) NOT NULL CHECK (tipo_recurso IN ('planificacion', 'sesion', 'ejercicio', 'objetivo')),
    marketplace_resource_id UUID NOT NULL, -- ID del recurso en tabla marketplace_*
    user_resource_id UUID NOT NULL, -- ID del recurso creado en tablas user_*
    
    -- Metadata
    fecha_importacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    plan_usuario VARCHAR(20), -- free, personal, pro, director, club (para analytics)
    
    -- Rating (usuario puede valorar despues de usar)
    rating_dado INT CHECK (rating_dado BETWEEN 1 AND 5),
    fecha_rating TIMESTAMP WITH TIME ZONE,
    comentario_rating TEXT
);

-- RLS
ALTER TABLE user_marketplace_imports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only see their own imports"
ON user_marketplace_imports FOR SELECT
USING (auth.uid() = user_id);

-- Indices para analytics
CREATE INDEX idx_imports_user ON user_marketplace_imports(user_id);
CREATE INDEX idx_imports_tipo ON user_marketplace_imports(tipo_recurso);
CREATE INDEX idx_imports_marketplace_resource ON user_marketplace_imports(marketplace_resource_id);
CREATE INDEX idx_imports_fecha ON user_marketplace_imports(fecha_importacion DESC);
```

---

### 13. marketplace_ratings

**Proposito:** Valoraciones de usuarios sobre contenido del marketplace (separado para mejor control)

```sql
CREATE TABLE marketplace_ratings (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Que se esta valorando
    tipo_recurso VARCHAR(50) NOT NULL CHECK (tipo_recurso IN ('planificacion', 'sesion', 'ejercicio')),
    resource_id UUID NOT NULL, -- ID del recurso en tabla marketplace_*
    
    -- Valoracion
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comentario TEXT,
    
    -- Metadata
    fecha_rating TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Un usuario solo puede valorar un recurso una vez
    UNIQUE(user_id, tipo_recurso, resource_id)
);

-- RLS
ALTER TABLE marketplace_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see all ratings"
ON marketplace_ratings FOR SELECT
USING (true);

CREATE POLICY "Users can only create their own ratings"
ON marketplace_ratings FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own ratings"
ON marketplace_ratings FOR UPDATE
USING (auth.uid() = user_id);

-- Indices
CREATE INDEX idx_rating_resource ON marketplace_ratings(tipo_recurso, resource_id);
CREATE INDEX idx_rating_user ON marketplace_ratings(user_id);
```

---

## D. FUNCIONES Y TRIGGERS

### Funcion: update_updated_at_column()

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar a todas las tablas con updated_at
CREATE TRIGGER update_user_planificaciones_updated_at
BEFORE UPDATE ON user_planificaciones
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_sesiones_updated_at
BEFORE UPDATE ON user_sesiones
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_ejercicios_updated_at
BEFORE UPDATE ON user_ejercicios
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_objetivos_updated_at
BEFORE UPDATE ON user_objetivos
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Lo mismo para tablas marketplace...
```

---

### Funcion RPC: increment_download_count

```sql
CREATE OR REPLACE FUNCTION increment_download_count(
    resource_type TEXT,
    resource_id UUID
)
RETURNS VOID AS $$
BEGIN
    IF resource_type = 'planificacion' THEN
        UPDATE marketplace_planificaciones
        SET veces_descargado = veces_descargado + 1
        WHERE id = resource_id;
    ELSIF resource_type = 'sesion' THEN
        UPDATE marketplace_sesiones
        SET veces_descargado = veces_descargado + 1
        WHERE id = resource_id;
    ELSIF resource_type = 'ejercicio' THEN
        UPDATE marketplace_ejercicios
        SET veces_descargado = veces_descargado + 1
        WHERE id = resource_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

### Funcion RPC: update_rating_promedio

```sql
CREATE OR REPLACE FUNCTION update_rating_promedio(
    resource_type TEXT,
    resource_id UUID
)
RETURNS VOID AS $$
DECLARE
    avg_rating DECIMAL(3,2);
    count_ratings INT;
BEGIN
    -- Calcular promedio de ratings
    SELECT 
        COALESCE(AVG(rating), 0),
        COUNT(*)
    INTO avg_rating, count_ratings
    FROM marketplace_ratings
    WHERE tipo_recurso = resource_type
      AND resource_id = resource_id;
    
    -- Actualizar tabla correspondiente
    IF resource_type = 'planificacion' THEN
        UPDATE marketplace_planificaciones
        SET rating_promedio = avg_rating,
            num_ratings = count_ratings
        WHERE id = resource_id;
    ELSIF resource_type = 'sesion' THEN
        UPDATE marketplace_sesiones
        SET rating_promedio = avg_rating,
            num_ratings = count_ratings
        WHERE id = resource_id;
    ELSIF resource_type = 'ejercicio' THEN
        UPDATE marketplace_ejercicios
        SET rating_promedio = avg_rating,
            num_ratings = count_ratings
        WHERE id = resource_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para actualizar rating automaticamente
CREATE TRIGGER update_rating_after_insert
AFTER INSERT ON marketplace_ratings
FOR EACH ROW
EXECUTE FUNCTION update_rating_promedio(NEW.tipo_recurso, NEW.resource_id);

CREATE TRIGGER update_rating_after_update
AFTER UPDATE ON marketplace_ratings
FOR EACH ROW
EXECUTE FUNCTION update_rating_promedio(NEW.tipo_recurso, NEW.resource_id);

CREATE TRIGGER update_rating_after_delete
AFTER DELETE ON marketplace_ratings
FOR EACH ROW
EXECUTE FUNCTION update_rating_promedio(OLD.tipo_recurso, OLD.resource_id);
```

---

## E. DIAGRAMA ENTIDAD-RELACION (Resumen Visual)

```
MARKETPLACE (Sistema)
┌─────────────────────────┐
│ marketplace_objetivos   │◄─────┐
│  - id                   │      │
│  - nombre               │      │ jerarquia
│  - dificultad           │      │ (padre-hijo)
│  - objetivo_padre_id    │──────┘
└─────────────────────────┘
         △
         │ referencia
         │
┌────────┴────────────────┐
│ marketplace_ejercicios  │
│  - id                   │
│  - canvas_data (JSON)   │
│  - objetivos_ids []     │────┐
│  - rating_promedio      │    │
└─────────────────────────┘    │
         △                     │
         │                     │
┌────────┴────────────────┐    │
│ marketplace_sesiones    │    │
│  - id                   │    │
│  - estructura (JSON)    │    │
│  - objetivos_ids []     │────┤
└─────────────────────────┘    │
         △                     │
         │                     │
┌────────┴────────────────────┐│
│ marketplace_planificaciones ││
│  - id                       ││
│  - objetivos_ids []         │┘
│  - sesiones_template_ids [] │
└─────────────────────────────┘

         ║ IMPORTACION (copia)
         ║
         ▼

USER CONTENT (Usuario)
┌─────────────────────────┐
│ user_objetivos          │◄─────┐
│  - id                   │      │
│  - user_id              │      │ jerarquia
│  - source_marketplace_id│      │ personal
│  - fue_modificado       │      │
│  - objetivo_padre_id    │──────┘
└─────────────────────────┘
         △
         │
         │    ┌──────────────────────────┐
         └────│ user_ejercicio_objetivos │
              │ (M-N)                    │
              └────────┬─────────────────┘
                       │
┌──────────────────────┴──┐
│ user_ejercicios         │
│  - id                   │
│  - user_id              │
│  - canvas_data (JSON)   │
│  - source_marketplace_id│
│  - fue_modificado       │
└─────────────────────────┘
         △
         │
         │    ┌──────────────────────────┐
         └────│ user_sesion_ejercicios   │
              │ (M-N con orden)          │
              └────────┬─────────────────┘
                       │
┌──────────────────────┴──┐
│ user_sesiones           │
│  - id                   │
│  - user_id              │
│  - planificacion_id     │◄────┐
│  - fecha                │     │
│  - estado               │     │
│  - source_marketplace_id│     │
└─────────────────────────┘     │
                                │
                                │
┌───────────────────────────────┴┐
│ user_planificaciones           │
│  - id                          │
│  - user_id                     │
│  - fecha_inicio / fecha_fin    │
│  - progreso_porcentaje         │
│  - source_marketplace_id       │
│  - fue_modificado              │
└────────────────────────────────┘
         △
         │
         │    ┌─────────────────────────────┐
         └────│ user_planificacion_objetivos│
              │ (M-N con semanas)           │
              └─────────────────────────────┘

TRACKING
┌──────────────────────────────┐
│ user_marketplace_imports     │
│  - user_id                   │
│  - tipo_recurso              │
│  - marketplace_resource_id   │
│  - user_resource_id          │
│  - fecha_importacion         │
└──────────────────────────────┘

┌──────────────────────────────┐
│ marketplace_ratings          │
│  - user_id                   │
│  - tipo_recurso              │
│  - resource_id               │
│  - rating                    │
└──────────────────────────────┘
```

---

**Version:** 1.0  
**Ultima actualizacion:** 2025-11-14  
**Estado:** Completo  
**Siguiente:** Logica de Importacion y Algoritmo de Progresion