import { router } from 'expo-router';
import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PinDots, PinPad } from '@/components/signup/PinPad';
import { SignupBackButton, signupPageInsets, signupPageStyles } from '@/components/signup/SignupShell';
import { useSignup } from '@/contexts/signup-context';

export default function SignupPinScreen() {
  const insets = useSafeAreaInsets();
  const { pin, setPin } = useSignup();

  useEffect(() => {
    setPin('');
  }, [setPin]);

  const addDigit = (d: string) => {
    if (pin.length >= 4) return;
    const next = pin + d;
    setPin(next);
    if (next.length === 4) {
      setTimeout(() => router.push('/signup/pin-confirm'), 150);
    }
  };

  const deleteDigit = () => setPin(pin.slice(0, -1));

  return (
    <View style={[signupPageStyles.container, signupPageInsets(insets)]}>
      <View style={signupPageStyles.inner}>
        <SignupBackButton />
        <Text style={signupPageStyles.title}>Definir código de acesso</Text>
        <Text style={signupPageStyles.subtitle}>
          Para desbloquear o aplicativo quando você não o utilizar por 5 minutos.
        </Text>
        <PinDots length={4} filled={pin.length} />
      </View>
      <PinPad onDigit={addDigit} onDelete={deleteDigit} />
    </View>
  );
}
