import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AGENT_OPERATION_TYPE_ICONS,
  AGENT_OPERATION_TYPE_LABELS,
} from '@/constants/agent';
import {
  formatAgentPhone,
  getAgentClientByPhone,
  getAgentClientHistory,
  getClientInitials,
} from '@/lib/agent-clients';

const NAVY = '#1A1A4E';

function DetailRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.detailRow, last && styles.detailRowLast]}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

export default function AgentClienteDetalheScreen() {
  const insets = useSafeAreaInsets();
  const { phone } = useLocalSearchParams<{ phone?: string }>();
  const phoneDigits = typeof phone === 'string' ? phone : '';

  const client = useMemo(() => getAgentClientByPhone(phoneDigits), [phoneDigits]);
  const history = useMemo(
    () => (client ? getAgentClientHistory(client.name) : []),
    [client],
  );

  if (!client) {
    return (
      <View style={[styles.container, styles.emptyState, { paddingTop: insets.top + 24 }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </Pressable>
        <Text style={styles.emptyTitle}>Cliente não encontrado</Text>
      </View>
    );
  }

  const isActive = client.status === 'Activo';

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerPattern} />
        <View style={styles.headerRow}>
          <Pressable style={styles.backBtn} accessibilityRole="button" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Detalhes do cliente</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 24 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getClientInitials(client.name)}</Text>
          </View>
          <Text style={styles.profileName}>{client.name}</Text>
          <Text style={styles.profilePhone}>{formatAgentPhone(client.phone)}</Text>
          <View style={[styles.statusBadge, isActive ? styles.statusActive : styles.statusPending]}>
            <Text style={[styles.statusText, isActive ? styles.statusTextActive : styles.statusTextPending]}>
              {client.status}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Informação</Text>
        <View style={styles.detailsCard}>
          <DetailRow label="ID Kulex" value={client.membershipId} />
          <DetailRow label="NIF" value={client.nif} />
          <DetailRow label="Email" value={client.email} />
          <DetailRow label="Saldo disponível" value={client.balance} />
          <DetailRow label="Estado KYC" value={client.kycStatus} />
          <DetailRow label="Conta activada em" value={client.activatedAt} />
          <DetailRow label="Última operação" value={client.lastOperation} last />
        </View>

        <Text style={styles.sectionTitle}>Operações</Text>
        <View style={styles.actionsRow}>
          <Pressable
            style={styles.actionBtn}
            accessibilityRole="button"
            onPress={() =>
              router.push({
                pathname: '/agent/carregar',
                params: { phone: client.phone },
              })
            }>
            <View style={[styles.actionIcon, styles.actionIconIn]}>
              <Ionicons name="arrow-down-circle-outline" size={22} color="#16A34A" />
            </View>
            <Text style={styles.actionLabel}>Carregar</Text>
          </Pressable>

          <Pressable
            style={styles.actionBtn}
            accessibilityRole="button"
            onPress={() => router.push('/agent/levantar')}>
            <View style={[styles.actionIcon, styles.actionIconOut]}>
              <Ionicons name="arrow-up-circle-outline" size={22} color="#DC2626" />
            </View>
            <Text style={styles.actionLabel}>Levantar</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Histórico recente</Text>
        {history.length > 0 ? (
          history.map((item) => (
            <View key={item.id} style={styles.historyRow}>
              <View style={styles.historyIcon}>
                <Ionicons
                  name={AGENT_OPERATION_TYPE_ICONS[item.type]}
                  size={20}
                  color={NAVY}
                />
              </View>
              <View style={styles.historyInfo}>
                <Text style={styles.historyTitle}>{AGENT_OPERATION_TYPE_LABELS[item.type]}</Text>
                <Text style={styles.historyMeta}>
                  {item.dateLabel} · {item.timeLabel}
                  {item.amount !== '—' ? ` · ${item.amount}` : ''}
                </Text>
              </View>
              <Text style={styles.historyCommission}>{item.commission}</Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyHistory}>
            <Text style={styles.emptyHistoryText}>Sem operações registadas para este cliente.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  emptyState: { paddingHorizontal: 20, backgroundColor: '#FFFFFF' },
  emptyTitle: { marginTop: 24, fontSize: 18, fontWeight: '700', color: '#111827' },
  header: {
    backgroundColor: NAVY,
    paddingHorizontal: 20,
    paddingBottom: 20,
    overflow: 'hidden',
    zIndex: 1,
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
  content: { paddingHorizontal: 18 },
  profileCard: {
    marginTop: 28,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EEF0F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarText: { fontSize: 22, fontWeight: '800', color: NAVY },
  profileName: { fontSize: 22, fontWeight: '800', color: '#111827' },
  profilePhone: { marginTop: 6, fontSize: 15, fontWeight: '500', color: '#6B7280' },
  statusBadge: {
    marginTop: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  statusActive: { backgroundColor: '#DCFCE7' },
  statusPending: { backgroundColor: '#FEF3C7' },
  statusText: { fontSize: 12, fontWeight: '700' },
  statusTextActive: { color: '#166534' },
  statusTextPending: { color: '#92400E' },
  sectionTitle: {
    marginTop: 22,
    marginBottom: 10,
    fontSize: 13,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  detailRowLast: { borderBottomWidth: 0 },
  detailLabel: { fontSize: 14, fontWeight: '500', color: '#6B7280' },
  detailValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'right',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIconIn: { backgroundColor: '#DCFCE7' },
  actionIconOut: { backgroundColor: '#FEE2E2' },
  actionLabel: { fontSize: 13, fontWeight: '700', color: NAVY },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  historyIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EEF0F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyInfo: { flex: 1 },
  historyTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
  historyMeta: { marginTop: 3, fontSize: 12, fontWeight: '500', color: '#9CA3AF' },
  historyCommission: { fontSize: 14, fontWeight: '800', color: '#16A34A' },
  emptyHistory: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyHistoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
});
