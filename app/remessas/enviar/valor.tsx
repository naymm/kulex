import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  AddMoneyPrimaryButton,
  AddMoneyShell,
} from '@/components/add-money/AddMoneyShell';
import { NumericKeypad } from '@/components/send-money/NumericKeypad';
import { REMITTANCE_FEE_MODES, type RemittanceFeeMode } from '@/constants/remessas';
import { WITHDRAW_BALANCE } from '@/constants/withdraw';
import { formatMoneyFromDigitsAsCents, normalizeDigits } from '@/lib/money';
import { buildRemittanceSummary } from '@/lib/remessas';
import { parseRemessaParams, remessaParamsToRoute } from '@/lib/remessas-route';

export default function RemessaValorScreen() {
  const params = parseRemessaParams(useLocalSearchParams());
  const [amountDigits, setAmountDigits] = useState('');
  const [feeMode, setFeeMode] = useState<RemittanceFeeMode>(params.feeMode ?? 'add');

  const amountFormatted = useMemo(
    () => formatMoneyFromDigitsAsCents(amountDigits),
    [amountDigits],
  );

  const summary = useMemo(
    () => buildRemittanceSummary(amountDigits, params.corridorId ?? '', feeMode),
    [amountDigits, feeMode, params.corridorId],
  );

  const amountHint =
    feeMode === 'add'
      ? 'Valor a enviar ao beneficiário'
      : 'Total a debitar da conta';

  const addDigit = (digit: string) => {
    setAmountDigits((prev) => normalizeDigits(prev + digit));
  };

  const deleteDigit = () => {
    setAmountDigits((prev) => prev.slice(0, -1));
  };

  return (
    <AddMoneyShell
      title="Montante"
      footer={
        <AddMoneyPrimaryButton
          label="Continuar"
          disabled={!summary.valid}
          onPress={() =>
            router.push({
              pathname: '/remessas/enviar/confirm',
              params: remessaParamsToRoute({
                ...params,
                amountDigits,
                feeMode,
              }),
            })
          }
        />
      }>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.sectionLabel}>Como aplicar a taxa</Text>
        <View style={styles.feeModes}>
          {REMITTANCE_FEE_MODES.map((option) => {
            const selected = feeMode === option.id;
            return (
              <Pressable
                key={option.id}
                style={[styles.feeModeRow, selected && styles.feeModeRowSelected]}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setFeeMode(option.id)}>
                <View style={styles.feeModeText}>
                  <Text style={styles.feeModeTitle}>{option.title}</Text>
                  <Text style={styles.feeModeSubtitle}>{option.subtitle}</Text>
                </View>
                {selected ? (
                  <Ionicons name="checkmark-circle" size={22} color="#4ADE80" />
                ) : (
                  <Ionicons name="ellipse-outline" size={22} color="rgba(255,255,255,0.35)" />
                )}
              </Pressable>
            );
          })}
        </View>

        <Text style={[styles.sectionLabel, styles.amountLabel]}>{amountHint}</Text>
        <View style={styles.amountSection}>
          <View style={styles.amountRow}>
            <Text style={styles.currency}>AOA </Text>
            <Text style={[styles.amount, !amountDigits && styles.amountEmpty]}>
              {amountFormatted}
            </Text>
          </View>
          <View style={styles.balancePill}>
            <Text style={styles.balanceText}>SALDO: AOA {WITHDRAW_BALANCE}</Text>
          </View>

          {summary.rateLabel && amountDigits ? (
            <Text style={styles.fxPreview}>
              Beneficiário recebe ≈ {summary.foreignFormatted} {summary.foreignCurrency}
            </Text>
          ) : null}

          {feeMode === 'add' && summary.valid ? (
            <Text style={styles.feeNote}>
              Total debitado: AOA {summary.totalFormatted} (inclui taxa de AOA{' '}
              {summary.feeFormatted})
            </Text>
          ) : null}

          {feeMode === 'deduct' && summary.valid ? (
            <Text style={styles.feeNote}>
              Após taxa de AOA {summary.feeFormatted}: AOA {summary.netAmountFormatted} convertidos
            </Text>
          ) : null}

          {summary.message && amountDigits ? (
            <Text style={styles.errorText}>{summary.message}</Text>
          ) : null}
        </View>
      </ScrollView>

      <NumericKeypad onDigit={addDigit} onDelete={deleteDigit} variant="dark" />
    </AddMoneyShell>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  amountLabel: {
    marginTop: 20,
  },
  feeModes: {
    gap: 10,
  },
  feeModeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  feeModeRowSelected: {
    borderColor: 'rgba(74,222,128,0.45)',
    backgroundColor: 'rgba(74,222,128,0.08)',
  },
  feeModeText: {
    flex: 1,
    gap: 4,
  },
  feeModeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  feeModeSubtitle: {
    fontSize: 12,
    lineHeight: 17,
    color: 'rgba(255,255,255,0.55)',
  },
  amountSection: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  currency: {
    fontSize: 22,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.55)',
  },
  amount: {
    fontSize: 44,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  amountEmpty: {
    color: 'rgba(255,255,255,0.35)',
  },
  balancePill: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  balanceText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 0.4,
  },
  fxPreview: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: '600',
    color: '#4ADE80',
    textAlign: 'center',
  },
  feeNote: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 17,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  errorText: {
    marginTop: 12,
    fontSize: 13,
    color: '#FCA5A5',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
