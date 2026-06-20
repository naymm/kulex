import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import { OtpCodeField } from '@/components/signup/OtpCodeField';
import { OtpResendButton } from '@/components/signup/OtpResendButton';
import { SignupShell } from '@/components/signup/SignupShell';
import { AuthError } from '@/contexts/AuthContext';
import { useSignup } from '@/contexts/signup-context';
import { getCountryDialCode } from '@/constants/country-dial-codes';
import { useOtpResendCooldown } from '@/hooks/useOtpResendCooldown';
import { sendSignupPhoneOtp, verifySignupPhoneOtp } from '@/lib/auth';
import { isSupabaseConfigured } from '@/lib/supabase';

function maskPhone(countryCode: string, phone: string) {
  const dialCode = getCountryDialCode(countryCode);
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return `${dialCode} ********`;
  return `${dialCode} ******${digits.slice(-4)}`;
}

export default function SignupSmsCodeScreen() {
  const { country, phone, phoneE164, setPhoneE164 } = useSignup();
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const { secondsLeft, canResend, restart } = useOtpResendCooldown();

  const isValid = useMemo(() => code.replace(/\D/g, '').length === 6, [code]);

  const handleCodeChange = (value: string) => {
    setCode(value);
    if (otpError) setOtpError(null);
  };

  const handleContinue = async () => {
    if (!isValid) return;

    if (!isSupabaseConfigured) {
      router.push('/signup/password');
      return;
    }

    if (!phoneE164) {
      Alert.alert('Verificação', 'Volte e envie o código novamente.');
      router.back();
      return;
    }

    setIsSubmitting(true);
    setOtpError(null);
    try {
      await verifySignupPhoneOtp(phoneE164, code);
      router.push('/signup/password');
    } catch (error) {
      const message =
        error instanceof AuthError ? error.message : 'Código inválido.';
      setOtpError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;

    setCode('');
    setOtpError(null);
    if (!isSupabaseConfigured) return;

    setIsResending(true);
    try {
      const e164 = await sendSignupPhoneOtp(country.code, phone);
      setPhoneE164(e164);
      restart();
      Alert.alert('Código reenviado', 'Verifique o SMS no seu telefone.');
    } catch (error) {
      const message =
        error instanceof AuthError ? error.message : 'Não foi possível reenviar o código.';
      Alert.alert('Verificação por SMS', message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <SignupShell
      title="Acabamos de enviar um SMS para você"
      buttonLabel={isSubmitting ? 'A verificar...' : 'Continuar'}
      continueDisabled={!isValid || isSubmitting}
      onContinue={() => void handleContinue()}
      scrollable>
      <Text style={styles.hint}>
        Insira o código de segurança que enviamos para {maskPhone(country.code, phone)}.
      </Text>

      <OtpCodeField value={code} onChange={handleCodeChange} error={otpError ?? undefined} />

      <OtpResendButton
        secondsLeft={secondsLeft}
        canResend={canResend}
        isResending={isResending}
        onPress={() => void handleResend()}
      />

      <Pressable style={styles.altLink} accessibilityRole="button" onPress={() => router.back()}>
        <Text style={styles.altText}>Tentar de outra forma</Text>
      </Pressable>
    </SignupShell>
  );
}

const styles = StyleSheet.create({
  hint: {
    fontSize: 15,
    lineHeight: 22,
    color: '#6B7280',
    marginBottom: 28,
  },
  altLink: { marginTop: 16, alignItems: 'center' },
  altText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#C9A227',
    textDecorationLine: 'underline',
  },
});
