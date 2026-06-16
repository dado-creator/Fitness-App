# FitTrack Database Schema

## Overview
Complete relational database schema for the FitTrack fitness application, built on Supabase (PostgreSQL).

## Core Tables

### 1. Users
Stores user account information and preferences.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  gender VARCHAR(10),           -- 'male' | 'female'
  age INT,
  equipment JSONB,              -- ["bilanciere", "manubri", ...]
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

### 2. Exercises (Master Data)
Catalog of all available exercises.

```sql
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  difficulty VARCHAR(50),       -- 'beginner' | 'intermediate' | 'advanced'
  equipment_required VARCHAR(255)[],
  alternative_names VARCHAR(255)[],
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_exercises_name ON exercises(name);
```

**Example Data:**
- Panca piana, Squat, Trazioni, Croci ai cavi, Rematore, Spinte...

### 3. Muscle Groups (Master Data)
Anatomical muscle definitions for the human body.

```sql
CREATE TABLE muscle_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,   -- 'Petto', 'Dorso', 'Spalle'...
  zone_id VARCHAR(50) NOT NULL, -- 'chest', 'back', 'shoulders'
  is_primary BOOLEAN DEFAULT true,
  svg_path TEXT,                -- SVG mapping for heatmap
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Muscle Groups:**
- Petto (Primary)
- Dorso (Primary)
- Spalle (Primary)
- Bicipiti, Tricipiti, Avambracci
- Addominali, Obliqui, Lombari
- Quadricipiti, Femorali, Glutei, Polpacci

### 4. Exercise-Muscle Mapping
Links exercises to the muscles they target.

```sql
CREATE TABLE exercise_muscle_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id UUID NOT NULL REFERENCES exercises(id),
  muscle_group_id UUID NOT NULL REFERENCES muscle_groups(id),
  activation_type VARCHAR(50),  -- 'primary' | 'secondary' | 'stabilizer'
  activation_percentage FLOAT DEFAULT 100,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(exercise_id, muscle_group_id)
);

CREATE INDEX idx_exercise_muscle_mapping ON exercise_muscle_mapping(exercise_id, muscle_group_id);
```

**Example:**
- Panca piana → Petto (primary 100%), Tricipiti (secondary 70%), Spalle (secondary 50%)
- Squat → Quadricipiti (primary 100%), Glutei (primary 90%), Femorali (secondary 60%)

## Workout Templates

### 5. Workout Templates
Pre-built or custom workout programs.

```sql
CREATE TABLE workout_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  template_type VARCHAR(50),    -- 'ipertrofia' | 'forza' | 'calisthenics' | 'custom'
  description TEXT,
  duration_weeks INT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 6. Workout Template Exercises
Exercises assigned to specific days in a template.

```sql
CREATE TABLE workout_template_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES workout_templates(id),
  exercise_id UUID NOT NULL REFERENCES exercises(id),
  day_number INT,               -- 1-7 (day of week)
  sets_planned INT,
  reps_planned INT,
  rest_seconds INT,
  notes TEXT,
  order_in_day INT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_workout_template_exercises ON workout_template_exercises(template_id);
```

## Workout Logs

### 7. Workout Sessions
Individual workout sessions performed by users.

```sql
CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  template_id UUID REFERENCES workout_templates(id),
  session_date DATE NOT NULL,
  duration_minutes INT,
  notes TEXT,
  mood_before INT,              -- 1-10 scale
  mood_after INT,               -- 1-10 scale
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_workout_sessions_user_date ON workout_sessions(user_id, session_date);
```

### 8. Workout Logs
Individual sets logged during a workout.

```sql
CREATE TABLE workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES workout_sessions(id),
  exercise_id UUID NOT NULL REFERENCES exercises(id),
  set_number INT,
  reps INT,
  weight_kg FLOAT,
  rpe INT,                      -- Rate of Perceived Exertion (1-10)
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_workout_logs_session ON workout_logs(session_id);
CREATE INDEX idx_workout_logs_exercise ON workout_logs(exercise_id);
```

## Analytics & Progress

