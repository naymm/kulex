import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export type KixikilaStatus = 'pending' | 'active' | 'completed';

export const KIXIKILA_SERVICE_FEE_RATE = 0.05;

export type KixikilaCommissionMode = 'deduct_from_pool' | 'separate_accounts';

export const KIXIKILA_FEE_RATES = {
  serviceFee: 0.05,
  stampDuty: 0.01,
  ivaOnServiceFee: 0.14,
  withholdingOnServiceFee: 0.065,
} as const;

export const KIXIKILA_FEE_RATE_LABELS = {
  serviceFee: 'Taxa de serviço (5%)',
  stampDuty: 'Imposto de Selo (1%)',
  ivaOnServiceFee: 'IVA sobre a Taxa de Serviço (14%)',
  withholdingOnServiceFee: 'Retenção sobre a Taxa de Serviço (6,5%)',
} as const;

export const KIXIKILA_COMMISSION_MODES: {
  id: KixikilaCommissionMode;
  label: string;
  description: string;
}[] = [
  {
    id: 'deduct_from_pool',
    label: 'Descontar do total da Kixikila',
    description:
      'As comissões são subtraídas mensalmente do valor total arrecadado. Cada participante debita apenas a contribuição.',
  },
  {
    id: 'separate_accounts',
    label: 'Descontar nas contas dos participantes',
    description:
      'A contribuição entra integralmente na Kixikila. Cada participante paga a sua parte da comissão separadamente como Comissão de Kixikila.',
  },
];

export function getCommissionModeLabel(mode: KixikilaCommissionMode): string {
  return KIXIKILA_COMMISSION_MODES.find((item) => item.id === mode)?.label ?? mode;
}

export function parseCommissionMode(value?: string): KixikilaCommissionMode {
  return value === 'separate_accounts' ? 'separate_accounts' : 'deduct_from_pool';
}
export const KIXIKILA_ORGANIZER_ID = 'naym-mupoia';
export const KIXIKILA_ORGANIZER_NAME = 'Naym Mupoia';
export const KIXIKILA_CURRENT_USER_ID = 'current-user';
export const KIXIKILA_PLATFORM_ORGANIZER = 'Kulex';

const ANONYMOUS_PARTICIPANT_COLORS = [
  '#2FB7A9',
  '#D6D64A',
  '#2F78B7',
  '#EC4899',
  '#F97316',
  '#8B5CF6',
  '#14B8A6',
  '#F59E0B',
  '#6366F1',
  '#EF4444',
] as const;
export const KIXIKILA_MAX_DURATION_CYCLES = 6;

export type KixikilaAmounts = {
  monthlyTotal: number;
  serviceFee: number;
  totalWithFee: number;
};

export type KixikilaAction = {
  id: string;
  label: string;
  icon: IoniconName;
};

export type KixikilaSource = 'user' | 'platform';

export type MyKixikila = {
  id: string;
  title: string;
  members: number;
  memberCapacity: number;
  amountPerMember: string;
  role: KixikilaRole;
  status: KixikilaStatus;
  source?: KixikilaSource;
};

export type PlatformKixikilaSummary = {
  id: string;
  title: string;
  description: string;
  members: number;
  memberCapacity: number;
  amountPerMember: string;
  frequency: string;
  status: KixikilaStatus;
};

export type KixikilaRole = 'organizer' | 'member';

export type KixikilaParticipant = {
  id: string;
  name: string;
  initials: string;
  color: string;
  order: number;
  contributed: boolean;
};

export type KixikilaDetail = {
  id: string;
  title: string;
  role: KixikilaRole;
  status: KixikilaStatus;
  balance: string;
  organizer: string;
  currentMembers: number;
  memberCapacity: number;
  inviteCode: string;
  amountPerMember: string;
  debitDay: number;
  durationMonths: number;
  serviceFee: string;
  monthlyTotal: string;
  monthlyTotalWithFee: string;
  commissionMode: KixikilaCommissionMode;
  nextReceiverId: string;
  participants: KixikilaParticipant[];
  source?: KixikilaSource;
  isMember?: boolean;
  frequency?: string;
  protection?: string;
};

export type KixikilaDetailAction = {
  id: string;
  label: string;
  route: 'participantes' | 'contribuicoes' | 'ordem' | 'adicionar-membro';
  icon: IoniconName;
  organizerOnly?: boolean;
};

