import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  AddMoneyPrimaryButton,
  AddMoneyShell,
} from '@/components/add-money/AddMoneyShell';
import { bankParamsToRoute, parseBankParams } from '@/lib/bank-transfer';
import { formatIbanDisplay } from '@/lib/iban';
import { formatMoneyFromDigitsAsCents } from '@/lib/money';
import { withOriginParams } from '@/lib/navigation';

const COMISSAO = '350,00';
const IVA = '49,00';

function ConfirmRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function BancoTransferConfirmScreen() {
  const raw = useLocalSearchParams();
  const { from } = raw;
  const params = parseBankParams(raw);
  const amountDigits = params.amount ?? '';

  const amountFormatted = useMemo(
    () => formatMoneyFromDigitsAsCents(amountDigits),
    [amountDigits]
  );

  const ibanFormatted = useMemo(() => formatIbanDisplay(params.iban), [params.iban]);

  const totalFormatted = useMemo(() => {
    const amountCents = parseInt(amountDigits || '0', 10);
    const totalCents = amountCents + 35000 + 4900;
    return formatMoneyFromDigitsAsCents(String(totalCents));
  }, [amountDigits]);

  const titularFormatted = params.titular.trim().toUpperCase() || '—';

  return (
    <AddMoneyShell
      title="Detalhes do Envio"
      footer={
        <AddMoneyPrimaryButton
          label="Continuar"
          onPress={() =>
            router.push({
              pathname: '/send-money/banco/pin',
              params: withOriginParams(from, bankParamsToRoute(params)),
            })
          }
        />
      }>
      <View style={styles.card}>
        <ConfirmRow label="Banco" value={params.bank || '—'} />
        <ConfirmRow label="IBAN" value={ibanFormatted || '—'} />
        <ConfirmRow label="Beneficiário" value={titularFormatted} />
        <ConfirmRow label="Montante" value={amountFormatted} />
        <ConfirmRow label="Comissão" value={COMISSAO} />
        <ConfirmRow label="IVA" value={IVA} />
        <ConfirmRow label="Total" value={totalFormatted} />
        <ConfirmRow label="Disponibilidade" value="1-2 dias úteis" last />
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
