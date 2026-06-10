import type { ImageSourcePropType } from 'react-native';

export type TvProviderId = 'zap' | 'dstv' | 'dstv-stream';

export type TvValueOption = {
  id: string;
  label: string;
};

export type TvProductOption = {
  id: string;
  label: string;
  values: TvValueOption[];
};

export type TvProvider = {
  id: TvProviderId;
  label: string;
  logo: ImageSourcePropType;
};

export const TV_PROVIDERS: TvProvider[] = [
  {
    id: 'zap',
    label: 'Zap',
    logo: require('@/assets/images/servicos/zap.png'),
  },
  {
    id: 'dstv',
    label: 'Dstv',
    logo: require('@/assets/images/servicos/dstv.png'),
  },
  {
    id: 'dstv-stream',
    label: 'Dstv Stream',
    logo: require('@/assets/images/servicos/dstv-stream.png'),
  },
];

const ZAP_PRODUCTS: TvProductOption[] = [
  {
    id: 'dstv-normal',
    label: 'Dstv normal',
    values: [
      { id: 'facil', label: 'Fácil - 3.700,00' },
      { id: 'familia', label: 'Família - 5.500,00' },
      { id: 'completo', label: 'Completo - 8.200,00' },
    ],
  },
  {
    id: 'zap-fibra',
    label: 'Zap Fibra',
    values: [
      { id: 'basico', label: 'Básico - 12.000,00' },
      { id: 'premium', label: 'Premium - 18.500,00' },
    ],
  },
];

const DSTV_PRODUCTS: TvProductOption[] = [
  {
    id: 'dstv-normal',
    label: 'Dstv normal',
    values: [
      { id: 'facil', label: 'Fácil - 3.700,00' },
      { id: 'familia', label: 'Família - 5.500,00' },
      { id: 'completo', label: 'Completo - 8.200,00' },
      { id: 'premium', label: 'Premium - 12.500,00' },
    ],
  },
  {
    id: 'dstv-extra',
    label: 'Dstv Extra',
    values: [
      { id: 'extra-facil', label: 'Extra Fácil - 4.200,00' },
      { id: 'extra-familia', label: 'Extra Família - 6.800,00' },
    ],
  },
];

const DSTV_STREAM_PRODUCTS: TvProductOption[] = [
  {
    id: 'stream',
    label: 'Dstv Stream',
    values: [
      { id: 'mensal', label: 'Mensal - 2.500,00' },
      { id: 'trimestral', label: 'Trimestral - 6.800,00' },
      { id: 'anual', label: 'Anual - 24.000,00' },
    ],
  },
];

export const TV_PRODUCTS: Record<TvProviderId, TvProductOption[]> = {
  zap: ZAP_PRODUCTS,
  dstv: DSTV_PRODUCTS,
  'dstv-stream': DSTV_STREAM_PRODUCTS,
};

export function getTvProvider(id: string | undefined): TvProvider | undefined {
  return TV_PROVIDERS.find((provider) => provider.id === id);
}

export function getDefaultTvForm(providerId: TvProviderId) {
  const products = TV_PRODUCTS[providerId];
  const product = products[0];
  const value = product.values[0];

  return {
    productId: product.id,
    productLabel: product.label,
    valueId: value.id,
    valueLabel: value.label,
  };
}

export function isValidTvCustomerNumber(raw: string): boolean {
  const normalized = raw.replace(/\s/g, '');
  return normalized.length >= 6;
}
