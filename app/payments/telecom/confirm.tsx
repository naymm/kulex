import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PaymentFundingSummaryRow } from '@/components/payments/PaymentFundingSummaryRow';
import { PaymentSourceSection } from '@/components/payments/PaymentSourceSection';
import { usePaymentFunding } from '@/hooks/usePaymentFunding';
import { parsePaymentAmountFromFields } from '@/lib/credit-advances';

const NAVY = '#1A1A4E';

export default function TelecomConfirmScreen() {
  const insets = useSafeAreaInsets();
  const { provider, providerLabel, product, value, phone } = useLocalSearchParams<{
    provider?: string;
    providerLabel?: string;
    product?: string;
    value?: string;
    phone?: string;
  }>();

  const amount = useMemo(() => parsePaymentAmountFromFields({ value }), [value]);
  const {
    fundingSource,
    setFundingSource,
    accountId,
    setAccountId,
    validation,
    canContinue,
    fundingParams,
  } = usePaymentFunding(amount);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerPattern} />
        <View style={styles.headerContent}>
          <Pressable style={styles.headerBtn} onPress={() => router.back()} accessibilityRole="button">
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={styles.headerTitle}>Confirmar</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 16) + 90 },
        ]}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Resumo do pagamento</Text>

        <View style={styles.card}>
          <SummaryRow label="Operador" value={providerLabel ?? '—'} />
          <SummaryRow label="Produto" value={product ?? '—'} />
          <SummaryRow label="Valor" value={value ?? '—'} last />
        </View>

        <View style={styles.card}>
          <SummaryRow label="Número de telefone" value={phone ?? '—'} />
          <PaymentFundingSummaryRow
            fundingSource={fundingSource}
            accountId={accountId}
            last
          />
        </View>

        <PaymentSourceSection
          fundingSource={fundingSource}
          onFundingSourceChange={setFundingSource}
          accountId={accountId}
          onAccountIdChange={setAccountId}
          validationMessage={!canContinue ? validation.message : undefined}
        />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <Pressable
          style={[styles.primaryBtn, !canContinue && styles.primaryBtnDisabled]}
          accessibilityRole="button"
          accessibilityState={{ disabled: !canContinue }}
          disabled={!canContinue}
          onPress={() =>
            router.push({
              pathname: '/payments/telecom/pin',
              params: {
                provider: typeof provider === 'string' ? provider : '',
                providerLabel: providerLabel ?? '',
                product: product ?? '',
                value: value ?? '',
                phone: phone ?? '',
                ...fundingParams,
              },
            })
          }>
          <Text style={styles.primaryBtnText}>Confirmar pagamento</Text>
        </Pressable>
      </View>
    </View>
  );
}

function SummaryRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    backgroundColor: NAVY,
    paddingHorizontal: 20,
    paddingBottom: 24,
    overflow: 'hidden',
  },
  headerPattern: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderBottomLeftRadius: 120,
    borderBottomRightRadius: 80,
    transform: [{ scaleX: 1.4 }, { translateY: -20 }],
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 14,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    overflow: 'hidden',
  },
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
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
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
