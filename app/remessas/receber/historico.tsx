import { Redirect } from 'expo-router';

export default function RemessaReceberHistoricoRedirect() {
  return <Redirect href={{ pathname: '/remessas/historico', params: { tab: 'recebidas' } }} />;
}
