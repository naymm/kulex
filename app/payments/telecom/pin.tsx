import { useLocalSearchParams } from 'expo-router';
import { PaymentPinScreen } from '@/components/payments/PaymentPinScreen';
import { toPaymentRouteParams } from '@/lib/payment-route-params';

export default function TelecomPaymentPinScreen() {
  const params = useLocalSearchParams<{
    provider?: string;
    providerLabel?: string;
    product?: string;
    value?: string;
    phone?: string;
  }>();

  return (
    <PaymentPinScreen
      shellTitle="Pagamento de Serviços"
      successPathname="/payments/telecom/success"
      params={toPaymentRouteParams(params)}
    />
  );
}
