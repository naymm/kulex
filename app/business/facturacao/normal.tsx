import { Redirect } from 'expo-router';

export default function BusinessFacturaNormalScreen() {
  return <Redirect href="/business/facturacao/criar?type=normal" />;
}
