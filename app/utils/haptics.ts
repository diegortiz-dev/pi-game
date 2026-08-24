import * as Haptics from 'expo-haptics';
import { Vibration } from 'react-native';

/**
 * Retorno tátil.
 *
 * A versão anterior envolvia as chamadas em `try/catch` com `Vibration.vibrate`
 * no `catch`, como plano B. Mas os métodos do expo-haptics são assíncronos e
 * nunca lançam de forma síncrona: o `catch` jamais executava, o plano B era
 * código morto, e a promise rejeitada ficava sem tratamento. Aqui o plano B
 * está no `.catch` da promise, que é onde a falha realmente aparece.
 */

let enabled = true;

export function setHapticsEnabled(value: boolean): void {
  enabled = value;
}

export function tapFeedback(): void {
  if (!enabled) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {
    Vibration.vibrate(20);
  });
}

export function errorFeedback(): void {
  if (!enabled) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {
    Vibration.vibrate(180);
  });
}

export function successFeedback(): void {
  if (!enabled) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {
    Vibration.vibrate([0, 40, 60, 40]);
  });
}
