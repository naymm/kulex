import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  AddMoneyPrimaryButton,
  AddMoneyShell,
} from '@/components/add-money/AddMoneyShell';
import { computeLoadCardSummary } from '@/lib/load-card';

function ConfirmRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function LoadCardConfirmScreen() {
  const { amount } = useLocalSearchParams<{ amount?: string }>();
  const amountDigits = typeof amount === 'string' ? amount : '';
  const summary = useMemo(() => computeLoadCardSummary(amountDigits), [amountDigits]);

  return (
    <AddMoneyShell
      title="Confirmação"
      footer={
        <AddMoneyPrimaryButton
          label="Continuar"
          onPress={() =>
            router.push({
              pathname: '/cards/carregar/pin',
              params: { amount: amountDigits },
            })
          }
        />
      }>
      <View style={styles.card}>
        <ConfirmRow label="Montante" value={summary.amountFormatted} />
        <ConfirmRow label="Taxa" value={summary.feeFormatted} />
        <ConfirmRow label="Saldo Reflectido" value={summary.reflectedFormatted} last />
      </View>
    </AddMoneyShell>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.55)',
  },
  rowValue: {
    flex: 1,
    marginLeft: 16,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'right',
  },
});
