import { create } from 'zustand';
import { Exercise, MuscleGroup } from '@types';

interface CacheStore {
  exercises: Map<string, Exercise>;
  muscleGroups: Map<string, MuscleGroup>;
  addExercises: (exercises: Exercise[]) => void;
  addMuscleGroups: (muscles: MuscleGroup[]) => void;
  getExercise: (id: string) => Exercise | undefined;
  getMuscleGroup: (id: string) => MuscleGroup | undefined;
  clear: () => void;
}

export const useCacheStore = create<CacheStore>((set, get) => ({
  exercises: new Map(),
  muscleGroups: new Map(),

  addExercises: (exercises: Exercise[]) =>
    set((state) => {
      const newMap = new Map(state.exercises);
      exercises.forEach((ex) => newMap.set(ex.id, ex));
      return { exercises: newMap };
    }),

  addMuscleGroups: (muscles: MuscleGroup[]) =>
    set((state) => {
      const newMap = new Map(state.muscleGroups);
      muscles.forEach((muscle) => newMap.set(muscle.id, muscle));
      return { muscleGroups: newMap };
    }),

  getExercise: (id: string) => get().exercises.get(id),

  getMuscleGroup: (id: string) => get().muscleGroups.get(id),

  clear: () =>
    set({
      exercises: new Map(),
      muscleGroups: new Map(),
    }),
}));
