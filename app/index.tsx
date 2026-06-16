import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppNavigator } from '@/navigation/AppNavigator';

export default function HomeScreen() {
  return (
    <View style={styles.root}>
      <AppNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0F172A' },
});
