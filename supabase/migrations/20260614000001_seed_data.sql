-- =============================================================================
-- Seed Data for FitTrack Database
-- Date: 2026-06-14
-- =============================================================================

-- Re-adjust column types for string muscle IDs (VARCHAR(50) instead of UUID)
DROP TABLE IF EXISTS exercise_muscle_mapping CASCADE;
DROP TABLE IF EXISTS muscle_strain_logs CASCADE;
DROP TABLE IF EXISTS muscle_groups CASCADE;

CREATE TABLE muscle_groups (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  zone_id VARCHAR(50) NOT NULL,
  is_primary BOOLEAN DEFAULT true,
  svg_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE exercise_muscle_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  muscle_group_id VARCHAR(50) NOT NULL REFERENCES muscle_groups(id) ON DELETE CASCADE,
  activation_type VARCHAR(50),
  activation_percentage FLOAT DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(exercise_id, muscle_group_id)
);

CREATE TABLE muscle_strain_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  muscle_group_id VARCHAR(50) NOT NULL REFERENCES muscle_groups(id) ON DELETE CASCADE,
  total_volume FLOAT,
  activation_type VARCHAR(50),
  strain_percentage FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and recreate policies
ALTER TABLE muscle_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_muscle_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE muscle_strain_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Muscle groups are viewable by authenticated users" 
  ON muscle_groups FOR SELECT TO authenticated USING (true);

CREATE POLICY "Mappings are viewable by authenticated users" 
  ON exercise_muscle_mapping FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can manage strain logs of their own sessions" 
  ON muscle_strain_logs FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM workout_sessions s WHERE s.id = session_id AND s.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM workout_sessions s WHERE s.id = session_id AND s.user_id = auth.uid()));

CREATE INDEX idx_exercise_muscle_mapping ON exercise_muscle_mapping(exercise_id, muscle_group_id);
CREATE INDEX idx_muscle_strain_session ON muscle_strain_logs(session_id);

-- 1. Insert Muscle Groups
INSERT INTO muscle_groups (id, name, zone_id, is_primary, svg_path) VALUES
('muscle-chest', 'Petto', 'chest', true, 'chest'),
('muscle-back', 'Dorso', 'back', true, 'back'),
('muscle-shoulders', 'Spalle', 'shoulders', true, 'shoulders'),
('muscle-biceps', 'Bicipiti', 'biceps', false, 'biceps'),
('muscle-triceps', 'Tricipiti', 'triceps', false, 'triceps'),
('muscle-forearms', 'Avambracci', 'forearms', false, 'forearms'),
('muscle-abs', 'Addominali', 'abs', true, 'abs'),
('muscle-obliques', 'Obliqui', 'obliques', false, 'obliques'),
('muscle-lowerback', 'Lombari', 'lowerback', true, 'lowerback'),
('muscle-quads', 'Quadricipiti', 'quads', true, 'quads'),
('muscle-hamstrings', 'Femorali', 'hamstrings', true, 'hamstrings'),
('muscle-glutes', 'Glutei', 'glutes', true, 'glutes'),
('muscle-calves', 'Polpacci', 'calves', true, 'calves');

