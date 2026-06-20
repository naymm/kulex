import type {
  IncomingRemittance,
  OutgoingRemittance,
  RemittanceCorridor,
  RemittanceFeeMode,
  RemittancePayoutMethod,
} from '@/constants/remessas';
import { formatMoneyAmount } from '@/lib/postpaid-bill';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

type CorridorRow = {
  id: string;
  country_code: string;
  country_name: string;
  currency: string;
  rate_aoa_per_unit: number;
  fee_percent: number;
  min_amount_aoa_cents: number;
  payout_methods: string[];
};

type IncomingRow = {
  id: string;
  sender_name: string;
  sender_country_code: string | null;
  amount_foreign_cents: number;
  currency: string;
  amount_aoa_cents: number;
  status: string;
  reference: string | null;
  payout_method: string | null;
  created_at: string;
};

type OutgoingRow = {
  id: string;
  beneficiary_name: string;
  corridor_id: string;
  payout_method: string;
  amount_foreign_cents: number;
  currency: string;
  total_debited_aoa_cents: number;
  fee_aoa_cents: number;
  fee_mode: RemittanceFeeMode;
  status: string;
  reference: string | null;
  created_at: string;
};

function formatDateLabel(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function mapCorridor(row: CorridorRow): RemittanceCorridor {
  return {
    id: row.id,
    countryCode: row.country_code,
    countryName: row.country_name,
    currency: row.currency,
    rateAoaPerUnit: Number(row.rate_aoa_per_unit),
    feePercent: Number(row.fee_percent),
    minAmountAoa: row.min_amount_aoa_cents / 100,
    payoutMethods: row.payout_methods as RemittancePayoutMethod[],
  };
}

function mapIncoming(row: IncomingRow): IncomingRemittance {
  return {
    id: row.id,
    senderName: row.sender_name,
    senderCountry: row.sender_country_code ?? '',
    senderCountryCode: row.sender_country_code ?? '',
    amountForeign: formatMoneyAmount(row.amount_foreign_cents / 100),
    currency: row.currency,
    amountAoa: formatMoneyAmount(row.amount_aoa_cents / 100),
    status: row.status as IncomingRemittance['status'],
    dateLabel: formatDateLabel(row.created_at),
    reference: row.reference ?? '',
    payoutMethod: row.payout_method ?? '',
  };
}

function mapOutgoing(row: OutgoingRow, corridor?: CorridorRow): OutgoingRemittance {
  return {
    id: row.id,
    beneficiaryName: row.beneficiary_name,
    destinationCountry: corridor?.country_name ?? '',
    destinationCountryCode: corridor?.country_code ?? '',
    corridorId: row.corridor_id,
    payoutMethod: row.payout_method as RemittancePayoutMethod,
    amountForeign: formatMoneyAmount(row.amount_foreign_cents / 100),
    currency: row.currency,
    totalDebitedAoa: formatMoneyAmount(row.total_debited_aoa_cents / 100),
    feeAoa: formatMoneyAmount(row.fee_aoa_cents / 100),
    feeMode: row.fee_mode,
    status: row.status as OutgoingRemittance['status'],
    dateLabel: formatDateLabel(row.created_at),
    reference: row.reference ?? '',
  };
}

export async function fetchRemittanceCorridors(): Promise<RemittanceCorridor[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase.from('remittance_corridors').select('*').order('country_name');
  if (error) throw error;
  return ((data ?? []) as CorridorRow[]).map(mapCorridor);
}

export async function fetchIncomingRemittances(accountId: string): Promise<IncomingRemittance[]> {
  if (!isSupabaseConfigured || !accountId) return [];

  const { data, error } = await supabase
    .from('incoming_remittances')
    .select('*')
    .eq('account_id', accountId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return ((data ?? []) as IncomingRow[]).map(mapIncoming);
}

export async function fetchOutgoingRemittances(accountId: string): Promise<OutgoingRemittance[]> {
  if (!isSupabaseConfigured || !accountId) return [];

  const { data, error } = await supabase
    .from('outgoing_remittances')
    .select('*')
    .eq('account_id', accountId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (!data?.length) return [];

  const corridorIds = [...new Set((data as OutgoingRow[]).map((r) => r.corridor_id))];
  const { data: corridors } = await supabase.from('remittance_corridors').select('*').in('id', corridorIds);
  const byId = new Map((corridors ?? []).map((c: CorridorRow) => [c.id, c]));

  return (data as OutgoingRow[]).map((r) => mapOutgoing(r, byId.get(r.corridor_id)));
}

export async function createOutgoingRemittance(
  accountId: string,
  input: {
    beneficiaryName: string;
    corridorId: string;
    payoutMethod: RemittancePayoutMethod;
    amountForeignCents: number;
    currency: string;
    totalDebitedAoaCents: number;
    feeAoaCents: number;
    feeMode: RemittanceFeeMode;
    reference: string;
  },
): Promise<void> {
  if (!isSupabaseConfigured) throw new Error('Backend não configurado');

  const { error } = await supabase.from('outgoing_remittances').insert({
    id: `out-${Date.now()}`,
    account_id: accountId,
    corridor_id: input.corridorId,
    beneficiary_name: input.beneficiaryName,
    payout_method: input.payoutMethod,
    amount_foreign_cents: input.amountForeignCents,
    currency: input.currency,
    total_debited_aoa_cents: input.totalDebitedAoaCents,
    fee_aoa_cents: input.feeAoaCents,
    fee_mode: input.feeMode,
    status: 'em_processamento',
    reference: input.reference,
  });

  if (error) throw error;
}
