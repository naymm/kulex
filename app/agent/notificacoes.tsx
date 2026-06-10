import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { AgentNotificationKind } from '@/constants/agent';
import { getAgentNotifications, markNotificationRead } from '@/lib/agent';
import { goBackFromOrigin } from '@/lib/navigation';

const NAVY = '#1A1A4E';

const KIND_ICONS: Record<AgentNotificationKind, keyof typeof Ionicons.glyphMap> = {
  pending_activation: 'person-add-outline',
  withdrawal_request: 'arrow-up-circle-outline',
  commission_available: 'cash-outline',
};

const KIND_COLORS: Record<AgentNotificationKind, string> = {
  pending_activation: '#EEF0F8',
  withdrawal_request: '#FEE2E2',
  commission_available: '#FFFBEB',
};

export default function AgentNotificacoesScreen() {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState(getAgentNotifications());

  useFocusEffect(
    useCallback(() => {
      setItems(getAgentNotifications());
    }, []),
  );

  const openNotification = (id: string, href?: string) => {
    markNotificationRead(id);
    setItems(getAgentNotifications());
    if (href) router.push(href as never);
  };

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
          <Text style={styles.headerTitle}>Alertas e aprovações</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 24 },
        ]}
        showsVerticalScrollIndicator={false}>
        {items.map((item) => (
          <Pressable
            key={item.id}
            style={[styles.card, !item.read && styles.cardUnread]}
            accessibilityRole="button"
            onPress={() => openNotification(item.id, item.actionHref)}>
            <View style={[styles.iconWrap, { backgroundColor: KIND_COLORS[item.kind] }]}>
              <Ionicons name={KIND_ICONS[item.kind]} size={22} color={NAVY} />
            </View>
            <View style={styles.cardText}>
              <View style={styles.titleRow}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                {!item.read ? <View style={styles.unreadDot} /> : null}
              </View>
              <Text style={styles.cardMessage}>{item.message}</Text>
              <Text style={styles.cardDate}>{item.dateLabel}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </Pressable>
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
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardUnread: { borderColor: NAVY, backgroundColor: '#FAFAFF' },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardTitle: { fontSize: 15, fontWeight: '800', color: '#111827' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
  cardMessage: { marginTop: 4, fontSize: 13, lineHeight: 18, fontWeight: '500', color: '#6B7280' },
  cardDate: { marginTop: 6, fontSize: 11, fontWeight: '600', color: '#9CA3AF' },
});
