/**
 * muscleCalculator.ts
 *
 * LOGICA MATEMATICA AFFATICAMENTO MUSCOLARE
 * ==========================================
 *
 * Formula principale:
 *   Volume_muscolo = Σ(Serie × Reps × Kg × fattore_attivazione)
 *
 * Fattori di attivazione per tipo:
 *   - primary:    1.0   (100% del volume contribuisce al muscolo)
 *   - secondary:  0.5   (50% del volume contribuisce al muscolo)
 *   - stabilizer: 0.25  (25% del volume contribuisce al muscolo)
 *
 * Il volume finale viene normalizzato 0→100 usando il max del workout
 * per ottenere una percentuale di strain relativa da mappare sulla heatmap.
 */

import { WorkoutLog } from '@types';
import { COMMON_EXERCISES_MUSCLE_MAPPING, MUSCLE_GROUPS_SEED } from '@/data/seedData';

// ─── Tipi ────────────────────────────────────────────────────────────────────

export interface MuscleStrain {
  muscleId: string;
  muscleName: string;
  svgPath: string;
  rawVolume: number;       // Volume assoluto (Serie × Reps × Kg × fattore)
  strainPercent: number;   // 0–100 normalizzato rispetto al max del workout
  heatColor: string;       // Colore hex calcolato
}

export interface WorkoutMuscleAnalysis {
  strains: MuscleStrain[];
  totalVolume: number;
  topMuscles: MuscleStrain[];
  primaryMusclesWorked: string[];
}

// ─── Costanti ────────────────────────────────────────────────────────────────

const ACTIVATION_FACTORS: Record<string, number> = {
  primary: 1.0,
  secondary: 0.5,
  stabilizer: 0.25,
};

/**
 * Interpolazione lineare tra due colori hex.
 * t ∈ [0, 1]
 */
function lerpColor(color1: string, color2: string, t: number): string {
  const c1 = hexToRgb(color1);
  const c2 = hexToRgb(color2);
  if (!c1 || !c2) return color1;

  const r = Math.round(c1.r + (c2.r - c1.r) * t);
  const g = Math.round(c1.g + (c2.g - c1.g) * t);
  const b = Math.round(c1.b + (c2.b - c1.b) * t);

  return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Mappa un valore 0–100 a un colore heatmap:
 * 0–25%:   Grigio neutro  (#C4C4C4) → Giallo   (#FFD60A)
 * 25–60%:  Giallo          (#FFD60A) → Arancio  (#F77F00)
 * 60–100%: Arancio         (#F77F00) → Rosso    (#EF476F)
 */
export function strainToColor(strainPercent: number): string {
  if (strainPercent <= 0) return '#C4C4C4';

  if (strainPercent <= 25) {
    return lerpColor('#C4C4C4', '#FFD60A', strainPercent / 25);
  } else if (strainPercent <= 60) {
    return lerpColor('#FFD60A', '#F77F00', (strainPercent - 25) / 35);
  } else {
    return lerpColor('#F77F00', '#EF476F', (strainPercent - 60) / 40);
  }
}

/**
 * Dato un set di WorkoutLog (con exercise_id ≡ nome esercizio risolto),
 * calcola il volume per ogni muscolo usando COMMON_EXERCISES_MUSCLE_MAPPING.
 *
 * Nota: exercise_id nei log deve corrispondere al NOME dell'esercizio
 * (chiave del dizionario) oppure bisogna passare una mappa id→nome.
 */
export function calculateMuscleStrains(
  logs: WorkoutLog[],
  exerciseIdToName: Record<string, string>
): WorkoutMuscleAnalysis {
  // Accumula volume per muscolo
  const volumeMap: Record<string, number> = {};

  for (const log of logs) {
    const exerciseName = exerciseIdToName[log.exercise_id];
    if (!exerciseName) continue;

    const muscleMapping = COMMON_EXERCISES_MUSCLE_MAPPING[
      exerciseName as keyof typeof COMMON_EXERCISES_MUSCLE_MAPPING
    ];
    if (!muscleMapping) continue;

    // Volume raw del set: serie implicita = 1 per log, moltiplica reps × kg
    const setVolume = log.reps * log.weight_kg;

    for (const mapping of muscleMapping) {
      const factor = ACTIVATION_FACTORS[mapping.type] ?? 0;
      // Moltiplicato per percentage (0–100) / 100 per granularità muscolare
      const contribution = setVolume * factor * (mapping.percentage / 100);
      volumeMap[mapping.muscle_id] = (volumeMap[mapping.muscle_id] ?? 0) + contribution;
    }
  }

  // Trova il volume massimo per normalizzare
  const maxVolume = Math.max(...Object.values(volumeMap), 1);
  const totalVolume = Object.values(volumeMap).reduce((a, b) => a + b, 0);

  // Costruisce MuscleStrain per ogni muscolo nel seed
  const strains: MuscleStrain[] = MUSCLE_GROUPS_SEED.map((muscle) => {
    const raw = volumeMap[muscle.id] ?? 0;
    const strainPercent = Math.round((raw / maxVolume) * 100);

    return {
      muscleId: muscle.id,
      muscleName: muscle.name,
      svgPath: muscle.svg_path,
      rawVolume: raw,
      strainPercent,
      heatColor: strainToColor(strainPercent),
    };
  });

  // Top 3 muscoli più allenati
  const topMuscles = [...strains]
    .filter((s) => s.strainPercent > 0)
    .sort((a, b) => b.strainPercent - a.strainPercent)
    .slice(0, 3);

  // Muscoli primari effettivamente lavorati (≥ 60%)
  const primaryMusclesWorked = strains
    .filter((s) => s.strainPercent >= 60)
    .map((s) => s.muscleName);

  return {
    strains,
    totalVolume: Math.round(totalVolume),
    topMuscles,
    primaryMusclesWorked,
  };
}

/**
 * Calcola il massimale stimato (Epley formula):
 *   1RM = peso × (1 + reps / 30)
 */
export function estimateOneRepMax(weight: number, reps: number): number {
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
}

/**
 * Calcola il volume totale di un esercizio da un array di log:
 *   Volume = Σ(reps × kg)
 */
export function calculateExerciseVolume(logs: WorkoutLog[]): number {
  return logs.reduce((total, log) => total + log.reps * log.weight_kg, 0);
}
