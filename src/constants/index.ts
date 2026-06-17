export const MUSCLE_ZONES = {
  CHEST: 'chest',
  BACK: 'back',
  SHOULDERS: 'shoulders',
  BICEPS: 'biceps',
  TRICEPS: 'triceps',
  FOREARMS: 'forearms',
  ABS: 'abs',
  OBLIQUES: 'obliques',
  LOWERBACK: 'lowerback',
  QUADS: 'quads',
  HAMSTRINGS: 'hamstrings',
  GLUTES: 'glutes',
  CALVES: 'calves',
} as const;

export const DIFFICULTIES = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
} as const;

export const WORKOUT_TYPES = {
  HYPERTROPHY: 'ipertrofia',
  STRENGTH: 'forza',
  CALISTHENICS: 'calisthenics',
  CUSTOM: 'custom',
} as const;

export const EQUIPMENT_TYPES = [
  'bilanciere',
  'manubri',
  'cavi',
  'macchine',
  'calisthenics',
  'kettlebell',
  'resistance-band',
  'medicine-ball',
] as const;

export const ACTIVATION_TYPES = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  STABILIZER: 'stabilizer',
} as const;

export const HEATMAP_COLORS = {
  COLD: '#FFD60A',    // Giallo
  WARM: '#F77F00',    // Arancio
  HOT: '#EF476F',     // Rosso fuoco
} as const;

export const REST_TIMES = {
  SHORT: 30,      // secondi
  MEDIUM: 60,
  LONG: 120,
  VERY_LONG: 180,
} as const;

export const RPE_SCALE = {
  1: 'Nessuno sforzo',
  2: 'Leggerissimo',
  3: 'Molto leggero',
  4: 'Leggero',
  5: 'Moderato',
  6: 'Un po\' difficile',
  7: 'Difficile',
  8: 'Molto difficile',
  9: 'Estremamente difficile',
  10: 'Massimo sforzo',
} as const;

export const MOOD_SCALE = {
  1: 'Terribile',
  2: 'Molto male',
  3: 'Male',
  4: 'Non bene',
  5: 'Neutrale',
  6: 'OK',
  7: 'Bene',
  8: 'Molto bene',
  9: 'Eccellente',
  10: 'Fantastico',
} as const;
