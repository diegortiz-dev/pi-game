import React from 'react';
import { Image } from 'react-native';

/**
 * A marca do app.
 *
 * Cheguei a envolver o disco num arco de progresso, e não funcionou: o ícone já
 * tem um anel dourado desenhado nele, então um segundo arco concêntrico lia como
 * duplicação, e perto de completar-se a falha no topo parecia defeito de
 * renderização em vez de "quase lá". A frase "faltam 3 para Mestre do π" diz a
 * mesma coisa sem ambiguidade e sem ruído visual, então o arco saiu.
 */

type Props = {
  /** Lado do quadrado da marca. */
  size?: number;
};

export default function BrandMark({ size = 148 }: Props) {
  return (
    <Image
      source={require('../../assets/brand-pi.png')}
      style={{ width: size, height: size }}
      resizeMode="contain"
      accessible
      accessibilityRole="image"
      accessibilityLabel="π-Game"
    />
  );
}
