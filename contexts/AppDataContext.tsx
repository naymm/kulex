import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useActiveAccount } from '@/contexts/AccountContext';
import { fetchAgentClients, fetchAgentNotifications, fetchAgentOperations } from '@/lib/api/agent';
import { fetchBusinessNotifications } from '@/lib/api/business';
import { fetchPostpaidWalletState, fetchWalletCards } from '@/lib/api/cards';
import {
  fetchAccountAdvances,
  fetchAccountLoans,
  fetchCreditProducts,
} from '@/lib/api/credit';
import {
  fetchIncomingRemittances,
  fetchOutgoingRemittances,
  fetchRemittanceCorridors,
} from '@/lib/api/remessas';
import { fetchPersonalDataProfile } from '@/lib/api/profile';
import { fetchUserScore } from '@/lib/api/scoring';
import { fetchContacts, fetchMyAccounts } from '@/lib/api/transfers';
import {
  getAppDataStore,
  patchAppDataStore,
  resetAppDataStore,
  type AppDataStore,
} from '@/lib/data-store';
import { isSupabaseConfigured } from '@/lib/supabase';

type AppDataContextValue = AppDataStore & {
  isLoading: boolean;
  refresh: () => Promise<void>;
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, session } = useAuth();
  const { activeAccountId, activeAccount, isLoadingAccounts } = useActiveAccount();
  const userId = session?.user?.id;
  const [snapshot, setSnapshot] = useState<AppDataStore>(getAppDataStore());
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured || !isAuthenticated || !userId) {
      resetAppDataStore();
      setSnapshot(getAppDataStore());
      return;
    }

    if (isLoadingAccounts || !activeAccountId) {
      return;
    }

    setIsLoading(true);
    try {
      const [
        personalProfile,
        score,
        creditProducts,
        loans,
        advances,
        walletCards,
        postpaidWallet,
        remittanceCorridors,
        incomingRemittances,
        outgoingRemittances,
        myAccounts,
        contacts,
        agentClients,
        agentHistory,
        agentNotifications,
        businessNotifications,
      ] = await Promise.all([
        fetchPersonalDataProfile(activeAccountId, {
          accountType: activeAccount.accountType,
          membershipId: activeAccount.membershipId,
          initials: activeAccount.initials,
          color: activeAccount.color,
        }),
        fetchUserScore(userId),
        fetchCreditProducts(),
        fetchAccountLoans(activeAccountId),
        fetchAccountAdvances(activeAccountId),
        fetchWalletCards(activeAccountId),
        fetchPostpaidWalletState(activeAccountId),
        fetchRemittanceCorridors(),
        fetchIncomingRemittances(activeAccountId),
        fetchOutgoingRemittances(activeAccountId),
        fetchMyAccounts(activeAccountId),
        fetchContacts(userId),
        activeAccount.kind === 'agent'
          ? fetchAgentClients(activeAccountId)
          : Promise.resolve([]),
        activeAccount.kind === 'agent'
          ? fetchAgentOperations(activeAccountId)
          : Promise.resolve([]),
        activeAccount.kind === 'agent'
          ? fetchAgentNotifications(activeAccountId)
          : Promise.resolve([]),
        activeAccount.kind === 'business'
          ? fetchBusinessNotifications(activeAccountId)
          : Promise.resolve([]),
      ]);

      patchAppDataStore({
        personalProfile,
        score,
        creditProducts,
        loans,
        advances,
        walletCards,
        postpaidWallet,
        remittanceCorridors,
        incomingRemittances,
        outgoingRemittances,
        myAccounts,
        contacts,
        agentClients,
        agentHistory,
        agentNotifications,
        businessNotifications,
      });
      setSnapshot(getAppDataStore());
    } catch {
      // Mantém último snapshot válido
    } finally {
      setIsLoading(false);
    }
  }, [
    activeAccount.accountType,
    activeAccount.color,
    activeAccount.initials,
    activeAccount.membershipId,
    activeAccount.kind,
    activeAccountId,
    isAuthenticated,
    isLoadingAccounts,
    userId,
  ]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      ...snapshot,
      isLoading,
      refresh,
    }),
    [snapshot, isLoading, refresh],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return ctx;
}
