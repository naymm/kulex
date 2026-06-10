import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  AddMoneyPrimaryButton,
  AddMoneyShell,
} from '@/components/add-money/AddMoneyShell';
import {
  KWIK_CONFIRM_KEY_LABELS,
  KWIK_SOURCE_ACCOUNT,
} from '@/constants/kwik';
import {
  formatKwikKeyDisplay,
  kwikParamsToRoute,
  parseKwikParams,
} from '@/lib/kwik';
import { formatMoneyFromDigitsAsCents } from '@/lib/money';
import { withOriginParams } from '@/lib/navigation';

function ConfirmRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function KwikTransferConfirmScreen() {
  const raw = useLocalSearchParams();
  const { from } = raw;
  const params = parseKwikParams(raw);
  const amountDigits = params.amount ?? '';

  const amountFormatted = useMemo(
    () => `${formatMoneyFromDigitsAsCents(amountDigits)} kz`,
    [amountDigits]
  );

  const keyDisplay = useMemo(
    () => formatKwikKeyDisplay(params.keyType, params.kwikKey),
    [params.keyType, params.kwikKey]
  );

  return (
    <AddMoneyShell
      title="Detalhes do Envio"
      footer={
        <AddMoneyPrimaryButton
          label="Continuar"
          onPress={() =>
            router.push({
              pathname: '/send-money/kwik/pin',
              params: withOriginParams(from, kwikParamsToRoute(params)),
            })
          }
        />
      }>
      <View style={styles.card}>
        <ConfirmRow label="Conta de Origem" value={KWIK_SOURCE_ACCOUNT} />
        <ConfirmRow label="Nome do Beneficiário" value={params.beneficiary || '—'} />
        <ConfirmRow label={KWIK_CONFIRM_KEY_LABELS[params.keyType]} value={keyDisplay || '—'} />
        <ConfirmRow label="Descrição Pessoal" value={params.personalDesc || '—'} />
        <ConfirmRow label="Descrição Destino" value={params.destDesc || '—'} />
        <ConfirmRow label="Montante" value={amountFormatted} />
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