-- 2. Insert Exercises
INSERT INTO exercises (id, name, difficulty, equipment_required, alternative_names) VALUES
('00000000-0000-0000-0000-000000000001', 'Panca piana', 'intermediate', ARRAY['bilanciere']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-000000000002', 'Panca inclinata', 'intermediate', ARRAY['bilanciere']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-000000000003', 'Squat', 'intermediate', ARRAY['bilanciere']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-000000000004', 'Leg press', 'beginner', ARRAY['macchine']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-000000000005', 'Estensioni gambe', 'beginner', ARRAY['macchine']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-000000000006', 'Trazioni', 'intermediate', ARRAY['corpo_libero']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-000000000007', 'Lat machine', 'beginner', ARRAY['macchine']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-000000000008', 'Croci ai cavi', 'beginner', ARRAY['cavi']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-000000000009', 'Croci ai manubri', 'beginner', ARRAY['manubri']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-00000000000a', 'Rematore con bilanciere', 'intermediate', ARRAY['bilanciere']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-00000000000b', 'Rematore con manubri', 'intermediate', ARRAY['manubri']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-00000000000c', 'Spinte con manubri', 'intermediate', ARRAY['manubri']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-00000000000d', 'Military press', 'intermediate', ARRAY['bilanciere']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-00000000000e', 'Alzate laterali', 'beginner', ARRAY['manubri']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-00000000000f', 'Curl con bilanciere', 'beginner', ARRAY['bilanciere']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-000000000010', 'Curl con manubri', 'beginner', ARRAY['manubri']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-000000000011', 'French press', 'intermediate', ARRAY['bilanciere']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-000000000012', 'Spinte tricipiti', 'beginner', ARRAY['cavi']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-000000000013', 'Stacchi da terra', 'advanced', ARRAY['bilanciere']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-000000000014', 'Stacchi rumeni', 'intermediate', ARRAY['bilanciere']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-000000000015', 'Leg curl', 'beginner', ARRAY['macchine']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-000000000016', 'Spinte sulle gambe', 'beginner', ARRAY['macchine']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-000000000017', 'Calf raises', 'beginner', ARRAY['corpo_libero']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-000000000018', 'Addominali crunch', 'beginner', ARRAY['corpo_libero']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-000000000019', 'Plank', 'beginner', ARRAY['corpo_libero']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-00000000001a', 'Flessioni', 'beginner', ARRAY['corpo_libero']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-00000000001b', 'Dip', 'intermediate', ARRAY['corpo_libero']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-00000000001c', 'Pike push-up', 'intermediate', ARRAY['corpo_libero']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-00000000001d', 'Affondi', 'beginner', ARRAY['corpo_libero']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-00000000001e', 'Bulgarian split squat', 'advanced', ARRAY['manubri']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-00000000001f', 'Trap bar deadlift', 'intermediate', ARRAY['bilanciere']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-000000000020', 'Good morning', 'intermediate', ARRAY['bilanciere']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-000000000021', 'Cable pullover', 'beginner', ARRAY['cavi']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-000000000022', 'Arnold press', 'intermediate', ARRAY['manubri']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-000000000023', 'Spinte ai cavi', 'beginner', ARRAY['cavi']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-000000000024', 'Pec deck', 'beginner', ARRAY['macchine']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-000000000025', 'Flessioni strette', 'beginner', ARRAY['corpo_libero']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-000000000026', 'Curl ai cavi', 'beginner', ARRAY['cavi']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-000000000027', 'Curl a martello', 'beginner', ARRAY['manubri']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-000000000028', 'Trazioni presa supina', 'intermediate', ARRAY['corpo_libero']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-000000000029', 'Spinte tricipiti ai cavi', 'beginner', ARRAY['cavi']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]),
('00000000-0000-0000-0000-00000000002a', 'Close grip bench', 'intermediate', ARRAY['bilanciere']::VARCHAR(255)[], ARRAY[]::VARCHAR(255)[]);

