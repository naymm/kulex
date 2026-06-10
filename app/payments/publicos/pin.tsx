import { useLocalSearchParams } from 'expo-router';
import { PaymentPinScreen } from '@/components/payments/PaymentPinScreen';
import { toPaymentRouteParams } from '@/lib/payment-route-params';

export default function PublicServicePaymentPinScreen() {
  const params = useLocalSearchParams<{
    provider?: string;
    providerLabel?: string;
    product?: string;
    value?: string;
    customerNumber?: string;
  }>();

  return (
    <PaymentPinScreen
      shellTitle="Pagamento de Serviços"
      successPathname="/payments/publicos/success"
      params={toPaymentRouteParams(params)}
    />
  );
}
