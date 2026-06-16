/**
 * AppNavigator.tsx
 *
 * Navigazione principale dell'app con Tab Bar.
 * Gestisce la transizione tra tutte le schermate principali.
 *
 * Tab:
 * 1. Logger    → WorkoutLoggerScreen
 * 2. Heatmap   → MuscleHeatmapScreen (con dati dell'ultima sessione)
 * 3. Progressi → ProgressScreen
 * 4. Schede    → (Fase 6)
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { WorkoutLoggerScreen } from '@/screens/WorkoutLoggerScreen';
import { MuscleHeatmapScreen } from '@/screens/MuscleHeatmapScreen';
import { ProgressScreen } from '@/screens/ProgressScreen';
import { useActiveWorkoutStore } from '@/context/activeWorkout.store';
import { COMMON_EXERCISES_MUSCLE_MAPPING } from '@/data/seedData';

// ─── Tipi ────────────────────────────────────────────────────────────────────

type TabName = 'logger' | 'heatmap' | 'progress' | 'schede';

interface TabItem {
  id: TabName;
  label: string;
  icon: string;
  activeIcon: string;
}

const TABS: TabItem[] = [
  { id: 'logger',   label: 'Logger',    icon: '🏋️',  activeIcon: '🏋️' },
  { id: 'heatmap',  label: 'Muscoli',   icon: '🫀',   activeIcon: '🫀' },
  { id: 'progress', label: 'Progressi', icon: '📈',   activeIcon: '📈' },
  { id: 'schede',   label: 'Schede',    icon: '📋',   activeIcon: '📋' },
];

// ─── Componente Tab Bar ───────────────────────────────────────────────────────

interface TabBarProps {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
  hasActiveWorkout: boolean;
}

const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabPress, hasActiveWorkout }) => (
  <View style={tabStyles.container}>
    {TABS.map((tab) => {
      const isActive = activeTab === tab.id;
      return (
        <TouchableOpacity
          key={tab.id}
          style={tabStyles.tab}
          onPress={() => onTabPress(tab.id)}
          activeOpacity={0.7}
          accessibilityLabel={tab.label}
          accessibilityRole="tab"
          accessibilityState={{ selected: isActive }}
        >
          {/* Badge se allenamento attivo sul logger */}
          {tab.id === 'logger' && hasActiveWorkout && (
            <View style={tabStyles.badge}>
              <Text style={tabStyles.badgeText}>●</Text>
            </View>
          )}

          <Text style={[tabStyles.icon, isActive && tabStyles.iconActive]}>
            {tab.icon}
          </Text>
          <Text style={[tabStyles.label, isActive && tabStyles.labelActive]}>
            {tab.label}
          </Text>

          {isActive && <View style={tabStyles.activeLine} />}
        </TouchableOpacity>
      );
    })}
  </View>
);

const tabStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingBottom: Platform.OS === 'ios' ? 20 : 6,
    paddingTop: 8,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  icon: {
    fontSize: 22,
    opacity: 0.4,
  },
  iconActive: {
    opacity: 1,
  },
  label: {
    fontSize: 10,
    color: '#475569',
    marginTop: 2,
    fontWeight: '500',
  },
  labelActive: {
    color: '#3B82F6',
    fontWeight: '700',
  },
  activeLine: {
    position: 'absolute',
    top: 0,
    width: 24,
    height: 2,
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: '20%',
    zIndex: 1,
  },
  badgeText: {
    fontSize: 8,
    color: '#10B981',
  },
});

// ─── Schermata Placeholder ────────────────────────────────────────────────────

const PlaceholderScreen: React.FC<{ title: string; emoji: string }> = ({ title, emoji }) => (
  <View style={placeholderStyles.container}>
    <Text style={placeholderStyles.emoji}>{emoji}</Text>
    <Text style={placeholderStyles.title}>{title}</Text>
    <Text style={placeholderStyles.subtitle}>In arrivo nella prossima fase</Text>
  </View>
);

const placeholderStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#F1F5F9', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#475569' },
});

// ─── Navigator Principale ─────────────────────────────────────────────────────

export const AppNavigator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabName>('logger');
  const { workoutLogs, activeSession } = useActiveWorkoutStore();

  // Costruisce la mappa id→nome per il calcolatore muscolare.
  // Usa i log correnti dello store, che hanno exercise_id = nome esercizio (seed locale).
  // In un'app con Supabase reale, qui si farebbe lookup dal database.
  const exerciseIdToName = useCallback((): Record<string, string> => {
    // Per ora: in esercizi locali, exercise_id è uguale al nome
    const map: Record<string, string> = {};
    const exerciseNames = Object.keys(COMMON_EXERCISES_MUSCLE_MAPPING);
    exerciseNames.forEach((name) => {
      map[name] = name;
    });
    return map;
  }, [])();

  const renderScreen = () => {
    switch (activeTab) {
      case 'logger':
        return <WorkoutLoggerScreen />;

      case 'heatmap':
        return (
          <MuscleHeatmapScreen
            logs={workoutLogs}
            exerciseIdToName={exerciseIdToName}
          />
        );

      case 'progress':
        return <ProgressScreen />;

      case 'schede':
        return (
          <PlaceholderScreen
            title="Schede di Allenamento"
            emoji="📋"
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={navStyles.root}>
      <View style={navStyles.screenContainer}>
        {renderScreen()}
      </View>
      <TabBar
        activeTab={activeTab}
        onTabPress={setActiveTab}
        hasActiveWorkout={!!activeSession}
      />
    </View>
  );
};

const navStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  screenContainer: {
    flex: 1,
  },
});
