import { Ionicons } from '@expo/vector-icons';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  KixikilaDetailHeader,
  KixikilaParticipantRow,
  kixikilaDetailStyles,
} from '@/components/kixikila/KixikilaDetailUi';
import {
  getKixikilaDetail,
  getNextReceiver,
  getOrderedParticipants,
  type KixikilaParticipant,
} from '@/constants/kixikila';

export default function KixikilaOrdemScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const detail = getKixikilaDetail(typeof id === 'string' ? id : undefined);
  const [participants, setParticipants] = useState<KixikilaParticipant[]>(
    () => (detail ? getOrderedParticipants(detail) : [])
  );

  if (!detail) return null;

  if (detail.role !== 'organizer') {
    return <Redirect href={`/kixikila/${detail.id}`} />;
  }

  const canEdit = detail.status === 'pending';
  const nextReceiver = getNextReceiver(detail);

  const moveParticipant = (index: number, direction: -1 | 1) => {
    setParticipants((prev) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next.map((participant, orderIndex) => ({
        ...participant,
        order: orderIndex + 1,
      }));
    });
  };

  return (
    <View style={kixikilaDetailStyles.container}>
      <KixikilaDetailHeader
        title="Ordem de recebimento"
        subtitle={detail.title}
        onBack={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={[
          kixikilaDetailStyles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 24 },
        ]}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.hint}>
          {canEdit
            ? 'Ajuste a ordem antes da Kixikila iniciar. Depois de activa, a ordem fica bloqueada.'
            : 'A ordem abaixo define quem recebe o fundo em cada ciclo.'}
        </Text>

        <View style={kixikilaDetailStyles.listCard}>
          {participants.map((participant, index) => {
            const isNext =
              detail.status === 'active' && participant.id === nextReceiver?.id;
            return (
              <View key={participant.id} style={styles.rowWrap}>
                <KixikilaParticipantRow
                  participant={participant}
                  badge={isNext ? 'Próximo a receber' : undefined}
                  last={index === participants.length - 1 && !canEdit}
                  trailing={
                    <View style={styles.trailing}>
                      <View style={kixikilaDetailStyles.orderBadge}>
                        <Text style={kixikilaDetailStyles.orderBadgeText}>{index + 1}º</Text>
                      </View>
                      {canEdit ? (
                        <View style={styles.actions}>
                          <Pressable
                            style={[styles.actionBtn, index === 0 && styles.actionBtnDisabled]}
                            accessibilityRole="button"
                            disabled={index === 0}
                            onPress={() => moveParticipant(index, -1)}>
                            <Ionicons
                              name="chevron-up"
                              size={16}
                              color={index === 0 ? '#D1D5DB' : '#1A1A4E'}
                            />
                          </Pressable>
                          <Pressable
                            style={[
                              styles.actionBtn,
                              index === participants.length - 1 && styles.actionBtnDisabled,
                            ]}
                            accessibilityRole="button"
                            disabled={index === participants.length - 1}
                            onPress={() => moveParticipant(index, 1)}>
                            <Ionicons
                              name="chevron-down"
                              size={16}
                              color={index === participants.length - 1 ? '#D1D5DB' : '#1A1A4E'}
                            />
                          </Pressable>
                        </View>
                      ) : null}
                    </View>
                  }
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hint: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 18,
  },
  rowWrap: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actions: {
    gap: 4,
  },
  actionBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnDisabled: {
    backgroundColor: '#F9FAFB',
  },
});
