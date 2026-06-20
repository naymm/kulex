import type { AgentHistoryItem, AgentNotification, AgentOperationType } from '@/constants/agent';
import { getAppDataStore, patchAppDataStore } from '@/lib/data-store';
import {
  markAgentNotificationReadRemote,
  registerAgentOperationRemote,
} from '@/lib/api/agent';

export function getAgentNotifications(): AgentNotification[] {
  return getAppDataStore().agentNotifications;
}

export function getUnreadNotificationCount(): number {
  return getAgentNotifications().filter((item) => !item.read).length;
}

export async function markNotificationRead(id: string): Promise<void> {
  patchAppDataStore({
    agentNotifications: getAppDataStore().agentNotifications.map((item) =>
      item.id === id ? { ...item, read: true } : item,
    ),
  });
  await markAgentNotificationReadRemote(id);
}

export function getAgentHistory(filter?: AgentOperationType | 'all'): AgentHistoryItem[] {
  const history = getAppDataStore().agentHistory;
  if (!filter || filter === 'all') return history;
  return history.filter((item) => item.type === filter);
}

export async function registerAgentOperation(
  agentAccountId: string,
  item: Omit<AgentHistoryItem, 'id' | 'dateLabel' | 'timeLabel'> & { reference?: string },
): Promise<void> {
  const now = new Date();
  const dateLabel = now.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' });
  const timeLabel = now.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

  const entry: AgentHistoryItem = {
    ...item,
    id: `h-${Date.now()}`,
    dateLabel,
    timeLabel,
  };

  patchAppDataStore({
    agentHistory: [entry, ...getAppDataStore().agentHistory],
  });

  await registerAgentOperationRemote(agentAccountId, item);
}