export const KIXIKILA_DETAIL_ACTIONS: KixikilaDetailAction[] = [
  { id: 'participantes', label: 'Ver os participantes', route: 'participantes', icon: 'people-outline' },
  {
    id: 'contribuicoes',
    label: 'Quem já contribuiu',
    route: 'contribuicoes',
    icon: 'checkmark-circle-outline',
  },
  {
    id: 'ordem',
    label: 'Definir ordem de recebimento',
    route: 'ordem',
    icon: 'list-outline',
    organizerOnly: true,
  },
  {
    id: 'adicionar-membro',
    label: 'Adicionar Membro',
    route: 'adicionar-membro',
    icon: 'person-add-outline',
    organizerOnly: true,
  },
];

export const KIXIKILA_PROMO = {
  title: 'A tradição é agora\ndigital e segura',
  subtitle: 'Entra num grupo, contribui mensalmente e\n recebe o teu fundo na tua vez.',
};

export const KIXIKILA_ACTIONS: KixikilaAction[] = [
  { id: 'criar', label: 'Criar', icon: 'add' },
  { id: 'participar', label: 'Participar', icon: 'people-circle-outline' },
  { id: 'como-funciona', label: 'Como funciona', icon: 'information-circle-outline' },
];

export const MY_KIXIKILAS: MyKixikila[] = [
  {
    id: 'mercado-kikolo',
    title: 'Mercado do Kikolo',
    members: 5,
    memberCapacity: 5,
    amountPerMember: '45.000,00 kz',
    role: 'organizer',
    status: 'active',
    source: 'user',
  },
  {
    id: 'vendedoras-kikolo',
    title: 'Vendedoras Kikolo',
    members: 3,
    memberCapacity: 5,
    amountPerMember: '100.000,00 kz',
    role: 'member',
    status: 'pending',
    source: 'user',
  },
  {
    id: 'kulex-100k',
    title: 'Kixikila Premium 100.000',
    members: 7,
    memberCapacity: 10,
    amountPerMember: '100.000,00 kz',
    role: 'member',
    status: 'active',
    source: 'platform',
  },
];

export const PLATFORM_KIXIKILAS: PlatformKixikilaSummary[] = [
  {
    id: 'kulex-20k',
    title: 'Kixikila Família 20.000',
    description: 'Grupo mensal gerido pela Kulex. Participantes anónimos.',
    members: 3,
    memberCapacity: 5,
    amountPerMember: '20.000,00 kz',
    frequency: 'Mensal',
    status: 'pending',
  },
  {
    id: 'kulex-50k',
    title: 'Kixikila Empreendedor 50.000',
    description: 'Ideal para pequenos negócios. Identidades protegidas.',
    members: 6,
    memberCapacity: 8,
    amountPerMember: '50.000,00 kz',
    frequency: 'Mensal',
    status: 'pending',
  },
  {
    id: 'kulex-100k',
    title: 'Kixikila Premium 100.000',
    description: 'Grupo de maior valor com gestão automática pela Kulex.',
    members: 7,
    memberCapacity: 10,
    amountPerMember: '100.000,00 kz',
    frequency: 'Mensal',
    status: 'active',
  },
];

export const KIXIKILA_DEBIT_DAY_OPTIONS = Array.from({ length: 22 }, (_, index) => {
  const day = index + 1;
  return { value: String(day), label: `${day}º dia útil` };
});

export function getDurationOptions(memberCount: number) {
  const count = Math.max(2, memberCount);
  return Array.from({ length: KIXIKILA_MAX_DURATION_CYCLES }, (_, index) => {
    const months = count * (index + 1);
    return {
      value: String(months),
      label: `${months} meses`,
    };
  });
}

export function getDefaultDuration(memberCount: number) {
  return getDurationOptions(memberCount)[0]?.value ?? String(Math.max(2, memberCount));
}

export function formatKixikilaMoney(value: number) {
  return `${value.toLocaleString('pt-PT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} kz`;
}

export type KixikilaFeeBreakdown = {
  memberCount: number;
  contributionPerMember: number;
  monthlyTotal: number;
  serviceFee: number;
  stampDuty: number;
  ivaOnServiceFee: number;
  withholdingOnServiceFee: number;
  totalFees: number;
  poolAmount: number;
  perMemberCommission: number;
  perMemberTotalDebit: number;
};

