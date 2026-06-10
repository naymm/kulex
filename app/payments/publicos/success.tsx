import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { PaymentSuccessScreen } from '@/components/payments/PaymentSuccessScreen';
import { finalizeCreditPaymentIfNeeded } from '@/lib/payment-completion';
import { getPaymentFundingSourceLabel } from '@/lib/payment-source';

export default function PublicServicePaymentSuccessScreen() {
  const { providerLabel, value, paymentSource, accountId } = useLocalSearchParams<{
    providerLabel?: string;
    value?: string;
    paymentSource?: string;
    accountId?: string;
  }>();

  const subtitle = useMemo(() => {
    const base =
      providerLabel && value
        ? `Pagamento de ${providerLabel} no valor de ${value} registado com sucesso.`
        : 'O seu pagamento foi registado com sucesso.';

    if (paymentSource === 'credit') {
      return `${base} O valor foi registado como adiantamento em Meus Créditos.`;
    }

    return `${base} Debitado da ${getPaymentFundingSourceLabel('balance', accountId)}.`;
  }, [accountId, paymentSource, providerLabel, value]);

  const onComplete = useCallback(() => {
    finalizeCreditPaymentIfNeeded({
      paymentSource,
      value,
      title: providerLabel ? `Pagamento ${providerLabel}` : 'Pagamento de Serviço',
      description: value ?? '',
      category: 'servico',
    });
  }, [paymentSource, providerLabel, value]);

  return (
    <PaymentSuccessScreen
      title={'Pagamento efectuado com\nsucesso'}
      subtitle={subtitle}
      onComplete={onComplete}
      onDone={() => router.replace('/(tabs)/payments')}
    />
  );
}
