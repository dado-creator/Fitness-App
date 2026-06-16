/**
 * MuscleHeatmapScreen.tsx
 *
 * FASE 4 – Schermata Riepilogo Muscolare con Heatmap
 * ===================================================
 * Mostra il modello anatomico con colori heatmap in base al volume
 * muscolare calcolato dall'ultima sessione di allenamento.
 *
 * Features:
 * - Toggle vista Anteriore / Posteriore
 * - Lista muscoli ordinata per strain decrescente
 * - Badge con volume totale e muscolo top
 * - Animazione fade-in all'apertura
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  SafeAreaView,
  Dimensions,
  FlatList,
} from 'react-native';
import { MuscleSVG } from '@/components/MuscleSVG';
import { calculateMuscleStrains, WorkoutMuscleAnalysis, strainToColor } from '@/utils/muscleCalculator';
import { useActiveWorkoutStore } from '@/context/activeWorkout.store';
import { WorkoutLog } from '@types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SVG_WIDTH = Math.min(SCREEN_WIDTH * 0.45, 200);

// ─── Componente Barra Strain ──────────────────────────────────────────────────

interface StrainBarProps {
  label: string;
  percent: number;
  color: string;
  delay: number;
}

const StrainBar: React.FC<StrainBarProps> = ({ label, percent, color, delay }) => {
  const barWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(barWidth, {
      toValue: percent,
      duration: 800,
      delay,
      useNativeDriver: false,
    }).start();
  }, [percent, delay]);

  const widthInterpolated = barWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  if (percent === 0) return null;

  return (
    <View style={strainStyles.row}>
      <Text style={strainStyles.label}>{label}</Text>
      <View style={strainStyles.barTrack}>
        <Animated.View
          style={[
            strainStyles.barFill,
            { width: widthInterpolated, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={[strainStyles.percent, { color }]}>{percent}%</Text>
    </View>
  );
};

const strainStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    width: 100,
    fontSize: 13,
    color: '#CBD5E1',
    fontWeight: '500',
  },
  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#1E293B',
    borderRadius: 4,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  percent: {
    width: 36,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'right',
  },
});

// ─── Schermata Principale ─────────────────────────────────────────────────────

interface MuscleHeatmapScreenProps {
  // Se passato, usa questi log; altrimenti prende dallo store
  logs?: WorkoutLog[];
  exerciseIdToName?: Record<string, string>;
  onBack?: () => void;
}

export const MuscleHeatmapScreen: React.FC<MuscleHeatmapScreenProps> = ({
  logs: propLogs,
  exerciseIdToName: propMap,
  onBack,
}) => {
  const { workoutLogs } = useActiveWorkoutStore();
  const [bodyView, setBodyView] = useState<'front' | 'back'>('front');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Usa i log passati come prop oppure quelli dello store
  const logs = propLogs ?? workoutLogs;
  const exerciseIdToName = propMap ?? {};

  const analysis: WorkoutMuscleAnalysis = useMemo(
    () => calculateMuscleStrains(logs, exerciseIdToName),
    [logs, exerciseIdToName]
  );

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const sortedStrains = [...analysis.strains].sort(
    (a, b) => b.strainPercent - a.strainPercent
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backBtnText}>‹ Indietro</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Mappa Muscolare</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>

          {/* ── Badge stats ─────────────────────────── */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{analysis.totalVolume.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Volume (kg)</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{logs.length}</Text>
              <Text style={styles.statLabel}>Set totali</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statValue, { color: '#F77F00', fontSize: 13 }]}>
                {analysis.topMuscles[0]?.muscleName ?? '–'}
              </Text>
              <Text style={styles.statLabel}>Muscolo top</Text>
            </View>
          </View>

          {/* ── Toggle vista ─────────────────────────── */}
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.toggleBtn, bodyView === 'front' && styles.toggleBtnActive]}
              onPress={() => setBodyView('front')}
            >
              <Text style={[styles.toggleText, bodyView === 'front' && styles.toggleTextActive]}>
                Anteriore
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, bodyView === 'back' && styles.toggleBtnActive]}
              onPress={() => setBodyView('back')}
            >
              <Text style={[styles.toggleText, bodyView === 'back' && styles.toggleTextActive]}>
                Posteriore
              </Text>
            </TouchableOpacity>
          </View>

          {/* ── Corpo SVG + Legenda ───────────────────── */}
          <View style={styles.bodyRow}>
            {/* SVG Anatomico */}
            <View style={styles.svgContainer}>
              <MuscleSVG
                view={bodyView}
                strains={analysis.strains}
                width={SVG_WIDTH}
                height={SVG_WIDTH * 2.18}
              />
            </View>

            {/* Legenda colori */}
            <View style={styles.legendContainer}>
              <Text style={styles.legendTitle}>Intensità</Text>
              {[
                { label: 'Massima', color: '#EF476F', pct: '80–100%' },
                { label: 'Alta', color: '#F77F00', pct: '50–80%' },
                { label: 'Media', color: '#FFD60A', pct: '25–50%' },
                { label: 'Bassa', color: '#C4C4C4', pct: '1–25%' },
                { label: 'Non lavorato', color: '#2A2A3C', pct: '0%' },
              ].map((item) => (
                <View key={item.label} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                  <View>
                    <Text style={styles.legendLabel}>{item.label}</Text>
                    <Text style={styles.legendPct}>{item.pct}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* ── Barre Strain ──────────────────────────── */}
          <View style={styles.barsSection}>
            <Text style={styles.sectionTitle}>Dettaglio per muscolo</Text>
            {sortedStrains.map((s, i) => (
              <StrainBar
                key={s.muscleId}
                label={s.muscleName}
                percent={s.strainPercent}
                color={s.heatColor}
                delay={i * 60}
              />
            ))}
          </View>

          {/* ── Muscoli primari ───────────────────────── */}
          {analysis.primaryMusclesWorked.length > 0 && (
            <View style={styles.tagsSection}>
              <Text style={styles.sectionTitle}>Muscoli primari allenati</Text>
              <View style={styles.tagsRow}>
                {analysis.primaryMusclesWorked.map((m) => (
                  <View key={m} style={styles.tag}>
                    <Text style={styles.tagText}>{m}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ── Messaggio vuoto ───────────────────────── */}
          {logs.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>💪</Text>
              <Text style={styles.emptyText}>
                Nessun allenamento registrato.{'\n'}Completa una sessione per vedere la heatmap.
              </Text>
            </View>
          )}

        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Stili ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  backBtn: {
    width: 80,
  },
  backBtnText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#F1F5F9',
    textAlign: 'center',
  },
  headerRight: {
    width: 80,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Stats cards
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F1F5F9',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },

  // Toggle
  toggleRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleBtnActive: {
    backgroundColor: '#3B82F6',
  },
  toggleText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 14,
  },
  toggleTextActive: {
    color: '#fff',
  },

  // Body row
  bodyRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 20,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  svgContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  // Legend
  legendContainer: {
    flex: 1,
    paddingLeft: 16,
    paddingTop: 8,
  },
  legendTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  legendPct: {
    fontSize: 10,
    color: '#475569',
  },

  // Bars section
  barsSection: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 14,
  },

  // Tags
  tagsSection: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#1E3A5F',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  tagText: {
    color: '#93C5FD',
    fontSize: 13,
    fontWeight: '600',
  },

  // Empty
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    color: '#475569',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});
