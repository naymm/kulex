import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CountrySelectSheet } from '@/components/signup/CountrySelectSheet';
import { SignupSelectField } from '@/components/signup/SignupSelectField';
import { SignupShell } from '@/components/signup/SignupShell';
import { flagEmojiFromIso2 } from '@/constants/countries';
import { useSignup } from '@/contexts/signup-context';

export default function SignupCountryScreen() {
  const { country, setCountry } = useSignup();
  const [open, setOpen] = useState(false);

  return (
    <>
      <SignupShell
        title="Onde você mora a maior parte do tempo?"
        subtitle="Por lei, podemos precisar solicitar um comprovante de residência."
        buttonLabel="Continue"
        onContinue={() => router.push('/signup/country-features')}>
        <SignupSelectField
          label="País ou região"
          value={country.name}
          onPress={() => setOpen(true)}
          leftSlot={<Text style={styles.flag}>{flagEmojiFromIso2(country.code)}</Text>}
        />
      </SignupShell>
      <CountrySelectSheet
        visible={open}
        onClose={() => setOpen(false)}
        selected={country}
        onSelect={setCountry}
      />
    </>
  );
}

const styles = StyleSheet.create({
  flag: { fontSize: 18, marginRight: 10 },
});
