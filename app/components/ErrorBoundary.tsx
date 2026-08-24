import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { palette, spacing, radius, type, fonts } from '../theme';
import { deviceLocale, translate } from '../i18n';

/**
 * Última linha de defesa da interface.
 *
 * Sem isso, uma exceção durante a renderização derruba o app inteiro para uma
 * tela em branco, sem explicação e sem saída. Aqui pelo menos se diz o que
 * aconteceu e se oferece um caminho de volta.
 *
 * Fica acima do provedor de configurações, para também capturar falhas dele —
 * e por isso não pode ler o idioma escolhido no app. Usa o do aparelho, que é
 * a melhor aproximação disponível quando tudo o mais já falhou.
 */

type Props = { children: React.ReactNode };
type State = { error: Error | null };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error('Falha na interface:', error);
  }

  private reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    const locale = deviceLocale();
    const t = (key: Parameters<typeof translate>[1]) => translate(locale, key);

    return (
      <View style={styles.screen}>
        <Text style={styles.mark}>π</Text>
        <Text style={styles.title}>{t('error.title')}</Text>
        <Text style={styles.body}>{t('error.body')}</Text>
        <Text style={styles.detail} numberOfLines={4}>
          {error.message}
        </Text>
        <Pressable
          onPress={this.reset}
          accessibilityRole="button"
          accessibilityLabel={t('error.action')}
          style={({ pressed }) => [styles.action, pressed && styles.pressed]}
        >
          <Text style={styles.actionText}>{t('error.action')}</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: palette.ink[800],
  },
  mark: {
    ...type.title,
    fontFamily: fonts.piBold,
    fontSize: 40,
    color: palette.gold.base,
  },
  title: {
    ...type.heading,
    color: palette.text.primary,
    marginTop: spacing.lg,
  },
  body: {
    ...type.body,
    color: palette.text.secondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  detail: {
    ...type.bodySmall,
    fontFamily: type.data.fontFamily,
    fontSize: 12,
    color: palette.text.tertiary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  action: {
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    backgroundColor: palette.gold.base,
  },
  actionText: {
    ...type.body,
    color: palette.ink[900],
  },
  pressed: {
    opacity: 0.75,
  },
});
