import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Alert,
  StyleSheet,
} from 'react-native';

interface MoodSelectorProps {
  title: string;
  onConfirm: (mood: number) => void;
  visible: boolean;
  onCancel: () => void;
}

const MOOD_LEVELS = [
  { value: 1, label: '😴 Molto stanco', color: '#dc2626' },
  { value: 2, label: '😕 Stanco', color: '#ef4444' },
  { value: 3, label: '😐 Neutro', color: '#eab308' },
  { value: 4, label: '🙂 Bene', color: '#22c55e' },
  { value: 5, label: '💪 Fantastico', color: '#16a34a' },
];

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#000',
  },
  moodsList: {
    marginBottom: 24,
    gap: 12,
  },
  moodButton: {
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  moodButtonText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#fff',
  },
  checkmark: {
    fontSize: 18,
    color: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#d1d5db',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
  },
});

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  title,
  onConfirm,
  visible,
  onCancel,
}) => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  const handleConfirm = () => {
    if (selectedMood === null) {
      Alert.alert('Errore', 'Seleziona uno stato di umore');
      return;
    }
    onConfirm(selectedMood);
    setSelectedMood(null);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{title}</Text>

          <View style={styles.moodsList}>
            {MOOD_LEVELS.map((mood) => (
              <TouchableOpacity
                key={mood.value}
                onPress={() => setSelectedMood(mood.value)}
                style={[
                  styles.moodButton,
                  {
                    backgroundColor:
                      selectedMood === mood.value
                        ? mood.color
                        : '#e5e7eb',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.moodButtonText,
                    {
                      color:
                        selectedMood === mood.value
                          ? '#fff'
                          : '#4b5563',
                    },
                  ]}
                >
                  {mood.label}
                </Text>
                {selectedMood === mood.value && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Conferma</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setSelectedMood(null);
                onCancel();
              }}
            >
              <Text style={styles.cancelButtonText}>Annulla</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
