import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AddMoneyShell } from '@/components/add-money/AddMoneyShell';
import { NumericKeypad, PinDots } from '@/components/send-money/NumericKeypad';

type PaymentPinScreenProps = {
  shellTitle: string;
  subtitle?: string;
  successPathname: string;
  params?: Record<string, string>;
};

export function PaymentPinScreen({
  shellTitle,
  subtitle = 'Para confirmar o pagamento',
  successPathname,
  params = {},
}: PaymentPinScreenProps) {
  const [pin, setPin] = useState('');

  const addDigit = (digit: string) => {
    if (pin.length >= 4) return;
    const next = pin + digit;
    setPin(next);
    if (next.length === 4) {
      setTimeout(() => {
        router.push({
          pathname: successPathname as never,
          params,
        });
      }, 200);
    }
  };

  const deleteDigit = () => setPin(pin.slice(0, -1));

  return (
    <AddMoneyShell title={shellTitle}>
      <View style={styles.content}>
        <Text style={styles.title}>Digite o seu PIN</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <PinDots length={4} filled={pin.length} variant="dark" />
      </View>
      <NumericKeypad onDigit={addDigit} onDelete={deleteDigit} variant="dark" />
    </AddMoneyShell>
  );
}

const styles = StyleSheet.create({
  content: {
    marginTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.55)',
  },
});