export function calculateKixikilaFeeBreakdown(
  contribution: string,
  members: string,
  mode: KixikilaCommissionMode,
): KixikilaFeeBreakdown {
  const contributionPerMember = parseContributionToNumber(contribution);
  const memberCount = Number(members);
  if (!Number.isFinite(memberCount) || memberCount <= 0) {
    return {
      memberCount: 0,
      contributionPerMember: 0,
      monthlyTotal: 0,
      serviceFee: 0,
      stampDuty: 0,
      ivaOnServiceFee: 0,
      withholdingOnServiceFee: 0,
      totalFees: 0,
      poolAmount: 0,
      perMemberCommission: 0,
      perMemberTotalDebit: 0,
    };
  }

  const monthlyTotal = contributionPerMember * memberCount;
  const serviceFee = monthlyTotal * KIXIKILA_FEE_RATES.serviceFee;
  const stampDuty = monthlyTotal * KIXIKILA_FEE_RATES.stampDuty;
  const ivaOnServiceFee = serviceFee * KIXIKILA_FEE_RATES.ivaOnServiceFee;
  const withholdingOnServiceFee = serviceFee * KIXIKILA_FEE_RATES.withholdingOnServiceFee;
  const totalFees = serviceFee + stampDuty + ivaOnServiceFee + withholdingOnServiceFee;
  const perMemberCommission = totalFees / memberCount;

  if (mode === 'separate_accounts') {
    return {
      memberCount,
      contributionPerMember,
      monthlyTotal,
      serviceFee,
      stampDuty,
      ivaOnServiceFee,
      withholdingOnServiceFee,
      totalFees,
      poolAmount: monthlyTotal,
      perMemberCommission,
      perMemberTotalDebit: contributionPerMember + perMemberCommission,
    };
  }

  return {
    memberCount,
    contributionPerMember,
    monthlyTotal,
    serviceFee,
    stampDuty,
    ivaOnServiceFee,
    withholdingOnServiceFee,
    totalFees,
    poolAmount: Math.max(0, monthlyTotal - totalFees),
    perMemberCommission: 0,
    perMemberTotalDebit: contributionPerMember,
  };
}

export type FormattedKixikilaFeeSummary = {
  monthlyTotal: string;
  serviceFee: string;
  stampDuty: string;
  ivaOnServiceFee: string;
  withholdingOnServiceFee: string;
  totalFees: string;
  poolAmount: string;
  perMemberContribution: string;
  perMemberCommission: string;
  perMemberTotalDebit: string;
  monthlyTotalWithFee: string;
};

export function formatKixikilaFeeSummary(
  contribution: string,
  members: string,
  mode: KixikilaCommissionMode = 'deduct_from_pool',
): FormattedKixikilaFeeSummary {
  const breakdown = calculateKixikilaFeeBreakdown(contribution, members, mode);

  return {
    monthlyTotal: formatKixikilaMoney(breakdown.monthlyTotal),
    serviceFee: formatKixikilaMoney(breakdown.serviceFee),
    stampDuty: formatKixikilaMoney(breakdown.stampDuty),
    ivaOnServiceFee: formatKixikilaMoney(breakdown.ivaOnServiceFee),
    withholdingOnServiceFee: formatKixikilaMoney(breakdown.withholdingOnServiceFee),
    totalFees: formatKixikilaMoney(breakdown.totalFees),
    poolAmount: formatKixikilaMoney(breakdown.poolAmount),
    perMemberContribution: formatKixikilaMoney(breakdown.contributionPerMember),
    perMemberCommission: formatKixikilaMoney(breakdown.perMemberCommission),
    perMemberTotalDebit: formatKixikilaMoney(breakdown.perMemberTotalDebit),
    monthlyTotalWithFee:
      mode === 'deduct_from_pool'
        ? formatKixikilaMoney(breakdown.poolAmount)
        : formatKixikilaMoney(breakdown.monthlyTotal + breakdown.totalFees),
  };
}

export function calculateKixikilaAmounts(
  contribution: string,
  members: string,
  mode: KixikilaCommissionMode = 'deduct_from_pool',
): KixikilaAmounts {
  const breakdown = calculateKixikilaFeeBreakdown(contribution, members, mode);
  return {
    monthlyTotal: breakdown.monthlyTotal,
    serviceFee: breakdown.totalFees,
    totalWithFee:
      mode === 'deduct_from_pool'
        ? breakdown.poolAmount
        : breakdown.monthlyTotal + breakdown.totalFees,
  };
}

export function formatKixikilaAmounts(
  contribution: string,
  members: string,
  mode: KixikilaCommissionMode = 'deduct_from_pool',
) {
  const summary = formatKixikilaFeeSummary(contribution, members, mode);
  return {
    monthlyTotal: summary.monthlyTotal,
    serviceFee: summary.totalFees,
    monthlyTotalWithFee: summary.monthlyTotalWithFee,
    totalFees: summary.totalFees,
    poolAmount: summary.poolAmount,
    perMemberCommission: summary.perMemberCommission,
    perMemberTotalDebit: summary.perMemberTotalDebit,
  };
}

