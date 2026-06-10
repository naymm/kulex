import { Stack } from 'expo-router';
import { SignupProvider } from '@/contexts/signup-context';

export default function SignupLayout() {
  return (
    <SignupProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SignupProvider>
  );
}
