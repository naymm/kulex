import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AddMoneyPrimaryButton, AddMoneyShell } from '@/components/add-money/AddMoneyShell';
import { formatAgentPhone } from '@/lib/agent-clients';
import { formatMoneyFromDigitsAsCents } from '@/lib/money';

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function AgentCarregarConfirmScreen() {
  const { phone, clientName, amount } = useLocalSearchParams<{
    phone?: string;
    clientName?: string;
    amount?: string;
  }>();
  const amountDigits = typeof amount === 'string' ? amount : '';
  const clientPhone = typeof phone === 'string' ? phone : '';
  const name = typeof clientName === 'string' ? clientName : '';

  const amountFormatted = useMemo(
    () => formatMoneyFromDigitsAsCents(amountDigits),
    [amountDigits],
  );

  return (
    <AddMoneyShell
      title="Confirmar cash-in"
      footer={
        <AddMoneyPrimaryButton
          label="Confirmar"
          onPress={() =>
            router.push({
              pathname: '/agent/carregar/pin',
              params: { phone: clientPhone, clientName: name, amount: amountDigits },
            })
          }
        />
      }>
      <View style={styles.card}>
        <Row label="Operação" value="Cash-in" />
        <Row label="Cliente" value={name} />
        <Row label="Telefone" value={formatAgentPhone(clientPhone)} />
        <Row label="Montante" value={`AOA ${amountFormatted}`} />
        <Row label="Comissão estimada" value="AOA 750,00" last />
      </View>
      <Text style={styles.hint}>
        O montante será creditado na conta do cliente após confirmação com PIN.
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
