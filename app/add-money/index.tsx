import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  AddMoneyPrimaryButton,
  AddMoneyShell,
} from '@/components/add-money/AddMoneyShell';
import { NumericKeypad } from '@/components/send-money/NumericKeypad';
import { ADD_MONEY_BALANCE } from '@/constants/add-money';
import { formatMoneyFromDigitsAsCents, normalizeDigits } from '@/lib/money';

export default function AddMoneyAmountScreen() {
  const [amountDigits, setAmountDigits] = useState('');

  const amountFormatted = useMemo(
    () => formatMoneyFromDigitsAsCents(amountDigits),
    [amountDigits]
  );

  const addDigit = (digit: string) => {
    setAmountDigits((prev) => normalizeDigits(prev + digit));
  };

  const deleteDigit = () => {
    setAmountDigits((prev) => prev.slice(0, -1));
  };

  const continueToMethod = () => {
    if (!amountDigits || amountDigits === '0') return;
    router.push({
      pathname: '/add-money/method',
      params: { amount: amountDigits },
    });
  };

  return (
    <AddMoneyShell
      title="Adicionar Dinheiro"
      footer={<AddMoneyPrimaryButton label="Continuar" onPress={continueToMethod} />}>
      <View style={styles.amountSection}>
        <Text style={styles.currency}>AOA</Text>
        <Text style={[styles.amount, !amountDigits && styles.amountEmpty]}>
          {amountFormatted}
        </Text>
        <View style={styles.balancePill}>
          <Text style={styles.balanceText}>SALDO: AOA {ADD_MONEY_BALANCE}</Text>
        </View>
      </View>

      <NumericKeypad onDigit={addDigit} onDelete={deleteDigit} variant="dark" />
    </AddMoneyShell>
  );
}

const styles = StyleSheet.create({
  amountSection: {
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 12,
  },
  currency: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.55)',
    marginBottom: 8,
  },
  amount: {
    fontSize: 52,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  amountEmpty: {
    color: 'rgba(255,255,255,0.35)',
  },
  balancePill: {
    marginTop: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  balanceText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 0.4,
  },
});
