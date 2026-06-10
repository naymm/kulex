import { AgentHomeScreen } from '@/components/agent/AgentHomeScreen';
import { PersonalHomeScreen } from '@/components/home/PersonalHomeScreen';
import { isAgentAccount } from '@/constants/accounts';
import { useActiveAccount } from '@/contexts/AccountContext';

export default function HomeScreen() {
  const { activeAccount } = useActiveAccount();

  if (isAgentAccount(activeAccount)) {
    return <AgentHomeScreen />;
  }

  return <PersonalHomeScreen />;
}
