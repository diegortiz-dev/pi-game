import {
  ACHIEVEMENTS,
  evaluate,
  satisfiedIds,
  newlyUnlocked,
  nextInTrack,
  type AchievementStats,
} from './achievements';

const ZERO: AchievementStats = {
  bestChallenge: 0,
  bestPractice: 0,
  totalDigits: 0,
  totalGames: 0,
  bestStreak: 0,
};

describe('conquistas', () => {
  it('tem ids únicos', () => {
    const ids = ACHIEVEMENTS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('não desbloqueia nada num perfil zerado', () => {
    expect(satisfiedIds(ZERO)).toEqual([]);
  });

  // Prática é ilimitada e sem pressão de tempo. Deixá-la contar para os marcos
  // de dígitos tornava "Lenda do Círculo" trivial.
  it('mede os marcos de dígitos só pelo Desafio', () => {
    const soPratica = satisfiedIds({ ...ZERO, bestPractice: 100 });
    expect(soPratica).not.toContain('circle_legend');
    expect(soPratica).not.toContain('pi_master');
    expect(soPratica).toContain('scholar');
    expect(soPratica).toContain('marathoner');

    const soDesafio = satisfiedIds({ ...ZERO, bestChallenge: 100 });
    expect(soDesafio).toContain('circle_legend');
    expect(soDesafio).not.toContain('scholar');
  });

  describe('newlyUnlocked', () => {
    it('ignora o que já foi anunciado', () => {
      const stats = { ...ZERO, bestChallenge: 30 };
      expect(newlyUnlocked(stats, []).map((a) => a.id)).toEqual([
        'first_step',
        'apprentice',
        'geometer',
      ]);
      expect(newlyUnlocked(stats, ['first_step', 'apprentice']).map((a) => a.id)).toEqual([
        'geometer',
      ]);
      expect(newlyUnlocked(stats, satisfiedIds(stats))).toEqual([]);
    });

    it('anuncia do menor marco para o maior', () => {
      const alvos = newlyUnlocked({ ...ZERO, bestChallenge: 100 }, []).map((a) => a.target);
      expect(alvos).toEqual([...alvos].sort((a, b) => a - b));
    });
  });

  describe('evaluate', () => {
    it('limita o progresso em 100%, sem esconder o valor real', () => {
      const item = evaluate({ ...ZERO, bestChallenge: 999 }).find((a) => a.id === 'first_step')!;
      expect(item.ratio).toBe(1);
      expect(item.current).toBe(999);
      expect(item.unlocked).toBe(true);
    });
  });

  describe('nextInTrack', () => {
    it('aponta o próximo marco da trilha', () => {
      expect(nextInTrack(ZERO, 'challenge')?.target).toBe(5);
      expect(nextInTrack({ ...ZERO, bestChallenge: 30 }, 'challenge')?.target).toBe(50);
    });

    it('devolve null quando a trilha acabou', () => {
      expect(nextInTrack({ ...ZERO, bestChallenge: 10_000 }, 'challenge')).toBeNull();
    });
  });
});
