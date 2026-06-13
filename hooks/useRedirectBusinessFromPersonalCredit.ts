import { router } from 'expo-router';
import { useEffect } from 'react';
import { isBusinessAccount } from '@/constants/accounts';
import { useActiveAccount } from '@/contexts/AccountContext';

const BUSINESS_CREDIT_ROUTE = '/(tabs)/business-credito';

export function useRedirectBusinessFromPersonalCredit(): boolean {
  const { activeAccount } = useActiveAccount();
  const isBusiness = isBusinessAccount(activeAccount);

  useEffect(() => {
    if (isBusiness) {
      router.replace(BUSINESS_CREDIT_ROUTE);
    }
  }, [isBusiness]);

  return isBusiness;
}
