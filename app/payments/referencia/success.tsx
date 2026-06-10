import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { PaymentSuccessScreen } from '@/components/payments/PaymentSuccessScreen';
import { finalizeCreditPaymentIfNeeded } from '@/lib/payment-completion';
import { getPaymentFundingSourceLabel } from '@/lib/payment-source';

export default function ReferencePaymentSuccessScreen() {
  const { entity, reference, amount, paymentSource, accountId } = useLocalSearchParams<{
    entity?: string;
    reference?: string;
    amount?: string;
    paymentSource?: string;
    accountId?: string;
  }>();

  const subtitle = useMemo(() => {
    const base =
      entity && reference && amount
        ? `Pagamento à entidade ${entity}, referência ${reference}, no valor de AOA ${amount}.`
        : 'O seu pagamento foi registado com sucesso.';

    if (paymentSource === 'credit') {
      return `${base} O valor foi registado como adiantamento em Meus Créditos.`;
    }

    return `${base} Debitado da ${getPaymentFundingSourceLabel('balance', accountId)}.`;
  }, [accountId, amount, entity, paymentSource, reference]);

  const onComplete = useCallback(() => {
    finalizeCreditPaymentIfNeeded({
      paymentSource,
      amount,
      title: 'Pagamento Por Referência',
      description: `${entity ?? ''} · ${reference ?? ''}`,
      category: 'referencia',
    });
  }, [amount, entity, paymentSource, reference]);

  return (
    <PaymentSuccessScreen
      title={'Pagamento efectuado com\nsucesso'}
      subtitle={subtitle}
      onComplete={onComplete}
      onDone={() => router.replace('/(tabs)/payments')}
    />
  );
}
