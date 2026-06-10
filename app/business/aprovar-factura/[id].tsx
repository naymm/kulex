import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { markBusinessNotificationRead } from '@/lib/business';
import { goBackFromOrigin } from '@/lib/navigation';

const NAVY = '#1A1A4E';
const TEAL = '#2FB7A9';

const MOCK_INVOICE = {
  client: 'Cliente balcão',
  description: 'Venda de produtos diversos',
  amount: '45.000,00 kz',
  vat: 'Isento (0%)',
  type: 'Factura simplificada',
  date: '05 Jun 2026',
};

export default function BusinessAprovarFacturaScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const invoiceId = id?.toUpperCase() ?? 'FS-2026-089';

  const approve = () => {
    markBusinessNotificationRead('bn1');
    router.back();
  };

  const reject = () => {
    markBusinessNotificationRead('bn1');
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerPattern} />
        <View style={styles.headerRow}>
          <Pressable
            style={styles.backBtn}
            onPress={() => goBackFromOrigin(undefined, () => router.back())}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Aprovar factura</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.pendingBadge}>
          <Ionicons name="time-outline" size={18} color="#D97706" />
          <Text style={styles.pendingText}>Pendente de aprovação</Text>
        </View>

        <Text style={styles.invoiceId}>#{invoiceId}</Text>
        <Text style={styles.invoiceType}>{MOCK_INVOICE.type}</Text>

        <View style={styles.detailsCard}>
          <DetailRow label="Cliente" value={MOCK_INVOICE.client} />
          <DetailRow label="Descrição" value={MOCK_INVOICE.description} />
          <DetailRow label="Data" value={MOCK_INVOICE.date} />
          <DetailRow label="IVA" value={MOCK_INVOICE.vat} />
          <DetailRow label="Total" value={MOCK_INVOICE.amount} highlight />
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.rejectBtn} onPress={reject}>
            <Text style={styles.rejectText}>Rejeitar</Text>
          </Pressable>
          <Pressable style={styles.approveBtn} onPress={approve}>
            <Text style={styles.approveText}>Aprovar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function DetailRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View style={[styles.detailRow, highlight && styles.detailRowHighlight]}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, highlight && styles.detailValueHighlight]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: { backgroundColor: NAVY, paddingHorizontal: 20, paddingBottom: 16, overflow: 'hidden' },
  headerPattern: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderBottomLeftRadius: 100,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  content: { padding: 18 },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    marginBottom: 16,
  },
  pendingText: { fontSize: 13, fontWeight: '700', color: '#D97706' },
  invoiceId: { fontSize: 24, fontWeight: '800', color: '#111827' },
  invoiceType: { marginTop: 4, fontSize: 14, fontWeight: '500', color: '#6B7280' },
  detailsCard: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
  },
  detailRowHighlight: { borderBottomWidth: 0 },
  detailLabel: { fontSize: 14, color: '#6B7280' },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#111827' },
  detailValueHighlight: { fontSize: 18, fontWeight: '800', color: TEAL },
  actions: { flexDirection: 'row', gap: 12, marginTop: 24 },
  rejectBtn: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectText: { fontSize: 16, fontWeight: '700', color: '#6B7280' },
  approveBtn: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  approveText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
