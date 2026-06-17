/**
 * ai.service.ts
 *
 * FASE 6 – Integrazione AI per Varianti Esercizi
 * ================================================
 *
 * Strategia ibrida:
 * 1. FAST PATH (locale): lookup da dizionario precompilato di varianti
 *    → risposta istantanea, funziona offline
 * 2. SMART PATH (OpenAI): se il fast path non ha abbastanza risultati
 *    o l'utente ha attrezzatura specifica, chiama GPT-4o-mini
 *
 * L'API key viene letta da variabile d'ambiente (EXPO_PUBLIC_OPENAI_KEY).
 */

import { Exercise } from '@types';
import { COMMON_EXERCISES_MUSCLE_MAPPING } from '@/data/seedData';

// ─── Tipi ─────────────────────────────────────────────────────────────────────

export interface ExerciseVariant {
  name: string;
  similarityScore: number;      // 0–100
  reason: string;               // Spiegazione della variante
  musclesFocus: string[];       // Muscoli target
  equipmentNeeded: string[];    // Attrezzatura richiesta
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isLocalSuggestion: boolean;   // true = database locale, false = AI
}

export interface AIVariantResponse {
  originalExercise: string;
  variants: ExerciseVariant[];
  generatedBy: 'local' | 'openai' | 'hybrid';
}

// ─── Database Locale Varianti ─────────────────────────────────────────────────

