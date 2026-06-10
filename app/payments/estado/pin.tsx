import { useLocalSearchParams } from 'expo-router';
import { PaymentPinScreen } from '@/components/payments/PaymentPinScreen';
import { toPaymentRouteParams } from '@/lib/payment-route-params';

export default function EstadoPaymentPinScreen() {
  const params = useLocalSearchParams<{
    reference?: string;
    amount?: string;
    amountDigits?: string;
  }>();

  return (
    <PaymentPinScreen
      shellTitle="Pagamento ao Estado"
      subtitle="Para confirmar o pagamento ao Estado"
      successPathname="/payments/estado/success"
      params={toPaymentRouteParams(params)}
    />
  );
}
