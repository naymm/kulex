import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  INCOMING_STATUS_LABELS,
  OUTGOING_STATUS_LABELS,
  REMESSAS_ACTIONS,
  REMESSAS_PROMO,
  type RemittanceAction,
} from '@/constants/remessas';
import { flagEmojiFromIso2 } from '@/constants/countries';
import { getAllIncomingRemittances, getAllOutgoingRemittances } from '@/lib/remessas';
import { goBackFromOrigin } from '@/lib/navigation';

const NAVY = '#1A1A4E';
const HORIZONTAL_PADDING = 20;

export default function RemessasHubScreen() {
  const insets = useSafeAreaInsets();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const [refreshKey, setRefreshKey] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey((key) => key + 1);
    }, []),
  );

  const recentOutgoing = getAllOutgoingRemittances().slice(0, 2);
  const recentIncoming = getAllIncomingRemittances().slice(0, 2);
  void refreshKey;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerPattern} />
        <View style={styles.headerContent}>
          <Pressable
            style={styles.headerBtn}
            accessibilityRole="button"
            onPress={() => goBackFromOrigin(from, () => router.dismissTo('/(tabs)'))}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Remessas</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + 24 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.promoCard}>
          <LinearGradient
            colors={['#2A2A6E', '#1A1A4E', '#12123A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.promoGradient}
          />
          <View style={styles.promoIconWrap}>
            <Ionicons name="globe-outline" size={36} color="#FFFFFF" />
          </View>
          <View style={styles.promoTextWrap}>
            <Text style={styles.promoTitle}>{REMESSAS_PROMO.title}</Text>
            <Text style={styles.promoSubtitle}>{REMESSAS_PROMO.subtitle}</Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          {REMESSAS_ACTIONS.map((action) => (
            <ActionButton key={action.id} action={action} from={from} />
          ))}
        </View>

        <Pressable
          style={styles.historicoBtn}
          accessibilityRole="button"
          onPress={() => router.push('/remessas/historico')}>
          <View style={styles.historicoBtnLeft}>
            <Ionicons name="time-outline" size={22} color={NAVY} />
            <View>
              <Text style={styles.historicoBtnTitle}>Histórico</Text>
              <Text style={styles.historicoBtnSubtitle}>Enviadas e recebidas</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </Pressable>

        {(recentOutgoing.length > 0 || recentIncoming.length > 0) && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Actividade recente</Text>
              <Pressable accessibilityRole="button" onPress={() => router.push('/remessas/historico')}>
                <Text style={styles.sectionLink}>Ver tudo</Text>
              </Pressable>
            </View>

            {recentOutgoing.map((item) => (
              <Pressable
                key={item.id}
                style={styles.activityRow}
                accessibilityRole="button"
                onPress={() =>
                  router.push({
                    pathname: '/remessas/historico/enviada/[id]',
                    params: { id: item.id },
                  })
                }>
                <Ionicons name="arrow-up-circle-outline" size={22} color="#4F46E5" />
                <Text style={styles.activityFlag}>{flagEmojiFromIso2(item.destinationCountryCode)}</Text>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityName}>{item.beneficiaryName}</Text>
                  <Text style={styles.activityMeta}>Enviada · {item.dateLabel}</Text>
                </View>
                <View style={styles.activityAmount}>
                  <Text style={styles.activityAoa}>AOA {item.totalDebitedAoa}</Text>
                  <Text style={styles.activityStatus}>{OUTGOING_STATUS_LABELS[item.status]}</Text>
                </View>
              </Pressable>
            ))}

            {recentIncoming.map((item) => (
              <Pressable
                key={item.id}
                style={styles.activityRow}
                accessibilityRole="button"
                onPress={() =>
                  router.push({
                    pathname: '/remessas/historico/recebida/[id]',
                    params: { id: item.id },
                  })
                }>
                <Ionicons name="arrow-down-circle-outline" size={22} color="#22C55E" />
                <Text style={styles.activityFlag}>{flagEmojiFromIso2(item.senderCountryCode)}</Text>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityName}>{item.senderName}</Text>
                  <Text style={styles.activityMeta}>Recebida · {item.dateLabel}</Text>
                </View>
                <View style={styles.activityAmount}>
                  <Text style={styles.activityAoa}>AOA {item.amountAoa}</Text>
                  <Text style={styles.activityStatus}>{INCOMING_STATUS_LABELS[item.status]}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        <View style={styles.infoCard}>
          <Ionicons name="shield-checkmark-outline" size={22} color={NAVY} />
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>Seguro e rastreável</Text>
            <Text style={styles.infoSubtitle}>
              Cada remessa gera um código de acompanhamento. Receba notificações em cada etapa.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function ActionButton({ action, from }: { action: RemittanceAction; from?: string }) {
  return (
    <Pressable
      style={styles.actionBtn}
      accessibilityRole="button"
      onPress={() =>
        router.push({
          pathname: action.route,
          params: from ? { from } : undefined,
        })
      }>
      <View style={styles.actionIcon}>
        <Ionicons name={action.icon} size={24} color={NAVY} />
      </View>
      <Text style={styles.actionLabel}>{action.label}</Text>
      <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
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
    paddingBottom: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    overflow: 'hidden',
  },
  headerPattern: {
    ...StyleSheet.absoluteFill,
    opacity: 0.08,
    backgroundColor: '#FFFFFF',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: HORIZONTAL_PADDING,
    gap: 12,
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 24,
    gap: 20,
  },
  promoCard: {
    borderRadius: 20,
    overflow: 'hidden',
    minHeight: 140,
    padding: 20,
    justifyContent: 'flex-end',
  },
  promoGradient: {
    ...StyleSheet.absoluteFill,
  },
  promoIconWrap: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoTextWrap: {
    gap: 8,
  },
  promoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  promoSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.75)',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#1A1A4E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EEF0F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: NAVY,
  },
  actionSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
  },
  historicoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#1A1A4E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  historicoBtnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  historicoBtnTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: NAVY,
  },
  historicoBtnSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: '#6B7280',
  },
  section: {
    gap: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: NAVY,
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4F46E5',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
  },
  activityFlag: {
    fontSize: 22,
  },
  activityInfo: {
    flex: 1,
    gap: 2,
  },
  activityName: {
    fontSize: 14,
    fontWeight: '600',
    color: NAVY,
  },
  activityMeta: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  activityAmount: {
    alignItems: 'flex-end',
    gap: 2,
  },
  activityAoa: {
    fontSize: 13,
    fontWeight: '700',
    color: NAVY,
  },
  activityStatus: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  infoCard: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    gap: 4,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: NAVY,
  },
  infoSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: '#6B7280',
  },
});
