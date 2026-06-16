-- =============================================================================
-- Fasetrack Database Schema & Security Setup (Fase 1)
-- Date: 2026-06-14
-- Author: Antigravity
-- =============================================================================

-- Enable UUID extension (standard in PostgreSQL, but ensure it is active)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 1. TABLES DEFINITIONS
-- =============================================================================

-- Users (Profiles linked to Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NULL, -- Nullable to support Supabase Auth
  name VARCHAR(255),
  gender VARCHAR(10),              -- 'male' | 'female'
  age INT,
  equipment JSONB,                 -- ["bilanciere", "manubri", ...]
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exercises (Master Catalog)
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  difficulty VARCHAR(50),          -- 'beginner' | 'intermediate' | 'advanced'
  equipment_required VARCHAR(255)[],
  alternative_names VARCHAR(255)[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Muscle Groups (Master Catalog)
CREATE TABLE muscle_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,      -- 'Petto', 'Dorso', 'Spalle'...
  zone_id VARCHAR(50) NOT NULL,    -- 'chest', 'back', 'shoulders'
  is_primary BOOLEAN DEFAULT true,
  svg_path TEXT,                   -- SVG mapping for heatmap
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exercise-Muscle Mapping
CREATE TABLE exercise_muscle_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  muscle_group_id UUID NOT NULL REFERENCES muscle_groups(id) ON DELETE CASCADE,
  activation_type VARCHAR(50),     -- 'primary' | 'secondary' | 'stabilizer'
  activation_percentage FLOAT DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(exercise_id, muscle_group_id)
);

-- Workout Templates
CREATE TABLE workout_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  template_type VARCHAR(50),       -- 'ipertrofia' | 'forza' | 'calisthenics' | 'custom'
  description TEXT,
  duration_weeks INT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workout Template Exercises
CREATE TABLE workout_template_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES workout_templates(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  day_number INT,                  -- 1-7
  sets_planned INT,
  reps_planned INT,
  rest_seconds INT,
  notes TEXT,
  order_in_day INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workout Sessions
CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES workout_templates(id) ON DELETE SET NULL,
  session_date DATE NOT NULL,
  duration_minutes INT,
  notes TEXT,
  mood_before INT,                 -- 1-10
  mood_after INT,                  -- 1-10
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workout Logs
CREATE TABLE workout_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  set_number INT,
  reps INT,
  weight_kg FLOAT,
  rpe INT,                         -- 1-10
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Muscle Strain Logs
CREATE TABLE muscle_strain_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  muscle_group_id UUID NOT NULL REFERENCES muscle_groups(id) ON DELETE CASCADE,
  total_volume FLOAT,              -- Sets x Reps x Kg
  activation_type VARCHAR(50),     -- 'primary' | 'secondary' | 'stabilizer'
  strain_percentage FLOAT,         -- 0-100
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Progress
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  max_weight_lifted FLOAT,
  total_volume_all_time FLOAT,
  estimated_1rm FLOAT,             -- Estimated 1RM (e.g., Epley formula)
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, exercise_id)
);

-- AI Exercise Variants Cache
CREATE TABLE ai_exercise_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  variant_exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  similarity_score FLOAT,          -- 0-100
  equipment_availability JSONB,    -- Required equipment
  cached_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(original_exercise_id, variant_exercise_id)
);

-- =============================================================================
-- 2. INDEX OPTIMIZATIONS
-- =============================================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_exercises_name ON exercises(name);
CREATE INDEX idx_exercise_muscle_mapping ON exercise_muscle_mapping(exercise_id, muscle_group_id);
CREATE INDEX idx_workout_template_exercises ON workout_template_exercises(template_id);
CREATE INDEX idx_workout_sessions_user_date ON workout_sessions(user_id, session_date);
CREATE INDEX idx_workout_logs_session ON workout_logs(session_id);
CREATE INDEX idx_workout_logs_exercise ON workout_logs(exercise_id);
CREATE INDEX idx_muscle_strain_session ON muscle_strain_logs(session_id);
CREATE INDEX idx_user_progress_user ON user_progress(user_id);

-- =============================================================================
-- 3. UPDATED_AT TRIGGER FUNCTION
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_workout_templates_updated_at 
  BEFORE UPDATE ON workout_templates 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_workout_sessions_updated_at 
  BEFORE UPDATE ON workout_sessions 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- =============================================================================
