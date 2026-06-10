import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import {
  AddMoneyPrimaryButton,
  AddMoneyShell,
} from '@/components/add-money/AddMoneyShell';
import { KixikilaFeeSummaryCard } from '@/components/kixikila/KixikilaFeeSummaryCard';
import {
  frequencyContributionSuffix,
  getCommissionModeLabel,
  getKixikilaByInviteCode,
  getKixikilaStatusLabel,
  KIXIKILA_INVITE_CODE_LENGTH,
} from '@/constants/kixikila';

export default function ParticiparKixikilaScreen() {
  const [inviteCode, setInviteCode] = useState('');

  const matchedGroup = useMemo(
    () => getKixikilaByInviteCode(inviteCode),
    [inviteCode]
  );

  const contributionLabel = matchedGroup
    ? `${matchedGroup.contribution} kz/${frequencyContributionSuffix(matchedGroup.frequency)}`
    : '';
  const statusLabel = matchedGroup
    ? getKixikilaStatusLabel(
        matchedGroup.status,
        Number(matchedGroup.currentMembers),
        Number(matchedGroup.members)
      )
    : '';

  const handleSubmit = () => {
    if (!matchedGroup) return;
    router.push('/kixikila/participar/sucesso');
  };

  return (
    <AddMoneyShell
      title="Participar Kixikila"
      footer={
        matchedGroup ? (
          <AddMoneyPrimaryButton label="Enviar Pedido" onPress={handleSubmit} />
        ) : undefined
      }>
      <View style={styles.searchRow}>
        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={18} color="rgba(255,255,255,0.55)" />
          <TextInput
            value={inviteCode}
            onChangeText={(text) => setInviteCode(text.slice(0, KIXIKILA_INVITE_CODE_LENGTH))}
            placeholder="Código de convite"
            placeholderTextColor="rgba(255,255,255,0.35)"
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={KIXIKILA_INVITE_CODE_LENGTH}
            style={styles.searchInput}
          />
        </View>
      </View>

      {matchedGroup ? (
        <View style={styles.summaryCard}>
          <SummaryRow label="Grupo" value={matchedGroup.groupName} />
          <SummaryRow label="Contribuição" value={contributionLabel} />
          <SummaryRow label="Membros" value={`${matchedGroup.members} membros`} />
          <SummaryRow label="Estado" value={statusLabel} />
          <SummaryRow label="Dia útil do débito" value={`${matchedGroup.debitDay}º dia útil`} />
          <SummaryRow label="Prazo de término" value={`${matchedGroup.durationMonths} meses`} />
          <SummaryRow
            label="Cobrança de comissões"
            value={getCommissionModeLabel(matchedGroup.commissionMode)}
          />
          <SummaryRow label="A sua protecção" value={matchedGroup.protection} last />
        </View>
      ) : null}

      {matchedGroup ? (
        <View style={styles.feeWrap}>
          <KixikilaFeeSummaryCard
            contribution={matchedGroup.contribution}
            members={matchedGroup.members}
            commissionMode={matchedGroup.commissionMode}
            frequency={matchedGroup.frequency}
            variant="dark"
          />
        </View>
      ) : null}
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
  searchRow: {
    marginTop: 28,
  },
  searchWrap: {
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.22)',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    padding: 0,
  },
  summaryCard: {
    marginTop: 28,
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
  },
});
