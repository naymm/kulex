import { AgentHomeScreen } from '@/components/agent/AgentHomeScreen';
import { BusinessHomeScreen } from '@/components/business/BusinessHomeScreen';
import { PersonalHomeScreen } from '@/components/home/PersonalHomeScreen';
import { isAgentAccount, isBusinessAccount } from '@/constants/accounts';
import { useActiveAccount } from '@/contexts/AccountContext';

export default function HomeScreen() {
  const { activeAccount } = useActiveAccount();

  if (isAgentAccount(activeAccount)) {
    return <AgentHomeScreen />;
  }

  if (isBusinessAccount(activeAccount)) {
    return <BusinessHomeScreen />;
  }

  return <PersonalHomeScreen />;
}
