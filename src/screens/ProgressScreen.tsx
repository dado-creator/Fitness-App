/**
 * ProgressScreen.tsx
 *
 * FASE 5 – Sezione Analitica con Grafici
 * =======================================
 *
 * Features:
 * - Selettore esercizio (scrollabile orizzontalmente)
 * - Grafico a linee: andamento peso massimo / 1RM stimato nel tempo
 * - Grafico a barre: volume settimanale totale
 * - Card statistiche: PR attuale, PR personale, trend, totale sessioni
 * - Tutto alimentato da useProgressStore con dati demo realistici
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import {
  useProgressStore,
  ExerciseProgressPoint,
  DEMO_EXERCISES,
} from '@/context/progress.store';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 32;

// ─── Palette & Chart Config ───────────────────────────────────────────────────

const CHART_CONFIG_LINE = {
  backgroundGradientFrom: '#1E293B',
  backgroundGradientTo: '#0F172A',
  backgroundGradientFromOpacity: 1,
  backgroundGradientToOpacity: 1,
  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,   // blue-500
  strokeWidth: 2.5,
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#3B82F6',
    fill: '#0F172A',
  },
  propsForBackgroundLines: {
    stroke: '#1E293B',
    strokeDasharray: '4 4',
  },
  decimalPlaces: 1,
  labelColor: () => '#64748B',
  style: { borderRadius: 16 },
};

const CHART_CONFIG_BAR = {
  backgroundGradientFrom: '#1E293B',
  backgroundGradientTo: '#0F172A',
  backgroundGradientFromOpacity: 1,
  backgroundGradientToOpacity: 1,
  color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,   // emerald-500
  strokeWidth: 0,
  barPercentage: 0.65,
  propsForBackgroundLines: {
    stroke: '#1E293B',
    strokeDasharray: '4 4',
  },
  decimalPlaces: 0,
  labelColor: () => '#64748B',
  style: { borderRadius: 16 },
};

// ─── Componente Stat Card ─────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
  emoji?: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, sub, accent = '#3B82F6', emoji }) => (
  <View style={[cardStyles.card, { borderColor: accent + '33' }]}>
    {emoji && <Text style={cardStyles.emoji}>{emoji}</Text>}
    <Text style={[cardStyles.value, { color: accent }]}>{value}</Text>
    <Text style={cardStyles.label}>{label}</Text>
    {sub && <Text style={cardStyles.sub}>{sub}</Text>}
  </View>
);

const cardStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    marginHorizontal: 4,
  },
  emoji: { fontSize: 20, marginBottom: 4 },
  value: { fontSize: 22, fontWeight: '800', marginBottom: 2 },
  label: { fontSize: 11, color: '#64748B', textAlign: 'center', fontWeight: '500' },
  sub: { fontSize: 10, color: '#475569', marginTop: 2 },
});

// ─── Componente Selettore Esercizio ───────────────────────────────────────────

interface ExerciseSelectorProps {
  exercises: typeof DEMO_EXERCISES;
  selectedId: string;
  onSelect: (id: string) => void;
}

const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  exercises,
  selectedId,
  onSelect,
}) => (
  <FlatList
    data={exercises}
    horizontal
    showsHorizontalScrollIndicator={false}
    keyExtractor={(item) => item.id}
    contentContainerStyle={selectorStyles.list}
    renderItem={({ item }) => {
      const isActive = item.id === selectedId;
      return (
        <TouchableOpacity
          style={[selectorStyles.chip, isActive && selectorStyles.chipActive]}
          onPress={() => onSelect(item.id)}
          activeOpacity={0.8}
        >
          <Text style={[selectorStyles.chipText, isActive && selectorStyles.chipTextActive]}>
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    }}
  />
);

const selectorStyles = StyleSheet.create({
  list: { paddingHorizontal: 16, paddingVertical: 4, gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  chipActive: {
    backgroundColor: '#1D4ED8',
    borderColor: '#3B82F6',
  },
  chipText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#DBEAFE',
  },
});

// ─── Componente Toggle Metrica ────────────────────────────────────────────────

type Metric = '1rm' | 'weight' | 'volume';

interface MetricToggleProps {
  selected: Metric;
  onChange: (m: Metric) => void;
}

const MetricToggle: React.FC<MetricToggleProps> = ({ selected, onChange }) => {
  const options: { id: Metric; label: string }[] = [
    { id: '1rm', label: '1RM Stimato' },
    { id: 'weight', label: 'Peso Max' },
    { id: 'volume', label: 'Volume' },
  ];
  return (
    <View style={metricStyles.row}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.id}
          style={[metricStyles.btn, selected === opt.id && metricStyles.btnActive]}
          onPress={() => onChange(opt.id)}
          activeOpacity={0.8}
        >
          <Text style={[metricStyles.text, selected === opt.id && metricStyles.textActive]}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const metricStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 3,
  },
  btn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnActive: { backgroundColor: '#1D4ED8' },
  text: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  textActive: { color: '#DBEAFE' },
});

// ─── Schermata Principale ─────────────────────────────────────────────────────

export const ProgressScreen: React.FC = () => {
  const { histories, weeklyVolumes, selectedExerciseId, setSelectedExercise } =
    useProgressStore();
  const [metric, setMetric] = useState<Metric>('1rm');

  const history = useMemo(
    () => histories.find((h) => h.exerciseId === selectedExerciseId),
    [histories, selectedExerciseId]
  );

  const points: ExerciseProgressPoint[] = history?.points ?? [];

  // Prepara dati grafico lineare
  const lineLabels = points.map((p) => {
    const d = new Date(p.date);
    return `${d.getDate()}/${d.getMonth() + 1}`;
  });

  const lineValues = points.map((p) => {
    if (metric === '1rm') return p.estimated1RM;
    if (metric === 'weight') return p.maxWeight;
    return p.totalVolume;
  });

  const lineData = {
    labels: lineLabels.length > 6 ? lineLabels.slice(-6) : lineLabels,
    datasets: [
      {
        data: lineValues.length > 6 ? lineValues.slice(-6) : lineValues.length > 0 ? lineValues : [0],
        strokeWidth: 2.5,
      },
    ],
  };

  // Dati grafico barre settimanali
  const barData = {
    labels: weeklyVolumes.slice(-6).map((w) => w.week.replace('Sett. ', 'S')),
    datasets: [
      {
        data: weeklyVolumes.slice(-6).map((w) => w.volume),
      },
    ],
  };

  // Stats calcolate
  const allWeights = points.map((p) => p.maxWeight);
  const allOneRMs  = points.map((p) => p.estimated1RM);
  const currentWeight = allWeights[allWeights.length - 1] ?? 0;
  const prWeight      = Math.max(...allWeights, 0);
  const currentOneRM  = allOneRMs[allOneRMs.length - 1] ?? 0;
  const totalSessions = weeklyVolumes.reduce((a, w) => a + w.sessions, 0);
  const totalVolumeAllTime = weeklyVolumes.reduce((a, w) => a + w.volume, 0);

  // Trend: differenza ultimi 2 punti
  const trend = points.length >= 2
    ? (() => {
        const last  = metric === '1rm' ? points[points.length - 1].estimated1RM : points[points.length - 1].maxWeight;
        const prev  = metric === '1rm' ? points[points.length - 2].estimated1RM : points[points.length - 2].maxWeight;
        const diff  = last - prev;
        return { diff: Math.abs(diff).toFixed(1), up: diff >= 0 };
      })()
    : null;

  const metricLabel = metric === '1rm' ? 'kg (1RM)' : metric === 'weight' ? 'kg' : 'kg·reps';

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── Header ──────────────────────────── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Progressi</Text>
        <Text style={styles.headerSub}>Ultime 8 settimane</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Selettore esercizio ─────────────── */}
        <Text style={styles.sectionLabel}>Esercizio</Text>
        <ExerciseSelector
          exercises={DEMO_EXERCISES}
          selectedId={selectedExerciseId}
          onSelect={setSelectedExercise}
        />

        {/* ── Stat Cards ──────────────────────── */}
        <View style={styles.cardsRow}>
          <StatCard
            emoji="🏆"
            label="PR Personale"
            value={`${prWeight} kg`}
            sub="massimale storico"
            accent="#F59E0B"
          />
          <StatCard
            emoji="📍"
            label="Attuale"
            value={`${currentWeight} kg`}
            sub="ultima sessione"
            accent="#3B82F6"
          />
        </View>
        <View style={[styles.cardsRow, { marginTop: 8 }]}>
          <StatCard
            emoji="💡"
            label="1RM Stimato"
            value={`${currentOneRM} kg`}
            sub="Epley formula"
            accent="#8B5CF6"
          />
          <StatCard
            emoji="📅"
            label="Sessioni totali"
            value={`${totalSessions}`}
            sub={`${(totalVolumeAllTime / 1000).toFixed(1)} t volume`}
            accent="#10B981"
          />
        </View>

        {/* ── Trend Badge ─────────────────────── */}
        {trend && (
          <View style={[styles.trendBadge, { backgroundColor: trend.up ? '#064E3B' : '#4C0519' }]}>
            <Text style={[styles.trendText, { color: trend.up ? '#10B981' : '#F43F5E' }]}>
              {trend.up ? '▲' : '▼'}  {trend.diff} {metricLabel} rispetto alla sessione precedente
            </Text>
          </View>
        )}

        {/* ── Toggle Metrica ──────────────────── */}
        <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Grafico progressione</Text>
        <MetricToggle selected={metric} onChange={setMetric} />

        {/* ── Grafico Linee ───────────────────── */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>
            {metric === '1rm' ? '1RM Stimato' : metric === 'weight' ? 'Peso Massimo' : 'Volume per Sessione'}
          </Text>
          {lineValues.length > 0 ? (
            <LineChart
              data={lineData}
              width={CHART_WIDTH - 32}
              height={200}
              chartConfig={CHART_CONFIG_LINE}
              bezier
              style={styles.chart}
              withShadow={false}
              fromZero={false}
              yAxisSuffix={metric === 'volume' ? '' : ' kg'}
            />
          ) : (
            <View style={styles.noData}>
              <Text style={styles.noDataText}>Nessun dato disponibile</Text>
            </View>
          )}
        </View>

        {/* ── Grafico Barre Volume ─────────────── */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Volume Settimanale Totale</Text>
          <BarChart
            data={barData}
            width={CHART_WIDTH - 32}
            height={200}
            chartConfig={CHART_CONFIG_BAR}
            style={styles.chart}
            showValuesOnTopOfBars={false}
            withInnerLines
            fromZero
            yAxisLabel=""
            yAxisSuffix=" kg"
          />
        </View>

        {/* ── Tabella storico ──────────────────── */}
        <View style={styles.historyCard}>
          <Text style={styles.chartTitle}>Storico sessioni</Text>
          <View style={styles.historyHeader}>
            <Text style={[styles.historyCell, styles.historyCellHeader]}>Data</Text>
            <Text style={[styles.historyCell, styles.historyCellHeader]}>Max kg</Text>
            <Text style={[styles.historyCell, styles.historyCellHeader]}>1RM</Text>
            <Text style={[styles.historyCell, styles.historyCellHeader]}>Volume</Text>
            <Text style={[styles.historyCell, styles.historyCellHeader]}>Serie</Text>
          </View>
          {[...points].reverse().slice(0, 8).map((p, i) => (
            <View
              key={p.date + i}
              style={[styles.historyRow, i % 2 === 0 && styles.historyRowAlt]}
            >
              <Text style={styles.historyCell}>{p.date.slice(5)}</Text>
              <Text style={[styles.historyCell, { color: '#3B82F6' }]}>{p.maxWeight}</Text>
              <Text style={[styles.historyCell, { color: '#8B5CF6' }]}>{p.estimated1RM}</Text>
              <Text style={[styles.historyCell, { color: '#10B981' }]}>{p.totalVolume}</Text>
              <Text style={styles.historyCell}>{p.totalSets}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 32 }} />
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F1F5F9',
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 13,
    color: '#475569',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },

  // Cards
  cardsRow: {
    flexDirection: 'row',
    marginHorizontal: 12,
    gap: 8,
    marginTop: 12,
  },

  // Trend
  trendBadge: {
    marginHorizontal: 16,
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  trendText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Charts
  chartCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  chart: {
    borderRadius: 12,
    marginLeft: -8,
  },
  noData: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    color: '#475569',
    fontSize: 14,
  },

  // History table
  historyCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  historyHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 8,
    marginBottom: 4,
  },
  historyRow: {
    flexDirection: 'row',
    paddingVertical: 7,
  },
  historyRowAlt: {
    backgroundColor: '#0F172A',
    borderRadius: 6,
  },
  historyCell: {
    flex: 1,
    fontSize: 12,
    color: '#CBD5E1',
    textAlign: 'center',
  },
  historyCellHeader: {
    color: '#64748B',
    fontWeight: '700',
    fontSize: 11,
  },
});
