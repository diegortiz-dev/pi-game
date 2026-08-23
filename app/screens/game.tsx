import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Vibration,
  useWindowDimensions,
  BackHandler,
  Share,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types';
import { styles, COLORS } from './game.styles';
import {
  playKeyPressSound,
  playCorrectSound,
  playErrorSound,
  playAchievementSound,
} from '../utils/sound';
import { HAPTICS_KEY, SHAKE_KEY } from '../components/SettingsModal';

type GameScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Game'>;
  route: RouteProp<RootStackParamList, 'Game'>;
};

type ToastState = {
  title: string;
  description: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
} | null;

const PI_DIGITS =
  '14159265358979323846264338327950288419716939937510' +
  '58209749445923078164062862089986280348253421170679' +
  '82148086513282306647093844609550582231725359408128' +
  '48111745028410270193852110555964462294895493038196' +
  '44288109756659334461284756482337867831652712019091' +
  '45648566923460348610454326648213393607260249141273' +
  '72458700660631558817488152092096282925409171536436' +
  '78925903600113305305488204665213841469519415116094' +
  '33057270365759591953092186117381932611793105118548' +
  '07446237996274956735188575272489122793818301194912' +
  '98336733624406566430860213949463952247371907021798' +
  '60943702770539217176293176752384674818467669405132' +
  '00056812714526356082778577134275778960917363717872' +
  '14684409012249534301465495853710507922796892589235' +
  '42019956112129021960864034418159813629774771309960' +
  '51870721134999999837297804995105973173281609631859' +
  '50244594553469083026425223082533446850352619311881' +
  '71010003137838752886587533208381420617177669147303' +
  '59825349042875546873115956286388235378759375195778' +
  '18577805321712268066130019278766111959092164201989';

const TIMER_DURATION = 60;

const HIGH_SCORE_KEY = '@pi_game_high_score';
const HIGH_SCORE_PRACTICE_KEY = '@pi_game_high_score_practice';
const TOTAL_DIGITS_KEY = '@pi_game_total_digits';
const TOTAL_GAMES_KEY = '@pi_game_total_games';

