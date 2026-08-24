/**
 * Chaves do AsyncStorage, todas em um lugar só.
 *
 * As chaves `LEGACY_*` são da primeira versão do app, quando cada estatística
 * morava em uma chave separada. Elas continuam listadas porque a migração em
 * `app/storage/progress.ts` ainda lê delas uma única vez, para que quem já
 * jogava não perca o progresso.
 */

export const PROGRESS_KEY = '@pi_game/progress/v2';
export const SETTINGS_KEY = '@pi_game/settings/v2';

export const LEGACY_KEYS = {
  bestChallenge: '@pi_game_high_score',
  bestPractice: '@pi_game_high_score_practice',
  totalDigits: '@pi_game_total_digits',
  totalGames: '@pi_game_total_games',
  sfx: '@pi_game_sfx_enabled',
  haptics: '@pi_game_haptics_enabled',
  shake: '@pi_game_shake_enabled',
} as const;
