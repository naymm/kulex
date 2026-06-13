import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export type AgentOperationType = 'activation' | 'cash-in' | 'cash-out' | 'card-issue';

export type AgentCommissionPeriod = 'today' | 'week' | 'month';

export type AgentNotificationKind =
  | 'pending_activation'
  | 'withdrawal_request'
  | 'commission_available';

export type AgentMonthlySummary = {
  totalCommissions: string;
  transactionCount: number;
  clientsActivated: number;
  monthLabel: string;
};

export type AgentOperationAction = {
  id: string;
  title: string;
  subtitle: string;
  icon: IoniconName;
  iconBg: string;
  iconColor: string;
  href: string;
};

export type AgentCommissionBreakdown = {
  period: AgentCommissionPeriod;
  label: string;
  total: string;
  transactions: number;
  activations: number;
};

export type AgentHistoryItem = {
  id: string;
  type: AgentOperationType;
  title: string;
  clientName: string;
  amount: string;
  commission: string;
  dateLabel: string;
  timeLabel: string;
};

export type AgentNotification = {
  id: string;
  kind: AgentNotificationKind;
  title: string;
  message: string;
  dateLabel: string;
  read: boolean;
  actionHref?: string;
  clientName?: string;
  amount?: string;
};

export type AgentRewardsLevel = {
  id: string;
  name: string;
  minPoints: number;
  color: string;
};

export const AGENT_MONTHLY_SUMMARY: AgentMonthlySummary = {
  totalCommissions: '48.750,00 kz',
  transactionCount: 127,
  clientsActivated: 14,
  monthLabel: 'Junho 2026',
};

export const AGENT_FLOAT_BALANCE = '124.800,00 kz';
export const AGENT_COMMISSION_BALANCE = '48.750,00 kz';

export const AGENT_OPERATION_ACTIONS: AgentOperationAction[] = [
  {
    id: 'carregar',
    title: 'Carregar',
    subtitle: 'Cash-in para cliente',
    icon: 'arrow-down-circle-outline',
    iconBg: '#DCFCE7',
    iconColor: '#16A34A',
    href: '/agent/carregar',
  },
  {
    id: 'levantar',
    title: 'Levantar',
    subtitle: 'Cash-out para cliente',
    icon: 'arrow-up-circle-outline',
    iconBg: '#FEE2E2',
    iconColor: '#DC2626',
    href: '/agent/levantar',
  },
  {
    id: 'activar',
    title: 'Abertura de conta',
    subtitle: 'Abertura com KYC',
    icon: 'person-add-outline',
    iconBg: '#EEF0F8',
    iconColor: '#1A1A4E',
    href: '/agent/activar-cliente',
  },
];

export const AGENT_COMMISSION_PERIODS: AgentCommissionBreakdown[] = [
  {
    period: 'today',
    label: 'Hoje',
    total: '3.250,00 kz',
    transactions: 8,
    activations: 1,
  },
  {
    period: 'week',
    label: 'Esta semana',
    total: '12.400,00 kz',
    transactions: 34,
    activations: 4,
  },
  {
    period: 'month',
    label: 'Este mês',
    total: '48.750,00 kz',
    transactions: 127,
    activations: 14,
  },
];

