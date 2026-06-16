import { MUSCLE_ZONES, ACTIVATION_TYPES } from '@/constants/index';
import { MuscleGroup } from '@types';

/**
 * Dati di seed per i muscoli
 */
export const MUSCLE_GROUPS_SEED: MuscleGroup[] = [
  {
    id: 'muscle-chest',
    name: 'Petto',
    zone_id: MUSCLE_ZONES.CHEST,
    is_primary: true,
    svg_path: 'chest',
  },
  {
    id: 'muscle-back',
    name: 'Dorso',
    zone_id: MUSCLE_ZONES.BACK,
    is_primary: true,
    svg_path: 'back',
  },
  {
    id: 'muscle-shoulders',
    name: 'Spalle',
    zone_id: MUSCLE_ZONES.SHOULDERS,
    is_primary: true,
    svg_path: 'shoulders',
  },
  {
    id: 'muscle-biceps',
    name: 'Bicipiti',
    zone_id: MUSCLE_ZONES.BICEPS,
    is_primary: false,
    svg_path: 'biceps',
  },
  {
    id: 'muscle-triceps',
    name: 'Tricipiti',
    zone_id: MUSCLE_ZONES.TRICEPS,
    is_primary: false,
    svg_path: 'triceps',
  },
  {
    id: 'muscle-forearms',
    name: 'Avambracci',
    zone_id: MUSCLE_ZONES.FOREARMS,
    is_primary: false,
    svg_path: 'forearms',
  },
  {
    id: 'muscle-abs',
    name: 'Addominali',
    zone_id: MUSCLE_ZONES.ABS,
    is_primary: true,
    svg_path: 'abs',
  },
  {
    id: 'muscle-obliques',
    name: 'Obliqui',
    zone_id: MUSCLE_ZONES.OBLIQUES,
    is_primary: false,
    svg_path: 'obliques',
  },
  {
    id: 'muscle-lowerback',
    name: 'Lombari',
    zone_id: MUSCLE_ZONES.LOWERBACK,
    is_primary: true,
    svg_path: 'lowerback',
  },
  {
    id: 'muscle-quads',
    name: 'Quadricipiti',
    zone_id: MUSCLE_ZONES.QUADS,
    is_primary: true,
    svg_path: 'quads',
  },
  {
    id: 'muscle-hamstrings',
    name: 'Femorali',
    zone_id: MUSCLE_ZONES.HAMSTRINGS,
    is_primary: true,
    svg_path: 'hamstrings',
  },
  {
    id: 'muscle-glutes',
    name: 'Glutei',
    zone_id: MUSCLE_ZONES.GLUTES,
    is_primary: true,
    svg_path: 'glutes',
  },
  {
    id: 'muscle-calves',
    name: 'Polpacci',
    zone_id: MUSCLE_ZONES.CALVES,
    is_primary: true,
    svg_path: 'calves',
  },
];

/**
 * Mappatura muscolare per esercizi comuni (ESTESA)
 */
