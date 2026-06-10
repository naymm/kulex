import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  AddMoneyPrimaryButton,
  AddMoneyShell,
} from '@/components/add-money/AddMoneyShell';
import { KixikilaFeeSummaryCard } from '@/components/kixikila/KixikilaFeeSummaryCard';
import {
  frequencyContributionSuffix,
  getCommissionModeLabel,
  getKixikilaPendingStatusLabel,
  KIXIKILA_INVITE_CODE,
  parseCommissionMode,
} from '@/constants/kixikila';

export default function KixikilaCriadaSucessoScreen() {
  const params = useLocalSearchParams<{
    groupName?: string;
    contribution?: string;
    frequency?: string;
    members?: string;
    protection?: string;
    debitDay?: string;
    durationMonths?: string;
    receiptOrder?: string;
    inviteCode?: string;
    commissionMode?: string;
  }>();

  const groupName = typeof params.groupName === 'string' ? params.groupName : 'Vendedoras Kikolo';
  const contribution = typeof params.contribution === 'string' ? params.contribution : '100.000,00';
  const frequency = typeof params.frequency === 'string' ? params.frequency : 'Mensal';
  const members = typeof params.members === 'string' ? params.members : '5';
  const protection = typeof params.protection === 'string' ? params.protection : 'Sem seguro';
  const debitDay = typeof params.debitDay === 'string' ? params.debitDay : '5';
  const durationMonths = typeof params.durationMonths === 'string' ? params.durationMonths : '10';
  const inviteCode =
    typeof params.inviteCode === 'string' ? params.inviteCode : KIXIKILA_INVITE_CODE;

  const memberCount = Number(members);
  const invitedCount = useMemo(() => {
    const order = typeof params.receiptOrder === 'string' ? params.receiptOrder : '';
    if (!order) return memberCount;
    return order.split(',').filter(Boolean).length;
  }, [memberCount, params.receiptOrder]);

  const isRosterComplete = invitedCount >= memberCount;

  const circleScale = useSharedValue(0);
  const circleOpacity = useSharedValue(0);
  const checkScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    circleScale.value = withSpring(1, { damping: 14, stiffness: 140 });
    circleOpacity.value = withTiming(1, { duration: 280 });
    checkScale.value = withDelay(220, withSpring(1, { damping: 11, stiffness: 180 }));
    checkOpacity.value = withDelay(220, withTiming(1, { duration: 200 }));
    contentOpacity.value = withDelay(420, withTiming(1, { duration: 350 }));
  }, [checkOpacity, checkScale, circleOpacity, circleScale, contentOpacity]);

  const circleStyle = useAnimatedStyle(() => ({
    opacity: circleOpacity.value,
    transform: [{ scale: circleScale.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
    transform: [{ scale: checkScale.value }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const contributionLabel = `${contribution} kz/${frequencyContributionSuffix(frequency)}`;
  const commissionMode = parseCommissionMode(
    typeof params.commissionMode === 'string' ? params.commissionMode : undefined,
  );
  const statusLabel = getKixikilaPendingStatusLabel(invitedCount, memberCount);

  return (
    <AddMoneyShell
      hideHeader
      footer={
        <AddMoneyPrimaryButton label="Entendi" onPress={() => router.replace('/kixikila')} />
      }>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.hero, contentStyle]}>
          <Animated.View style={[styles.checkCircle, circleStyle]}>
            <Animated.View style={checkStyle}>
              <Ionicons name="checkmark" size={40} color="#FFFFFF" />
            </Animated.View>
          </Animated.View>
          <Text style={styles.title}>Kixikila criada com sucesso</Text>
        </Animated.View>

        <Animated.View style={contentStyle}>
          <View style={styles.summaryCard}>
            <SummaryRow label="Grupo" value={groupName} />
            <SummaryRow label="Contribuição" value={contributionLabel} />
            <SummaryRow label="Membros" value={`${members} membros`} />
            <SummaryRow label="Dia útil do débito" value={`${debitDay}º dia útil`} />
            <SummaryRow label="Prazo de término" value={`${durationMonths} meses`} />
            <SummaryRow
              label="Cobrança de comissões"
              value={getCommissionModeLabel(commissionMode)}
              multiline
            />
            <SummaryRow label="Estado" value={statusLabel} />
            <SummaryRow label="A sua protecção" value={protection} last />
          </View>

          <KixikilaFeeSummaryCard
            contribution={contribution}
            members={members}
            commissionMode={commissionMode}
            frequency={frequency}
            variant="dark"
          />

          <Text style={styles.pendingNote}>
            {isRosterComplete
              ? `Todos os ${members} membros foram convidados. O primeiro débito ocorre no ${debitDay}º dia útil após a confirmação de todos.`
              : `A Kixikila ficará aguardando até completar os ${members} membros. O primeiro débito ocorre no ${debitDay}º dia útil após todos entrarem.`}
          </Text>

          <Text style={styles.inviteLabel}>Código de convite</Text>
          <View style={styles.inviteRow}>
            <Text style={styles.inviteCode}>{inviteCode}</Text>
            <Pressable style={styles.copyBtn} accessibilityRole="button">
              <Ionicons name="copy-outline" size={18} color="#FFFFFF" />
            </Pressable>
          </View>
          <Text style={styles.inviteHint}>
            {isRosterComplete
              ? 'Partilhe o código para os membros confirmarem a participação.'
              : 'Convide mais membros copiando o código e partilhando.'}
          </Text>
        </Animated.View>
      </ScrollView>
    </AddMoneyShell>
  );
}

function SummaryRow({
  label,
  value,
  last,
  multiline,
}: {
  label: string;
  value: string;
  last?: boolean;
  multiline?: boolean;
}) {
  return (
    <View style={[styles.summaryRow, last && styles.summaryRowLast]}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text
        style={[styles.summaryValue, multiline && styles.summaryValueMultiline]}
        numberOfLines={multiline ? 3 : 1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 20,
  },
  checkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: 8,
  },
  summaryCard: {
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(0,0,0,0.18)',
    paddingHorizontal: 18,
    paddingVertical: 6,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.12)',
    gap: 12,
  },
  summaryRowLast: {
    borderBottomWidth: 0,
  },
  summaryLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  summaryValue: {
    flex: 1.1,
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'right',
  },
  summaryValueMultiline: {
    lineHeight: 18,
  },
  inviteLabel: {
    marginTop: 20,
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.55)',
    marginBottom: 8,
    textAlign: 'center',
  },
  inviteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  inviteCode: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  copyBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inviteHint: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 300,
    alignSelf: 'center',
  },
  pendingNote: {
    width: '100%',
    marginTop: 16,
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    lineHeight: 18,
  },
});
