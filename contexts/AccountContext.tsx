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
  DEFAULT_ACCOUNT_ID,
  getAccountById,
  KULEX_ACCOUNTS,
  type KulexAccount,
} from '@/constants/accounts';

const SWITCH_DURATION_MS = 1100;

type AccountContextValue = {
  accounts: KulexAccount[];
  activeAccount: KulexAccount;
  activeAccountId: string;
  isSwitchingAccount: boolean;
  setActiveAccountId: (id: string) => void;
  switchAccount: (id: string) => void;
};

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [activeAccountId, setActiveAccountId] = useState(DEFAULT_ACCOUNT_ID);
  const [isSwitchingAccount, setIsSwitchingAccount] = useState(false);
  const [switchingToAccount, setSwitchingToAccount] = useState<KulexAccount | null>(null);
  const switchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearSwitchTimeout = useCallback(() => {
    if (switchTimeoutRef.current) {
      clearTimeout(switchTimeoutRef.current);
      switchTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => clearSwitchTimeout, [clearSwitchTimeout]);

  const switchAccount = useCallback(
    (accountId: string) => {
      if (accountId === activeAccountId || isSwitchingAccount) return;

      clearSwitchTimeout();
      const target = getAccountById(accountId);
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
    [activeAccountId, clearSwitchTimeout, isSwitchingAccount],
  );

  const value = useMemo(
    () => ({
      accounts: KULEX_ACCOUNTS,
      activeAccount: getAccountById(activeAccountId),
      activeAccountId,
      isSwitchingAccount,
      setActiveAccountId,
      switchAccount,
    }),
    [activeAccountId, isSwitchingAccount, switchAccount],
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
