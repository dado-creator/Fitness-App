import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';

interface SetLoggerProps {
  setNumber: number;
  onLog: (reps: number, weight: number, rpe: number) => void;
  onCancel: () => void;
  restSecondsBetweenSets?: number;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 16,
    color: '#000',
  },
  rpeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 24,
  },
  rpeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rpeButtonActive: {
    backgroundColor: '#3b82f6',
  },
  rpeButtonText: {
    fontWeight: 'bold',
    color: '#000',
  },
  rpeButtonTextActive: {
    color: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#d1d5db',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  note: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 12,
    textAlign: 'center',
  },
});

export const SetLogger: React.FC<SetLoggerProps> = ({
  setNumber,
  onLog,
  onCancel,
  restSecondsBetweenSets = 60,
}) => {
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [rpe, setRpe] = useState('6');

  const handleSubmit = () => {
    if (!reps.trim() || !weight.trim()) {
      Alert.alert('Errore', 'Inserisci ripetizioni e carico');
      return;
    }

    const parsedReps = parseInt(reps, 10);
    const parsedWeight = parseFloat(weight);
    const parsedRpe = parseInt(rpe, 10);

    if (isNaN(parsedReps) || isNaN(parsedWeight) || isNaN(parsedRpe)) {
      Alert.alert('Errore', 'Inserisci valori numerici validi');
      return;
    }

    if (parsedRpe < 1 || parsedRpe > 10) {
      Alert.alert('Errore', 'RPE deve essere tra 1 e 10');
      return;
    }

    onLog(parsedReps, parsedWeight, parsedRpe);
    setReps('');
    setWeight('');
    setRpe('6');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set #{setNumber}</Text>

      <Text style={styles.label}>Ripetizioni</Text>
      <TextInput
        style={styles.input}
        placeholder="es. 10"
        keyboardType="number-pad"
        value={reps}
        onChangeText={setReps}
      />

      <Text style={styles.label}>Carico (kg)</Text>
      <TextInput
        style={styles.input}
        placeholder="es. 100.5"
        keyboardType="decimal-pad"
        value={weight}
        onChangeText={setWeight}
      />

      <Text style={styles.label}>RPE (Sforzo percepito 1-10)</Text>
      <View style={styles.rpeContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <TouchableOpacity
            key={num}
            onPress={() => setRpe(num.toString())}
            style={[
              styles.rpeButton,
              rpe === num.toString() && styles.rpeButtonActive,
            ]}
          >
            <Text
              style={[
                styles.rpeButtonText,
                rpe === num.toString() && styles.rpeButtonTextActive,
              ]}
            >
              {num}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Registra Set</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Annulla</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.note}>
        Riposa ~{restSecondsBetweenSets}s prima del prossimo set
      </Text>
    </View>
  );
};
