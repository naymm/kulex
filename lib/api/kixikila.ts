import type {
  KixikilaDetail,
  KixikilaParticipant,
  KixikilaRole,
  KixikilaStatus,
  MyKixikila,
  PlatformKixikilaSummary,
} from '@/constants/kixikila';
import { formatKixikilaMoney } from '@/constants/kixikila';
import { formatBalanceFromCents } from '@/lib/api/accounts';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

type KixikilaRow = {
  id: string;
  title: string;
  description: string | null;
  source: 'user' | 'platform';
  status: KixikilaStatus;
  balance_cents: number;
  invite_code: string;
  amount_per_member_cents: number;
  member_capacity: number;
  current_members: number;
  debit_day: number;
  duration_months: number;
  frequency: 'diaria' | 'semanal' | 'mensal';
  protection: string;
  commission_mode: 'deduct_from_pool' | 'separate_accounts';
  next_receiver_order: number | null;
};

type ParticipantRow = {
  id: string;
  kixikila_id: string;
  account_id: string | null;
  display_name: string;
  initials: string;
  color: string;
  participant_order: number;
  role: KixikilaRole;
  is_anonymous: boolean;
  is_slot: boolean;
  contributed: boolean;
};

type MembershipRow = {
  kixikila_id: string;
  role: KixikilaRole;
  participant_order: number | null;
};

const FREQUENCY_LABELS: Record<KixikilaRow['frequency'], string> = {
  diaria: 'Diária',
  semanal: 'Semanal',
  mensal: 'Mensal',
};

function mapPlatformSummary(row: KixikilaRow): PlatformKixikilaSummary {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? '',
    members: row.current_members,
    memberCapacity: row.member_capacity,
    amountPerMember: formatBalanceFromCents(row.amount_per_member_cents),
    frequency: FREQUENCY_LABELS[row.frequency],
    status: row.status,
  };
}

function mapMyKixikila(row: KixikilaRow, membership: MembershipRow): MyKixikila {
  return {
    id: row.id,
    title: row.title,
    members: row.current_members,
    memberCapacity: row.member_capacity,
    amountPerMember: formatBalanceFromCents(row.amount_per_member_cents),
    role: membership.role,
    status: row.status,
    source: row.source,
  };
}

function mapParticipant(row: ParticipantRow, currentAccountId?: string): KixikilaParticipant {
  const isCurrentUser = Boolean(currentAccountId && row.account_id === currentAccountId);
  return {
    id: isCurrentUser ? 'current-user' : row.id,
    name: isCurrentUser ? 'Tu' : row.is_slot ? row.display_name : row.display_name,
    initials: isCurrentUser ? 'TU' : row.initials,
    color: row.color,
    order: row.participant_order,
    contributed: row.contributed,
  };
}

export function mapKixikilaDetail(
  row: KixikilaRow,
  participants: ParticipantRow[],
  membership?: MembershipRow,
  currentAccountId?: string,
): KixikilaDetail {
  const amountPerMember = formatBalanceFromCents(row.amount_per_member_cents);
  const monthlyTotal = row.amount_per_member_cents * row.member_capacity / 100;
  const serviceFee = monthlyTotal * 0.05;

  return {
    id: row.id,
    title: row.title,
    role: membership?.role ?? 'member',
    status: row.status,
    balance: formatBalanceFromCents(row.balance_cents),
    organizer: row.source === 'platform' ? 'Kulex' : 'Organizador',
    currentMembers: row.current_members,
    memberCapacity: row.member_capacity,
    inviteCode: row.invite_code,
    amountPerMember,
    debitDay: row.debit_day,
    durationMonths: row.duration_months,
    frequency: FREQUENCY_LABELS[row.frequency],
    protection: row.protection,
    monthlyTotal: formatKixikilaMoney(monthlyTotal),
    serviceFee: formatKixikilaMoney(serviceFee),
    monthlyTotalWithFee: formatKixikilaMoney(monthlyTotal + serviceFee),
    commissionMode: row.commission_mode,
    nextReceiverId:
      participants.find((p) => p.participant_order === row.next_receiver_order)?.id ??
      participants.find((p) => !p.contributed && !p.is_slot)?.id ??
      '',
    source: row.source,
    isMember: Boolean(membership),
    participants: participants.map((p) => mapParticipant(p, currentAccountId)),
  };
}

export async function fetchPlatformKixikilas(): Promise<PlatformKixikilaSummary[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase
    .from('kixikilas')
    .select('*')
    .eq('source', 'platform')
    .order('amount_per_member_cents', { ascending: true });

  if (error) throw error;
  return (data as KixikilaRow[]).map(mapPlatformSummary);
}

export async function fetchMyKixikilas(accountId: string): Promise<MyKixikila[]> {
  if (!isSupabaseConfigured || !accountId) return [];

  const { data: memberships, error: memError } = await supabase
    .from('kixikila_memberships')
    .select('kixikila_id, role, participant_order')
    .eq('account_id', accountId);

  if (memError) throw memError;
  if (!memberships?.length) return [];

  const ids = memberships.map((m) => m.kixikila_id);
  const { data: kixikilas, error } = await supabase
    .from('kixikilas')
    .select('*')
    .in('id', ids);

  if (error) throw error;

  const membershipByKixikila = new Map(
    (memberships as MembershipRow[]).map((m) => [m.kixikila_id, m]),
  );

  return (kixikilas as KixikilaRow[]).map((row) =>
    mapMyKixikila(row, membershipByKixikila.get(row.id)!),
  );
}

export async function fetchKixikilaDetail(
  kixikilaId: string,
  accountId?: string,
): Promise<KixikilaDetail | null> {
  if (!isSupabaseConfigured || !kixikilaId) return null;

  const { data: row, error } = await supabase
    .from('kixikilas')
    .select('*')
    .eq('id', kixikilaId)
    .maybeSingle();

  if (error) throw error;
  if (!row) return null;

  const { data: participants, error: partError } = await supabase
    .from('kixikila_participants')
    .select('*')
    .eq('kixikila_id', kixikilaId)
    .order('participant_order', { ascending: true });

  if (partError) throw partError;

  let membership: MembershipRow | undefined;
  if (accountId) {
    const { data: mem } = await supabase
      .from('kixikila_memberships')
      .select('kixikila_id, role, participant_order')
      .eq('kixikila_id', kixikilaId)
      .eq('account_id', accountId)
      .maybeSingle();
    membership = mem as MembershipRow | undefined;
  }

  return mapKixikilaDetail(
    row as KixikilaRow,
    (participants ?? []) as ParticipantRow[],
    membership,
    accountId,
  );
}

export async function joinPlatformKixikila(kixikilaId: string): Promise<void> {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase.rpc('join_platform_kixikila', {
    p_kixikila_id: kixikilaId,
  });

  if (error) throw error;
}

export async function fetchJoinedPlatformIds(accountId: string): Promise<Set<string>> {
  if (!isSupabaseConfigured || !accountId) return new Set();

  const { data: memberships, error: memError } = await supabase
    .from('kixikila_memberships')
    .select('kixikila_id')
    .eq('account_id', accountId);

  if (memError) throw memError;
  if (!memberships?.length) return new Set();

  const ids = memberships.map((m) => m.kixikila_id);
  const { data: kixikilas, error } = await supabase
    .from('kixikilas')
    .select('id')
    .in('id', ids)
    .eq('source', 'platform');

  if (error) throw error;
  return new Set((kixikilas ?? []).map((k) => k.id));
}
