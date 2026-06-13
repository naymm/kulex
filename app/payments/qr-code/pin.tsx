import { useLocalSearchParams } from 'expo-router';
import { PaymentPinScreen } from '@/components/payments/PaymentPinScreen';
import { toPaymentRouteParams } from '@/lib/payment-route-params';

export default function QrCodePaymentPinScreen() {
  const params = useLocalSearchParams<{
    merchant?: string;
    amount?: string;
    from?: string;
    paymentSource?: string;
    accountId?: string;
  }>();

  return (
    <PaymentPinScreen
      shellTitle="Pagamento QR Code"
      successPathname="/payments/qr-code/success"
      params={toPaymentRouteParams(params)}
    />
  );
}
