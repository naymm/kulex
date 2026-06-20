import { useCallback, useEffect, useState } from 'react';
import type { Movement } from '@/constants/movimentos';
import { useAuth } from '@/contexts/AuthContext';
import { useActiveAccount } from '@/contexts/AccountContext';
import { fetchAccountMovements } from '@/lib/api/movements';
import { isSupabaseConfigured } from '@/lib/supabase';

export function useAccountMovements() {
  const { isAuthenticated } = useAuth();
  const { activeAccountId } = useActiveAccount();
  const [movements, setMovements] = useState<Movement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRemote, setIsRemote] = useState(false);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured || !isAuthenticated) {
      setMovements([]);
      setIsRemote(false);
      return;
    }

    setIsLoading(true);
    try {
      const remote = await fetchAccountMovements(activeAccountId);
      setMovements(remote);
      setIsRemote(remote.length > 0);
    } catch {
      setMovements([]);
      setIsRemote(false);
    } finally {
      setIsLoading(false);
    }
  }, [activeAccountId, isAuthenticated]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { movements, isLoading, isRemote, refresh };
}
