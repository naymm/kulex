import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import { OtpCodeField } from '@/components/signup/OtpCodeField';
import { SignupShell } from '@/components/signup/SignupShell';
import { AuthError } from '@/contexts/AuthContext';
import { useForgotPassword } from '@/contexts/forgot-password-context';
import { getCountryDialCode } from '@/constants/country-dial-codes';
import {
  sendPasswordRecoveryOtp,
  sendPhoneRecoveryOtp,
  verifyPasswordRecoveryOtp,
  verifyPhoneRecoveryOtp,
} from '@/lib/auth';
import { isSupabaseConfigured } from '@/lib/supabase';

function maskEmail(email: string) {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  if (local.length <= 2) return `${local[0] ?? ''}***@${domain}`;
  return `${local.slice(0, 2)}***@${domain}`;
}

function maskPhone(countryCode: string, phone: string) {
  const dialCode = getCountryDialCode(countryCode);
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return `${dialCode} ********`;
  return `${dialCode} ******${digits.slice(-4)}`;
}

export default function ForgotPasswordOtpScreen() {
  const { method, email, phone, phoneE164, setPhoneE164, country } = useForgotPassword();
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const destination =
    method === 'email' ? maskEmail(email) : maskPhone(country.code, phone);
  const isValid = useMemo(() => code.replace(/\D/g, '').length === 6, [code]);

  const handleVerify = async () => {
    if (!isValid) return;

    if (!isSupabaseConfigured) {
      router.push('/forgot-password/new-password');
      return;
    }

    setIsSubmitting(true);
    try {
      if (method === 'email') {
        await verifyPasswordRecoveryOtp(email, code);
      } else {
        await verifyPhoneRecoveryOtp(phoneE164, code);
      }
      router.push('/forgot-password/new-password');
    } catch (error) {
      const message =
        error instanceof AuthError ? error.message : 'Código inválido ou expirado.';
      Alert.alert('Verificação', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setCode('');
    if (!isSupabaseConfigured) return;

    try {
      if (method === 'email') {
        await sendPasswordRecoveryOtp(email);
      } else {
        const e164 = await sendPhoneRecoveryOtp(country.code, phone);
        setPhoneE164(e164);
      }
      Alert.alert('Código reenviado', 'Verifique o seu e-mail ou SMS.');
    } catch (error) {
      const message =
        error instanceof AuthError ? error.message : 'Não foi possível reenviar o código.';
      Alert.alert('Recuperação de senha', message);
    }
  };

  return (
    <SignupShell
      title={method === 'email' ? 'Verifique o seu e-mail' : 'Verifique o seu telefone'}
      subtitle={`Enviámos um código de 6 dígitos para ${destination}.`}
      buttonLabel={isSubmitting ? 'A verificar...' : 'Verificar código'}
      continueDisabled={!isValid || isSubmitting}
      onContinue={() => void handleVerify()}
      scrollable>
      <OtpCodeField value={code} onChange={setCode} />

      <Pressable
        style={styles.resend}
        accessibilityRole="button"
        onPress={() => void handleResend()}>
        <Text style={styles.resendText}>Reenviar código</Text>
      </Pressable>

      <Pressable
        style={styles.altLink}
        accessibilityRole="button"
        onPress={() => router.push('/forgot-password')}>
        <Text style={styles.altText}>Tentar de outra forma</Text>
      </Pressable>
    </SignupShell>
  );
}

const styles = StyleSheet.create({
  resend: {
    marginTop: 24,
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A4E',
  },
  altLink: {
    marginTop: 16,
    alignItems: 'center',
  },
  altText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#C9A227',
    textDecorationLine: 'underline',
  },
});
