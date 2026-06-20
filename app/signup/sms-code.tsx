import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { OtpCodeField } from '@/components/signup/OtpCodeField';
import { SignupShell } from '@/components/signup/SignupShell';
import { useSignup } from '@/contexts/signup-context';
import { getCountryDialCode } from '@/constants/country-dial-codes';

function maskPhone(countryCode: string, phone: string) {
  const dialCode = getCountryDialCode(countryCode);
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return `${dialCode} ********`;
  return `${dialCode} ******${digits.slice(-4)}`;
}

export default function SignupSmsCodeScreen() {
  const { country, phone } = useSignup();
  const [code, setCode] = useState('');

  return (
    <SignupShell
      title="Acabamos de enviar um SMS para você"
      buttonLabel="Continue"
      onContinue={() => router.push('/signup/password')}
      scrollable>
      <Text style={styles.hint}>
        Insira o código de segurança que enviamos para {maskPhone(country.code, phone)}.
      </Text>

      <OtpCodeField value={code} onChange={setCode} />

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
  altLink: { marginTop: 28, alignItems: 'center' },
  altText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#C9A227',
    textDecorationLine: 'underline',
  },
});
