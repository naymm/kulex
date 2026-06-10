import { getAgentHistory } from '@/lib/agent';

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

const AGENT_CLIENTS: AgentClient[] = [
  {
    phone: '944781378',
    name: 'Naym Mupoia',
    membershipId: 'KLX-48291037',
    nif: '005678912LA045',
    email: 'naym.mupoia@email.com',
    status: 'Activo',
    kycStatus: 'Verificado',
    balance: '825.415,56 kz',
    activatedAt: '12 Mar 2024',
    lastOperation: '25 Mai · Cash-in',
  },
  {
    phone: '934567890',
    name: 'Maria Santos',
    membershipId: 'KLX-90341256',
    nif: '006789123LA046',
    email: 'maria.santos@email.com',
    status: 'Activo',
    kycStatus: 'Verificado',
    balance: '142.300,00 kz',
    activatedAt: '18 Abr 2024',
    lastOperation: '03 Jun · Cash-in',
  },
  {
    phone: '945678901',
    name: 'Ana Costa',
    membershipId: 'KLX-77123489',
    nif: '007891234LA047',
    email: 'ana.costa@email.com',
    status: 'Activo',
    kycStatus: 'Verificado',
    balance: '56.780,50 kz',
    activatedAt: '05 Jun 2026',
    lastOperation: '05 Jun · Abertura de conta',
  },
  {
    phone: '956789012',
    name: 'Pedro Mendes',
    membershipId: 'KLX-66112233',
    nif: '008912345LA048',
    email: 'pedro.mendes@email.com',
    status: 'Activo',
    kycStatus: 'Verificado',
    balance: '98.450,00 kz',
    activatedAt: '22 Mai 2026',
    lastOperation: '05 Jun · Cash-in',
  },
  {
    phone: '967890123',
    name: 'Sofia Lopes',
    membershipId: 'KLX-55443322',
    nif: '009123456LA049',
    email: 'sofia.lopes@email.com',
    status: 'Activo',
    kycStatus: 'Verificado',
    balance: '34.120,75 kz',
    activatedAt: '10 Jan 2025',
    lastOperation: '04 Jun · Cash-out',
  },
  {
    phone: '978901234',
    name: 'Carlos Nguema',
    membershipId: 'KLX-44332211',
    nif: '001234567LA050',
    email: 'carlos.nguema@email.com',
    status: 'Activo',
    kycStatus: 'Verificado',
    balance: '210.000,00 kz',
    activatedAt: '03 Set 2024',
    lastOperation: '04 Jun · Emissão de cartão',
  },
  {
    phone: '989012345',
    name: 'Helena Ferreira',
    membershipId: 'KLX-33221100',
    nif: '002345678LA051',
    email: 'helena.ferreira@email.com',
    status: 'Activo',
    kycStatus: 'Verificado',
    balance: '18.900,00 kz',
    activatedAt: '14 Fev 2025',
    lastOperation: '01 Jun · Cash-in',
  },
  {
    phone: '990123456',
    name: 'Miguel Barros',
    membershipId: 'KLX-22110099',
    nif: '003456789LA052',
    email: 'miguel.barros@email.com',
    status: 'Pendente',
    kycStatus: 'Pendente',
    balance: '0,00 kz',
    activatedAt: '28 Mai 2026',
    lastOperation: '28 Mai · Abertura iniciada',
  },
];

export const AGENT_CLIENT_DIRECTORY: Record<string, string> = Object.fromEntries(
  AGENT_CLIENTS.map((client) => [client.phone, client.name]),
);

export function normalizeAgentPhone(digits: string): string {
  return digits.replace(/\D/g, '').slice(0, AGENT_PHONE_LENGTH);
}

export function formatAgentPhone(digits: string): string {
  const phone = normalizeAgentPhone(digits);
  if (phone.length <= 3) return phone;
  if (phone.length <= 6) return `${phone.slice(0, 3)} ${phone.slice(3)}`;
  return `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6)}`;
}

export function isAgentPhoneComplete(digits: string): boolean {
  return normalizeAgentPhone(digits).length === AGENT_PHONE_LENGTH;
}

export function getAgentClients(): AgentClient[] {
  return [...AGENT_CLIENTS].sort((a, b) => a.name.localeCompare(b.name, 'pt-PT'));
}

export function getAgentClientByPhone(digits: string): AgentClient | null {
  const phone = normalizeAgentPhone(digits);
  return AGENT_CLIENTS.find((client) => client.phone === phone) ?? null;
}

export function lookupAgentClient(digits: string): { phone: string; name: string } | null {
  const client = getAgentClientByPhone(digits);
  if (!client) return null;
  return { phone: client.phone, name: client.name };
}

export function getAgentClientHistory(clientName: string) {
  return getAgentHistory().filter((item) => item.clientName === clientName);
}

export function getClientInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
