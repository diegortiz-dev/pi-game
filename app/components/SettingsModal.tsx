import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './SettingsModal.styles';

export const SFX_KEY = '@pi_game_sfx_enabled';
export const HAPTICS_KEY = '@pi_game_haptics_enabled';
export const SHAKE_KEY = '@pi_game_shake_enabled';

type SettingsModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [shakeEnabled, setShakeEnabled] = useState(true);

  useEffect(() => {
    if (visible) {
      loadSettings();
    }
  }, [visible]);

  const loadSettings = async () => {
    try {
      const [sfxVal, hapticsVal, shakeVal] = await Promise.all([
        AsyncStorage.getItem(SFX_KEY),
        AsyncStorage.getItem(HAPTICS_KEY),
        AsyncStorage.getItem(SHAKE_KEY),
      ]);

      setSfxEnabled(sfxVal !== null ? sfxVal === 'true' : true);
      setHapticsEnabled(hapticsVal !== null ? hapticsVal === 'true' : true);
      setShakeEnabled(shakeVal !== null ? shakeVal === 'true' : true);
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const toggleSfx = async () => {
    const nextVal = !sfxEnabled;
    setSfxEnabled(nextVal);
    try {
      await AsyncStorage.setItem(SFX_KEY, nextVal.toString());
    } catch (error) {
      console.error('Erro ao salvar SFX:', error);
    }
  };

  const toggleHaptics = async () => {
    const nextVal = !hapticsEnabled;
    setHapticsEnabled(nextVal);
    try {
      await AsyncStorage.setItem(HAPTICS_KEY, nextVal.toString());
    } catch (error) {
      console.error('Erro ao salvar Haptics:', error);
    }
  };

  const toggleShake = async () => {
    const nextVal = !shakeEnabled;
    setShakeEnabled(nextVal);
    try {
      await AsyncStorage.setItem(SHAKE_KEY, nextVal.toString());
    } catch (error) {
      console.error('Erro ao salvar Shake:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Ionicons name="settings-sharp" size={24} color="#ab8b0c" />
              <Text style={styles.title}>Configurações</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#8badc9" />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsList}>
            {/* Efeitos Sonoros */}
            <TouchableOpacity
              style={styles.optionCard}
              onPress={toggleSfx}
              activeOpacity={0.8}
            >
              <View style={styles.optionLeft}>
                <View style={styles.iconBox}>
                  <Ionicons
                    name={sfxEnabled ? 'volume-high' : 'volume-mute'}
                    size={22}
                    color="#ab8b0c"
                  />
                </View>
                <View style={styles.optionTextWrap}>
                  <Text style={styles.optionTitle}>Efeitos Sonoros (SFX)</Text>
                  <Text style={styles.optionSubtitle}>
                    Sons ao clicar, acertar e errar
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.switchTrack,
                  sfxEnabled ? styles.switchTrackActive : styles.switchTrackInactive,
                ]}
              >
                <View
                  style={[
                    styles.switchThumb,
                    sfxEnabled ? styles.switchThumbActive : styles.switchThumbInactive,
                  ]}
                />
              </View>
            </TouchableOpacity>

            {/* Vibração Tátil */}
            <TouchableOpacity
              style={styles.optionCard}
              onPress={toggleHaptics}
              activeOpacity={0.8}
            >
              <View style={styles.optionLeft}>
                <View style={styles.iconBox}>
                  <Ionicons
                    name={hapticsEnabled ? 'phone-portrait' : 'phone-portrait-outline'}
                    size={22}
                    color="#ab8b0c"
                  />
                </View>
                <View style={styles.optionTextWrap}>
                  <Text style={styles.optionTitle}>Vibração Tátil (Haptics)</Text>
                  <Text style={styles.optionSubtitle}>
                    Resposta ao toque e alertas
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.switchTrack,
                  hapticsEnabled
                    ? styles.switchTrackActive
                    : styles.switchTrackInactive,
                ]}
              >
                <View
                  style={[
                    styles.switchThumb,
                    hapticsEnabled
                      ? styles.switchThumbActive
                      : styles.switchThumbInactive,
                  ]}
                />
              </View>
            </TouchableOpacity>

            {/* Animação de Tremor */}
            <TouchableOpacity
              style={styles.optionCard}
              onPress={toggleShake}
              activeOpacity={0.8}
            >
              <View style={styles.optionLeft}>
                <View style={styles.iconBox}>
                  <Ionicons name="sparkles" size={22} color="#ab8b0c" />
                </View>
                <View style={styles.optionTextWrap}>
                  <Text style={styles.optionTitle}>Animação de Tremor</Text>
                  <Text style={styles.optionSubtitle}>
                    Tremor do painel ao errar o dígito
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.switchTrack,
                  shakeEnabled
                    ? styles.switchTrackActive
                    : styles.switchTrackInactive,
                ]}
              >
                <View
                  style={[
                    styles.switchThumb,
                    shakeEnabled
                      ? styles.switchThumbActive
                      : styles.switchThumbInactive,
                  ]}
                />
              </View>
            </TouchableOpacity>
          </View>

          <Text style={styles.footerNote}>
            As preferências são salvas automaticamente.
          </Text>
        </View>
      </View>
    </Modal>
  );
}
