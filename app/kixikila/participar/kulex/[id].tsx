import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
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

export default function PlatformKixikilaScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const summary = getPlatformKixikila(typeof id === 'string' ? id : undefined);
  const detail = getKixikilaDetail(typeof id === 'string' ? id : undefined);

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

  const handleParticipate = () => {
    router.push({
      pathname: '/kixikila/participar/kulex/sucesso',
      params: { id: detail.id, title: detail.title },
    } as never);
  };

  return (
    <AddMoneyShell
      title="Kixikila Kulex"
      footer={<AddMoneyPrimaryButton label="Participar" onPress={handleParticipate} />}>
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
  noticeCard: {
    marginTop: 24,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 19,
  },
  summaryCard: {
    marginTop: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(0,0,0,0.18)',
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'right',
  },
  feeWrap: {
    marginTop: 16,
    marginBottom: 8,
  },
});