### 9. Muscle Strain Logs
Calculated muscle engagement per workout session.

```sql
CREATE TABLE muscle_strain_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES workout_sessions(id),
  muscle_group_id UUID NOT NULL REFERENCES muscle_groups(id),
  total_volume FLOAT,           -- Series x Reps x Kg
  activation_type VARCHAR(50),  -- 'primary' | 'secondary' | 'stabilizer'
  strain_percentage FLOAT,      -- 0-100 for heatmap
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_muscle_strain_session ON muscle_strain_logs(session_id);
```

### 10. User Progress
Aggregated progress metrics per exercise.

```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  exercise_id UUID NOT NULL REFERENCES exercises(id),
  max_weight_lifted FLOAT,
  total_volume_all_time FLOAT,
  estimated_1rm FLOAT,          -- Estimated one-rep max
  last_updated TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, exercise_id)
);

CREATE INDEX idx_user_progress_user ON user_progress(user_id);
```

## AI Features

### 11. AI Exercise Variants
Cache of AI-generated exercise variations.

```sql
CREATE TABLE ai_exercise_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_exercise_id UUID NOT NULL REFERENCES exercises(id),
  variant_exercise_id UUID NOT NULL REFERENCES exercises(id),
  similarity_score FLOAT,       -- 0-100
  equipment_availability JSONB, -- Required equipment
  cached_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(original_exercise_id, variant_exercise_id)
);
```

## Key Relationships

```
users
  ├─→ workout_sessions (1:many)
  │    ├─→ workout_logs (1:many)
  │    └─→ muscle_strain_logs (1:many)
  ├─→ workout_templates (1:many)
  │    └─→ workout_template_exercises (1:many)
  └─→ user_progress (1:many)

exercises
  ├─→ exercise_muscle_mapping (1:many)
  └─→ workout_logs (1:many)
  └─→ ai_exercise_variants (1:many)

muscle_groups
  └─→ exercise_muscle_mapping (1:many)
  └─→ muscle_strain_logs (1:many)
```

## Data Integrity

### Cascading Deletes
- Deleting a user cascades to: workout_sessions, workout_templates, user_progress
- Deleting a workout_session cascades to: workout_logs, muscle_strain_logs
- Deleting an exercise cascades to: exercise_muscle_mapping, workout_logs

### Constraints
- User email is unique
- Exercise-Muscle mapping is unique per pair
- User-Exercise progress is unique per pair
- Original-Variant exercise pairs are unique

## Performance Optimizations

- B-tree indexes on foreign keys and frequently searched columns
- Composite indexes on common query patterns (user_id + date)
- JSONB column for flexible equipment storage with GIN index capability

## Seed Data

Initial data to load:
1. 200+ exercises with categories and difficulty levels
2. 13 muscle groups with anatomical zones
3. Exercise-muscle mappings for all exercises
4. 10 pre-built workout templates (Ipertrofia, Forza, PPL, Upper/Lower, ecc.)

## Queries Examples

### Get all exercises for a muscle group
```sql
SELECT DISTINCT e.* 
FROM exercises e
JOIN exercise_muscle_mapping emm ON e.id = emm.exercise_id
WHERE emm.muscle_group_id = $1 AND emm.activation_type = 'primary'
ORDER BY e.name;
```

### Calculate total volume per muscle in a session
```sql
SELECT 
  msl.muscle_group_id,
  mg.name,
  SUM(msl.total_volume) as total_volume,
  msl.strain_percentage
FROM muscle_strain_logs msl
JOIN muscle_groups mg ON msl.muscle_group_id = mg.id
WHERE msl.session_id = $1
GROUP BY msl.muscle_group_id, mg.name, msl.strain_percentage;
```

### Get user's 1RM history for an exercise
```sql
SELECT 
  up.estimated_1rm,
  up.last_updated,
  RANK() OVER (ORDER BY up.last_updated) as rank
FROM user_progress up
WHERE up.user_id = $1 AND up.exercise_id = $2
ORDER BY up.last_updated DESC
LIMIT 50;
```

---

**Status**: Schema design complete, ready for implementation in Supabase
