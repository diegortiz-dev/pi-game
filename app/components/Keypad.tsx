import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette, spacing, radius, type } from '../theme';
import { useT } from '../hooks/useSettings';

/**
 * O teclado numérico.
 *
 * Todo alvo tem rótulo de acessibilidade — a versão anterior não tinha nenhum, e
 * um leitor de tela anunciava o teclado inteiro como conteúdo sem nome.
 *
 * A tecla de dica mostra o próprio custo. Esconder que ela tira cinco segundos
 * faria o relógio parecer quebrado quando o tempo desse um salto.
 */

const ROWS = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

type Props = {
  onDigit: (digit: number) => void;
  onHint: () => void;
  /** Tecla a destacar como errada. */
  wrongKey: number | null;
  /** Custo da dica em segundos. Ausente quando não custa nada. */
  hintCostSeconds?: number;
  /**
   * Mostra a tecla de dica. O Modo Aprender a desliga: lá a própria rodada já
   * decide o que fica à vista, então uma dica não teria sentido.
   */
  showHint?: boolean;
  keySize: number;
};

function Key({
  label,
  onPress,
  accessibilityLabel,
  size,
  tone = 'default',
  icon,
  caption,
}: {
  label?: string;
  onPress: () => void;
  accessibilityLabel: string;
  size: number;
  tone?: 'default' | 'wrong' | 'hint';
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  caption?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.key,
        { width: size, height: size },
        tone === 'hint' && styles.keyHint,
        tone === 'wrong' && styles.keyWrong,
        pressed && styles.keyPressed,
      ]}
    >
      {icon ? (
        <Ionicons name={icon} size={22} color={palette.gold.bright} />
      ) : (
        <Text style={[styles.keyLabel, tone === 'wrong' && styles.keyLabelWrong]}>
          {label}
        </Text>
      )}
      {caption ? <Text style={styles.keyCaption}>{caption}</Text> : null}
    </Pressable>
  );
}

export default function Keypad({
  onDigit,
  onHint,
  wrongKey,
  hintCostSeconds,
  showHint = true,
  keySize,
}: Props) {
  const t = useT();

  return (
    <View style={styles.pad}>
      {ROWS.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((digit) => (
            <Key
              key={digit}
              label={String(digit)}
              size={keySize}
              tone={wrongKey === digit ? 'wrong' : 'default'}
              onPress={() => onDigit(digit)}
              accessibilityLabel={t('keypad.a11y.digit', { n: digit })}
            />
          ))}
        </View>
      ))}

      <View style={styles.row}>
        {showHint ? (
          <Key
            icon="bulb-outline"
            caption={hintCostSeconds ? `−${hintCostSeconds}s` : t('keypad.reveal')}
            size={keySize}
            tone="hint"
            onPress={onHint}
            accessibilityLabel={
              hintCostSeconds
                ? t('keypad.a11y.hintCost', { n: hintCostSeconds })
                : t('keypad.a11y.hint')
            }
          />
        ) : (
          <View style={{ width: keySize, height: keySize }} />
        )}
        <Key
          label="0"
          size={keySize}
          tone={wrongKey === 0 ? 'wrong' : 'default'}
          onPress={() => onDigit(0)}
          accessibilityLabel={t('keypad.a11y.digit', { n: 0 })}
        />
        {/* Mantém o zero centrado sob o 8. */}
        <View style={{ width: keySize, height: keySize }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pad: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  key: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.ink[700],
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.ink[500],
  },
  keyPressed: {
    backgroundColor: palette.ink[600],
    borderColor: palette.gold.base,
  },
  keyHint: {
    backgroundColor: 'transparent',
    borderColor: palette.gold.dim,
    borderStyle: 'dashed',
  },
  keyWrong: {
    backgroundColor: palette.overlay.dangerWash,
    borderColor: palette.accent.danger,
  },
  keyLabel: {
    ...type.key,
    color: palette.text.primary,
  },
  keyLabelWrong: {
    color: palette.accent.danger,
  },
  keyCaption: {
    ...type.label,
    fontSize: 9,
    letterSpacing: 0.8,
    color: palette.gold.base,
    marginTop: 2,
  },
});
