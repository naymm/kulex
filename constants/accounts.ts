export type AccountKind = 'personal' | 'agent' | 'business';

export type KulexAccount = {
  id: string;
  kind: AccountKind;
  name: string;
  accountType: string;
  shortLabel: string;
  membershipId: string;
  balance: string;
  initials: string;
  color: string;
  avatar?: number;
};

export const DEFAULT_ACCOUNT_ID = 'naym-personal';

export const KULEX_ACCOUNTS: KulexAccount[] = [
  {
    id: 'naym-personal',
    kind: 'personal',
    name: 'Naym Mupoia',
    accountType: 'Conta Pessoal',
    shortLabel: 'Pessoal',
    membershipId: 'KLX-48291037',
    balance: '825.415,56 kz',
    initials: 'NM',
    color: '#2FB7A9',
    avatar: require('../assets/images/naym.png') as number,
  },
  {
    id: 'naym-agent',
    kind: 'agent',
    name: 'Naym Mupoia',
    accountType: 'Conta Agente',
    shortLabel: 'Agente',
    membershipId: 'KLX-39102756',
    balance: '124.800,00 kz',
    initials: 'NA',
    color: '#C9A227',
  },
  {
    id: 'kulex-business',
    kind: 'business',
    name: 'Kulex Negócios Lda',
    accountType: 'Conta Empresa',
    shortLabel: 'Negócio',
    membershipId: 'KLX-77204519',
    balance: '2.450.000,00 kz',
    initials: 'KN',
    color: '#1A1A4E',
  },
];

export function getAccountById(id: string): KulexAccount {
  return KULEX_ACCOUNTS.find((account) => account.id === id) ?? KULEX_ACCOUNTS[0];
}

export function isAgentAccount(account: KulexAccount): boolean {
  return account.kind === 'agent';
}

export function isBusinessAccount(account: KulexAccount): boolean {
  return account.kind === 'business';
}

export function isPersonalAccount(account: KulexAccount): boolean {
  return account.kind === 'personal';
}

export function parseAccountBalance(balance: string): number {
  const cleaned = balance.replace(/\s*kz/gi, '').trim();
  const normalized = cleaned.replace(/\./g, '').replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}
