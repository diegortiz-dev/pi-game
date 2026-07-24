import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Vibration,
  useWindowDimensions,
  BackHandler,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types';

type GameScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Game'>;
  route: RouteProp<RootStackParamList, 'Game'>;
};

const COLORS = {
  bgDark: '#0a1628',
  bgCard: '#11243d',
  gold: '#ab8b0c',
  goldMuted: '#ab8b0c',
  goldDark: '#7a6308',
  blueLight: '#5b9bd5',
  blueMuted: '#8badc9',
  blueBorder: '#1e3a5f',
  white: '#ffffff',
  red: '#c0392b',
  redBg: '#3d1a1a',
  green: '#7ec87e',
  yellow: '#e6c84e',
};

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
  const scrollViewRef = useRef<ScrollView>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [started, setStarted] = useState(mode === 'practice');

  // Load high score on mount
  useEffect(() => {
    const key = mode === 'timer' ? HIGH_SCORE_KEY : HIGH_SCORE_PRACTICE_KEY;
    AsyncStorage.getItem(key).then((val) => {
      if (val) setHighScore(parseInt(val, 10));
    });
  }, [mode]);

  // Save high score and update cumulative total stats when game ends
  useEffect(() => {
    if (gameOver) {
      // Incrementar partidas jogadas
      AsyncStorage.getItem(TOTAL_GAMES_KEY).then((val) => {
        const total = val ? parseInt(val, 10) + 1 : 1;
        AsyncStorage.setItem(TOTAL_GAMES_KEY, total.toString());
      });

      // Incrementar total de dígitos digitados nesta sessão
      if (currentIndex > 0) {
        AsyncStorage.getItem(TOTAL_DIGITS_KEY).then((val) => {
          const total = val ? parseInt(val, 10) + currentIndex : currentIndex;
          AsyncStorage.setItem(TOTAL_DIGITS_KEY, total.toString());
        });
      }

      // Salvar recorde pessoal
      if (currentIndex > highScore) {
        const key = mode === 'timer' ? HIGH_SCORE_KEY : HIGH_SCORE_PRACTICE_KEY;
        setHighScore(currentIndex);
        AsyncStorage.setItem(key, currentIndex.toString());
        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch {}
      }
    }
  }, [gameOver]);

  // Android back button confirmation during active game
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
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      Vibration.vibrate(30);
    }
  };

  const triggerErrorHaptic = () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {
      Vibration.vibrate(200);
    }
  };

  const handleDigitPress = useCallback(
    (digit: number) => {
      if (gameOver) return;

      if (mode === 'timer' && !started) {
        setStarted(true);
      }

      const expectedDigit = parseInt(PI_DIGITS[currentIndex], 10);

      if (digit === expectedDigit) {
        triggerLightHaptic();
        setCorrectFlash(true);
        setTimeout(() => setCorrectFlash(false), 150);
        setWrongPress(false);
        setLastWrongKey(null);
        setCurrentIndex((prev) => prev + 1);

        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 50);
      } else {
        triggerErrorHaptic();
        setWrongPress(true);
        setLastWrongKey(digit);

        if (mode === 'timer') {
          if (timerRef.current) clearInterval(timerRef.current);
          setGameOver(true);
        }
      }
    },
    [currentIndex, gameOver, mode, started]
  );

  const handleHint = useCallback(() => {
    if (gameOver) return;

    if (mode === 'timer' && !started) {
      setStarted(true);
    }

    triggerLightHaptic();
    setCorrectFlash(true);
    setTimeout(() => setCorrectFlash(false), 150);
    setWrongPress(false);
    setLastWrongKey(null);
    setHintsUsed((prev) => prev + 1);
    setCurrentIndex((prev) => prev + 1);

    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 50);
  }, [currentIndex, gameOver, mode, started]);

  const handleRestart = () => {
    setCurrentIndex(0);
    setTimeLeft(TIMER_DURATION);
    setGameOver(false);
    setWrongPress(false);
    setLastWrongKey(null);
    setStarted(mode === 'practice');
    setHintsUsed(0);
    const key = mode === 'timer' ? HIGH_SCORE_KEY : HIGH_SCORE_PRACTICE_KEY;
    AsyncStorage.getItem(key).then((val) => {
      if (val) setHighScore(parseInt(val, 10));
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

  // Formata dígitos organizados em linhas e pequenos grupos
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

      <View
        style={[
          styles.piDisplayContainer,
          wrongPress && mode === 'practice' && styles.piDisplayWrong,
          correctFlash && styles.piDisplayCorrect,
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
      </View>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 6,
  },
  backButton: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backText: {
    color: COLORS.gold,
    fontSize: 16,
    fontWeight: '600',
  },
  timerContainer: {
    backgroundColor: COLORS.bgCard,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.goldDark,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  labelRowText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  scoreContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  scoreLabel: {
    color: COLORS.blueMuted,
    fontSize: 14,
    marginBottom: 4,
    letterSpacing: 1,
  },
  scoreValue: {
    color: COLORS.gold,
    fontSize: 48,
    fontWeight: 'bold',
  },
  highScoreText: {
    color: COLORS.goldMuted,
    fontSize: 14,
    marginTop: 4,
    opacity: 0.8,
  },
  hintsUsedText: {
    color: COLORS.blueMuted,
    fontSize: 13,
    marginTop: 2,
    opacity: 0.7,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  piDisplayContainer: {
    marginHorizontal: 16,
    backgroundColor: COLORS.bgCard,
    borderRadius: 12,
    padding: 16,
    flex: 1,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: COLORS.blueBorder,
  },
  piDisplayWrong: {
    borderColor: COLORS.red,
  },
  piDisplayCorrect: {
    borderColor: COLORS.gold,
  },
  piScroll: {
    flex: 1,
  },
  piScrollContent: {
    flexGrow: 1,
  },
  piPrefix: {
    fontSize: 22,
    color: COLORS.blueLight,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    lineHeight: 32,
  },
  piCursor: {
    fontSize: 22,
    color: COLORS.gold,
    fontFamily: 'monospace',
  },
  wrongText: {
    color: COLORS.red,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  wrongRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  keyboard: {
    paddingHorizontal: 25,
    gap: 15,
    paddingBottom: 16,
    marginTop: 'auto',
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  key: {
    borderRadius: 12,
    backgroundColor: COLORS.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.goldDark,
  },
  keyWrong: {
    borderColor: COLORS.red,
    backgroundColor: COLORS.redBg,
  },
  hintKey: {
    borderColor: COLORS.blueBorder,
    backgroundColor: COLORS.bgCard,
  },
  hintKeyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.blueLight,
  },
  keyText: {
    fontSize: 26,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  keyTextWrong: {
    color: COLORS.red,
  },
  startHint: {
    color: COLORS.goldMuted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
  gameOverContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 22, 40, 0.97)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    paddingHorizontal: 30,
  },
  gameOverLaurel: {
    marginBottom: 10,
  },
  gameOverTitle: {
    fontSize: 44,
    fontWeight: 'bold',
    color: COLORS.gold,
    marginBottom: 4,
    letterSpacing: 4,
  },
  gameOverSubtitle: {
    fontSize: 18,
    color: COLORS.blueMuted,
    marginBottom: 20,
  },
  gameOverScoreBox: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 2,
    borderColor: COLORS.gold,
    borderRadius: 12,
    paddingHorizontal: 40,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  gameOverScoreNumber: {
    fontSize: 56,
    fontWeight: 'bold',
    color: COLORS.gold,
  },
  gameOverScoreLabel: {
    fontSize: 14,
    color: COLORS.blueMuted,
    letterSpacing: 1,
  },
  gameOverWrong: {
    fontSize: 16,
    color: COLORS.red,
    marginBottom: 16,
    textAlign: 'center',
  },
  newRecordText: {
    fontSize: 20,
    color: COLORS.gold,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  highScoreGameOver: {
    fontSize: 16,
    color: COLORS.goldMuted,
    marginBottom: 12,
    opacity: 0.8,
  },
  hintsUsedGameOver: {
    fontSize: 15,
    color: COLORS.blueMuted,
    opacity: 0.8,
  },
  gameOverButtons: {
    gap: 12,
    width: '100%',
    marginTop: 16,
  },
  restartButton: {
    backgroundColor: COLORS.gold,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  restartText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.bgDark,
  },
  shareButton: {
    backgroundColor: COLORS.bgCard,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  shareText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  homeButton: {
    backgroundColor: COLORS.bgCard,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.blueBorder,
  },
  homeText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});
