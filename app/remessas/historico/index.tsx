import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { flagEmojiFromIso2 } from '@/constants/countries';
import {
  INCOMING_STATUS_LABELS,
  OUTGOING_STATUS_LABELS,
  type IncomingRemittance,
  type OutgoingRemittance,
} from '@/constants/remessas';
import { getAllIncomingRemittances, getAllOutgoingRemittances } from '@/lib/remessas';

const NAVY = '#1A1A4E';

type HistoryTab = 'enviadas' | 'recebidas';

export default function RemessaHistoricoScreen() {
  const insets = useSafeAreaInsets();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState<HistoryTab>(
    tab === 'enviadas' ? 'enviadas' : 'recebidas',
  );
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (tab === 'enviadas' || tab === 'recebidas') {
      setActiveTab(tab);
    }
  }, [tab]);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((key) => key + 1);
    }, []),
  );

  const outgoing = useMemo(() => getAllOutgoingRemittances(), [refreshKey]);
  const incoming = useMemo(() => getAllIncomingRemittances(), [refreshKey]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerContent}>
          <Pressable
            style={styles.headerBtn}
            accessibilityRole="button"
            onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Histórico</Text>
        </View>

        <View style={styles.tabs}>
          <TabButton
            label="Enviadas"
            active={activeTab === 'enviadas'}
            onPress={() => setActiveTab('enviadas')}
          />
          <TabButton
            label="Recebidas"
            active={activeTab === 'recebidas'}
            onPress={() => setActiveTab('recebidas')}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 24 },
        ]}
        showsVerticalScrollIndicator={false}>
        {activeTab === 'enviadas' ? (
          outgoing.length === 0 ? (
            <EmptyState message="Ainda não enviou remessas." />
          ) : (
            outgoing.map((item) => <OutgoingRow key={item.id} item={item} />)
          )
        ) : incoming.length === 0 ? (
          <EmptyState message="Ainda não recebeu remessas." />
        ) : (
          incoming.map((item) => <IncomingRow key={item.id} item={item} />)
        )}
      </ScrollView>
    </View>
  );
}

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.tab, active && styles.tabActive]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </Pressable>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <View style={styles.empty}>
      <Ionicons name="document-text-outline" size={40} color="#D1D5DB" />
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );
}

function OutgoingRow({ item }: { item: OutgoingRemittance }) {
  return (
    <Pressable
      style={styles.row}
      accessibilityRole="button"
      onPress={() =>
        router.push({
          pathname: '/remessas/historico/enviada/[id]',
          params: { id: item.id },
        })
      }>
      <Text style={styles.flag}>{flagEmojiFromIso2(item.destinationCountryCode)}</Text>
      <View style={styles.info}>
        <Text style={styles.name}>{item.beneficiaryName}</Text>
        <Text style={styles.meta}>
          {item.destinationCountry} · {item.reference}
        </Text>
        <Text style={styles.date}>{item.dateLabel}</Text>
      </View>
      <View style={styles.amountCol}>
        <Text style={styles.aoa}>AOA {item.totalDebitedAoa}</Text>
        <Text style={styles.foreign}>
          {item.amountForeign} {item.currency}
        </Text>
        <Text
          style={[
            styles.status,
            item.status === 'entregue' && styles.statusDone,
            item.status === 'em_processamento' && styles.statusPending,
            item.status === 'cancelada' && styles.statusCancelled,
          ]}>
          {OUTGOING_STATUS_LABELS[item.status]}
        </Text>
      </View>
    </Pressable>
  );
}

function IncomingRow({ item }: { item: IncomingRemittance }) {
  return (
    <Pressable
      style={styles.row}
      accessibilityRole="button"
      onPress={() =>
        router.push({
          pathname: '/remessas/historico/recebida/[id]',
          params: { id: item.id },
        })
      }>
      <Text style={styles.flag}>{flagEmojiFromIso2(item.senderCountryCode)}</Text>
      <View style={styles.info}>
        <Text style={styles.name}>{item.senderName}</Text>
        <Text style={styles.meta}>
          {item.senderCountry} · {item.reference}
        </Text>
        <Text style={styles.date}>{item.dateLabel}</Text>
      </View>
      <View style={styles.amountCol}>
        <Text style={styles.aoa}>AOA {item.amountAoa}</Text>
        <Text style={styles.foreign}>
          {item.amountForeign} {item.currency}
        </Text>
        <Text
          style={[
            styles.status,
            item.status === 'creditado' && styles.statusDone,
            item.status === 'em_processamento' && styles.statusPending,
          ]}>
          {INCOMING_STATUS_LABELS[item.status]}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    backgroundColor: NAVY,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.65)',
  },
  tabTextActive: {
    color: NAVY,
  },
  content: {
    padding: 20,
    gap: 10,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
  },
  flag: {
    fontSize: 28,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: NAVY,
  },
  meta: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  date: {
    fontSize: 11,
    color: '#D1D5DB',
  },
  amountCol: {
    alignItems: 'flex-end',
    gap: 2,
  },
  aoa: {
    fontSize: 14,
    fontWeight: '700',
    color: NAVY,
  },
  foreign: {
    fontSize: 11,
    color: '#6B7280',
  },
  status: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 2,
  },
  statusDone: {
    color: '#22C55E',
  },
  statusPending: {
    color: '#F59E0B',
  },
  statusCancelled: {
    color: '#EF4444',
  },
});
