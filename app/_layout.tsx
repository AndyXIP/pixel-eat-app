import { Micro5_400Regular, useFonts } from '@expo-google-fonts/micro-5';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [loaded] = useFonts({ Micro5_400Regular });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="post/create"
          options={{ presentation: 'modal', headerShown: false }}
        />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
