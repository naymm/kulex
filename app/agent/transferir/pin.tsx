import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AddMoneyShell } from '@/components/add-money/AddMoneyShell';
import { NumericKeypad, PinDots } from '@/components/send-money/NumericKeypad';

export default function AgentTransferirPinScreen() {
  const [pin, setPin] = useState('');

  const addDigit = (digit: string) => {
    if (pin.length >= 4) return;
    const next = pin + digit;
    setPin(next);
    if (next.length === 4) {
      setTimeout(() => router.replace('/agent/transferir/sucesso'), 200);
    }
  };

  return (
    <AddMoneyShell title="Transferir comissões">
      <View style={styles.content}>
        <Text style={styles.title}>Digite o seu PIN</Text>
        <Text style={styles.subtitle}>Para validar a transferência</Text>
        <PinDots length={4} filled={pin.length} variant="dark" />
      </View>
      <NumericKeypad onDigit={addDigit} onDelete={() => setPin((p) => p.slice(0, -1))} variant="dark" />
    </AddMoneyShell>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: 'center', marginTop: 48 },
  title: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },
  subtitle: { marginTop: 8, fontSize: 14, fontWeight: '500', color: 'rgba(255,255,255,0.6)' },
});
