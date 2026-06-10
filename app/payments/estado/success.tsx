import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { PaymentSuccessScreen } from '@/components/payments/PaymentSuccessScreen';
import { finalizeCreditPaymentIfNeeded } from '@/lib/payment-completion';
import { getPaymentFundingSourceLabel } from '@/lib/payment-source';

export default function EstadoPaymentSuccessScreen() {
  const { reference, amount, amountDigits, paymentSource, accountId } = useLocalSearchParams<{
    reference?: string;
    amount?: string;
    amountDigits?: string;
    paymentSource?: string;
    accountId?: string;
  }>();

  const subtitle = useMemo(() => {
    const base =
      reference && amount
        ? `Pagamento ao Estado de AOA ${amount} com referência ${reference} registado com sucesso.`
        : 'O seu pagamento ao Estado foi registado com sucesso.';

    if (paymentSource === 'credit') {
      return `${base} O valor foi registado como adiantamento em Meus Créditos.`;
    }

    return `${base} Debitado da ${getPaymentFundingSourceLabel('balance', accountId)}.`;
  }, [accountId, amount, paymentSource, reference]);

  const onComplete = useCallback(() => {
    finalizeCreditPaymentIfNeeded({
      paymentSource,
      amount,
      amountDigits,
      title: 'Pagamento ao Estado',
      description: reference ?? '',
      category: 'estado',
    });
  }, [amount, amountDigits, paymentSource, reference]);

  return (
    <PaymentSuccessScreen
      title={'Pagamento efectuado com\nsucesso'}
      subtitle={subtitle}
      onComplete={onComplete}
      onDone={() => router.replace('/(tabs)/payments')}
    />
  );
}
