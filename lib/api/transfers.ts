import type { Bank } from '@/constants/banks';
import type { Contact } from '@/constants/contacts';
import type { MyAccount, MyAccountId } from '@/constants/my-accounts';
import { formatBalanceFromCents } from '@/lib/api/accounts';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

type MyAccountRow = {
  id: MyAccountId;
  name: string;
  balance_cents: number;
  icon: string | null;
};

type ContactRow = {
  id: string;
  name: string;
  phone: string | null;
  initials: string | null;
  color: string | null;
  membership_id: string | null;
};

type BankRow = {
  id: string;
  name: string;
  select_label: string;
  logo_key: string | null;
};

const MY_ACCOUNT_META: Record<MyAccountId, Pick<MyAccount, 'subtitle' | 'icon'>> = {
  pessoal: { subtitle: 'Conta principal', icon: 'person-outline' },
  agente: { subtitle: 'Conta agente', icon: 'shield-checkmark-outline' },
  poupanca: { subtitle: 'Reservas', icon: 'wallet-outline' },
};

export async function fetchMyAccounts(kulexAccountId: string): Promise<MyAccount[]> {
  if (!isSupabaseConfigured || !kulexAccountId) return [];

  const { data, error } = await supabase
    .from('my_accounts')
    .select('*')
    .eq('kulex_account_id', kulexAccountId);

  if (error) throw error;

  return ((data ?? []) as MyAccountRow[]).map((row) => {
    const meta = MY_ACCOUNT_META[row.id] ?? MY_ACCOUNT_META.pessoal;
    return {
      id: row.id,
      name: row.name,
      subtitle: meta.subtitle,
      balance: formatBalanceFromCents(row.balance_cents).replace(' kz', ''),
      icon: (row.icon as MyAccount['icon']) ?? meta.icon,
    };
  });
}

export async function fetchContacts(ownerUserId: string): Promise<Contact[]> {
  if (!isSupabaseConfigured || !ownerUserId) return [];

  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('owner_user_id', ownerUserId)
    .order('name');

  if (error) throw error;

  return ((data ?? []) as ContactRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    phone: row.phone ?? '',
    initials: row.initials ?? row.name.slice(0, 2).toUpperCase(),
    color: row.color ?? '#1A1A4E',
  }));
}

export async function fetchBanks(): Promise<Omit<Bank, 'logo'>[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase.from('banks').select('*').order('name');
  if (error) throw error;

  return ((data ?? []) as BankRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    selectLabel: row.select_label,
    logoKey: row.logo_key ?? row.id,
  })) as Omit<Bank, 'logo'>[];
}

export async function createP2PTransfer(input: {
  fromAccountId: string;
  toMembershipId?: string;
  toContactId?: string;
  amountCents: number;
  reference?: string;
}): Promise<void> {
  if (!isSupabaseConfigured) throw new Error('Backend não configurado');

  const { error } = await supabase.from('p2p_transfers').insert({
    from_account_id: input.fromAccountId,
    to_contact_id: input.toContactId ?? null,
    to_membership_id: input.toMembershipId ?? null,
    amount_cents: input.amountCents,
    reference: input.reference ?? null,
    status: 'completed',
  });

  if (error) throw error;
}

export async function createBankTransfer(input: {
  accountId: string;
  bankId: string;
  iban: string;
  titular: string;
  amountCents: number;
  commissionCents?: number;
  reference?: string;
}): Promise<void> {
  if (!isSupabaseConfigured) throw new Error('Backend não configurado');

  const { error } = await supabase.from('bank_transfers').insert({
    account_id: input.accountId,
    bank_id: input.bankId,
    iban: input.iban,
    titular: input.titular,
    amount_cents: input.amountCents,
    commission_cents: input.commissionCents ?? 0,
    status: 'pending',
    reference: input.reference ?? null,
  });

  if (error) throw error;
}

export async function createKwikTransfer(input: {
  accountId: string;
  keyType: 'telemovel' | 'email';
  kwikKey: string;
  beneficiaryName?: string;
  amountCents: number;
  description?: string;
}): Promise<void> {
  if (!isSupabaseConfigured) throw new Error('Backend não configurado');

  const { error } = await supabase.from('kwik_transfers').insert({
    account_id: input.accountId,
    key_type: input.keyType,
    kwik_key: input.kwikKey,
    beneficiary_name: input.beneficiaryName ?? null,
    amount_cents: input.amountCents,
    description: input.description ?? null,
    status: 'pending',
  });

  if (error) throw error;
}

export async function seedDefaultMyAccounts(kulexAccountId: string, accountName: string): Promise<void> {
  if (!isSupabaseConfigured) return;

  const rows = [
    { id: 'pessoal' as const, name: `${accountName}`, balance_cents: 0, icon: 'person-outline' },
    { id: 'agente' as const, name: 'Kulex Agente', balance_cents: 0, icon: 'shield-checkmark-outline' },
    { id: 'poupanca' as const, name: 'Poupança', balance_cents: 0, icon: 'wallet-outline' },
  ];

  for (const row of rows) {
    await supabase.from('my_accounts').upsert(
      { kulex_account_id: kulexAccountId, ...row },
      { onConflict: 'kulex_account_id,id' },
    );
  }
}
