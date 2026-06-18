import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export type PersonalNotificationKind =
  | 'transfer'
  | 'payment'
  | 'remittance'
  | 'kyc'
  | 'credit'
  | 'card';

export type PersonalNotification = {
  id: string;
  kind: PersonalNotificationKind;
  title: string;
  message: string;
  dateLabel: string;
  read: boolean;
  actionHref?: string;
};

export const PERSONAL_NOTIFICATIONS: PersonalNotification[] = [
  {
    id: 'pn1',
    kind: 'transfer',
    title: 'Transferência recebida',
    message: 'Recebeu 15.000,00 kz de João Silva.',
    dateLabel: 'Há 1 h',
    read: false,
    actionHref: '/movimentos',
  },
  {
    id: 'pn2',
    kind: 'kyc',
    title: 'Verificação pendente',
    message: 'Complete a verificação KYC para desbloquear todos os serviços.',
    dateLabel: 'Hoje',
    read: false,
    actionHref: '/kyc',
  },
  {
    id: 'pn3',
    kind: 'remittance',
    title: 'Remessa enviada',
    message: 'A remessa de 395.630,80 kz para Lisboa está em processamento.',
    dateLabel: 'Ontem',
    read: false,
    actionHref: '/remessas',
  },
  {
    id: 'pn4',
    kind: 'payment',
    title: 'Pagamento ENDE',
    message: 'Pagamento de 10.811,00 kz confirmado com sucesso.',
    dateLabel: '24 Mai',
    read: true,
    actionHref: '/(tabs)/payments',
  },
  {
    id: 'pn5',
    kind: 'card',
    title: 'Compra com cartão',
    message: 'Débito de 3.250,80 kz no Supermercado Kimbango.',
    dateLabel: '23 Mai',
    read: true,
    actionHref: '/(tabs)/cards',
  },
  {
    id: 'pn6',
    kind: 'credit',
    title: 'Crédito disponível',
    message: 'O seu Maka Zero foi pré-aprovado até 250.000,00 kz.',
    dateLabel: '20 Mai',
    read: true,
    actionHref: '/(tabs)/credito',
  },
];

export const PERSONAL_NOTIFICATION_KIND_ICONS: Record<
  PersonalNotificationKind,
  IoniconName
> = {
  transfer: 'swap-horizontal-outline',
  payment: 'flash-outline',
  remittance: 'globe-outline',
  kyc: 'shield-checkmark-outline',
  credit: 'speedometer-outline',
  card: 'card-outline',
};

export const PERSONAL_NOTIFICATION_KIND_COLORS: Record<PersonalNotificationKind, string> = {
  transfer: '#EEF0F8',
  payment: '#DCFCE7',
  remittance: '#E0F2FE',
  kyc: '#FEF3C7',
  credit: '#FFFBEB',
  card: '#F3E8FF',
};
