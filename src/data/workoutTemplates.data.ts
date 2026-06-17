/**
 * workoutTemplates.data.ts
 *
 * Database locale di schede di allenamento preimpostate.
 * Ogni scheda ha: tipo, giorni, esercizi per giorno con set/reps/riposo pianificati.
 */

export type TemplateType = 'ipertrofia' | 'forza' | 'calisthenics' | 'dimagrimento';

export interface TemplateExercise {
  name: string;
  sets: number;
  reps: string;       // Es. "8-12" o "5" o "Max"
  restSec: number;
  notes?: string;
  muscleGroups: string[];
}

export interface TemplateDay {
  dayNumber: number;
  label: string;      // Es. "Push", "Pull", "Legs", "Corpo Libero"
  focus: string;      // Es. "Petto, Spalle, Tricipiti"
  exercises: TemplateExercise[];
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  type: TemplateType;
  durationWeeks: number;
  daysPerWeek: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  goal: string;
  tags: string[];
  emoji: string;
  accentColor: string;
  days: TemplateDay[];
}

// ─── SCHEDE ───────────────────────────────────────────────────────────────────

export const WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  // ── 1. PUSH PULL LEGS (Ipertrofia) ─────────────────────────────────────────
  {
    id: 'ppl-hypertrophy',
    name: 'Push Pull Legs',
    type: 'ipertrofia',
    durationWeeks: 12,
    daysPerWeek: 6,
    difficulty: 'intermediate',
    description: 'Il programma di ipertrofia più popolare al mondo. Divide gli allenamenti in spinta, tiraggio e gambe per massimizzare il volume settimanale.',
    goal: 'Aumento massa muscolare',
    tags: ['Ipertrofia', 'Volume', 'PPL', '6 giorni'],
    emoji: '💪',
    accentColor: '#3B82F6',
    days: [
      {
        dayNumber: 1,
        label: 'Push A',
        focus: 'Petto, Spalle, Tricipiti',
        exercises: [
          { name: 'Panca piana', sets: 4, reps: '8-12', restSec: 120, muscleGroups: ['Petto', 'Tricipiti'] },
          { name: 'Panca inclinata', sets: 3, reps: '10-15', restSec: 90, muscleGroups: ['Petto', 'Spalle'] },
          { name: 'Military press', sets: 3, reps: '8-12', restSec: 90, muscleGroups: ['Spalle', 'Tricipiti'] },
          { name: 'Alzate laterali', sets: 4, reps: '15-20', restSec: 60, muscleGroups: ['Spalle'] },
          { name: 'French press', sets: 3, reps: '10-15', restSec: 60, muscleGroups: ['Tricipiti'] },
          { name: 'Spinte tricipiti', sets: 3, reps: '12-15', restSec: 60, muscleGroups: ['Tricipiti'] },
        ],
      },
      {
        dayNumber: 2,
        label: 'Pull A',
        focus: 'Dorsali, Bicipiti, Romboidi',
        exercises: [
          { name: 'Trazioni', sets: 4, reps: '6-10', restSec: 120, muscleGroups: ['Dorsali', 'Bicipiti'] },
          { name: 'Rematore con bilanciere', sets: 4, reps: '8-12', restSec: 90, muscleGroups: ['Dorsali'] },
          { name: 'Lat machine', sets: 3, reps: '10-15', restSec: 90, muscleGroups: ['Dorsali'] },
          { name: 'Rematore con manubri', sets: 3, reps: '12-15', restSec: 60, muscleGroups: ['Dorsali', 'Romboidi'] },
          { name: 'Curl con bilanciere', sets: 3, reps: '10-15', restSec: 60, muscleGroups: ['Bicipiti'] },
          { name: 'Curl con manubri', sets: 3, reps: '12-15', restSec: 60, muscleGroups: ['Bicipiti'] },
        ],
      },
      {
        dayNumber: 3,
        label: 'Legs A',
        focus: 'Quadricipiti, Femorali, Glutei',
        exercises: [
          { name: 'Squat', sets: 4, reps: '8-12', restSec: 180, muscleGroups: ['Quadricipiti', 'Glutei'] },
          { name: 'Leg press', sets: 4, reps: '10-15', restSec: 120, muscleGroups: ['Quadricipiti'] },
          { name: 'Estensioni gambe', sets: 3, reps: '15-20', restSec: 60, muscleGroups: ['Quadricipiti'] },
          { name: 'Stacchi rumeni', sets: 4, reps: '10-12', restSec: 120, muscleGroups: ['Femorali', 'Glutei'] },
          { name: 'Leg curl', sets: 3, reps: '12-15', restSec: 60, muscleGroups: ['Femorali'] },
          { name: 'Calf raises', sets: 5, reps: '15-20', restSec: 60, muscleGroups: ['Polpacci'] },
        ],
      },
      {
        dayNumber: 4,
        label: 'Push B',
        focus: 'Petto, Spalle, Tricipiti',
        exercises: [
          { name: 'Panca inclinata', sets: 4, reps: '8-12', restSec: 120, muscleGroups: ['Petto', 'Spalle'] },
          { name: 'Croci ai cavi', sets: 3, reps: '12-15', restSec: 60, muscleGroups: ['Petto'] },
          { name: 'Spinte con manubri', sets: 3, reps: '10-15', restSec: 90, muscleGroups: ['Spalle', 'Tricipiti'] },
          { name: 'Alzate laterali', sets: 4, reps: '15-20', restSec: 60, muscleGroups: ['Spalle'] },
          { name: 'Dip', sets: 3, reps: '10-15', restSec: 90, muscleGroups: ['Tricipiti', 'Petto'] },
        ],
      },
      {
        dayNumber: 5,
        label: 'Pull B',
        focus: 'Dorsali, Bicipiti, Trapezio',
        exercises: [
          { name: 'Lat machine', sets: 4, reps: '8-12', restSec: 120, muscleGroups: ['Dorsali'] },
          { name: 'Rematore con bilanciere', sets: 4, reps: '8-12', restSec: 90, muscleGroups: ['Dorsali', 'Trapezio'] },
          { name: 'Trazioni', sets: 3, reps: 'Max', restSec: 120, muscleGroups: ['Dorsali', 'Bicipiti'] },
          { name: 'Curl con bilanciere', sets: 3, reps: '10-15', restSec: 60, muscleGroups: ['Bicipiti'] },
          { name: 'Curl con manubri', sets: 3, reps: '12-15', restSec: 60, muscleGroups: ['Bicipiti'] },
        ],
      },
      {
        dayNumber: 6,
        label: 'Legs B',
        focus: 'Quadricipiti, Femorali, Glutei, Polpacci',
        exercises: [
          { name: 'Stacchi da terra', sets: 4, reps: '5-8', restSec: 180, notes: 'Focus sulla forma', muscleGroups: ['Lombari', 'Glutei', 'Femorali'] },
          { name: 'Squat', sets: 3, reps: '10-15', restSec: 120, muscleGroups: ['Quadricipiti', 'Glutei'] },
          { name: 'Leg curl', sets: 4, reps: '12-15', restSec: 90, muscleGroups: ['Femorali'] },
          { name: 'Leg press', sets: 3, reps: '15-20', restSec: 90, muscleGroups: ['Quadricipiti'] },
          { name: 'Calf raises', sets: 5, reps: '20-25', restSec: 45, muscleGroups: ['Polpacci'] },
        ],
      },
    ],
  },

  // ── 2. FORZA 5x5 (Strength) ────────────────────────────────────────────────
  {
    id: 'stronglifts-5x5',
    name: 'Forza 5×5',
    type: 'forza',
    durationWeeks: 16,
    daysPerWeek: 3,
    difficulty: 'beginner',
    description: 'Programma di forza pura basato sui movimenti fondamentali. Incrementa il carico ogni sessione per progressioni lineari rapide.',
    goal: 'Aumento forza massimale',
    tags: ['Forza', 'Progressione lineare', '3 giorni', 'Bilanciere'],
    emoji: '🏋️',
    accentColor: '#EF4444',
    days: [
      {
        dayNumber: 1,
        label: 'Allenamento A',
        focus: 'Squat, Panca, Rematore',
        exercises: [
          { name: 'Squat', sets: 5, reps: '5', restSec: 180, notes: '+2.5 kg ogni sessione', muscleGroups: ['Quadricipiti', 'Glutei'] },
          { name: 'Panca piana', sets: 5, reps: '5', restSec: 180, notes: '+2.5 kg ogni sessione', muscleGroups: ['Petto', 'Tricipiti'] },
          { name: 'Rematore con bilanciere', sets: 5, reps: '5', restSec: 180, notes: '+2.5 kg ogni sessione', muscleGroups: ['Dorsali'] },
        ],
      },
      {
        dayNumber: 2,
        label: 'Allenamento B',
        focus: 'Squat, Military, Stacchi',
        exercises: [
          { name: 'Squat', sets: 5, reps: '5', restSec: 180, notes: '+2.5 kg ogni sessione', muscleGroups: ['Quadricipiti', 'Glutei'] },
          { name: 'Military press', sets: 5, reps: '5', restSec: 180, notes: '+2.5 kg ogni sessione', muscleGroups: ['Spalle', 'Tricipiti'] },
          { name: 'Stacchi da terra', sets: 1, reps: '5', restSec: 240, notes: '+5 kg ogni sessione — singola serie massimale', muscleGroups: ['Lombari', 'Glutei', 'Femorali'] },
        ],
      },
    ],
  },

  // ── 3. CALISTHENICS (Bodyweight) ───────────────────────────────────────────
  {
    id: 'calisthenics-fundamentals',
    name: 'Calisthenics Fundamentals',
    type: 'calisthenics',
    durationWeeks: 8,
    daysPerWeek: 4,
    difficulty: 'beginner',
    description: 'Programma bodyweight completo per costruire forza funzionale usando solo il peso corporeo. Progressioni da principiante ad avanzato.',
    goal: 'Forza funzionale e controllo corporeo',
    tags: ['Bodyweight', 'No attrezzi', 'Calisthenics', '4 giorni'],
    emoji: '🤸',
    accentColor: '#10B981',
    days: [
      {
        dayNumber: 1,
        label: 'Upper Push',
        focus: 'Petto, Spalle, Tricipiti',
        exercises: [
          { name: 'Flessioni', sets: 4, reps: '10-20', restSec: 90, notes: 'Progressione: piegate → standard → strette → archer', muscleGroups: ['Petto', 'Tricipiti'] },
          { name: 'Dip', sets: 3, reps: '8-15', restSec: 90, muscleGroups: ['Tricipiti', 'Petto'] },
          { name: 'Pike push-up', sets: 3, reps: '8-12', restSec: 60, notes: 'Simulazione handstand push-up', muscleGroups: ['Spalle'] },
          { name: 'Plank', sets: 3, reps: '45-60 sec', restSec: 60, muscleGroups: ['Core', 'Spalle'] },
        ],
      },
      {
        dayNumber: 2,
        label: 'Upper Pull',
        focus: 'Dorsali, Bicipiti, Core',
        exercises: [
          { name: 'Trazioni', sets: 4, reps: '5-12', restSec: 120, notes: 'Progressione: australiane → negative → complete → L-sit pull-up', muscleGroups: ['Dorsali', 'Bicipiti'] },
          { name: 'Addominali crunch', sets: 3, reps: '15-25', restSec: 45, muscleGroups: ['Addominali'] },
          { name: 'Plank', sets: 3, reps: '60 sec', restSec: 60, muscleGroups: ['Core'] },
        ],
      },
      {
        dayNumber: 3,
        label: 'Lower Body',
        focus: 'Gambe, Glutei, Polpacci',
        exercises: [
          { name: 'Squat', sets: 4, reps: '15-20', restSec: 90, notes: 'Bodyweight → jump squat → pistol squat', muscleGroups: ['Quadricipiti', 'Glutei'] },
          { name: 'Affondi', sets: 3, reps: '12 per gamba', restSec: 60, muscleGroups: ['Quadricipiti', 'Glutei', 'Femorali'] },
          { name: 'Calf raises', sets: 4, reps: '20-25', restSec: 45, muscleGroups: ['Polpacci'] },
          { name: 'Plank', sets: 3, reps: '60 sec', restSec: 60, muscleGroups: ['Core'] },
        ],
      },
      {
        dayNumber: 4,
        label: 'Full Body',
        focus: 'Corpo Completo, Core',
        exercises: [
          { name: 'Flessioni', sets: 3, reps: '15-20', restSec: 60, muscleGroups: ['Petto', 'Tricipiti'] },
          { name: 'Trazioni', sets: 3, reps: '5-10', restSec: 90, muscleGroups: ['Dorsali'] },
          { name: 'Squat', sets: 3, reps: '20', restSec: 60, muscleGroups: ['Quadricipiti'] },
          { name: 'Plank', sets: 3, reps: '60 sec', restSec: 45, muscleGroups: ['Core'] },
          { name: 'Addominali crunch', sets: 3, reps: '20', restSec: 45, muscleGroups: ['Addominali'] },
        ],
      },
    ],
  },

  // ── 4. FAT LOSS CIRCUIT ────────────────────────────────────────────────────
  {
    id: 'fat-loss-circuit',
    name: 'Fat Loss Circuit',
    type: 'dimagrimento',
    durationWeeks: 8,
    daysPerWeek: 4,
    difficulty: 'intermediate',
    description: 'Allenamento a circuito ad alta intensità per massimizzare il consumo calorico e mantenere la massa muscolare in deficit.',
    goal: 'Dimagrimento e definizione',
    tags: ['Dimagrimento', 'Circuito', 'HIIT', '4 giorni'],
    emoji: '🔥',
    accentColor: '#F59E0B',
    days: [
      {
        dayNumber: 1,
        label: 'Upper Circuit',
        focus: 'Busto completo, Cardio',
        exercises: [
          { name: 'Panca piana', sets: 4, reps: '12-15', restSec: 45, notes: 'Rest minimo tra esercizi', muscleGroups: ['Petto', 'Tricipiti'] },
          { name: 'Rematore con manubri', sets: 4, reps: '12-15', restSec: 45, muscleGroups: ['Dorsali', 'Bicipiti'] },
          { name: 'Military press', sets: 4, reps: '12-15', restSec: 45, muscleGroups: ['Spalle'] },
          { name: 'Curl con manubri', sets: 3, reps: '15', restSec: 30, muscleGroups: ['Bicipiti'] },
          { name: 'French press', sets: 3, reps: '15', restSec: 30, muscleGroups: ['Tricipiti'] },
        ],
      },
      {
        dayNumber: 2,
        label: 'Lower Circuit',
        focus: 'Gambe, Glutei, Cardio',
        exercises: [
          { name: 'Squat', sets: 4, reps: '15-20', restSec: 45, muscleGroups: ['Quadricipiti', 'Glutei'] },
          { name: 'Leg press', sets: 4, reps: '20', restSec: 45, muscleGroups: ['Quadricipiti'] },
          { name: 'Leg curl', sets: 4, reps: '15', restSec: 45, muscleGroups: ['Femorali'] },
          { name: 'Calf raises', sets: 4, reps: '25', restSec: 30, muscleGroups: ['Polpacci'] },
        ],
      },
      {
        dayNumber: 3,
        label: 'Full Body A',
        focus: 'Corpo Completo',
        exercises: [
          { name: 'Stacchi da terra', sets: 3, reps: '10', restSec: 90, muscleGroups: ['Lombari', 'Glutei'] },
          { name: 'Panca piana', sets: 3, reps: '12', restSec: 60, muscleGroups: ['Petto'] },
          { name: 'Lat machine', sets: 3, reps: '12', restSec: 60, muscleGroups: ['Dorsali'] },
          { name: 'Alzate laterali', sets: 3, reps: '15', restSec: 45, muscleGroups: ['Spalle'] },
        ],
      },
      {
        dayNumber: 4,
        label: 'Full Body B',
        focus: 'Corpo Completo',
        exercises: [
          { name: 'Squat', sets: 3, reps: '15', restSec: 60, muscleGroups: ['Quadricipiti', 'Glutei'] },
          { name: 'Rematore con bilanciere', sets: 3, reps: '12', restSec: 60, muscleGroups: ['Dorsali'] },
          { name: 'Military press', sets: 3, reps: '12', restSec: 60, muscleGroups: ['Spalle'] },
          { name: 'Curl con bilanciere', sets: 3, reps: '12', restSec: 45, muscleGroups: ['Bicipiti'] },
        ],
      },
    ],
  },
];
