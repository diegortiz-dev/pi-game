import React from 'react';
import { Text, StyleSheet, type StyleProp, type TextStyle } from 'react-native';
import { piFontFor } from '../theme';

/**
 * Texto que pode conter o caractere π.
 *
 * As fontes do app param em latin-ext e não trazem grego, então um π solto no
 * meio de uma frase era desenhado pela fonte do sistema — mais claro e mais
 * estreito que as letras vizinhas, e diferente em cada plataforma. Aqui a frase
 * é partida no π e só ele recebe a família com grego, no peso equivalente.
 *
 * Fora isso se comporta como um Text comum: mesma prop `style`, mesmos
 * atributos de acessibilidade.
 */

type Props = React.ComponentProps<typeof Text> & {
  children: string;
};

export default function PiText({ children, style, ...rest }: Props) {
  if (!children.includes('π')) {
    return (
      <Text style={style} {...rest}>
        {children}
      </Text>
    );
  }

  const flat = (StyleSheet.flatten(style) ?? {}) as TextStyle;
  const piStyle: StyleProp<TextStyle> = { fontFamily: piFontFor(flat.fontFamily) };

  return (
    <Text style={style} {...rest}>
      {children.split(/(π)/).map((parte, indice) =>
        parte === 'π' ? (
          <Text key={indice} style={piStyle}>
            π
          </Text>
        ) : (
          parte
        )
      )}
    </Text>
  );
}
