import type { AccountKind } from '@/constants/accounts';
import {
  PERSONAL_NOTIFICATIONS,
  type PersonalNotification,
} from '@/constants/notifications';

let notifications = [...PERSONAL_NOTIFICATIONS];

export function getPersonalNotifications(): PersonalNotification[] {
  return notifications;
}

export function getUnreadPersonalNotificationCount(): number {
  return notifications.filter((item) => !item.read).length;
}

export function markPersonalNotificationRead(id: string): void {
  notifications = notifications.map((item) =>
    item.id === id ? { ...item, read: true } : item,
  );
}

export function getNotificationsRouteForAccount(kind: AccountKind): string {
  if (kind === 'business') return '/business/notificacoes';
  if (kind === 'agent') return '/agent/notificacoes';
  return '/notificacoes';
}