-- 4. USER SYNCHRONIZATION TRIGGER (auth.users -> public.users)
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE muscle_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_muscle_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_template_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE muscle_strain_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_exercise_variants ENABLE ROW LEVEL SECURITY;

--------------------------------------------------------------------------------
-- A. USERS Table Policies
--------------------------------------------------------------------------------
CREATE POLICY "Users can view their own profile" 
  ON users FOR SELECT TO authenticated 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON users FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON users FOR UPDATE TO authenticated 
  USING (auth.uid() = id) 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own profile" 
  ON users FOR DELETE TO authenticated 
  USING (auth.uid() = id);

--------------------------------------------------------------------------------
-- B. EXERCISES, MUSCLE_GROUPS & MAPPINGS (Master Data Catalog)
--------------------------------------------------------------------------------
CREATE POLICY "Exercises are viewable by authenticated users" 
  ON exercises FOR SELECT TO authenticated 
  USING (true);

CREATE POLICY "Muscle groups are viewable by authenticated users" 
  ON muscle_groups FOR SELECT TO authenticated 
  USING (true);

CREATE POLICY "Mappings are viewable by authenticated users" 
  ON exercise_muscle_mapping FOR SELECT TO authenticated 
  USING (true);

--------------------------------------------------------------------------------
-- C. WORKOUT_TEMPLATES Table Policies
--------------------------------------------------------------------------------
CREATE POLICY "Templates are viewable by owner or if public" 
  ON workout_templates FOR SELECT TO authenticated 
  USING (is_public = true OR user_id = auth.uid());

CREATE POLICY "Users can insert their own templates" 
  ON workout_templates FOR INSERT TO authenticated 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own templates" 
  ON workout_templates FOR UPDATE TO authenticated 
  USING (user_id = auth.uid()) 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own templates" 
  ON workout_templates FOR DELETE TO authenticated 
  USING (user_id = auth.uid());

--------------------------------------------------------------------------------
-- D. WORKOUT_TEMPLATE_EXERCISES Table Policies
--------------------------------------------------------------------------------
CREATE POLICY "Template exercises are viewable if parent template is accessible" 
  ON workout_template_exercises FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workout_templates t
      WHERE t.id = template_id
      AND (t.is_public = true OR t.user_id = auth.uid())
    )
  );

CREATE POLICY "Template exercises are modifiable if parent template is owned" 
  ON workout_template_exercises FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workout_templates t
      WHERE t.id = template_id
      AND t.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_templates t
      WHERE t.id = template_id
      AND t.user_id = auth.uid()
    )
  );

--------------------------------------------------------------------------------
-- E. WORKOUT_SESSIONS Table Policies
--------------------------------------------------------------------------------
CREATE POLICY "Users can manage their own workout sessions" 
  ON workout_sessions FOR ALL TO authenticated 
  USING (user_id = auth.uid()) 
  WITH CHECK (user_id = auth.uid());

--------------------------------------------------------------------------------
-- F. WORKOUT_LOGS Table Policies
--------------------------------------------------------------------------------
CREATE POLICY "Users can manage logs of their own sessions" 
  ON workout_logs FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workout_sessions s
      WHERE s.id = session_id
      AND s.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_sessions s
      WHERE s.id = session_id
      AND s.user_id = auth.uid()
    )
  );

--------------------------------------------------------------------------------
-- G. MUSCLE_STRAIN_LOGS Table Policies
--------------------------------------------------------------------------------
CREATE POLICY "Users can manage strain logs of their own sessions" 
  ON muscle_strain_logs FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workout_sessions s
      WHERE s.id = session_id
      AND s.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_sessions s
      WHERE s.id = session_id
      AND s.user_id = auth.uid()
    )
  );

--------------------------------------------------------------------------------
-- H. USER_PROGRESS Table Policies
--------------------------------------------------------------------------------
CREATE POLICY "Users can manage their own progress records" 
  ON user_progress FOR ALL TO authenticated 
  USING (user_id = auth.uid()) 
  WITH CHECK (user_id = auth.uid());

--------------------------------------------------------------------------------
-- I. AI_EXERCISE_VARIANTS Table Policies (Cache table shared globally)
--------------------------------------------------------------------------------
CREATE POLICY "AI variants are viewable by authenticated users" 
  ON ai_exercise_variants FOR SELECT TO authenticated 
  USING (true);

CREATE POLICY "Users can insert new AI variants into cache" 
  ON ai_exercise_variants FOR INSERT TO authenticated 
  WITH CHECK (true);
