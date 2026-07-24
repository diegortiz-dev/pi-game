import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import StatsModal from '../components/StatsModal';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [statsVisible, setStatsVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Botão fixo no topo direito */}
      <View style={styles.headerRow}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1628',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 16,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 4,
    marginBottom: 0,
  },
  statsIconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#11243d',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ab8b0c',
  },
  statsBtnText: {
    color: '#ab8b0c',
    fontSize: 14,
    fontWeight: '600',
  },
  laurelContainer: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  appIcon: {
    width: 120,
    height: 120,
    borderRadius: 24,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: '#1e3a5f',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ab8b0c',
    marginBottom: 6,
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 15,
    color: '#8badc9',
    marginBottom: 6,
    textAlign: 'center',
  },
  greekQuote: {
    fontSize: 11,
    color: '#ab8b0c',
    marginBottom: 28,
    textAlign: 'center',
    fontStyle: 'italic',
    opacity: 0.65,
    paddingHorizontal: 8,
  },

  // ── Cards horizontais ──────────────────────────────────────
  buttonsContainer: {
    width: '100%',
    gap: 14,
  },
  modeCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1.5,
  },
  timerCard: {
    backgroundColor: '#0e1f36',
    borderColor: '#ab8b0c',
    // Sombra Android
    elevation: 6,
    // Sombra iOS
    shadowColor: '#ab8b0c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  practiceCard: {
    backgroundColor: '#0a1c30',
    borderColor: '#5b9bd5',
    elevation: 6,
    shadowColor: '#5b9bd5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  // ── Ícones laterais ─────────────────────────────────────────
  cardIconWrap: {
    width: 70,
    height: 70,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 1,
  },
  timerIconWrap: {
    backgroundColor: 'rgba(171, 139, 12, 0.1)',
    borderColor: 'rgba(171, 139, 12, 0.4)',
  },
  practiceIconWrap: {
    backgroundColor: 'rgba(91, 155, 213, 0.1)',
    borderColor: 'rgba(91, 155, 213, 0.4)',
  },

  // ── Texto central ────────────────────────────────────────────
  cardTextBlock: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  timerTitle: {
    color: '#ffffff',
  },
  practiceTitle: {
    color: '#ffffff',
  },
  cardDesc: {
    fontSize: 12,
    color: '#8badc9',
    lineHeight: 17,
  },

  // ── Badges de modo ───────────────────────────────────────────
  timerBadgeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(171, 139, 12, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(171, 139, 12, 0.4)',
  },
  timerBadgeLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ab8b0c',
  },
  practiceBadgeLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(91, 155, 213, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(91, 155, 213, 0.4)',
  },
  practiceBadgeLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5b9bd5',
  },

  // ── Chevron ──────────────────────────────────────────────────
  cardChevron: {
    marginLeft: 8,
    opacity: 0.8,
  },

  // ── Rodapé ───────────────────────────────────────────────────
  footerContainer: {
    alignItems: 'center',
    marginTop: 28,
    paddingVertical: 4,
  },
  footer: {
    fontSize: 12,
    color: '#4a6080',
    letterSpacing: 1,
  },
});
