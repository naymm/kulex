import { router } from 'expo-router';
import { SignupShell } from '@/components/signup/SignupShell';
import { SignupTextField } from '@/components/signup/SignupTextField';
import { useSignup } from '@/contexts/signup-context';

export default function SignupPhoneScreen() {
  const { phone, setPhone } = useSignup();

  return (
    <SignupShell
      title="Verifique seu número de telefone com um código"
      subtitle="Enviaremos um código para você, isso nos ajuda a manter sua conta segura"
      buttonLabel="Enviar código"
      onContinue={() => router.push('/signup/sms-code')}>
      <SignupTextField
        label="Seu número de telefone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
    </SignupShell>
  );
}
