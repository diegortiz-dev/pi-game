import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { palette, spacing, radius, type, timing } from '../theme';
import { playSfx } from '../utils/sound';
import { useSettings } from '../hooks/useSettings';
import type { Achievement } from '../data/achievements';
import PiText from './PiText';

/**
 * Anuncia uma conquista de cada vez.
 *
 * A versão anterior percorria as conquistas com forEach e disparava uma animação
 * por conquista sobre o mesmo Animated.Value. Duas desbloqueadas no mesmo toque
 * significavam duas animações concorrentes e só a última visível. Aqui quem
 * chama mantém uma fila e passa apenas a primeira; ao terminar, o componente
 * avisa e recebe a próxima.
 */

type Props = {
  achievement?: Achievement;
  onDismiss: () => void;
};

export default function AchievementToast({ achievement, onDismiss }: Props) {
  const { reduceMotion, t } = useSettings();
  const slide = useRef(new Animated.Value(-160)).current;
  const dismissRef = useRef(onDismiss);
  dismissRef.current = onDismiss;

  useEffect(() => {
    if (!achievement) return;

    playSfx('achievement');
    slide.setValue(-160);

    // Com "reduzir movimento" ligado o aviso aparece e some sem deslizar, mas
    // continua sendo mostrado pelo mesmo tempo.
    const slideIn = reduceMotion ? 0 : timing.normal;
    const slideOut = reduceMotion ? 0 : timing.fast;

    const animation = Animated.sequence([
      Animated.timing(slide, {
        toValue: 0,
        duration: slideIn,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.delay(timing.toastHold),
      Animated.timing(slide, {
        toValue: -160,
        duration: slideOut,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    animation.start(({ finished }) => {
      if (finished) dismissRef.current();
    });

    return () => animation.stop();
  }, [achievement, slide, reduceMotion]);

  if (!achievement) return null;

  return (
    <Animated.View
      style={[styles.wrap, { transform: [{ translateY: slide }] }]}
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
      accessibilityLabel={t('toast.a11y', {
        title: t(achievement.titleKey),
        description: t(achievement.descriptionKey),
      })}
      pointerEvents="none"
    >
      <View style={styles.card}>
        <View style={styles.iconBox}>
          <Ionicons name={achievement.icon} size={22} color={palette.gold.bright} />
        </View>
        <View style={styles.text}>
          <Text style={styles.eyebrow}>{t('toast.eyebrow')}</Text>
          <PiText style={styles.title}>{t(achievement.titleKey)}</PiText>
          <PiText style={styles.description}>{t(achievement.descriptionKey)}</PiText>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: palette.ink[700],
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.gold.base,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.overlay.goldWash,
  },
  text: {
    flex: 1,
  },
  eyebrow: {
    ...type.label,
    fontSize: 9,
    color: palette.gold.base,
  },
  title: {
    ...type.heading,
    fontSize: 17,
    color: palette.text.primary,
    marginTop: 2,
  },
  description: {
    ...type.bodySmall,
    color: palette.text.secondary,
  },
});
