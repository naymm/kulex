import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { AccountType } from '@/constants/signup';
import type { Country } from '@/constants/countries';

type SignupContextValue = {
  email: string;
  setEmail: (v: string) => void;
  accountType: AccountType | null;
  setAccountType: (v: AccountType) => void;
  country: Country;
  setCountry: (v: Country) => void;
  phone: string;
  setPhone: (v: string) => void;
  pin: string;
  setPin: (v: string) => void;
};

const SignupContext = createContext<SignupContextValue | null>(null);

export function SignupProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState('');
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [country, setCountry] = useState<Country>({ code: 'AO', name: 'Angola' });
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');

  const value = useMemo(
    () => ({
      email,
      setEmail,
      accountType,
      setAccountType,
      country,
      setCountry,
      phone,
      setPhone,
      pin,
      setPin,
    }),
    [email, accountType, country, phone, pin]
  );

  return <SignupContext.Provider value={value}>{children}</SignupContext.Provider>;
}

export function useSignup() {
  const ctx = useContext(SignupContext);
  if (!ctx) throw new Error('useSignup must be used within SignupProvider');
  return ctx;
}
