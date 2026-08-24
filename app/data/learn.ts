import { GROUP_SIZE, PI_LENGTH, digitAt } from '../constants/pi';

/**
 * A mecânica do Modo Aprender: a fita que apaga.
 *
 * Um bloco de dez dígitos é treinado em três rodadas. Na primeira todos os dez
 * estão à vista e a pessoa apenas acompanha; na segunda metade some; na terceira
 * recita de cabeça. O apoio sai aos poucos, em vez de existir ou não existir —
 * que é a diferença entre treinar e ser testado.
 *
 * Tudo aqui é função pura sobre um estado simples, sem React e sem acesso a
 * disco, para que a regra possa ser verificada isoladamente.
 */

/** Quantos dígitos do bloco ficam visíveis em cada rodada. */
export const ROUND_REVEALS = [GROUP_SIZE, GROUP_SIZE / 2, 0] as const;

export const ROUND_COUNT = ROUND_REVEALS.length;

/** Quantos blocos de dez existem ao todo. */
export const TOTAL_BLOCKS = Math.floor(PI_LENGTH / GROUP_SIZE);

export type LearnStatus = 'drilling' | 'roundDone' | 'blockDone';

export type LearnState = {
  /** Índice do bloco. 0 são os dígitos 1 a 10. */
  block: number;
  /** Rodada dentro do bloco, de 0 a ROUND_COUNT - 1. */
  round: number;
  /** Quantos dígitos do bloco já saíram certos nesta rodada. */
  typed: number;
  /** Tecla errada mais recente, para destacá-la. */
  wrongKey: number | null;
  /** Erros acumulados no bloco. */
  mistakes: number;
  status: LearnStatus;
};

export function startBlock(block: number): LearnState {
  return {
    block,
    round: 0,
    typed: 0,
    wrongKey: null,
    mistakes: 0,
    status: 'drilling',
  };
}

/** Posição em pi onde o bloco começa. */
export function blockStart(block: number): number {
  return block * GROUP_SIZE;
}

/** Rótulo humano da faixa, contando a partir de 1. */
export function blockLabel(block: number): { first: number; last: number } {
  return { first: blockStart(block) + 1, last: blockStart(block) + GROUP_SIZE };
}

/**
 * Se o dígito nesta posição do bloco aparece como apoio.
 * Um dígito já digitado sempre aparece, independentemente da rodada.
 */
export function isRevealed(state: LearnState, indexInBlock: number): boolean {
  if (indexInBlock < state.typed) return true;
  return indexInBlock < ROUND_REVEALS[state.round];
}

/** O dígito que a rodada espera agora, ou null se o bloco acabou. */
export function expectedDigit(state: LearnState): number | null {
  if (state.typed >= GROUP_SIZE) return null;
  return digitAt(blockStart(state.block) + state.typed);
}

export type PressOutcome = {
  state: LearnState;
  /** O que aconteceu, para a tela decidir som e vibração. */
  effect: 'correct' | 'wrong' | 'roundComplete' | 'blockComplete' | 'ignored';
};

/** Processa uma tecla. Nunca lança; entradas fora de hora são ignoradas. */
export function press(state: LearnState, digit: number): PressOutcome {
  if (state.status !== 'drilling') return { state, effect: 'ignored' };

  const expected = expectedDigit(state);
  if (expected === null) return { state, effect: 'ignored' };

  if (digit !== expected) {
    return {
      state: { ...state, wrongKey: digit, mistakes: state.mistakes + 1 },
      effect: 'wrong',
    };
  }

  const typed = state.typed + 1;
  const finishedRound = typed >= GROUP_SIZE;
  const finishedBlock = finishedRound && state.round >= ROUND_COUNT - 1;

  return {
    state: {
      ...state,
      typed,
      wrongKey: null,
      status: finishedBlock ? 'blockDone' : finishedRound ? 'roundDone' : 'drilling',
    },
    effect: finishedBlock ? 'blockComplete' : finishedRound ? 'roundComplete' : 'correct',
  };
}

/** Vai para a próxima rodada do mesmo bloco. */
export function nextRound(state: LearnState): LearnState {
  if (state.status !== 'roundDone') return state;
  return { ...state, round: state.round + 1, typed: 0, wrongKey: null, status: 'drilling' };
}

/** Abre o bloco seguinte. Trava no último bloco disponível. */
export function nextBlock(state: LearnState): LearnState {
  const target = Math.min(state.block + 1, TOTAL_BLOCKS - 1);
  return startBlock(target);
}

/** Refaz o bloco atual desde a primeira rodada. */
export function repeatBlock(state: LearnState): LearnState {
  return startBlock(state.block);
}

/** Limpa o destaque da tecla errada. */
export function clearWrong(state: LearnState): LearnState {
  return state.wrongKey === null ? state : { ...state, wrongKey: null };
}
