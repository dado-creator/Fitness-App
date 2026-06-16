/**
 * progress.store.ts
 *
 * Zustand store per la Sezione Analitica (Fase 5).
 * Mantiene in memoria la cronologia delle sessioni completate
 * e i progressi per esercizio.
 *
 * In produzione questi dati vengono persistiti su Supabase.
 * Per il testing locale usa dati di esempio precaricati.
 */

import { create } from 'zustand';
import { WorkoutLog, WorkoutSession, Exercise } from '@types';
import { estimateOneRepMax, calculateExerciseVolume } from '@/utils/muscleCalculator';

// ─── Tipi ─────────────────────────────────────────────────────────────────────

export interface SessionSummary {
  session: WorkoutSession;
  logs: WorkoutLog[];
  exercises: Exercise[];
  totalVolume: number;
  totalSets: number;
  durationMinutes: number;
}

export interface ExerciseProgressPoint {
  date: string;          // ISO date YYYY-MM-DD
  maxWeight: number;     // Peso massimo usato in quella sessione
  totalVolume: number;   // Volume totale (reps × kg) in quella sessione
  estimated1RM: number;  // 1RM stimato dalla serie migliore
  totalSets: number;
}

export interface ExerciseHistory {
  exerciseId: string;
  exerciseName: string;
  points: ExerciseProgressPoint[];
}

export interface WeeklyVolume {
  week: string;          // Es. "Sett. 1", "Sett. 2"
  volume: number;
  sessions: number;
}

// ─── Dati Demo ────────────────────────────────────────────────────────────────

const DEMO_EXERCISES: Exercise[] = [
  { id: 'ex-bench',  name: 'Panca piana',       description: '', difficulty: 'intermediate', equipment_required: ['bilanciere'], alternative_names: [] },
  { id: 'ex-squat',  name: 'Squat',             description: '', difficulty: 'intermediate', equipment_required: ['bilanciere'], alternative_names: [] },
  { id: 'ex-dead',   name: 'Stacchi da terra',  description: '', difficulty: 'advanced',     equipment_required: ['bilanciere'], alternative_names: [] },
  { id: 'ex-ohp',    name: 'Military press',    description: '', difficulty: 'intermediate', equipment_required: ['bilanciere'], alternative_names: [] },
  { id: 'ex-row',    name: 'Rematore con bilanciere', description: '', difficulty: 'intermediate', equipment_required: ['bilanciere'], alternative_names: [] },
];

// Genera 8 settimane di dati demo realistici con progressione lineare
function generateDemoHistory(): ExerciseHistory[] {
  const today = new Date();
  const histories: ExerciseHistory[] = [];

  const exerciseConfigs = [
    { id: 'ex-bench', name: 'Panca piana',      startWeight: 60, increment: 2.5 },
    { id: 'ex-squat', name: 'Squat',            startWeight: 80, increment: 5.0 },
    { id: 'ex-dead',  name: 'Stacchi da terra', startWeight: 100, increment: 5.0 },
    { id: 'ex-ohp',   name: 'Military press',   startWeight: 40, increment: 2.5 },
    { id: 'ex-row',   name: 'Rematore con bilanciere', startWeight: 60, increment: 2.5 },
  ];

  for (const cfg of exerciseConfigs) {
    const points: ExerciseProgressPoint[] = [];

    for (let week = 7; week >= 0; week--) {
      const date = new Date(today);
      date.setDate(date.getDate() - week * 7 - Math.floor(Math.random() * 3));

      const maxWeight = cfg.startWeight + (7 - week) * cfg.increment + (Math.random() * 2 - 1);
      const sets = 3 + Math.floor(Math.random() * 2);
      const reps = 6 + Math.floor(Math.random() * 5);
      const volume = Math.round(sets * reps * maxWeight);
      const e1rm = estimateOneRepMax(maxWeight, reps);

      points.push({
        date: date.toISOString().split('T')[0],
        maxWeight: Math.round(maxWeight * 2) / 2,
        totalVolume: volume,
        estimated1RM: e1rm,
        totalSets: sets,
      });
    }

    histories.push({
      exerciseId: cfg.id,
      exerciseName: cfg.name,
      points,
    });
  }

  return histories;
}

function generateDemoWeeklyVolume(): WeeklyVolume[] {
  const weeks = ['Sett. 1', 'Sett. 2', 'Sett. 3', 'Sett. 4', 'Sett. 5', 'Sett. 6', 'Sett. 7', 'Sett. 8'];
  const baseVolumes = [4200, 4800, 5100, 4600, 5400, 5800, 6100, 6500];
  return weeks.map((week, i) => ({
    week,
    volume: baseVolumes[i] + Math.floor(Math.random() * 400 - 200),
    sessions: 2 + Math.floor(Math.random() * 3),
  }));
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface ProgressStore {
  histories: ExerciseHistory[];
  weeklyVolumes: WeeklyVolume[];
  completedSessions: SessionSummary[];
  selectedExerciseId: string;

  // Actions
  setSelectedExercise: (id: string) => void;
  addCompletedSession: (summary: SessionSummary) => void;
  addProgressPoint: (exerciseId: string, exerciseName: string, point: ExerciseProgressPoint) => void;
  getHistoryFor: (exerciseId: string) => ExerciseHistory | undefined;
  resetToDemo: () => void;
}

export const useProgressStore = create<ProgressStore>((set, get) => ({
  histories: generateDemoHistory(),
  weeklyVolumes: generateDemoWeeklyVolume(),
  completedSessions: [],
  selectedExerciseId: 'ex-bench',

  setSelectedExercise: (id) => set({ selectedExerciseId: id }),

  addCompletedSession: (summary) =>
    set((state) => ({
      completedSessions: [summary, ...state.completedSessions].slice(0, 50),
    })),

  addProgressPoint: (exerciseId, exerciseName, point) =>
    set((state) => {
      const existing = state.histories.find((h) => h.exerciseId === exerciseId);
      if (existing) {
        return {
          histories: state.histories.map((h) =>
            h.exerciseId === exerciseId
              ? { ...h, points: [...h.points, point].slice(-52) }
              : h
          ),
        };
      }
      return {
        histories: [
          ...state.histories,
          { exerciseId, exerciseName, points: [point] },
        ],
      };
    }),

  getHistoryFor: (exerciseId) =>
    get().histories.find((h) => h.exerciseId === exerciseId),

  resetToDemo: () =>
    set({
      histories: generateDemoHistory(),
      weeklyVolumes: generateDemoWeeklyVolume(),
    }),
}));

export { DEMO_EXERCISES };
