import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export type PaymentCategory = {
  id: string;
  title: string;
  description: string;
  icon: IoniconName;
};

export const PAYMENT_CATEGORIES: PaymentCategory[] = [
  {
    id: 'qrcode',
    title: 'QR Code',
    description: 'Pague em lojas e comerciantes escaneando o código QR no balcão.',
    icon: 'qr-code-outline',
  },
  {
    id: 'referencia',
    title: 'Pagamento Por Referência',
    description:
      'Pague facturas, compras online e serviços usando uma referência bancária.',
    icon: 'receipt-outline',
  },
  {
    id: 'servicos',
    title: 'Serviços',
    description:
      'Carregamentos, pacotes de internet, televisão, eletricidade, água e outros serviços.',
    icon: 'flash-outline',
  },
  {
    id: 'estado',
    title: 'Pagamento ao Estado',
    description:
      'Liquidação de impostos, taxas ministeriais e documentos através do RUPE',
    icon: 'business-outline',
  },
  {
    id: 'seguro',
    title: 'Seguros',
    description:
      'Adesão e Pagamento e renovação de apólices de seguro automóvel, saúde e vida.',
    icon: 'shield-checkmark-outline',
  },
];
