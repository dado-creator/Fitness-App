import { create } from 'zustand';
import { WorkoutSession, WorkoutLog } from '@types';

interface ActiveWorkoutStore {
  activeSession: WorkoutSession | null;
  workoutLogs: WorkoutLog[];
  startWorkout: (session: WorkoutSession) => void;
  addLog: (log: WorkoutLog) => void;
  updateLog: (logId: string, updates: Partial<WorkoutLog>) => void;
  removeLog: (logId: string) => void;
  endWorkout: () => void;
  clearWorkout: () => void;
}

export const useActiveWorkoutStore = create<ActiveWorkoutStore>((set) => ({
  activeSession: null,
  workoutLogs: [],

  startWorkout: (session: WorkoutSession) =>
    set({ activeSession: session, workoutLogs: [] }),

  addLog: (log: WorkoutLog) =>
    set((state) => ({
      workoutLogs: [...state.workoutLogs, log],
    })),

  updateLog: (logId: string, updates: Partial<WorkoutLog>) =>
    set((state) => ({
      workoutLogs: state.workoutLogs.map((log) =>
        log.id === logId ? { ...log, ...updates } : log
      ),
    })),

  removeLog: (logId: string) =>
    set((state) => ({
      workoutLogs: state.workoutLogs.filter((log) => log.id !== logId),
    })),

  endWorkout: () =>
    set({
      activeSession: null,
      workoutLogs: [],
    }),

  clearWorkout: () =>
    set({
      activeSession: null,
      workoutLogs: [],
    }),
}));
