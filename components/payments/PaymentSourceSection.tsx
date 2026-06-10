import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AccountAvatar } from '@/components/menu/AccountSwitcherSheet';
import { KULEX_ACCOUNTS, type KulexAccount } from '@/constants/accounts';
import { ADIANTAMENTO_CREDIT } from '@/constants/credit-line';
import { getCreditLineAvailableFormatted } from '@/lib/credit-advances';
import type { PaymentFundingSource } from '@/lib/payment-source';

const NAVY = '#1A1A4E';

type Props = {
  variant?: 'light' | 'dark';
  fundingSource: PaymentFundingSource;
  onFundingSourceChange: (source: PaymentFundingSource) => void;
  accountId: string;
  onAccountIdChange: (accountId: string) => void;
  validationMessage?: string;
};

function FundingOption({
  variant,
  selected,
  title,
  subtitle,
  icon,
  onPress,
}: {
  variant: 'light' | 'dark';
  selected: boolean;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  const isDark = variant === 'dark';

  return (
    <Pressable
      style={[
        styles.optionRow,
        isDark ? styles.optionRowDark : styles.optionRowLight,
        selected && (isDark ? styles.optionRowSelectedDark : styles.optionRowSelectedLight),
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}>
      <View style={[styles.optionIcon, isDark ? styles.optionIconDark : styles.optionIconLight]}>
        <Ionicons name={icon} size={20} color={isDark ? '#FFFFFF' : NAVY} />
      </View>
      <View style={styles.optionText}>
        <Text style={[styles.optionTitle, isDark && styles.optionTitleDark]}>{title}</Text>
        <Text style={[styles.optionSubtitle, isDark && styles.optionSubtitleDark]}>{subtitle}</Text>
      </View>
      <View
        style={[
          styles.radio,
          isDark ? styles.radioDark : styles.radioLight,
          selected && (isDark ? styles.radioSelectedDark : styles.radioSelectedLight),
        ]}
      />
    </Pressable>
  );
}

function AccountOption({
  variant,
  account,
  selected,
  onPress,
}: {
  variant: 'light' | 'dark';
  account: KulexAccount;
  selected: boolean;
  onPress: () => void;
}) {
  const isDark = variant === 'dark';

  return (
    <Pressable
      style={[
        styles.accountRow,
        isDark ? styles.optionRowDark : styles.optionRowLight,
        selected && (isDark ? styles.optionRowSelectedDark : styles.optionRowSelectedLight),
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}>
      <AccountAvatar account={account} size={40} />
      <View style={styles.optionText}>
        <Text style={[styles.optionTitle, isDark && styles.optionTitleDark]}>
          {account.shortLabel}
        </Text>
        <Text style={[styles.optionSubtitle, isDark && styles.optionSubtitleDark]}>
          {account.accountType}
        </Text>
        <Text style={[styles.accountBalance, isDark && styles.optionSubtitleDark]}>
          {account.balance}
        </Text>
      </View>
      <View
        style={[
          styles.radio,
          isDark ? styles.radioDark : styles.radioLight,
          selected && (isDark ? styles.radioSelectedDark : styles.radioSelectedLight),
        ]}
      />
    </Pressable>
  );
}

export function PaymentSourceSection({
  variant = 'light',
  fundingSource,
  onFundingSourceChange,
  accountId,
  onAccountIdChange,
  validationMessage,
}: Props) {
  const isDark = variant === 'dark';
  const availableCredit = getCreditLineAvailableFormatted();

  return (
    <View style={styles.wrap}>
      <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
        Forma de pagamento
      </Text>

      <FundingOption
        variant={variant}
        selected={fundingSource === 'balance'}
        title="Saldo na conta"
        subtitle="Debitar de uma conta Kulex"
        icon="wallet-outline"
        onPress={() => onFundingSourceChange('balance')}
      />

      {fundingSource === 'balance'
        ? KULEX_ACCOUNTS.map((account) => (
            <AccountOption
              key={account.id}
              variant={variant}
              account={account}
              selected={accountId === account.id}
              onPress={() => onAccountIdChange(account.id)}
            />
          ))
        : null}

      <FundingOption
        variant={variant}
        selected={fundingSource === 'credit'}
        title="À crédito"
        subtitle={`Adiantamento Kulex · disponível AOA ${availableCredit}`}
        icon="trending-up-outline"
        onPress={() => onFundingSourceChange('credit')}
      />

      {fundingSource === 'credit' ? (
        <View style={[styles.creditNote, isDark && styles.creditNoteDark]}>
          <Ionicons name="information-circle-outline" size={16} color={isDark ? '#FDE68A' : '#C9A227'} />
          <Text style={[styles.creditNoteText, isDark && styles.creditNoteTextDark]}>
            {ADIANTAMENTO_CREDIT.description}
          </Text>
        </View>
      ) : null}

      {validationMessage ? (
        <Text style={[styles.validation, isDark && styles.validationDark]}>{validationMessage}</Text>
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
  sectionTitleDark: {
    color: '#FFFFFF',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
  },
  optionRowLight: {
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  optionRowDark: {
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  optionRowSelectedLight: {
    borderColor: NAVY,
    backgroundColor: '#EEF0F8',
  },
  optionRowSelectedDark: {
    borderColor: 'rgba(255,255,255,0.45)',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 10,
    marginLeft: 12,
    borderWidth: 1,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionIconLight: {
    backgroundColor: '#FFFFFF',
  },
  optionIconDark: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  optionTitleDark: {
    color: '#FFFFFF',
  },
  optionSubtitle: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  optionSubtitleDark: {
    color: 'rgba(255,255,255,0.55)',
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
  },
  radioLight: {
    borderColor: '#D1D5DB',
  },
  radioDark: {
    borderColor: 'rgba(255,255,255,0.45)',
  },
  radioSelectedLight: {
    borderColor: NAVY,
    backgroundColor: NAVY,
  },
  radioSelectedDark: {
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
  },
  creditNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#F3E8C4',
    marginBottom: 8,
  },
  creditNoteDark: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.12)',
  },
  creditNoteText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 17,
  },
  creditNoteTextDark: {
    color: 'rgba(255,255,255,0.7)',
  },
  validation: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
    lineHeight: 16,
  },
  validationDark: {
    color: '#FCA5A5',
  },
});
