import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { loadProgress, EMPTY_PROGRESS, type Progress } from '../storage/progress';
import { evaluate, type EvaluatedAchievement } from '../data/achievements';
import { palette } from '../theme';
import { useT } from '../hooks/useSettings';
import type { StringKey } from '../i18n';
import { styles } from './StatsModal.styles';
import PiText from './PiText';

/**
 * Estatísticas e conquistas.
 *
 * A lista vem inteira de app/data/achievements. Antes este arquivo carregava a
 * própria cópia das nove conquistas, com os limiares escritos por extenso, e o
 * jogo carregava outra — duas verdades para a mesma regra.
 */

type Props = {
  visible: boolean;
  onClose: () => void;
};

type Filter = 'all' | 'unlocked' | 'locked';

const FILTERS: { id: Filter; label: StringKey }[] = [
  { id: 'all', label: 'stats.filter.all' },
  { id: 'unlocked', label: 'stats.filter.unlocked' },
  { id: 'locked', label: 'stats.filter.locked' },
];

function AchievementRow({ item }: { item: EvaluatedAchievement }) {
  const t = useT();
  const title = t(item.titleKey);
  const description = t(item.descriptionKey);

  return (
    <View
      style={[styles.card, item.unlocked ? styles.cardUnlocked : styles.cardLocked]}
      accessibilityRole="text"
      accessibilityLabel={
        item.unlocked
          ? t('stats.a11y.unlocked', { title, description })
          : t('stats.a11y.locked', {
              title,
              description,
              current: item.current,
              target: item.target,
            })
      }
    >
      <View style={[styles.cardIcon, item.unlocked && styles.cardIconUnlocked]}>
        <Ionicons
          name={item.icon}
          size={20}
          color={item.unlocked ? palette.gold.bright : palette.text.tertiary}
        />
      </View>

      <View style={styles.cardBody}>
        <View style={styles.cardTitleRow}>
          <PiText style={[styles.cardTitle, !item.unlocked && styles.cardTitleLocked]}>
            {title}
          </PiText>
          <Text style={styles.cardMetric}>
            {Math.min(item.current, item.target)}/{item.target} {t(item.unitKey)}
          </Text>
        </View>
        <PiText style={styles.cardDescription}>{description}</PiText>
        <View style={styles.track}>
          <View
            style={[
              styles.trackFill,
              item.unlocked ? styles.trackFillDone : styles.trackFillPending,
              { width: `${item.ratio * 100}%` },
            ]}
          />
        </View>
      </View>

      <Ionicons
        name={item.unlocked ? 'checkmark-circle' : 'lock-closed-outline'}
        size={18}
        color={item.unlocked ? palette.accent.success : palette.text.tertiary}
      />
    </View>
  );
}

export default function StatsModal({ visible, onClose }: Props) {
  const t = useT();
  const [progress, setProgress] = useState<Progress>(EMPTY_PROGRESS);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    if (!visible) return;
    let active = true;
    loadProgress().then((loaded) => {
      if (active) setProgress(loaded);
    });
    return () => {
      active = false;
    };
  }, [visible]);

  const achievements = evaluate(progress);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const overall = Math.round((unlockedCount / achievements.length) * 100);

  const visibleAchievements = achievements.filter((a) =>
    filter === 'unlocked' ? a.unlocked : filter === 'locked' ? !a.unlocked : true
  );

  const summary: { value: number; label: StringKey }[] = [
    { value: progress.bestChallenge, label: 'stats.bestChallenge' },
    { value: progress.bestPractice, label: 'stats.bestPractice' },
    { value: progress.bestStreak, label: 'stats.bestStreak' },
    { value: progress.masteredBlocks * 10, label: 'stats.mastered' },
    { value: progress.totalGames, label: 'stats.games' },
    { value: progress.totalDigits, label: 'stats.digits' },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.scrim}>
        <SafeAreaView style={styles.sheet} edges={['bottom']}>
          <View style={styles.grabber} />

          <View style={styles.header}>
            <Text style={styles.title}>{t('stats.title')}</Text>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={t('common.close')}
              hitSlop={12}
              style={({ pressed }) => [styles.close, pressed && styles.pressed]}
            >
              <Ionicons name="close" size={20} color={palette.text.secondary} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
            <View style={styles.summary}>
              {summary.map((item) => (
                <View key={item.label} style={styles.summaryCell}>
                  <Text style={styles.summaryValue}>{item.value}</Text>
                  <Text style={styles.summaryLabel}>{t(item.label)}</Text>
                </View>
              ))}
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {t('stats.achievements', {
                  n: unlockedCount,
                  total: achievements.length,
                })}
              </Text>
              <Text style={styles.sectionPercent}>{overall}%</Text>
            </View>

            <View style={styles.track}>
              <View
                style={[styles.trackFill, styles.trackFillDone, { width: `${overall}%` }]}
              />
            </View>

            <View style={styles.filters}>
              {FILTERS.map((item) => {
                const active = filter === item.id;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => setFilter(item.id)}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={t(item.label)}
                    style={[styles.filter, active && styles.filterActive]}
                  >
                    <Text style={[styles.filterText, active && styles.filterTextActive]}>
                      {t(item.label)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {visibleAchievements.length === 0 ? (
              <Text style={styles.empty}>
                {t(filter === 'unlocked' ? 'stats.empty.unlocked' : 'stats.empty.locked')}
              </Text>
            ) : (
              <View style={styles.list}>
                {visibleAchievements.map((item) => (
                  <AchievementRow key={item.id} item={item} />
                ))}
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
