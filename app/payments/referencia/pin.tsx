import { useLocalSearchParams } from 'expo-router';
import { PaymentPinScreen } from '@/components/payments/PaymentPinScreen';
import { toPaymentRouteParams } from '@/lib/payment-route-params';

export default function ReferencePaymentPinScreen() {
  const params = useLocalSearchParams<{
    entity?: string;
    reference?: string;
    amount?: string;
    paymentSource?: string;
    accountId?: string;
  }>();

  return (
    <PaymentPinScreen
      shellTitle="Pagamento Por Referência"
      successPathname="/payments/referencia/success"
      params={toPaymentRouteParams(params)}
    />
  );
}
