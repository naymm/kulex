import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { SignupShell } from '@/components/signup/SignupShell';
import { SignupTextField } from '@/components/signup/SignupTextField';
import { AuthError } from '@/contexts/AuthContext';
import { updatePassword } from '@/lib/auth';
import { isValidPassword } from '@/lib/password';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function ForgotPasswordNewPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordsMatch = password.length > 0 && password === confirmPassword;
  const isValid = useMemo(
    () => isValidPassword(password) && passwordsMatch,
    [password, passwordsMatch],
  );

  const handleContinue = async () => {
    if (!isValid) return;

    if (!isSupabaseConfigured) {
      router.push('/forgot-password/success');
      return;
    }

    setIsSubmitting(true);
    try {
      await updatePassword(password);
      router.push('/forgot-password/success');
    } catch (error) {
      const message =
        error instanceof AuthError ? error.message : 'Não foi possível redefinir a senha.';
      Alert.alert('Nova senha', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SignupShell
      title="Nova senha"
      subtitle="Crie uma nova senha segura para aceder à sua conta Kulex."
      buttonLabel={isSubmitting ? 'A guardar...' : 'Redefinir senha'}
      continueDisabled={!isValid || isSubmitting}
      onContinue={() => void handleContinue()}
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
