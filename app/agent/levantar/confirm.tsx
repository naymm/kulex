import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AddMoneyPrimaryButton, AddMoneyShell } from '@/components/add-money/AddMoneyShell';
import { formatWithdrawReference } from '@/lib/agent-withdraw';
import { computeWithdrawSummary } from '@/lib/withdraw';

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function AgentLevantarConfirmScreen() {
  const { reference, amount } = useLocalSearchParams<{
    reference?: string;
    amount?: string;
  }>();
  const referenceDigits = typeof reference === 'string' ? reference : '';
  const amountDigits = typeof amount === 'string' ? amount : '';

  const display = useMemo(() => {
    const fees = computeWithdrawSummary(amountDigits);
    return {
      referenceFormatted: formatWithdrawReference(referenceDigits),
      amountFormatted: fees.amountFormatted,
      feeFormatted: fees.feeFormatted,
      clientTotalFormatted: fees.reflectedFormatted,
      commissionFormatted: '500,00',
    };
  }, [amountDigits, referenceDigits]);

  return (
    <AddMoneyShell
      title="Resumo do levantamento"
      footer={
        <AddMoneyPrimaryButton
          label="Confirmar"
          onPress={() =>
            router.push({
              pathname: '/agent/levantar/validar',
              params: { reference: referenceDigits, amount: amountDigits },
            })
          }
        />
      }>
      <View style={styles.card}>
        <Row label="Operação" value="Cash-out" />
        <Row label="Referência" value={display.referenceFormatted} />
        <Row label="Montante" value={`AOA ${display.amountFormatted}`} />
        <Row label="Taxa" value={`AOA ${display.feeFormatted}`} />
        <Row label="Total a entregar ao cliente" value={`AOA ${display.clientTotalFormatted}`} />
        <Row label="Comissão do agente" value={`AOA ${display.commissionFormatted}`} last />
      </View>
      <Text style={styles.hint}>
        Confirme que entregou o dinheiro ao cliente antes de validar a operação.
      </Text>
    </AddMoneyShell>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.15)',
    gap: 12,
  },
  rowLast: { borderBottomWidth: 0 },
  rowLabel: { fontSize: 14, fontWeight: '500', color: 'rgba(255,255,255,0.6)' },
  rowValue: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', textAlign: 'right', flex: 1 },
  hint: {
    marginTop: 16,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
    paddingHorizontal: 12,
  },
});
