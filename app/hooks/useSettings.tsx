import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AccessibilityInfo } from 'react-native';
import {
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  type BooleanSetting,
  type Settings,
} from '../storage/settings';
import {
  resolveLocale,
  translate,
  type LanguagePreference,
  type Locale,
  type Translate,
} from '../i18n';
import { setSfxEnabled } from '../utils/sound';
import { setHapticsEnabled } from '../utils/haptics';

/**
 * Preferências do app, com uma fonte única.
 *
 * Antes cada tela lia o AsyncStorage por conta própria e guardava o valor em um
 * `ref` no momento em que montava. Mudar uma opção nas configurações não surtia
 * efeito na partida já aberta, e o som ainda consultava o disco a cada toque.
 * Aqui o valor vive em um contexto e é empurrado para os módulos de som e tato
 * assim que muda.
 */

type SettingsContextValue = {
  settings: Settings;
  /** `false` enquanto o valor salvo ainda não chegou do disco. */
  ready: boolean;
  toggle: (key: BooleanSetting) => void;
  setLanguage: (preference: LanguagePreference) => void;
  /** Idioma efetivo, já resolvido a partir da preferência e do aparelho. */
  locale: Locale;
  /** Traduz uma chave no idioma atual. */
  t: Translate;
  /** `true` quando o sistema operacional pede menos movimento na tela. */
  reduceMotion: boolean;
  /**
   * Se o tremor ao errar deve acontecer.
   *
   * Combina a preferência do app com a do sistema: quem liga "reduzir
   * movimento" no aparelho normalmente o faz por enjoo ou sensibilidade
   * vestibular, e essa escolha vale mais que o padrão do app. A chave nas
   * configurações continua existindo para desligar mesmo sem a do sistema.
   */
  shakeEnabled: boolean;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let active = true;
    loadSettings().then((loaded) => {
      if (!active) return;
      setSettings(loaded);
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  // Acompanha a preferência de movimento do sistema, inclusive se mudar com o
  // app aberto.
  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (active) setReduceMotion(enabled);
    });
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion
    );
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);

  // Mantém os módulos imperativos em dia com o estado.
  useEffect(() => {
    setSfxEnabled(settings.sfx);
    setHapticsEnabled(settings.haptics);
  }, [settings.sfx, settings.haptics]);

  const toggle = useCallback((key: BooleanSetting) => {
    setSettings((current) => {
      const next = { ...current, [key]: !current[key] };
      void saveSettings(next);
      return next;
    });
  }, []);

  const setLanguage = useCallback((preference: LanguagePreference) => {
    setSettings((current) => {
      if (current.language === preference) return current;
      const next = { ...current, language: preference };
      void saveSettings(next);
      return next;
    });
  }, []);

  const locale = resolveLocale(settings.language);

  const t = useCallback<Translate>(
    (key, params) => translate(locale, key, params),
    [locale]
  );

  const value = useMemo(
    () => ({
      settings,
      ready,
      toggle,
      setLanguage,
      locale,
      t,
      reduceMotion,
      shakeEnabled: settings.shake && !reduceMotion,
    }),
    [settings, ready, toggle, setLanguage, locale, t, reduceMotion]
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (context === null) {
    throw new Error('useSettings precisa estar dentro de <SettingsProvider>');
  }
  return context;
}

/** Atalho para quem só precisa traduzir. */
export function useT(): Translate {
  return useSettings().t;
}
