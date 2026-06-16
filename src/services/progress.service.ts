import { supabase } from './config';
import { UserProgress } from '@types';

class ProgressService {
  /**
   * Ottieni progresso di un utente per un esercizio
   */
  async getUserExerciseProgress(
    userId: string,
    exerciseId: string
  ): Promise<UserProgress | null> {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('exercise_id', exerciseId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }

  /**
   * Ottieni tutti i progressi di un utente
   */
  async getUserAllProgress(userId: string): Promise<UserProgress[]> {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .order('last_updated', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Aggiorna o crea progresso utente
   */
  async upsertUserProgress(userId: string, exerciseId: string, updates: {
    max_weight_lifted?: number;
    total_volume_all_time?: number;
    estimated_1rm?: number;
  }): Promise<UserProgress> {
    const existing = await this.getUserExerciseProgress(userId, exerciseId);

    if (existing) {
      const { data, error } = await supabase
        .from('user_progress')
        .update({
          ...updates,
          last_updated: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('user_progress')
        .insert({
          user_id: userId,
          exercise_id: exerciseId,
          ...updates,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  /**
   * Calcola il massimale stimato (1RM) usando Brzycki formula
   * 1RM = w * (36 / (37 - r))
   * dove w = peso, r = reps
   */
  calculateEstimated1RM(weight: number, reps: number): number {
    if (reps === 1) return weight;
    return Math.round((weight * (36 / (37 - reps))) * 100) / 100;
  }

  /**
   * Calcola il volume totale (Serie x Reps x Peso)
   */
  calculateVolume(sets: number, reps: number, weight: number): number {
    return sets * reps * weight;
  }
}

export const progressService = new ProgressService();
