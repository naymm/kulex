import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BusinessNotificationKind } from '@/constants/business';
import { getBusinessNotifications, markBusinessNotificationRead } from '@/lib/business';
import { goBackFromOrigin } from '@/lib/navigation';

const NAVY = '#1A1A4E';

const KIND_ICONS: Record<BusinessNotificationKind, keyof typeof Ionicons.glyphMap> = {
  invoice_pending: 'document-text-outline',
  employee_limit: 'warning-outline',
  stock_credit_renewed: 'cash-outline',
};

export default function BusinessNotificacoesScreen() {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState(getBusinessNotifications());

  const openItem = (id: string, href?: string) => {
    markBusinessNotificationRead(id);
    setItems(getBusinessNotifications());
    if (href) router.push(href as never);
  };

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
          <Text style={styles.headerTitle}>Alertas e aprovações</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 24 },
        ]}>
        {items.map((item) => (
          <Pressable
            key={item.id}
            style={[styles.row, !item.read && styles.rowUnread]}
            onPress={() => openItem(item.id, item.actionHref)}>
            <View style={styles.iconWrap}>
              <Ionicons name={KIND_ICONS[item.kind]} size={22} color={NAVY} />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>{item.title}</Text>
              <Text style={styles.rowMessage}>{item.message}</Text>
              <Text style={styles.rowDate}>{item.dateLabel}</Text>
            </View>
            {!item.read ? <View style={styles.unreadDot} /> : null}
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
  scroll: { flex: 1 },
  content: { padding: 18, gap: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  rowUnread: { borderColor: '#BFDBFE', backgroundColor: '#F8FAFF' },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EEF0F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: '700', color: '#111827' },
  rowMessage: { marginTop: 4, fontSize: 13, lineHeight: 18, color: '#6B7280' },
  rowDate: { marginTop: 6, fontSize: 12, fontWeight: '500', color: '#9CA3AF' },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3B82F6',
    marginTop: 4,
  },
});
