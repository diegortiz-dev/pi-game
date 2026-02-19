import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};


export default function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

    

      <View style={styles.laurelContainer}>
        <Image
          source={require('../../assets/iconeprincipal.png')}
          style={styles.appIcon}
        />
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
          <Text style={styles.modeTitle}>Prática</Text>
          <Text style={styles.modeDescription}>
            Sem tempo limite. Pratique no seu ritmo!
          </Text>
        </TouchableOpacity>
      </View>

 
      <View style={styles.footerContainer}>
    
        <Text style={styles.footer}>Feito por Diego Ortiz</Text>
      </View>
    </SafeAreaView>
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
  laurelContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 12,
  },
  appIcon: {
    width: 150,
    height: 150,
    borderRadius: 28,
    resizeMode: 'cover',
  
  },
  title: {
    fontSize: 40,
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
    borderRadius: 12,
    alignItems: 'center',
    paddingBottom: 20,
  },
  timerButton: {
    backgroundColor: '#11243d',
    borderWidth: 1,
    borderColor: '#ab8b0c',
  },
  practiceButton: {
    backgroundColor: '#11243d',
    borderWidth: 1,
    borderColor: '#5b9bd5',
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
    alignItems: 'center',
    marginTop: 14,
    paddingVertical: 4,
    marginBottom: 10,
  },
  footer: {
    fontSize: 12,
    color: '#4a6080',
    letterSpacing: 1,
    marginTop: 2,
  },
});
