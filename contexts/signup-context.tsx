import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { AccountType } from '@/constants/signup';
import type { Country } from '@/constants/countries';

type SignupContextValue = {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  accountType: AccountType | null;
  setAccountType: (v: AccountType) => void;
  country: Country;
  setCountry: (v: Country) => void;
  phone: string;
  setPhone: (v: string) => void;
  phoneE164: string;
  setPhoneE164: (v: string) => void;
  pin: string;
  setPin: (v: string) => void;
  idNumber: string;
  setIdNumber: (v: string) => void;
  fullName: string;
  setFullName: (v: string) => void;
  nif: string;
  setNif: (v: string) => void;
};

const SignupContext = createContext<SignupContextValue | null>(null);

export function SignupProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [country, setCountry] = useState<Country>({ code: 'AO', name: 'Angola' });
  const [phone, setPhone] = useState('');
  const [phoneE164, setPhoneE164] = useState('');
  const [pin, setPin] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [nif, setNif] = useState('');

  const value = useMemo(
    () => ({
      email,
      setEmail,
      password,
      setPassword,
      accountType,
      setAccountType,
      country,
      setCountry,
      phone,
      setPhone,
      phoneE164,
      setPhoneE164,
      pin,
      setPin,
      idNumber,
      setIdNumber,
      fullName,
      setFullName,
      nif,
      setNif,
    }),
    [email, password, accountType, country, phone, phoneE164, pin, idNumber, fullName, nif]
  );

  return <SignupContext.Provider value={value}>{children}</SignupContext.Provider>;
}

export function useSignup() {
  const ctx = useContext(SignupContext);
  if (!ctx) throw new Error('useSignup must be used within SignupProvider');
  return ctx;
}
