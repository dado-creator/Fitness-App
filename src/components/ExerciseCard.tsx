import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Exercise, WorkoutLog } from '@types';

interface ExerciseCardProps {
  exercise: Exercise;
  logs: WorkoutLog[];
  onAddSet: () => void;
  onDeleteSet: (logId: string) => void;
  onEditSet: (log: WorkoutLog) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
  },
  setCount: {
    fontSize: 12,
    color: '#6b7280',
  },
  toggleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    padding: 12,
  },
  emptyText: {
    color: '#9ca3af',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  setItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  setItemEven: {
    backgroundColor: '#fff',
  },
  setItemOdd: {
    backgroundColor: '#f9fafb',
  },
  setInfo: {
    flex: 1,
  },
  setNumber: {
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  setDetails: {
    fontSize: 12,
    color: '#6b7280',
  },
  setNotes: {
    fontSize: 11,
    color: '#9ca3af',
    fontStyle: 'italic',
    marginTop: 4,
  },
  setActions: {
    flexDirection: 'row',
    gap: 6,
  },
  editButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addSetButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  addSetButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  logs,
  onAddSet,
  onDeleteSet,
  onEditSet,
  isExpanded = true,
  onToggleExpand,
}) => {
  const sortedLogs = [...logs].sort((a, b) => a.set_number - b.set_number);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={onToggleExpand}
      >
        <View style={styles.headerTitle}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.setCount}>
            {logs.length} set{logs.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <Text style={styles.toggleText}>{isExpanded ? '▼' : '▶'}</Text>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.content}>
          {logs.length === 0 ? (
            <Text style={styles.emptyText}>Nessun set registrato ancora</Text>
          ) : (
            <FlatList
              scrollEnabled={false}
              data={sortedLogs}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => (
                <View
                  style={[
                    styles.setItem,
                    index % 2 === 0 ? styles.setItemEven : styles.setItemOdd,
                  ]}
                >
                  <View style={styles.setInfo}>
                    <Text style={styles.setNumber}>Set {item.set_number}</Text>
                    <Text style={styles.setDetails}>
                      {item.reps} × {item.weight_kg} kg {item.rpe ? `• RPE ${item.rpe}` : ''}
                    </Text>
                    {item.notes && (
                      <Text style={styles.setNotes}>{item.notes}</Text>
                    )}
                  </View>
                  <View style={styles.setActions}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => onEditSet(item)}
                    >
                      <Text style={styles.buttonText}>✎</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => onDeleteSet(item.id)}
                    >
                      <Text style={styles.buttonText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          )}

          <TouchableOpacity style={styles.addSetButton} onPress={onAddSet}>
            <Text style={styles.addSetButtonText}>+ Aggiungi Set</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
