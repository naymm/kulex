import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  AddMoneyPrimaryButton,
  AddMoneyShell,
} from '@/components/add-money/AddMoneyShell';
import { formatMoneyFromDigitsAsCents } from '@/lib/money';
import { formatIbanDisplay } from '@/lib/iban';
import { computeWithdrawSummary } from '@/lib/withdraw';

const COMISSAO_CENTS = 35000; // 350,00
const IVA_CENTS = 4900;       // 49,00

function ConfirmRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function WithdrawConfirmScreen() {
  const { amount, method, bank, iban, titular, from } = useLocalSearchParams<{
    amount?: string;
    method?: string;
    bank?: string;
    iban?: string;
    titular?: string;
    from?: string;
  }>();

  const methodId = typeof method === 'string' ? method : 'agente';
  const amountDigits = typeof amount === 'string' ? amount : '';
  const isBank = methodId === 'banco';
  const isTransfer = from === 'transfer';

  const summary = useMemo(() => computeWithdrawSummary(amountDigits), [amountDigits]);

  const amountFormatted = useMemo(
    () => formatMoneyFromDigitsAsCents(amountDigits),
    [amountDigits]
  );

  const ibanFormatted = useMemo(
    () => formatIbanDisplay(typeof iban === 'string' ? iban : ''),
    [iban]
  );

  const titularFormatted = useMemo(
    () => (typeof titular === 'string' ? titular : '').trim().toUpperCase(),
    [titular]
  );

  const bankName = typeof bank === 'string' ? bank : '';

  const totalFormatted = useMemo(() => {
    const amountCents = parseInt(amountDigits || '0', 10);
    const totalCents = amountCents + COMISSAO_CENTS + IVA_CENTS;
    return formatMoneyFromDigitsAsCents(String(totalCents));
  }, [amountDigits]);

  return (
    <AddMoneyShell
      title={isTransfer ? 'Transferência' : 'Confirmação'}
      footer={
        <AddMoneyPrimaryButton
          label="Continuar"
          onPress={() =>
            router.push({
              pathname: '/withdraw/pin',
              params: {
                amount: amountDigits,
                method: methodId,
                from: isTransfer ? 'transfer' : undefined,
              },
            })
          }
        />
      }
    >
      <View style={styles.card}>
        {isBank ? (
          <>
            <ConfirmRow label="Banco"    value={bankName} />
            <ConfirmRow label="IBAN"     value={ibanFormatted} />
            <ConfirmRow label="Montante" value={amountFormatted} />
            <ConfirmRow label="Titular"  value={titularFormatted} />
            <ConfirmRow label="Comissão" value="350,00" />
            <ConfirmRow label="IVA"      value="49,00" />
            <ConfirmRow label="Total"    value={totalFormatted} last />
          </>
        ) : (
          <>
            <ConfirmRow label="Montante"         value={summary.amountFormatted} />
            <ConfirmRow label="Taxa"              value={summary.feeFormatted} />
            <ConfirmRow label="Saldo Reflectido"  value={summary.reflectedFormatted} last />
          </>
        )}
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