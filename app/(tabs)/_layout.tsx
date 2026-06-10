import { Tabs, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { BottomTabBar } from '@/components/BottomTabBar';
import { isAgentAccount } from '@/constants/accounts';
import { AGENT_ONLY_ROUTES, PERSONAL_ONLY_ROUTES } from '@/constants/tab-bar';
import { useActiveAccount } from '@/contexts/AccountContext';

export default function TabLayout() {
  const { activeAccount, activeAccountId } = useActiveAccount();
  const isAgent = isAgentAccount(activeAccount);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const currentTab = segments[segments.length - 1];
    if (!currentTab) return;

    const onPersonalOnlyTab = PERSONAL_ONLY_ROUTES.includes(
      currentTab as (typeof PERSONAL_ONLY_ROUTES)[number],
    );
    const onAgentOnlyTab = AGENT_ONLY_ROUTES.includes(
      currentTab as (typeof AGENT_ONLY_ROUTES)[number],
    );

    if (isAgent && onPersonalOnlyTab) {
      router.replace('/(tabs)');
      return;
    }

    if (!isAgent && onAgentOnlyTab) {
      router.replace('/(tabs)');
    }
  }, [activeAccountId, isAgent, router, segments]);

  return (
    <Tabs
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen name="index" options={{ title: 'Início' }} />

      <Tabs.Screen
        name="cards"
        options={{ title: 'Cartão', href: isAgent ? null : undefined }}
      />
      <Tabs.Screen
        name="payments"
        options={{ title: 'Pagamentos', href: isAgent ? null : undefined }}
      />
      <Tabs.Screen
        name="credito"
        options={{ title: 'Crédito', href: isAgent ? null : undefined }}
      />

      <Tabs.Screen
        name="agent-operacoes"
        options={{ title: 'Clientes', href: isAgent ? undefined : null }}
      />
      <Tabs.Screen
        name="agent-operar"
        options={{ title: 'Operar', href: isAgent ? undefined : null }}
      />
      <Tabs.Screen
        name="agent-comissoes"
        options={{ title: 'Comissões', href: isAgent ? undefined : null }}
      />

      <Tabs.Screen name="menu" options={{ title: isAgent ? 'Conta' : 'Menu' }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}
