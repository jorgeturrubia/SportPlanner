# Database Schema - E2E CRUD Testing

## Test Database Requirements

### Test Environment Isolation
Create dedicated test database schema to ensure test data isolation from production:

```sql
-- Test database schema creation
CREATE SCHEMA IF NOT EXISTS plansport_test;

-- Set search path for test environment
SET search_path TO plansport_test, public;
```

### Core Entity Tables for Testing

#### Teams Table
```sql
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    sport VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    level VARCHAR(1) NOT NULL CHECK (level IN ('A', 'B', 'C')),
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('Masculino', 'Femenino')),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints for testing
    CONSTRAINT unique_team_name_per_user UNIQUE (name, user_id),
    CONSTRAINT valid_sport CHECK (sport IN ('Futbol', 'Baloncesto', 'Volleyball', 'Tenis', 'Natacion'))
);

-- Index for performance testing
CREATE INDEX idx_teams_user_id ON teams(user_id);
CREATE INDEX idx_teams_sport ON teams(sport);
```

#### Exercises Table
```sql
CREATE TABLE exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    sport VARCHAR(50) NOT NULL,
    difficulty INTEGER NOT NULL CHECK (difficulty >= 1 AND difficulty <= 5),
    estimated_time INTEGER NOT NULL CHECK (estimated_time > 0),
    instructions TEXT,
    media_urls TEXT[], -- Array of media URLs
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints for testing
    CONSTRAINT valid_exercise_sport CHECK (sport IN ('Futbol', 'Baloncesto', 'Volleyball', 'Tenis', 'Natacion'))
);

-- Indexes for performance testing
CREATE INDEX idx_exercises_user_id ON exercises(user_id);
CREATE INDEX idx_exercises_sport ON exercises(sport);
CREATE INDEX idx_exercises_difficulty ON exercises(difficulty);
```

#### Objectives Table
```sql
CREATE TABLE objectives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    target_value DECIMAL(10,2) NOT NULL CHECK (target_value > 0),
    current_value DECIMAL(10,2) DEFAULT 0 CHECK (current_value >= 0),
    unit VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'Completed', 'Paused')),
    due_date DATE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints for testing
    CONSTRAINT progress_not_exceed_target CHECK (current_value <= target_value)
);

-- Indexes for performance testing
CREATE INDEX idx_objectives_team_id ON objectives(team_id);
CREATE INDEX idx_objectives_user_id ON objectives(user_id);
CREATE INDEX idx_objectives_status ON objectives(status);
```

#### Many-to-Many Relationship Tables

##### Exercise-Concept Association (for testing relationships)
```sql
CREATE TABLE exercise_concepts (
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    concept_id UUID NOT NULL, -- Simplified for testing
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    PRIMARY KEY (exercise_id, concept_id)
);

CREATE INDEX idx_exercise_concepts_exercise ON exercise_concepts(exercise_id);
CREATE INDEX idx_exercise_concepts_concept ON exercise_concepts(concept_id);
```

### Test Data Seeding Tables

#### Test Users
```sql
CREATE TABLE test_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    subscription_tier VARCHAR(20) DEFAULT 'Free' CHECK (subscription_tier IN ('Free', 'Coach', 'Club')),
    max_teams INTEGER DEFAULT 1,
    max_exercises INTEGER DEFAULT 15,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed test users
INSERT INTO test_users (email, subscription_tier, max_teams, max_exercises) VALUES
('test-free@plansport.com', 'Free', 1, 15),
('test-coach@plansport.com', 'Coach', 999, 999),
('test-club@plansport.com', 'Club', 999, 999);
```

#### Test Performance Metrics
```sql
CREATE TABLE test_performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_name VARCHAR(100) NOT NULL,
    operation_type VARCHAR(50) NOT NULL, -- CREATE, READ, UPDATE, DELETE
    entity_type VARCHAR(50) NOT NULL, -- teams, exercises, objectives
    response_time_ms INTEGER NOT NULL,
    concurrent_users INTEGER DEFAULT 1,
    success BOOLEAN NOT NULL,
    error_message TEXT,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_performance_test_name ON test_performance_metrics(test_name);
CREATE INDEX idx_performance_operation ON test_performance_metrics(operation_type);
CREATE INDEX idx_performance_entity ON test_performance_metrics(entity_type);
```

### Database Functions for Testing

#### Cleanup Function
```sql
CREATE OR REPLACE FUNCTION cleanup_test_data(test_user_id UUID)
RETURNS VOID AS $$
BEGIN
    -- Delete in proper order to respect foreign keys
    DELETE FROM objectives WHERE user_id = test_user_id;
    DELETE FROM exercise_concepts WHERE exercise_id IN (
        SELECT id FROM exercises WHERE user_id = test_user_id
    );
    DELETE FROM exercises WHERE user_id = test_user_id;
    DELETE FROM teams WHERE user_id = test_user_id;
END;
$$ LANGUAGE plpgsql;
```

#### Bulk Insert Function for Performance Testing
```sql
CREATE OR REPLACE FUNCTION bulk_insert_teams(
    test_user_id UUID,
    team_count INTEGER
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO teams (name, sport, category, level, gender, user_id)
    SELECT 
        'Test Team ' || generate_series,
        'Futbol',
        'Senior',
        'A',
        'Masculino',
        test_user_id
    FROM generate_series(1, team_count);
END;
$$ LANGUAGE plpgsql;
```

### Database Triggers for Testing

#### Updated_at Trigger
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all main tables
CREATE TRIGGER update_teams_updated_at
    BEFORE UPDATE ON teams
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at
    BEFORE UPDATE ON exercises
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_objectives_updated_at
    BEFORE UPDATE ON objectives
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### Test Data Constraints and Validations

#### Subscription Tier Enforcement
```sql
-- Function to check team limits
CREATE OR REPLACE FUNCTION check_team_limit()
RETURNS TRIGGER AS $$
DECLARE
    user_team_count INTEGER;
    max_allowed INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_team_count
    FROM teams 
    WHERE user_id = NEW.user_id;
    
    SELECT max_teams INTO max_allowed
    FROM test_users
    WHERE id = NEW.user_id;
    
    IF user_team_count >= max_allowed THEN
        RAISE EXCEPTION 'Team limit exceeded for user subscription tier';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_team_limit
    BEFORE INSERT ON teams
    FOR EACH ROW
    EXECUTE FUNCTION check_team_limit();
```

### Migration Scripts for Test Environment

#### Setup Migration
```sql
-- V1__Create_test_schema.sql
CREATE SCHEMA IF NOT EXISTS plansport_test;
SET search_path TO plansport_test, public;

-- Create all tables as defined above
-- Apply all indexes, constraints, and functions
```

#### Teardown Migration
```sql
-- V999__Teardown_test_schema.sql
DROP SCHEMA IF EXISTS plansport_test CASCADE;
```

### Test Database Performance Considerations

#### Query Optimization for Testing
- Ensure all foreign key columns have indexes
- Create composite indexes for common query patterns
- Use EXPLAIN ANALYZE for performance test validation

#### Connection Pool Configuration
```sql
-- Test environment connection settings
ALTER SYSTEM SET max_connections = 100;
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
SELECT pg_reload_conf();
```

This database schema ensures comprehensive testing of CRUD operations while maintaining data integrity and performance benchmarks required for the E2E testing specification.