import { supabase } from './config';
import {
  WorkoutSession,
  WorkoutLog,
  MuscleStrainLog,
} from '@types';

class WorkoutService {
  /**
   * Crea una nuova sessione di allenamento
   */
  async createWorkoutSession(
    userId: string,
    templateId: string | undefined,
    sessionDate: string,
    moodBefore: number
  ): Promise<WorkoutSession> {
    const { data, error } = await supabase
      .from('workout_sessions')
      .insert({
        user_id: userId,
        template_id: templateId,
        session_date: sessionDate,
        mood_before: moodBefore,
        duration_minutes: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Ottieni sessione per ID
   */
  async getWorkoutSession(sessionId: string): Promise<WorkoutSession | null> {
    const { data, error } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }

  /**
   * Aggiungi log di esercizio (serie/reps/kg)
   */
  async addWorkoutLog(
    sessionId: string,
    exerciseId: string,
    setNumber: number,
    reps: number,
    weightKg: number,
    rpe: number,
    notes?: string
  ): Promise<WorkoutLog> {
    const { data, error } = await supabase
      .from('workout_logs')
      .insert({
        session_id: sessionId,
        exercise_id: exerciseId,
        set_number: setNumber,
        reps,
        weight_kg: weightKg,
        rpe,
        notes: notes || '',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Ottieni tutti i log per una sessione
   */
  async getWorkoutLogs(sessionId: string): Promise<WorkoutLog[]> {
    const { data, error } = await supabase
      .from('workout_logs')
      .select('*')
      .eq('session_id', sessionId)
      .order('exercise_id, set_number');

    if (error) throw error;
    return data || [];
  }

  /**
   * Ottieni log per esercizio specifico in una sessione
   */
  async getExerciseLogs(
    sessionId: string,
    exerciseId: string
  ): Promise<WorkoutLog[]> {
    const { data, error } = await supabase
      .from('workout_logs')
      .select('*')
      .eq('session_id', sessionId)
      .eq('exercise_id', exerciseId)
      .order('set_number');

    if (error) throw error;
    return data || [];
  }

  /**
   * Aggiorna log di esercizio
   */
  async updateWorkoutLog(
    logId: string,
    updates: Partial<WorkoutLog>
  ): Promise<WorkoutLog> {
    const { data, error } = await supabase
      .from('workout_logs')
      .update(updates)
      .eq('id', logId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Elimina log di esercizio
   */
  async deleteWorkoutLog(logId: string): Promise<void> {
    const { error } = await supabase
      .from('workout_logs')
      .delete()
      .eq('id', logId);

    if (error) throw error;
  }

  /**
   * Completa una sessione di allenamento
   */
  async completeWorkoutSession(
    sessionId: string,
    durationMinutes: number,
    moodAfter: number
  ): Promise<WorkoutSession> {
    const { data, error } = await supabase
      .from('workout_sessions')
      .update({
        duration_minutes: durationMinutes,
        mood_after: moodAfter,
      })
      .eq('id', sessionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Ottieni sessioni per utente in un intervallo di date
   */
  async getUserWorkoutSessions(
    userId: string,
    fromDate: string,
    toDate: string
  ): Promise<WorkoutSession[]> {
    const { data, error } = await supabase
      .from('workout_sessions')
      .select('*')
      .eq('user_id', userId)
      .gte('session_date', fromDate)
      .lte('session_date', toDate)
      .order('session_date', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  /**
   * Calcola lo strain muscolare per una sessione
   */
  async calculateAndStoreMuscleStrain(
    sessionId: string,
    muscleStrainData: Omit<MuscleStrainLog, 'id' | 'created_at'>[]
  ): Promise<MuscleStrainLog[]> {
    const { data, error } = await supabase
      .from('muscle_strain_logs')
      .insert(
        muscleStrainData.map((item) => ({
          ...item,
          session_id: sessionId,
        }))
      )
      .select();

    if (error) throw error;
    return data || [];
  }

  /**
   * Ottieni strain muscolare per una sessione
   */
  async getMuscleStrainForSession(sessionId: string): Promise<MuscleStrainLog[]> {
    const { data, error } = await supabase
      .from('muscle_strain_logs')
      .select('*')
      .eq('session_id', sessionId);

    if (error) throw error;
    return data || [];
  }
}

export const workoutService = new WorkoutService();
