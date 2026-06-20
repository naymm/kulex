import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import {
  AddMoneyPrimaryButton,
  AddMoneyShell,
} from '@/components/add-money/AddMoneyShell';
import { KixikilaFeeSummaryCard } from '@/components/kixikila/KixikilaFeeSummaryCard';
import {
  frequencyContributionSuffix,
  getCommissionModeLabel,
  getKixikilaDetail,
  getKixikilaStatusLabel,
  getPlatformKixikila,
} from '@/constants/kixikila';
import { useActiveAccount } from '@/contexts/AccountContext';
import { fetchKixikilaDetail, joinPlatformKixikila } from '@/lib/api/kixikila';
import { isSupabaseConfigured } from '@/lib/supabase';

export default function PlatformKixikilaScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const kixikilaId = typeof id === 'string' ? id : undefined;
  const { activeAccountId } = useActiveAccount();
  const [isJoining, setIsJoining] = useState(false);
  const [remoteDetail, setRemoteDetail] = useState(
    () => getKixikilaDetail(kixikilaId) ?? null,
  );
  const [loading, setLoading] = useState(isSupabaseConfigured);

  const summary = getPlatformKixikila(kixikilaId) ?? (remoteDetail ? {
    id: remoteDetail.id,
    title: remoteDetail.title,
    description: '',
    members: remoteDetail.currentMembers,
    memberCapacity: remoteDetail.memberCapacity,
    amountPerMember: remoteDetail.amountPerMember,
    frequency: remoteDetail.frequency ?? 'Mensal',
    status: remoteDetail.status,
  } : undefined);

  const detail = remoteDetail ?? getKixikilaDetail(kixikilaId);

  useEffect(() => {
    if (!isSupabaseConfigured || !kixikilaId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    void fetchKixikilaDetail(kixikilaId, activeAccountId)
      .then((data) => {
        if (!cancelled && data) setRemoteDetail(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeAccountId, kixikilaId]);

  if (loading) {
    return (
      <AddMoneyShell title="Kixikila Kulex">
        <View style={styles.loading}>
          <ActivityIndicator color="#FFFFFF" />
        </View>
      </AddMoneyShell>
    );
  }

  if (!summary || !detail) {
    return null;
  }

  const contributionValue = detail.amountPerMember.replace(/\s*kz$/i, '');
  const contributionLabel = `${contributionValue}/${frequencyContributionSuffix(detail.frequency ?? 'Mensal')}`;
  const statusLabel = getKixikilaStatusLabel(
    detail.status,
    detail.currentMembers,
    detail.memberCapacity,
  );

  const handleParticipate = async () => {
    if (detail.isMember) {
      router.push({ pathname: '/kixikila/[id]', params: { id: detail.id } });
      return;
    }

    if (!isSupabaseConfigured) {
      router.push({
        pathname: '/kixikila/participar/kulex/sucesso',
        params: { id: detail.id, title: detail.title },
      } as never);
      return;
    }

    setIsJoining(true);
    try {
      await joinPlatformKixikila(detail.id);
      router.push({
        pathname: '/kixikila/participar/kulex/sucesso',
        params: { id: detail.id, title: detail.title },
      } as never);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Não foi possível participar neste grupo.';
      Alert.alert('Kixikila Kulex', message);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <AddMoneyShell
      title="Kixikila Kulex"
      footer={
        <AddMoneyPrimaryButton
          label={detail.isMember ? 'Ver grupo' : isJoining ? 'A participar...' : 'Participar'}
          onPress={() => void handleParticipate()}
        />
      }>
      <View style={styles.noticeCard}>
        <Ionicons name="eye-off-outline" size={20} color="#FFFFFF" />
        <Text style={styles.noticeText}>
          Neste grupo os participantes aparecem de forma anónima. Só vês a tua posição e a ordem de
          recebimento.
        </Text>
      </View>

      <View style={styles.summaryCard}>
        <SummaryRow label="Grupo" value={summary.title} />
        <SummaryRow label="Contribuição" value={contributionLabel} />
        <SummaryRow
          label="Membros"
          value={`${detail.currentMembers}/${detail.memberCapacity} membros`}
        />
        <SummaryRow label="Estado" value={statusLabel} />
        <SummaryRow label="Frequência" value={detail.frequency ?? 'Mensal'} />
        <SummaryRow label="Dia útil do débito" value={`${detail.debitDay}º dia útil`} />
        <SummaryRow label="Prazo de término" value={`${detail.durationMonths} meses`} />
        <SummaryRow
          label="Cobrança de comissões"
          value={getCommissionModeLabel(detail.commissionMode)}
        />
        <SummaryRow label="Protecção" value={detail.protection ?? 'Com seguro'} last />
      </View>

      <View style={styles.feeWrap}>
        <KixikilaFeeSummaryCard
          contribution={contributionValue}
          members={String(detail.memberCapacity)}
          commissionMode={detail.commissionMode}
          frequency={detail.frequency ?? 'Mensal'}
          variant="dark"
        />
      </View>
    </AddMoneyShell>
  );
}

function SummaryRow({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.summaryRow, last && styles.summaryRowLast]}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    marginTop: 48,
    alignItems: 'center',
  },
  noticeCard: {
    marginTop: 24,
    flexDirection: 'row',
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    padding: 14,
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
  },
  summaryCard: {
    marginTop: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  summaryRowLast: {
    borderBottomWidth: 0,
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.55)',
  },
  summaryValue: {
    flex: 1,
    marginLeft: 16,
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'right',
  },
  feeWrap: {
    marginTop: 20,
  },
});
