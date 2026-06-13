import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export type RemittancePayoutMethod = 'bank' | 'mobile' | 'cash';

/** deduct: taxa descontada do montante; add: taxa paga à parte, beneficiário recebe valor exato */
export type RemittanceFeeMode = 'deduct' | 'add';

export type RemittanceFeeModeOption = {
  id: RemittanceFeeMode;
  title: string;
  subtitle: string;
};

export const REMITTANCE_FEE_MODES: RemittanceFeeModeOption[] = [
  {
    id: 'add',
    title: 'Beneficiário recebe valor exato',
    subtitle: 'A taxa é cobrada em adição ao montante enviado.',
  },
  {
    id: 'deduct',
    title: 'Taxa descontada do montante',
    subtitle: 'A taxa é deduzida do valor enviado. O beneficiário recebe menos.',
  },
];

export type RemittanceCorridor = {
  id: string;
  countryCode: string;
  countryName: string;
  currency: string;
  /** AOA por 1 unidade da moeda de destino */
  rateAoaPerUnit: number;
  feePercent: number;
  minAmountAoa: number;
  payoutMethods: RemittancePayoutMethod[];
};

export type RemittanceAction = {
  id: 'enviar' | 'receber';
  label: string;
  subtitle: string;
  icon: IoniconName;
  route: '/remessas/enviar/destino' | '/remessas/receber';
};

export type IncomingRemittanceStatus = 'creditado' | 'pendente' | 'em_processamento';

export type IncomingRemittance = {
  id: string;
  senderName: string;
  senderCountry: string;
  senderCountryCode: string;
  amountForeign: string;
  currency: string;
  amountAoa: string;
  status: IncomingRemittanceStatus;
  dateLabel: string;
  reference: string;
  payoutMethod: string;
};

export const REMESSAS_PROMO = {
  title: 'Remessas internacionais',
  subtitle: 'Envie e receba dinheiro do exterior com taxas competitivas e acompanhamento em tempo real.',
};

export const REMESSAS_ACTIONS: RemittanceAction[] = [
  {
    id: 'enviar',
    label: 'Enviar',
    subtitle: 'Para o exterior',
    icon: 'arrow-up-outline',
    route: '/remessas/enviar/destino',
  },
  {
    id: 'receber',
    label: 'Receber',
    subtitle: 'Do exterior',
    icon: 'arrow-down-outline',
    route: '/remessas/receber',
  },
];

export const REMITTANCE_PAYOUT_LABELS: Record<RemittancePayoutMethod, string> = {
  bank: 'Conta bancária',
  mobile: 'Mobile Money',
  cash: 'Levantamento em agente',
};

export type RemittanceCorridorGroup = {
  id: string;
  title: string;
  subtitle: string;
  corridorIds: string[];
};

export const REMITTANCE_CORRIDOR_GROUPS: RemittanceCorridorGroup[] = [
  {
    id: 'palop',
    title: 'PALOP',
    subtitle: 'Espaço lusófono — família e diáspora',
    corridorIds: ['pt', 'mz', 'cv', 'gw', 'st'],
  },
  {
    id: 'sadc',
    title: 'SADC regional',
    subtitle: 'Vizinhança e comércio transfronteiriço',
    corridorIds: ['cd', 'na', 'zm', 'za'],
  },
  {
    id: 'africa-ocidental',
    title: 'Diáspora África Ocidental',
    subtitle: 'Comunidade das cantinas (mamadús)',
    corridorIds: ['ml', 'sn', 'mr', 'gn', 'ci'],
  },
  {
    id: 'americas',
    title: 'Américas',
    subtitle: 'Diáspora e laços familiares',
    corridorIds: ['br', 'us'],
  },
];

