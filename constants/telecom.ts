import type { ImageSourcePropType } from 'react-native';

export type TelecomProviderId = 'unitel' | 'africell' | 'movicel' | 'netone';

export type TelecomValueOption = {
  id: string;
  label: string;
};

export type TelecomProductOption = {
  id: string;
  label: string;
  values: TelecomValueOption[];
};

export type TelecomProvider = {
  id: TelecomProviderId;
  label: string;
  logo: ImageSourcePropType;
};

export const TELECOM_PROVIDERS: TelecomProvider[] = [
  {
    id: 'unitel',
    label: 'Unitel',
    logo: require('@/assets/images/servicos/unitel.png'),
  },
  {
    id: 'africell',
    label: 'Africell',
    logo: require('@/assets/images/servicos/africell.png'),
  },
  {
    id: 'movicel',
    label: 'Movicel',
    logo: require('@/assets/images/servicos/movicel.png'),
  },
  {
    id: 'netone',
    label: 'Net One',
    logo: require('@/assets/images/servicos/netone.png'),
  },
];

const UNITEL_PRODUCTS: TelecomProductOption[] = [
  {
    id: 'dados-15gb',
    label: 'DADOS ATÉ 15GB',
    values: [
      { id: '2gb-31d', label: '2GB/31D - 2.000,00' },
      { id: '5gb-31d', label: '5GB/31D - 4.500,00' },
      { id: '10gb-31d', label: '10GB/31D - 8.000,00' },
      { id: '15gb-31d', label: '15GB/31D - 12.000,00' },
    ],
  },
  {
    id: 'saldo',
    label: 'SALDO',
    values: [
      { id: '500', label: '500,00' },
      { id: '1000', label: '1.000,00' },
      { id: '2000', label: '2.000,00' },
      { id: '5000', label: '5.000,00' },
    ],
  },
  {
    id: 'voz',
    label: 'VOZ',
    values: [
      { id: '100min', label: '100 MIN/7D - 1.500,00' },
      { id: '300min', label: '300 MIN/30D - 3.500,00' },
    ],
  },
];

const DEFAULT_PRODUCTS: TelecomProductOption[] = [
  {
    id: 'dados',
    label: 'PACOTES DE DADOS',
    values: [
      { id: '1gb', label: '1GB/7D - 1.000,00' },
      { id: '3gb', label: '3GB/30D - 2.500,00' },
      { id: '5gb', label: '5GB/30D - 4.000,00' },
    ],
  },
  {
    id: 'saldo',
    label: 'CARREGAMENTO',
    values: [
      { id: '500', label: '500,00' },
      { id: '1000', label: '1.000,00' },
      { id: '2000', label: '2.000,00' },
    ],
  },
];

export const TELECOM_PRODUCTS: Record<TelecomProviderId, TelecomProductOption[]> = {
  unitel: UNITEL_PRODUCTS,
  africell: DEFAULT_PRODUCTS,
  movicel: DEFAULT_PRODUCTS,
  netone: DEFAULT_PRODUCTS,
};

export function getTelecomProvider(id: string | undefined): TelecomProvider | undefined {
  return TELECOM_PROVIDERS.find((provider) => provider.id === id);
}

export function getDefaultTelecomForm(providerId: TelecomProviderId) {
  const products = TELECOM_PRODUCTS[providerId];
  const product = products[0];
  const value = product.values[0];

  return {
    productId: product.id,
    productLabel: product.label,
    valueId: value.id,
    valueLabel: value.label,
  };
}

export function formatAngolaPhoneInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 9);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}

export function isValidAngolaPhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, '');
  return digits.length === 9 && digits.startsWith('9');
}
