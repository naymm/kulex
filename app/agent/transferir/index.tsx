import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { AddMoneyPrimaryButton, AddMoneyShell } from '@/components/add-money/AddMoneyShell';
import { AGENT_COMMISSION_BALANCE } from '@/constants/agent';

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function AgentTransferirScreen() {
  return (
    <AddMoneyShell
      title="Transferir comissões"
      footer={
        <AddMoneyPrimaryButton
          label="Continuar"
          onPress={() => router.push('/agent/transferir/pin')}
        />
      }>
      <Text style={styles.intro}>
        Transfira o saldo de comissões para a sua conta pessoal Kulex.
      </Text>
      <View style={styles.card}>
        <Row label="Origem" value="Conta Agente" />
        <Row label="Destino" value="Conta Pessoal" />
        <Row label="Montante" value={AGENT_COMMISSION_BALANCE} last />
      </View>
    </AddMoneyShell>
  );
}

const styles = StyleSheet.create({
  intro: {
    marginTop: 16,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    paddingHorizontal: 12,
  },
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
});
