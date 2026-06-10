import { StyleSheet, Text, View } from 'react-native';
import {
  getPaymentFundingSourceLabel,
  type PaymentFundingSource,
} from '@/lib/payment-source';

type Props = {
  fundingSource: PaymentFundingSource;
  accountId?: string;
  last?: boolean;
};

export function PaymentFundingSummaryRow({ fundingSource, accountId, last }: Props) {
  const label =
    fundingSource === 'credit'
      ? 'À crédito (Adiantamento Kulex)'
      : getPaymentFundingSourceLabel('balance', accountId);

  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <Text style={styles.rowLabel}>Forma de pagamento</Text>
      <Text style={styles.rowValue}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  rowLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  rowValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
});
