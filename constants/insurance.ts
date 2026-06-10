import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

export const INSURANCE_ACCENT = '#C9A227';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export type InsuranceProduct = {
  id: string;
  label: string;
  icon: IoniconName;
};

export const INSURANCE_PRODUCTS: InsuranceProduct[] = [
  { id: 'automovel', label: 'Seguro Automóvel', icon: 'car-outline' },
  { id: 'acidente-trabalho', label: 'Acidente de Trabalho', icon: 'shield-checkmark-outline' },
  { id: 'acidentes-pessoais', label: 'Acidentes Pessoais', icon: 'person-outline' },
  { id: 'assistencia-viagem', label: 'Assistência em Viagem', icon: 'airplane-outline' },
  { id: 'multirriscos', label: 'Multirriscos Habitação', icon: 'home-outline' },
];
