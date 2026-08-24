import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { PI_DIGITS, PI_LENGTH, digitAt } from '../constants/pi';
import {
  loadProgress,
  saveProgress,
  EMPTY_PROGRESS,
  type Progress,
} from '../storage/progress';
import {
  newlyUnlocked,
  satisfiedIds,
  type Achievement,
  type AchievementStats,
} from '../data/achievements';
import { playSfx } from '../utils/sound';
import { tapFeedback, errorFeedback, successFeedback } from '../utils/haptics';

export type GameMode = 'timer' | 'practice';
export type GameStatus = 'idle' | 'running' | 'over' | 'complete';

/** Duração do Desafio, em milissegundos. */
export const CHALLENGE_MS = 60_000;

/** O que uma dica custa no Desafio. */
export const HINT_PENALTY_MS = 5_000;

/**
 * O que um erro custa no Desafio.
 *
 * Antes um erro encerrava a partida na hora. Depois de cinquenta segundos e
 * quarenta e sete dígitos, um deslize apagava tudo — o que criava tensão, mas
 * num app cujo objetivo é aprender desestimulava justamente o momento de
 * arriscar o dígito seguinte. Agora custa tempo: a pressão continua, o
 * precipício some, e dá para seguir vendo os dígitos que vêm depois.
 */
export const ERROR_PENALTY_MS = 10_000;

/** De quanto em quanto tempo o relógio é reavaliado. */
const TICK_MS = 100;

/** Dígitos acertados entre gravações automáticas durante uma partida longa. */
const AUTOSAVE_EVERY = 15;

export type GameState = {
  status: GameStatus;
  /** Onde o jogador está em pi. Avança com acerto e também com dica. */
  position: number;
  /** Dígitos lembrados sem ajuda. É o que vale para recordes e conquistas. */
  recalled: number;
  hintsUsed: number;
  /** Teclas erradas nesta partida. */
  mistakes: number;
  streak: number;
  msLeft: number;
  /** Desconto de tempo mais recente, para a tela poder anunciá-lo. */
  penalty: { seconds: number; id: number } | null;
  /** Tecla errada mais recente, para destacá-la. */
  wrongKey: number | null;
  /** Dígito que era esperado quando a partida acabou por erro. */
  missedDigit: number | null;
  isNewRecord: boolean;
};

const initialState = (mode: GameMode): GameState => ({
  status: mode === 'practice' ? 'running' : 'idle',
  position: 0,
  recalled: 0,
  hintsUsed: 0,
  mistakes: 0,
  streak: 0,
  msLeft: CHALLENGE_MS,
  penalty: null,
  wrongKey: null,
  missedDigit: null,
  isNewRecord: false,
});

/** Aplica um desconto ao prazo final e devolve o tempo restante. */
function chargeTime(deadlineRef: { current: number | null }, ms: number): number {
  if (deadlineRef.current === null) return 0;
  deadlineRef.current -= ms;
  return Math.max(0, deadlineRef.current - Date.now());
}

/**
 * Toda a regra de uma partida.
 *
 * Quatro correções em relação à versão anterior moram aqui:
 *
 * 1. A dica não é mais um acerto. Antes ela chamava exatamente a mesma rotina de
 *    um acerto real, então dava para segurar "Dica" cem vezes e desbloquear
 *    "Lenda do Círculo" sem saber um dígito sequer. Agora ela avança a posição
 *    (para continuar aprendendo) mas não entra em recalled, que é a conta que
 *    alimenta recorde, total e conquistas — e no Desafio ainda custa tempo.
 *
 * 2. O relógio conta por horário de parede, não somando intervalos. setInterval
 *    acumula atraso e para junto com o app; dava para minimizar o celular e
 *    congelar o Desafio.
 *
 * 3. O progresso é gravado em lote. Antes cada tecla disparava duas escritas no
 *    AsyncStorage.
 *
 * 4. Som, vibração e contabilidade acontecem fora de qualquer updater de estado.
 *    Um updater precisa ser puro: o React pode executá-lo mais de uma vez, e
 *    efeitos colaterais lá dentro tocariam o som duas vezes e contariam o mesmo
 *    dígito duas vezes. O estado corrente vive em stateRef, atualizado de forma
 *    síncrona, para que dois toques no mesmo quadro enxerguem o valor certo.
 */