const LOCAL_VARIANTS: Record<string, ExerciseVariant[]> = {
  'Panca piana': [
    { name: 'Panca inclinata', similarityScore: 92, reason: 'Stesso pattern di spinta, maggiore enfasi sulla parte superiore del petto', musclesFocus: ['Petto', 'Spalle', 'Tricipiti'], equipmentNeeded: ['bilanciere'], difficulty: 'intermediate', isLocalSuggestion: true },
    { name: 'Croci ai cavi', similarityScore: 80, reason: 'Isolamento del petto in tutta la ROM senza coinvolgimento dei tricipiti', musclesFocus: ['Petto'], equipmentNeeded: ['cavi'], difficulty: 'beginner', isLocalSuggestion: true },
    { name: 'Flessioni', similarityScore: 75, reason: 'Pattern identico, no attrezzatura, ottimo per casa', musclesFocus: ['Petto', 'Tricipiti', 'Spalle'], equipmentNeeded: [], difficulty: 'beginner', isLocalSuggestion: true },
    { name: 'Dip', similarityScore: 85, reason: 'Eccellente per il petto basso, richiede solo parallele', musclesFocus: ['Petto', 'Tricipiti'], equipmentNeeded: ['calisthenics'], difficulty: 'intermediate', isLocalSuggestion: true },
    { name: 'Croci ai manubri', similarityScore: 82, reason: 'Maggiore ROM rispetto alla panca, ottimo per lo stretch muscolare', musclesFocus: ['Petto'], equipmentNeeded: ['manubri'], difficulty: 'beginner', isLocalSuggestion: true },
  ],
  'Squat': [
    { name: 'Leg press', similarityScore: 88, reason: 'Pattern simile di spinta delle gambe senza carico sulla colonna', musclesFocus: ['Quadricipiti', 'Glutei'], equipmentNeeded: ['macchine'], difficulty: 'beginner', isLocalSuggestion: true },
    { name: 'Squat con manubri (goblet)', similarityScore: 85, reason: 'Ideale per principianti, migliore postura, no bilanciere', musclesFocus: ['Quadricipiti', 'Glutei', 'Core'], equipmentNeeded: ['manubri'], difficulty: 'beginner', isLocalSuggestion: true },
    { name: 'Affondi', similarityScore: 78, reason: 'Maggiore attivazione unilaterale, migliora l\'equilibrio', musclesFocus: ['Quadricipiti', 'Glutei', 'Femorali'], equipmentNeeded: [], difficulty: 'beginner', isLocalSuggestion: true },
    { name: 'Bulgarian split squat', similarityScore: 82, reason: 'Ottima alternativa monolaterale con maggiore ROM e stretch dei flessori', musclesFocus: ['Quadricipiti', 'Glutei'], equipmentNeeded: ['manubri'], difficulty: 'advanced', isLocalSuggestion: true },
  ],
  'Stacchi da terra': [
    { name: 'Stacchi rumeni', similarityScore: 90, reason: 'Focus sui femorali e glutei, meno stress sulla schiena', musclesFocus: ['Femorali', 'Glutei', 'Lombari'], equipmentNeeded: ['bilanciere'], difficulty: 'intermediate', isLocalSuggestion: true },
    { name: 'Trap bar deadlift', similarityScore: 95, reason: 'Identico pattern, posizione più verticale riduce stress lombare', musclesFocus: ['Dorsali', 'Glutei', 'Femorali'], equipmentNeeded: ['bilanciere'], difficulty: 'intermediate', isLocalSuggestion: true },
    { name: 'Good morning', similarityScore: 75, reason: 'Allena gli stessi muscoli posteriori della catena', musclesFocus: ['Femorali', 'Lombari', 'Glutei'], equipmentNeeded: ['bilanciere'], difficulty: 'intermediate', isLocalSuggestion: true },
    { name: 'Leg curl', similarityScore: 65, reason: 'Isola i femorali senza componente di forza lombare', musclesFocus: ['Femorali'], equipmentNeeded: ['macchine'], difficulty: 'beginner', isLocalSuggestion: true },
  ],
  'Trazioni': [
    { name: 'Lat machine', similarityScore: 95, reason: 'Stesso pattern di tiraggio verticale, ideale se non si reggono le trazioni', musclesFocus: ['Dorsali', 'Bicipiti'], equipmentNeeded: ['macchine'], difficulty: 'beginner', isLocalSuggestion: true },
    { name: 'Rematore con manubri', similarityScore: 80, reason: 'Tiraggio orizzontale, complementa le trazioni allenando il dorso da angolo diverso', musclesFocus: ['Dorsali', 'Bicipiti', 'Romboidi'], equipmentNeeded: ['manubri'], difficulty: 'intermediate', isLocalSuggestion: true },
    { name: 'Cable pullover', similarityScore: 72, reason: 'Isola il gran dorsale senza il contributo del bicipite', musclesFocus: ['Dorsali'], equipmentNeeded: ['cavi'], difficulty: 'beginner', isLocalSuggestion: true },
  ],
  'Military press': [
    { name: 'Spinte con manubri', similarityScore: 92, reason: 'Maggiore ROM e stabilizzazione, ideale per correggere asimmetrie', musclesFocus: ['Spalle', 'Tricipiti'], equipmentNeeded: ['manubri'], difficulty: 'intermediate', isLocalSuggestion: true },
    { name: 'Arnold press', similarityScore: 88, reason: 'Attiva tutte e tre le teste del deltoide grazie alla rotazione', musclesFocus: ['Spalle', 'Tricipiti'], equipmentNeeded: ['manubri'], difficulty: 'intermediate', isLocalSuggestion: true },
    { name: 'Alzate laterali', similarityScore: 65, reason: 'Isolamento del deltoide laterale, ottimo come complemento', musclesFocus: ['Spalle'], equipmentNeeded: ['manubri'], difficulty: 'beginner', isLocalSuggestion: true },
    { name: 'Spinte ai cavi', similarityScore: 80, reason: 'Tensione costante sull\'intera ROM grazie al cavo', musclesFocus: ['Spalle', 'Tricipiti'], equipmentNeeded: ['cavi'], difficulty: 'beginner', isLocalSuggestion: true },
  ],
  'Croci ai cavi': [
    { name: 'Croci ai manubri', similarityScore: 93, reason: 'Identico movimento di adduzione, no macchina richiesta', musclesFocus: ['Petto'], equipmentNeeded: ['manubri'], difficulty: 'beginner', isLocalSuggestion: true },
    { name: 'Pec deck', similarityScore: 88, reason: 'Isolamento simile, movimento guidato, sicuro per principianti', musclesFocus: ['Petto'], equipmentNeeded: ['macchine'], difficulty: 'beginner', isLocalSuggestion: true },
    { name: 'Flessioni strette', similarityScore: 60, reason: 'Alternativa bodyweight con enfasi sui tricipiti', musclesFocus: ['Petto', 'Tricipiti'], equipmentNeeded: [], difficulty: 'beginner', isLocalSuggestion: true },
  ],
  'Curl con bilanciere': [
    { name: 'Curl con manubri', similarityScore: 95, reason: 'Permette supinazione completa, maggiore attivazione del bicipite', musclesFocus: ['Bicipiti'], equipmentNeeded: ['manubri'], difficulty: 'beginner', isLocalSuggestion: true },
    { name: 'Curl ai cavi', similarityScore: 85, reason: 'Tensione costante sull\'intera ROM', musclesFocus: ['Bicipiti'], equipmentNeeded: ['cavi'], difficulty: 'beginner', isLocalSuggestion: true },
    { name: 'Curl a martello', similarityScore: 78, reason: 'Coinvolge brachiale e brachioradiale oltre al bicipite', musclesFocus: ['Bicipiti', 'Avambracci'], equipmentNeeded: ['manubri'], difficulty: 'beginner', isLocalSuggestion: true },
    { name: 'Trazioni presa supina', similarityScore: 70, reason: 'Allena il bicipite in chiusura di catena cinetica chiusa', musclesFocus: ['Bicipiti', 'Dorsali'], equipmentNeeded: ['calisthenics'], difficulty: 'intermediate', isLocalSuggestion: true },
  ],
  'French press': [
    { name: 'Spinte tricipiti ai cavi', similarityScore: 92, reason: 'Isolamento identico, meno stress sul gomito grazie all\'angolo', musclesFocus: ['Tricipiti'], equipmentNeeded: ['cavi'], difficulty: 'beginner', isLocalSuggestion: true },
    { name: 'Dip', similarityScore: 82, reason: 'Movimento compound che stanca i tricipiti in modo funzionale', musclesFocus: ['Tricipiti', 'Petto'], equipmentNeeded: ['calisthenics'], difficulty: 'intermediate', isLocalSuggestion: true },
    { name: 'Close grip bench', similarityScore: 85, reason: 'Stesso target muscolare in pattern di spinta, carichi maggiori', musclesFocus: ['Tricipiti', 'Petto'], equipmentNeeded: ['bilanciere'], difficulty: 'intermediate', isLocalSuggestion: true },
  ],
};

