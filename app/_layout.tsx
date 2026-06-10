import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { AccountProvider } from '@/contexts/AccountContext';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <AccountProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="send-money" />
        <Stack.Screen name="add-money" />
        <Stack.Screen name="withdraw" />
        <Stack.Screen name="movimentos" />
        <Stack.Screen name="cards" />
        <Stack.Screen name="payments" />
        <Stack.Screen name="remessas" />
        <Stack.Screen name="scoring" />
        <Stack.Screen name="agent" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </AccountProvider>
  );
}
