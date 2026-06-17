export type MuscleGroup = {
  id: string;
  name: string;
  zone_id: string;
  is_primary: boolean;
  svg_path: string;
};

export type Exercise = {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment_required: string[];
  alternative_names: string[];
};

export type ExerciseMuscleMapping = {
  id: string;
  exercise_id: string;
  muscle_group_id: string;
  activation_type: 'primary' | 'secondary' | 'stabilizer';
  activation_percentage: number;
};

export type WorkoutTemplate = {
  id: string;
  user_id: string;
  name: string;
  template_type: 'ipertrofia' | 'forza' | 'calisthenics' | 'custom';
  description: string;
  duration_weeks: number;
  is_public: boolean;
};

export type WorkoutTemplateExercise = {
  id: string;
  template_id: string;
  exercise_id: string;
  day_number: number;
  sets_planned: number;
  reps_planned: number;
  rest_seconds: number;
  notes: string;
  order_in_day: number;
};

export type WorkoutSession = {
  id: string;
  user_id: string;
  template_id?: string;
  session_date: string;
  duration_minutes: number;
  notes: string;
  mood_before: number;
  mood_after: number;
};

export type WorkoutLog = {
  id: string;
  session_id: string;
  exercise_id: string;
  set_number: number;
  reps: number;
  weight_kg: number;
  rpe: number;
  notes: string;
};

export type MuscleStrainLog = {
  id: string;
  session_id: string;
  muscle_group_id: string;
  total_volume: number;
  activation_type: 'primary' | 'secondary' | 'stabilizer';
  strain_percentage: number;
};

export type UserProgress = {
  id: string;
  user_id: string;
  exercise_id: string;
  max_weight_lifted: number;
  total_volume_all_time: number;
  estimated_1rm: number;
  last_updated: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  gender: 'male' | 'female';
  age: number;
  equipment: string[];
};

export type AIExerciseVariant = {
  id: string;
  original_exercise_id: string;
  variant_exercise_id: string;
  similarity_score: number;
  equipment_availability: string[];
};

export type AuthState = {
  isAuthenticated: boolean;
  isInitializing: boolean;
  user: User | null;
  error: string | null;
};

