import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NumericKeypad } from '@/components/send-money/NumericKeypad';
import {
  SendMoneyPrimaryButton,
  SendMoneyShell,
} from '@/components/send-money/SendMoneyShell';
import { getContactById } from '@/constants/contacts';
import {
  formatMoneyFromDigitsAsCents,
  normalizeDigits,
} from '@/lib/money';

const BALANCE = '85.400,00';

export default function SendMoneyAmountScreen() {
  const { contact: contactId } = useLocalSearchParams<{ contact?: string }>();
  const contact = useMemo(
    () => getContactById(typeof contactId === 'string' ? contactId : '') ?? getContactById('ruben-troso')!,
    [contactId]
  );
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
      pathname: '/send-money/[contact]/confirm',
      params: { contact: contact.id, amount: amountDigits },
    });
  };

  return (
    <SendMoneyShell
      contact={contact}
      showContact
      footer={
        <SendMoneyPrimaryButton label="Continuar" onPress={continueToConfirm} />
      }>
      <View style={styles.amountSection}>
        <Text style={styles.currency}>AOA</Text>
        <Text style={[styles.amount, !amountDigits && styles.amountEmpty]}>
          {amountFormatted}
        </Text>
        <View style={styles.balancePill}>
          <Text style={styles.balanceText}>SALDO: AOA {BALANCE}</Text>
        </View>
      </View>

      <NumericKeypad onDigit={addDigit} onDelete={deleteDigit} variant="dark" />
    </SendMoneyShell>
  );
}

const styles = StyleSheet.create({
  amountSection: {
    alignItems: 'center',
    marginTop: 36,
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
