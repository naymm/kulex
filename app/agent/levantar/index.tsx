import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AddMoneyPrimaryButton, AddMoneyShell } from '@/components/add-money/AddMoneyShell';
import { NumericKeypad } from '@/components/send-money/NumericKeypad';
import {
  formatWithdrawReference,
  isWithdrawReferenceComplete,
  normalizeWithdrawReference,
} from '@/lib/agent-withdraw';

export default function AgentLevantarScreen() {
  const [referenceDigits, setReferenceDigits] = useState('');

  const referenceDisplay = formatWithdrawReference(referenceDigits);
  const referenceComplete = isWithdrawReferenceComplete(referenceDigits);

  const addDigit = (digit: string) => {
    setReferenceDigits((prev) => {
      const next = normalizeWithdrawReference(prev + digit);
      return next;
    });
  };

  const deleteDigit = () => {
    setReferenceDigits((prev) => prev.slice(0, -1));
  };

  const continueToPin = () => {
    if (!referenceComplete) return;
    router.push({
      pathname: '/agent/levantar/pin',
      params: { reference: referenceDigits },
    });
  };

  return (
    <AddMoneyShell
      title="Levantar para cliente"
      footer={
        <AddMoneyPrimaryButton
          label="Continuar"
          onPress={continueToPin}
          disabled={!referenceComplete}
        />
      }>
      <View style={styles.section}>
        <Text style={styles.label}>Referência do levantamento</Text>
        <Text style={[styles.referenceValue, !referenceDigits && styles.referenceEmpty]}>
          {referenceDigits ? referenceDisplay : 'XXX XXX XXX'}
        </Text>
        <Text style={styles.hint}>Introduza os 9 dígitos da referência gerada pelo cliente</Text>
      </View>

      <NumericKeypad onDigit={addDigit} onDelete={deleteDigit} variant="dark" />
    </AddMoneyShell>
  );
}

const styles = StyleSheet.create({
  section: {
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 12,
  },
  referenceValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  referenceEmpty: {
    color: 'rgba(255,255,255,0.35)',
    fontWeight: '600',
  },
  hint: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
});
