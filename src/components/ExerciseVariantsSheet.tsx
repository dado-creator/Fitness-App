/**
 * ExerciseVariantsSheet.tsx
 *
 * FASE 6 – Bottom Sheet per Varianti AI
 * ======================================
 * Modale a scorrimento verso l'alto che mostra le varianti
 * dell'esercizio selezionato, generate dall'AI o dal database locale.
 *
 * Features:
 * - Badge "AI" vs "Locale" per ogni variante
 * - Score di similarità con barra animata
 * - Filtro attrezzatura
 * - Loading skeleton mentre l'AI elabora
 * - Bottone "Usa questa variante" per sostituire l'esercizio corrente
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Dimensions,
  FlatList,
} from 'react-native';
import { aiService, ExerciseVariant, AIVariantResponse } from '@/services/ai.service';
import { Exercise } from '@types';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─── Componente Badge Source ──────────────────────────────────────────────────

const SourceBadge: React.FC<{ isLocal: boolean }> = ({ isLocal }) => (
  <View style={[badgeStyles.badge, isLocal ? badgeStyles.local : badgeStyles.ai]}>
    <Text style={badgeStyles.text}>{isLocal ? '📚 Locale' : '✨ AI'}</Text>
  </View>
);

const badgeStyles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  local: { backgroundColor: '#1E3A5F' },
  ai:    { backgroundColor: '#4C1D95' },
  text:  { fontSize: 10, fontWeight: '700', color: '#CBD5E1' },
});

// ─── Componente Similarity Bar ────────────────────────────────────────────────

const SimilarityBar: React.FC<{ score: number; delay: number }> = ({ score, delay }) => {
  const width = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(width, {
      toValue: score,
      duration: 600,
      delay,
      useNativeDriver: false,
    }).start();
  }, [score, delay]);

  const color =
    score >= 85 ? '#10B981' : score >= 70 ? '#F59E0B' : '#64748B';

  return (
    <View style={simStyles.container}>
      <View style={simStyles.track}>
        <Animated.View
          style={[
            simStyles.fill,
            {
              width: width.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
              backgroundColor: color,
            },
          ]}
        />
      </View>
      <Text style={[simStyles.label, { color }]}>{score}%</Text>
    </View>
  );
};

const simStyles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  track: { flex: 1, height: 4, backgroundColor: '#1E293B', borderRadius: 2, overflow: 'hidden' },
  fill:  { height: '100%', borderRadius: 2 },
  label: { width: 36, fontSize: 11, fontWeight: '700', textAlign: 'right' },
});

// ─── Componente Difficoltà ────────────────────────────────────────────────────

const DifficultyTag: React.FC<{ level: string }> = ({ level }) => {
  const cfg = {
    beginner:     { label: 'Facile',   color: '#10B981', bg: '#064E3B' },
    intermediate: { label: 'Medio',    color: '#F59E0B', bg: '#451A03' },
    advanced:     { label: 'Avanzato', color: '#EF4444', bg: '#450A0A' },
  }[level] ?? { label: level, color: '#64748B', bg: '#1E293B' };

  return (
    <View style={[diffStyles.tag, { backgroundColor: cfg.bg }]}>
      <Text style={[diffStyles.text, { color: cfg.color }]}>{cfg.label}</Text>
    </View>
  );
};

const diffStyles = StyleSheet.create({
  tag:  { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  text: { fontSize: 10, fontWeight: '700' },
});

// ─── Componente Card Variante ─────────────────────────────────────────────────

interface VariantCardProps {
  variant: ExerciseVariant;
  index: number;
  onSelect: (variant: ExerciseVariant) => void;
}

const VariantCard: React.FC<VariantCardProps> = ({ variant, index, onSelect }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, delay: index * 80, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 300, delay: index * 80, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        variantStyles.card,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {/* Header card */}
      <View style={variantStyles.cardHeader}>
        <Text style={variantStyles.variantName}>{variant.name}</Text>
        <View style={variantStyles.badges}>
          <DifficultyTag level={variant.difficulty} />
          <SourceBadge isLocal={variant.isLocalSuggestion} />
        </View>
      </View>

      {/* Similarity */}
      <Text style={variantStyles.simLabel}>Similarità muscolare</Text>
      <SimilarityBar score={variant.similarityScore} delay={index * 80 + 100} />

      {/* Reason */}
      <Text style={variantStyles.reason}>{variant.reason}</Text>

      {/* Muscles & Equipment */}
      <View style={variantStyles.tagsRow}>
        {variant.musclesFocus.map((m) => (
          <View key={m} style={variantStyles.muscleTag}>
            <Text style={variantStyles.muscleTagText}>{m}</Text>
          </View>
        ))}
      </View>

      {variant.equipmentNeeded.length > 0 && (
        <Text style={variantStyles.equipment}>
          🏋️ {variant.equipmentNeeded.join(', ')}
        </Text>
      )}
      {variant.equipmentNeeded.length === 0 && (
        <Text style={variantStyles.equipment}>✅ Nessuna attrezzatura richiesta</Text>
      )}

      {/* CTA */}
      <TouchableOpacity
        style={variantStyles.selectBtn}
        onPress={() => onSelect(variant)}
        activeOpacity={0.8}
      >
        <Text style={variantStyles.selectBtnText}>Usa questa variante →</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const variantStyles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
    gap: 8,
  },
  variantName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  badges: { flexDirection: 'row', gap: 6 },
  simLabel: { fontSize: 11, color: '#475569', marginTop: 8 },
  reason: { fontSize: 13, color: '#94A3B8', marginTop: 8, lineHeight: 18 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  muscleTag: {
    backgroundColor: '#0F3460',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  muscleTagText: { fontSize: 11, color: '#93C5FD', fontWeight: '600' },
  equipment: { fontSize: 12, color: '#64748B', marginTop: 8 },
  selectBtn: {
    marginTop: 12,
    backgroundColor: '#1D4ED8',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  selectBtnText: { color: '#DBEAFE', fontSize: 14, fontWeight: '700' },
});

// ─── Skeleton Loading ─────────────────────────────────────────────────────────

const SkeletonCard: React.FC<{ index: number }> = ({ index }) => {
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 800, delay: index * 100, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[skeletonStyles.card, { opacity: pulse }]}>
      <View style={[skeletonStyles.line, { width: '70%', height: 16 }]} />
      <View style={[skeletonStyles.line, { width: '100%', height: 6, marginTop: 14 }]} />
      <View style={[skeletonStyles.line, { width: '90%', height: 12, marginTop: 12 }]} />
      <View style={[skeletonStyles.line, { width: '60%', height: 12, marginTop: 8 }]} />
    </Animated.View>
  );
};

