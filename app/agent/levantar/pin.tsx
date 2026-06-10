import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AddMoneyPrimaryButton, AddMoneyShell } from '@/components/add-money/AddMoneyShell';
import { NumericKeypad, PinDots } from '@/components/send-money/NumericKeypad';
import {
  buildAgentWithdrawSummary,
  formatWithdrawReference,
  isWithdrawClientPinComplete,
  WITHDRAW_CLIENT_PIN_LENGTH,
} from '@/lib/agent-withdraw';

export default function AgentLevantarClientPinScreen() {
  const { reference } = useLocalSearchParams<{ reference?: string }>();
  const referenceDigits = typeof reference === 'string' ? reference : '';
  const [pin, setPin] = useState('');

  const pinComplete = isWithdrawClientPinComplete(pin);
  const referenceFormatted = useMemo(
    () => formatWithdrawReference(referenceDigits),
    [referenceDigits],
  );

  const addDigit = (digit: string) => {
    if (pin.length >= WITHDRAW_CLIENT_PIN_LENGTH) return;
    setPin((prev) => prev + digit);
  };

  const deleteDigit = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const continueToSummary = () => {
    const summary = buildAgentWithdrawSummary(referenceDigits, pin);
    if (!summary) return;

    router.push({
      pathname: '/agent/levantar/confirm',
      params: {
        reference: summary.reference,
        amount: summary.amountDigits,
      },
    });
  };

  return (
    <AddMoneyShell
      title="Levantar para cliente"
      footer={
        <AddMoneyPrimaryButton
          label="Seguinte"
          onPress={continueToSummary}
          disabled={!pinComplete}
        />
      }>
      <View style={styles.content}>
        <Text style={styles.title}>PIN do levantamento</Text>
        <Text style={styles.subtitle}>
          Referência {referenceFormatted} · {WITHDRAW_CLIENT_PIN_LENGTH} dígitos
        </Text>
        <PinDots length={WITHDRAW_CLIENT_PIN_LENGTH} filled={pin.length} variant="dark" />
      </View>

      <NumericKeypad onDigit={addDigit} onDelete={deleteDigit} variant="dark" />
    </AddMoneyShell>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: 'center', marginTop: 40, marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },
  subtitle: {
    marginTop: 8,
    marginBottom: 28,
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
});
