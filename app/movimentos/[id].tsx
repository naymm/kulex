import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOVEMENTS } from '@/constants/movimentos';
import { getMovementById, getMovementDetails } from '@/lib/movimentos';

const NAVY = '#1A1A4E';

function DetailRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.detailRow, last && styles.detailRowLast]}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export default function MovimentoDetalheScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const movementId = typeof id === 'string' ? id : '';

  const movement = useMemo(
    () => getMovementById(movementId, MOVEMENTS),
    [movementId]
  );

  const details = useMemo(
    () => (movement ? getMovementDetails(movement) : null),
    [movement]
  );

  if (!movement || !details) {
    return (
      <View style={[styles.container, styles.emptyState, { paddingTop: insets.top + 24 }]}>
        <Pressable style={styles.headerBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </Pressable>
        <Text style={styles.emptyTitle}>Movimento não encontrado</Text>
      </View>
    );
  }

  const isCredit = movement.type === 'credit';

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerPattern} />
        <View style={styles.headerContent}>
          <Pressable style={styles.headerBtn} accessibilityRole="button" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Detalhes</Text>
          <View style={styles.headerBtnPlaceholder} />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Ionicons
              name={isCredit ? 'arrow-down' : 'arrow-up'}
              size={22}
              color="#111827"
            />
          </View>
          <Text style={styles.summaryTitle}>{movement.title}</Text>
          <Text style={styles.summaryAmount}>{movement.amount}</Text>
          <View style={[styles.typeBadge, isCredit ? styles.typeBadgeCredit : styles.typeBadgeDebit]}>
            <Text style={styles.typeBadgeText}>{details.typeLabel}</Text>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <DetailRow label="Refª da Transação" value={details.reference} />
          <DetailRow label="Data" value={movement.dateLabel} />
          <DetailRow label="Hora" value={details.timeLabel} />
          <DetailRow label="Categoria" value={details.category} />
          <DetailRow label="Canal" value={details.channel} />
          <DetailRow label="Estado" value={details.status} last />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: NAVY,
    paddingHorizontal: 20,
    paddingBottom: 24,
    overflow: 'hidden',
  },
  headerPattern: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderBottomLeftRadius: 120,
    borderBottomRightRadius: 80,
    transform: [{ scaleX: 1.4 }, { translateY: -20 }],
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBtnPlaceholder: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  summaryCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 28,
    alignItems: 'center',
  },
  summaryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  summaryAmount: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  typeBadge: {
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  typeBadgeCredit: {
    backgroundColor: 'rgba(34,197,94,0.15)',
  },
  typeBadgeDebit: {
    backgroundColor: 'rgba(239,68,68,0.12)',
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  detailsCard: {
    marginTop: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  detailRowLast: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#6B7280',
  },
  detailValue: {
    flex: 1,
    marginLeft: 16,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'right',
  },
  emptyState: {
    paddingHorizontal: 20,
  },
  emptyTitle: {
    marginTop: 24,
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
});