export const COMMON_EXERCISES_MUSCLE_MAPPING = {
  'Panca piana': [
    { muscle_id: 'muscle-chest', type: ACTIVATION_TYPES.PRIMARY, percentage: 100 },
    { muscle_id: 'muscle-triceps', type: ACTIVATION_TYPES.SECONDARY, percentage: 70 },
    { muscle_id: 'muscle-shoulders', type: ACTIVATION_TYPES.SECONDARY, percentage: 50 },
  ],
  'Panca inclinata': [
    { muscle_id: 'muscle-chest', type: ACTIVATION_TYPES.PRIMARY, percentage: 100 },
    { muscle_id: 'muscle-shoulders', type: ACTIVATION_TYPES.SECONDARY, percentage: 80 },
    { muscle_id: 'muscle-triceps', type: ACTIVATION_TYPES.SECONDARY, percentage: 60 },
  ],
  'Squat': [
    { muscle_id: 'muscle-quads', type: ACTIVATION_TYPES.PRIMARY, percentage: 100 },
    { muscle_id: 'muscle-glutes', type: ACTIVATION_TYPES.PRIMARY, percentage: 90 },
    { muscle_id: 'muscle-hamstrings', type: ACTIVATION_TYPES.SECONDARY, percentage: 60 },
    { muscle_id: 'muscle-lowerback', type: ACTIVATION_TYPES.STABILIZER, percentage: 40 },
  ],
  'Leg press': [
    { muscle_id: 'muscle-quads', type: ACTIVATION_TYPES.PRIMARY, percentage: 100 },
    { muscle_id: 'muscle-glutes', type: ACTIVATION_TYPES.PRIMARY, percentage: 80 },
    { muscle_id: 'muscle-hamstrings', type: ACTIVATION_TYPES.SECONDARY, percentage: 50 },
  ],
  'Estensioni gambe': [
    { muscle_id: 'muscle-quads', type: ACTIVATION_TYPES.PRIMARY, percentage: 100 },
  ],
  'Trazioni': [
    { muscle_id: 'muscle-back', type: ACTIVATION_TYPES.PRIMARY, percentage: 100 },
    { muscle_id: 'muscle-biceps', type: ACTIVATION_TYPES.SECONDARY, percentage: 80 },
    { muscle_id: 'muscle-forearms', type: ACTIVATION_TYPES.SECONDARY, percentage: 60 },
  ],
  'Lat machine': [
    { muscle_id: 'muscle-back', type: ACTIVATION_TYPES.PRIMARY, percentage: 100 },
    { muscle_id: 'muscle-biceps', type: ACTIVATION_TYPES.SECONDARY, percentage: 70 },
  ],
  'Croci ai cavi': [
    { muscle_id: 'muscle-chest', type: ACTIVATION_TYPES.PRIMARY, percentage: 100 },
    { muscle_id: 'muscle-shoulders', type: ACTIVATION_TYPES.SECONDARY, percentage: 40 },
  ],
  'Croci ai manubri': [
    { muscle_id: 'muscle-chest', type: ACTIVATION_TYPES.PRIMARY, percentage: 100 },
    { muscle_id: 'muscle-shoulders', type: ACTIVATION_TYPES.SECONDARY, percentage: 50 },
  ],
  'Rematore con bilanciere': [
    { muscle_id: 'muscle-back', type: ACTIVATION_TYPES.PRIMARY, percentage: 100 },
    { muscle_id: 'muscle-biceps', type: ACTIVATION_TYPES.SECONDARY, percentage: 70 },
    { muscle_id: 'muscle-lowerback', type: ACTIVATION_TYPES.SECONDARY, percentage: 60 },
  ],
  'Rematore con manubri': [
    { muscle_id: 'muscle-back', type: ACTIVATION_TYPES.PRIMARY, percentage: 100 },
    { muscle_id: 'muscle-biceps', type: ACTIVATION_TYPES.SECONDARY, percentage: 70 },
  ],
  'Spinte con manubri': [
    { muscle_id: 'muscle-shoulders', type: ACTIVATION_TYPES.PRIMARY, percentage: 100 },
    { muscle_id: 'muscle-triceps', type: ACTIVATION_TYPES.SECONDARY, percentage: 70 },
    { muscle_id: 'muscle-chest', type: ACTIVATION_TYPES.SECONDARY, percentage: 50 },
  ],
  'Military press': [
    { muscle_id: 'muscle-shoulders', type: ACTIVATION_TYPES.PRIMARY, percentage: 100 },
    { muscle_id: 'muscle-triceps', type: ACTIVATION_TYPES.SECONDARY, percentage: 75 },
    { muscle_id: 'muscle-chest', type: ACTIVATION_TYPES.SECONDARY, percentage: 40 },
  ],
  'Alzate laterali': [
    { muscle_id: 'muscle-shoulders', type: ACTIVATION_TYPES.PRIMARY, percentage: 100 },
  ],
  'Curl con bilanciere': [
    { muscle_id: 'muscle-biceps', type: ACTIVATION_TYPES.PRIMARY, percentage: 100 },
    { muscle_id: 'muscle-forearms', type: ACTIVATION_TYPES.SECONDARY, percentage: 60 },
  ],
  'Curl con manubri': [
    { muscle_id: 'muscle-biceps', type: ACTIVATION_TYPES.PRIMARY, percentage: 100 },
    { muscle_id: 'muscle-forearms', type: ACTIVATION_TYPES.SECONDARY, percentage: 60 },
  ],
  'French press': [
    { muscle_id: 'muscle-triceps', type: ACTIVATION_TYPES.PRIMARY, percentage: 100 },
  ],
  'Spinte tricipiti': [
    { muscle_id: 'muscle-triceps', type: ACTIVATION_TYPES.PRIMARY, percentage: 100 },
  ],
  'Stacchi da terra': [
    { muscle_id: 'muscle-lowerback', type: ACTIVATION_TYPES.PRIMARY, percentage: 100 },
    { muscle_id: 'muscle-glutes', type: ACTIVATION_TYPES.PRIMARY, percentage: 90 },
    { muscle_id: 'muscle-hamstrings', type: ACTIVATION_TYPES.SECONDARY, percentage: 80 },
    { muscle_id: 'muscle-forearms', type: ACTIVATION_TYPES.SECONDARY, percentage: 60 },
  ],
  'Stacchi rumeni': [
    { muscle_id: 'muscle-hamstrings', type: ACTIVATION_TYPES.PRIMARY, percentage: 100 },
    { muscle_id: 'muscle-glutes', type: ACTIVATION_TYPES.PRIMARY, percentage: 90 },
    { muscle_id: 'muscle-lowerback', type: ACTIVATION_TYPES.SECONDARY, percentage: 70 },
  ],
  'Leg curl': [
    { muscle_id: 'muscle-hamstrings', type: ACTIVATION_TYPES.PRIMARY, percentage: 100 },
  ],
  'Spinte sulle gambe': [
    { muscle_id: 'muscle-glutes', type: ACTIVATION_TYPES.PRIMARY, percentage: 100 },
    { muscle_id: 'muscle-hamstrings', type: ACTIVATION_TYPES.SECONDARY, percentage: 70 },
  ],
  'Calf raises': [
    { muscle_id: 'muscle-calves', type: ACTIVATION_TYPES.PRIMARY, percentage: 100 },
  ],
  'Addominali crunch': [
    { muscle_id: 'muscle-abs', type: ACTIVATION_TYPES.PRIMARY, percentage: 100 },
    { muscle_id: 'muscle-obliques', type: ACTIVATION_TYPES.SECONDARY, percentage: 40 },
  ],
  'Plank': [
    { muscle_id: 'muscle-abs', type: ACTIVATION_TYPES.PRIMARY, percentage: 100 },
    { muscle_id: 'muscle-obliques', type: ACTIVATION_TYPES.SECONDARY, percentage: 70 },
    { muscle_id: 'muscle-lowerback', type: ACTIVATION_TYPES.SECONDARY, percentage: 50 },
  ],
  'Flessioni': [
    { muscle_id: 'muscle-chest', type: ACTIVATION_TYPES.PRIMARY, percentage: 100 },
    { muscle_id: 'muscle-triceps', type: ACTIVATION_TYPES.SECONDARY, percentage: 80 },
    { muscle_id: 'muscle-shoulders', type: ACTIVATION_TYPES.SECONDARY, percentage: 60 },
  ],
  'Dip': [
    { muscle_id: 'muscle-triceps', type: ACTIVATION_TYPES.PRIMARY, percentage: 100 },
    { muscle_id: 'muscle-chest', type: ACTIVATION_TYPES.SECONDARY, percentage: 80 },
    { muscle_id: 'muscle-shoulders', type: ACTIVATION_TYPES.SECONDARY, percentage: 50 },
  ],
};
