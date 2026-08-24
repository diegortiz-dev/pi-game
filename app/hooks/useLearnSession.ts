import { useCallback, useEffect, useRef, useState } from 'react';
import {
  startBlock,
  press,
  nextRound,
  nextBlock,
  repeatBlock,
  clearWrong,
  type LearnState,
} from '../data/learn';
import { loadProgress, saveProgress, EMPTY_PROGRESS, type Progress } from '../storage/progress';
import { playSfx } from '../utils/sound';
import { tapFeedback, errorFeedback, successFeedback } from '../utils/haptics';

/**
 * Liga a mecânica de aprendizado ao som, ao tato e ao progresso salvo.
 *
 * A regra em si mora em `app/data/learn.ts`, em funções puras. Aqui só ficam os
 * efeitos — o que permite testar a regra sem montar componente nem tocar disco.
 */
export function useLearnSession() {
  const [state, setState] = useState<LearnState>(() => startBlock(0));
  const [progress, setProgress] = useState<Progress>(EMPTY_PROGRESS);
  const [ready, setReady] = useState(false);

  const stateRef = useRef<LearnState>(state);
  const progressRef = useRef<Progress>(EMPTY_PROGRESS);

  const commit = useCallback((next: LearnState) => {
    stateRef.current = next;
    setState(next);
  }, []);

  // Retoma no primeiro bloco ainda não dominado.
  useEffect(() => {
    let active = true;
    loadProgress().then((loaded) => {
      if (!active) return;
      progressRef.current = loaded;
      setProgress(loaded);
      commit(startBlock(loaded.masteredBlocks));
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, [commit]);

  /** Registra que o bloco foi concluído, se for o mais avançado até agora. */
  const recordMastery = useCallback((block: number) => {
    const current = progressRef.current;
    if (block + 1 <= current.masteredBlocks) return;
    const next = { ...current, masteredBlocks: block + 1 };
    progressRef.current = next;
    setProgress(next);
    void saveProgress(next);
  }, []);

  const pressDigit = useCallback(
    (digit: number) => {
      const outcome = press(stateRef.current, digit);
      if (outcome.effect === 'ignored') return;

      playSfx('key');

      switch (outcome.effect) {
        case 'wrong':
          errorFeedback();
          playSfx('error');
          break;
        case 'blockComplete':
          successFeedback();
          playSfx('achievement');
          recordMastery(outcome.state.block);
          break;
        case 'roundComplete':
          successFeedback();
          playSfx('achievement');
          break;
        default:
          tapFeedback();
          playSfx('correct');
      }

      commit(outcome.state);
    },
    [commit, recordMastery]
  );

  const advanceRound = useCallback(() => {
    commit(nextRound(stateRef.current));
  }, [commit]);

  const advanceBlock = useCallback(() => {
    commit(nextBlock(stateRef.current));
  }, [commit]);

  const redoBlock = useCallback(() => {
    commit(repeatBlock(stateRef.current));
  }, [commit]);

  const dismissWrong = useCallback(() => {
    commit(clearWrong(stateRef.current));
  }, [commit]);

  return {
    state,
    ready,
    masteredBlocks: progress.masteredBlocks,
    pressDigit,
    advanceRound,
    advanceBlock,
    redoBlock,
    dismissWrong,
  };
}
