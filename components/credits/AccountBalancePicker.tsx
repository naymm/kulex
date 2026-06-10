import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AccountAvatar } from '@/components/menu/AccountSwitcherSheet';
import { KULEX_ACCOUNTS, type KulexAccount } from '@/constants/accounts';

const NAVY = '#1A1A4E';

type Props = {
  selectedAccountId: string;
  onAccountIdChange: (accountId: string) => void;
  validationMessage?: string;
};

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
      <View style={[styles.radio, selected && styles.radioSelected]} />
    </Pressable>
  );
}

export function AccountBalancePicker({
  selectedAccountId,
  onAccountIdChange,
  validationMessage,
}: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.sectionTitle}>Pagar com</Text>
      {KULEX_ACCOUNTS.map((account) => (
        <AccountOption
          key={account.id}
          account={account}
          selected={selectedAccountId === account.id}
          onPress={() => onAccountIdChange(account.id)}
        />
      ))}
      {validationMessage ? (
        <Text style={styles.validation}>{validationMessage}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  optionRowSelected: {
    borderColor: NAVY,
    backgroundColor: '#EEF0F8',
  },
  accountText: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  optionHint: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  accountBalance: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '700',
    color: NAVY,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
  },
  radioSelected: {
    borderColor: NAVY,
    backgroundColor: NAVY,
  },
  validation: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
    lineHeight: 16,
  },
});
