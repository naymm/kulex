import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AccountBalancePicker } from '@/components/credits/AccountBalancePicker';
import { CreditoFlowHeader, NAVY } from '@/components/credito-flow/CreditoFlowHeader';
import { useActiveAccount } from '@/contexts/AccountContext';
import {
  getAdvanceSettlementTitle,
  type AdvanceSettlementMode,
} from '@/lib/credit-advances';
import {
  amountToSettlementDigits,
  validateAdvanceSettlement,
} from '@/lib/credit-settlement';

export default function LiquidarAdiantamentoScreen() {
  const insets = useSafeAreaInsets();
  const { mode, advanceId } = useLocalSearchParams<{
    mode?: string;
    advanceId?: string;
  }>();
  const settlementMode: AdvanceSettlementMode = mode === 'all' ? 'all' : 'single';
  const resolvedAdvanceId = typeof advanceId === 'string' ? advanceId : '';
  const { activeAccountId } = useActiveAccount();
  const [accountId, setAccountId] = useState(activeAccountId);

  const title = useMemo(
    () => getAdvanceSettlementTitle(settlementMode, resolvedAdvanceId),
    [resolvedAdvanceId, settlementMode],
  );

  const validation = useMemo(
    () => validateAdvanceSettlement(settlementMode, accountId, resolvedAdvanceId),
    [accountId, resolvedAdvanceId, settlementMode],
  );

  const continueToPin = () => {
    if (!validation.valid) return;

    router.push({
      pathname: '/credito-flow/meus-creditos/adiantamento/pin',
      params: {
        mode: settlementMode,
        advanceId: resolvedAdvanceId,
        accountId,
        amount: validation.amountFormatted,
        amountDigits: amountToSettlementDigits(validation.amount),
        title,
      },
    });
  };

  return (
    <View style={styles.container}>
      <CreditoFlowHeader title="Liquidar adiantamento" icon="flash-outline" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 16) + 90 },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>
            {settlementMode === 'all' ? 'Total a liquidar' : 'Montante a liquidar'}
          </Text>
          <Text style={styles.amountValue}>AOA {validation.amountFormatted}</Text>
          <Text style={styles.amountHint}>
            {settlementMode === 'all'
              ? 'Serão liquidados todos os adiantamentos activos.'
              : title}
          </Text>
        </View>

        <AccountBalancePicker
          selectedAccountId={accountId}
          onAccountIdChange={setAccountId}
          validationMessage={!validation.valid ? validation.message : undefined}
        />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable
          style={[styles.primaryBtn, !validation.valid && styles.primaryBtnDisabled]}
          accessibilityRole="button"
          accessibilityState={{ disabled: !validation.valid }}
          disabled={!validation.valid}
          onPress={continueToPin}>
          <Text style={styles.primaryBtnText}>Continuar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 22, paddingTop: 22 },
  amountCard: {
    borderRadius: 16,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#F3E8C4',
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  amountValue: {
    marginTop: 8,
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  amountHint: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 22,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  primaryBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnDisabled: {
    backgroundColor: '#D1D5DB',
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
