import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

/**
 * Efeitos sonoros do jogo.
 *
 * A versão anterior usava a Web Audio API (`window.AudioContext`), que só existe
 * no navegador. No iOS e no Android o contexto vinha nulo e todas as funções
 * saíam em silêncio — ou seja, o app nunca teve som no celular, e a chave
 * "Efeitos Sonoros" não fazia nada lá. Agora são arquivos WAV tocados pelo
 * expo-audio, que funciona nas três plataformas.
 *
 * Também não se lê mais o AsyncStorage a cada toque: a preferência fica em
 * memória e é atualizada por quem cuida das configurações.
 */

const SOURCES = {
  key: require('../../assets/sfx/key.wav'),
  correct: require('../../assets/sfx/correct.wav'),
  error: require('../../assets/sfx/error.wav'),
  achievement: require('../../assets/sfx/achievement.wav'),
} as const;

export type SfxName = keyof typeof SOURCES;

/**
 * Quantas cópias de cada som existem.
 *
 * Reiniciar um player em uso exige um `seekTo` assíncrono, o que atrasa a
 * resposta justamente quando se digita rápido. Alternar entre algumas cópias
 * deixa o toque instantâneo e permite que dois efeitos soem sobrepostos.
 */
const POOL_SIZE: Record<SfxName, number> = {
  key: 3,
  correct: 3,
  error: 2,
  achievement: 1,
};

type Pool = { players: AudioPlayer[]; next: number };

let pools: Record<SfxName, Pool> | null = null;
let enabled = true;
let initFailed = false;

/**
 * Prepara os players. Chamar mais de uma vez não tem efeito.
 * Falhar aqui não é motivo para derrubar o app — o jogo apenas fica mudo.
 */
export async function initSound(): Promise<void> {
  if (pools || initFailed) return;
  try {
    await setAudioModeAsync({
      playsInSilentMode: false,   // respeita a chave de silencioso do iOS
      interruptionMode: 'mixWithOthers', // não corta a música de quem está ouvindo
      shouldPlayInBackground: false,
      allowsRecording: false,
      shouldRouteThroughEarpiece: false,
    });

    const built = {} as Record<SfxName, Pool>;
    for (const name of Object.keys(SOURCES) as SfxName[]) {
      built[name] = {
        players: Array.from({ length: POOL_SIZE[name] }, () =>
          createAudioPlayer(SOURCES[name])
        ),
        next: 0,
      };
    }
    pools = built;
  } catch {
    initFailed = true;
  }
}

/** Liga ou desliga os efeitos. Chamado por quem gerencia as configurações. */
export function setSfxEnabled(value: boolean): void {
  enabled = value;
}

export function playSfx(name: SfxName): void {
  if (!enabled || !pools) return;
  const pool = pools[name];
  const player = pool.players[pool.next];
  pool.next = (pool.next + 1) % pool.players.length;
  try {
    // Uma cópia que já terminou continua com o cursor no fim; voltar ao início
    // é barato porque nunca é a mesma que acabou de tocar.
    if (player.currentTime > 0) player.seekTo(0).catch(() => {});
    player.play();
  } catch {
    // Um efeito perdido não justifica interromper a partida.
  }
}

/** Devolve os players ao sistema. Para quando o app for encerrado. */
export function releaseSound(): void {
  if (!pools) return;
  for (const pool of Object.values(pools)) {
    for (const player of pool.players) {
      try {
        player.remove();
      } catch {
        // já liberado
      }
    }
  }
  pools = null;
}
