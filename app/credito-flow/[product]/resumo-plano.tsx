import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CreditoFlowHeader, NAVY } from '@/components/credito-flow/CreditoFlowHeader';

function titleFromKey(key: string) {
  switch (key) {
    case 'maka-zero':
      return 'Maka Zero';
    case 'empreendedor':
      return 'Empreendedor';
    case 'familia':
      return 'Família';
    default:
      return 'Maka Zero';
  }
}

export default function ResumoPlano() {
  const insets = useSafeAreaInsets();
  const { product } = useLocalSearchParams<{ product?: string }>();
  const key = typeof product === 'string' ? product : 'maka-zero';
  const title = useMemo(() => titleFromKey(key), [key]);

  return (
    <View style={styles.container}>
      <CreditoFlowHeader title="Resumo e Plano" />

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

        <SummaryRow label="Produto" value={title.replace(' ', '')} />
        <SummaryRow label="Montante Solicitado" value="50.000,00 kz" />
        <SummaryRow label="Comissão de Utilização" value="5.700,00 kz" />
        <SummaryRow label="IVA" value="300,00 kz" />
        <SummaryRow label="Montante a Receber" value="44.000,00 kz" />
        <SummaryRow label="Prazo" value="60 dias" />

        <Text style={[styles.sectionTitle, { marginTop: 22 }]}>
          Plano de Pagamento
        </Text>
        <View style={styles.hr} />

        <PlanRow
          title="1ª Prestação"
          date="Data: 23/06/2026"
          amount="25.000,00 kz"
        />
        <PlanRow
          title="2ª Prestação"
          date="Data: 23/07/2026"
          amount="25.000,00 kz"
        />

        <Pressable
          style={styles.primaryBtn}
          onPress={() =>
            router.push({
              pathname: '/credito-flow/sucesso',
              params: { product: key },
            })
          }
        >
          <Text style={styles.primaryText}>Enviar</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function SummaryRow({
  label,
  value,
  valueGreen,
}: {
  label: string;
  value: string;
  valueGreen?: boolean;
}) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, valueGreen && styles.summaryValueGreen]}>
        {value}
      </Text>
    </View>
  );
}

function PlanRow({
  title,
  date,
  amount,
}: {
  title: string;
  date: string;
  amount: string;
}) {
  return (
    <View style={styles.planRow}>
      <View style={styles.planIcon}>
        <Ionicons name="camera-outline" size={18} color="#000000" />
      </View>
      <View style={styles.planText}>
        <Text style={styles.planTitle}>{title}</Text>
        <Text style={styles.planDate}>{date}</Text>
      </View>
      <Text style={styles.planAmount}>{amount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 22, paddingTop: 18 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  hr: {
    marginTop: 10,
    marginBottom: 14,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
  },
  summaryLabel: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
  summaryValue: { fontSize: 12, color: '#111827', fontWeight: '700' },
  summaryValueGreen: { color: '#000000', fontWeight: '800' },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  planIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  planText: { flex: 1 },
  planTitle: { fontSize: 12, fontWeight: '800', color: '#111827' },
  planDate: { marginTop: 4, fontSize: 11, color: '#6B7280', fontWeight: '500' },
  planAmount: { fontSize: 12, fontWeight: '800', color: '#111827' },
  primaryBtn: {
    marginTop: 22,
    height: 54,
    borderRadius: 27,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
