import { ACHIEVEMENTS } from './achievements';
import { STRINGS } from '../i18n';

// Conquista sem tradução apareceria na tela como chave crua. O TypeScript já
// exige que a chave exista no dicionário; aqui garante-se que cada conquista
// aponta para as suas próprias chaves, e não para as de outra.
describe('textos das conquistas', () => {
  it.each(ACHIEVEMENTS.map((a) => [a.id, a] as const))(
    '%s aponta para as próprias chaves',
    (id, achievement) => {
      expect(achievement.titleKey).toBe(`ach.${id}.title`);
      expect(achievement.descriptionKey).toBe(`ach.${id}.desc`);
      expect(STRINGS[achievement.titleKey]).toBeDefined();
      expect(STRINGS[achievement.descriptionKey]).toBeDefined();
      expect(STRINGS[achievement.unitKey]).toBeDefined();
    }
  );
});
