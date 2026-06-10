import { useLocalSearchParams } from 'expo-router';
import { PaymentPinScreen } from '@/components/payments/PaymentPinScreen';
import { toPaymentRouteParams } from '@/lib/payment-route-params';

export default function RemessaPinScreen() {
  const params = toPaymentRouteParams(useLocalSearchParams());

  return (
    <PaymentPinScreen
      shellTitle="Remessa"
      subtitle="Para confirmar o envio"
      successPathname="/remessas/enviar/sucesso"
      params={params}
    />
  );
}
