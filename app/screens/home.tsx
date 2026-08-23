import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import StatsModal from '../components/StatsModal';
import SettingsModal from '../components/SettingsModal';
import { styles } from './home.styles';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [statsVisible, setStatsVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Botão fixo no topo direito */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.settingsIconBtn}
          onPress={() => setSettingsVisible(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={20} color="#8badc9" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.statsIconBtn}
          onPress={() => setStatsVisible(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="trophy-outline" size={20} color="#ab8b0c" />
          <Text style={styles.statsBtnText}>Conquistas</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

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

          {/* Botão Desafio — layout horizontal estilo Spotify/Netflix */}
          <TouchableOpacity
            style={[styles.modeCard, styles.timerCard]}
            onPress={() => navigation.navigate('Game', { mode: 'timer' })}
            activeOpacity={0.75}
          >
            {/* Badge com ícone à esquerda */}
            <View style={[styles.cardIconWrap, styles.timerIconWrap]}>
              <Ionicons name="hourglass" size={36} color="#ab8b0c" />
            </View>

            {/* Conteúdo textual */}
            <View style={styles.cardTextBlock}>
              <View style={styles.cardTitleRow}>
                <Text style={[styles.cardTitle, styles.timerTitle]}>Desafio</Text>
                <View style={styles.timerBadgeLabel}>
                  <Ionicons name="time-outline" size={12} color="#ab8b0c" />
                  <Text style={styles.timerBadgeLabelText}>60s</Text>
                </View>
              </View>
              <Text style={styles.cardDesc}>
                Acerte o máximo de dígitos antes do tempo acabar!
              </Text>
            </View>

            {/* Seta de ação */}
            <Ionicons name="chevron-forward" size={22} color="#ab8b0c" style={styles.cardChevron} />
          </TouchableOpacity>

          {/* Botão Prática — layout horizontal estilo Spotify/Netflix */}
          <TouchableOpacity
            style={[styles.modeCard, styles.practiceCard]}
            onPress={() => navigation.navigate('Game', { mode: 'practice' })}
            activeOpacity={0.75}
          >
            {/* Badge com ícone à esquerda */}
            <View style={[styles.cardIconWrap, styles.practiceIconWrap]}>
              <Ionicons name="book" size={36} color="#5b9bd5" />
            </View>

            {/* Conteúdo textual */}
            <View style={styles.cardTextBlock}>
              <View style={styles.cardTitleRow}>
                <Text style={[styles.cardTitle, styles.practiceTitle]}>Prática</Text>
                <View style={styles.practiceBadgeLabel}>
                  <Ionicons name="infinite-outline" size={12} color="#5b9bd5" />
                  <Text style={styles.practiceBadgeLabelText}>Livre</Text>
                </View>
              </View>
              <Text style={styles.cardDesc}>
                Pratique sem pressão e aprenda no seu ritmo!
              </Text>
            </View>

            {/* Seta de ação */}
            <Ionicons name="chevron-forward" size={22} color="#5b9bd5" style={styles.cardChevron} />
          </TouchableOpacity>
        </View>

        <View style={styles.footerContainer}>
          <Text style={styles.footer}>Feito por Diego Ortiz</Text>
        </View>
      </ScrollView>

      <StatsModal
        visible={statsVisible}
        onClose={() => setStatsVisible(false)}
      />
      <SettingsModal
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
    </SafeAreaView>
  );
}

// styles moved to home.styles.ts
