import {
  AGENT_HISTORY,
  AGENT_NOTIFICATIONS,
  type AgentHistoryItem,
  type AgentNotification,
  type AgentOperationType,
} from '@/constants/agent';

let notifications = [...AGENT_NOTIFICATIONS];
let history = [...AGENT_HISTORY];

export function getAgentNotifications(): AgentNotification[] {
  return notifications;
}

export function getUnreadNotificationCount(): number {
  return notifications.filter((item) => !item.read).length;
}

export function markNotificationRead(id: string): void {
  notifications = notifications.map((item) =>
    item.id === id ? { ...item, read: true } : item,
  );
}

export function getAgentHistory(filter?: AgentOperationType | 'all'): AgentHistoryItem[] {
  if (!filter || filter === 'all') return history;
  return history.filter((item) => item.type === filter);
}

export function registerAgentOperation(
  item: Omit<AgentHistoryItem, 'id' | 'dateLabel' | 'timeLabel'>,
): void {
  const now = new Date();
  const dateLabel = now.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' });
  const timeLabel = now.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

  history = [
    {
      ...item,
      id: `h-${Date.now()}`,
      dateLabel,
      timeLabel,
    },
    ...history,
  ];
}
