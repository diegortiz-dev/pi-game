import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, useWindowDimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import { useLearnSession } from '../hooks/useLearnSession';
import { useSettings, useT } from '../hooks/useSettings';
import { ROUND_COUNT, blockLabel } from '../data/learn';
import LearnBoard from '../components/LearnBoard';
import PiText from '../components/PiText';
import Keypad from '../components/Keypad';
import { palette } from '../theme';
import { styles } from './learn.styles';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Learn'>;
};

const WRONG_FLASH_MS = 700;

/** O que cada rodada pede. O texto muda porque a tarefa muda de verdade. */
const ROUND_BRIEF = ['learn.brief.0', 'learn.brief.1', 'learn.brief.2'] as const;

export default function LearnScreen({ navigation }: Props) {
  const { width, height } = useWindowDimensions();
  const { shakeEnabled } = useSettings();
  const t = useT();
  const {
    state,
    ready,
    masteredBlocks,
    pressDigit,
    advanceRound,
    advanceBlock,
    redoBlock,
    dismissWrong,
  } = useLearnSession();

  const shakeX = useRef(new Animated.Value(0)).current;

  // O teclado fica com 42% da altura: sem cronômetro nem fita, o espaço restante
  // sobrava e a tecla é o que a pessoa passa a partida inteira acertando.
  const keySize = Math.max(44, Math.min((width - 64) / 3, 88, (height * 0.42 - 24) / 4));
  const slotSize = Math.min(34, (width - 32 - 9 * 3) / 10);
  const range = blockLabel(state.block);
  const drilling = state.status === 'drilling';
  const masteredDigits = masteredBlocks * 10;

  useEffect(() => {
    if (state.wrongKey === null) return;
    const id = setTimeout(dismissWrong, WRONG_FLASH_MS);
    return () => clearTimeout(id);
  }, [state.wrongKey, dismissWrong]);

  useEffect(() => {
    if (state.wrongKey === null || !shakeEnabled) return;
    shakeX.setValue(0);
    Animated.sequence(
      [10, -8, 6, -4, 0].map((toValue) =>
        Animated.timing(shakeX, { toValue, duration: 40, useNativeDriver: true })
      )
    ).start();
  }, [state.wrongKey, shakeEnabled, shakeX]);

  if (!ready) {
    return <SafeAreaView style={styles.screen} />;
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel={t('common.backToMenu')}
          hitSlop={12}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}
        >
          <Ionicons name="chevron-back" size={18} color={palette.gold.base} />
          <Text style={styles.backLabel}>{t('common.menu')}</Text>
        </Pressable>

        <Text style={styles.title}>{t('learn.title')}</Text>

        <Text style={styles.blockCount}>
          {masteredDigits === 0 ? '—' : t('learn.mastered', { n: masteredDigits })}
        </Text>
      </View>

      <View style={styles.stage}>
        <View style={styles.brief}>
          <Text style={styles.range}>
            {t('learn.range', { first: range.first, last: range.last })}
          </Text>
          {drilling && (
            <>
              <Text style={styles.round}>
                {t('learn.round', { n: state.round + 1, total: ROUND_COUNT })}
              </Text>
              <Text style={styles.instruction}>{t(ROUND_BRIEF[state.round])}</Text>
            </>
          )}
        </View>

        <Animated.View style={{ transform: [{ translateX: shakeX }] }}>
          <LearnBoard state={state} slotSize={slotSize} />
        </Animated.View>
      </View>

      {state.status === 'roundDone' && (
        <View style={styles.panel}>
          <Ionicons name="checkmark-circle" size={30} color={palette.accent.success} />
          <Text style={styles.panelTitle}>{t('learn.roundDone')}</Text>
          <Text style={styles.panelBody}>{t(ROUND_BRIEF[state.round + 1])}</Text>
          <Pressable
            onPress={advanceRound}
            accessibilityRole="button"
            accessibilityLabel={t('learn.a11y.nextRound')}
            style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
          >
            <Text style={styles.primaryText}>{t('learn.nextRound')}</Text>
          </Pressable>
        </View>
      )}

      {state.status === 'blockDone' && (
        <View style={styles.panel}>
          <Ionicons name="ribbon" size={34} color={palette.gold.bright} />
          <Text style={styles.panelTitle}>{t('learn.blockDone')}</Text>
          <PiText style={styles.panelBody}>
            {t(state.mistakes === 0 ? 'learn.blockDone.perfect' : 'learn.blockDone.body', {
              n: range.last,
            })}
          </PiText>

          <Pressable
            onPress={advanceBlock}
            accessibilityRole="button"
            accessibilityLabel={t('learn.a11y.nextBlock')}
            style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
          >
            <Text style={styles.primaryText}>{t('learn.nextBlock')}</Text>
          </Pressable>

          <View style={styles.secondaryRow}>
            <Pressable
              onPress={redoBlock}
              accessibilityRole="button"
              accessibilityLabel={t('learn.a11y.repeat')}
              style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
            >
              <Text style={styles.secondaryText}>{t('learn.repeat')}</Text>
            </Pressable>
            <Pressable
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel={t('common.backToMenu')}
              style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
            >
              <Text style={styles.secondaryText}>{t('common.menu')}</Text>
            </Pressable>
          </View>
        </View>
      )}

      {drilling && (
        <View style={styles.keypadArea}>
          <Keypad
            onDigit={pressDigit}
            onHint={() => {}}
            wrongKey={state.wrongKey}
            keySize={keySize}
            showHint={false}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
