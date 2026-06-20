import { getAppDataStore } from '@/lib/data-store';

export const AGENT_PHONE_LENGTH = 9;

export type AgentClient = {
  phone: string;
  name: string;
  membershipId: string;
  nif: string;
  email: string;
  status: 'Activo' | 'Pendente';
  kycStatus: 'Verificado' | 'Pendente';
  balance: string;
  activatedAt: string;
  lastOperation: string;
};

export function getAgentClients(): AgentClient[] {
  return getAppDataStore().agentClients;
}

export function getAgentClientByPhone(phone: string): AgentClient | undefined {
  return getAgentClients().find((c) => c.phone === phone);
}

export function searchAgentClients(query: string): AgentClient[] {
  const q = query.trim().toLowerCase();
  if (!q) return getAgentClients();

  return getAgentClients().filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.membershipId.toLowerCase().includes(q),
  );
}

export function getActiveAgentClients(): AgentClient[] {
  return getAgentClients().filter((c) => c.status === 'Activo');
}

export function getPendingAgentClients(): AgentClient[] {
  return getAgentClients().filter((c) => c.status === 'Pendente');
}

export function formatAgentClientBalance(balance: string): string {
  return balance.includes('kz') ? balance : `${balance} kz`;
}

export function formatAgentPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 9) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return phone;
}

export function getClientInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function getAgentClientHistory(clientName: string) {
  const { agentHistory } = getAppDataStore();
  return agentHistory.filter((item) => item.clientName === clientName);
}
