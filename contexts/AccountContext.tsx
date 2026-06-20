import { router } from 'expo-router';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AccountSwitchOverlay } from '@/components/menu/AccountSwitchOverlay';
import {
  getAccountById,
  type KulexAccount,
} from '@/constants/accounts';
import { useAuth } from '@/contexts/AuthContext';
import { fetchUserAccounts } from '@/lib/api/accounts';

const SWITCH_DURATION_MS = 1100;

type AccountContextValue = {
  accounts: KulexAccount[];
  activeAccount: KulexAccount;
  activeAccountId: string;
  isSwitchingAccount: boolean;
  isLoadingAccounts: boolean;
  setActiveAccountId: (id: string) => void;
  switchAccount: (id: string) => void;
  refreshAccounts: () => Promise<void>;
};

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isBackendEnabled, session } = useAuth();
  const [accounts, setAccounts] = useState<KulexAccount[]>([]);
  const [activeAccountId, setActiveAccountId] = useState<string>('');
  const [isSwitchingAccount, setIsSwitchingAccount] = useState(false);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [switchingToAccount, setSwitchingToAccount] = useState<KulexAccount | null>(null);
  const switchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearSwitchTimeout = useCallback(() => {
    if (switchTimeoutRef.current) {
      clearTimeout(switchTimeoutRef.current);
      switchTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => clearSwitchTimeout, [clearSwitchTimeout]);

  const refreshAccounts = useCallback(async () => {
    if (!isBackendEnabled || !isAuthenticated) {
      setAccounts([]);
      return;
    }

    setIsLoadingAccounts(true);
    try {
      const remoteAccounts = await fetchUserAccounts();
      setAccounts(remoteAccounts);
      if (remoteAccounts.length > 0) {
        setActiveAccountId((current) =>
          remoteAccounts.some((account) => account.id === current)
            ? current
            : remoteAccounts[0].id,
        );
      } else {
        setActiveAccountId('');
      }
    } catch {
      // Mantém contas actuais em caso de erro de rede
    } finally {
      setIsLoadingAccounts(false);
    }
  }, [isAuthenticated, isBackendEnabled]);

  useEffect(() => {
    if (!isBackendEnabled) {
      setAccounts([]);
      return;
    }

    if (!isAuthenticated || !session?.user?.id) {
      setAccounts([]);
      setActiveAccountId('');
      return;
    }

    void refreshAccounts();
  }, [isAuthenticated, isBackendEnabled, refreshAccounts, session?.user?.id]);

  const switchAccount = useCallback(
    (accountId: string) => {
      if (accountId === activeAccountId || isSwitchingAccount) return;

      clearSwitchTimeout();
      const target = getAccountById(accountId, accounts);
      setSwitchingToAccount(target);
      setIsSwitchingAccount(true);

      switchTimeoutRef.current = setTimeout(() => {
        setActiveAccountId(accountId);
        router.replace('/(tabs)');

        switchTimeoutRef.current = setTimeout(() => {
          setIsSwitchingAccount(false);
          setSwitchingToAccount(null);
          switchTimeoutRef.current = null;
        }, 350);
      }, SWITCH_DURATION_MS);
    },
    [accounts, activeAccountId, clearSwitchTimeout, isSwitchingAccount],
  );

  const value = useMemo(
    () => ({
      accounts,
      activeAccount: getAccountById(activeAccountId, accounts),
      activeAccountId,
      isSwitchingAccount,
      isLoadingAccounts,
      setActiveAccountId,
      switchAccount,
      refreshAccounts,
    }),
    [
      accounts,
      activeAccountId,
      isSwitchingAccount,
      isLoadingAccounts,
      switchAccount,
      refreshAccounts,
    ],
  );

  return (
    <AccountContext.Provider value={value}>
      {children}
      <AccountSwitchOverlay visible={isSwitchingAccount} account={switchingToAccount} />
    </AccountContext.Provider>
  );
}

export function useActiveAccount(): AccountContextValue {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useActiveAccount must be used within AccountProvider');
  }
  return context;
}
