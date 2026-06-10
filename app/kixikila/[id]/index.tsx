import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  KixikilaActionRow,
  KixikilaDetailHeader,
  KixikilaMetaRow,
  kixikilaDetailStyles,
} from '@/components/kixikila/KixikilaDetailUi';
import {
  getCommissionModeLabel,
  getKixikilaActions,
  getKixikilaDetail,
  getKixikilaStatusLabel,
  getNextReceiver,
  type KixikilaDetailAction,
} from '@/constants/kixikila';

export default function KixikilaDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const detail = getKixikilaDetail(typeof id === 'string' ? id : undefined);

  if (!detail) {
    return (
      <View style={kixikilaDetailStyles.container}>
        <Text style={styles.missing}>Kixikila não encontrada.</Text>
      </View>
    );
  }

  const nextReceiver = getNextReceiver(detail);
  const actions = getKixikilaActions(detail.role);
  const roleLabel = detail.role === 'organizer' ? 'Organizador' : 'Membro';
  const statusLabel = getKixikilaStatusLabel(
    detail.status,
    detail.currentMembers,
    detail.memberCapacity
  );

  const openAction = (action: KixikilaDetailAction) => {
    if (action.route === 'adicionar-membro') {
      router.push('/kixikila/criar/membros');
      return;
    }
    router.push(`/kixikila/${detail.id}/${action.route}` as never);
  };

  return (
    <View style={kixikilaDetailStyles.container}>
        <KixikilaDetailHeader
          title={detail.title}
          subtitle={`${roleLabel} · ${statusLabel}`}
          onBack={() => router.dismissTo('/kixikila')}
        />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          kixikilaDetailStyles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 20) + 24 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={kixikilaDetailStyles.balanceCard}>
          <Text style={kixikilaDetailStyles.balanceLabel}>Saldo Actual da Kixikila</Text>
          <Text style={kixikilaDetailStyles.balanceValue}>{detail.balance}</Text>
        </View>

        <View style={kixikilaDetailStyles.card}>
          <Text style={kixikilaDetailStyles.cardTitle}>Informações</Text>
          <KixikilaMetaRow icon="person-outline" label="Organizador" value={detail.organizer} />
          <KixikilaMetaRow
            icon="people-outline"
            label="Membros actuais"
            value={`${detail.currentMembers}/${detail.memberCapacity}`}
          />
          <KixikilaMetaRow icon="pulse-outline" label="Estado" value={statusLabel} />
          <KixikilaMetaRow
            icon="calendar-outline"
            label="Dia útil do débito"
            value={`${detail.debitDay}º dia útil`}
          />
          <KixikilaMetaRow
            icon="time-outline"
            label="Prazo de término"
            value={`${detail.durationMonths} meses`}
          />
          <KixikilaMetaRow
            icon="cash-outline"
            label={
              detail.commissionMode === 'separate_accounts'
                ? 'Total mensal na Kixikila'
                : 'Total mensal líquido'
            }
            value={detail.monthlyTotalWithFee}
          />
          <KixikilaMetaRow
            icon="receipt-outline"
            label="Cobrança de comissões"
            value={getCommissionModeLabel(detail.commissionMode)}
          />
          <KixikilaMetaRow
            icon="grid-outline"
            label="Capacidade de Membros"
            value={`${detail.memberCapacity}`}
          />
          <KixikilaMetaRow
            icon="trophy-outline"
            label="Próximo a receber"
            value={detail.status === 'active' ? nextReceiver?.name ?? '—' : 'Inicia após completar membros'}
          />
          <View style={[styles.inviteBlock, styles.inviteBlockLast]}>
            <Text style={styles.inviteLabel}>Código de Convite</Text>
            <View style={kixikilaDetailStyles.inviteRow}>
              <Text style={kixikilaDetailStyles.inviteCode}>{detail.inviteCode}</Text>
              <Pressable style={kixikilaDetailStyles.copyBtn} accessibilityRole="button">
                <Ionicons name="copy-outline" size={18} color="#111827" />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={kixikilaDetailStyles.card}>
          <Text style={kixikilaDetailStyles.cardTitle}>Acções</Text>
          {actions.map((action, index) => (
            <KixikilaActionRow
              key={action.id}
              icon={action.icon}
              label={action.label}
              last={index === actions.length - 1}
              onPress={() => openAction(action)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  missing: {
    margin: 24,
    fontSize: 14,
    color: '#6B7280',
  },
  inviteBlock: {
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
    marginTop: 2,
  },
  inviteBlockLast: {
    paddingBottom: 0,
  },
  inviteLabel: {
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
});
