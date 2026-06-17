/**
 * Utility per il calcolo dei volumi e dello strain muscolare
 */

import { WorkoutLog, MuscleStrainLog, ExerciseMuscleMapping } from '@types';

/**
 * Calcola il volume totale di un set
 * Volume = Serie x Reps x Kg
 */
export function calculateSetVolume(reps: number, weight: number): number {
  return reps * weight;
}

/**
 * Calcola il volume totale di un esercizio in una sessione
 */
export function calculateExerciseTotalVolume(logs: WorkoutLog[]): number {
  return logs.reduce((total, log) => {
    return total + calculateSetVolume(log.reps, log.weight_kg);
  }, 0);
}

/**
 * Calcola il volume per muscolo con ponderazione per tipo di attivazione
 */
export function calculateMuscleStrain(
  exerciseLogs: WorkoutLog[],
  muscleMappings: ExerciseMuscleMapping[],
  muscleId: string
): number {
  const muscleMapping = muscleMappings.find((m) => m.muscle_group_id === muscleId);
  if (!muscleMapping) return 0;

  const exerciseVolume = calculateExerciseTotalVolume(exerciseLogs);
  const activationPercentage = muscleMapping.activation_percentage || 100;

  // Ponderazione per tipo di attivazione
  let weight = 1;
  if (muscleMapping.activation_type === 'primary') weight = 1;
  else if (muscleMapping.activation_type === 'secondary') weight = 0.7;
  else if (muscleMapping.activation_type === 'stabilizer') weight = 0.4;

  return (exerciseVolume * activationPercentage * weight) / 100;
}

/**
 * Normalizza lo strain su una scala 0-100 per la heatmap
 */
export function normalizeStrainPercentage(
  strainValue: number,
  maxStrain: number
): number {
  if (maxStrain === 0) return 0;
  const percentage = (strainValue / maxStrain) * 100;
  return Math.min(percentage, 100);
}

/**
 * Seleziona il colore della heatmap in base al livello di strain
 * 0-33: Giallo (freddo)
 * 33-66: Arancio (tiepido)
 * 66-100: Rosso fuoco (caldo)
 */
export function getHeatmapColor(strainPercentage: number): string {
  if (strainPercentage < 33) return '#FFD60A'; // Giallo
  if (strainPercentage < 66) return '#F77F00'; // Arancio
  return '#EF476F'; // Rosso fuoco
}

/**
 * Calcola il massimale stimato (1RM) usando la formula di Brzycki
 * 1RM = w * (36 / (37 - r))
 */
export function calculateEstimated1RM(weight: number, reps: number): number {
  if (reps === 1) return weight;
  if (reps > 36) return weight; // limite sicuro
  return Math.round((weight * (36 / (37 - reps))) * 100) / 100;
}

/**
 * Determina la difficoltà percepita (RPE) basato su reps e carico
 */
export function estimateRPE(reps: number, estimatedMax: number, currentWeight: number): number {
  const percentage = (currentWeight / estimatedMax) * 100;

  if (percentage >= 95) return 9;
  if (percentage >= 90) return 8;
  if (percentage >= 80 && reps > 5) return 8;
  if (percentage >= 80) return 7;
  if (percentage >= 70 && reps > 8) return 7;
  if (percentage >= 70) return 6;
  return Math.max(3, Math.min(5, reps / 3));
}
