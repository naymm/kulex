import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  AddMoneyPrimaryButton,
  AddMoneyShell,
} from '@/components/add-money/AddMoneyShell';
import { PaymentSourceSection } from '@/components/payments/PaymentSourceSection';
import { VIAGEM_SIMULATION_PRICE } from '@/constants/viagem-insurance';
import { usePaymentFunding } from '@/hooks/usePaymentFunding';
import { parsePaymentAmountFromFields } from '@/lib/credit-advances';

export default function ViagemInsurancePagamentoScreen() {
  const amount = useMemo(
    () => parsePaymentAmountFromFields({ premium: VIAGEM_SIMULATION_PRICE }),
    [],
  );
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
              pathname: '/payments/seguros/viagem/pin',
              params: {
                premium: VIAGEM_SIMULATION_PRICE,
                productLabel: 'Assistência em Viagem',
                ...fundingParams,
              },
            })
          }
        />
      }>
      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>Prémio</Text>
        <Text style={styles.summaryValue}>AOA {VIAGEM_SIMULATION_PRICE}</Text>
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
