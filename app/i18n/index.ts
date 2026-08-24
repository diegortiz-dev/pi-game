import { getLocales } from 'expo-localization';
import { STRINGS, type Locale, type StringKey } from './strings';

export type { Locale, StringKey };
export { STRINGS };

/** Idiomas que o app oferece. `auto` segue o aparelho. */
export type LanguagePreference = 'auto' | Locale;

export const DEFAULT_LOCALE: Locale = 'en';

/**
 * Idioma do aparelho, se for um que o app fala.
 *
 * `getLocales()` devolve a lista em ordem de preferência da pessoa, então a
 * primeira que o app conhece é a escolha certa — e não apenas a primeira da
 * lista, que pode ser um idioma sem tradução aqui.
 */
export function deviceLocale(): Locale {
  try {
    for (const locale of getLocales()) {
      const code = locale.languageCode?.toLowerCase();
      if (code === 'pt' || code === 'en') return code;
    }
  } catch {
    // Em ambientes sem o módulo nativo, cai no padrão.
  }
  return DEFAULT_LOCALE;
}

export function resolveLocale(preference: LanguagePreference): Locale {
  return preference === 'auto' ? deviceLocale() : preference;
}

type Params = Record<string, string | number>;

/**
 * Texto traduzido, com `{marcadores}` substituídos.
 *
 * Um marcador sem valor correspondente é deixado como está, em vez de virar
 * "undefined" na tela: um rótulo estranho é ruim, mas um rótulo mentindo é pior.
 */
export function translate(locale: Locale, key: StringKey, params?: Params): string {
  const text = STRINGS[key][locale];
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (whole, name: string) =>
    name in params ? String(params[name]) : whole
  );
}

/** Assinatura da função de tradução entregue às telas. */
export type Translate = (key: StringKey, params?: Params) => string;
