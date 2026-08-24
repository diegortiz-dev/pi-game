import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path, G } from 'react-native-svg';
import { palette, type, spacing } from '../theme';
import { useT } from '../hooks/useSettings';
import { GROUP_SIZE } from '../constants/pi';

/**
 * O instrumento central do jogo.
 *
 * pi é a razão entre a circunferência e o diâmetro — um círculo desenrolado em
 * uma linha. O medidor mostra o lado circular; a fita de dígitos mostra o lado
 * reto. As duas coisas são a mesma quantidade em duas formas.
 *
 * O anel interno tem dez segmentos, um por dígito do bloco atual, porque é em
 * blocos de dez que se memoriza pi na prática. O anel externo é o tempo restante
 * e só existe no Desafio: a própria ausência dele diz que a partida é livre,
 * sem precisar de um rótulo escrito.
 */

/** Tamanho de referência. Os raios e o número escalam a partir dele. */
export const GAUGE_BASE_SIZE = 188;
const SEGMENT_GAP_DEG = 7;

type Props = {
  /** Posição atual em pi. */
  position: number;
  /** Fração de tempo restante, de 0 a 1. Ausente na Prática. */
  timeRatio?: number;
  /** Pinta o instrumento como erro. */
  faulted?: boolean;
  /** Lado do quadrado do medidor. Encolhe em telas baixas. */
  size?: number;
};

function pointOn(center: number, radius: number, degrees: number) {
  const radians = ((degrees - 90) * Math.PI) / 180;
  return {
    x: center + radius * Math.cos(radians),
    y: center + radius * Math.sin(radians),
  };
}

function arcPath(center: number, radius: number, startDeg: number, endDeg: number) {
  const start = pointOn(center, radius, startDeg);
  const end = pointOn(center, radius, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
}

export default function ScoreGauge({
  position,
  timeRatio,
  faulted,
  size = GAUGE_BASE_SIZE,
}: Props) {
  const t = useT();
  const scale = size / GAUGE_BASE_SIZE;
  const CENTER = size / 2;
  const OUTER_RADIUS = 88 * scale;
  const INNER_RADIUS = 74 * scale;
  // Ao fechar um bloco os dez segmentos aparecem cheios por um instante, em vez
  // de o anel esvaziar no exato momento da conquista.
  const withinGroup = position > 0 && position % GROUP_SIZE === 0
    ? GROUP_SIZE
    : position % GROUP_SIZE;

  const accent = faulted ? palette.accent.danger : palette.gold.bright;
  const circumference = 2 * Math.PI * OUTER_RADIUS;

  return (
    <View style={[styles.wrap, { width: size, height: size }]} accessible={false}>
      <Svg width={size} height={size}>
        {/* Anel do tempo, apenas no Desafio. */}
        {timeRatio !== undefined && (
          <G>
            <Circle
              cx={CENTER}
              cy={CENTER}
              r={OUTER_RADIUS}
              stroke={palette.ink[500]}
              strokeWidth={2 * scale}
              fill="none"
            />
            <Circle
              cx={CENTER}
              cy={CENTER}
              r={OUTER_RADIUS}
              stroke={
                timeRatio > 0.5
                  ? palette.accent.success
                  : timeRatio > 0.17
                    ? palette.accent.warning
                    : palette.accent.danger
              }
              strokeWidth={2 * scale}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - Math.max(0, Math.min(1, timeRatio)))}
              transform={`rotate(-90 ${CENTER} ${CENTER})`}
            />
          </G>
        )}

        {/* Dez segmentos: o bloco de memorização em andamento. */}
        {Array.from({ length: GROUP_SIZE }, (_, index) => {
          const span = 360 / GROUP_SIZE;
          const start = index * span + SEGMENT_GAP_DEG / 2;
          const end = (index + 1) * span - SEGMENT_GAP_DEG / 2;
          const filled = index < withinGroup;
          return (
            <Path
              key={index}
              d={arcPath(CENTER, INNER_RADIUS, start, end)}
              stroke={filled ? accent : palette.ink[600]}
              strokeWidth={(filled ? 5 : 3) * scale}
              strokeLinecap="round"
              fill="none"
            />
          );
        })}
      </Svg>

      <View style={styles.readout} pointerEvents="none">
        <Text
          style={[
            styles.value,
            { fontSize: type.score.fontSize * scale, lineHeight: type.score.lineHeight * scale },
            faulted && styles.valueFaulted,
          ]}
        >
          {position}
        </Text>
        <Text style={styles.label}>{t(position === 1 ? 'gauge.one' : 'gauge.other')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  readout: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    ...type.score,
    color: palette.text.primary,
  },
  valueFaulted: {
    color: palette.accent.danger,
  },
  label: {
    ...type.label,
    color: palette.text.tertiary,
    marginTop: spacing.xs,
  },
});