export function getKixikilaPendingStatusLabel(
  currentMembers: number,
  memberCapacity: number,
): string {
  if (currentMembers >= memberCapacity) {
    return `Aguardando confirmação (${currentMembers}/${memberCapacity})`;
  }
  return `Aguardando membros (${currentMembers}/${memberCapacity})`;
}

export function getKixikilaStatusLabel(status: KixikilaStatus, currentMembers: number, memberCapacity: number) {
  if (status === 'completed') return 'Concluída';
  if (status === 'active') return 'Activa';
  return getKixikilaPendingStatusLabel(currentMembers, memberCapacity);
}

export function getCycleTotalLabel(frequency: string): string {
  switch (frequency) {
    case 'Diária':
      return 'Total diário da Kixikila';
    case 'Semanal':
      return 'Total semanal da Kixikila';
    default:
      return 'Total mensal da Kixikila';
  }
}

export function isKixikilaComplete(currentMembers: number, memberCapacity: number) {
  return currentMembers >= memberCapacity;
}

export function canStartKixikila(currentMembers: number, memberCapacity: number) {
  return isKixikilaComplete(currentMembers, memberCapacity);
}

export const KIXIKILA_CONTRIBUTION_PRESETS = ['10.000,00', '20.000,00', '30.000,00'] as const;

export const KIXIKILA_FREQUENCY_OPTIONS = ['Diária', 'Semanal', 'Mensal'] as const;

export const KIXIKILA_MEMBER_OPTIONS = ['3', '4', '5', '6', '7', '8', '9', '10'] as const;

export const KIXIKILA_PROTECTION_OPTIONS = ['Sem seguro', 'Com seguro'] as const;

export const KIXIKILA_INVITE_CODE = 'KXL20260412';
export const KIXIKILA_INVITE_CODE_LENGTH = 11;

const MERCADO_PARTICIPANTS: KixikilaParticipant[] = [
  {
    id: 'naym-mupoia',
    name: 'Naym Mupoia',
    initials: 'NM',
    color: '#2FB7A9',
    order: 1,
    contributed: true,
  },
  {
    id: 'ruben-troso',
    name: 'Rúben Troso',
    initials: 'RT',
    color: '#D6D64A',
    order: 2,
    contributed: true,
  },
  {
    id: 'luis-diogo',
    name: 'Luís Diogo',
    initials: 'LD',
    color: '#2F78B7',
    order: 3,
    contributed: false,
  },
  {
    id: 'maria-santos',
    name: 'Maria Santos',
    initials: 'MS',
    color: '#EC4899',
    order: 4,
    contributed: false,
  },
  {
    id: 'joao-pedro',
    name: 'João Pedro',
    initials: 'JP',
    color: '#F97316',
    order: 5,
    contributed: false,
  },
];

function createAnonymousParticipants(
  memberCapacity: number,
  currentMembers: number,
  contributedCount: number,
  includeCurrentUser = false,
): KixikilaParticipant[] {
  const participants: KixikilaParticipant[] = [];

  for (let index = 0; index < currentMembers; index += 1) {
    const order = index + 1;
    const isCurrentUser = includeCurrentUser && index === currentMembers - 1;
    participants.push({
      id: isCurrentUser ? KIXIKILA_CURRENT_USER_ID : `participant-${order}`,
      name: isCurrentUser ? 'Tu' : `Participante ${order}`,
      initials: isCurrentUser ? 'TU' : String(order),
      color: ANONYMOUS_PARTICIPANT_COLORS[index % ANONYMOUS_PARTICIPANT_COLORS.length],
      order,
      contributed: order <= contributedCount,
    });
  }

  for (let index = currentMembers; index < memberCapacity; index += 1) {
    const order = index + 1;
    participants.push({
      id: `slot-${order}`,
      name: `Vaga ${order}`,
      initials: '—',
      color: '#E5E7EB',
      order,
      contributed: false,
    });
  }

  return participants;
}

