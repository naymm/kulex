import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  AddMoneyPrimaryButton,
  AddMoneyShell,
} from '@/components/add-money/AddMoneyShell';
import { NumericKeypad } from '@/components/send-money/NumericKeypad';
import { getTransferAccounts, myAccountsParamsToRoute, parseMyAccountsParams } from '@/lib/my-accounts';
import { formatMoneyFromDigitsAsCents, normalizeDigits } from '@/lib/money';

export default function MyAccountsTransferAmountScreen() {
  const params = parseMyAccountsParams(useLocalSearchParams());
  const { fromAccount } = getTransferAccounts(params);
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

  const continueToConfirm = () => {
    if (!amountDigits || amountDigits === '0') return;
    router.push({
      pathname: '/send-money/minhas-contas/confirm',
      params: myAccountsParamsToRoute({ ...params, amount: amountDigits }),
    });
  };

  return (
    <AddMoneyShell
      title="Transferência"
      footer={<AddMoneyPrimaryButton label="Continuar" onPress={continueToConfirm} />}>
      <View style={styles.amountSection}>
        <View style={styles.amountRow}>
          <Text style={styles.currency}>AOA </Text>
          <Text style={[styles.amount, !amountDigits && styles.amountEmpty]}>
            {amountFormatted}
          </Text>
        </View>
        <View style={styles.balancePill}>
          <Text style={styles.balanceText}>SALDO: AOA {fromAccount.balance}</Text>
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
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  currency: {
    fontSize: 22,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.55)',
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
