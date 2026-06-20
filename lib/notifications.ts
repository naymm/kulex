import type { AccountKind } from '@/constants/accounts';
import {
  PERSONAL_NOTIFICATIONS,
  type PersonalNotification,
} from '@/constants/notifications';
import { fetchAccountNotifications } from '@/lib/api/notifications';
import { isSupabaseConfigured } from '@/lib/supabase';

let notifications = [...PERSONAL_NOTIFICATIONS];
let remoteCache: PersonalNotification[] | null = null;

export function getPersonalNotifications(): PersonalNotification[] {
  return remoteCache ?? notifications;
}

export function getUnreadPersonalNotificationCount(): number {
  return getPersonalNotifications().filter((item) => !item.read).length;
}

export async function refreshPersonalNotifications(accountId: string): Promise<number> {
  if (!isSupabaseConfigured || !accountId) {
    remoteCache = null;
    return getUnreadPersonalNotificationCount();
  }

  try {
    const remote = await fetchAccountNotifications(accountId);
    if (remote.length > 0) {
      remoteCache = remote;
      return remote.filter((item) => !item.read).length;
    }
  } catch {
    // fallback to local mock
  }

  remoteCache = null;
  return getUnreadPersonalNotificationCount();
}

export function markPersonalNotificationRead(id: string): void {
  if (remoteCache) {
    remoteCache = remoteCache.map((item) =>
      item.id === id ? { ...item, read: true } : item,
    );
    return;
  }
  notifications = notifications.map((item) =>
    item.id === id ? { ...item, read: true } : item,
  );
}

export function getNotificationsRouteForAccount(kind: AccountKind): string {
  if (kind === 'business') return '/business/notificacoes';
  if (kind === 'agent') return '/agent/notificacoes';
  return '/notificacoes';
}
