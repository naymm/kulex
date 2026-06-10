import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CreditoFlowHeader, NAVY } from '@/components/credito-flow/CreditoFlowHeader';
import { ADIANTAMENTO_CREDIT } from '@/constants/credit-line';
import {
  formatAdvanceCreatedLabel,
  getAdvanceCategoryLabel,
  getCreditAdvanceById,
  type CreditAdvance,
} from '@/lib/credit-advances';

function DetailRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, highlight && styles.rowValueHighlight]}>{value}</Text>
    </View>
  );
}

export default function AdiantamentoDetalheScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const advanceId = typeof id === 'string' ? id : '';
  const [advance, setAdvance] = useState<CreditAdvance | null>(() =>
    getCreditAdvanceById(advanceId),
  );

  useFocusEffect(
    useCallback(() => {
      setAdvance(getCreditAdvanceById(advanceId));
    }, [advanceId]),
  );

  if (!advance) {
    return (
      <View style={styles.container}>
        <CreditoFlowHeader title="Adiantamento" icon="flash-outline" />
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>Adiantamento não encontrado</Text>
          <Text style={styles.emptyText}>
            Este adiantamento pode já ter sido liquidado ou não estar disponível.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CreditoFlowHeader title="Detalhe do adiantamento" icon="flash-outline" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 12) + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statusCard}>
          <Text style={styles.statusEyebrow}>Estado</Text>
          <Text style={styles.statusValue}>Por pagar</Text>
          <Text style={styles.statusAmount}>AOA {advance.amountFormatted}</Text>
        </View>

        <Text style={styles.sectionTitle}>Resumo</Text>
        <View style={styles.hr} />

        <DetailRow label="Operação" value={advance.title} />
        <DetailRow label="Tipo" value={getAdvanceCategoryLabel(advance.category)} />
        <DetailRow label="Descrição" value={advance.description || '—'} />
        <DetailRow label="Montante" value={`AOA ${advance.amountFormatted}`} highlight />
        <DetailRow label="Data do pagamento" value={formatAdvanceCreatedLabel(advance.createdAt)} />
        <DetailRow label="Vencimento" value={advance.dueDateLabel} />
        <DetailRow label="Prazo" value={`${ADIANTAMENTO_CREDIT.termDays} dias`} />
        <DetailRow label="Produto" value={ADIANTAMENTO_CREDIT.title} />

        <Text style={[styles.sectionTitle2, { marginTop: 22 }]}>Informação</Text>
        <View style={styles.hr2} />

        <Text style={styles.infoText}>
          A Kulex efectuou este pagamento em seu nome. O valor encontra-se registado como dívida
          em Meus Créditos e deve ser liquidado até à data de vencimento indicada.
        </Text>
        <Text style={styles.referenceText}>Referência: {advance.id}</Text>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable
          style={styles.primaryBtn}
          accessibilityRole="button"
          onPress={() =>
            router.push({
              pathname: '/credito-flow/meus-creditos/adiantamento/pagar',
              params: { mode: 'single', advanceId: advance.id },
            })
          }>
          <Text style={styles.primaryBtnText}>Liquidar este adiantamento</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 22, paddingTop: 22 },
  statusCard: {
    borderRadius: 16,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#F3E8C4',
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 22,
  },
  statusEyebrow: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  statusValue: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '800',
    color: '#B45309',
  },
  statusAmount: {
    marginTop: 8,
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  sectionTitle: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  hr: { marginTop: 10, marginBottom: 10, height: 1, backgroundColor: '#E5E7EB' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    paddingVertical: 10,
  },
  rowLabel: {
    flex: 1,
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  rowValue: {
    flex: 1,
    fontSize: 12,
    color: '#111827',
    fontWeight: '800',
    textAlign: 'right',
  },
  rowValueHighlight: {
    color: '#1A1A4E',
    fontSize: 13,
  },
  sectionTitle2: { fontSize: 16, color: '#111827', fontWeight: '700' },
  hr2: { marginTop: 10, height: 1, backgroundColor: '#E5E7EB' },
  infoText: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 19,
  },
  referenceText: {
    marginTop: 14,
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 22,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  primaryBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
