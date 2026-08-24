import AsyncStorage from '@react-native-async-storage/async-storage';
import { SETTINGS_KEY, LEGACY_KEYS } from '../constants/storage';
import type { LanguagePreference } from '../i18n';

export type Settings = {
  sfx: boolean;
  haptics: boolean;
  shake: boolean;
  /** `auto` segue o idioma do aparelho. */
  language: LanguagePreference;
};

/** As chaves de liga/desliga, separadas porque só elas podem ser alternadas. */
export type BooleanSetting = 'sfx' | 'haptics' | 'shake';

export const DEFAULT_SETTINGS: Settings = {
  sfx: true,
  haptics: true,
  shake: true,
  language: 'auto',
};

function coerceLanguage(value: unknown): LanguagePreference {
  return value === 'pt' || value === 'en' || value === 'auto' ? value : 'auto';
}

function coerce(raw: unknown): Settings {
  if (typeof raw !== 'object' || raw === null) return { ...DEFAULT_SETTINGS };
  const r = raw as Record<string, unknown>;
  const bool = (v: unknown, fallback: boolean) =>
    typeof v === 'boolean' ? v : fallback;
  return {
    sfx: bool(r.sfx, DEFAULT_SETTINGS.sfx),
    haptics: bool(r.haptics, DEFAULT_SETTINGS.haptics),
    shake: bool(r.shake, DEFAULT_SETTINGS.shake),
    language: coerceLanguage(r.language),
  };
}

/** Lê as chaves soltas da v1 e as remove. Roda no máximo uma vez. */
async function migrateLegacy(): Promise<Settings | null> {
  const entries = await AsyncStorage.multiGet([
    LEGACY_KEYS.sfx,
    LEGACY_KEYS.haptics,
    LEGACY_KEYS.shake,
  ]);
  if (entries.every(([, value]) => value === null)) return null;

  const read = (value: string | null, fallback: boolean) =>
    value === null ? fallback : value === 'true';

  const migrated: Settings = {
    sfx: read(entries[0][1], DEFAULT_SETTINGS.sfx),
    haptics: read(entries[1][1], DEFAULT_SETTINGS.haptics),
    shake: read(entries[2][1], DEFAULT_SETTINGS.shake),
    language: 'auto',
  };

  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(migrated));
  await AsyncStorage.multiRemove([
    LEGACY_KEYS.sfx,
    LEGACY_KEYS.haptics,
    LEGACY_KEYS.shake,
  ]);
  return migrated;
}

export async function loadSettings(): Promise<Settings> {
  try {
    const stored = await AsyncStorage.getItem(SETTINGS_KEY);
    if (stored !== null) return coerce(JSON.parse(stored));
    const migrated = await migrateLegacy();
    return migrated ?? { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Preferência não salva não deve derrubar nada.
  }
}
