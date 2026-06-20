import type { PersonalNotification, PersonalNotificationKind } from '@/constants/notifications';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type NotificationRow = Database['public']['Tables']['notifications']['Row'];

function formatRelativeDate(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return 'Agora';
  if (diffHours < 24) return `Há ${diffHours} h`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `Há ${diffDays} dias`;

  return date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' });
}

export function mapNotificationRow(row: NotificationRow): PersonalNotification {
  return {
    id: row.id,
    kind: row.kind as PersonalNotificationKind,
    title: row.title,
    message: row.message,
    dateLabel: formatRelativeDate(row.created_at),
    read: row.read,
    actionHref: row.action_href ?? undefined,
  };
}

export async function fetchAccountNotifications(
  accountId: string,
): Promise<PersonalNotification[]> {
  if (!isSupabaseConfigured || !accountId) return [];

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('account_id', accountId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapNotificationRow);
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  if (!isSupabaseConfigured) return;

  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);

  if (error) throw error;
}
