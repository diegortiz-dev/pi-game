import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Game: { mode: 'timer' | 'practice' };
};

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

     
      <View style={styles.piCircle}>
        <Text style={styles.piSymbol}>π</Text>
      </View>

      <Text style={styles.title}>Pi Game</Text>
      <Text style={styles.subtitle}>Quantos dígitos de π você conhece?</Text>

     
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.modeButton, styles.timerButton]}
          onPress={() => navigation.navigate('Game', { mode: 'timer' })}
          activeOpacity={0.8}
        >
          <Text style={styles.modeEmoji}>⏱️</Text>
          <Text style={styles.modeTitle}>Modo Timer</Text>
          <Text style={styles.modeDescription}>
            60 segundos para acertar o máximo de dígitos!
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeButton, styles.practiceButton]}
          onPress={() => navigation.navigate('Game', { mode: 'practice' })}
          activeOpacity={0.8}
        >
          <Text style={styles.modeEmoji}>📝</Text>
          <Text style={styles.modeTitle}>Modo Prática</Text>
          <Text style={styles.modeDescription}>
            Sem tempo limite. Pratique no seu ritmo!
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>3.14159265358979323846...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0c29',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  piCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#302b63',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#24c6dc',
    shadowColor: '#24c6dc',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  piSymbol: {
    fontSize: 64,
    color: '#24c6dc',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#a0a0c0',
    marginBottom: 50,
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    gap: 16,
  },
  modeButton: {
    width: '100%',
    paddingVertical: 24,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  timerButton: {
    backgroundColor: '#1a1a4e',
    borderWidth: 1.5,
    borderColor: '#ff6b6b',
  },
  practiceButton: {
    backgroundColor: '#1a1a4e',
    borderWidth: 1.5,
    borderColor: '#51cf66',
  },
  modeEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  modeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
  },
  modeDescription: {
    fontSize: 14,
    color: '#a0a0c0',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    fontSize: 14,
    color: '#3a3a5c',
    letterSpacing: 2,
  },
});