const skeletonStyles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  line: { backgroundColor: '#334155', borderRadius: 6 },
});

// ─── Sheet Principale ─────────────────────────────────────────────────────────

export interface ExerciseVariantsSheetProps {
  visible: boolean;
  exercise: Exercise | null;
  availableEquipment?: string[];
  onSelectVariant: (variantName: string) => void;
  onClose: () => void;
}

export const ExerciseVariantsSheet: React.FC<ExerciseVariantsSheetProps> = ({
  visible,
  exercise,
  availableEquipment = [],
  onSelectVariant,
  onClose,
}) => {
  const [response, setResponse] = useState<AIVariantResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 65,
        friction: 11,
        useNativeDriver: true,
      }).start();

      if (exercise) loadVariants();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, exercise]);

  const loadVariants = async () => {
    if (!exercise) return;
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await aiService.getVariants(exercise, availableEquipment);
      setResponse(result);
    } catch (err) {
      setError('Impossibile caricare le varianti. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVariant = (variant: ExerciseVariant) => {
    onSelectVariant(variant.name);
    onClose();
  };

  if (!visible && !exercise) return null;

  const sourceLabel =
    response?.generatedBy === 'openai' ? 'Generato da AI'
    : response?.generatedBy === 'hybrid' ? 'AI + Database locale'
    : 'Database locale';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <TouchableOpacity style={sheetStyles.overlay} onPress={onClose} activeOpacity={1} />

      {/* Sheet */}
      <Animated.View
        style={[
          sheetStyles.sheet,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Handle */}
        <View style={sheetStyles.handle} />

        {/* Header */}
        <View style={sheetStyles.header}>
          <View>
            <Text style={sheetStyles.title}>Varianti per</Text>
            <Text style={sheetStyles.exerciseName}>{exercise?.name}</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={sheetStyles.closeBtn}>
            <Text style={sheetStyles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Source Badge */}
        {response && !loading && (
          <View style={sheetStyles.sourceBadge}>
            <Text style={sheetStyles.sourceText}>
              {response.generatedBy === 'openai' || response.generatedBy === 'hybrid'
                ? '✨ ' : '📚 '}
              {sourceLabel} • {response.variants.length} varianti trovate
            </Text>
          </View>
        )}

        {/* Content */}
        <ScrollView
          style={sheetStyles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {loading && (
            <>
              {[0, 1, 2].map((i) => <SkeletonCard key={i} index={i} />)}
            </>
          )}

          {error && (
            <View style={sheetStyles.errorBox}>
              <Text style={sheetStyles.errorText}>{error}</Text>
              <TouchableOpacity style={sheetStyles.retryBtn} onPress={loadVariants}>
                <Text style={sheetStyles.retryText}>Riprova</Text>
              </TouchableOpacity>
            </View>
          )}

          {!loading && !error && response?.variants.length === 0 && (
            <View style={sheetStyles.emptyBox}>
              <Text style={sheetStyles.emptyText}>
                Nessuna variante trovata per questo esercizio.
              </Text>
            </View>
          )}

          {!loading && response?.variants.map((variant, i) => (
            <VariantCard
              key={variant.name}
              variant={variant}
              index={i}
              onSelect={handleSelectVariant}
            />
          ))}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

// ─── Stili Sheet ──────────────────────────────────────────────────────────────

const sheetStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.9,
    borderTopWidth: 1,
    borderColor: '#1E293B',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#334155',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  title: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  exerciseName: { fontSize: 20, fontWeight: '800', color: '#F1F5F9', marginTop: 2 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { color: '#94A3B8', fontSize: 14, fontWeight: '700' },
  sourceBadge: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 4,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  sourceText: { fontSize: 12, color: '#64748B', fontWeight: '600' },
  content: { paddingHorizontal: 16, paddingTop: 12 },
  errorBox: { alignItems: 'center', paddingVertical: 40 },
  errorText: { color: '#EF4444', fontSize: 14, textAlign: 'center', marginBottom: 16 },
  retryBtn: {
    backgroundColor: '#1D4ED8',
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  retryText: { color: '#DBEAFE', fontWeight: '700', fontSize: 14 },
  emptyBox: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { color: '#475569', fontSize: 14, textAlign: 'center' },
});
