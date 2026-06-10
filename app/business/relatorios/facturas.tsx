import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BUSINESS_MONTHLY_SUMMARY } from '@/constants/business';
import { goBackFromOrigin } from '@/lib/navigation';

const NAVY = '#1A1A4E';

const INVOICES = [
  { id: 'FN-2026-112', type: 'Normal', client: 'Distribuidora ABC', amount: '890.000,00 kz', date: '04 Jun' },
  { id: 'FS-2026-089', type: 'Simplificada', client: 'Cliente balcão', amount: '45.000,00 kz', date: '03 Jun' },
  { id: 'FN-2026-098', type: 'Normal', client: 'Hotel Talatona', amount: '1.250.000,00 kz', date: '01 Jun' },
];

export default function BusinessFacturasReportScreen() {
  const insets = useSafeAreaInsets();

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
          <Text style={styles.headerTitle}>Facturas emitidas</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.summary}>
          {BUSINESS_MONTHLY_SUMMARY.invoicesIssued} facturas em {BUSINESS_MONTHLY_SUMMARY.monthLabel}
        </Text>
        {INVOICES.map((inv) => (
          <View key={inv.id} style={styles.row}>
            <View>
              <Text style={styles.rowId}>{inv.id}</Text>
              <Text style={styles.rowMeta}>
                {inv.type} · {inv.client} · {inv.date}
              </Text>
            </View>
            <Text style={styles.rowAmount}>{inv.amount}</Text>
          </View>
        ))}
      </ScrollView>
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
  summary: { marginBottom: 14, fontSize: 14, fontWeight: '600', color: '#6B7280' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  rowId: { fontSize: 14, fontWeight: '700', color: '#111827' },
  rowMeta: { marginTop: 3, fontSize: 12, fontWeight: '500', color: '#9CA3AF' },
  rowAmount: { fontSize: 14, fontWeight: '800', color: NAVY },
});
