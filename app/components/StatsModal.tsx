import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './StatsModal.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

type StatsModalProps = {
  visible: boolean;
  onClose: () => void;
};

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  unlocked: boolean;
};

const HIGH_SCORE_KEY = '@pi_game_high_score';
const HIGH_SCORE_PRACTICE_KEY = '@pi_game_high_score_practice';
const TOTAL_DIGITS_KEY = '@pi_game_total_digits';
const TOTAL_GAMES_KEY = '@pi_game_total_games';

export default function StatsModal({ visible, onClose }: StatsModalProps) {
  const [timerScore, setTimerScore] = useState(0);
  const [practiceScore, setPracticeScore] = useState(0);
  const [totalDigits, setTotalDigits] = useState(0);
  const [totalGames, setTotalGames] = useState(0);

  useEffect(() => {
    if (visible) {
      loadStats();
    }
  }, [visible]);

  const loadStats = async () => {
    try {
      const [tScore, pScore, tDigits, tGames] = await Promise.all([
        AsyncStorage.getItem(HIGH_SCORE_KEY),
        AsyncStorage.getItem(HIGH_SCORE_PRACTICE_KEY),
        AsyncStorage.getItem(TOTAL_DIGITS_KEY),
        AsyncStorage.getItem(TOTAL_GAMES_KEY),
      ]);

      setTimerScore(tScore ? parseInt(tScore, 10) : 0);
      setPracticeScore(pScore ? parseInt(pScore, 10) : 0);
      setTotalDigits(tDigits ? parseInt(tDigits, 10) : 0);
      setTotalGames(tGames ? parseInt(tGames, 10) : 0);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const bestOverall = Math.max(timerScore, practiceScore);

  const achievements: Achievement[] = [
    {
      id: 'first_step',
      title: 'Primeiro Passo',
      description: 'Chegue a 5 dígitos de π',
      icon: 'footsteps-outline',
      unlocked: bestOverall >= 5,
    },
    {
      id: 'apprentice',
      title: 'Aprendiz de Arquimedes',
      description: 'Chegue a 15 dígitos de π',
      icon: 'school-outline',
      unlocked: bestOverall >= 15,
    },
    {
      id: 'geometer',
      title: 'Geômetra',
      description: 'Chegue a 30 dígitos de π',
      icon: 'shapes-outline',
      unlocked: bestOverall >= 30,
    },
    {
      id: 'pi_master',
      title: 'Mestre do π',
      description: 'Chegue a 50 dígitos de π',
      icon: 'ribbon-outline',
      unlocked: bestOverall >= 50,
    },
    {
      id: 'circle_legend',
      title: 'Lenda do Círculo',
      description: 'Chegue a 100 dígitos de π',
      icon: 'trophy-outline',
      unlocked: bestOverall >= 100,
    },
    {
      id: 'speedster',
      title: 'Velocista',
      description: 'Acerte 20 dígitos no modo Desafio',
      icon: 'flash-outline',
      unlocked: timerScore >= 20,
    },
    {
      id: 'practice_scholar',
      title: 'Estudioso',
      description: 'Acerte 15 dígitos no modo Prática',
      icon: 'book-outline',
      unlocked: practiceScore >= 15,
    },
    {
      id: 'dedicated_player',
      title: 'Dedicado',
      description: 'Jogue 10 partidas no total',
      icon: 'game-controller-outline',
      unlocked: totalGames >= 10,
    },
    {
      id: 'digit_master',
      title: 'Contador de π',
      description: 'Digite 100 dígitos no total',
      icon: 'calculator-outline',
      unlocked: totalDigits >= 100,
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Ionicons name="stats-chart" size={24} color="#ab8b0c" />
              <Text style={styles.title}>Estatísticas & Conquistas</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#8badc9" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Cards de Estatísticas */}
            <Text style={styles.sectionHeader}>Resumo de Desempenho</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Ionicons name="hourglass" size={22} color="#ab8b0c" />
                <Text style={styles.statNumber}>{timerScore}</Text>
                <Text style={styles.statLabel}>Recorde Desafio</Text>
              </View>

              <View style={styles.statCard}>
                <Ionicons name="book" size={22} color="#5b9bd5" />
                <Text style={styles.statNumber}>{practiceScore}</Text>
                <Text style={styles.statLabel}>Recorde Prática</Text>
              </View>

              <View style={styles.statCard}>
                <Ionicons name="calculator" size={22} color="#7ec87e" />
                <Text style={styles.statNumber}>{totalDigits}</Text>
                <Text style={styles.statLabel}>Total Pressionado</Text>
              </View>

              <View style={styles.statCard}>
                <Ionicons name="game-controller" size={22} color="#e6c84e" />
                <Text style={styles.statNumber}>{totalGames}</Text>
                <Text style={styles.statLabel}>Partidas Jogadas</Text>
              </View>
            </View>

            {/* Progresso de Conquistas */}
            <View style={styles.achievementProgressHeader}>
              <Text style={styles.sectionHeader}>Conquistas ({unlockedCount}/{achievements.length})</Text>
              <Text style={styles.progressPercent}>
                {Math.round((unlockedCount / achievements.length) * 100)}%
              </Text>
            </View>

            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${(unlockedCount / achievements.length) * 100}%` },
                ]}
              />
            </View>

            {/* Lista de Conquistas */}
            <View style={styles.achievementsList}>
              {achievements.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.achievementCard,
                    item.unlocked ? styles.achievementUnlocked : styles.achievementLocked,
                  ]}
                >
                  <View
                    style={[
                      styles.iconCircle,
                      item.unlocked ? styles.iconCircleUnlocked : styles.iconCircleLocked,
                    ]}
                  >
                    <Ionicons
                      name={item.icon}
                      size={24}
                      color={item.unlocked ? '#ab8b0c' : '#4a6080'}
                    />
                  </View>
                  <View style={styles.achievementInfo}>
                    <Text
                      style={[
                        styles.achievementTitle,
                        !item.unlocked && styles.textLocked,
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Text style={styles.achievementDesc}>{item.description}</Text>
                  </View>
                  {item.unlocked ? (
                    <Ionicons name="checkmark-circle" size={22} color="#7ec87e" />
                  ) : (
                    <Ionicons name="lock-closed" size={20} color="#4a6080" />
                  )}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// styles moved to StatsModal.styles.ts