export const REMITTANCE_CORRIDORS: RemittanceCorridor[] = [
  {
    id: 'pt',
    countryCode: 'PT',
    countryName: 'Portugal',
    currency: 'EUR',
    rateAoaPerUnit: 1_050,
    feePercent: 1.5,
    minAmountAoa: 5_000,
    payoutMethods: ['bank', 'cash'],
  },
  {
    id: 'mz',
    countryCode: 'MZ',
    countryName: 'Moçambique',
    currency: 'MZN',
    rateAoaPerUnit: 13.5,
    feePercent: 1.2,
    minAmountAoa: 3_000,
    payoutMethods: ['bank', 'mobile', 'cash'],
  },
  {
    id: 'cv',
    countryCode: 'CV',
    countryName: 'Cabo Verde',
    currency: 'CVE',
    rateAoaPerUnit: 9.5,
    feePercent: 1.2,
    minAmountAoa: 3_000,
    payoutMethods: ['bank', 'mobile'],
  },
  {
    id: 'gw',
    countryCode: 'GW',
    countryName: 'Guiné-Bissau',
    currency: 'XOF',
    rateAoaPerUnit: 1.6,
    feePercent: 1.3,
    minAmountAoa: 3_000,
    payoutMethods: ['bank', 'mobile', 'cash'],
  },
  {
    id: 'st',
    countryCode: 'ST',
    countryName: 'São Tomé e Príncipe',
    currency: 'STN',
    rateAoaPerUnit: 48,
    feePercent: 1.2,
    minAmountAoa: 3_000,
    payoutMethods: ['bank', 'mobile'],
  },
  {
    id: 'cd',
    countryCode: 'CD',
    countryName: 'RDC',
    currency: 'CDF',
    rateAoaPerUnit: 0.35,
    feePercent: 1.8,
    minAmountAoa: 5_000,
    payoutMethods: ['bank', 'mobile'],
  },
  {
    id: 'na',
    countryCode: 'NA',
    countryName: 'Namíbia',
    currency: 'NAD',
    rateAoaPerUnit: 52,
    feePercent: 1.5,
    minAmountAoa: 5_000,
    payoutMethods: ['bank', 'mobile'],
  },
  {
    id: 'zm',
    countryCode: 'ZM',
    countryName: 'Zâmbia',
    currency: 'ZMW',
    rateAoaPerUnit: 38,
    feePercent: 1.5,
    minAmountAoa: 5_000,
    payoutMethods: ['bank', 'mobile', 'cash'],
  },
  {
    id: 'za',
    countryCode: 'ZA',
    countryName: 'África do Sul',
    currency: 'ZAR',
    rateAoaPerUnit: 52,
    feePercent: 1.6,
    minAmountAoa: 5_000,
    payoutMethods: ['bank', 'mobile'],
  },
  {
    id: 'ml',
    countryCode: 'ML',
    countryName: 'Mali',
    currency: 'XOF',
    rateAoaPerUnit: 1.6,
    feePercent: 1.7,
    minAmountAoa: 5_000,
    payoutMethods: ['bank', 'mobile', 'cash'],
  },
  {
    id: 'sn',
    countryCode: 'SN',
    countryName: 'Senegal',
    currency: 'XOF',
    rateAoaPerUnit: 1.6,
    feePercent: 1.6,
    minAmountAoa: 5_000,
    payoutMethods: ['bank', 'mobile'],
  },
  {
    id: 'mr',
    countryCode: 'MR',
    countryName: 'Mauritânia',
    currency: 'MRU',
    rateAoaPerUnit: 23,
    feePercent: 1.7,
    minAmountAoa: 5_000,
    payoutMethods: ['bank', 'mobile', 'cash'],
  },
  {
    id: 'gn',
    countryCode: 'GN',
    countryName: 'Guiné',
    currency: 'GNF',
    rateAoaPerUnit: 0.11,
    feePercent: 1.8,
    minAmountAoa: 5_000,
    payoutMethods: ['bank', 'mobile', 'cash'],
  },
  {
    id: 'ci',
    countryCode: 'CI',
    countryName: 'Costa do Marfim',
    currency: 'XOF',
    rateAoaPerUnit: 1.6,
    feePercent: 1.6,
    minAmountAoa: 5_000,
    payoutMethods: ['bank', 'mobile'],
  },
  {
    id: 'br',
    countryCode: 'BR',
    countryName: 'Brasil',
    currency: 'BRL',
    rateAoaPerUnit: 165,
    feePercent: 1.8,
    minAmountAoa: 5_000,
    payoutMethods: ['bank', 'mobile'],
  },
  {
    id: 'us',
    countryCode: 'US',
    countryName: 'Estados Unidos',
    currency: 'USD',
    rateAoaPerUnit: 920,
    feePercent: 2,
    minAmountAoa: 10_000,
    payoutMethods: ['bank'],
  },
];

