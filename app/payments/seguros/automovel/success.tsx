import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { PaymentSuccessScreen } from '@/components/payments/PaymentSuccessScreen';
import { finalizeCreditPaymentIfNeeded } from '@/lib/payment-completion';
import { getPaymentFundingSourceLabel } from '@/lib/payment-source';
import { withOriginParams } from '@/lib/navigation';

export default function AutoInsuranceSuccessScreen() {
  const { from, premium, productLabel, paymentSource, accountId } = useLocalSearchParams<{
    from?: string;
    premium?: string;
    productLabel?: string;
    paymentSource?: string;
    accountId?: string;
  }>();

  const subtitle = useMemo(() => {
    const label = productLabel ?? 'Seguro Automóvel';
    const base = premium
      ? `Pagamento de ${label} no valor de AOA ${premium.replace(/\s/g, '')} registado com sucesso.`
      : `Pagamento de ${label} registado com sucesso.`;

    if (paymentSource === 'credit') {
      return `${base} O valor foi registado como adiantamento em Meus Créditos.`;
    }

    return `${base} Debitado da ${getPaymentFundingSourceLabel('balance', accountId)}.`;
  }, [accountId, paymentSource, premium, productLabel]);

  const onComplete = useCallback(() => {
    finalizeCreditPaymentIfNeeded({
      paymentSource,
      premium,
      title: productLabel ?? 'Seguro Automóvel',
      description: premium ?? '',
      category: 'seguro',
    });
  }, [paymentSource, premium, productLabel]);

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
