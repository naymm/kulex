import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PinDots, PinPad } from '@/components/signup/PinPad';
import { SignupBackButton, signupPageInsets, signupPageStyles } from '@/components/signup/SignupShell';
import { useSignup } from '@/contexts/signup-context';
import { AuthError, completeKulexSignup } from '@/lib/auth';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function SignupPinConfirmScreen() {
  const insets = useSafeAreaInsets();
  const { email, password, accountType, country, phone, pin, setPin, fullName } = useSignup();
  const [confirm, setConfirm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const finishSignup = async () => {
    if (!accountType) {
      Alert.alert('Dados em falta', 'Seleccione o tipo de conta e tente novamente.');
      router.replace('/signup/account-type');
      return;
    }

    if (!isSupabaseConfigured) {
      router.replace('/signup/success');
      return;
    }

    setIsSubmitting(true);
    try {
      await completeKulexSignup({
        email,
        password,
        phone,
        countryCode: country.code,
        accountType,
        pin,
        fullName: fullName || undefined,
      });
      router.replace('/signup/success');
    } catch (error) {
      const message =
        error instanceof AuthError
          ? error.message
          : 'Não foi possível criar a conta. Tente novamente.';
      Alert.alert('Erro no registo', message);
      setConfirm('');
      setPin('');
      router.replace('/signup/pin');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addDigit = (d: string) => {
    if (isSubmitting || confirm.length >= 4) return;
    const next = confirm + d;
    setConfirm(next);
    if (next.length === 4) {
      if (next === pin) {
        void finishSignup();
        return;
      }
      Alert.alert('Código incorreto', 'Os códigos não coincidem. Tente novamente.');
      setConfirm('');
      router.replace('/signup/pin');
      setPin('');
    }
  };

  const deleteDigit = () => {
    if (!isSubmitting) setConfirm(confirm.slice(0, -1));
  };

  return (
    <View style={[signupPageStyles.container, signupPageInsets(insets)]}>
      <View style={signupPageStyles.inner}>
        <SignupBackButton />
        <Text style={signupPageStyles.title}>Repita o código de acesso</Text>
        <Text style={signupPageStyles.subtitle}>
          Para desbloquear o aplicativo quando você não o utilizar por 5 minutos.
        </Text>
        <PinDots length={4} filled={confirm.length} />
        {isSubmitting ? (
          <View style={{ marginTop: 24, alignItems: 'center' }}>
            <ActivityIndicator color="#1A1A4E" />
            <Text style={{ marginTop: 8, color: '#6B7280' }}>A criar a sua conta...</Text>
          </View>
        ) : null}
      </View>
      <PinPad onDigit={addDigit} onDelete={deleteDigit} />
    </View>
  );
}
