import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface WorkoutTimerProps {
  isActive: boolean;
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  time: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Courier New',
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
});

export const WorkoutTimer: React.FC<WorkoutTimerProps> = ({ isActive }) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const pad = (num: number) => String(num).padStart(2, '0');

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
    }
    return `${pad(minutes)}:${pad(secs)}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{formatTime(elapsedSeconds)}</Text>
      <Text style={styles.label}>Tempo allenamento</Text>
    </View>
  );
};