export const RECEIVE_REMITTANCE_ACCOUNT = {
  holder: 'Naym Mupoia',
  bank: 'Banco Kulex',
  iban: 'AO06 0040 0000 12345678901 01',
  accountNumber: '1234567890',
  swift: 'KULEXAO22',
  membershipId: 'KLX-48291037',
};

export const INCOMING_REMITTANCES: IncomingRemittance[] = [
  {
    id: 'in-1',
    senderName: 'Maria Santos',
    senderCountry: 'Portugal',
    senderCountryCode: 'PT',
    amountForeign: '250,00',
    currency: 'EUR',
    amountAoa: '262.500,00',
    status: 'creditado',
    dateLabel: '18 Mai, 2026',
    reference: 'RMX-2026-004821',
    payoutMethod: 'Conta Kulex',
  },
  {
    id: 'in-2',
    senderName: 'João Ferreira',
    senderCountry: 'Brasil',
    senderCountryCode: 'BR',
    amountForeign: '1.200,00',
    currency: 'BRL',
    amountAoa: '198.000,00',
    status: 'creditado',
    dateLabel: '12 Mai, 2026',
    reference: 'RMX-2026-003194',
    payoutMethod: 'Conta Kulex',
  },
  {
    id: 'in-3',
    senderName: 'Ana Costa',
    senderCountry: 'Portugal',
    senderCountryCode: 'PT',
    amountForeign: '80,00',
    currency: 'EUR',
    amountAoa: '84.000,00',
    status: 'em_processamento',
    dateLabel: '05 Jun, 2026',
    reference: 'RMX-2026-005902',
    payoutMethod: 'Conta Kulex',
  },
];

export const INCOMING_STATUS_LABELS: Record<IncomingRemittanceStatus, string> = {
  creditado: 'Creditado',
  pendente: 'Pendente',
  em_processamento: 'Em processamento',
};

export type OutgoingRemittanceStatus = 'entregue' | 'em_processamento' | 'cancelada';

export type OutgoingRemittance = {
  id: string;
  beneficiaryName: string;
  destinationCountry: string;
  destinationCountryCode: string;
  corridorId: string;
  payoutMethod: RemittancePayoutMethod;
  amountForeign: string;
  currency: string;
  totalDebitedAoa: string;
  feeAoa: string;
  feeMode: RemittanceFeeMode;
  status: OutgoingRemittanceStatus;
  dateLabel: string;
  reference: string;
};

export const OUTGOING_STATUS_LABELS: Record<OutgoingRemittanceStatus, string> = {
  entregue: 'Entregue',
  em_processamento: 'Em processamento',
  cancelada: 'Cancelada',
};

export const OUTGOING_REMITTANCES: OutgoingRemittance[] = [
  {
    id: 'out-1',
    beneficiaryName: 'Carlos Mendes',
    destinationCountry: 'Portugal',
    destinationCountryCode: 'PT',
    corridorId: 'pt',
    payoutMethod: 'bank',
    amountForeign: '476,19',
    currency: 'EUR',
    totalDebitedAoa: '512.500,00',
    feeAoa: '7.500,00',
    feeMode: 'add',
    status: 'entregue',
    dateLabel: '20 Abr, 2026',
    reference: 'RMX-2026-001284',
  },
  {
    id: 'out-2',
    beneficiaryName: 'Sofia Nunes',
    destinationCountry: 'Moçambique',
    destinationCountryCode: 'MZ',
    corridorId: 'mz',
    payoutMethod: 'mobile',
    amountForeign: '7.407,41',
    currency: 'MZN',
    totalDebitedAoa: '100.000,00',
    feeAoa: '1.200,00',
    feeMode: 'deduct',
    status: 'em_processamento',
    dateLabel: '28 Mai, 2026',
    reference: 'RMX-2026-003871',
  },
  {
    id: 'out-3',
    beneficiaryName: 'Pedro Almeida',
    destinationCountry: 'Brasil',
    destinationCountryCode: 'BR',
    corridorId: 'br',
    payoutMethod: 'bank',
    amountForeign: '3.030,30',
    currency: 'BRL',
    totalDebitedAoa: '510.000,00',
    feeAoa: '9.000,00',
    feeMode: 'add',
    status: 'entregue',
    dateLabel: '10 Mai, 2026',
    reference: 'RMX-2026-002956',
  },
];
