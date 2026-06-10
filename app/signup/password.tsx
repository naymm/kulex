import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { SignupShell } from '@/components/signup/SignupShell';
import { SignupTextField } from '@/components/signup/SignupTextField';

export default function SignupPasswordScreen() {
  const [password, setPassword] = useState('');

  return (
    <SignupShell
      title="Crie a sua senha"
      buttonLabel="Continue"
      onContinue={() => router.push('/signup/personal')}
      scrollable>
      <SignupTextField
        label="Escolha uma senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <Text style={styles.hint}>
        Pelo menos <Text style={styles.hintBold}>9 caracteres</Text>, contendo{' '}
        <Text style={styles.hintBold}>uma letra e um número</Text>
      </Text>
    </SignupShell>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: -8, fontSize: 14, lineHeight: 20, color: '#6B7280' },
  hintBold: { fontWeight: '700', color: '#111827' },
});
