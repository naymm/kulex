import { Stack } from 'expo-router';
import { ForgotPasswordProvider } from '@/contexts/forgot-password-context';

export default function ForgotPasswordLayout() {
  return (
    <ForgotPasswordProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }} />
    </ForgotPasswordProvider>
  );
}
