/**
 * MuscleSVG.tsx
 *
 * Modello anatomico umano in SVG con heatmap muscolare.
 * Supporta vista ANTERIORE e POSTERIORE.
 * I muscoli si colorano dinamicamente tramite prop `strains`.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Ellipse,
  G,
  Rect,
  Defs,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import { MuscleStrain } from '@/utils/muscleCalculator';

// ─── Props ───────────────────────────────────────────────────────────────────

interface MuscleSVGProps {
  view: 'front' | 'back';
  strains: MuscleStrain[];
  width?: number;
  height?: number;
  showLabels?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const DEFAULT_COLOR = '#2A2A3C';
const BASE_SKIN = '#3D3D5C';

function getColorForMuscle(svgPath: string, strains: MuscleStrain[]): string {
  const strain = strains.find((s) => s.svgPath === svgPath);
  if (!strain || strain.strainPercent === 0) return DEFAULT_COLOR;
  return strain.heatColor;
}

function getOpacityForMuscle(svgPath: string, strains: MuscleStrain[]): number {
  const strain = strains.find((s) => s.svgPath === svgPath);
  if (!strain || strain.strainPercent === 0) return 0.4;
  return 0.6 + (strain.strainPercent / 100) * 0.4; // 0.6 → 1.0
}


// ─── Vista Anteriore SVG ─────────────────────────────────────────────────────

const FrontBodySVG = ({
  strains,
  width,
  height,
  showLabels,
}: Omit<MuscleSVGProps, 'view'>) => {
  const W = width ?? 220;
  const H = height ?? 480;
  const cx = W / 2;

  const getColor = (muscle: string) => getColorForMuscle(muscle, strains);
  const getOpacity = (muscle: string) => getOpacityForMuscle(muscle, strains);

  return (
    <Svg width={W} height={H} viewBox="0 0 220 480">
      <Defs>
        <RadialGradient id="bodyGrad" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#4A4A6A" />
          <Stop offset="100%" stopColor="#1A1A2E" />
        </RadialGradient>
      </Defs>

      {/* ─── Corpo Base ─────────────────────────── */}
      {/* Testa */}
      <Ellipse cx={cx} cy={38} rx={28} ry={32} fill="#3D3D5C" opacity={0.9} />
      {/* Collo */}
      <Rect x={cx - 10} y={64} width={20} height={18} fill="#3D3D5C" rx={4} opacity={0.8} />
      {/* Torso */}
      <Path
        d={`M ${cx - 48} 82 L ${cx - 52} 220 L ${cx + 52} 220 L ${cx + 48} 82 Z`}
        fill="#2A2A3C"
        opacity={0.9}
      />
      {/* Bacino */}
      <Ellipse cx={cx} cy={225} rx={48} ry={22} fill="#2A2A3C" opacity={0.85} />

      {/* ─── PETTO ─────────────────────────────── */}
      <G opacity={getOpacity('chest')}>
        {/* Petto sinistro */}
        <Path
          d={`M ${cx - 8} 88 L ${cx - 46} 105 L ${cx - 40} 145 L ${cx - 8} 138 Z`}
          fill={getColor('chest')}
        />
        {/* Petto destro */}
        <Path
          d={`M ${cx + 8} 88 L ${cx + 46} 105 L ${cx + 40} 145 L ${cx + 8} 138 Z`}
          fill={getColor('chest')}
        />
      </G>

      {/* ─── SPALLE ────────────────────────────── */}
      <G opacity={getOpacity('shoulders')}>
        <Ellipse cx={cx - 55} cy={98} rx={16} ry={22} fill={getColor('shoulders')} />
        <Ellipse cx={cx + 55} cy={98} rx={16} ry={22} fill={getColor('shoulders')} />
      </G>

      {/* ─── ADDOMINALI ────────────────────────── */}
      <G opacity={getOpacity('abs')}>
        {[0, 1, 2].map((row) =>
          [-1, 1].map((side) => (
            <Rect
              key={`abs-${row}-${side}`}
              x={cx + side * (side < 0 ? -26 : 4)}
              y={148 + row * 22}
              width={18}
              height={16}
              rx={4}
              fill={getColor('abs')}
            />
          ))
        )}
      </G>

      {/* ─── OBLIQUI ───────────────────────────── */}
      <G opacity={getOpacity('obliques')}>
        <Path
          d={`M ${cx - 32} 148 L ${cx - 50} 175 L ${cx - 48} 205 L ${cx - 30} 195 Z`}
          fill={getColor('obliques')}
        />
        <Path
          d={`M ${cx + 32} 148 L ${cx + 50} 175 L ${cx + 48} 205 L ${cx + 30} 195 Z`}
          fill={getColor('obliques')}
        />
      </G>

      {/* ─── BRACCIA SX ────────────────────────── */}
      {/* Bicipite sinistro */}
      <G opacity={getOpacity('biceps')}>
        <Path
          d={`M ${cx - 60} 115 L ${cx - 72} 118 L ${cx - 68} 175 L ${cx - 56} 172 Z`}
          fill={getColor('biceps')}
        />
        <Path
          d={`M ${cx + 60} 115 L ${cx + 72} 118 L ${cx + 68} 175 L ${cx + 56} 172 Z`}
          fill={getColor('biceps')}
        />
      </G>

      {/* Avambracci */}
      <G opacity={getOpacity('forearms')}>
        <Path
          d={`M ${cx - 56} 172 L ${cx - 68} 175 L ${cx - 64} 230 L ${cx - 54} 228 Z`}
          fill={getColor('forearms')}
        />
        <Path
          d={`M ${cx + 56} 172 L ${cx + 68} 175 L ${cx + 64} 230 L ${cx + 54} 228 Z`}
          fill={getColor('forearms')}
        />
      </G>

      {/* ─── GAMBE ANTERIORI ───────────────────── */}
      {/* Quadricipiti */}
      <G opacity={getOpacity('quads')}>
        <Path
          d={`M ${cx - 12} 242 L ${cx - 44} 248 L ${cx - 40} 360 L ${cx - 8} 355 Z`}
          fill={getColor('quads')}
        />
        <Path
          d={`M ${cx + 12} 242 L ${cx + 44} 248 L ${cx + 40} 360 L ${cx + 8} 355 Z`}
          fill={getColor('quads')}
        />
      </G>

      {/* Polpacci (vista frontale) */}
      <G opacity={getOpacity('calves')}>
        <Path
          d={`M ${cx - 8} 358 L ${cx - 38} 363 L ${cx - 34} 445 L ${cx - 6} 442 Z`}
          fill={getColor('calves')}
        />
        <Path
          d={`M ${cx + 8} 358 L ${cx + 38} 363 L ${cx + 34} 445 L ${cx + 6} 442 Z`}
          fill={getColor('calves')}
        />
      </G>

      {/* ─── Label opzionale ───────────────────── */}
      {showLabels && strains
        .filter((s) => s.strainPercent > 0)
        .map((s) => null) /* label overlay gestito a livello superiore */
      }
    </Svg>
  );
};

