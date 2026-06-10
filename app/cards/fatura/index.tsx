import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AddMoneyPrimaryButton,
  AddMoneyShell,
} from '@/components/add-money/AddMoneyShell';
import { AccountAvatar } from '@/components/menu/AccountSwitcherSheet';
import { NumericKeypad } from '@/components/send-money/NumericKeypad';
import {
  KULEX_ACCOUNTS,
  parseAccountBalance,
  type KulexAccount,
} from '@/constants/accounts';
import { POSTPAID_BLACK_CARD } from '@/constants/card';
import { useActiveAccount } from '@/contexts/AccountContext';
import { formatMoneyFromDigitsAsCents, normalizeDigits } from '@/lib/money';
import {
  buildPostpaidBillSummary,
  digitsToMoneyFormatted,
  parseMoneyAmount,
  POSTPAID_MINIMUM_PAYMENT_PERCENT,
  validateBillPaymentAmount,
} from '@/lib/postpaid-bill';
import { getPostpaidWalletState } from '@/lib/postpaid-wallet';

function AccountOption({
  account,
  selected,
  onPress,
}: {
  account: KulexAccount;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.optionRow, selected && styles.optionRowSelected]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}>
      <AccountAvatar account={account} size={40} />
      <View style={styles.accountText}>
        <Text style={styles.optionLabel}>{account.shortLabel}</Text>
        <Text style={styles.optionHint}>{account.accountType}</Text>
        <Text style={styles.accountBalance}>{account.balance}</Text>
      </View>
      <View style={[styles.radio, styles.accountRadio, selected && styles.radioSelected]} />
    </Pressable>
  );
}

