import { supabase } from './config';
import { Exercise, ExerciseMuscleMapping } from '@types';

class ExerciseService {
  /**
   * Ricerca esercizi per nome
   */
  async searchExercises(query: string): Promise<Exercise[]> {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .or(
        `name.ilike.%${query}%,alternative_names.cs.["${query}"]`
      )
      .limit(20);

    if (error) throw error;
    return data || [];
  }

  /**
   * Ottieni tutti gli esercizi
   */
  async getAllExercises(): Promise<Exercise[]> {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  /**
   * Ottieni esercizio per ID
   */
  async getExerciseById(id: string): Promise<Exercise | null> {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }

  /**
   * Ottieni muscoli coinvolti in un esercizio
   */
  async getExerciseMuscles(exerciseId: string): Promise<ExerciseMuscleMapping[]> {
    const { data, error } = await supabase
      .from('exercise_muscle_mapping')
      .select('*')
      .eq('exercise_id', exerciseId);

    if (error) throw error;
    return data || [];
  }

  /**
   * Ottieni esercizi per gruppo muscolare
   */
  async getExercisesByMuscle(muscleGroupId: string): Promise<Exercise[]> {
    const { data, error } = await supabase
      .from('exercise_muscle_mapping')
      .select('exercise_id, exercises(*)')
      .eq('muscle_group_id', muscleGroupId)
      .eq('activation_type', 'primary');

    if (error) throw error;
    return data?.map((item: any) => item.exercises) || [];
  }

  /**
   * Ottieni esercizi filtrando per attrezzatura disponibile
   */
  async getExercisesByEquipment(equipment: string[]): Promise<Exercise[]> {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .containedBy('equipment_required', equipment);

    if (error) throw error;
    return data || [];
  }
}

export const exerciseService = new ExerciseService();
