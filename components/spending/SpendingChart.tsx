import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { SpendingChartSummary } from '@/constants/spending-chart';

const NAVY = '#1A1A4E';

type Props = {
  summary: SpendingChartSummary;
  compact?: boolean;
  onPress?: () => void;
};

export function SpendingChart({ summary, compact = false, onPress }: Props) {
  const maxAmount = Math.max(...summary.categories.map((item) => item.amount));
  const visibleCategories = compact ? summary.categories.slice(0, 4) : summary.categories;

  const content = (
    <>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>Gráfico de Gastos</Text>
          <Text style={styles.month}>{summary.monthLabel}</Text>
        </View>
        <View style={styles.totalWrap}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{summary.totalLabel}</Text>
        </View>
      </View>

      <View style={[styles.stackedBar, compact && styles.stackedBarCompact]}>
        {summary.categories.map((item) => (
          <View
            key={item.id}
            style={[styles.stackedSegment, { flex: item.percent, backgroundColor: item.color }]}
          />
        ))}
      </View>

      {!compact ? (
        <View style={styles.barChart}>
          {summary.categories.map((item) => {
            const barHeight = Math.max(16, (item.amount / maxAmount) * 96);
            return (
              <View key={item.id} style={styles.barCol}>
                <Text style={styles.barPercent}>{item.percent}%</Text>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { height: barHeight, backgroundColor: item.color },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel} numberOfLines={2}>
                  {item.label.split(' ')[0]}
                </Text>
              </View>
            );
          })}
        </View>
      ) : null}

      <View style={styles.legend}>
        {visibleCategories.map((item) => (
          <View key={item.id} style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.legendLabel}>{item.label}</Text>
            <Text style={styles.legendAmount}>{item.amountLabel}</Text>
          </View>
        ))}
      </View>

      {compact && onPress ? (
        <View style={styles.compactFooter}>
          <Text style={styles.compactLink}>Ver gráfico completo</Text>
          <Ionicons name="chevron-forward" size={16} color={NAVY} />
        </View>
      ) : null}
    </>
  );

  if (compact && onPress) {
    return (
      <Pressable style={styles.card} accessibilityRole="button" onPress={onPress}>
        {content}
      </Pressable>
    );
  }

  return <View style={styles.card}>{content}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  month: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '800',
    color: NAVY,
  },
  totalWrap: { alignItems: 'flex-end' },
  totalLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  totalValue: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: '800',
    color: NAVY,
  },
  stackedBar: {
    flexDirection: 'row',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 20,
  },
  stackedBarCompact: {
    marginBottom: 14,
  },
  stackedSegment: {
    minWidth: 4,
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  barPercent: {
    fontSize: 11,
    fontWeight: '700',
    color: NAVY,
  },
  barTrack: {
    width: '100%',
    height: 96,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  barFill: {
    width: '72%',
    borderRadius: 6,
    minHeight: 16,
  },
  barLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 13,
  },
  legend: { gap: 10 },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  legendAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: NAVY,
  },
  compactFooter: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compactLink: {
    fontSize: 13,
    fontWeight: '700',
    color: NAVY,
  },
});
