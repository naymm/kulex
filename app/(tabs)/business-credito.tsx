import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BUSINESS_STOCK_CREDIT } from '@/constants/business';

const NAVY = '#1A1A4E';
const TEAL = '#2FB7A9';

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.row, last && styles.rowLast]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function BusinessCreditoTabScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>Crédito de stock</Text>
        <Text style={styles.headerSubtitle}>Capital de giro garantido pelo fluxo de caixa</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 90 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Pré-aprovado até</Text>
          <Text style={styles.amountValue}>{BUSINESS_STOCK_CREDIT.preApprovedLimit}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{BUSINESS_STOCK_CREDIT.status}</Text>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <Row label="Disponível" value={BUSINESS_STOCK_CREDIT.available} />
          <Row label="Utilizado" value={BUSINESS_STOCK_CREDIT.used} />
          <Row label="TAN" value={BUSINESS_STOCK_CREDIT.tan} />
          <Row label="Prazo" value={`${BUSINESS_STOCK_CREDIT.termDays} dias`} />
          <Row label="Próxima renovação" value={BUSINESS_STOCK_CREDIT.nextRenewal} last />
        </View>

        <Text style={styles.infoText}>{BUSINESS_STOCK_CREDIT.description}</Text>

        <Pressable
          style={styles.primaryBtn}
          accessibilityRole="button"
          onPress={() => router.push('/business/credito-stock')}>
          <Text style={styles.primaryBtnText}>Solicitar crédito de stock</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: {
    backgroundColor: NAVY,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerTitle: { fontSize: 28, fontWeight: '800', color: '#FFFFFF' },
  headerSubtitle: { marginTop: 4, fontSize: 14, fontWeight: '500', color: 'rgba(255,255,255,0.65)' },
  scroll: { flex: 1, marginTop: -12 },
  content: { paddingHorizontal: 18, paddingTop: 8 },
  amountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  amountLabel: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  amountValue: { marginTop: 8, fontSize: 32, fontWeight: '800', color: NAVY },
  statusBadge: {
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: '#DCFCE7',
  },
  statusText: { fontSize: 12, fontWeight: '700', color: '#166534' },
  detailsCard: {
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  rowLast: { borderBottomWidth: 0 },
  rowLabel: { fontSize: 14, fontWeight: '500', color: '#6B7280' },
  rowValue: { fontSize: 14, fontWeight: '700', color: '#111827', textAlign: 'right', flex: 1 },
  infoText: {
    marginTop: 16,
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  primaryBtn: {
    marginTop: 20,
    height: 54,
    borderRadius: 27,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
