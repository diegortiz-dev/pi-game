import { PI_DIGITS, PI_LENGTH, digitAt, groupDigits, isSequenceComplete } from './pi';

describe('dígitos de π', () => {
  it('começa com os dígitos conhecidos', () => {
    expect(PI_DIGITS.slice(0, 20)).toBe('14159265358979323846');
  });

  it('oferece dez mil dígitos', () => {
    expect(PI_LENGTH).toBe(10_000);
    expect(PI_DIGITS).toMatch(/^\d+$/);
  });

  describe('digitAt', () => {
    it('devolve o dígito como número', () => {
      expect(digitAt(0)).toBe(1);
      expect(digitAt(1)).toBe(4);
      expect(digitAt(PI_LENGTH - 1)).toBe(Number(PI_DIGITS[PI_LENGTH - 1]));
    });

    // A versão anterior indexava a string direto: passar do fim virava
    // `undefined`, `parseInt` virava `NaN`, e nenhuma tecla acertava mais.
    it('devolve null fora da sequência, nunca NaN', () => {
      expect(digitAt(PI_LENGTH)).toBeNull();
      expect(digitAt(PI_LENGTH + 500)).toBeNull();
      expect(digitAt(-1)).toBeNull();
    });
  });

  it('reconhece o fim da sequência', () => {
    expect(isSequenceComplete(PI_LENGTH - 1)).toBe(false);
    expect(isSequenceComplete(PI_LENGTH)).toBe(true);
  });

  describe('groupDigits', () => {
    it('agrupa de dez em dez', () => {
      expect(groupDigits('1415926535897932')).toEqual(['1415926535', '897932']);
    });

    it('devolve lista vazia sem dígitos', () => {
      expect(groupDigits('')).toEqual([]);
    });

    it('não perde nem duplica nada', () => {
      const amostra = PI_DIGITS.slice(0, 137);
      expect(groupDigits(amostra).join('')).toBe(amostra);
    });
  });
});
