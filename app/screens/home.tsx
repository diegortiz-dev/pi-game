import React, { useCallback, useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types';
import { loadProgress, EMPTY_PROGRESS, type Progress } from '../storage/progress';
import { evaluate, nextInTrack } from '../data/achievements';
import { CHALLENGE_MS, ERROR_PENALTY_MS } from '../hooks/useGameEngine';
import BrandMark from '../components/BrandMark';
import PiText from '../components/PiText';
import StatsModal from '../components/StatsModal';
import SettingsModal from '../components/SettingsModal';
import { palette } from '../theme';
import { useT } from '../hooks/useSettings';
import { styles } from './home.styles';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
  const t = useT();
  const [statsOpen, setStatsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [progress, setProgress] = useState<Progress>(EMPTY_PROGRESS);

  // Recarrega ao voltar de uma partida, para o recorde aparecer atualizado.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      loadProgress().then((loaded) => {
        if (active) setProgress(loaded);
      });
      return () => {
        active = false;
      };
    }, [])
  );

  const achievements = evaluate(progress);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const challengeSeconds = CHALLENGE_MS / 1000;

  const best = progress.bestChallenge;
  const started = best > 0;
  const goal = nextInTrack(progress, 'challenge');
  const remaining = goal ? goal.target - best : 0;
  const masteredDigits = progress.masteredBlocks * 10;

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Pressable
          onPress={() => setSettingsOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={t('home.a11y.settings')}
          style={({ pressed }) => [styles.headerIcon, pressed && styles.pressed]}
        >
          <Ionicons name="settings-outline" size={22} color={palette.text.secondary} />
        </Pressable>

        <Pressable
          onPress={() => setStatsOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={t('home.a11y.achievements', {
            n: unlockedCount,
            total: achievements.length,
          })}
          style={({ pressed }) => [styles.headerButton, pressed && styles.pressed]}
        >
          <Ionicons name="trophy-outline" size={20} color={palette.gold.base} />
          <Text style={styles.headerButtonText}>
            {unlockedCount}/{achievements.length}
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/*
          A composição é centrada porque o herói é um disco: centralizar segue a
          forma do próprio elemento.
        */}
        <View style={styles.hero}>
          <BrandMark />

          {started ? (
            <View style={styles.readout}>
              <Text style={styles.record}>{best}</Text>
              <Text style={styles.recordLabel}>
                {t(best === 1 ? 'home.record.one' : 'home.record.other')}
              </Text>
              {goal && (
                <PiText style={styles.goal}>
                  {t(remaining === 1 ? 'home.goal.one' : 'home.goal.other', {
                    n: remaining,
                    title: t(goal.titleKey),
                  })}
                </PiText>
              )}
            </View>
          ) : (
            <View style={styles.readout}>
              <PiText style={styles.tagline}>{t('home.tagline')}</PiText>
            </View>
          )}
        </View>

        {/*
          Aprender vem primeiro de propósito: é a porta de entrada. Quem ainda
          não sabe nenhum dígito não tem o que fazer no Desafio, e mandar essa
          pessoa direto para o cronômetro é oferecer só a derrota.
        */}
        <View style={styles.modes}>
          <Pressable
            onPress={() => navigation.navigate('Learn')}
            accessibilityRole="button"
            accessibilityLabel={
              masteredDigits === 0
                ? t('home.a11y.learn.fresh')
                : t('home.a11y.learn.progress', { n: masteredDigits })
            }
            style={({ pressed }) => [styles.mode, pressed && styles.modePressed]}
          >
            <Ionicons name="school-outline" size={26} color={palette.gold.bright} />
            <Text style={styles.modeTitle}>{t('home.learn')}</Text>
            <Text style={styles.modeMeta}>
              {masteredDigits === 0
                ? t('home.learn.fresh')
                : t('home.learn.progress', { n: masteredDigits })}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={palette.text.tertiary} />
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate('Game', { mode: 'timer' })}
            accessibilityRole="button"
            accessibilityLabel={t('home.a11y.challenge', {
              seconds: challengeSeconds,
              penalty: ERROR_PENALTY_MS / 1000,
            })}
            style={({ pressed }) => [
              styles.mode,
              styles.modeDivided,
              pressed && styles.modePressed,
            ]}
          >
            <Ionicons name="timer-outline" size={26} color={palette.text.secondary} />
            <Text style={styles.modeTitle}>{t('home.challenge')}</Text>
            <Text style={styles.modeMeta}>{challengeSeconds}s</Text>
            <Ionicons name="chevron-forward" size={20} color={palette.text.tertiary} />
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate('Game', { mode: 'practice' })}
            accessibilityRole="button"
            accessibilityLabel={t('home.a11y.practice')}
            style={({ pressed }) => [
              styles.mode,
              styles.modeDivided,
              pressed && styles.modePressed,
            ]}
          >
            <Ionicons name="infinite-outline" size={26} color={palette.text.secondary} />
            <Text style={styles.modeTitle}>{t('home.practice')}</Text>
            <Text style={styles.modeMeta}>{t('home.practice.meta')}</Text>
            <Ionicons name="chevron-forward" size={20} color={palette.text.tertiary} />
          </Pressable>
        </View>

        <Text style={styles.credit}>{t('home.credit')}</Text>
      </ScrollView>

      <StatsModal visible={statsOpen} onClose={() => setStatsOpen(false)} />
      <SettingsModal visible={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </SafeAreaView>
  );
}
