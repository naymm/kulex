import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AGENT_OPERATION_TYPE_ICONS,
  AGENT_OPERATION_TYPE_LABELS,
  type AgentOperationType,
} from '@/constants/agent';
import { getAgentHistory } from '@/lib/agent';
import { goBackFromOrigin } from '@/lib/navigation';

const NAVY = '#1A1A4E';

type Filter = AgentOperationType | 'all';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'activation', label: 'Abertura' },
  { id: 'cash-in', label: 'Cash-in' },
  { id: 'cash-out', label: 'Cash-out' },
  { id: 'card-issue', label: 'Cartão' },
];

export default function AgentHistoricoScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>('all');
  const items = useMemo(() => getAgentHistory(filter), [filter]);

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
          <Text style={styles.headerTitle}>Histórico</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}>
        {FILTERS.map((item) => {
          const active = filter === item.id;
          return (
            <Pressable
              key={item.id}
              style={[styles.chip, active && styles.chipActive]}
              accessibilityRole="button"
              onPress={() => setFilter(item.id)}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{item.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 24 },
        ]}
        showsVerticalScrollIndicator={false}>
        {items.map((item) => (
          <View key={item.id} style={styles.row}>
            <View style={styles.rowIcon}>
              <Ionicons
                name={AGENT_OPERATION_TYPE_ICONS[item.type]}
                size={20}
                color={NAVY}
              />
            </View>
            <View style={styles.rowInfo}>
              <Text style={styles.rowTitle}>
                {AGENT_OPERATION_TYPE_LABELS[item.type]} · {item.clientName}
              </Text>
              <Text style={styles.rowMeta}>
                {item.dateLabel} · {item.timeLabel}
                {item.amount !== '—' ? ` · ${item.amount}` : ''}
              </Text>
            </View>
            <Text style={styles.rowCommission}>{item.commission}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: {
    backgroundColor: NAVY,
    paddingHorizontal: 20,
    paddingBottom: 16,
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
  filterScroll: { maxHeight: 52, backgroundColor: '#FFFFFF' },
  filterContent: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipActive: { backgroundColor: NAVY, borderColor: NAVY },
  chipText: { fontSize: 12, fontWeight: '700', color: '#6B7280' },
  chipTextActive: { color: '#FFFFFF' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 18, paddingTop: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  rowIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EEF0F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowInfo: { flex: 1 },
  rowTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
  rowMeta: { marginTop: 3, fontSize: 12, fontWeight: '500', color: '#9CA3AF' },
  rowCommission: { fontSize: 14, fontWeight: '800', color: '#16A34A' },
});
