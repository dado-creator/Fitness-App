import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { useActiveWorkoutStore } from '@/context/activeWorkout.store';
import { useUserStore } from '@/context/user.store';
import { workoutService } from '@/services/workout.service';
import { exerciseService } from '@/services/exercise.service';
import { ExerciseCard } from '@/components/ExerciseCard';
import { SetLogger } from '@/components/SetLogger';
import { WorkoutTimer } from '@/components/WorkoutTimer';
import { ExerciseSearch } from '@/components/ExerciseSearch';
import { MoodSelector } from '@/components/MoodSelector';
import { FAB } from '@/components/FAB';
import { Exercise, WorkoutLog } from '@types';

type ModalState = 'none' | 'exercise-search' | 'set-logger' | 'mood-end';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  spacer: {
    height: 100,
  },
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#000',
  },
  appSubtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#6b7280',
  },
  startButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  exerciseCountLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScroll: {
    maxHeight: '80%',
    width: '100%',
    paddingHorizontal: 12,
  },
});

export const WorkoutLoggerScreen = ({ navigation }: any) => {
  const { user } = useUserStore();
  const {
    activeSession,
    workoutLogs,
    startWorkout,
    addLog,
    updateLog,
    removeLog,
    endWorkout,
  } = useActiveWorkoutStore();

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isLoadingExercises, setIsLoadingExercises] = useState(false);
  const [modalState, setModalState] = useState<ModalState>('none');
  const [currentSetForExercise, setCurrentSetForExercise] = useState(1);
  const [editingLog, setEditingLog] = useState<WorkoutLog | null>(null);
  const [expandedExercises, setExpandedExercises] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      setIsLoadingExercises(true);
      const data = await exerciseService.getAllExercises();
      setExercises(data);
    } catch (error) {
      console.error('Errore caricamento esercizi:', error);
      Alert.alert('Errore', 'Non è stato possibile caricare gli esercizi');
    } finally {
      setIsLoadingExercises(false);
    }
  };

  const handleStartWorkout = async () => {
    if (!user) {
      Alert.alert('Errore', 'Utente non autenticato');
      return;
    }

    try {
      const session = await workoutService.createWorkoutSession(
        user.id,
        undefined,
        new Date().toISOString().split('T')[0],
        5
      );

      startWorkout(session);
      setExpandedExercises({});
    } catch (error) {
      console.error('Errore creazione sessione:', error);
      Alert.alert('Errore', 'Non è stato possibile creare la sessione');
    }
  };

  const handleSelectExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setCurrentSetForExercise(
      (workoutLogs.filter((log) => log.exercise_id === exercise.id).length || 0) + 1
    );
    setModalState('set-logger');
  };

  const handleLogSet = async (reps: number, weight: number, rpe: number) => {
    if (!activeSession || !selectedExercise) return;

    try {
      const newLog: WorkoutLog = {
        id: uuidv4(),
        session_id: activeSession.id,
        exercise_id: selectedExercise.id,
        set_number: currentSetForExercise,
        reps,
        weight_kg: weight,
        rpe,
        notes: '',
      };

      if (editingLog) {
        updateLog(editingLog.id, newLog);
        setEditingLog(null);
      } else {
        addLog(newLog);
      }

      setExpandedExercises((prev) => ({
        ...prev,
        [selectedExercise.id]: true,
      }));

      setCurrentSetForExercise((prev) => prev + 1);
      setModalState('none');
    } catch (error) {
      console.error('Errore registrazione set:', error);
      Alert.alert('Errore', 'Non è stato possibile registrare il set');
    }
  };

  const handleEditSet = (log: WorkoutLog) => {
    setEditingLog(log);
    setSelectedExercise(
      exercises.find((ex) => ex.id === log.exercise_id) || null
    );
    setCurrentSetForExercise(log.set_number);
    setModalState('set-logger');
  };

  const handleDeleteSet = (logId: string) => {
    Alert.alert('Conferma', 'Eliminare questo set?', [
      { text: 'Annulla', style: 'cancel' },
      {
        text: 'Elimina',
        style: 'destructive',
        onPress: () => removeLog(logId),
      },
    ]);
  };

  const handleEndWorkout = () => {
    setModalState('mood-end');
  };

  const handleConfirmEnd = async (moodAfter: number) => {
    if (!activeSession) return;

    try {
      setIsSaving(true);
      const durationMinutes = Math.floor(Date.now() / 1000 / 60);
      
      await workoutService.completeWorkoutSession(
        activeSession.id,
        durationMinutes,
        moodAfter
      );

      endWorkout();
      setModalState('none');
      setSelectedExercise(null);
      setEditingLog(null);

      Alert.alert('✓ Successo', 'Allenamento salvato correttamente');
    } catch (error) {
      console.error('Errore salvataggio allenamento:', error);
      Alert.alert('Errore', 'Non è stato possibile salvare l\'allenamento');
    } finally {
      setIsSaving(false);
    }
  };

  const groupedLogs = workoutLogs.reduce(
    (acc, log) => {
      if (!acc[log.exercise_id]) {
        acc[log.exercise_id] = [];
      }
      acc[log.exercise_id].push(log);
      return acc;
    },
    {} as Record<string, WorkoutLog[]>
  );

  if (!activeSession) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.startContainer}>
          <Text style={styles.appTitle}>FitTrack</Text>
          <Text style={styles.appSubtitle}>Registra il tuo allenamento</Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={handleStartWorkout}
          >
            <Text style={styles.startButtonText}>Inizia Allenamento</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Allenamento in corso</Text>
      </View>

      <ScrollView style={styles.scrollContent}>
        <WorkoutTimer isActive={!!activeSession} />

        <Text style={styles.exerciseCountLabel}>
          Esercizi: {Object.keys(groupedLogs).length}
        </Text>

        {Object.entries(groupedLogs).map(([exerciseId, logs]) => {
          const exercise = exercises.find((ex) => ex.id === exerciseId);
          if (!exercise) return null;

          return (
            <ExerciseCard
              key={exerciseId}
              exercise={exercise}
              logs={logs}
              onAddSet={() => handleSelectExercise(exercise)}
              onDeleteSet={handleDeleteSet}
              onEditSet={handleEditSet}
              isExpanded={expandedExercises[exerciseId] ?? true}
              onToggleExpand={() =>
                setExpandedExercises((prev) => ({
                  ...prev,
                  [exerciseId]: !prev[exerciseId],
                }))
              }
            />
          );
        })}

        <View style={styles.spacer} />
      </ScrollView>

      <FAB
        icon="+"
        label="Aggiungi esercizio"
        onPress={() => setModalState('exercise-search')}
        backgroundColor="#3b82f6"
        bottom={100}
      />

      <FAB
        icon="✓"
        label="Termina"
        onPress={handleEndWorkout}
        backgroundColor="#10b981"
        bottom={20}
      />

      {/* Modal Ricerca Esercizi */}
      {modalState === 'exercise-search' && (
        <View style={styles.overlay}>
          <ScrollView style={styles.modalScroll}>
            <ExerciseSearch
              exercises={exercises}
              isLoading={isLoadingExercises}
              onSelectExercise={handleSelectExercise}
              onCancel={() => setModalState('none')}
            />
          </ScrollView>
        </View>
      )}

      {/* Modal Logger Set */}
      {modalState === 'set-logger' && selectedExercise && (
        <View style={styles.overlay}>
          <ScrollView style={styles.modalScroll}>
            <SetLogger
              setNumber={currentSetForExercise}
              onLog={handleLogSet}
              onCancel={() => {
                setModalState('none');
                setEditingLog(null);
              }}
              restSecondsBetweenSets={60}
            />
          </ScrollView>
        </View>
      )}

      {/* Modal Mood Selector */}
      <MoodSelector
        title="Come ti senti?"
        visible={modalState === 'mood-end'}
        onConfirm={handleConfirmEnd}
        onCancel={() => setModalState('none')}
      />

      {/* Loader */}
      {isSaving && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="white" />
        </View>
      )}
    </SafeAreaView>
  );
};