const PLATFORM_KIXIKILA_DETAILS: Record<string, KixikilaDetail> = {
  'kulex-20k': {
    id: 'kulex-20k',
    title: 'Kixikila Família 20.000',
    role: 'member',
    status: 'pending',
    balance: '60.000,00 kz',
    organizer: KIXIKILA_PLATFORM_ORGANIZER,
    currentMembers: 3,
    memberCapacity: 5,
    inviteCode: '',
    amountPerMember: '20.000,00 kz',
    debitDay: 5,
    durationMonths: 5,
    frequency: 'Mensal',
    protection: 'Com seguro',
    ...formatKixikilaAmounts('20.000,00', '5'),
    commissionMode: 'deduct_from_pool',
    nextReceiverId: 'participant-1',
    source: 'platform',
    isMember: false,
    participants: createAnonymousParticipants(5, 3, 2),
  },
  'kulex-50k': {
    id: 'kulex-50k',
    title: 'Kixikila Empreendedor 50.000',
    role: 'member',
    status: 'pending',
    balance: '300.000,00 kz',
    organizer: KIXIKILA_PLATFORM_ORGANIZER,
    currentMembers: 6,
    memberCapacity: 8,
    inviteCode: '',
    amountPerMember: '50.000,00 kz',
    debitDay: 5,
    durationMonths: 8,
    frequency: 'Mensal',
    protection: 'Com seguro',
    ...formatKixikilaAmounts('50.000,00', '8'),
    commissionMode: 'deduct_from_pool',
    nextReceiverId: 'participant-3',
    source: 'platform',
    isMember: false,
    participants: createAnonymousParticipants(8, 6, 4),
  },
  'kulex-100k': {
    id: 'kulex-100k',
    title: 'Kixikila Premium 100.000',
    role: 'member',
    status: 'active',
    balance: '700.000,00 kz',
    organizer: KIXIKILA_PLATFORM_ORGANIZER,
    currentMembers: 7,
    memberCapacity: 10,
    inviteCode: '',
    amountPerMember: '100.000,00 kz',
    debitDay: 5,
    durationMonths: 10,
    frequency: 'Mensal',
    protection: 'Com seguro',
    ...formatKixikilaAmounts('100.000,00', '10'),
    commissionMode: 'deduct_from_pool',
    nextReceiverId: 'participant-4',
    source: 'platform',
    isMember: true,
    participants: createAnonymousParticipants(10, 7, 5, true),
  },
};

export const KIXIKILA_DETAILS: Record<string, KixikilaDetail> = {
  'mercado-kikolo': {
    id: 'mercado-kikolo',
    title: 'Mercado do Kikolo',
    role: 'organizer',
    status: 'active',
    balance: '225.000,00 kz',
    organizer: KIXIKILA_ORGANIZER_NAME,
    currentMembers: 5,
    memberCapacity: 5,
    inviteCode: KIXIKILA_INVITE_CODE,
    amountPerMember: '45.000,00 kz',
    debitDay: 5,
    durationMonths: 10,
    ...formatKixikilaAmounts('45.000,00', '5'),
    commissionMode: 'deduct_from_pool',
    nextReceiverId: 'luis-diogo',
    participants: MERCADO_PARTICIPANTS,
  },
  'vendedoras-kikolo': {
    id: 'vendedoras-kikolo',
    title: 'Vendedoras Kikolo',
    role: 'member',
    status: 'pending',
    balance: '300.000,00 kz',
    organizer: 'Rúben Troso',
    currentMembers: 3,
    memberCapacity: 5,
    inviteCode: 'KXL20260412',
    amountPerMember: '100.000,00 kz',
    debitDay: 5,
    durationMonths: 10,
    ...formatKixikilaAmounts('100.000,00', '5', 'separate_accounts'),
    commissionMode: 'separate_accounts',
    nextReceiverId: 'luis-diogo',
    participants: MERCADO_PARTICIPANTS.slice(0, 3).map((participant, index) => ({
      ...participant,
      order: index + 1,
      contributed: participant.order <= 2,
    })),
  },
  ...PLATFORM_KIXIKILA_DETAILS,
};

export function isPlatformKixikila(detail?: Pick<KixikilaDetail, 'source'>) {
  return detail?.source === 'platform';
}

export function getPlatformKixikila(id?: string) {
  if (!id) return undefined;
  return PLATFORM_KIXIKILAS.find((item) => item.id === id);
}

export function getAvailablePlatformKixikilas() {
  const joinedIds = new Set(
    MY_KIXIKILAS.filter((item) => item.source === 'platform').map((item) => item.id),
  );
  return PLATFORM_KIXIKILAS.filter((item) => !joinedIds.has(item.id));
}

export function isJoinedPlatformKixikila(id: string) {
  return MY_KIXIKILAS.some((item) => item.id === id && item.source === 'platform');
}

