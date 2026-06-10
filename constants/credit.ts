import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export const CREDIT_ACCENT = '#C9A227';

export type CreditProduct = {
  id: string;
  label: string;
  icon: IoniconName;
};

export const CREDIT_PRODUCTS: CreditProduct[] = [
  { id: 'maka-zero', label: 'Maka Zero', icon: 'speedometer-outline' },
  { id: 'empreendedor', label: 'Empreendedor', icon: 'walk-outline' },
  { id: 'familia', label: 'Família', icon: 'people-outline' },
];

export const CREDIT_PROMO = {
  title: 'Para cada momento\nda tua vida',
  subtitle:
    'Soluções de crédito rápidas e flexíveis para empreendedores, famílias e imprevistos do dia-a-dia.',
};

export const CREDIT_SIMULATOR_PRODUCTS = ['Maka Zero', 'Empreendedor', 'Família'];
