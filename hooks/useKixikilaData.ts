import { useCallback, useEffect, useState } from 'react';
import type { MyKixikila, PlatformKixikilaSummary } from '@/constants/kixikila';
import { useAuth } from '@/contexts/AuthContext';
import { useActiveAccount } from '@/contexts/AccountContext';
import {
  fetchJoinedPlatformIds,
  fetchMyKixikilas,
  fetchPlatformKixikilas,
} from '@/lib/api/kixikila';
import { isSupabaseConfigured } from '@/lib/supabase';

export function useKixikilaData() {
  const { isAuthenticated } = useAuth();
  const { activeAccountId } = useActiveAccount();
  const [myKixikilas, setMyKixikilas] = useState<MyKixikila[]>([]);
  const [platformKixikilas, setPlatformKixikilas] = useState<PlatformKixikilaSummary[]>([]);
  const [joinedPlatformIds, setJoinedPlatformIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isRemote, setIsRemote] = useState(false);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured || !isAuthenticated) {
      setMyKixikilas([]);
      setPlatformKixikilas([]);
      setJoinedPlatformIds(new Set());
      setIsRemote(false);
      return;
    }

    setIsLoading(true);
    try {
      const [mine, platform, joined] = await Promise.all([
        fetchMyKixikilas(activeAccountId),
        fetchPlatformKixikilas(),
        fetchJoinedPlatformIds(activeAccountId),
      ]);

      setMyKixikilas(mine);
      setPlatformKixikilas(platform);
      setJoinedPlatformIds(joined);
      setIsRemote(true);
    } catch {
      setMyKixikilas([]);
      setPlatformKixikilas([]);
      setJoinedPlatformIds(new Set());
      setIsRemote(false);
    } finally {
      setIsLoading(false);
    }
  }, [activeAccountId, isAuthenticated]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const availablePlatform = platformKixikilas.filter((item) => !joinedPlatformIds.has(item.id));
  const isJoinedPlatform = (id: string) => joinedPlatformIds.has(id);

  return {
    myKixikilas,
    platformKixikilas,
    availablePlatformKixikilas: availablePlatform,
    isJoinedPlatform,
    isLoading,
    isRemote,
    refresh,
  };
}
