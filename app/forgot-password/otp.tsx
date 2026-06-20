import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { OtpCodeField } from '@/components/signup/OtpCodeField';
import { SignupShell } from '@/components/signup/SignupShell';
import { useForgotPassword } from '@/contexts/forgot-password-context';
import { getCountryDialCode } from '@/constants/country-dial-codes';

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
  const { method, email, phone, country } = useForgotPassword();
  const [code, setCode] = useState('');

  const destination =
    method === 'email' ? maskEmail(email) : maskPhone(country.code, phone);
  const isValid = useMemo(() => code.replace(/\D/g, '').length === 6, [code]);

  return (
    <SignupShell
      title={method === 'email' ? 'Verifique o seu e-mail' : 'Verifique o seu telefone'}
      subtitle={`Enviámos um código de 6 dígitos para ${destination}.`}
      buttonLabel="Verificar código"
      continueDisabled={!isValid}
      onContinue={() => router.push('/forgot-password/new-password')}
      scrollable>
      <OtpCodeField value={code} onChange={setCode} />

      <Pressable style={styles.resend} accessibilityRole="button" onPress={() => setCode('')}>
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
