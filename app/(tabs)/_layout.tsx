import { Tabs, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { BottomTabBar } from '@/components/BottomTabBar';
import {
  isAgentAccount,
  isBusinessAccount,
  isPersonalAccount,
} from '@/constants/accounts';
import {
  AGENT_ONLY_ROUTES,
  BUSINESS_ONLY_ROUTES,
  PERSONAL_ONLY_ROUTES,
} from '@/constants/tab-bar';
import { useActiveAccount } from '@/contexts/AccountContext';

export default function TabLayout() {
  const { activeAccount, activeAccountId } = useActiveAccount();
  const isAgent = isAgentAccount(activeAccount);
  const isBusiness = isBusinessAccount(activeAccount);
  const isPersonal = isPersonalAccount(activeAccount);
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
    const onBusinessOnlyTab = BUSINESS_ONLY_ROUTES.includes(
      currentTab as (typeof BUSINESS_ONLY_ROUTES)[number],
    );

    if (!isPersonal && onPersonalOnlyTab) {
      router.replace('/(tabs)');
      return;
    }

    if (!isAgent && onAgentOnlyTab) {
      router.replace('/(tabs)');
      return;
    }

    if (!isBusiness && onBusinessOnlyTab) {
      router.replace('/(tabs)');
    }
  }, [activeAccountId, isAgent, isBusiness, isPersonal, router, segments]);

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
        options={{ title: 'Cartão', href: isPersonal ? undefined : null }}
      />
      <Tabs.Screen
        name="payments"
        options={{ title: 'Pagamentos', href: isPersonal ? undefined : null }}
      />
      <Tabs.Screen
        name="credito"
        options={{ title: 'Crédito', href: isPersonal ? undefined : null }}
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

      <Tabs.Screen
        name="business-receber"
        options={{ title: 'Receber', href: isBusiness ? undefined : null }}
      />
      <Tabs.Screen
        name="business-facturacao"
        options={{ title: 'Facturar', href: isBusiness ? undefined : null }}
      />
      <Tabs.Screen
        name="business-credito"
        options={{ title: 'Crédito', href: null }}
      />
      <Tabs.Screen
        name="business-servicos"
        options={{ title: 'Serviços', href: isBusiness ? undefined : null }}
      />
      <Tabs.Screen
        name="business-relatorios"
        options={{ title: 'Relatórios', href: null }}
      />

      <Tabs.Screen
        name="menu"
        options={{
          title: isAgent || isBusiness ? 'Conta' : 'Menu',
        }}
      />
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}
