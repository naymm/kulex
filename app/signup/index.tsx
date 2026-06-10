import { router } from 'expo-router';
import { SignupShell } from '@/components/signup/SignupShell';
import { SignupTextField } from '@/components/signup/SignupTextField';
import { useSignup } from '@/contexts/signup-context';

export default function SignupEmailScreen() {
  const { email, setEmail } = useSignup();

  return (
    <SignupShell
      title={"Insira seu endereço\nde e-mail"}
      buttonLabel="Continue"
      onContinue={() => router.push('/signup/account-type')}>
      <SignupTextField
        label="Seu email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
    </SignupShell>
  );
}
