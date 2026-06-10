import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AddMoneyPrimaryButton, AddMoneyShell } from '@/components/add-money/AddMoneyShell';
import { AgentClientPreview } from '@/components/agent/AgentClientPreview';
import { NumericKeypad } from '@/components/send-money/NumericKeypad';
import { AGENT_FLOAT_BALANCE } from '@/constants/agent';
import { formatMoneyFromDigitsAsCents, normalizeDigits } from '@/lib/money';

export default function AgentCarregarValorScreen() {
  const { phone, clientName } = useLocalSearchParams<{ phone?: string; clientName?: string }>();
  const clientPhone = typeof phone === 'string' ? phone : '';
  const name = typeof clientName === 'string' ? clientName : '';
  const [amountDigits, setAmountDigits] = useState('');

  const amountFormatted = useMemo(
    () => formatMoneyFromDigitsAsCents(amountDigits),
    [amountDigits],
  );

  const continueFlow = () => {
    if (!clientPhone || !name || !amountDigits || amountDigits === '0') return;
    router.push({
      pathname: '/agent/carregar/confirm',
      params: { phone: clientPhone, clientName: name, amount: amountDigits },
    });
  };

  return (
    <AddMoneyShell
      title="Montante cash-in"
      footer={<AddMoneyPrimaryButton label="Continuar" onPress={continueFlow} />}>
      <AgentClientPreview phone={clientPhone} name={name} variant="compact" />

      <View style={styles.amountSection}>
        <Text style={styles.amountLabel}>Montante a carregar</Text>
        <View style={styles.amountRow}>
          <Text style={styles.currency}>AOA </Text>
          <Text style={[styles.amount, !amountDigits && styles.amountEmpty]}>
            {amountFormatted}
          </Text>
        </View>
        <View style={styles.balancePill}>
          <Text style={styles.balanceText}>FLOAT: AOA {AGENT_FLOAT_BALANCE}</Text>
        </View>
      </View>

      <NumericKeypad
        onDigit={(digit) => setAmountDigits((prev) => normalizeDigits(prev + digit))}
        onDelete={() => setAmountDigits((prev) => prev.slice(0, -1))}
        variant="dark"
      />
    </AddMoneyShell>
  );
}

const styles = StyleSheet.create({
  amountSection: { alignItems: 'center', marginTop: 24, marginBottom: 12 },
  amountLabel: { fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.55)', marginBottom: 8 },
  amountRow: { flexDirection: 'row', alignItems: 'baseline' },
  currency: { fontSize: 22, fontWeight: '500', color: 'rgba(255,255,255,0.55)' },
  amount: { fontSize: 48, fontWeight: '700', color: '#FFFFFF', letterSpacing: -1 },
  amountEmpty: { color: 'rgba(255,255,255,0.35)' },
  balancePill: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  balanceText: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.65)' },
});
