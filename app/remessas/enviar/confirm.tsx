import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  AddMoneyPrimaryButton,
  AddMoneyShell,
} from '@/components/add-money/AddMoneyShell';
import { flagEmojiFromIso2 } from '@/constants/countries';
import { buildRemittanceSummary, getCorridorById, getPayoutLabel } from '@/lib/remessas';
import { parseRemessaParams, remessaParamsToRoute } from '@/lib/remessas-route';

function ConfirmRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function RemessaConfirmScreen() {
  const params = parseRemessaParams(useLocalSearchParams());
  const feeMode = params.feeMode ?? 'add';
  const corridor = useMemo(
    () => (params.corridorId ? getCorridorById(params.corridorId) : undefined),
    [params.corridorId],
  );
  const summary = useMemo(
    () => buildRemittanceSummary(params.amountDigits ?? '', params.corridorId ?? '', feeMode),
    [params.amountDigits, params.corridorId, feeMode],
  );

  const payout = params.payoutMethod ?? 'bank';

  return (
    <AddMoneyShell
      title="Confirmação"
      footer={
        <AddMoneyPrimaryButton
          label="Confirmar remessa"
          disabled={!summary.valid}
          onPress={() =>
            router.push({
              pathname: '/remessas/enviar/pin',
              params: remessaParamsToRoute(params),
            })
          }
        />
      }>
      {corridor ? (
        <View style={styles.headerPill}>
          <Text style={styles.headerFlag}>{flagEmojiFromIso2(corridor.countryCode)}</Text>
          <Text style={styles.headerText}>{corridor.countryName}</Text>
        </View>
      ) : null}

      <View style={styles.card}>
        <ConfirmRow label="Beneficiário" value={params.beneficiaryName ?? '—'} />
        {payout === 'bank' ? (
          <>
            <ConfirmRow label="Banco" value={params.beneficiaryBank || '—'} />
            <ConfirmRow label="Conta" value={params.beneficiaryAccount ?? '—'} />
          </>
        ) : null}
        {(payout === 'mobile' || payout === 'cash') && params.beneficiaryPhone ? (
          <ConfirmRow label="Telefone" value={params.beneficiaryPhone} />
        ) : null}
        {payout === 'cash' && params.beneficiaryBank ? (
          <ConfirmRow label="Cidade" value={params.beneficiaryBank} />
        ) : null}
        <ConfirmRow label="Entrega" value={getPayoutLabel(payout)} />
        <ConfirmRow label="Aplicação da taxa" value={summary.feeModeLabel} />

        {feeMode === 'add' ? (
          <>
            <ConfirmRow label="Montante enviado" value={`AOA ${summary.amountFormatted}`} />
            <ConfirmRow label="Taxa (adicional)" value={`AOA ${summary.feeFormatted}`} />
            <ConfirmRow
              label="Beneficiário recebe"
              value={`${summary.foreignFormatted} ${summary.foreignCurrency}`}
            />
            <ConfirmRow label="Total debitado" value={`AOA ${summary.totalFormatted}`} last />
          </>
        ) : (
          <>
            <ConfirmRow label="Total debitado" value={`AOA ${summary.amountFormatted}`} />
            <ConfirmRow label="Taxa (deduzida)" value={`AOA ${summary.feeFormatted}`} />
            <ConfirmRow
              label="Montante convertido"
              value={`AOA ${summary.netAmountFormatted}`}
            />
            <ConfirmRow
              label="Beneficiário recebe"
              value={`${summary.foreignFormatted} ${summary.foreignCurrency}`}
              last
            />
          </>
        )}
      </View>

      <Text style={styles.rateNote}>{summary.rateLabel}</Text>
    </AddMoneyShell>
  );
}

const styles = StyleSheet.create({
  headerPill: {
    marginTop: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerFlag: {
    fontSize: 18,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  card: {
    marginTop: 20,
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
    gap: 16,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
    flex: 1,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'right',
    flex: 1,
  },
  rateNote: {
    marginTop: 16,
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
  },
});
