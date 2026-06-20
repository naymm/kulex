import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { CountrySelectSheet } from '@/components/signup/CountrySelectSheet';
import { SignupPhoneField } from '@/components/signup/SignupPhoneField';
import { SignupShell } from '@/components/signup/SignupShell';
import { AuthError } from '@/contexts/AuthContext';
import { useSignup } from '@/contexts/signup-context';
import { sendSignupPhoneOtp } from '@/lib/auth';
import { isValidSignupPhone } from '@/lib/phone';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function SignupPhoneScreen() {
  const { country, setCountry, phone, setPhone, setPhoneE164 } = useSignup();
  const [countryOpen, setCountryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = useMemo(
    () => isValidSignupPhone(country.code, phone),
    [country.code, phone],
  );

  const handleContinue = async () => {
    if (!isValid) return;

    if (!isSupabaseConfigured) {
      router.push('/signup/sms-code');
      return;
    }

    setIsSubmitting(true);
    try {
      const e164 = await sendSignupPhoneOtp(country.code, phone);
      setPhoneE164(e164);
      router.push('/signup/sms-code');
    } catch (error) {
      const message =
        error instanceof AuthError ? error.message : 'Não foi possível enviar o código SMS.';
      Alert.alert('Verificação por SMS', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SignupShell
        title="Verifique seu número de telefone com um código"
        subtitle="Enviaremos um código para você, isso nos ajuda a manter sua conta segura"
        buttonLabel={isSubmitting ? 'A enviar...' : 'Enviar código'}
        continueDisabled={!isValid || isSubmitting}
        onContinue={() => void handleContinue()}>
        <SignupPhoneField
          label="Seu número de telefone"
          country={country}
          value={phone}
          onChangeText={setPhone}
          onPressCountry={() => setCountryOpen(true)}
        />
      </SignupShell>

      <CountrySelectSheet
        visible={countryOpen}
        onClose={() => setCountryOpen(false)}
        selected={country}
        onSelect={setCountry}
      />
    </>
  );
}