// ─── Funzioni Helper ──────────────────────────────────────────────────────────

/**
 * Filtra le varianti per attrezzatura disponibile.
 * Se equipment è vuoto, restituisce tutte le varianti.
 */
function filterByEquipment(
  variants: ExerciseVariant[],
  availableEquipment: string[]
): ExerciseVariant[] {
  if (availableEquipment.length === 0) return variants;
  return variants.filter((v) =>
    v.equipmentNeeded.length === 0 ||
    v.equipmentNeeded.some((eq) => availableEquipment.includes(eq))
  );
}

// ─── OpenAI Integration ───────────────────────────────────────────────────────

/**
 * Chiama OpenAI GPT-4o-mini per generare varianti personalizzate.
 * Usato solo se LOCAL_VARIANTS non copre l'esercizio richiesto.
 */
async function fetchVariantsFromOpenAI(
  exerciseName: string,
  musclesFocus: string[],
  availableEquipment: string[],
  apiKey: string
): Promise<ExerciseVariant[]> {
  const equipmentStr =
    availableEquipment.length > 0
      ? availableEquipment.join(', ')
      : 'solo peso corporeo (calisthenics)';

  const prompt = `Sei un personal trainer esperto di fitness. 
Dammi 4 varianti dell'esercizio "${exerciseName}" che allenano gli stessi muscoli (${musclesFocus.join(', ')}).
L'utente ha a disposizione: ${equipmentStr}.

Per ogni variante rispondi SOLO con un JSON array nel seguente formato:
[
  {
    "name": "Nome esercizio",
    "similarityScore": 85,
    "reason": "Spiegazione breve in italiano (max 15 parole)",
    "musclesFocus": ["Muscolo1", "Muscolo2"],
    "equipmentNeeded": ["attrezzatura"],
    "difficulty": "beginner" | "intermediate" | "advanced"
  }
]
Rispondi SOLO con il JSON, nient'altro.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 600,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content ?? '[]';

  // Pulisce eventuali markdown code block
  const clean = content.replace(/```json|```/g, '').trim();
  const parsed: Omit<ExerciseVariant, 'isLocalSuggestion'>[] = JSON.parse(clean);

  return parsed.map((v) => ({ ...v, isLocalSuggestion: false }));
}

// ─── Servizio Principale ──────────────────────────────────────────────────────

class AIService {
  private readonly apiKey: string | undefined;

  constructor() {
    // Expo: variabili pubbliche esposte con EXPO_PUBLIC_
    this.apiKey = process.env['EXPO_PUBLIC_OPENAI_KEY'];
  }

  /**
   * Ottieni varianti per un esercizio.
   *
   * Strategia:
   * 1. Cerca nel database locale (istantaneo, offline)
   * 2. Filtra per attrezzatura disponibile
   * 3. Se < 2 risultati E API key disponibile → chiama OpenAI
   * 4. Combina risultati (hybrid) o restituisce solo locali
   */
  async getVariants(
    exercise: Exercise,
    availableEquipment: string[] = [],
    forceAI = false
  ): Promise<AIVariantResponse> {
    const exerciseName = exercise.name;

    // ── FAST PATH: database locale ──────────────
    const localVariants = LOCAL_VARIANTS[exerciseName] ?? [];
    const filteredLocal = filterByEquipment(localVariants, availableEquipment)
      .sort((a, b) => b.similarityScore - a.similarityScore);

    // Se abbiamo abbastanza risultati e non forziamo AI
    if (filteredLocal.length >= 3 && !forceAI) {
      return {
        originalExercise: exerciseName,
        variants: filteredLocal.slice(0, 5),
        generatedBy: 'local',
      };
    }

    // ── SMART PATH: OpenAI ──────────────────────
    if (this.apiKey) {
      try {
        // Determina muscoli target dall'esercizio
        const muscleMapping = COMMON_EXERCISES_MUSCLE_MAPPING[
          exerciseName as keyof typeof COMMON_EXERCISES_MUSCLE_MAPPING
        ] ?? [];
        const primaryMuscles = muscleMapping
          .filter((m) => m.type === 'primary')
          .map((m) => m.muscle_id.replace('muscle-', ''));

        const aiVariants = await fetchVariantsFromOpenAI(
          exerciseName,
          primaryMuscles,
          availableEquipment,
          this.apiKey
        );

        // Combina: locali prima, AI dopo (evita duplicati per nome)
        const combined = [...filteredLocal];
        for (const aiV of aiVariants) {
          if (!combined.some((v) => v.name.toLowerCase() === aiV.name.toLowerCase())) {
            combined.push(aiV);
          }
        }

        return {
          originalExercise: exerciseName,
          variants: combined.slice(0, 6),
          generatedBy: filteredLocal.length > 0 ? 'hybrid' : 'openai',
        };
      } catch (err) {
        console.warn('[AIService] OpenAI fallback to local:', err);
        // Fallback silenzioso al database locale
      }
    }

    // ── FALLBACK: restituisce ciò che abbiamo ──
    return {
      originalExercise: exerciseName,
      variants: filteredLocal,
      generatedBy: 'local',
    };
  }

  /**
   * Controlla se l'integrazione AI è configurata.
   */
  isAIAvailable(): boolean {
    return !!this.apiKey;
  }
}

export const aiService = new AIService();
