import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SignupShell } from '@/components/signup/SignupShell';
import { useSignup } from '@/contexts/signup-context';

function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return '********';
  return `******${digits.slice(-4)}`;
}

export default function SignupSmsCodeScreen() {
  const { phone } = useSignup();
  const [code, setCode] = useState('');
  const inputRef = useRef<TextInput>(null);
  const digits = code.replace(/\D/g, '').slice(0, 6);

  return (
    <SignupShell
      title="Acabamos de enviar um SMS para você"
      buttonLabel="Continue"
      onContinue={() => router.push('/signup/password')}
      scrollable>
      <Text style={styles.hint}>
        Insira o código de segurança que enviamos para {maskPhone(phone)}.
      </Text>

      <Pressable style={styles.otpRow} onPress={() => inputRef.current?.focus()}>
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} style={styles.otpBox}>
            <Text style={styles.otpDigit}>{digits[i] ?? ''}</Text>
          </View>
        ))}
      </Pressable>
      <TextInput
        ref={inputRef}
        value={digits}
        onChangeText={(t) => setCode(t.replace(/\D/g, '').slice(0, 6))}
        keyboardType="number-pad"
        maxLength={6}
        style={styles.hiddenInput}
        autoFocus
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
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  otpBox: {
    flex: 1,
    maxWidth: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF0F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpDigit: { fontSize: 20, fontWeight: '600', color: '#111827' },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  altLink: { marginTop: 28, alignItems: 'center' },
  altText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#C9A227',
    textDecorationLine: 'underline',
  },
});
