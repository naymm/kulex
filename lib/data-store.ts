import type { CreditProduct } from '@/constants/credit';
import type { WalletCard } from '@/constants/card';
import type { Contact } from '@/constants/contacts';
import type { MyAccount } from '@/constants/my-accounts';
import type {
  IncomingRemittance,
  OutgoingRemittance,
  RemittanceCorridor,
} from '@/constants/remessas';
import type { AgentHistoryItem, AgentNotification } from '@/constants/agent';
import type { BusinessNotification } from '@/constants/business';
import type { UserScoreData } from '@/lib/api/scoring';
import type { CreditAdvance } from '@/lib/credit-advances';
import type { MeusCreditosItem } from '@/lib/credit-loans';
import type { PostpaidWalletState } from '@/lib/postpaid-wallet';
import type { AgentClient } from '@/lib/agent-clients';

export type AppDataStore = {
  score: UserScoreData | null;
  creditProducts: CreditProduct[];
  loans: MeusCreditosItem[];
  advances: CreditAdvance[];
  walletCards: WalletCard[];
  postpaidWallet: PostpaidWalletState | null;
  remittanceCorridors: RemittanceCorridor[];
  incomingRemittances: IncomingRemittance[];
  outgoingRemittances: OutgoingRemittance[];
  myAccounts: MyAccount[];
  contacts: Contact[];
  agentClients: AgentClient[];
  agentHistory: AgentHistoryItem[];
  agentNotifications: AgentNotification[];
  businessNotifications: BusinessNotification[];
};

const emptyStore: AppDataStore = {
  score: null,
  creditProducts: [],
  loans: [],
  advances: [],
  walletCards: [],
  postpaidWallet: null,
  remittanceCorridors: [],
  incomingRemittances: [],
  outgoingRemittances: [],
  myAccounts: [],
  contacts: [],
  agentClients: [],
  agentHistory: [],
  agentNotifications: [],
  businessNotifications: [],
};

let store: AppDataStore = { ...emptyStore };

export function getAppDataStore(): AppDataStore {
  return store;
}

export function patchAppDataStore(partial: Partial<AppDataStore>): void {
  store = { ...store, ...partial };
}

export function resetAppDataStore(): void {
  store = { ...emptyStore };
}