export function getParticipantDisplayName(
  detail: KixikilaDetail,
  participant: KixikilaParticipant,
) {
  if (!isPlatformKixikila(detail)) {
    return participant.name;
  }
  if (participant.id.startsWith('slot-')) {
    return participant.name;
  }
  if (participant.id === KIXIKILA_CURRENT_USER_ID) {
    return 'Tu';
  }
  return `Participante ${participant.order}`;
}

export function getParticipantDisplay(
  detail: KixikilaDetail,
  participant: KixikilaParticipant,
): KixikilaParticipant {
  if (!isPlatformKixikila(detail)) {
    return participant;
  }
  const name = getParticipantDisplayName(detail, participant);
  return {
    ...participant,
    name,
    initials: participant.id === KIXIKILA_CURRENT_USER_ID ? 'TU' : String(participant.order),
  };
}

export function getNextReceiverLabel(detail: KixikilaDetail) {
  const nextReceiver = getNextReceiver(detail);
  if (!nextReceiver) return '—';
  if (!isPlatformKixikila(detail)) {
    return nextReceiver.name;
  }
  if (nextReceiver.id.startsWith('slot-')) {
    return 'A definir';
  }
  return getParticipantDisplayName(detail, nextReceiver);
}

export function getKixikilaDetail(id?: string): KixikilaDetail | undefined {
  if (!id) return undefined;
  return KIXIKILA_DETAILS[id];
}

export function getKixikilaActions(role: KixikilaRole, detail?: KixikilaDetail) {
  if (detail && isPlatformKixikila(detail)) {
    return KIXIKILA_DETAIL_ACTIONS.filter(
      (action) =>
        !action.organizerOnly &&
        action.route !== 'adicionar-membro' &&
        action.route !== 'ordem',
    );
  }
  return KIXIKILA_DETAIL_ACTIONS.filter((action) => !action.organizerOnly || role === 'organizer');
}

export function getKixikilaParticipant(detail: KixikilaDetail, participantId: string) {
  return detail.participants.find((participant) => participant.id === participantId);
}

export function getNextReceiver(detail: KixikilaDetail) {
  return getKixikilaParticipant(detail, detail.nextReceiverId);
}

export function getContributors(detail: KixikilaDetail) {
  return detail.participants.filter((participant) => participant.contributed);
}

export function getOrderedParticipants(detail: KixikilaDetail) {
  return [...detail.participants].sort((a, b) => a.order - b.order);
}

export type KixikilaInviteGroup = {
  code: string;
  groupName: string;
  contribution: string;
  frequency: string;
  members: string;
  protection: string;
  debitDay: string;
  durationMonths: string;
  currentMembers: string;
  status: KixikilaStatus;
  serviceFee: string;
  monthlyTotal: string;
  monthlyTotalWithFee: string;
  commissionMode: KixikilaCommissionMode;
};

export const KIXIKILA_PARTICIPAR_PREVIEW: Omit<KixikilaInviteGroup, 'code'> = {
  groupName: 'Vendedoras Kikolo',
  contribution: '100.000,00',
  frequency: 'Mensal',
  members: '5',
  protection: 'Sem seguro',
  debitDay: '5',
  durationMonths: '10',
  currentMembers: '3',
  status: 'pending',
  ...formatKixikilaAmounts('100.000,00', '5', 'separate_accounts'),
  commissionMode: 'separate_accounts',
};

export function isValidInviteCodeLength(code: string) {
  return code.trim().length === KIXIKILA_INVITE_CODE_LENGTH;
}

export function getKixikilaByInviteCode(code: string): KixikilaInviteGroup | undefined {
  if (!isValidInviteCodeLength(code)) return undefined;
  return {
    code: code.trim().toUpperCase(),
    ...KIXIKILA_PARTICIPAR_PREVIEW,
  };
}

export function frequencyContributionSuffix(frequency: string) {
  switch (frequency) {
    case 'Diária':
      return 'dia';
    case 'Semanal':
      return 'semana';
    default:
      return 'mês';
  }
}

export function parseContributionToNumber(value: string) {
  const normalized = value.replace(/[^\d,]/g, '').replace(',', '.');
  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : 0;
}

export function formatContributionTotal(contribution: string, members: string) {
  const perMember = parseContributionToNumber(contribution);
  const count = Number(members);
  if (!Number.isFinite(count) || count <= 0) return '0,00 kz';
  return `${(perMember * count).toLocaleString('pt-PT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} kz`;
}
