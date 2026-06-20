import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { SignupShell } from '@/components/signup/SignupShell';
import { SignupTextField } from '@/components/signup/SignupTextField';
import { isValidPassword } from '@/lib/password';

export default function ForgotPasswordNewPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isValid = useMemo(
    () => isValidPassword(password) && passwordsMatch,
    [password, passwordsMatch],
  );

  return (
    <SignupShell
      title="Nova senha"
      subtitle="Crie uma nova senha segura para aceder à sua conta Kulex."
      buttonLabel="Redefinir senha"
      continueDisabled={!isValid}
      onContinue={() => router.push('/forgot-password/success')}
      scrollable>
      <SignupTextField
        label="Nova senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <SignupTextField
        label="Confirmar nova senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <Text style={styles.hint}>
        Pelo menos <Text style={styles.hintBold}>9 caracteres</Text>, contendo{' '}
        <Text style={styles.hintBold}>uma letra e um número</Text>.
      </Text>
      {confirmPassword.length > 0 && !passwordsMatch ? (
        <Text style={styles.error}>As senhas não coincidem.</Text>
      ) : null}
    </SignupShell>
  );
}

const styles = StyleSheet.create({
  hint: {
    marginTop: -8,
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
  },
  hintBold: {
    fontWeight: '700',
    color: '#111827',
  },
  error: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '600',
    color: '#DC2626',
  },
});
