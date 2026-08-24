import { STRINGS, translate, resolveLocale, type Locale, type StringKey } from './index';

const LOCALES: Locale[] = ['pt', 'en'];
const chaves = Object.keys(STRINGS) as StringKey[];

/** Marcadores de interpolação usados num texto, sem repetição. */
function marcadores(texto: string): string[] {
  return [...new Set(texto.match(/\{(\w+)\}/g) ?? [])].sort();
}

describe('traduções', () => {
  it('tem chaves para traduzir', () => {
    expect(chaves.length).toBeGreaterThan(50);
  });

  it.each(LOCALES)('não tem texto vazio em %s', (locale) => {
    const vazias = chaves.filter((k) => STRINGS[k][locale].trim() === '');
    expect(vazias).toEqual([]);
  });

  // Uma tradução que perde um marcador não quebra nada — só passa a mostrar uma
  // frase sem o número. É o tipo de erro que ninguém percebe até um usuário ver.
  it('usa os mesmos marcadores nos dois idiomas', () => {
    const divergentes = chaves.filter(
      (k) => marcadores(STRINGS[k].pt).join() !== marcadores(STRINGS[k].en).join()
    );
    expect(divergentes).toEqual([]);
  });

  it('não deixa texto em português escapar para o inglês', () => {
    const suspeitas = chaves.filter((k) => /[áàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]/.test(STRINGS[k].en));
    expect(suspeitas).toEqual([]);
  });

  describe('translate', () => {
    it('substitui os marcadores', () => {
      expect(translate('pt', 'learn.round', { n: 2, total: 3 })).toBe('Rodada 2 de 3');
      expect(translate('en', 'learn.round', { n: 2, total: 3 })).toBe('Round 2 of 3');
    });

    it('devolve o texto cru quando não há marcadores', () => {
      expect(translate('pt', 'common.menu')).toBe('Menu');
    });

    it('deixa o marcador visível quando falta o valor', () => {
      // Melhor um marcador estranho do que a palavra "undefined" na tela.
      expect(translate('pt', 'learn.round', { n: 1 })).toContain('{total}');
    });

    it('aceita número e texto', () => {
      expect(translate('en', 'home.goal.other', { n: 3, title: 'Geometer' })).toBe(
        '3 to go until Geometer'
      );
    });
  });

  describe('resolveLocale', () => {
    it('respeita a escolha explícita', () => {
      expect(resolveLocale('pt')).toBe('pt');
      expect(resolveLocale('en')).toBe('en');
    });

    it('resolve "auto" para um idioma suportado', () => {
      expect(LOCALES).toContain(resolveLocale('auto'));
    });
  });
});
