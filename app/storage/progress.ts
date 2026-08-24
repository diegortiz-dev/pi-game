import AsyncStorage from '@react-native-async-storage/async-storage';
import { PROGRESS_KEY, LEGACY_KEYS } from '../constants/storage';

/**
 * Tudo que o jogador acumula entre partidas.
 *
 * `unlocked` guarda os ids das conquistas já anunciadas. A versão anterior do app
 * não persistia isso e reconstruía a lista comparando os limiares no carregamento,
 * o que só funcionava enquanto toda conquista fosse um limiar crescente sobre uma
 * estatística salva. Guardar os ids remove essa amarra.
 */
export type Progress = {
  bestChallenge: number;
  bestPractice: number;
  totalDigits: number;
  totalGames: number;
  bestStreak: number;
  /** Blocos de dez dígitos concluídos no Modo Aprender, contados do início. */
  masteredBlocks: number;
  unlocked: string[];
};

export const EMPTY_PROGRESS: Progress = {
  bestChallenge: 0,
  bestPractice: 0,
  totalDigits: 0,
  totalGames: 0,
  bestStreak: 0,
  masteredBlocks: 0,
  unlocked: [],
};

function toInt(value: string | null): number {
  if (value === null) return 0;
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

/** Aceita apenas o que tem o formato esperado; o resto vira o valor vazio. */
function coerce(raw: unknown): Progress {
  if (typeof raw !== 'object' || raw === null) return { ...EMPTY_PROGRESS };
  const r = raw as Record<string, unknown>;
  const num = (v: unknown) =>
    typeof v === 'number' && Number.isFinite(v) && v > 0 ? Math.floor(v) : 0;
  return {
    bestChallenge: num(r.bestChallenge),
    bestPractice: num(r.bestPractice),
    totalDigits: num(r.totalDigits),
    totalGames: num(r.totalGames),
    bestStreak: num(r.bestStreak),
    masteredBlocks: num(r.masteredBlocks),
    unlocked: Array.isArray(r.unlocked)
      ? r.unlocked.filter((id): id is string => typeof id === 'string')
      : [],
  };
}

/**
 * Lê o progresso das chaves da v1 e apaga-as em seguida.
 * Roda no máximo uma vez por instalação.
 */
async function migrateLegacy(): Promise<Progress | null> {
  const [best, practice, digits, games] = await AsyncStorage.multiGet([
    LEGACY_KEYS.bestChallenge,
    LEGACY_KEYS.bestPractice,
    LEGACY_KEYS.totalDigits,
    LEGACY_KEYS.totalGames,
  ]);

  const migrated: Progress = {
    bestChallenge: toInt(best[1]),
    bestPractice: toInt(practice[1]),
    totalDigits: toInt(digits[1]),
    totalGames: toInt(games[1]),
    bestStreak: 0,
    masteredBlocks: 0,
    unlocked: [],
  };

  const hadAnything =
    migrated.bestChallenge > 0 ||
    migrated.bestPractice > 0 ||
    migrated.totalDigits > 0 ||
    migrated.totalGames > 0;

  if (!hadAnything) return null;

  await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(migrated));
  await AsyncStorage.multiRemove([
    LEGACY_KEYS.bestChallenge,
    LEGACY_KEYS.bestPractice,
    LEGACY_KEYS.totalDigits,
    LEGACY_KEYS.totalGames,
  ]);
  return migrated;
}

export async function loadProgress(): Promise<Progress> {
  try {
    const stored = await AsyncStorage.getItem(PROGRESS_KEY);
    if (stored !== null) return coerce(JSON.parse(stored));
    const migrated = await migrateLegacy();
    return migrated ?? { ...EMPTY_PROGRESS };
  } catch {
    // Storage corrompido não pode impedir alguém de jogar.
    return { ...EMPTY_PROGRESS };
  }
}

export async function saveProgress(progress: Progress): Promise<void> {
  try {
    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // Perder um save é aceitável; derrubar a partida em andamento não é.
  }
}

export async function resetProgress(): Promise<void> {
  try {
    await AsyncStorage.removeItem(PROGRESS_KEY);
  } catch {
    // idem
  }
}
