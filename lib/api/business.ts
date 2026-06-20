import type { BusinessNotification } from '@/constants/business';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export async function fetchBusinessNotifications(accountId: string): Promise<BusinessNotification[]> {
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

export async function markBusinessNotificationReadRemote(id: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  await supabase.from('notifications').update({ read: true }).eq('id', id);
}

export async function fetchBusinessStockCredit(accountId: string) {
  if (!isSupabaseConfigured || !accountId) return null;

  const { data, error } = await supabase
    .from('business_stock_credit')
    .select('*')
    .eq('account_id', accountId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function fetchBusinessTransactions(accountId: string) {
  if (!isSupabaseConfigured || !accountId) return [];

  const { data, error } = await supabase
    .from('business_transactions')
    .select('*')
    .eq('business_account_id', accountId)
    .order('tx_date', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchInvoices(accountId: string) {
  if (!isSupabaseConfigured || !accountId) return [];

  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('business_account_id', accountId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}
