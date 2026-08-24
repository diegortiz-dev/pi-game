import {
  ROUND_REVEALS,
  ROUND_COUNT,
  startBlock,
  blockStart,
  blockLabel,
  isRevealed,
  expectedDigit,
  press,
  nextRound,
  nextBlock,
  repeatBlock,
  type LearnState,
} from './learn';
import { PI_DIGITS, GROUP_SIZE } from '../constants/pi';

/** Digita o bloco inteiro corretamente a partir do estado dado. */
function recitarBloco(state: LearnState): LearnState {
  let atual = state;
  const inicio = blockStart(atual.block);
  for (let i = 0; i < GROUP_SIZE; i++) {
    atual = press(atual, Number(PI_DIGITS[inicio + i])).state;
  }
  return atual;
}

describe('modo aprender', () => {
  it('revela cada vez menos a cada rodada', () => {
    expect(ROUND_REVEALS).toEqual([10, 5, 0]);
    expect(ROUND_COUNT).toBe(3);
  });

  it('mapeia o bloco para a faixa certa de dígitos', () => {
    expect(blockLabel(0)).toEqual({ first: 1, last: 10 });
    expect(blockLabel(3)).toEqual({ first: 31, last: 40 });
    expect(blockStart(3)).toBe(30);
  });

  describe('apoio visível', () => {
    it('mostra tudo na primeira rodada e nada na última', () => {
      const primeira = startBlock(0);
      expect(isRevealed(primeira, 9)).toBe(true);

      const ultima = { ...primeira, round: 2 };
      expect(isRevealed(ultima, 0)).toBe(false);
      expect(isRevealed(ultima, 9)).toBe(false);
    });

    it('esconde a segunda metade na rodada do meio', () => {
      const meio = { ...startBlock(0), round: 1 };
      expect(isRevealed(meio, 4)).toBe(true);
      expect(isRevealed(meio, 5)).toBe(false);
    });

    // Sem isso o que já foi acertado sumiria de novo na última rodada, e a
    // pessoa perderia a única confirmação de que está indo bem.
    it('mantém visível o que já foi acertado, mesmo sem apoio', () => {
      const semApoio = { ...startBlock(0), round: 2, typed: 3 };
      expect(isRevealed(semApoio, 2)).toBe(true);
      expect(isRevealed(semApoio, 3)).toBe(false);
    });
  });

  describe('press', () => {
    it('avança no acerto', () => {
      const { state, effect } = press(startBlock(0), 1);
      expect(effect).toBe('correct');
      expect(state.typed).toBe(1);
      expect(state.wrongKey).toBeNull();
    });

    it('não avança no erro, e conta o erro', () => {
      const { state, effect } = press(startBlock(0), 7);
      expect(effect).toBe('wrong');
      expect(state.typed).toBe(0);
      expect(state.mistakes).toBe(1);
      expect(state.wrongKey).toBe(7);
    });

    it('fecha a rodada ao completar os dez dígitos', () => {
      const fim = recitarBloco(startBlock(0));
      expect(fim.status).toBe('roundDone');
      expect(fim.typed).toBe(GROUP_SIZE);
    });

    it('fecha o bloco só ao completar a última rodada', () => {
      let s = recitarBloco(startBlock(0));
      s = recitarBloco(nextRound(s));
      expect(s.status).toBe('roundDone');
      s = recitarBloco(nextRound(s));
      expect(s.status).toBe('blockDone');
      expect(s.round).toBe(ROUND_COUNT - 1);
    });

    it('ignora teclas fora de hora', () => {
      const parado = recitarBloco(startBlock(0));
      expect(press(parado, 1).effect).toBe('ignored');
      expect(press(parado, 1).state).toBe(parado);
    });
  });

  describe('navegação entre blocos', () => {
    it('nextRound só age quando a rodada terminou', () => {
      const meio = startBlock(0);
      expect(nextRound(meio)).toBe(meio);
    });

    it('nextBlock começa o seguinte do zero', () => {
      const s = nextBlock({ ...startBlock(2), typed: 5, mistakes: 3 });
      expect(s.block).toBe(3);
      expect(s.round).toBe(0);
      expect(s.typed).toBe(0);
      expect(s.mistakes).toBe(0);
    });

    it('repeatBlock refaz o mesmo bloco desde o início', () => {
      const s = repeatBlock({ ...startBlock(4), round: 2, typed: 8, mistakes: 2 });
      expect(s.block).toBe(4);
      expect(s.round).toBe(0);
      expect(s.mistakes).toBe(0);
    });
  });

  it('cobra os dígitos certos de π em qualquer bloco', () => {
    const s = startBlock(7); // dígitos 71 a 80
    expect(expectedDigit(s)).toBe(Number(PI_DIGITS[70]));
    const depois = press(s, Number(PI_DIGITS[70])).state;
    expect(expectedDigit(depois)).toBe(Number(PI_DIGITS[71]));
  });
});
