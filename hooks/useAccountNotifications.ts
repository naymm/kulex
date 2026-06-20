import { useCallback, useEffect, useState } from 'react';
import type { PersonalNotification } from '@/constants/notifications';
import { useAuth } from '@/contexts/AuthContext';
import { useActiveAccount } from '@/contexts/AccountContext';
import {
  fetchAccountNotifications,
  markNotificationRead as markReadRemote,
} from '@/lib/api/notifications';
import { isSupabaseConfigured } from '@/lib/supabase';

export function useAccountNotifications() {
  const { isAuthenticated } = useAuth();
  const { activeAccountId } = useActiveAccount();
  const [items, setItems] = useState<PersonalNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRemote, setIsRemote] = useState(false);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured || !isAuthenticated) {
      setItems([]);
      setIsRemote(false);
      return;
    }

    setIsLoading(true);
    try {
      const remote = await fetchAccountNotifications(activeAccountId);
      setItems(remote);
      setIsRemote(true);
    } catch {
      setItems([]);
      setIsRemote(false);
    } finally {
      setIsLoading(false);
    }
  }, [activeAccountId, isAuthenticated]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const markRead = useCallback(
    async (id: string) => {
      await markReadRemote(id);
      await refresh();
    },
    [refresh],
  );

  const unreadCount = items.filter((item) => !item.read).length;

  return {
    items,
    unreadCount,
    isLoading,
    isRemote,
    refresh,
    markRead,
    getUnreadCount: () => unreadCount,
  };
}
