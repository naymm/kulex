export type MyAccountId = 'pessoal' | 'agente' | 'poupanca';

export type MyAccount = {
  id: MyAccountId;
  name: string;
  subtitle: string;
  balance: string;
  icon: 'person-outline' | 'shield-checkmark-outline' | 'wallet-outline';
};

export const MY_ACCOUNTS: MyAccount[] = [
  {
    id: 'pessoal',
    name: 'Kulex Pessoal',
    subtitle: 'Conta principal',
    balance: '825.415,56',
    icon: 'person-outline',
  },
  {
    id: 'agente',
    name: 'Kulex Agente',
    subtitle: 'Conta agente',
    balance: '45.200,00',
    icon: 'shield-checkmark-outline',
  },
  {
    id: 'poupanca',
    name: 'Poupança',
    subtitle: 'Reservas',
    balance: '120.000,00',
    icon: 'wallet-outline',
  },
];

export const DEFAULT_SOURCE_ACCOUNT: MyAccountId = 'pessoal';

export function getMyAccountById(id: string | undefined): MyAccount | undefined {
  return MY_ACCOUNTS.find((account) => account.id === id);
}
