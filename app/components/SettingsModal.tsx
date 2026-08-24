import React from 'react';
import { Modal, View, Text, Pressable, Switch, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useSettings } from '../hooks/useSettings';
import { resetProgress } from '../storage/progress';
import type { BooleanSetting } from '../storage/settings';
import type { LanguagePreference, StringKey } from '../i18n';
import { palette } from '../theme';
import { styles } from './SettingsModal.styles';
import PiText from './PiText';

/**
 * Preferências do app.
 *
 * As chaves usam o Switch do React Native em vez de um interruptor montado à
 * mão com Views, como na versão anterior. O componente nativo já vem com o
 * comportamento de acessibilidade certo, com a animação da plataforma e com o
 * alvo de toque no tamanho esperado.
 */

type Props = {
  visible: boolean;
  onClose: () => void;
};

type Option = {
  key: BooleanSetting;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: StringKey;
  description: StringKey;
};

const OPTIONS: Option[] = [
  {
    key: 'sfx',
    icon: 'volume-high-outline',
    title: 'settings.sfx',
    description: 'settings.sfx.desc',
  },
  {
    key: 'haptics',
    icon: 'phone-portrait-outline',
    title: 'settings.haptics',
    description: 'settings.haptics.desc',
  },
  {
    key: 'shake',
    icon: 'move-outline',
    title: 'settings.shake',
    description: 'settings.shake.desc',
  },
];

const LANGUAGES: { value: LanguagePreference; label: StringKey }[] = [
  { value: 'auto', label: 'settings.language.auto' },
  { value: 'pt', label: 'settings.language.pt' },
  { value: 'en', label: 'settings.language.en' },
];

export default function SettingsModal({ visible, onClose }: Props) {
  const { settings, toggle, setLanguage, reduceMotion, t } = useSettings();
  const version = Constants.expoConfig?.version ?? '1.0.0';

  const confirmReset = () => {
    Alert.alert(t('settings.reset.title'), t('settings.reset.body'), [
      { text: t('settings.reset.cancel'), style: 'cancel' },
      {
        text: t('settings.reset.confirm'),
        style: 'destructive',
        onPress: () => {
          void resetProgress();
          onClose();
        },
      },
    ]);
  };

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
            <Text style={styles.title}>{t('settings.title')}</Text>
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
            <View style={styles.group}>
              {OPTIONS.map((option, index) => (
                <View
                  key={option.key}
                  style={[styles.option, index > 0 && styles.optionDivided]}
                >
                  <View style={styles.optionIcon}>
                    <Ionicons name={option.icon} size={19} color={palette.gold.base} />
                  </View>
                  <View style={styles.optionText}>
                    <Text style={styles.optionTitle}>{t(option.title)}</Text>
                    <Text style={styles.optionDescription}>{t(option.description)}</Text>
                  </View>
                  <Switch
                    value={settings[option.key]}
                    onValueChange={() => toggle(option.key)}
                    accessibilityLabel={t(option.title)}
                    trackColor={{ false: palette.ink[600], true: palette.gold.dim }}
                    thumbColor={
                      settings[option.key] ? palette.gold.bright : palette.text.tertiary
                    }
                    ios_backgroundColor={palette.ink[600]}
                  />
                </View>
              ))}
            </View>

            {/*
              O tremor pode estar desligado pelo sistema mesmo com a chave acima
              ligada. Dizer isso evita que a chave pareça quebrada.
            */}
            {reduceMotion && settings.shake && (
              <Text style={styles.note}>{t('settings.reduceMotion')}</Text>
            )}

            <View style={styles.languageGroup}>
              <Text style={styles.languageLabel}>{t('settings.language')}</Text>
              <View style={styles.segmented}>
                {LANGUAGES.map((item) => {
                  const active = settings.language === item.value;
                  return (
                    <Pressable
                      key={item.value}
                      onPress={() => setLanguage(item.value)}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: active }}
                      accessibilityLabel={t(item.label)}
                      style={[styles.segment, active && styles.segmentActive]}
                    >
                      <Text
                        style={[styles.segmentText, active && styles.segmentTextActive]}
                      >
                        {t(item.label)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <Pressable
              onPress={confirmReset}
              accessibilityRole="button"
              accessibilityLabel={t('settings.reset')}
              style={({ pressed }) => [styles.danger, pressed && styles.pressed]}
            >
              <Ionicons name="trash-outline" size={17} color={palette.accent.danger} />
              <Text style={styles.dangerText}>{t('settings.reset')}</Text>
            </Pressable>

            <Text style={styles.footer}>{t('settings.footer')}</Text>
            <PiText style={styles.footer}>{t('settings.version', { v: version })}</PiText>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
