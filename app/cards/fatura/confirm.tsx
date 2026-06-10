import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  AddMoneyPrimaryButton,
  AddMoneyShell,
} from '@/components/add-money/AddMoneyShell';
import { DEFAULT_ACCOUNT_ID, getAccountById, parseAccountBalance } from '@/constants/accounts';
import { POSTPAID_BLACK_CARD } from '@/constants/card';
import {
  digitsToMoneyFormatted,
  formatMoneyAmount,
  getBillPaymentLabel,
  parseMoneyAmount,
} from '@/lib/postpaid-bill';
import { getPostpaidWalletState } from '@/lib/postpaid-wallet';

function ConfirmRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function PostpaidBillConfirmScreen() {
  const { amount, accountId } = useLocalSearchParams<{
    amount?: string;
    accountId?: string;
  }>();

  const amountDigits = typeof amount === 'string' ? amount : '';
  const amountFormatted = useMemo(() => digitsToMoneyFormatted(amountDigits), [amountDigits]);

  const account = useMemo(
    () => getAccountById(typeof accountId === 'string' ? accountId : DEFAULT_ACCOUNT_ID),
    [accountId],
  );

  const wallet = useMemo(() => getPostpaidWalletState(), []);

  const paymentLabel = useMemo(
    () => getBillPaymentLabel(amountFormatted, wallet.plafond, wallet.available),
    [amountFormatted, wallet],
  );

  const balanceAfter = useMemo(() => {
    const balance = parseAccountBalance(account.balance);
    const pay = parseMoneyAmount(amountFormatted);
    return formatMoneyAmount(Math.max(0, balance - pay));
  }, [account.balance, amountFormatted]);

  return (
    <AddMoneyShell
      title="Confirmação"
      footer={
        <AddMoneyPrimaryButton
          label="Continuar"
          onPress={() =>
            router.push({
              pathname: '/cards/fatura/pin',
              params: {
                amount: amountDigits,
                accountId: account.id,
              },
            })
          }
        />
      }>
      <View style={styles.card}>
        <ConfirmRow label="Cartão" value={POSTPAID_BLACK_CARD.label} />
        <ConfirmRow label="Período" value={POSTPAID_BLACK_CARD.bill.periodLabel} />
        <ConfirmRow label="Tipo de pagamento" value={paymentLabel} />
        <ConfirmRow label="Montante" value={`AOA ${amountFormatted}`} />
        <ConfirmRow label="Conta" value={`${account.shortLabel} · ${account.name}`} />
        <ConfirmRow label="Tipo de conta" value={account.accountType} />
        <ConfirmRow label="Saldo disponível" value={account.balance} />
        <ConfirmRow label="Saldo após pagamento" value={`AOA ${balanceAfter}`} last />
      </View>

      <Text style={styles.note}>
        O valor será deduzido da conta {account.shortLabel} e o plafond disponível será actualizado
        após confirmação.
      </Text>
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
  note: {
    marginTop: 18,
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 18,
  },
});
