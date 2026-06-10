import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CreditoFlowHeader } from '@/components/credito-flow/CreditoFlowHeader';
import { ADIANTAMENTO_CREDIT, ADIANTAMENTO_CREDIT_ID } from '@/constants/credit-line';
import {
  getCreditAdvances,
  getCreditAdvancesUsedTotal,
  getCreditLineAvailableFormatted,
} from '@/lib/credit-advances';
import { formatMoneyAmount } from '@/lib/postpaid-bill';
import { isAdiantamentoCreditId } from '@/lib/credit-loans';

type CreditDetails = {
  id: string;
  title: string;
  resumo: Array<{ label: string; value: string }>;
  plano: Array<{
    title: string;
    date: string;
    amount: string;
    status: string;
    paid?: boolean;
  }>;
};

const DETAILS: Record<string, CreditDetails> = {
  'maka-zero': {
    id: 'maka-zero',
    title: 'Maka Zero',
    resumo: [
      { label: 'Montante Solicitado', value: '50.000,00 kz' },
      { label: 'Comissão de Utilização', value: '5.700,00 kz' },
      { label: 'IVA', value: '300,00 kz' },
      { label: 'Montante a Receber', value: '44.000,00 kz' },
      { label: 'Prazo', value: '60 dias' },
    ],
    plano: [
      {
        title: '1ª Prestação',
        date: 'Data: 23/06/2026',
        amount: '25.000,00 kz',
        status: 'Pago',
        paid: true,
      },
      {
        title: '2ª Prestação',
        date: 'Data: 23/07/2026',
        amount: '25.000,00 kz',
        status: 'Por pagar',
        paid: false,
      },
    ],
  },
  empreendedor: {
    id: 'empreendedor',
    title: 'Empreendedor',
    resumo: [
      { label: 'Montante Solicitado', value: '650.000,00 kz' },
      { label: 'Comissão de Utilização', value: '120.000,00 kz' },
      { label: 'IVA', value: '18.000,00 kz' },
      { label: 'Montante a Receber', value: '512.000,00 kz' },
      { label: 'Prazo', value: '60 dias' },
    ],
    plano: [
      {
        title: '1ª Prestação',
        date: 'Data: 23/06/2026',
        amount: '325.000,00 kz',
        status: 'Pago',
        paid: true,
      },
      {
        title: '2ª Prestação',
        date: 'Data: 23/07/2026',
        amount: '325.000,00 kz',
        status: 'Por pagar',
        paid: false,
      },
    ],
  },
};