export function useGameEngine(mode: GameMode) {
  const [state, setState] = useState<GameState>(() => initialState(mode));
  const [progress, setProgress] = useState<Progress>(EMPTY_PROGRESS);
  const [achievementQueue, setAchievementQueue] = useState<Achievement[]>([]);

  const stateRef = useRef<GameState>(state);
  const progressRef = useRef<Progress>(EMPTY_PROGRESS);
  const deadlineRef = useRef<number | null>(null);
  const dirtyRef = useRef(false);
  const sinceSaveRef = useRef(0);
  const countedGameRef = useRef(false);

  /** Escreve o estado no ref e na tela de uma vez só. */
  const commit = useCallback((next: GameState) => {
    stateRef.current = next;
    setState(next);
  }, []);

  /** Grava o progresso pendente. Seguro de chamar quando não há nada sujo. */
  const flush = useCallback(() => {
    if (!dirtyRef.current) return;
    dirtyRef.current = false;
    sinceSaveRef.current = 0;
    void saveProgress(progressRef.current);
  }, []);

  useEffect(() => {
    let active = true;
    loadProgress().then((loaded) => {
      if (!active) return;

      // Quem já jogava não tem a lista de conquistas anunciadas: considera-se
      // anunciado tudo que as estatísticas atuais já satisfazem, para não
      // disparar avisos de coisas conquistadas há muito tempo.
      const seeded =
        loaded.unlocked.length === 0
          ? { ...loaded, unlocked: satisfiedIds(loaded) }
          : loaded;

      progressRef.current = seeded;
      setProgress(seeded);
    });
    return () => {
      active = false;
    };
  }, []);

  // Garante a gravação ao sair da tela e ao app ir para segundo plano.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (next) => {
      if (next !== 'active') flush();
    });
    return () => {
      subscription.remove();
      flush();
    };
  }, [flush]);

  /**
   * Aplica um acerto ao progresso salvo e enfileira o que foi desbloqueado.
   * Devolve se este acerto estabeleceu um recorde.
   */
  const applyStats = useCallback(
    (recalled: number, streak: number) => {
      const current = progressRef.current;
      const bestKey = mode === 'timer' ? 'bestChallenge' : 'bestPractice';

      const next: Progress = {
        ...current,
        totalDigits: current.totalDigits + 1,
        bestStreak: Math.max(current.bestStreak, streak),
        [bestKey]: Math.max(current[bestKey], recalled),
      };

      if (!countedGameRef.current) {
        countedGameRef.current = true;
        next.totalGames = current.totalGames + 1;
      }

      const stats: AchievementStats = {
        bestChallenge: next.bestChallenge,
        bestPractice: next.bestPractice,
        totalDigits: next.totalDigits,
        totalGames: next.totalGames,
        bestStreak: next.bestStreak,
      };

      const fresh = newlyUnlocked(stats, next.unlocked);
      if (fresh.length > 0) {
        next.unlocked = [...next.unlocked, ...fresh.map((a) => a.id)];
        setAchievementQueue((queue) => [...queue, ...fresh]);
      }

      progressRef.current = next;
      setProgress(next);
      dirtyRef.current = true;

      // Uma partida de Prática pode durar bastante; grava de tempos em tempos
      // para que um encerramento abrupto não leve tudo embora.
      sinceSaveRef.current += 1;
      if (sinceSaveRef.current >= AUTOSAVE_EVERY || fresh.length > 0) flush();

      return recalled > current[bestKey];
    },
    [flush, mode]
  );

  const pressDigit = useCallback(
    (digit: number) => {
      const s = stateRef.current;
      if (s.status === 'over' || s.status === 'complete') return;

      const expected = digitAt(s.position);
      if (expected === null) return;

      playSfx('key');

      // O primeiro toque é o que inicia o Desafio.
      if (s.status === 'idle') deadlineRef.current = Date.now() + s.msLeft;

      if (digit !== expected) {
        errorFeedback();
        playSfx('error');

        if (mode === 'timer') {
          const msLeft = chargeTime(deadlineRef, ERROR_PENALTY_MS);
          const ranOut = msLeft === 0;
          if (ranOut) {
            deadlineRef.current = null;
            flush();
          }
          commit({
            ...s,
            status: ranOut ? 'over' : 'running',
            streak: 0,
            mistakes: s.mistakes + 1,
            msLeft,
            penalty: { seconds: ERROR_PENALTY_MS / 1000, id: s.mistakes + s.hintsUsed + 1 },
            wrongKey: digit,
            missedDigit: ranOut ? expected : null,
          });
          return;
        }

        commit({
          ...s,
          status: 'running',
          streak: 0,
          mistakes: s.mistakes + 1,
          wrongKey: digit,
        });
        return;
      }

      tapFeedback();
      playSfx('correct');

      const recalled = s.recalled + 1;
      const streak = s.streak + 1;
      const position = s.position + 1;
      const isNewRecord = applyStats(recalled, streak) || s.isNewRecord;

      const finished = position >= PI_LENGTH;
      if (finished) {
        deadlineRef.current = null;
        successFeedback();
        flush();
      }

      commit({
        ...s,
        status: finished ? 'complete' : 'running',
        position,
        recalled,
        streak,
        wrongKey: null,
        isNewRecord,
      });
    },
    [applyStats, commit, flush, mode]
  );

  const useHint = useCallback(() => {
    const s = stateRef.current;
    if (s.status === 'over' || s.status === 'complete') return;
    if (digitAt(s.position) === null) return;

    playSfx('key');
    tapFeedback();

    if (s.status === 'idle') deadlineRef.current = Date.now() + s.msLeft;

    // A dica custa tempo no Desafio e sempre zera a sequência: a sequência mede
    // quantos dígitos saíram de memória, e este não saiu.
    let msLeft = s.msLeft;
    let penalty = s.penalty;
    if (mode === 'timer' && deadlineRef.current !== null) {
      msLeft = chargeTime(deadlineRef, HINT_PENALTY_MS);
      penalty = { seconds: HINT_PENALTY_MS / 1000, id: s.mistakes + s.hintsUsed + 1 };
    }

    const position = s.position + 1;
    const ranOut = mode === 'timer' && msLeft === 0;
    const finished = position >= PI_LENGTH;
    if (finished || ranOut) deadlineRef.current = null;

    commit({
      ...s,
      status: finished ? 'complete' : ranOut ? 'over' : 'running',
      position,
      hintsUsed: s.hintsUsed + 1,
      streak: 0,
      msLeft,
      penalty,
      wrongKey: null,
    });
  }, [commit, mode]);

  const clearWrongKey = useCallback(() => {
    const s = stateRef.current;
    if (s.wrongKey === null) return;
    commit({ ...s, wrongKey: null });
  }, [commit]);

  const restart = useCallback(() => {
    deadlineRef.current = null;
    countedGameRef.current = false;
    commit(initialState(mode));
  }, [commit, mode]);

  /**
   * Relógio do Desafio.
   *
   * O prazo final é um instante absoluto, então o tempo restante sai de uma
   * subtração e não de uma contagem acumulada — sem drift, e sem a brecha de
   * pausar o desafio mandando o app para segundo plano.
   *
   * O efeito depende apenas do modo e da situação da partida: a posição é lida
   * do ref, para que o intervalo não seja destruído e recriado a cada dígito.
   */
  useEffect(() => {
    if (mode !== 'timer' || state.status !== 'running') return;

    const tick = () => {
      const deadline = deadlineRef.current;
      if (deadline === null) return;

      const s = stateRef.current;
      const remaining = Math.max(0, deadline - Date.now());

      if (remaining === 0) {
        deadlineRef.current = null;
        flush();
        commit({
          ...s,
          status: 'over',
          msLeft: 0,
          missedDigit: digitAt(s.position),
        });
        return;
      }

      if (s.msLeft !== remaining) commit({ ...s, msLeft: remaining });
    };

    const id = setInterval(tick, TICK_MS);
    tick();
    return () => clearInterval(id);
  }, [mode, state.status, commit, flush]);

  const dismissAchievement = useCallback(() => {
    setAchievementQueue((queue) => queue.slice(1));
  }, []);

  return {
    state,
    progress,
    revealed: PI_DIGITS.slice(0, state.position),
    personalBest: mode === 'timer' ? progress.bestChallenge : progress.bestPractice,
    /** A conquista sendo anunciada, ou undefined. Uma de cada vez. */
    currentAchievement: achievementQueue[0],
    dismissAchievement,
    pressDigit,
    useHint,
    clearWrongKey,
    restart,
  };
}
