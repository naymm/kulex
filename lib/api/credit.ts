import type { CreditProduct } from '@/constants/credit';
import { formatBalanceFromCents } from '@/lib/api/accounts';
import type { CreditAdvance, CreditAdvanceCategory } from '@/lib/credit-advances';
import type { MeusCreditosItem } from '@/lib/credit-loans';
import { formatMoneyAmount } from '@/lib/postpaid-bill';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

type LoanRow = {
  id: string;
  product_id: string;
  principal_cents: number;
  outstanding_cents: number;
  term_days: number;
  progress: number;
  status: string;
  created_at: string;
};

type AdvanceRow = {
  id: string;
  category: CreditAdvanceCategory;
  title: string;
  description: string | null;
  amount_cents: number;
  due_date: string;
  settled: boolean;
  created_at: string;
};

type ProductRow = {
  id: string;
  title: string;
};

const PRODUCT_ICONS: Record<string, CreditProduct['icon']> = {
  'maka-zero': 'speedometer-outline',
  empreendedor: 'walk-outline',
  familia: 'people-outline',
};

function formatDueLabel(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
}

function mapAdvance(row: AdvanceRow): CreditAdvance {
  return {
    id: row.id,
    category: row.category,
    title: row.title,
    description: row.description ?? '',
    amount: row.amount_cents / 100,
    amountFormatted: formatMoneyAmount(row.amount_cents / 100),
    createdAt: row.created_at,
    dueDateLabel: formatDueLabel(row.due_date),
    dueIsoDate: row.due_date,
    settled: row.settled,
  };
}

function mapLoan(row: LoanRow, productTitle: string): MeusCreditosItem {
  const principal = row.principal_cents / 100;
  const outstanding = row.outstanding_cents / 100;
  const due = new Date(row.created_at);
  due.setDate(due.getDate() + row.term_days);

  return {
    id: row.id,
    kind: 'loan',
    productTitle,
    title: `${productTitle} – ${formatMoneyAmount(principal)} kz`,
    prazo: `Prazo: ${formatDueLabel(due.toISOString())}`,
    emFalta: `Em falta: ${formatMoneyAmount(outstanding)} kz`,
    progress: Number(row.progress) || outstanding / principal,
    showChevron: true,
  };
}

export async function fetchCreditProducts(): Promise<CreditProduct[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await supabase.from('credit_products').select('id, title').order('id');
  if (error) throw error;

  return (data as ProductRow[]).map((p) => ({
    id: p.id,
    label: p.title,
    icon: PRODUCT_ICONS[p.id] ?? 'cash-outline',
  }));
}

export async function fetchAccountLoans(accountId: string): Promise<MeusCreditosItem[]> {
  if (!isSupabaseConfigured || !accountId) return [];

  const { data: loans, error } = await supabase
    .from('credit_loans')
    .select('*')
    .eq('account_id', accountId)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (!loans?.length) return [];

  const productIds = [...new Set((loans as LoanRow[]).map((l) => l.product_id))];
  const { data: products } = await supabase.from('credit_products').select('id, title').in('id', productIds);
  const titles = new Map((products ?? []).map((p: ProductRow) => [p.id, p.title]));

  return (loans as LoanRow[]).map((l) => mapLoan(l, titles.get(l.product_id) ?? l.product_id));
}

export async function fetchAccountAdvances(accountId: string): Promise<CreditAdvance[]> {
  if (!isSupabaseConfigured || !accountId) return [];

  const { data, error } = await supabase
    .from('credit_advances')
    .select('*')
    .eq('account_id', accountId)
    .eq('settled', false)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return ((data ?? []) as AdvanceRow[]).map(mapAdvance);
}

export async function createCreditAdvance(
  accountId: string,
  input: { category: CreditAdvanceCategory; title: string; description: string; amount: number; termDays: number },
): Promise<CreditAdvance> {
  if (!isSupabaseConfigured) throw new Error('Backend não configurado');

  const due = new Date();
  due.setDate(due.getDate() + input.termDays);
  const id = `advance-${Date.now()}`;

  const { data, error } = await supabase
    .from('credit_advances')
    .insert({
      id,
      account_id: accountId,
      category: input.category,
      title: input.title,
      description: input.description,
      amount_cents: Math.round(input.amount * 100),
      due_date: due.toISOString().slice(0, 10),
      settled: false,
    })
    .select('*')
    .single();

  if (error) throw error;
  return mapAdvance(data as AdvanceRow);
}

export async function settleCreditAdvanceRemote(id: string): Promise<boolean> {
  if (!isSupabaseConfigured) return false;

  const { error } = await supabase.from('credit_advances').update({ settled: true }).eq('id', id);
  if (error) throw error;
  return true;
}

export async function settleAllCreditAdvancesRemote(accountId: string): Promise<number> {
  if (!isSupabaseConfigured) return 0;

  const { data, error } = await supabase
    .from('credit_advances')
    .update({ settled: true })
    .eq('account_id', accountId)
    .eq('settled', false)
    .select('id');

  if (error) throw error;
  return data?.length ?? 0;
}

export async function createCreditLoan(
  accountId: string,
  productId: string,
  principalCents: number,
  termDays: number,
): Promise<void> {
  if (!isSupabaseConfigured) throw new Error('Backend não configurado');

  const { error } = await supabase.from('credit_loans').insert({
    account_id: accountId,
    product_id: productId,
    principal_cents: principalCents,
    outstanding_cents: principalCents,
    term_days: termDays,
    progress: 0,
    status: 'active',
  });

  if (error) throw error;
}
