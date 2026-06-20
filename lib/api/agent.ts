import type { AgentHistoryItem, AgentNotification, AgentOperationType } from '@/constants/agent';
import { formatBalanceFromCents } from '@/lib/api/accounts';
import type { AgentClient } from '@/lib/agent-clients';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

type ClientRow = {
  phone: string;
  name: string;
  membership_id: string | null;
  nif: string | null;
  email: string | null;
  status: 'activo' | 'pendente';
  kyc_status: string | null;
  balance_cents: number;
  activated_at: string | null;
  last_operation_at: string | null;
};

type OperationRow = {
  id: string;
  client_phone: string;
  type: AgentOperationType;
  amount_cents: number;
  commission_cents: number;
  reference: string | null;
  created_at: string;
};

type BalanceRow = {
  available_cents: number;
  pending_cents: number;
  total_earned_cents: number;
};

function formatOpDate(iso: string): { dateLabel: string; timeLabel: string } {
  const d = new Date(iso);
  return {
    dateLabel: d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' }),
    timeLabel: d.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
  };
}

function mapClient(row: ClientRow): AgentClient {
  return {
    phone: row.phone,
    name: row.name,
    membershipId: row.membership_id ?? '',
    nif: row.nif ?? '',
    email: row.email ?? '',
    status: row.status === 'activo' ? 'Activo' : 'Pendente',
    kycStatus: row.kyc_status === 'verificado' ? 'Verificado' : 'Pendente',
    balance: `${formatBalanceFromCents(row.balance_cents)}`,
    activatedAt: row.activated_at
      ? new Date(row.activated_at).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })
      : '—',
    lastOperation: row.last_operation_at
      ? new Date(row.last_operation_at).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })
      : '—',
  };
}

function mapOperation(row: OperationRow): AgentHistoryItem {
  const { dateLabel, timeLabel } = formatOpDate(row.created_at);
  return {
    id: row.id,
    type: row.type,
    clientName: row.client_phone,
    amount: formatBalanceFromCents(row.amount_cents).replace(' kz', ''),
    commission: formatBalanceFromCents(row.commission_cents).replace(' kz', ''),
    reference: row.reference ?? '',
    dateLabel,
    timeLabel,
  };
}

export async function fetchAgentClients(agentAccountId: string): Promise<AgentClient[]> {
  if (!isSupabaseConfigured || !agentAccountId) return [];

  const { data, error } = await supabase
    .from('agent_clients')
    .select('*')
    .eq('agent_account_id', agentAccountId)
    .order('name');

  if (error) throw error;
  return ((data ?? []) as ClientRow[]).map(mapClient);
}

export async function fetchAgentOperations(
  agentAccountId: string,
  filter?: AgentOperationType | 'all',
): Promise<AgentHistoryItem[]> {
  if (!isSupabaseConfigured || !agentAccountId) return [];

  let query = supabase
    .from('agent_operations')
    .select('*')
    .eq('agent_account_id', agentAccountId)
    .order('created_at', { ascending: false });

  if (filter && filter !== 'all') {
    query = query.eq('type', filter);
  }

  const { data, error } = await query;
  if (error) throw error;
  return ((data ?? []) as OperationRow[]).map(mapOperation);
}

export async function fetchAgentBalance(agentAccountId: string): Promise<BalanceRow | null> {
  if (!isSupabaseConfigured || !agentAccountId) return null;

  const { data, error } = await supabase
    .from('agent_balances')
    .select('*')
    .eq('agent_account_id', agentAccountId)
    .maybeSingle();

  if (error) throw error;
  return data as BalanceRow | null;
}

export async function fetchAgentNotifications(accountId: string): Promise<AgentNotification[]> {
  if (!isSupabaseConfigured || !accountId) return [];

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('account_id', accountId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    message: row.message,
    read: row.read,
    dateLabel: new Date(row.created_at).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'short',
    }),
  }));
}

export async function registerAgentOperationRemote(
  agentAccountId: string,
  input: Omit<AgentHistoryItem, 'id' | 'dateLabel' | 'timeLabel'>,
): Promise<void> {
  if (!isSupabaseConfigured) throw new Error('Backend não configurado');

  const id = `h-${Date.now()}`;
  const amountCents = Math.round(parseFloat(input.amount.replace(/\./g, '').replace(',', '.')) * 100) || 0;
  const commissionCents = Math.round(parseFloat(input.commission.replace(/\./g, '').replace(',', '.')) * 100) || 0;

  const { error } = await supabase.from('agent_operations').insert({
    id,
    agent_account_id: agentAccountId,
    client_phone: input.clientName,
    type: input.type,
    amount_cents: amountCents,
    commission_cents: commissionCents,
    reference: input.reference,
  });

  if (error) throw error;
}

export async function markAgentNotificationReadRemote(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  await supabase.from('notifications').update({ read: true }).eq('id', id);
}
