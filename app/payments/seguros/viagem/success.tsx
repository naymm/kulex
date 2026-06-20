import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { PaymentSuccessScreen } from '@/components/payments/PaymentSuccessScreen';
import { useCreditPaymentFinalize } from '@/hooks/useCreditPaymentFinalize';
import { getPaymentFundingSourceLabel } from '@/lib/payment-source';
import { withOriginParams } from '@/lib/navigation';

export default function ViagemInsuranceSuccessScreen() {
  const { from, premium, productLabel, paymentSource, accountId } = useLocalSearchParams<{
    from?: string;
    premium?: string;
    productLabel?: string;
    paymentSource?: string;
    accountId?: string;
  }>();

  const subtitle = useMemo(() => {
    const label = productLabel ?? 'Assistência em Viagem';
    const base = premium
      ? `Pagamento de ${label} no valor de AOA ${premium} registado com sucesso.`
      : `Pagamento de ${label} registado com sucesso.`;

    if (paymentSource === 'credit') {
      return `${base} O valor foi registado como adiantamento em Meus Créditos.`;
    }

    return `${base} Debitado da ${getPaymentFundingSourceLabel('balance', accountId)}.`;
  }, [accountId, paymentSource, premium, productLabel]);

  const finalizeCredit = useCreditPaymentFinalize();

  const onComplete = useCallback(() => {
    finalizeCredit({
      paymentSource,
      premium,
      title: productLabel ?? 'Assistência em Viagem',
      description: premium ?? '',
      category: 'seguro',
    });
  }, [finalizeCredit, paymentSource, premium, productLabel]);

  return (
    <PaymentSuccessScreen
      title={'Pagamento efectuado com\nsucesso'}
      subtitle={subtitle}
      buttonLabel="Entendi"
      onComplete={onComplete}
      onDone={() =>
        router.replace({
          pathname: '/payments/seguros',
          params: withOriginParams(from),
        })
      }
    />
  );
}
