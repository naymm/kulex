import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AGENT_COMMISSION_PERIODS,
  type AgentCommissionPeriod,
} from '@/constants/agent';
import { goBackFromOrigin } from '@/lib/navigation';

const NAVY = '#1A1A4E';
const GOLD = '#C9A227';

export default function AgentComissoesScreen() {
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<AgentCommissionPeriod>('month');
  const selected = AGENT_COMMISSION_PERIODS.find((item) => item.period === period)!;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerPattern} />
        <View style={styles.headerRow}>
          <Pressable
            style={styles.backBtn}
            accessibilityRole="button"
            onPress={() => goBackFromOrigin(undefined, () => router.back())}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Comissões</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 24 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.tabs}>
          {AGENT_COMMISSION_PERIODS.map((item) => {
            const active = item.period === period;
            return (
              <Pressable
                key={item.period}
                style={[styles.tab, active && styles.tabActive]}
                accessibilityRole="button"
                onPress={() => setPeriod(item.period)}>
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total de comissões</Text>
          <Text style={styles.summaryTotal}>{selected.total}</Text>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{selected.transactions}</Text>
              <Text style={styles.statLabel}>Transacções</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{selected.activations}</Text>
              <Text style={styles.statLabel}>Activações</Text>
            </View>
          </View>
        </View>

        <Pressable
          style={styles.transferBtn}
          accessibilityRole="button"
          onPress={() => router.push('/agent/transferir')}>
          <Ionicons name="swap-horizontal-outline" size={20} color={NAVY} />
          <Text style={styles.transferBtnText}>Transferir para conta pessoal</Text>
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
    paddingBottom: 20,
    overflow: 'hidden',
  },
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
  scroll: { flex: 1, marginTop: -12 },
  content: { paddingHorizontal: 18, paddingTop: 8 },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabActive: { backgroundColor: NAVY },
  tabText: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  tabTextActive: { color: '#FFFFFF' },
  summaryCard: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
  },
  summaryLabel: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  summaryTotal: {
    marginTop: 8,
    fontSize: 36,
    fontWeight: '800',
    color: NAVY,
    letterSpacing: -0.5,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 20,
    paddingTop: 18,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
    width: '100%',
  },
  stat: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800', color: '#111827' },
  statLabel: { marginTop: 4, fontSize: 12, fontWeight: '500', color: '#9CA3AF' },
  statDivider: { width: StyleSheet.hairlineWidth, backgroundColor: '#E5E7EB' },
  transferBtn: {
    marginTop: 16,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: GOLD,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  transferBtnText: { fontSize: 14, fontWeight: '700', color: NAVY },
});
