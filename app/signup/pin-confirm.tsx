import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PinDots, PinPad } from '@/components/signup/PinPad';
import { SignupBackButton, signupPageInsets, signupPageStyles } from '@/components/signup/SignupShell';
import { useSignup } from '@/contexts/signup-context';

export default function SignupPinConfirmScreen() {
  const insets = useSafeAreaInsets();
  const { pin, setPin } = useSignup();
  const [confirm, setConfirm] = useState('');

  const addDigit = (d: string) => {
    if (confirm.length >= 4) return;
    const next = confirm + d;
    setConfirm(next);
    if (next.length === 4) {
      if (next === pin) {
        router.replace('/signup/success');
        return;
      }
      Alert.alert('Código incorreto', 'Os códigos não coincidem. Tente novamente.');
      setConfirm('');
      router.replace('/signup/pin');
      setPin('');
    }
  };

  const deleteDigit = () => setConfirm(confirm.slice(0, -1));

  return (
    <View style={[signupPageStyles.container, signupPageInsets(insets)]}>
      <View style={signupPageStyles.inner}>
        <SignupBackButton />
        <Text style={signupPageStyles.title}>Repita o código de acesso</Text>
        <Text style={signupPageStyles.subtitle}>
          Para desbloquear o aplicativo quando você não o utilizar por 5 minutos.
        </Text>
        <PinDots length={4} filled={confirm.length} />
      </View>
      <PinPad onDigit={addDigit} onDelete={deleteDigit} />
    </View>
  );
}
