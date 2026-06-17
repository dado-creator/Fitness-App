import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface FABProps {
  icon?: string;
  label: string;
  onPress: () => void;
  backgroundColor?: string;
  bottom?: number;
  right?: number;
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    borderRadius: 100,
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export const FAB: React.FC<FABProps> = ({
  icon = '+',
  label,
  onPress,
  backgroundColor = '#3b82f6',
  bottom = 20,
  right = 20,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.fab,
        {
          bottom: bottom,
          right: right,
          backgroundColor: backgroundColor,
        },
      ]}
      activeOpacity={0.7}
    >
      <Text style={styles.icon}>{icon}</Text>
    </TouchableOpacity>
  );
};
