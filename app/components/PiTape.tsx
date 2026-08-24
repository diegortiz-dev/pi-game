import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated } from 'react-native';
import { palette, spacing, radius, type } from '../theme';
import { useT } from '../hooks/useSettings';
import { GROUP_SIZE, PI_PREFIX, groupDigits } from '../constants/pi';

/**
 * Os dígitos já digitados, como uma fita contínua.
 *
 * Os dígitos vêm em blocos de dez com um respiro entre eles. A versão anterior
 * despejava dezesseis por linha sem separação, o que tornava impossível saber de
 * relance em que posição se está — e posição é exatamente o que se está tentando
 * memorizar. Cada bloco é um Text próprio, então nenhum bloco se parte entre
 * duas linhas.
 *
 * A fonte é monoespaçada por necessidade, não por estilo: com largura fixa a
 * fita não se reorganiza a cada dígito novo.
 */

type Props = {
  revealed: string;
  /** Sacode a fita horizontalmente. Usado ao errar. */
  shakeX?: Animated.Value;
  faulted?: boolean;
};

export default function PiTape({ revealed, shakeX, faulted }: Props) {
  const t = useT();
  const scrollRef = useRef<ScrollView>(null);
  const groups = groupDigits(revealed);
  const openGroupIndex = revealed.length % GROUP_SIZE === 0 ? -1 : groups.length - 1;

  useEffect(() => {
    // Acompanha a digitação sem animar: animar a cada dígito briga com o toque
    // seguinte quando se digita rápido.
    const id = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: false }), 0);
    return () => clearTimeout(id);
  }, [revealed.length]);

  return (
    <Animated.View
      style={[
        styles.frame,
        faulted && styles.frameFaulted,
        shakeX ? { transform: [{ translateX: shakeX }] } : null,
      ]}
      accessibilityRole="text"
      accessibilityLabel={
        revealed.length === 0
          ? t('tape.a11y.empty')
          : t('tape.a11y.count', { n: revealed.length })
      }
    >
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.row}>
          <Text style={styles.prefix}>{PI_PREFIX}</Text>
          {groups.map((group, index) => (
            <Text
              key={index}
              style={[styles.group, index === openGroupIndex && styles.groupOpen]}
            >
              {group}
            </Text>
          ))}
          <Text style={styles.cursor}>▏</Text>
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    /** Impede que a fita desapareça de vez quando o teclado leva sua fatia. */
    minHeight: 92,
    backgroundColor: palette.ink[900],
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.ink[500],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  frameFaulted: {
    borderColor: palette.accent.danger,
    backgroundColor: palette.overlay.dangerWash,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
  },
  prefix: {
    ...type.tape,
    color: palette.gold.base,
    marginRight: spacing.xs,
  },
  group: {
    ...type.tape,
    color: palette.text.primary,
    marginRight: spacing.md,
  },
  /** O bloco de dez ainda em construção. */
  groupOpen: {
    color: palette.gold.bright,
  },
  cursor: {
    ...type.tape,
    color: palette.gold.bright,
  },
});
