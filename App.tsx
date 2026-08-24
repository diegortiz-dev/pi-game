import React, { useCallback, useEffect } from 'react';
import { NavigationContainer, type Theme as NavTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
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
      <SafeAreaProvider onLayout={onLayout}>
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
