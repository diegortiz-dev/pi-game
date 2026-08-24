import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Easing } from 'react-native';
import { palette, type } from '../theme';
import { useT } from '../hooks/useSettings';

/**
 * Anuncia um desconto de tempo logo abaixo do relógio.
 *
 * Um erro custa dez segundos e uma dica custa cinco. Sem este aviso o relógio
 * simplesmente salta, e um salto sem explicação parece defeito — não punição.
 * O número sobe e some, no lugar onde o tempo é lido.
 */

type Props = {
  /** Muda de `id` a cada novo desconto. `null` quando não há nada a anunciar. */
  penalty: { seconds: number; id: number } | null;
};

export default function PenaltyFlash({ penalty }: Props) {
  const t = useT();
  const progress = useRef(new Animated.Value(0)).current;
  const shown = useRef<number | null>(null);

  useEffect(() => {
    if (!penalty || penalty.id === shown.current) return;
    shown.current = penalty.id;

    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 900,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [penalty, progress]);

  if (!penalty) return null;

  return (
    <Animated.Text
      style={[
        styles.text,
        {
          opacity: progress.interpolate({
            inputRange: [0, 0.25, 1],
            outputRange: [0, 1, 0],
          }),
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -18],
              }),
            },
          ],
        },
      ]}
      accessibilityLiveRegion="polite"
      accessibilityLabel={t('penalty.a11y', { n: penalty.seconds })}
    >
      −{penalty.seconds}s
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  text: {
    ...type.data,
    fontSize: 13,
    color: palette.accent.danger,
    position: 'absolute',
    top: 20,
    right: 0,
  },
});
