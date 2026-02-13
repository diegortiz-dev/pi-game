import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
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

    

      <View style={styles.laurelContainer}>
        <View style={styles.piCircle}>
          <Text style={styles.piSymbol}>π</Text>
        </View>
        
      </View>

      <Text style={styles.title}>π- O jogo</Text>
      <Text style={styles.subtitle}>
        Quantos dígitos de π você conhece?
      </Text>
      <Text style={styles.greekQuote}>
        «Ἀεὶ ὁ θεὸς ὁ μέγας γεωμετρεῖ τὸ σύμπαν» — O grande Deus sempre aplica a geometria ao universo
      </Text>

    
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.modeButton, styles.timerButton]}
          onPress={() => navigation.navigate('Game', { mode: 'timer' })}
          activeOpacity={0.8}
        >
          <Image
            source={require('../../assets/ampulheta.png')}
            style={styles.modeIcon}
          />
          <Text style={styles.modeTitle}>Desafio</Text>
          <Text style={styles.modeDescription}>
            60 segundos para acertar o máximo de dígitos!
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeButton, styles.practiceButton]}
          onPress={() => navigation.navigate('Game', { mode: 'practice' })}
          activeOpacity={0.8}
        >
          <Image
            source={require('../../assets/livro.png')}
            style={styles.modeIcon}
          />
          <Text style={styles.modeTitle}> Prática</Text>
          <Text style={styles.modeDescription}>
            Sem tempo limite. Pratique no seu ritmo!
          </Text>
        </TouchableOpacity>
      </View>

 
      <View style={styles.footerContainer}>
    
        <Text style={styles.footer}>3.14159265358979323846...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1628',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  meander: {
    fontSize: 14,
    color: '#ab8b0c',
    letterSpacing: 4,
    marginVertical: 8,
    opacity: 0.7,
  },
  laurelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  laurelLeft: {
    fontSize: 36,
    opacity: 0.8,
  },
  laurelRight: {
    fontSize: 36,
    opacity: 0.8,
  },
  piCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#11243d',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#ab8b0c',
    shadowColor: '#ab8b0c',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  piSymbol: {
    fontSize: 64,
    color: '#ab8b0c',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#ab8b0c',
    marginBottom: 6,
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 16,
    color: '#8badc9',
    marginBottom: 6,
    textAlign: 'center',
  },
  greekQuote: {
    fontSize: 12,
    color: '#ab8b0c',
    marginBottom: 40,
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.7,
  },
  buttonsContainer: {
    width: '100%',
    gap: 16,
  },
  modeButton: {
    width: '100%',
    paddingVertical: 24,
    paddingHorizontal: 24,
    borderRadius: 4,
    alignItems: 'center',
  },
  timerButton: {
    backgroundColor: '#11243d',
    borderWidth: 1.5,
    borderColor: '#ab8b0c',
  },
  practiceButton: {
    backgroundColor: '#11243d',
    borderWidth: 1.5,
    borderColor: '#5b9bd5',
  },
  modeEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  modeIcon: {
    width: 150,
    height:80,
    marginBottom: 8,
    resizeMode: 'contain',
  },
  modeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
    letterSpacing: 1,
  },
  modeDescription: {
    fontSize: 13,
    color: '#8badc9',
    textAlign: 'center',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
  },
  footer: {
    fontSize: 13,
    color: '#2a4060',
    letterSpacing: 2,
    marginTop: 4,
  },
});
