import type { KulexAccount } from '@/constants/accounts';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type AccountRow = Database['public']['Tables']['kulex_accounts']['Row'];

const KIND_LABELS: Record<AccountRow['kind'], string> = {
  personal: 'Conta Pessoal',
  agent: 'Conta Agente',
  business: 'Conta Empresa',
};

const SHORT_LABELS: Record<AccountRow['kind'], string> = {
  personal: 'Pessoal',
  agent: 'Agente',
  business: 'Negócio',
};

export function formatBalanceFromCents(cents: number): string {
  const abs = Math.abs(cents);
  const whole = Math.floor(abs / 100);
  const frac = abs % 100;
  const intPart = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const decPart = frac.toString().padStart(2, '0');
  return `${intPart},${decPart} kz`;
}

export function mapAccountRow(row: AccountRow): KulexAccount {
  return {
    id: row.id,
    kind: row.kind,
    name: row.name,
    accountType: KIND_LABELS[row.kind],
    shortLabel: SHORT_LABELS[row.kind],
    membershipId: row.membership_id,
    balance: formatBalanceFromCents(row.balance_cents),
    initials: row.initials,
    color: row.color,
  };
}

export async function fetchUserAccounts(): Promise<KulexAccount[]> {
  if (!isSupabaseConfigured) return [];

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return [];

  const { data, error } = await supabase
    .from('kulex_accounts')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapAccountRow);
}
