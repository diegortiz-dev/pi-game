/**
 * Todo o texto visível do app, em português e inglês.
 *
 * Os dois idiomas ficam lado a lado na mesma chave, de propósito: uma tradução
 * faltando vira erro de tipo em vez de aparecer como chave crua na tela, e quem
 * edita um texto enxerga o par na mesma linha e é lembrado de ajustar os dois.
 *
 * Plural é resolvido por chaves separadas (`.one` e `.other`) escolhidas por
 * quem chama. É mais verboso que uma regra automática, mas explícito, e as duas
 * línguas aqui têm a mesma regra de plural.
 */

export type Locale = 'pt' | 'en';

type Entry = { pt: string; en: string };

export const STRINGS = {
  /* Comum -------------------------------------------------------------- */
  'common.menu': { pt: 'Menu', en: 'Menu' },
  'common.close': { pt: 'Fechar', en: 'Close' },
  'common.backToMenu': { pt: 'Voltar ao menu', en: 'Back to menu' },

  /* Início -------------------------------------------------------------- */
  'home.tagline': {
    pt: 'Quantos dígitos de π\nvocê sabe de cor?',
    en: 'How many digits of π\ndo you know by heart?',
  },
  'home.record.one': { pt: 'DÍGITO DE MEMÓRIA', en: 'DIGIT FROM MEMORY' },
  'home.record.other': { pt: 'DÍGITOS DE MEMÓRIA', en: 'DIGITS FROM MEMORY' },
  'home.goal.one': { pt: 'falta 1 para {title}', en: '1 to go until {title}' },
  'home.goal.other': { pt: 'faltam {n} para {title}', en: '{n} to go until {title}' },
  'home.credit': { pt: 'Feito por Diego Ortiz', en: 'Made by Diego Ortiz' },

  'home.learn': { pt: 'Aprender', en: 'Learn' },
  'home.learn.fresh': { pt: '10 por vez', en: '10 at a time' },
  'home.learn.progress': { pt: '{n} fixados', en: '{n} locked in' },
  'home.challenge': { pt: 'Desafio', en: 'Challenge' },
  'home.practice': { pt: 'Prática', en: 'Practice' },
  'home.practice.meta': { pt: 'livre', en: 'free' },

  'home.a11y.achievements': {
    pt: 'Conquistas. {n} de {total} desbloqueadas',
    en: 'Achievements. {n} of {total} unlocked',
  },
  'home.a11y.settings': { pt: 'Configurações', en: 'Settings' },
  'home.a11y.learn.fresh': {
    pt: 'Aprender. Treino guiado, dez dígitos por vez',
    en: 'Learn. Guided drill, ten digits at a time',
  },
  'home.a11y.learn.progress': {
    pt: 'Aprender. {n} dígitos fixados',
    en: 'Learn. {n} digits locked in',
  },
  'home.a11y.challenge': {
    pt: 'Desafio. {seconds} segundos, cada erro custa {penalty} segundos',
    en: 'Challenge. {seconds} seconds, each mistake costs {penalty} seconds',
  },
  'home.a11y.practice': {
    pt: 'Prática. Sem relógio, errar não encerra a partida',
    en: 'Practice. No clock, a mistake does not end the run',
  },

  /* Partida ------------------------------------------------------------- */
  'game.challenge': { pt: 'DESAFIO', en: 'CHALLENGE' },
  'game.practice': { pt: 'PRÁTICA', en: 'PRACTICE' },
  'game.meta.record': { pt: 'RECORDE', en: 'BEST' },
  'game.meta.streak': { pt: 'SEQUÊNCIA', en: 'STREAK' },
  'game.meta.hints': { pt: 'DICAS', en: 'HINTS' },
  'game.retry': { pt: 'Não é esse. Tente de novo.', en: 'Not that one. Try again.' },
  'game.startCue': {
    pt: 'O relógio começa no primeiro toque',
    en: 'The clock starts on your first tap',
  },
  'game.over': { pt: 'FIM DE PARTIDA', en: 'RUN OVER' },
  'game.complete': { pt: 'SEQUÊNCIA COMPLETA', en: 'SEQUENCE COMPLETE' },
  'game.newRecord': { pt: 'Novo recorde', en: 'New best' },
  'game.result.recalled': { pt: 'DE MEMÓRIA', en: 'FROM MEMORY' },
  'game.result.mistakes': { pt: 'ERROS', en: 'MISTAKES' },
  'game.result.hints': { pt: 'DICAS', en: 'HINTS' },
  'game.missed': { pt: 'O próximo era', en: 'The next one was' },
  'game.playAgain': { pt: 'Jogar novamente', en: 'Play again' },
  'game.share': { pt: 'Compartilhar', en: 'Share' },
  'game.a11y.playAgain': { pt: 'Jogar novamente', en: 'Play again' },
  'game.a11y.share': { pt: 'Compartilhar resultado', en: 'Share result' },
  'game.a11y.secondsLeft': { pt: '{n} segundos restantes', en: '{n} seconds left' },
  'game.share.challenge': {
    pt: 'Recitei {n} dígitos de π de memória no Desafio, no π-Game. Consegue passar disso?',
    en: 'I recited {n} digits of π from memory in Challenge mode on π-Game. Think you can beat it?',
  },
  'game.share.practice': {
    pt: 'Recitei {n} dígitos de π de memória na Prática, no π-Game. Consegue passar disso?',
    en: 'I recited {n} digits of π from memory in Practice mode on π-Game. Think you can beat it?',
  },

  /* Aprender ------------------------------------------------------------ */
  'learn.title': { pt: 'APRENDER', en: 'LEARN' },
  'learn.mastered': { pt: '{n} fixados', en: '{n} locked in' },
  'learn.range': { pt: 'DÍGITOS {first}–{last}', en: 'DIGITS {first}–{last}' },
  'learn.round': { pt: 'Rodada {n} de {total}', en: 'Round {n} of {total}' },
  'learn.brief.0': {
    pt: 'Acompanhe e digite. Tudo está à vista.',
    en: 'Follow along and type. Everything is visible.',
  },
  'learn.brief.1': {
    pt: 'Metade sumiu. Complete de cabeça.',
    en: 'Half is gone. Fill in the rest from memory.',
  },
  'learn.brief.2': {
    pt: 'Agora é só memória. Recite o bloco.',
    en: 'Memory only now. Recite the block.',
  },
  'learn.roundDone': { pt: 'Rodada concluída', en: 'Round complete' },
  'learn.nextRound': { pt: 'Próxima rodada', en: 'Next round' },
  'learn.blockDone': { pt: 'Bloco fixado', en: 'Block locked in' },
  'learn.blockDone.body': {
    pt: 'Você já recita π até o dígito {n}.',
    en: 'You can now recite π up to digit {n}.',
  },
  'learn.blockDone.perfect': {
    pt: 'Você já recita π até o dígito {n}, sem errar uma vez.',
    en: 'You can now recite π up to digit {n}, without a single mistake.',
  },
  'learn.nextBlock': { pt: 'Próximo bloco', en: 'Next block' },
  'learn.repeat': { pt: 'Repetir', en: 'Repeat' },
  'learn.a11y.nextRound': { pt: 'Ir para a próxima rodada', en: 'Go to the next round' },
  'learn.a11y.nextBlock': { pt: 'Aprender o próximo bloco', en: 'Learn the next block' },
  'learn.a11y.repeat': { pt: 'Repetir este bloco', en: 'Repeat this block' },
  'learn.a11y.progress': {
    pt: '{typed} de {total} dígitos digitados nesta rodada',
    en: '{typed} of {total} digits typed this round',
  },

  /* Estatísticas -------------------------------------------------------- */
  'stats.title': { pt: 'Seu progresso', en: 'Your progress' },
  'stats.bestChallenge': { pt: 'RECORDE DESAFIO', en: 'BEST CHALLENGE' },
  'stats.bestPractice': { pt: 'RECORDE PRÁTICA', en: 'BEST PRACTICE' },
  'stats.bestStreak': { pt: 'MELHOR SÉRIE', en: 'BEST STREAK' },
  'stats.mastered': { pt: 'FIXADOS', en: 'LOCKED IN' },
  'stats.games': { pt: 'PARTIDAS', en: 'RUNS' },
  'stats.digits': { pt: 'DÍGITOS ACERTADOS', en: 'DIGITS CORRECT' },
  'stats.achievements': { pt: 'Conquistas {n}/{total}', en: 'Achievements {n}/{total}' },
  'stats.filter.all': { pt: 'Todas', en: 'All' },
  'stats.filter.unlocked': { pt: 'Conquistadas', en: 'Unlocked' },
  'stats.filter.locked': { pt: 'A conquistar', en: 'Locked' },
  'stats.empty.unlocked': {
    pt: 'Nenhuma conquista ainda. Comece pelo Desafio.',
    en: 'No achievements yet. Start with Challenge.',
  },
  'stats.empty.locked': {
    pt: 'Você conquistou todas. Impressionante.',
    en: 'You have unlocked them all. Impressive.',
  },
  'stats.a11y.unlocked': {
    pt: '{title}, conquistada. {description}',
    en: '{title}, unlocked. {description}',
  },
  'stats.a11y.locked': {
    pt: '{title}, bloqueada. {description}. Progresso {current} de {target}',
    en: '{title}, locked. {description}. Progress {current} of {target}',
  },

  /* Configurações ------------------------------------------------------- */
  'settings.title': { pt: 'Configurações', en: 'Settings' },
  'settings.sfx': { pt: 'Efeitos sonoros', en: 'Sound effects' },
  'settings.sfx.desc': {
    pt: 'Toque das teclas, acerto, erro e conquista',
    en: 'Key taps, hits, misses and achievements',
  },
  'settings.haptics': { pt: 'Vibração', en: 'Haptics' },
  'settings.haptics.desc': {
    pt: 'Resposta tátil a cada toque',
    en: 'Touch feedback on every tap',
  },
  'settings.shake': { pt: 'Tremor ao errar', en: 'Shake on mistake' },
  'settings.shake.desc': {
    pt: 'O painel de dígitos sacode quando você erra',
    en: 'The digit panel shakes when you miss',
  },
  'settings.language': { pt: 'Idioma', en: 'Language' },
  'settings.language.auto': { pt: 'Do aparelho', en: 'System' },
  'settings.language.pt': { pt: 'Português', en: 'Portuguese' },
  'settings.language.en': { pt: 'Inglês', en: 'English' },
  'settings.reduceMotion': {
    pt: 'Seu aparelho está com "reduzir movimento" ligado, então as animações estão desativadas.',
    en: 'Your device has "reduce motion" on, so animations are turned off.',
  },
  'settings.reset': { pt: 'Apagar progresso', en: 'Erase progress' },
  'settings.reset.title': { pt: 'Apagar seu progresso?', en: 'Erase your progress?' },
  'settings.reset.body': {
    pt: 'Recordes, conquistas e estatísticas serão perdidos. Isso não pode ser desfeito.',
    en: 'Records, achievements and stats will be lost. This cannot be undone.',
  },
  'settings.reset.cancel': { pt: 'Cancelar', en: 'Cancel' },
  'settings.reset.confirm': { pt: 'Apagar', en: 'Erase' },
  'settings.footer': {
    pt: 'As preferências são salvas automaticamente.',
    en: 'Preferences are saved automatically.',
  },
  'settings.version': { pt: 'π-Game versão {v}', en: 'π-Game version {v}' },

  /* Teclado e fita ------------------------------------------------------- */
  'keypad.a11y.digit': { pt: 'Dígito {n}', en: 'Digit {n}' },
  'keypad.reveal': { pt: 'Revelar', en: 'Reveal' },
  'keypad.a11y.hint': { pt: 'Revelar o próximo dígito', en: 'Reveal the next digit' },
  'keypad.a11y.hintCost': {
    pt: 'Revelar o próximo dígito. Custa {n} segundos',
    en: 'Reveal the next digit. Costs {n} seconds',
  },
  'tape.a11y.empty': { pt: 'Nenhum dígito digitado ainda', en: 'No digits typed yet' },
  'tape.a11y.count': { pt: '{n} dígitos digitados', en: '{n} digits typed' },
  'gauge.one': { pt: 'DÍGITO', en: 'DIGIT' },
  'gauge.other': { pt: 'DÍGITOS', en: 'DIGITS' },
  'penalty.a11y': { pt: 'Menos {n} segundos', en: 'Minus {n} seconds' },

  /* Aviso de conquista --------------------------------------------------- */
  'toast.eyebrow': { pt: 'CONQUISTA DESBLOQUEADA', en: 'ACHIEVEMENT UNLOCKED' },
  'toast.a11y': {
    pt: 'Conquista desbloqueada: {title}. {description}',
    en: 'Achievement unlocked: {title}. {description}',
  },

  /* Falha ---------------------------------------------------------------- */
  'error.title': { pt: 'Algo quebrou', en: 'Something broke' },
  'error.body': {
    pt: 'O app encontrou um erro inesperado. Seu progresso salvo está intacto.',
    en: 'The app hit an unexpected error. Your saved progress is intact.',
  },
  'error.action': { pt: 'Tentar de novo', en: 'Try again' },

  /* Conquistas ----------------------------------------------------------- */
  'ach.first_step.title': { pt: 'Primeiro Passo', en: 'First Step' },
  'ach.first_step.desc': {
    pt: 'Chegue a 5 dígitos no Desafio',
    en: 'Reach 5 digits in Challenge',
  },
  'ach.apprentice.title': { pt: 'Aprendiz de Arquimedes', en: "Archimedes' Apprentice" },
  'ach.apprentice.desc': {
    pt: 'Chegue a 15 dígitos no Desafio',
    en: 'Reach 15 digits in Challenge',
  },
  'ach.geometer.title': { pt: 'Geômetra', en: 'Geometer' },
  'ach.geometer.desc': {
    pt: 'Chegue a 30 dígitos no Desafio',
    en: 'Reach 30 digits in Challenge',
  },
  'ach.pi_master.title': { pt: 'Mestre do π', en: 'Master of π' },
  'ach.pi_master.desc': {
    pt: 'Chegue a 50 dígitos no Desafio',
    en: 'Reach 50 digits in Challenge',
  },
  'ach.circle_legend.title': { pt: 'Lenda do Círculo', en: 'Legend of the Circle' },
  'ach.circle_legend.desc': {
    pt: 'Chegue a 100 dígitos no Desafio',
    en: 'Reach 100 digits in Challenge',
  },
  'ach.scholar.title': { pt: 'Estudioso', en: 'Scholar' },
  'ach.scholar.desc': {
    pt: 'Chegue a 25 dígitos na Prática',
    en: 'Reach 25 digits in Practice',
  },
  'ach.marathoner.title': { pt: 'Maratonista', en: 'Marathoner' },
  'ach.marathoner.desc': {
    pt: 'Chegue a 75 dígitos na Prática',
    en: 'Reach 75 digits in Practice',
  },
  'ach.clean_run.title': { pt: 'Série Limpa', en: 'Clean Run' },
  'ach.clean_run.desc': {
    pt: 'Acerte 25 dígitos seguidos sem errar',
    en: 'Hit 25 digits in a row without a miss',
  },
  'ach.precision.title': { pt: 'Precisão', en: 'Precision' },
  'ach.precision.desc': {
    pt: 'Acerte 50 dígitos seguidos sem errar',
    en: 'Hit 50 digits in a row without a miss',
  },
  'ach.dedicated.title': { pt: 'Dedicado', en: 'Dedicated' },
  'ach.dedicated.desc': { pt: 'Jogue 10 partidas', en: 'Play 10 runs' },
  'ach.veteran.title': { pt: 'Veterano', en: 'Veteran' },
  'ach.veteran.desc': { pt: 'Jogue 50 partidas', en: 'Play 50 runs' },
  'ach.counter.title': { pt: 'Contador de π', en: 'π Counter' },
  'ach.counter.desc': {
    pt: 'Acerte 500 dígitos no total',
    en: 'Hit 500 digits in total',
  },

  /* Unidades das conquistas ---------------------------------------------- */
  'unit.digits': { pt: 'dígitos', en: 'digits' },
  'unit.inARow': { pt: 'seguidos', en: 'in a row' },
  'unit.games': { pt: 'partidas', en: 'runs' },
} satisfies Record<string, Entry>;

export type StringKey = keyof typeof STRINGS;
