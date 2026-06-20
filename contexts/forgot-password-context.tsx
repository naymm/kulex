import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Country } from '@/constants/countries';

export type ForgotPasswordMethod = 'email' | 'phone';

type ForgotPasswordContextValue = {
  method: ForgotPasswordMethod;
  setMethod: (method: ForgotPasswordMethod) => void;
  email: string;
  setEmail: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  phoneE164: string;
  setPhoneE164: (value: string) => void;
  country: Country;
  setCountry: (country: Country) => void;
};

const ForgotPasswordContext = createContext<ForgotPasswordContextValue | null>(null);

export function ForgotPasswordProvider({ children }: { children: ReactNode }) {
  const [method, setMethod] = useState<ForgotPasswordMethod>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneE164, setPhoneE164] = useState('');
  const [country, setCountry] = useState<Country>({ code: 'AO', name: 'Angola' });

  const value = useMemo(
    () => ({
      method,
      setMethod,
      email,
      setEmail,
      phone,
      setPhone,
      phoneE164,
      setPhoneE164,
      country,
      setCountry,
    }),
    [method, email, phone, phoneE164, country],
  );

  return (
    <ForgotPasswordContext.Provider value={value}>{children}</ForgotPasswordContext.Provider>
  );
}

export function useForgotPassword() {
  const ctx = useContext(ForgotPasswordContext);
  if (!ctx) {
    throw new Error('useForgotPassword must be used within ForgotPasswordProvider');
  }
  return ctx;
}
