import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { PaymentSuccessScreen } from '@/components/payments/PaymentSuccessScreen';
import { finalizeCreditPaymentIfNeeded } from '@/lib/payment-completion';
import { getPaymentFundingSourceLabel } from '@/lib/payment-source';

export default function QrCodePaymentSuccessScreen() {
  const { merchant, amount, paymentSource, accountId } = useLocalSearchParams<{
    merchant?: string;
    amount?: string;
    paymentSource?: string;
    accountId?: string;
  }>();

  const subtitle = useMemo(() => {
    const base =
      merchant && amount
        ? `Pagamento a ${merchant} no valor de AOA ${amount}.`
        : 'O seu pagamento foi registado com sucesso.';

    if (paymentSource === 'credit') {
      return `${base} O valor foi registado como adiantamento em Meus Créditos.`;
    }

    return `${base} Debitado da ${getPaymentFundingSourceLabel('balance', accountId)}.`;
  }, [accountId, amount, merchant, paymentSource]);

  const onComplete = useCallback(() => {
    finalizeCreditPaymentIfNeeded({
      paymentSource,
      amount,
      title: 'Pagamento QR Code',
      description: merchant ?? '',
      category: 'qrcode',
    });
  }, [amount, merchant, paymentSource]);

  return (
    <PaymentSuccessScreen
      title="Pagamento concluído"
      subtitle={subtitle}
      onDone={() => router.dismissTo('/(tabs)/payments')}
      onComplete={onComplete}
    />
  );
}
