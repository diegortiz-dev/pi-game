import type { Ionicons } from '@expo/vector-icons';
import type { StringKey } from '../i18n';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

/** Estatísticas das quais toda conquista é derivada. */
export type AchievementStats = {
  bestChallenge: number;
  bestPractice: number;
  totalDigits: number;
  totalGames: number;
  bestStreak: number;
};

/**
 * A trilha a que a conquista pertence. Serve para achar o próximo marco de uma
 * trilha sem depender de comparar funções `measure`.
 */
export type AchievementTrack = 'challenge' | 'practice' | 'streak' | 'volume';

export type Achievement = {
  id: string;
  /** Chaves de texto, não o texto: o app fala mais de um idioma. */
  titleKey: StringKey;
  descriptionKey: StringKey;
  unitKey: StringKey;
  icon: IconName;
  track: AchievementTrack;
  target: number;
  /** De qual estatística esta conquista lê. */
  measure: (stats: AchievementStats) => number;
};

/**
 * A lista única de conquistas do app.
 *
 * Antes existiam duas cópias — uma no jogo (para o aviso na hora) e outra no modal
 * de estatísticas (para a lista) — com as regras escritas por extenso nas duas.
 * Qualquer ajuste precisava ser feito em dois lugares ou os números divergiam.
 *
 * Os marcos de dígitos medem apenas o Desafio. A Prática é ilimitada e sem
 * pressão de tempo, então deixá-la contar para os mesmos marcos tornava-os
 * triviais; ela agora tem a própria trilha.
 */
export const ACHIEVEMENTS: readonly Achievement[] = [
  {
    id: 'first_step',
    titleKey: 'ach.first_step.title',
    descriptionKey: 'ach.first_step.desc',
    icon: 'footsteps-outline',
    track: 'challenge',
    target: 5,
    unitKey: 'unit.digits',
    measure: (s) => s.bestChallenge,
  },
  {
    id: 'apprentice',
    titleKey: 'ach.apprentice.title',
    descriptionKey: 'ach.apprentice.desc',
    icon: 'school-outline',
    track: 'challenge',
    target: 15,
    unitKey: 'unit.digits',
    measure: (s) => s.bestChallenge,
  },
  {
    id: 'geometer',
    titleKey: 'ach.geometer.title',
    descriptionKey: 'ach.geometer.desc',
    icon: 'shapes-outline',
    track: 'challenge',
    target: 30,
    unitKey: 'unit.digits',
    measure: (s) => s.bestChallenge,
  },
  {
    id: 'pi_master',
    titleKey: 'ach.pi_master.title',
    descriptionKey: 'ach.pi_master.desc',
    icon: 'ribbon-outline',
    track: 'challenge',
    target: 50,
    unitKey: 'unit.digits',
    measure: (s) => s.bestChallenge,
  },
  {
    id: 'circle_legend',
    titleKey: 'ach.circle_legend.title',
    descriptionKey: 'ach.circle_legend.desc',
    icon: 'trophy-outline',
    track: 'challenge',
    target: 100,
    unitKey: 'unit.digits',
    measure: (s) => s.bestChallenge,
  },
  {
    id: 'scholar',
    titleKey: 'ach.scholar.title',
    descriptionKey: 'ach.scholar.desc',
    icon: 'book-outline',
    track: 'practice',
    target: 25,
    unitKey: 'unit.digits',
    measure: (s) => s.bestPractice,
  },
  {
    id: 'marathoner',
    titleKey: 'ach.marathoner.title',
    descriptionKey: 'ach.marathoner.desc',
    icon: 'walk-outline',
    track: 'practice',
    target: 75,
    unitKey: 'unit.digits',
    measure: (s) => s.bestPractice,
  },
  {
    id: 'clean_run',
    titleKey: 'ach.clean_run.title',
    descriptionKey: 'ach.clean_run.desc',
    icon: 'flash-outline',
    track: 'streak',
    target: 25,
    unitKey: 'unit.inARow',
    measure: (s) => s.bestStreak,
  },
  {
    id: 'precision',
    titleKey: 'ach.precision.title',
    descriptionKey: 'ach.precision.desc',
    icon: 'infinite-outline',
    track: 'streak',
    target: 50,
    unitKey: 'unit.inARow',
    measure: (s) => s.bestStreak,
  },
  {
    id: 'dedicated',
    titleKey: 'ach.dedicated.title',
    descriptionKey: 'ach.dedicated.desc',
    icon: 'game-controller-outline',
    track: 'volume',
    target: 10,
    unitKey: 'unit.games',
    measure: (s) => s.totalGames,
  },
  {
    id: 'veteran',
    titleKey: 'ach.veteran.title',
    descriptionKey: 'ach.veteran.desc',
    icon: 'medal-outline',
    track: 'volume',
    target: 50,
    unitKey: 'unit.games',
    measure: (s) => s.totalGames,
  },
  {
    id: 'counter',
    titleKey: 'ach.counter.title',
    descriptionKey: 'ach.counter.desc',
    icon: 'calculator-outline',
    track: 'volume',
    target: 500,
    unitKey: 'unit.digits',
    measure: (s) => s.totalDigits,
  },
];

export type EvaluatedAchievement = Achievement & {
  current: number;
  unlocked: boolean;
  /** Progresso de 0 a 1, limitado no topo. */
  ratio: number;
};

export function evaluate(stats: AchievementStats): EvaluatedAchievement[] {
  return ACHIEVEMENTS.map((achievement) => {
    const current = achievement.measure(stats);
    return {
      ...achievement,
      current,
      unlocked: current >= achievement.target,
      ratio: Math.min(1, current / achievement.target),
    };
  });
}

/** Ids de tudo que estas estatísticas já satisfazem. */
export function satisfiedIds(stats: AchievementStats): string[] {
  return ACHIEVEMENTS.filter((a) => a.measure(stats) >= a.target).map((a) => a.id);
}

/**
 * Conquistas recém-satisfeitas que ainda não foram anunciadas.
 * Preserva a ordem da lista, para que um anúncio duplo apareça do menor para o maior.
 */
export function newlyUnlocked(
  stats: AchievementStats,
  alreadyAnnounced: readonly string[]
): Achievement[] {
  const announced = new Set(alreadyAnnounced);
  return ACHIEVEMENTS.filter(
    (a) => !announced.has(a.id) && a.measure(stats) >= a.target
  );
}

/**
 * O próximo marco ainda não alcançado de uma trilha, ou `null` se a trilha já
 * foi inteira concluída. A lista já está em ordem crescente de alvo.
 */
export function nextInTrack(
  stats: AchievementStats,
  track: AchievementTrack
): EvaluatedAchievement | null {
  const pending = evaluate(stats).filter((a) => a.track === track && !a.unlocked);
  return pending.length > 0 ? pending[0] : null;
}
