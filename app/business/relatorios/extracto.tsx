import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  BUSINESS_MONTHLY_SUMMARY,
  BUSINESS_RECENT_TRANSACTIONS,
} from '@/constants/business';
import { goBackFromOrigin } from '@/lib/navigation';

const NAVY = '#1A1A4E';

export default function BusinessExtractoScreen() {
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
          <Text style={styles.headerTitle}>Extracto mensal</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>{BUSINESS_MONTHLY_SUMMARY.monthLabel}</Text>
          <Text style={styles.summaryValue}>{BUSINESS_MONTHLY_SUMMARY.totalReceived}</Text>
          <Text style={styles.summaryMeta}>
            {BUSINESS_MONTHLY_SUMMARY.transactionCount} transacções
          </Text>
        </View>

        {BUSINESS_RECENT_TRANSACTIONS.map((tx) => (
          <View key={tx.id} style={styles.row}>
            <Text style={styles.rowTitle}>{tx.title}</Text>
            <Text style={styles.rowAmount}>{tx.amount}</Text>
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
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryLabel: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  summaryValue: { marginTop: 8, fontSize: 28, fontWeight: '800', color: NAVY },
  summaryMeta: { marginTop: 6, fontSize: 13, fontWeight: '500', color: '#9CA3AF' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  rowTitle: { fontSize: 14, fontWeight: '600', color: '#111827' },
  rowAmount: { fontSize: 14, fontWeight: '700', color: NAVY },
});
