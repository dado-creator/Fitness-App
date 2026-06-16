import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Exercise } from '@types';

interface ExerciseSearchProps {
  onSelectExercise: (exercise: Exercise) => void;
  onCancel: () => void;
  exercises: Exercise[];
  isLoading?: boolean;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000',
  },
  searchInput: {
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
    color: '#000',
  },
  list: {
    maxHeight: 300,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    paddingVertical: 16,
  },
  exerciseItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 8,
    borderColor: '#d1d5db',
    borderWidth: 1,
  },
  exerciseName: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  exerciseDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
  equipmentText: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 4,
  },
  cancelButton: {
    borderWidth: 2,
    borderColor: '#d1d5db',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
});

export const ExerciseSearch: React.FC<ExerciseSearchProps> = ({
  onSelectExercise,
  onCancel,
  exercises,
  isLoading = false,
}) => {
  const [query, setQuery] = useState('');

  const filteredExercises = query.trim()
    ? exercises.filter((ex) =>
        ex.name.toLowerCase().includes(query.toLowerCase()) ||
        ex.alternative_names?.some((alt) =>
          alt.toLowerCase().includes(query.toLowerCase())
        )
      )
    : exercises;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seleziona esercizio</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Cerca esercizio (es. Panca, Squat)..."
        value={query}
        onChangeText={setQuery}
      />

      <View style={styles.list}>
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        ) : filteredExercises.length === 0 ? (
          <Text style={styles.emptyText}>Nessun esercizio trovato</Text>
        ) : (
          <FlatList
            scrollEnabled={true}
            nestedScrollEnabled={true}
            data={filteredExercises}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.exerciseItem}
                onPress={() => onSelectExercise(item)}
              >
                <Text style={styles.exerciseName}>{item.name}</Text>
                {item.description && (
                  <Text style={styles.exerciseDescription}>
                    {item.description}
                  </Text>
                )}
                {item.equipment_required?.length > 0 && (
                  <Text style={styles.equipmentText}>
                    Attrezzi: {item.equipment_required.join(', ')}
                  </Text>
                )}
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.cancelButtonText}>Annulla</Text>
      </TouchableOpacity>
    </View>
  );
};
