import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  AddMoneyPrimaryButton,
  AddMoneyShell,
} from '@/components/add-money/AddMoneyShell';
import { PaymentSourceSection } from '@/components/payments/PaymentSourceSection';
import { SIMULATION_PRICES } from '@/constants/automovel-insurance';
import { usePaymentFunding } from '@/hooks/usePaymentFunding';
import { parsePaymentAmountFromFields } from '@/lib/credit-advances';

export default function AutoInsurancePagamentoScreen() {
  const premium = SIMULATION_PRICES.anual.replace(/\s/g, '');
  const amount = useMemo(() => parsePaymentAmountFromFields({ premium }), [premium]);
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
    <AddMoneyShell
      title="Método de Pagamento"
      footer={
        <AddMoneyPrimaryButton
          label="Continuar"
          disabled={!canContinue}
          onPress={() =>
            router.push({
              pathname: '/payments/seguros/automovel/pin',
              params: {
                premium,
                productLabel: 'Seguro Automóvel',
                ...fundingParams,
              },
            })
          }
        />
      }>
      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>Prémio anual</Text>
        <Text style={styles.summaryValue}>AOA {SIMULATION_PRICES.anual}</Text>
      </View>

      <PaymentSourceSection
        variant="dark"
        fundingSource={fundingSource}
        onFundingSourceChange={setFundingSource}
        accountId={accountId}
        onAccountIdChange={setAccountId}
        validationMessage={!canContinue ? validation.message : undefined}
      />
    </AddMoneyShell>
  );
}

const styles = StyleSheet.create({
  summary: {
    marginTop: 28,
    marginBottom: 8,
    padding: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.55)',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  summaryValue: {
    marginTop: 6,
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
