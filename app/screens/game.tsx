import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  Share,
  Animated,
  BackHandler,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types';
import { useGameEngine, CHALLENGE_MS, HINT_PENALTY_MS } from '../hooks/useGameEngine';
import PenaltyFlash from '../components/PenaltyFlash';
import { useSettings, useT } from '../hooks/useSettings';
import ScoreGauge, { GAUGE_BASE_SIZE } from '../components/ScoreGauge';
import PiTape from '../components/PiTape';
import Keypad from '../components/Keypad';
import AchievementToast from '../components/AchievementToast';
import { palette } from '../theme';
import { styles } from './game.styles';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Game'>;
  route: RouteProp<RootStackParamList, 'Game'>;
};

/** Quanto tempo a tecla errada fica destacada. */
const WRONG_FLASH_MS = 700;

/** Espaço entre as teclas. Precisa bater com o `gap` do Keypad. */
const KEY_GAP = 8;

export default function GameScreen({ navigation, route }: Props) {
  const { mode } = route.params;
  const { width, height } = useWindowDimensions();
  const { shakeEnabled } = useSettings();
  const t = useT();

  const {
    state,
    revealed,
    personalBest,
    currentAchievement,
    dismissAchievement,
    pressDigit,
    useHint,
    clearWrongKey,
    restart,
  } = useGameEngine(mode);

  const shakeX = useRef(new Animated.Value(0)).current;
  const finished = state.status === 'over' || state.status === 'complete';

  /*
   * O teclado tem quatro fileiras e precisa caber inteiro: uma última fileira
   * cortada deixaria o zero impossível de apertar.
   *
   * A área de jogo é medida de verdade em vez de estimada a partir da altura da
   * tela. Uma constante chutada para o cabeçalho e o medidor erra sempre que a
   * fonte, o recorte da tela ou a barra de status muda de tamanho — e o erro
   * aparece justamente como fileira cortada.
   */
  const [playHeight, setPlayHeight] = useState(0);

  const keySize = useMemo(() => {
    const byWidth = (width - 64) / 3;
    // O teclado fica com no máximo 62% da área de jogo; o resto é da fita.
    // Numa tela curta quem precisa do espaço é a tecla, que é o alvo de toque —
    // a fita ainda rola, mas uma tecla pequena demais não tem conserto.
    const byHeight = playHeight > 0 ? (playHeight * 0.62 - 3 * KEY_GAP) / 4 : 64;
    // 44 é o menor alvo de toque confortável recomendado pela Apple e pelo Google.
    return Math.max(44, Math.min(byWidth, 92, byHeight));
  }, [width, playHeight]);

  const gaugeSize = Math.min(GAUGE_BASE_SIZE, Math.max(124, height * 0.22));

  // Limpa o destaque da tecla errada depois de um instante.
  useEffect(() => {
    if (state.wrongKey === null) return;
    const id = setTimeout(clearWrongKey, WRONG_FLASH_MS);
    return () => clearTimeout(id);
  }, [state.wrongKey, clearWrongKey]);

  // Sacode a fita ao errar.
  useEffect(() => {
    if (state.wrongKey === null || !shakeEnabled) return;
    shakeX.setValue(0);
    Animated.sequence(
      [14, -12, 9, -6, 3, 0].map((toValue) =>
        Animated.timing(shakeX, {
          toValue,
          duration: 42,
          useNativeDriver: true,
        })
      )
    ).start();
  }, [state.wrongKey, shakeEnabled, shakeX]);

  // No Android, voltar sai da partida em vez de fechar o app.
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.goBack();
      return true;
    });
    return () => subscription.remove();
  }, [navigation]);

  const share = useCallback(async () => {
    try {
      await Share.share({
        message: t(mode === 'timer' ? 'game.share.challenge' : 'game.share.practice', {
          n: state.recalled,
        }),
      });
    } catch {
      // Cancelar o compartilhamento não é erro.
    }
  }, [mode, state.recalled, t]);

  const secondsLeft = Math.ceil(state.msLeft / 1000);
  const timeRatio = mode === 'timer' ? state.msLeft / CHALLENGE_MS : undefined;

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <StatusBar style="light" />

      <AchievementToast
        achievement={currentAchievement}
        onDismiss={dismissAchievement}
      />

      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel={t('common.backToMenu')}
          hitSlop={12}
          style={({ pressed }) => [styles.back, pressed && styles.backPressed]}
        >
          <Ionicons name="chevron-back" size={18} color={palette.gold.base} />
          <Text style={styles.backLabel}>{t('common.menu')}</Text>
        </Pressable>

        <Text style={styles.mode}>
          {t(mode === 'timer' ? 'game.challenge' : 'game.practice')}
        </Text>

        <View style={styles.clock}>
          {mode === 'timer' ? (
            <>
              <Text
                style={styles.clockValue}
                accessibilityLabel={t('game.a11y.secondsLeft', { n: secondsLeft })}
              >
                {secondsLeft}s
              </Text>
              <PenaltyFlash penalty={state.penalty} />
            </>
          ) : (
            <Ionicons name="infinite" size={18} color={palette.text.tertiary} />
          )}
        </View>
      </View>

      <View style={styles.gaugeArea}>
        <ScoreGauge
          position={state.position}
          timeRatio={timeRatio}
          faulted={state.status === 'over'}
          size={gaugeSize}
        />
        <View style={styles.meta}>
          <Text style={styles.metaItem}>
            {t('game.meta.record')} <Text style={styles.metaValue}>{personalBest}</Text>
          </Text>
          {state.streak >= 5 && (
            <Text style={styles.metaItem}>
              {t('game.meta.streak')} <Text style={styles.metaValue}>{state.streak}</Text>
            </Text>
          )}
          {state.hintsUsed > 0 && (
            <Text style={styles.metaItem}>
              {t('game.meta.hints')} <Text style={styles.metaValue}>{state.hintsUsed}</Text>
            </Text>
          )}
        </View>
      </View>

      {finished ? (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>
            {t(state.status === 'complete' ? 'game.complete' : 'game.over')}
          </Text>

          {state.isNewRecord && state.recalled > 0 && (
            <View style={styles.recordBadge}>
              <Ionicons name="sparkles" size={14} color={palette.gold.bright} />
              <Text style={styles.recordBadgeText}>{t('game.newRecord')}</Text>
            </View>
          )}

          <View style={styles.resultGrid}>
            <View style={styles.resultCell}>
              <Text style={styles.resultValue}>{state.recalled}</Text>
              <Text style={styles.resultLabel}>{t('game.result.recalled')}</Text>
            </View>
            <View style={styles.resultDivider} />
            <View style={styles.resultCell}>
              <Text style={styles.resultValue}>{state.mistakes}</Text>
              <Text style={styles.resultLabel}>{t('game.result.mistakes')}</Text>
            </View>
            <View style={styles.resultDivider} />
            <View style={styles.resultCell}>
              <Text style={styles.resultValue}>{state.hintsUsed}</Text>
              <Text style={styles.resultLabel}>{t('game.result.hints')}</Text>
            </View>
          </View>

          {state.missedDigit !== null && (
            <Text style={styles.missed}>
              {t('game.missed')}{' '}
              <Text style={styles.missedDigit}>{state.missedDigit}</Text>
            </Text>
          )}

          <Pressable
            onPress={restart}
            accessibilityRole="button"
            accessibilityLabel={t('game.a11y.playAgain')}
            style={({ pressed }) => [styles.primaryAction, pressed && styles.pressed]}
          >
            <Text style={styles.primaryActionText}>{t('game.playAgain')}</Text>
          </Pressable>

          <View style={styles.secondaryRow}>
            <Pressable
              onPress={share}
              accessibilityRole="button"
              accessibilityLabel={t('game.a11y.share')}
              style={({ pressed }) => [styles.secondaryAction, pressed && styles.pressed]}
            >
              <Ionicons name="share-outline" size={17} color={palette.text.secondary} />
              <Text style={styles.secondaryActionText}>{t('game.share')}</Text>
            </Pressable>
            <Pressable
              onPress={() => navigation.goBack()}
              accessibilityRole="button"
              accessibilityLabel={t('common.backToMenu')}
              style={({ pressed }) => [styles.secondaryAction, pressed && styles.pressed]}
            >
              <Ionicons name="home-outline" size={17} color={palette.text.secondary} />
              <Text style={styles.secondaryActionText}>{t('common.menu')}</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View
          style={styles.play}
          onLayout={(event) => setPlayHeight(event.nativeEvent.layout.height)}
        >
          <PiTape
            revealed={revealed}
            shakeX={shakeX}
            faulted={state.wrongKey !== null}
          />

          {state.wrongKey !== null && (
            <Text style={styles.retry} accessibilityLiveRegion="polite">
              {t('game.retry')}
            </Text>
          )}

          {state.status === 'idle' && (
            <Text style={styles.startCue}>{t('game.startCue')}</Text>
          )}

          <Keypad
            onDigit={pressDigit}
            onHint={useHint}
            wrongKey={state.wrongKey}
            hintCostSeconds={mode === 'timer' ? HINT_PENALTY_MS / 1000 : undefined}
            keySize={keySize}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
