import { Redirect, useLocalSearchParams } from 'expo-router';

export default function RemessaReceberDetalheRedirect() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  if (typeof id !== 'string') {
    return <Redirect href="/remessas/historico" />;
  }

  return (
    <Redirect
      href={{
        pathname: '/remessas/historico/recebida/[id]',
        params: { id },
      }}
    />
  );
}
