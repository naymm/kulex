import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getContactById } from '@/constants/contacts';
import {
  KIXIKILA_ORGANIZER_ID,
  KIXIKILA_ORGANIZER_NAME,
} from '@/constants/kixikila';

const NAVY = '#1A1A4E';

type OrderedMember = {
  id: string;
  name: string;
  initials: string;
  color: string;
  subtitle?: string;
};

function buildInitialOrder(selectedMembers: string) {
  const ids = selectedMembers
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);

  const organizer = getContactById(KIXIKILA_ORGANIZER_ID);
  const ordered: OrderedMember[] = [];

  if (organizer) {
    ordered.push({
      id: organizer.id,
      name: KIXIKILA_ORGANIZER_NAME,
      initials: organizer.initials,
      color: organizer.color,
      subtitle: 'Organizador',
    });
  }

  ids.forEach((id) => {
    const contact = getContactById(id);
    if (!contact) return;
    ordered.push({
      id: contact.id,
      name: contact.name,
      initials: contact.initials,
      color: contact.color,
    });
  });

  return ordered;
}

export default function CriarKixikilaOrdemScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    groupName?: string;
    contribution?: string;
    frequency?: string;
    members?: string;
    protection?: string;
    debitDay?: string;
    durationMonths?: string;
    selectedMembers?: string;
  }>();

  const selectedMembers = typeof params.selectedMembers === 'string' ? params.selectedMembers : '';
  const [orderedMembers, setOrderedMembers] = useState<OrderedMember[]>(() =>
    buildInitialOrder(selectedMembers)
  );

  const moveMember = (index: number, direction: -1 | 1) => {
    setOrderedMembers((prev) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };

  const handleContinue = () => {
    router.push({
      pathname: '/kixikila/criar/sucesso',
      params: {
        ...params,
        receiptOrder: orderedMembers.map((member) => member.id).join(','),
      },
    });
  };

  const groupName = useMemo(
    () => (typeof params.groupName === 'string' ? params.groupName : 'Nova Kixikila'),
    [params.groupName]
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerPattern} />
        <View style={styles.headerContent}>
          <Pressable
            style={styles.headerBtn}
            accessibilityRole="button"
            onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Ordem de recebimento</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 16) + 90 },
        ]}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.hint}>
          Defina quem recebe primeiro em {groupName}. A ordem abaixo será usada em cada ciclo.
        </Text>

        <View style={styles.listCard}>
          {orderedMembers.map((member, index) => (
            <View
              key={member.id}
              style={[styles.memberRow, index === orderedMembers.length - 1 && styles.memberRowLast]}>
              <View style={[styles.avatar, { backgroundColor: member.color }]}>
                <Text style={styles.avatarText}>{member.initials}</Text>
              </View>
              <View style={styles.memberText}>
                <Text style={styles.memberName}>{member.name}</Text>
                {member.subtitle ? (
                  <Text style={styles.memberSubtitle}>{member.subtitle}</Text>
                ) : null}
              </View>
              <View style={styles.orderBadge}>
                <Text style={styles.orderBadgeText}>{index + 1}º</Text>
              </View>
              <View style={styles.actions}>
                <Pressable
                  style={[styles.actionBtn, index === 0 && styles.actionBtnDisabled]}
                  accessibilityRole="button"
                  disabled={index === 0}
                  onPress={() => moveMember(index, -1)}>
                  <Ionicons name="chevron-up" size={18} color={index === 0 ? '#D1D5DB' : NAVY} />
                </Pressable>
                <Pressable
                  style={[
                    styles.actionBtn,
                    index === orderedMembers.length - 1 && styles.actionBtnDisabled,
                  ]}
                  accessibilityRole="button"
                  disabled={index === orderedMembers.length - 1}
                  onPress={() => moveMember(index, 1)}>
                  <Ionicons
                    name="chevron-down"
                    size={18}
                    color={index === orderedMembers.length - 1 ? '#D1D5DB' : NAVY}
                  />
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable style={styles.primaryBtn} accessibilityRole="button" onPress={handleContinue}>
          <Text style={styles.primaryBtnText}>Continuar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
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
    gap: 14,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 22,
  },
  hint: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 18,
  },
  listCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
    gap: 10,
  },
  memberRowLast: {
    borderBottomWidth: 0,
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
  memberText: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  memberSubtitle: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '600',
    color: '#C9A227',
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
  actions: {
    gap: 4,
  },
  actionBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnDisabled: {
    backgroundColor: '#F9FAFB',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
  },
  primaryBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
