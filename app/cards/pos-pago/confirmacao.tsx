import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CardFlowPrimaryButton, CardFlowShell } from '@/components/cards/CardFlowShell';
import { PostpaidCardPreview } from '@/components/cards/PostpaidCardPreview';
import {
  formatPaymentCycleLabel,
  getScoringLabel,
  POSTPAID_CARD_TERMS,
} from '@/constants/postpaid-card';
import { parsePostpaidParams } from '@/lib/postpaid-card';

function DetailRow({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function PostpaidCardConfirmScreen() {
  const insets = useSafeAreaInsets();
  const params = parsePostpaidParams(useLocalSearchParams());

  if (!params) {
    return (
      <CardFlowShell title="Detalhes">
        <View style={styles.errorWrap}>
          <Text style={styles.errorText}>Não foi possível carregar os detalhes do pedido.</Text>
        </View>
      </CardFlowShell>
    );
  }

  const submitRequest = () => {
    router.push({
      pathname: '/cards/pos-pago/sucesso',
      params: {
        cardTierId: params.cardTierId,
        plafondLabel: params.plafondLabel,
        plafondAmount: params.plafondAmount,
        dueDayLabel: params.dueDayLabel,
        dueDay: params.dueDay,
      },
    });
  };

  return (
    <CardFlowShell
      title="Detalhes do cartão"
      footer={
        <CardFlowPrimaryButton
          label="Solicitar cartão pós-pago"
          hint="Ao confirmar, aceita as condições apresentadas"
          onPress={submitRequest}
        />
      }>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 16) + 140 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.previewWrap}>
          <PostpaidCardPreview cardTierId={params.cardTierId} width={280} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resumo da solicitação</Text>
          <DetailRow label="Tipo de cartão" value="Mastercard Pós-pago" />
          <DetailRow label="Cartão" value={getScoringLabel(params.cardTierId)} />
          <DetailRow label="Plafond" value={`AOA ${params.plafondAmount}`} />
          <DetailRow label="Opção de plafond" value={params.plafondLabel} />
          <DetailRow label="Dia de vencimento" value={params.dueDayLabel} />
          <DetailRow label="Scoring" value={params.score} last />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Taxas e condições</Text>
          <DetailRow label="Taxa de juro mensal" value={POSTPAID_CARD_TERMS.interestRateMonthly} />
          <DetailRow label="Taxa de juro anual" value={POSTPAID_CARD_TERMS.interestRateAnnual} />
          <DetailRow label="TAEG" value={POSTPAID_CARD_TERMS.taeg} />
          <DetailRow label="Anuidade" value={POSTPAID_CARD_TERMS.annualFee} last />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ciclo de pagamento</Text>
          <DetailRow
            label="Faturação"
            value={formatPaymentCycleLabel(Number(params.dueDay))}
          />
          <DetailRow label="Pagamento mínimo" value={POSTPAID_CARD_TERMS.minimumPayment} />
          <DetailRow label="Período de carência" value={POSTPAID_CARD_TERMS.gracePeriod} last />
        </View>
      </ScrollView>
    </CardFlowShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  previewWrap: {
    alignItems: 'center',
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  rowLast: {
    paddingBottom: 4,
  },
  rowLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  rowValue: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'right',
  },
  errorWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
});