export const AGENT_HISTORY: AgentHistoryItem[] = [
  {
    id: 'h1',
    type: 'activation',
    title: 'Abertura de conta',
    clientName: 'Ana Costa',
    amount: '—',
    commission: '+2.500,00 kz',
    dateLabel: '05 Jun',
    timeLabel: '14:32',
  },
  {
    id: 'h2',
    type: 'cash-in',
    title: 'Cash-in',
    clientName: 'Pedro Mendes',
    amount: '50.000,00 kz',
    commission: '+750,00 kz',
    dateLabel: '05 Jun',
    timeLabel: '11:18',
  },
  {
    id: 'h3',
    type: 'cash-out',
    title: 'Cash-out',
    clientName: 'Sofia Lopes',
    amount: '25.000,00 kz',
    commission: '+500,00 kz',
    dateLabel: '04 Jun',
    timeLabel: '16:45',
  },
  {
    id: 'h4',
    type: 'card-issue',
    title: 'Emissão de cartão',
    clientName: 'Carlos Nguema',
    amount: '—',
    commission: '+1.200,00 kz',
    dateLabel: '04 Jun',
    timeLabel: '09:05',
  },
  {
    id: 'h5',
    type: 'cash-in',
    title: 'Cash-in',
    clientName: 'Maria Santos',
    amount: '120.000,00 kz',
    commission: '+1.800,00 kz',
    dateLabel: '03 Jun',
    timeLabel: '18:22',
  },
  {
    id: 'h6',
    type: 'activation',
    title: 'Abertura de conta',
    clientName: 'João Silva',
    amount: '—',
    commission: '+2.500,00 kz',
    dateLabel: '02 Jun',
    timeLabel: '10:11',
  },
];

export const AGENT_NOTIFICATIONS: AgentNotification[] = [
  {
    id: 'n1',
    kind: 'pending_activation',
    title: 'Abertura de conta',
    message: 'Validar documentos de Helena Ferreira antes de activar a conta.',
    dateLabel: 'Há 2 h',
    read: false,
    actionHref: '/agent/aprovar?type=activation&id=n1',
    clientName: 'Helena Ferreira',
  },
  {
    id: 'n2',
    kind: 'withdrawal_request',
    title: 'Levantamento a confirmar',
    message: 'Pedido de cash-out de 35.000,00 kz para Miguel Barros.',
    dateLabel: 'Há 4 h',
    read: false,
    actionHref: '/agent/aprovar?type=withdrawal&id=n2',
    clientName: 'Miguel Barros',
    amount: '35.000,00 kz',
  },
  {
    id: 'n3',
    kind: 'commission_available',
    title: 'Comissões disponíveis',
    message: '48.750,00 kz prontos para transferir para a sua conta pessoal.',
    dateLabel: 'Ontem',
    read: false,
    actionHref: '/agent/transferir',
  },
  {
    id: 'n4',
    kind: 'pending_activation',
    title: 'Abertura pendente',
    message: 'Rever selfie e BI de Ricardo Pinto.',
    dateLabel: 'Ontem',
    read: true,
    actionHref: '/agent/aprovar?type=activation&id=n4',
    clientName: 'Ricardo Pinto',
  },
];

export const AGENT_OPERATION_TYPE_LABELS: Record<AgentOperationType, string> = {
  activation: 'Abertura de conta',
  'cash-in': 'Cash-in',
  'cash-out': 'Cash-out',
  'card-issue': 'Cartão',
};

export const AGENT_OPERATION_TYPE_ICONS: Record<AgentOperationType, IoniconName> = {
  activation: 'person-add-outline',
  'cash-in': 'arrow-down-circle-outline',
  'cash-out': 'arrow-up-circle-outline',
  'card-issue': 'card-outline',
};

export const AGENT_REWARDS = {
  points: 2840,
  levelId: 'gold',
  nextLevelPoints: 5000,
  levels: [
    { id: 'bronze', name: 'Bronze', minPoints: 0, color: '#CD7F32' },
    { id: 'silver', name: 'Prata', minPoints: 1500, color: '#9CA3AF' },
    { id: 'gold', name: 'Ouro', minPoints: 3000, color: '#C9A227' },
    { id: 'platinum', name: 'Platina', minPoints: 5000, color: '#1A1A4E' },
  ] satisfies AgentRewardsLevel[],
  perks: [
    'Bónus de 5% nas comissões de abertura de conta',
    'Prioridade no suporte agente',
    'Acesso antecipado a novos produtos',
  ],
};

export const AGENT_CLIENT_ACTIVATION_REQUIREMENTS = [
  'Documento de identificação válido (BI ou passaporte)',
  'Número de telefone verificado por SMS',
  'Selfie e prova de vida (KYC)',
  'Morada e dados pessoais completos',
  'Definição de PIN de 4 dígitos',
];
