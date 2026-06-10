import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  AddMoneyPrimaryButton,
  AddMoneyShell,
} from '@/components/add-money/AddMoneyShell';
import {
  getTransferAccounts,
  myAccountsParamsToRoute,
  parseMyAccountsParams,
} from '@/lib/my-accounts';
import { formatMoneyFromDigitsAsCents } from '@/lib/money';

function ConfirmRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function MyAccountsTransferConfirmScreen() {
  const params = parseMyAccountsParams(useLocalSearchParams());
  const { fromAccount, toAccount } = getTransferAccounts(params);
  const amountDigits = params.amount ?? '';

  const amountFormatted = useMemo(
    () => `${formatMoneyFromDigitsAsCents(amountDigits)} kz`,
    [amountDigits]
  );

  return (
    <AddMoneyShell
      title="Detalhes da Transferência"
      footer={
        <AddMoneyPrimaryButton
          label="Continuar"
          onPress={() =>
            router.push({
              pathname: '/send-money/minhas-contas/pin',
              params: myAccountsParamsToRoute(params),
            })
          }
        />
      }>
      <View style={styles.card}>
        <ConfirmRow label="Conta de Origem" value={fromAccount.name} />
        <ConfirmRow label="Conta de Destino" value={toAccount.name} />
        <ConfirmRow label="Montante" value={amountFormatted} />
        <ConfirmRow label="Taxa" value="0,00 kz" />
        <ConfirmRow label="Disponibilidade" value="Imediato" />
        <ConfirmRow label="Custo da Operação" value="0,00 kz" last />
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