// ─── Vista Posteriore SVG ─────────────────────────────────────────────────────

const BackBodySVG = ({
  strains,
  width,
  height,
}: Omit<MuscleSVGProps, 'view'>) => {
  const W = width ?? 220;
  const cx = W / 2;

  const getColor = (muscle: string) => getColorForMuscle(muscle, strains);
  const getOpacity = (muscle: string) => getOpacityForMuscle(muscle, strains);

  return (
    <Svg width={W} height={480} viewBox="0 0 220 480">
      {/* ─── Corpo Base ─────────────────────────── */}
      <Ellipse cx={cx} cy={38} rx={28} ry={32} fill="#3D3D5C" opacity={0.9} />
      <Rect x={cx - 10} y={64} width={20} height={18} fill="#3D3D5C" rx={4} opacity={0.8} />
      <Path
        d={`M ${cx - 48} 82 L ${cx - 52} 220 L ${cx + 52} 220 L ${cx + 48} 82 Z`}
        fill="#2A2A3C"
        opacity={0.9}
      />
      <Ellipse cx={cx} cy={225} rx={48} ry={22} fill="#2A2A3C" opacity={0.85} />

      {/* ─── DORSALI (Trapezio + Latissimus) ─── */}
      <G opacity={getOpacity('back')}>
        {/* Trapezio */}
        <Path
          d={`M ${cx} 82 L ${cx - 48} 100 L ${cx - 38} 140 L ${cx} 130 L ${cx + 38} 140 L ${cx + 48} 100 Z`}
          fill={getColor('back')}
        />
        {/* Latissimus sinistro */}
        <Path
          d={`M ${cx - 8} 128 L ${cx - 48} 142 L ${cx - 44} 200 L ${cx - 8} 190 Z`}
          fill={getColor('back')}
        />
        {/* Latissimus destro */}
        <Path
          d={`M ${cx + 8} 128 L ${cx + 48} 142 L ${cx + 44} 200 L ${cx + 8} 190 Z`}
          fill={getColor('back')}
        />
      </G>

      {/* ─── SPALLE (posteriori) ────────────────── */}
      <G opacity={getOpacity('shoulders')}>
        <Ellipse cx={cx - 55} cy={98} rx={16} ry={22} fill={getColor('shoulders')} />
        <Ellipse cx={cx + 55} cy={98} rx={16} ry={22} fill={getColor('shoulders')} />
      </G>

      {/* ─── TRICIPITI ──────────────────────────── */}
      <G opacity={getOpacity('triceps')}>
        <Path
          d={`M ${cx - 60} 115 L ${cx - 74} 120 L ${cx - 70} 170 L ${cx - 57} 167 Z`}
          fill={getColor('triceps')}
        />
        <Path
          d={`M ${cx + 60} 115 L ${cx + 74} 120 L ${cx + 70} 170 L ${cx + 57} 167 Z`}
          fill={getColor('triceps')}
        />
      </G>

      {/* Avambracci */}
      <G opacity={getOpacity('forearms')}>
        <Path
          d={`M ${cx - 57} 167 L ${cx - 70} 170 L ${cx - 66} 228 L ${cx - 55} 226 Z`}
          fill={getColor('forearms')}
        />
        <Path
          d={`M ${cx + 57} 167 L ${cx + 70} 170 L ${cx + 66} 228 L ${cx + 55} 226 Z`}
          fill={getColor('forearms')}
        />
      </G>

      {/* ─── LOMBARI ─────────────────────────────── */}
      <G opacity={getOpacity('lowerback')}>
        <Rect
          x={cx - 22}
          y={190}
          width={44}
          height={30}
          rx={6}
          fill={getColor('lowerback')}
        />
      </G>

      {/* ─── GLUTEI ──────────────────────────────── */}
      <G opacity={getOpacity('glutes')}>
        <Ellipse cx={cx - 20} cy={236} rx={22} ry={20} fill={getColor('glutes')} />
        <Ellipse cx={cx + 20} cy={236} rx={22} ry={20} fill={getColor('glutes')} />
      </G>

      {/* ─── FEMORALI ────────────────────────────── */}
      <G opacity={getOpacity('hamstrings')}>
        <Path
          d={`M ${cx - 12} 252 L ${cx - 42} 258 L ${cx - 38} 358 L ${cx - 8} 353 Z`}
          fill={getColor('hamstrings')}
        />
        <Path
          d={`M ${cx + 12} 252 L ${cx + 42} 258 L ${cx + 38} 358 L ${cx + 8} 353 Z`}
          fill={getColor('hamstrings')}
        />
      </G>

      {/* ─── POLPACCI ────────────────────────────── */}
      <G opacity={getOpacity('calves')}>
        <Path
          d={`M ${cx - 8} 356 L ${cx - 36} 361 L ${cx - 32} 445 L ${cx - 6} 442 Z`}
          fill={getColor('calves')}
        />
        <Path
          d={`M ${cx + 8} 356 L ${cx + 36} 361 L ${cx + 32} 445 L ${cx + 6} 442 Z`}
          fill={getColor('calves')}
        />
      </G>
    </Svg>
  );
};

// ─── Componente Principale ────────────────────────────────────────────────────

export const MuscleSVG: React.FC<MuscleSVGProps> = ({
  view,
  strains,
  width = 220,
  height = 480,
  showLabels = false,
}) => {
  return (
    <View style={[styles.container, { width, height }]}>
      {view === 'front' ? (
        <FrontBodySVG
          strains={strains}
          width={width}
          height={height}
          showLabels={showLabels}
        />
      ) : (
        <BackBodySVG
          strains={strains}
          width={width}
          height={height}
          showLabels={showLabels}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
