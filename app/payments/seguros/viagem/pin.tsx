import { useLocalSearchParams } from 'expo-router';
import { PaymentPinScreen } from '@/components/payments/PaymentPinScreen';
import { toPaymentRouteParams } from '@/lib/payment-route-params';

export default function ViagemInsurancePinScreen() {
  const params = useLocalSearchParams<{
    premium?: string;
    productLabel?: string;
    paymentSource?: string;
    accountId?: string;
  }>();

  return (
    <PaymentPinScreen
      shellTitle="Pagamento de Seguro"
      subtitle="Para validação do pagamento"
      successPathname="/payments/seguros/viagem/success"
      params={toPaymentRouteParams(params)}
    />
  );
}