export default function MeusCreditosDetalhes() {
  const insets = useSafeAreaInsets();
  const { credit } = useLocalSearchParams<{ credit?: string }>();
  const id = typeof credit === 'string' ? credit : 'maka-zero';
  const isAdiantamento = isAdiantamentoCreditId(id);
  const data = useMemo(() => DETAILS[id] ?? DETAILS['maka-zero'], [id]);
  const [advances, setAdvances] = useState(getCreditAdvances);
  const [usedTotal, setUsedTotal] = useState(getCreditAdvancesUsedTotal);

  useFocusEffect(
    useCallback(() => {
      setAdvances(getCreditAdvances());
      setUsedTotal(getCreditAdvancesUsedTotal());
    }, []),
  );

  if (isAdiantamento) {
    const canSettleAll = advances.length > 0;

    return (
      <View style={styles.container}>
        <CreditoFlowHeader title={ADIANTAMENTO_CREDIT.title} icon="flash-outline" />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: Math.max(insets.bottom, 12) + (canSettleAll ? 90 : 24) },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Resumo</Text>
          <View style={styles.hr} />

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Limite disponível</Text>
            <Text style={styles.rowValue}>
              AOA {formatMoneyAmount(ADIANTAMENTO_CREDIT.limit)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Utilizado</Text>
            <Text style={styles.rowValue}>AOA {formatMoneyAmount(usedTotal)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Disponível</Text>
            <Text style={styles.rowValue}>AOA {getCreditLineAvailableFormatted()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Prazo padrão</Text>
            <Text style={styles.rowValue}>{ADIANTAMENTO_CREDIT.termDays} dias</Text>
          </View>

          <Text style={[styles.sectionTitle2, { marginTop: 22 }]}>Adiantamentos</Text>
          <View style={styles.hr2} />

          {advances.length === 0 ? (
            <Text style={styles.emptyText}>Sem adiantamentos activos.</Text>
          ) : (
            advances.map((advance, idx) => (
              <Pressable
                key={advance.id}
                style={[styles.planRow, idx === 0 && styles.planRowTop]}
                accessibilityRole="button"
                onPress={() =>
                  router.push({
                    pathname: '/credito-flow/meus-creditos/adiantamento/[id]',
                    params: { id: advance.id },
                  })
                }>
                <View style={[styles.planIcon, styles.planIconOpen]}>
                  <Ionicons name="receipt-outline" size={18} color="#166534" />
                </View>
                <View style={styles.planText}>
                  <Text style={styles.planTitle}>{advance.title}</Text>
                  <Text style={styles.planDate}>{advance.description}</Text>
                  <Text style={styles.planDate}>Vence: {advance.dueDateLabel}</Text>
                </View>
                <View style={styles.planRight}>
                  <Text style={[styles.planAmount, styles.planAmountGreen]}>
                    {advance.amountFormatted} kz
                  </Text>
                  <Text style={styles.planStatus}>Por pagar</Text>
                  <Ionicons name="chevron-forward" size={16} color="#9CA3AF" style={styles.chevron} />
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>

        {canSettleAll ? (
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            <Pressable
              style={styles.primaryBtn}
              accessibilityRole="button"
              onPress={() =>
                router.push({
                  pathname: '/credito-flow/meus-creditos/adiantamento/pagar',
                  params: { mode: 'all', credit: ADIANTAMENTO_CREDIT_ID },
                })
              }>
              <Text style={styles.primaryBtnText}>Liquidar todos</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CreditoFlowHeader title={data.title} icon="speedometer-outline" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 12) + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Resumo</Text>
        <View style={styles.hr} />

        {data.resumo.map((r) => (
          <View key={r.label} style={styles.row}>
            <Text style={styles.rowLabel}>{r.label}</Text>
            <Text style={styles.rowValue}>{r.value}</Text>
          </View>
        ))}

        <Text style={[styles.sectionTitle2, { marginTop: 22 }]}>Plano de Pagamento</Text>
        <View style={styles.hr2} />

        {data.plano.map((p, idx) => (
          <View key={p.title} style={[styles.planRow, idx === 0 && styles.planRowTop]}>
            <View style={[styles.planIcon, p.paid ? styles.planIconPaid : styles.planIconOpen]}>
              <Ionicons name="camera-outline" size={18} color={p.paid ? '#111827' : '#166534'} />
            </View>
            <View style={styles.planText}>
              <Text style={styles.planTitle}>{p.title}</Text>
              <Text style={styles.planDate}>{p.date}</Text>
            </View>
            <View style={styles.planRight}>
              <Text style={[styles.planAmount, !p.paid && styles.planAmountGreen]}>
                {p.amount}
              </Text>
              <Text style={styles.planStatus}>{p.status}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 22, paddingTop: 22 },
  sectionTitle: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  hr: { marginTop: 10, marginBottom: 10, height: 1, backgroundColor: '#E5E7EB' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  rowLabel: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
  rowValue: { fontSize: 12, color: '#111827', fontWeight: '800' },
  sectionTitle2: { fontSize: 16, color: '#111827', fontWeight: '700' },
  hr2: { marginTop: 10, height: 1, backgroundColor: '#E5E7EB' },
  planRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16 },
  planRowTop: { paddingTop: 18 },
  planIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  planIconOpen: { borderWidth: 1.5, borderColor: '#166534' },
  planIconPaid: { borderWidth: 1.5, borderColor: '#111827' },
  planText: { flex: 1 },
  planTitle: { fontSize: 12, fontWeight: '800', color: '#111827' },
  planDate: { marginTop: 4, fontSize: 11, fontWeight: '500', color: '#6B7280' },
  planRight: { alignItems: 'flex-end' },
  planAmount: { fontSize: 12, fontWeight: '800', color: '#111827' },
  planAmountGreen: { color: '#166534' },
  planStatus: { marginTop: 4, fontSize: 11, fontWeight: '500', color: '#6B7280' },
  chevron: { marginTop: 6 },
  emptyText: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
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
    backgroundColor: '#1A1A4E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
