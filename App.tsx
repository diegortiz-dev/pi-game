import React, { useCallback, useEffect } from 'react';
import { NavigationContainer, type Theme as NavTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { useFonts } from 'expo-font';
import {
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import { FiraSans_400Regular, FiraSans_700Bold } from '@expo-google-fonts/fira-sans';
import {
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
  IBMPlexMono_600SemiBold,
} from '@expo-google-fonts/ibm-plex-mono';

import HomeScreen from './app/screens/home';
import GameScreen from './app/screens/game';
import LearnScreen from './app/screens/learn';
import ErrorBoundary from './app/components/ErrorBoundary';
import { SettingsProvider } from './app/hooks/useSettings';
import { initSound, releaseSound } from './app/utils/sound';
import { palette, fonts } from './app/theme';
import type { RootStackParamList } from './app/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

// A splash fica na tela até as fontes chegarem, senão o app aparece por um
// instante com a fonte do sistema e depois salta para a definitiva.
void SplashScreen.preventAutoHideAsync();

/*
 * Fundo da view raiz.
 *
 * Numa transição, a tela que sai desliza e expõe por um instante o que está
 * atrás dela. Sem esta cor, o que aparece é o branco padrão da view raiz — e o
 * clarão some a ilusão de que as telas são um app só. Definir a cor em
 * app.json cobre a janela nativa, mas só depois de um build; esta chamada vale
 * já na próxima execução, inclusive no Expo Go.
 */
void SystemUI.setBackgroundColorAsync(palette.ink[800]);

/** Faz o fundo da navegação combinar com as telas, evitando um flash claro. */
const navigationTheme: NavTheme = {
  dark: true,
  colors: {
    primary: palette.gold.base,
    background: palette.ink[800],
    card: palette.ink[800],
    text: palette.text.primary,
    border: palette.ink[500],
    notification: palette.gold.bright,
  },
  fonts: {
    regular: { fontFamily: fonts.body, fontWeight: '400' },
    medium: { fontFamily: fonts.displayMedium, fontWeight: '500' },
    bold: { fontFamily: fonts.display, fontWeight: '700' },
    heavy: { fontFamily: fonts.display, fontWeight: '700' },
  },
};

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_700Bold,
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
    IBMPlexMono_600SemiBold,
    // Só o π sai daqui; ver `piFontFor` em app/theme.
    FiraSans_400Regular,
    FiraSans_700Bold,
  });

  useEffect(() => {
    void initSound();
    return releaseSound;
  }, []);

  // Uma fonte que não carrega não pode prender o app na splash: o React Native
  // cai para a fonte do sistema e o jogo continua utilizável.
  const ready = fontsLoaded || fontError !== null;

  const onLayout = useCallback(() => {
    if (ready) void SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <ErrorBoundary>
      <SafeAreaProvider style={styles.root} onLayout={onLayout}>
        <SettingsProvider>
          <NavigationContainer theme={navigationTheme}>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                contentStyle: { backgroundColor: palette.ink[800] },
              }}
            >
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Game" component={GameScreen} />
              <Stack.Screen name="Learn" component={LearnScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </SettingsProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  /** Terceira camada de fundo: a view do React, abaixo das telas. */
  root: {
    flex: 1,
    backgroundColor: palette.ink[800],
  },
});