export default function PostpaidBillScreen() {
  const insets = useSafeAreaInsets();
  const { activeAccountId } = useActiveAccount();
  const [amountDigits, setAmountDigits] = useState('');
  const [keypadOpen, setKeypadOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(activeAccountId);

  const wallet = useMemo(() => getPostpaidWalletState(), []);

  const bill = useMemo(
    () => buildPostpaidBillSummary(wallet.plafond, wallet.available),
    [wallet],
  );

  const selectedAccount = useMemo(
    () => KULEX_ACCOUNTS.find((account) => account.id === selectedAccountId) ?? KULEX_ACCOUNTS[0],
    [selectedAccountId],
  );

  const amountFormatted = useMemo(
    () => digitsToMoneyFormatted(amountDigits),
    [amountDigits],
  );

  const amountPreview = useMemo(
    () => formatMoneyFromDigitsAsCents(amountDigits || '0'),
    [amountDigits],
  );

  const validation = useMemo(
    () => validateBillPaymentAmount(amountFormatted, wallet.plafond, wallet.available),
    [amountFormatted, wallet],
  );

  const hasSufficientBalance = useMemo(() => {
    if (!validation.valid) return false;
    const balance = parseAccountBalance(selectedAccount.balance);
    const amount = parseMoneyAmount(amountFormatted);
    return balance >= amount;
  }, [amountFormatted, selectedAccount.balance, validation.valid]);

  const canContinue = bill.hasDebt && validation.valid && hasSufficientBalance;

  const addDigit = (digit: string) => {
    setAmountDigits((prev) => normalizeDigits(prev + digit));
  };

  const deleteDigit = () => {
    setAmountDigits((prev) => prev.slice(0, -1));
  };

  const continueToConfirm = () => {
    if (!canContinue) return;

    router.push({
      pathname: '/cards/fatura/confirm',
      params: { amount: amountDigits, accountId: selectedAccountId },
    });
  };

  return (
    <AddMoneyShell
      title="Pagar fatura"
      footer={
        <AddMoneyPrimaryButton
          label="Continuar"
          disabled={!canContinue}
          onPress={continueToConfirm}
        />
      }>
      <View style={styles.body}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <View>
                <Text style={styles.summaryEyebrow}>Fatura do cartão</Text>
                <Text style={styles.summaryTitle}>{POSTPAID_BLACK_CARD.label}</Text>
              </View>
              <View style={styles.summaryBadge}>
                <Text style={styles.summaryBadgeText}>{POSTPAID_BLACK_CARD.bill.periodLabel}</Text>
              </View>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Valor em dívida</Text>
              <Text style={styles.summaryValue}>AOA {bill.usedAmount}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Plafond disponível</Text>
              <Text style={styles.summaryValue}>AOA {wallet.available}</Text>
            </View>
            <View style={[styles.summaryRow, styles.summaryRowLast]}>
              <Text style={styles.summaryLabel}>Vencimento</Text>
              <Text style={styles.summaryValue}>{POSTPAID_BLACK_CARD.bill.dueDateLabel}</Text>
            </View>
          </View>

          {bill.hasDebt ? (
            <>
              <View style={styles.amountSection}>
                <Text style={styles.optionsTitle}>Quanto quer pagar?</Text>
                <Pressable
                  style={[styles.amountInput, keypadOpen && styles.amountInputActive]}
                  accessibilityRole="button"
                  accessibilityLabel="Introduzir valor a pagar"
                  onPress={() => setKeypadOpen(true)}>
                  <View style={styles.amountRow}>
                    <Text style={styles.currency}>AOA </Text>
                    <Text style={[styles.amount, !amountDigits && styles.amountEmpty]}>
                      {amountDigits ? amountPreview : '0,00'}
                    </Text>
                  </View>
                  <Text style={styles.amountHint}>Toque para introduzir o valor</Text>
                </Pressable>

                <View style={styles.boundsRow}>
                  <View style={styles.boundItem}>
                    <Text style={styles.boundLabel}>Mínimo</Text>
                    <Text style={styles.boundValue}>AOA {bill.minimumAmount}</Text>
                    <Text style={styles.boundHint}>
                      {POSTPAID_MINIMUM_PAYMENT_PERCENT}% da dívida
                    </Text>
                  </View>
                  <View style={styles.boundDivider} />
                  <View style={styles.boundItem}>
                    <Text style={styles.boundLabel}>Máximo</Text>
                    <Text style={styles.boundValue}>AOA {bill.usedAmount}</Text>
                    <Text style={styles.boundHint}>Total em dívida</Text>
                  </View>
                </View>

                <View style={styles.quickActions}>
                  <Pressable
                    style={styles.quickBtn}
                    accessibilityRole="button"
                    onPress={() => setAmountDigits(bill.minimumDigits)}>
                    <Text style={styles.quickBtnText}>Usar mínimo</Text>
                  </Pressable>
                  <Pressable
                    style={styles.quickBtn}
                    accessibilityRole="button"
                    onPress={() => setAmountDigits(bill.usedDigits)}>
                    <Text style={styles.quickBtnText}>Usar total</Text>
                  </Pressable>
                </View>

                {validation.message && amountDigits ? (
                  <Text style={styles.validationError}>{validation.message}</Text>
                ) : null}

                {!hasSufficientBalance && validation.valid ? (
                  <Text style={styles.balanceWarning}>
                    Saldo insuficiente na conta {selectedAccount.shortLabel} para este pagamento.
                  </Text>
                ) : null}
              </View>

              <Text style={[styles.optionsTitle, styles.accountsTitle]}>Pagar com</Text>
              {KULEX_ACCOUNTS.map((account) => (
                <AccountOption
                  key={account.id}
                  account={account}
                  selected={selectedAccountId === account.id}
                  onPress={() => setSelectedAccountId(account.id)}
                />
              ))}
            </>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-circle-outline" size={40} color="rgba(255,255,255,0.55)" />
              <Text style={styles.emptyTitle}>Sem valor em dívida</Text>
              <Text style={styles.emptyText}>
                Não há saldo utilizado do plafond para pagar neste momento.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      <Modal
        visible={keypadOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setKeypadOpen(false)}>
        <View style={styles.keypadModal}>
          <Pressable style={styles.keypadOverlay} onPress={() => setKeypadOpen(false)} />
          <View style={[styles.keypadSheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <View style={styles.keypadHandle} />
          <Text style={styles.keypadTitle}>Valor a pagar</Text>
          <View style={styles.keypadAmountRow}>
            <Text style={styles.keypadCurrency}>AOA </Text>
            <Text style={styles.keypadAmount}>{amountPreview}</Text>
          </View>
          <NumericKeypad onDigit={addDigit} onDelete={deleteDigit} variant="light" />
          <Pressable
            style={styles.keypadDoneBtn}
            accessibilityRole="button"
            onPress={() => setKeypadOpen(false)}>
            <Text style={styles.keypadDoneText}>Concluído</Text>
          </Pressable>
        </View>
        </View>
      </Modal>
    </AddMoneyShell>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 12,
  },
  summaryCard: {
    marginTop: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  summaryEyebrow: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.55)',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  summaryTitle: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  summaryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  summaryBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
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
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'right',
  },
  amountSection: {
    marginTop: 24,
  },
  amountInput: {
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  amountInputActive: {
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  amountHint: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
  },
  optionsTitle: {
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  currency: {
    fontSize: 20,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.55)',
  },
  amount: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  amountEmpty: {
    color: 'rgba(255,255,255,0.35)',
  },
  boundsRow: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    overflow: 'hidden',
  },
  boundItem: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  boundDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  boundLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.55)',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  boundValue: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  boundHint: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  quickBtn: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  validationError: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '600',
    color: '#FCA5A5',
    textAlign: 'center',
    lineHeight: 17,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    marginBottom: 10,
  },
  optionRowSelected: {
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  accountText: {
    flex: 1,
  },
  accountBalance: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  accountRadio: {
    marginLeft: 'auto',
  },
  accountsTitle: {
    marginTop: 20,
    marginBottom: 6,
  },
  balanceWarning: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '600',
    color: '#FCA5A5',
    lineHeight: 17,
    textAlign: 'center',
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  optionHint: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.55)',
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  radioSelected: {
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
  },
  emptyState: {
    marginTop: 40,
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
    lineHeight: 20,
  },
  keypadOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  keypadModal: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  keypadSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  keypadHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    marginBottom: 14,
  },
  keypadTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  keypadAmountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  keypadCurrency: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  keypadAmount: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1A1A4E',
    letterSpacing: -0.5,
  },
  keypadDoneBtn: {
    marginTop: 12,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1A1A4E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadDoneText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
