import type { ImageSourcePropType } from 'react-native';

export type PublicServiceId = 'ende' | 'epal';

export type PublicServiceValueOption = {
  id: string;
  label: string;
};

export type PublicServiceProductOption = {
  id: string;
  label: string;
  values: PublicServiceValueOption[];
};

export type PublicServiceProvider = {
  id: PublicServiceId;
  label: string;
  logo: ImageSourcePropType;
};

export const PUBLIC_SERVICE_PROVIDERS: PublicServiceProvider[] = [
  {
    id: 'ende',
    label: 'Ende',
    logo: require('@/assets/images/servicos/ende.png'),
  },
  {
    id: 'epal',
    label: 'Epal',
    logo: require('@/assets/images/servicos/epal.png'),
  },
];

const ENDE_PRODUCTS: PublicServiceProductOption[] = [
  {
    id: 'pos-pago',
    label: 'Pós-pago',
    values: [
      { id: 'fatura', label: 'Pagamento de fatura' },
      { id: 'parcial', label: 'Pagamento parcial' },
    ],
  },
  {
    id: 'pre-pago',
    label: 'Pré-pago',
    values: [
      { id: '5000', label: '5.000,00 kWh' },
      { id: '10000', label: '10.000,00 kWh' },
      { id: '20000', label: '20.000,00 kWh' },
    ],
  },
];

const EPAL_PRODUCTS: PublicServiceProductOption[] = [
  {
    id: 'fatura',
    label: 'Fatura de água',
    values: [
      { id: 'total', label: 'Pagamento total' },
      { id: 'minimo', label: 'Pagamento mínimo' },
    ],
  },
];

export const PUBLIC_SERVICE_PRODUCTS: Record<PublicServiceId, PublicServiceProductOption[]> = {
  ende: ENDE_PRODUCTS,
  epal: EPAL_PRODUCTS,
};

export function getPublicServiceProvider(id: string | undefined): PublicServiceProvider | undefined {
  return PUBLIC_SERVICE_PROVIDERS.find((provider) => provider.id === id);
}

export function getDefaultPublicServiceForm(providerId: PublicServiceId) {
  const products = PUBLIC_SERVICE_PRODUCTS[providerId];
  const product = products[0];
  const value = product.values[0];

  return {
    productId: product.id,
    productLabel: product.label,
    valueId: value.id,
    valueLabel: value.label,
  };
}

export function isValidPublicServiceCustomerNumber(raw: string): boolean {
  const normalized = raw.replace(/\s/g, '');
  return normalized.length >= 6;
}
