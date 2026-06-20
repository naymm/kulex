import { useCallback, useEffect, useState } from 'react';
import type { KixikilaDetail } from '@/constants/kixikila';
import { useAuth } from '@/contexts/AuthContext';
import { useActiveAccount } from '@/contexts/AccountContext';
import { fetchKixikilaDetail } from '@/lib/api/kixikila';
import { isSupabaseConfigured } from '@/lib/supabase';

export function useKixikilaDetail(kixikilaId?: string) {
  const { isAuthenticated } = useAuth();
  const { activeAccountId } = useActiveAccount();
  const [detail, setDetail] = useState<KixikilaDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!kixikilaId || !isSupabaseConfigured || !isAuthenticated) {
      setDetail(null);
      return;
    }

    setIsLoading(true);
    try {
      const remote = await fetchKixikilaDetail(kixikilaId, activeAccountId);
      setDetail(remote);
    } catch {
      setDetail(null);
    } finally {
      setIsLoading(false);
    }
  }, [activeAccountId, isAuthenticated, kixikilaId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { detail, isLoading, refresh };
}
