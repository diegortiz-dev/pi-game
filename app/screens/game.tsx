import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
  Vibration,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  Game: { mode: 'timer' | 'practice' };
};

type GameScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Game'>;
  route: RouteProp<RootStackParamList, 'Game'>;
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

const { width } = Dimensions.get('window');
const KEY_SIZE = (width - 80) / 5;
const TIMER_DURATION = 60;

export default function GameScreen({ navigation, route }: GameScreenProps) {
  const { mode } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [wrongPress, setWrongPress] = useState(false);
  const [lastWrongKey, setLastWrongKey] = useState<number | null>(null);
  const [correctFlash, setCorrectFlash] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [started, setStarted] = useState(mode === 'practice');

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

  const handleDigitPress = useCallback(
    (digit: number) => {
      if (gameOver) return;

   
      if (mode === 'timer' && !started) {
        setStarted(true);
      }

      const expectedDigit = parseInt(PI_DIGITS[currentIndex], 10);

      if (digit === expectedDigit) {
        
        setCorrectFlash(true);
        setTimeout(() => setCorrectFlash(false), 150);
        setWrongPress(false);
        setLastWrongKey(null);
        setCurrentIndex((prev) => prev + 1);

        
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 50);
      } else {
        
        Vibration.vibrate(200);
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

  const handleRestart = () => {
    setCurrentIndex(0);
    setTimeLeft(TIMER_DURATION);
    setGameOver(false);
    setWrongPress(false);
    setLastWrongKey(null);
    setStarted(mode === 'practice');
  };

  const revealedDigits = PI_DIGITS.substring(0, currentIndex);
  const timerColor =
    timeLeft > 30 ? '#51cf66' : timeLeft > 10 ? '#ffd43b' : '#ff6b6b';

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.modeLabel}>
          {mode === 'timer' ? '⏱️ Timer' : '📝 Prática'}
        </Text>

        {mode === 'timer' && (
          <View style={styles.timerContainer}>
            <Text style={[styles.timerText, { color: timerColor }]}>
              {timeLeft}s
            </Text>
          </View>
        )}
      </View>

    
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>Dígitos</Text>
        <Text style={styles.scoreValue}>{currentIndex}</Text>
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
          <Text style={styles.piText}>
            <Text style={styles.piPrefix}>3.</Text>
            <Text style={styles.piDigits}>{revealedDigits}</Text>
            <Text style={styles.piCursor}>|</Text>
          </Text>
        </ScrollView>
      </View>

      {wrongPress && mode === 'practice' && (
        <Text style={styles.wrongText}>
          ✗ Errado! Tente novamente.
        </Text>
      )}

     
      {gameOver && (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverTitle}>Fim de Jogo!</Text>
          <Text style={styles.gameOverScore}>
            Você acertou {currentIndex} dígitos de π
          </Text>
          {mode === 'timer' && wrongPress && (
            <Text style={styles.gameOverWrong}>
              Você errou o dígito! O correto era{' '}
              <Text style={{ color: '#51cf66', fontWeight: 'bold' }}>
                {PI_DIGITS[currentIndex]}
              </Text>
            </Text>
          )}
          <View style={styles.gameOverButtons}>
            <TouchableOpacity
              style={styles.restartButton}
              onPress={handleRestart}
            >
              <Text style={styles.restartText}>🔄 Jogar Novamente</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.homeText}>🏠 Menu</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      
      {!gameOver && (
        <View style={styles.keyboard}>
          <View style={styles.keyboardRow}>
            {[1, 2, 3, 4, 5].map((digit) => (
              <TouchableOpacity
                key={digit}
                style={[
                  styles.key,
                  lastWrongKey === digit && wrongPress && styles.keyWrong,
                ]}
                onPress={() => handleDigitPress(digit)}
                activeOpacity={0.6}
              >
                <Text style={styles.keyText}>{digit}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.keyboardRow}>
            {[6, 7, 8, 9, 0].map((digit) => (
              <TouchableOpacity
                key={digit}
                style={[
                  styles.key,
                  lastWrongKey === digit && wrongPress && styles.keyWrong,
                ]}
                onPress={() => handleDigitPress(digit)}
                activeOpacity={0.6}
              >
                <Text style={styles.keyText}>{digit}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      
      {mode === 'timer' && !started && !gameOver && (
        <Text style={styles.startHint}>
          Pressione qualquer número para começar!
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0c29',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: '#24c6dc',
    fontSize: 16,
    fontWeight: '600',
  },
  modeLabel: {
    color: '#a0a0c0',
    fontSize: 16,
    fontWeight: '600',
  },
  timerContainer: {
    backgroundColor: '#1a1a4e',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scoreContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  scoreLabel: {
    color: '#a0a0c0',
    fontSize: 14,
    marginBottom: 4,
  },
  scoreValue: {
    color: '#24c6dc',
    fontSize: 48,
    fontWeight: 'bold',
  },
  piDisplayContainer: {
    marginHorizontal: 20,
    backgroundColor: '#1a1a4e',
    borderRadius: 16,
    padding: 20,
    minHeight: 120,
    maxHeight: 180,
    borderWidth: 2,
    borderColor: '#302b63',
  },
  piDisplayWrong: {
    borderColor: '#ff6b6b',
  },
  piDisplayCorrect: {
    borderColor: '#51cf66',
  },
  piScroll: {
    flex: 1,
  },
  piScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  piText: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  piPrefix: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  piDigits: {
    fontSize: 28,
    color: '#24c6dc',
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  piCursor: {
    fontSize: 28,
    color: '#ff6b6b',
    fontFamily: 'monospace',
  },
  wrongText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '600',
  },
  keyboard: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    gap: 12,
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  key: {
    width: KEY_SIZE,
    height: KEY_SIZE,
    borderRadius: KEY_SIZE / 2,
    backgroundColor: '#302b63',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#4a4580',
  },
  keyWrong: {
    borderColor: '#ff6b6b',
    backgroundColor: '#4a1a2e',
  },
  keyText: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  startHint: {
    color: '#ffd43b',
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
    backgroundColor: 'rgba(15, 12, 41, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    paddingHorizontal: 30,
  },
  gameOverTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  gameOverScore: {
    fontSize: 20,
    color: '#24c6dc',
    marginBottom: 10,
    textAlign: 'center',
  },
  gameOverWrong: {
    fontSize: 16,
    color: '#ff6b6b',
    marginBottom: 30,
    textAlign: 'center',
  },
  gameOverButtons: {
    gap: 14,
    width: '100%',
    marginTop: 20,
  },
  restartButton: {
    backgroundColor: '#24c6dc',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  restartText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f0c29',
  },
  homeButton: {
    backgroundColor: '#302b63',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4a4580',
  },
  homeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
});
