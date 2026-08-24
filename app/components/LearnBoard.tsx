import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { palette, spacing, radius, type, fonts } from '../theme';
import { useT } from '../hooks/useSettings';
import { GROUP_SIZE, PI_DIGITS, PI_PREFIX } from '../constants/pi';
import { blockStart, isRevealed, type LearnState } from '../data/learn';

/**
 * As dez casas do bloco em treino.
 *
 * Cada casa mostra um de quatro estados: já acertada, a da vez, ainda oculta, ou
 * visível como apoio. É a mesma contagem de dez do medidor da tela de jogo, e
 * pela mesma razão — dez é o tamanho do bloco que se memoriza.
 *
 * Acima delas fica o trecho de pi que antecede o bloco, apagado. Serve para
 * lembrar que o bloco não é uma lista solta de números: é a continuação de algo.
 */

/** Quantos dígitos de contexto mostrar antes do bloco. */
const CONTEXT = 12;

type Props = {
  state: LearnState;
  slotSize: number;
};

export default function LearnBoard({ state, slotSize }: Props) {
  const t = useT();
  const start = blockStart(state.block);
  const digits = PI_DIGITS.slice(start, start + GROUP_SIZE);
  const contextFrom = Math.max(0, start - CONTEXT);
  const context = PI_DIGITS.slice(contextFrom, start);

  return (
    <View style={styles.wrap}>
      <Text style={styles.context} numberOfLines={1}>
        {contextFrom === 0 ? (
          <Text style={styles.contextPrefix}>{PI_PREFIX}</Text>
        ) : (
          <Text style={styles.contextPrefix}>…</Text>
        )}
        {context}
      </Text>

      <View
        style={styles.slots}
        accessibilityRole="text"
        accessibilityLabel={t('learn.a11y.progress', {
          typed: state.typed,
          total: GROUP_SIZE,
        })}
      >
        {Array.from({ length: GROUP_SIZE }, (_, index) => {
          const done = index < state.typed;
          const current = index === state.typed;
          const revealed = isRevealed(state, index);
          const faulted = current && state.wrongKey !== null;

          return (
            <View
              key={index}
              style={[
                styles.slot,
                { width: slotSize, height: slotSize * 1.35 },
                done && styles.slotDone,
                current && styles.slotCurrent,
                faulted && styles.slotFaulted,
              ]}
            >
              <Text
                style={[
                  styles.glyph,
                  { fontSize: slotSize * 0.62 },
                  done && styles.glyphDone,
                  !done && revealed && styles.glyphGuide,
                  !revealed && styles.glyphHidden,
                ]}
              >
                {done || revealed ? digits[index] : '·'}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  context: {
    ...type.data,
    fontSize: 14,
    letterSpacing: 1,
    color: palette.text.tertiary,
  },
  contextPrefix: {
    color: palette.gold.dim,
  },
  slots: {
    flexDirection: 'row',
    gap: 3,
  },
  slot: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: palette.ink[500],
    backgroundColor: palette.ink[900],
  },
  slotDone: {
    borderColor: palette.gold.dim,
    backgroundColor: palette.ink[700],
  },
  slotCurrent: {
    borderColor: palette.gold.bright,
    backgroundColor: palette.overlay.goldWash,
  },
  slotFaulted: {
    borderColor: palette.accent.danger,
    backgroundColor: palette.overlay.dangerWash,
  },
  glyph: {
    fontFamily: fonts.monoBold,
  },
  glyphDone: {
    color: palette.text.primary,
  },
  /** Apoio da rodada: presente, mas claramente não é sua lembrança. */
  glyphGuide: {
    color: palette.gold.base,
  },
  glyphHidden: {
    color: palette.ink[600],
  },
});
