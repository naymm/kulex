import { useLocalSearchParams } from 'expo-router';
import { CreditProductDetailScreen } from '@/components/credit/CreditProductDetailScreen';
import { getCreditProductDetail } from '@/constants/credit-products-detail';

export default function CreditProductDetails() {
  const { product } = useLocalSearchParams<{ product?: string }>();
  const detail = getCreditProductDetail(typeof product === 'string' ? product : undefined);

  return <CreditProductDetailScreen detail={detail} />;
}