-- 3. Insert Exercise-Muscle Mappings
INSERT INTO exercise_muscle_mapping (exercise_id, muscle_group_id, activation_type, activation_percentage) VALUES
('00000000-0000-0000-0000-000000000001', 'muscle-chest', 'primary', 100),
('00000000-0000-0000-0000-000000000001', 'muscle-triceps', 'secondary', 70),
('00000000-0000-0000-0000-000000000001', 'muscle-shoulders', 'secondary', 50),
('00000000-0000-0000-0000-000000000002', 'muscle-chest', 'primary', 100),
('00000000-0000-0000-0000-000000000002', 'muscle-shoulders', 'secondary', 80),
('00000000-0000-0000-0000-000000000002', 'muscle-triceps', 'secondary', 60),
('00000000-0000-0000-0000-000000000003', 'muscle-quads', 'primary', 100),
('00000000-0000-0000-0000-000000000003', 'muscle-glutes', 'primary', 90),
('00000000-0000-0000-0000-000000000003', 'muscle-hamstrings', 'secondary', 60),
('00000000-0000-0000-0000-000000000003', 'muscle-lowerback', 'stabilizer', 40),
('00000000-0000-0000-0000-000000000004', 'muscle-quads', 'primary', 100),
('00000000-0000-0000-0000-000000000004', 'muscle-glutes', 'primary', 80),
('00000000-0000-0000-0000-000000000004', 'muscle-hamstrings', 'secondary', 50),
('00000000-0000-0000-0000-000000000005', 'muscle-quads', 'primary', 100),
('00000000-0000-0000-0000-000000000006', 'muscle-back', 'primary', 100),
('00000000-0000-0000-0000-000000000006', 'muscle-biceps', 'secondary', 80),
('00000000-0000-0000-0000-000000000006', 'muscle-forearms', 'secondary', 60),
('00000000-0000-0000-0000-000000000007', 'muscle-back', 'primary', 100),
('00000000-0000-0000-0000-000000000007', 'muscle-biceps', 'secondary', 70),
('00000000-0000-0000-0000-000000000008', 'muscle-chest', 'primary', 100),
('00000000-0000-0000-0000-000000000008', 'muscle-shoulders', 'secondary', 40),
('00000000-0000-0000-0000-000000000009', 'muscle-chest', 'primary', 100),
('00000000-0000-0000-0000-000000000009', 'muscle-shoulders', 'secondary', 50),
('00000000-0000-0000-0000-00000000000a', 'muscle-back', 'primary', 100),
('00000000-0000-0000-0000-00000000000a', 'muscle-biceps', 'secondary', 70),
('00000000-0000-0000-0000-00000000000a', 'muscle-lowerback', 'secondary', 60),
('00000000-0000-0000-0000-00000000000b', 'muscle-back', 'primary', 100),
('00000000-0000-0000-0000-00000000000b', 'muscle-biceps', 'secondary', 70),
('00000000-0000-0000-0000-00000000000c', 'muscle-shoulders', 'primary', 100),
('00000000-0000-0000-0000-00000000000c', 'muscle-triceps', 'secondary', 70),
('00000000-0000-0000-0000-00000000000c', 'muscle-chest', 'secondary', 50),
('00000000-0000-0000-0000-00000000000d', 'muscle-shoulders', 'primary', 100),
('00000000-0000-0000-0000-00000000000d', 'muscle-triceps', 'secondary', 75),
('00000000-0000-0000-0000-00000000000d', 'muscle-chest', 'secondary', 40),
('00000000-0000-0000-0000-00000000000e', 'muscle-shoulders', 'primary', 100),
('00000000-0000-0000-0000-00000000000f', 'muscle-biceps', 'primary', 100),
('00000000-0000-0000-0000-00000000000f', 'muscle-forearms', 'secondary', 60),
('00000000-0000-0000-0000-000000000010', 'muscle-biceps', 'primary', 100),
('00000000-0000-0000-0000-000000000010', 'muscle-forearms', 'secondary', 60),
('00000000-0000-0000-0000-000000000011', 'muscle-triceps', 'primary', 100),
('00000000-0000-0000-0000-000000000012', 'muscle-triceps', 'primary', 100),
('00000000-0000-0000-0000-000000000013', 'muscle-lowerback', 'primary', 100),
('00000000-0000-0000-0000-000000000013', 'muscle-glutes', 'primary', 90),
('00000000-0000-0000-0000-000000000013', 'muscle-hamstrings', 'secondary', 80),
('00000000-0000-0000-0000-000000000013', 'muscle-forearms', 'secondary', 60),
('00000000-0000-0000-0000-000000000014', 'muscle-hamstrings', 'primary', 100),
('00000000-0000-0000-0000-000000000014', 'muscle-glutes', 'primary', 90),
('00000000-0000-0000-0000-000000000014', 'muscle-lowerback', 'secondary', 70),
('00000000-0000-0000-0000-000000000015', 'muscle-hamstrings', 'primary', 100),
('00000000-0000-0000-0000-000000000016', 'muscle-glutes', 'primary', 100),
('00000000-0000-0000-0000-000000000016', 'muscle-hamstrings', 'secondary', 70),
('00000000-0000-0000-0000-000000000017', 'muscle-calves', 'primary', 100),
('00000000-0000-0000-0000-000000000018', 'muscle-abs', 'primary', 100),
('00000000-0000-0000-0000-000000000018', 'muscle-obliques', 'secondary', 40),
('00000000-0000-0000-0000-000000000019', 'muscle-abs', 'primary', 100),
('00000000-0000-0000-0000-000000000019', 'muscle-obliques', 'secondary', 70),
('00000000-0000-0000-0000-000000000019', 'muscle-lowerback', 'secondary', 50),
('00000000-0000-0000-0000-00000000001a', 'muscle-chest', 'primary', 100),
('00000000-0000-0000-0000-00000000001a', 'muscle-triceps', 'secondary', 80),
('00000000-0000-0000-0000-00000000001a', 'muscle-shoulders', 'secondary', 60),
('00000000-0000-0000-0000-00000000001b', 'muscle-triceps', 'primary', 100),
('00000000-0000-0000-0000-00000000001b', 'muscle-chest', 'secondary', 80),
('00000000-0000-0000-0000-00000000001b', 'muscle-shoulders', 'secondary', 50);