export default function GameScreen({ navigation, route }: GameScreenProps) {
  const { mode } = route.params;
  const { width } = useWindowDimensions();
  const KEY_SIZE = Math.min((width - 60) / 3, 85);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [wrongPress, setWrongPress] = useState(false);
  const [lastWrongKey, setLastWrongKey] = useState<number | null>(null);
  const [correctFlash, setCorrectFlash] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentToast, setCurrentToast] = useState<ToastState>(null);

  const scrollViewRef = useRef<ScrollView>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [started, setStarted] = useState(mode === 'practice');

  const highScoreRef = useRef(0);
  const totalDigitsRef = useRef(0);
  const totalGamesRef = useRef(0);
  const hasCountedGameRef = useRef(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const toastAnim = useRef(new Animated.Value(-120)).current;
  const hapticsEnabledRef = useRef(true);
  const shakeEnabledRef = useRef(true);
  const unlockedAchievementsRef = useRef<Set<string>>(new Set());

  // Carregar preferências e estatísticas no início
  useEffect(() => {
    const key = mode === 'timer' ? HIGH_SCORE_KEY : HIGH_SCORE_PRACTICE_KEY;
    Promise.all([
      AsyncStorage.getItem(key),
      AsyncStorage.getItem(TOTAL_DIGITS_KEY),
      AsyncStorage.getItem(TOTAL_GAMES_KEY),
      AsyncStorage.getItem(HIGH_SCORE_KEY),
      AsyncStorage.getItem(HIGH_SCORE_PRACTICE_KEY),
      AsyncStorage.getItem(HAPTICS_KEY),
      AsyncStorage.getItem(SHAKE_KEY),
    ]).then(
      ([hsVal, digitsVal, gamesVal, tHs, pHs, hapticsVal, shakeVal]) => {
        if (hsVal) {
          const hs = parseInt(hsVal, 10);
          setHighScore(hs);
          highScoreRef.current = hs;
        }
        if (digitsVal) {
          totalDigitsRef.current = parseInt(digitsVal, 10);
        }
        if (gamesVal) {
          totalGamesRef.current = parseInt(gamesVal, 10);
        }
        if (hapticsVal !== null) {
          hapticsEnabledRef.current = hapticsVal === 'true';
        }
        if (shakeVal !== null) {
          shakeEnabledRef.current = shakeVal === 'true';
        }

        // Mapear conquistas já desbloqueadas para evitar notificar conquistas antigas
        const tScore = tHs ? parseInt(tHs, 10) : 0;
        const pScore = pHs ? parseInt(pHs, 10) : 0;
        const best = Math.max(tScore, pScore);
        const digits = totalDigitsRef.current;
        const games = totalGamesRef.current;

        const set = unlockedAchievementsRef.current;
        if (best >= 5) set.add('first_step');
        if (best >= 15) set.add('apprentice');
        if (best >= 30) set.add('geometer');
        if (best >= 50) set.add('pi_master');
        if (best >= 100) set.add('circle_legend');
        if (tScore >= 20) set.add('speedster');
        if (pScore >= 15) set.add('practice_scholar');
        if (games >= 10) set.add('dedicated_player');
        if (digits >= 100) set.add('digit_master');
      }
    );
  }, [mode]);

  const checkAndNotifyAchievements = useCallback(
    (newIndex: number) => {
      const best = Math.max(highScoreRef.current, newIndex);
      const digits = totalDigitsRef.current;
      const games = totalGamesRef.current;
      const timerScoreVal = mode === 'timer' ? Math.max(highScoreRef.current, newIndex) : 0;
      const practiceScoreVal = mode === 'practice' ? Math.max(highScoreRef.current, newIndex) : 0;

      const achDefs = [
        { id: 'first_step', title: 'Primeiro Passo', description: 'Chegue a 5 dígitos de π', icon: 'footsteps-outline', cond: best >= 5 },
        { id: 'apprentice', title: 'Aprendiz de Arquimedes', description: 'Chegue a 15 dígitos de π', icon: 'school-outline', cond: best >= 15 },
        { id: 'geometer', title: 'Geômetra', description: 'Chegue a 30 dígitos de π', icon: 'shapes-outline', cond: best >= 30 },
        { id: 'pi_master', title: 'Mestre do π', description: 'Chegue a 50 dígitos de π', icon: 'ribbon-outline', cond: best >= 50 },
        { id: 'circle_legend', title: 'Lenda do Círculo', description: 'Chegue a 100 dígitos de π', icon: 'trophy-outline', cond: best >= 100 },
        { id: 'speedster', title: 'Velocista', description: 'Acerte 20 dígitos no modo Desafio', icon: 'flash-outline', cond: timerScoreVal >= 20 },
        { id: 'practice_scholar', title: 'Estudioso', description: 'Acerte 15 dígitos no modo Prática', icon: 'book-outline', cond: practiceScoreVal >= 15 },
        { id: 'dedicated_player', title: 'Dedicado', description: 'Jogue 10 partidas no total', icon: 'game-controller-outline', cond: games >= 10 },
        { id: 'digit_master', title: 'Contador de π', description: 'Digite 100 dígitos no total', icon: 'calculator-outline', cond: digits >= 100 },
      ];

      achDefs.forEach((ach) => {
        if (ach.cond && !unlockedAchievementsRef.current.has(ach.id)) {
          unlockedAchievementsRef.current.add(ach.id);
          playAchievementSound();
          setCurrentToast({ title: ach.title, description: ach.description, icon: ach.icon as any });

          toastAnim.setValue(-120);
          Animated.sequence([
            Animated.timing(toastAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
            Animated.delay(3200),
            Animated.timing(toastAnim, { toValue: -120, duration: 400, useNativeDriver: true }),
          ]).start(() => {
            setCurrentToast(null);
          });
        }
      });
    },
    [mode, toastAnim]
  );

  const markGamePlayed = useCallback(() => {
    if (!hasCountedGameRef.current) {
      hasCountedGameRef.current = true;
      totalGamesRef.current += 1;
      AsyncStorage.setItem(TOTAL_GAMES_KEY, totalGamesRef.current.toString()).catch((err) =>
        console.error('Erro ao salvar total_games:', err)
      );
      checkAndNotifyAchievements(currentIndex);
    }
  }, [checkAndNotifyAchievements, currentIndex]);

  const recordCorrectProgress = useCallback(
    (newIndex: number) => {
      markGamePlayed();

      // Incrementar total de dígitos pressionados
      totalDigitsRef.current += 1;
      AsyncStorage.setItem(TOTAL_DIGITS_KEY, totalDigitsRef.current.toString()).catch((err) =>
        console.error('Erro ao salvar total_digits:', err)
      );

      // Atualizar recorde da modalidade em tempo real
      if (newIndex > highScoreRef.current) {
        highScoreRef.current = newIndex;
        setHighScore(newIndex);
        const key = mode === 'timer' ? HIGH_SCORE_KEY : HIGH_SCORE_PRACTICE_KEY;
        AsyncStorage.setItem(key, newIndex.toString()).catch((err) =>
          console.error('Erro ao salvar high_score:', err)
        );
      }

      // Verificar novas conquistas desbloqueadas em tempo real
      checkAndNotifyAchievements(newIndex);
    },
    [checkAndNotifyAchievements, markGamePlayed, mode]
  );

  // Haptic feedback quando o jogo termina com novo recorde
  useEffect(() => {
    if (gameOver) {
      if (currentIndex >= highScoreRef.current && currentIndex > 0) {
        if (hapticsEnabledRef.current) {
          try {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } catch {}
        }
      }
    }
  }, [gameOver, currentIndex]);

  // Android back button
  useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!gameOver && currentIndex > 0) {
        navigation.goBack();
        return true;
      }
      return false;
    });
    return () => handler.remove();
  }, [gameOver, currentIndex, navigation]);

  // Contador do timer
  useEffect(() => {
    if (mode === 'timer' && started && !gameOver) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode, started, gameOver]);

  const triggerLightHaptic = () => {
    if (!hapticsEnabledRef.current) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      Vibration.vibrate(30);
    }
  };

  const triggerErrorHaptic = () => {
    if (!hapticsEnabledRef.current) return;
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {
      Vibration.vibrate(200);
    }
  };

  const triggerShake = () => {
    if (!shakeEnabledRef.current) return;
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 12, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -12, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 4, duration: 40, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true }),
    ]).start();
  };

  const handleDigitPress = useCallback(
    (digit: number) => {
      if (gameOver) return;

      playKeyPressSound();

      if (mode === 'timer' && !started) {
        setStarted(true);
      }

      const expectedDigit = parseInt(PI_DIGITS[currentIndex], 10);

      if (digit === expectedDigit) {
        triggerLightHaptic();
        playCorrectSound();
        setCorrectFlash(true);
        setTimeout(() => setCorrectFlash(false), 150);
        setWrongPress(false);
        setLastWrongKey(null);
        setStreak((prev) => prev + 1);

        const newIndex = currentIndex + 1;
        setCurrentIndex(newIndex);
        recordCorrectProgress(newIndex);

        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 50);
      } else {
        triggerErrorHaptic();
        playErrorSound();
        triggerShake();
        setStreak(0);
        setWrongPress(true);
        setLastWrongKey(digit);

        if (mode === 'timer') {
          if (timerRef.current) clearInterval(timerRef.current);
          setGameOver(true);
        }
      }
    },
    [currentIndex, gameOver, mode, recordCorrectProgress, started]
  );

  const handleHint = useCallback(() => {
    if (gameOver) return;

    playKeyPressSound();

    if (mode === 'timer' && !started) {
      setStarted(true);
    }

    triggerLightHaptic();
    playCorrectSound();
    setCorrectFlash(true);
    setTimeout(() => setCorrectFlash(false), 150);
    setWrongPress(false);
    setLastWrongKey(null);
    setStreak((prev) => prev + 1);
    setHintsUsed((prev) => prev + 1);

    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    recordCorrectProgress(newIndex);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 50);
  }, [currentIndex, gameOver, mode, recordCorrectProgress, started]);

  const handleRestart = () => {
    setCurrentIndex(0);
    setTimeLeft(TIMER_DURATION);
    setGameOver(false);
    setWrongPress(false);
    setLastWrongKey(null);
    setStreak(0);
    setStarted(mode === 'practice');
    setHintsUsed(0);
    hasCountedGameRef.current = false;
    const key = mode === 'timer' ? HIGH_SCORE_KEY : HIGH_SCORE_PRACTICE_KEY;
    AsyncStorage.getItem(key).then((val) => {
      if (val) {
        const hs = parseInt(val, 10);
        setHighScore(hs);
        highScoreRef.current = hs;
      }
    });
  };

  const handleShareScore = async () => {
    try {
      await Share.share({
        message: `🏆 Consegui memorizar ${currentIndex} dígitos de π no π-Game! Tente me superar! 🥧✨`,
      });
    } catch (error) {
      console.log('Erro ao compartilhar:', error);
    }
  };

  const revealedDigits = PI_DIGITS.substring(0, currentIndex);

  const DIGITS_FIRST_LINE = 14;
  const DIGITS_PER_LINE = 16;
  const formatDigits = () => {
    const lines: string[] = [];
    if (revealedDigits.length <= DIGITS_FIRST_LINE) {
      return revealedDigits;
    }
    lines.push(revealedDigits.substring(0, DIGITS_FIRST_LINE));
    let remaining = revealedDigits.substring(DIGITS_FIRST_LINE);
    while (remaining.length > 0) {
      lines.push(remaining.substring(0, DIGITS_PER_LINE));
      remaining = remaining.substring(DIGITS_PER_LINE);
    }
    return lines.join('\n');
  };

  const timerColor =
    timeLeft > 30 ? COLORS.green : timeLeft > 10 ? COLORS.yellow : COLORS.red;

  const dynamicStyles = {
    key: {
      width: KEY_SIZE,
      height: KEY_SIZE,
    },
  };

  const renderLabel = (
    iconName: React.ComponentProps<typeof Ionicons>['name'],
    label: string,
    color: string
  ) => (
    <View style={styles.labelRow}>
      <Ionicons name={iconName} size={18} color={color} />
      <Text style={[styles.labelRowText, { color }]}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Banner Toast Flutuante de Conquista */}
      {currentToast && (
        <Animated.View
          style={[
            styles.toastContainer,
            { transform: [{ translateY: toastAnim }] },
          ]}
        >
          <View style={styles.toastContent}>
            <View style={styles.toastIconWrap}>
              <Ionicons name={currentToast.icon} size={22} color="#ab8b0c" />
            </View>
            <View style={styles.toastTextWrap}>
              <View style={styles.toastTitleRow}>
                <Ionicons name="sparkles" size={12} color="#ab8b0c" />
                <Text style={styles.toastCategory}>Conquista Desbloqueada!</Text>
              </View>
              <Text style={styles.toastTitle}>{currentToast.title}</Text>
              <Text style={styles.toastDesc}>{currentToast.description}</Text>
            </View>
          </View>
        </Animated.View>
      )}

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={18} color={COLORS.gold} />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        {mode === 'timer'
          ? renderLabel('hourglass-outline', 'Desafio', COLORS.blueMuted)
          : renderLabel('book-outline', 'Prática', COLORS.blueMuted)}

        {mode === 'timer' && (
          <View style={styles.timerContainer}>
            <Ionicons name="time-outline" size={18} color={timerColor} />
            <Text style={[styles.timerText, { color: timerColor }]}>
              {timeLeft}s
            </Text>
          </View>
        )}
      </View>

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>Dígitos de π</Text>
        <Text style={styles.scoreValue}>{currentIndex}</Text>

        {/* Sistema de Sequência (Streak 🔥) */}
        {streak > 1 && (
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>🔥 {streak}x Sequência!</Text>
          </View>
        )}

        {highScore > 0 && (
          <View style={styles.infoRow}>
            <Ionicons name="trophy-outline" size={16} color={COLORS.goldMuted} />
            <Text style={styles.highScoreText}>Recorde: {highScore}</Text>
          </View>
        )}
        {hintsUsed > 0 && (
          <View style={styles.infoRow}>
            <Ionicons name="bulb-outline" size={16} color={COLORS.blueMuted} />
            <Text style={styles.hintsUsedText}>Dicas: {hintsUsed}</Text>
          </View>
        )}
      </View>

      {/* Container do Display de π com Animação de Tremor (Shake) */}
      <Animated.View
        style={[
          styles.piDisplayContainer,
          wrongPress && mode === 'practice' && styles.piDisplayWrong,
          correctFlash && styles.piDisplayCorrect,
          { transform: [{ translateX: shakeAnim }] },
        ]}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.piScroll}
          contentContainerStyle={styles.piScrollContent}
        >
          <Text style={styles.piPrefix}>
            3.{currentIndex <= 14 ? '' : '\n'}
            {formatDigits()}
            <Text style={styles.piCursor}>│</Text>
          </Text>
        </ScrollView>
      </Animated.View>

      {wrongPress && mode === 'practice' && (
        <View style={styles.wrongRow}>
          <Ionicons name="close-circle-outline" size={18} color={COLORS.red} />
          <Text style={styles.wrongText}>Errado! Tente novamente.</Text>
        </View>
      )}

      {gameOver && (
        <View style={styles.gameOverContainer}>
          <Ionicons
            name="trophy"
            size={64}
            color={COLORS.gold}
            style={styles.gameOverLaurel}
          />
          <Text style={styles.gameOverTitle}>MUITO BEM!</Text>
          <Text style={styles.gameOverSubtitle}>Fim de Jogo</Text>
          <View style={styles.gameOverScoreBox}>
            <Text style={styles.gameOverScoreNumber}>{currentIndex}</Text>
            <Text style={styles.gameOverScoreLabel}>dígitos de π</Text>
          </View>

          {hintsUsed > 0 && (
            <View style={styles.infoRow}>
              <Ionicons name="bulb-outline" size={16} color={COLORS.blueMuted} />
              <Text style={styles.hintsUsedGameOver}>Dicas usadas: {hintsUsed}</Text>
            </View>
          )}
          {currentIndex >= highScore && currentIndex > 0 && (
            <View style={styles.infoRow}>
              <Ionicons name="sparkles-outline" size={16} color={COLORS.gold} />
              <Text style={styles.newRecordText}>Novo Recorde!</Text>
            </View>
          )}
          {highScore > 0 && currentIndex < highScore && (
            <View style={styles.infoRow}>
              <Ionicons name="trophy-outline" size={16} color={COLORS.goldMuted} />
              <Text style={styles.highScoreGameOver}>Recorde: {highScore}</Text>
            </View>
          )}
          {mode === 'timer' && wrongPress && (
            <Text style={styles.gameOverWrong}>
              Você errou! O correto era{' '}
              <Text style={{ color: COLORS.gold, fontWeight: 'bold' }}>
                {PI_DIGITS[currentIndex]}
              </Text>
            </Text>
          )}

          <View style={styles.gameOverButtons}>
            <TouchableOpacity
              style={styles.restartButton}
              onPress={handleRestart}
            >
              <Text style={styles.restartText}>Jogar Novamente</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shareButton}
              onPress={handleShareScore}
            >
              <Ionicons name="share-social-outline" size={20} color={COLORS.white} />
              <Text style={styles.shareText}>Compartilhar Recorde</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.homeText}>Menu</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {!gameOver && (
        <View style={styles.keyboard}>
          {[[1, 2, 3], [4, 5, 6], [7, 8, 9]].map((row, rowIndex) => (
            <View key={rowIndex} style={styles.keyboardRow}>
              {row.map((digit) => (
                <TouchableOpacity
                  key={digit}
                  style={[
                    styles.key,
                    dynamicStyles.key,
                    lastWrongKey === digit && wrongPress && styles.keyWrong,
                  ]}
                  onPress={() => handleDigitPress(digit)}
                  activeOpacity={0.6}
                >
                  <Text
                    style={[
                      styles.keyText,
                      lastWrongKey === digit && wrongPress && styles.keyTextWrong,
                    ]}
                  >
                    {digit}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
          <View style={styles.keyboardRow}>
            <TouchableOpacity
              style={[styles.key, dynamicStyles.key, styles.hintKey]}
              onPress={handleHint}
              activeOpacity={0.6}
            >
              <Text style={styles.hintKeyText}>Dica</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.key,
                dynamicStyles.key,
                lastWrongKey === 0 && wrongPress && styles.keyWrong,
              ]}
              onPress={() => handleDigitPress(0)}
              activeOpacity={0.6}
            >
              <Text
                style={[
                  styles.keyText,
                  lastWrongKey === 0 && wrongPress && styles.keyTextWrong,
                ]}
              >
                0
              </Text>
            </TouchableOpacity>
            <View style={[dynamicStyles.key, { opacity: 0 }]} />
          </View>
        </View>
      )}

      {mode === 'timer' && !started && !gameOver && (
        <Text style={styles.startHint}>
          Pressione qualquer número para começar!
        </Text>
      )}
    </SafeAreaView>
  );
}
