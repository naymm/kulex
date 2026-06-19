import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { CountrySelectSheet } from '@/components/signup/CountrySelectSheet';
import { SignupPhoneField } from '@/components/signup/SignupPhoneField';
import { SignupShell } from '@/components/signup/SignupShell';
import { useSignup } from '@/contexts/signup-context';
import { isValidSignupPhone } from '@/lib/phone';

export default function SignupPhoneScreen() {
  const { country, setCountry, phone, setPhone } = useSignup();
  const [countryOpen, setCountryOpen] = useState(false);

  const isValid = useMemo(
    () => isValidSignupPhone(country.code, phone),
    [country.code, phone],
  );

  return (
    <>
      <SignupShell
        title="Verifique seu número de telefone com um código"
        subtitle="Enviaremos um código para você, isso nos ajuda a manter sua conta segura"
        buttonLabel="Enviar código"
        continueDisabled={!isValid}
        onContinue={() => router.push('/signup/sms-code')}>
        <SignupPhoneField
          label="Seu número de telefone"
          country={country}
          value={phone}
          onChangeText={setPhone}
          onPressCountry={() => setCountryOpen(true)}
        />
      </SignupShell>

      <CountrySelectSheet
        visible={countryOpen}
        onClose={() => setCountryOpen(false)}
        selected={country}
        onSelect={setCountry}
      />
    </>
  );
}
