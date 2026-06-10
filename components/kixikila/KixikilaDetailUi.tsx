import type { ReactNode } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { KixikilaParticipant } from '@/constants/kixikila';

const NAVY = '#1A1A4E';

export function KixikilaDetailHeader({
  title,
  subtitle,
  onBack,
}: {
  title: string;
  subtitle?: string;
  onBack: () => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
      <View style={styles.headerPattern} />
      <Pressable style={styles.headerBtn} onPress={onBack} accessibilityRole="button">
        <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
      </Pressable>
      <View style={styles.heroRow}>
        <View style={styles.heroIcon}>
          <Text style={styles.heroIconText}>K</Text>
        </View>
        <View style={styles.heroText}>
          <Text style={styles.heroTitle}>{title}</Text>
          {subtitle ? <Text style={styles.heroSubtitle}>{subtitle}</Text> : null}
        </View>
      </View>
    </View>
  );
}

export function KixikilaMetaRow({
  icon,
  label,
  value,
  last,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.metaRow, last && styles.metaRowLast]}>
      <Ionicons name={icon} size={16} color="#6B7280" />
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

export function KixikilaActionRow({
  icon,
  label,
  onPress,
  last,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  last?: boolean;
}) {
  return (
    <Pressable
      style={[styles.actionRow, last && styles.actionRowLast]}
      onPress={onPress}
      accessibilityRole="button">
      <View style={styles.actionLeft}>
        <Ionicons name={icon} size={18} color={NAVY} />
        <Text style={styles.actionLabel}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="#111827" />
    </Pressable>
  );
}

export function KixikilaParticipantRow({
  participant,
  badge,
  trailing,
  last,
}: {
  participant: KixikilaParticipant;
  badge?: string;
  trailing?: ReactNode;
  last?: boolean;
}) {
  return (
    <View style={[styles.participantRow, last && styles.participantRowLast]}>
      <View style={[styles.avatar, { backgroundColor: participant.color }]}>
        <Text style={styles.avatarText}>{participant.initials}</Text>
      </View>
      <View style={styles.participantText}>
        <Text style={styles.participantName}>{participant.name}</Text>
        {badge ? <Text style={styles.participantBadge}>{badge}</Text> : null}
      </View>
      {trailing}
    </View>
  );
}

export const kixikilaDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    gap: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  balanceCard: {
    backgroundColor: NAVY,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  balanceLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.65)',
  },
  balanceValue: {
    marginTop: 6,
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  inviteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  inviteCode: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 0.4,
  },
  copyBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  orderBadge: {
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EEF0F8',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  orderBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: NAVY,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#DCFCE7',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
  },
  nextPill: {
    backgroundColor: '#FEF3C7',
  },
  nextPillText: {
    color: '#92400E',
  },
});

const styles = StyleSheet.create({
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
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroIconText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroText: { flex: 1 },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroSubtitle: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.65)',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  metaRowLast: { borderBottomWidth: 0 },
  metaLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'right',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  participantText: { flex: 1 },
  participantName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  participantBadge: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  participantRowLast: {
    borderBottomWidth: 0,
  },
  actionRowLast: {
    borderBottomWidth: 0,
  },
});
