import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadProgress, saveProgress, resetProgress, EMPTY_PROGRESS } from './progress';
import { PROGRESS_KEY, LEGACY_KEYS } from '../constants/storage';

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('progresso salvo', () => {
  it('devolve o estado vazio numa instalação nova', async () => {
    await expect(loadProgress()).resolves.toEqual(EMPTY_PROGRESS);
  });

  it('grava e relê um ciclo completo', async () => {
    const progresso = {
      ...EMPTY_PROGRESS,
      bestChallenge: 42,
      bestStreak: 12,
      masteredBlocks: 3,
      unlocked: ['first_step'],
    };
    await saveProgress(progresso);
    await expect(loadProgress()).resolves.toEqual(progresso);
  });

  it('apaga tudo no reset', async () => {
    await saveProgress({ ...EMPTY_PROGRESS, bestChallenge: 10 });
    await resetProgress();
    await expect(loadProgress()).resolves.toEqual(EMPTY_PROGRESS);
  });

  // A v1 guardava cada estatística numa chave de string separada. Se a migração
  // falhar, quem já jogava abre o app e encontra o recorde zerado.
  describe('migração da v1', () => {
    it('traz os valores das chaves antigas', async () => {
      await AsyncStorage.multiSet([
        [LEGACY_KEYS.bestChallenge, '47'],
        [LEGACY_KEYS.bestPractice, '62'],
        [LEGACY_KEYS.totalDigits, '1840'],
        [LEGACY_KEYS.totalGames, '34'],
      ]);

      const migrado = await loadProgress();
      expect(migrado.bestChallenge).toBe(47);
      expect(migrado.bestPractice).toBe(62);
      expect(migrado.totalDigits).toBe(1840);
      expect(migrado.totalGames).toBe(34);
    });

    it('apaga as chaves antigas depois de migrar', async () => {
      await AsyncStorage.setItem(LEGACY_KEYS.bestChallenge, '47');
      await loadProgress();

      await expect(AsyncStorage.getItem(LEGACY_KEYS.bestChallenge)).resolves.toBeNull();
      await expect(AsyncStorage.getItem(PROGRESS_KEY)).resolves.not.toBeNull();
    });

    it('não roda de novo depois da primeira vez', async () => {
      await AsyncStorage.setItem(LEGACY_KEYS.bestChallenge, '47');
      await loadProgress();

      // Um recorde novo não pode ser sobrescrito por um resquício da v1.
      await saveProgress({ ...EMPTY_PROGRESS, bestChallenge: 80 });
      await AsyncStorage.setItem(LEGACY_KEYS.bestChallenge, '47');
      await expect(loadProgress()).resolves.toMatchObject({ bestChallenge: 80 });
    });
  });

  describe('dados corrompidos', () => {
    it('não quebra com JSON inválido', async () => {
      await AsyncStorage.setItem(PROGRESS_KEY, '{isso não é json');
      await expect(loadProgress()).resolves.toEqual(EMPTY_PROGRESS);
    });

    it('descarta campos com tipo errado', async () => {
      await AsyncStorage.setItem(
        PROGRESS_KEY,
        JSON.stringify({ bestChallenge: 'muitos', unlocked: 'nenhuma', totalGames: -5 })
      );
      const lido = await loadProgress();
      expect(lido.bestChallenge).toBe(0);
      expect(lido.unlocked).toEqual([]);
      expect(lido.totalGames).toBe(0);
    });
  });
});
