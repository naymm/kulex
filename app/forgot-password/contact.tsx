import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { CountrySelectSheet } from '@/components/signup/CountrySelectSheet';
import { SignupPhoneField } from '@/components/signup/SignupPhoneField';
import { SignupShell } from '@/components/signup/SignupShell';
import { SignupTextField } from '@/components/signup/SignupTextField';
import { AuthError } from '@/contexts/AuthContext';
import { useForgotPassword } from '@/contexts/forgot-password-context';
import {
  sendPasswordRecoveryOtp,
  sendPhoneRecoveryOtp,
} from '@/lib/auth';
import { isSupabaseConfigured } from '@/lib/supabase';
import { isValidSignupPhone } from '@/lib/phone';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function ForgotPasswordContactScreen() {
  const { method, email, setEmail, phone, setPhone, setPhoneE164, country, setCountry } =
    useForgotPassword();
  const [countryOpen, setCountryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEmail = method === 'email';
  const isValid = useMemo(() => {
    if (isEmail) return isValidEmail(email);
    return isValidSignupPhone(country.code, phone);
  }, [country.code, email, isEmail, phone]);

  const handleContinue = async () => {
    if (!isValid) return;

    if (!isSupabaseConfigured) {
      router.push('/forgot-password/otp');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEmail) {
        await sendPasswordRecoveryOtp(email);
      } else {
        const e164 = await sendPhoneRecoveryOtp(country.code, phone);
        setPhoneE164(e164);
      }
      router.push('/forgot-password/otp');
    } catch (error) {
      const message =
        error instanceof AuthError ? error.message : 'Não foi possível enviar o código.';
      Alert.alert('Recuperação de senha', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SignupShell
        title={isEmail ? 'Recuperar por e-mail' : 'Recuperar por telefone'}
        subtitle={
          isEmail
            ? 'Introduza o e-mail associado à sua conta para receber o código de verificação.'
            : 'Introduza o número de telefone associado à sua conta para receber o código por SMS.'
        }
        buttonLabel={isSubmitting ? 'A enviar...' : 'Enviar código'}
        continueDisabled={!isValid || isSubmitting}
        onContinue={() => void handleContinue()}
        scrollable>
        {isEmail ? (
          <SignupTextField
            label="Seu e-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="nome@email.com"
          />
        ) : (
          <SignupPhoneField
            label="Seu número de telefone"
            country={country}
            value={phone}
            onChangeText={setPhone}
            onPressCountry={() => setCountryOpen(true)}
          />
        )}
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
