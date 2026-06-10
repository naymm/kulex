import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AddMoneyShell } from '@/components/add-money/AddMoneyShell';
import { NumericKeypad, PinDots } from '@/components/send-money/NumericKeypad';
import {
  executeAdvanceSettlement,
  type AdvanceSettlementMode,
} from '@/lib/credit-advances';

export default function LiquidarAdiantamentoPinScreen() {
  const { mode, advanceId, accountId, amount, amountDigits, title } = useLocalSearchParams<{
    mode?: string;
    advanceId?: string;
    accountId?: string;
    amount?: string;
    amountDigits?: string;
    title?: string;
  }>();
  const [pin, setPin] = useState('');
  const settlementMode: AdvanceSettlementMode = mode === 'all' ? 'all' : 'single';
  const resolvedAdvanceId = typeof advanceId === 'string' ? advanceId : '';

  const addDigit = (digit: string) => {
    if (pin.length >= 4) return;
    const next = pin + digit;
    setPin(next);
    if (next.length === 4) {
      setTimeout(() => {
        const result = executeAdvanceSettlement(settlementMode, resolvedAdvanceId);
        if (!result.success) return;

        router.push({
          pathname: '/credito-flow/meus-creditos/adiantamento/sucesso',
          params: {
            mode: settlementMode,
            advanceId: resolvedAdvanceId,
            accountId: typeof accountId === 'string' ? accountId : '',
            amount: typeof amount === 'string' ? amount : '',
            amountDigits: typeof amountDigits === 'string' ? amountDigits : '',
            title: typeof title === 'string' ? title : '',
            settledCount: String(result.settledCount),
          },
        });
      }, 200);
    }
  };

  const deleteDigit = () => setPin(pin.slice(0, -1));

  return (
    <AddMoneyShell title="Liquidar adiantamento">
      <View style={styles.content}>
        <Text style={styles.title}>Digite o seu PIN</Text>
        <Text style={styles.subtitle}>Para confirmar a liquidação por conta própria</Text>
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
