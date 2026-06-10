export type SendMoneyMethodId = 'contacto' | 'banco' | 'kwik' | 'minhascontas';

export type SendMoneyMethod = {
  id: SendMoneyMethodId;
  label: string;
  icon: 'person-outline' | 'business-outline' | 'flower-outline' | 'flash-outline';
};

export const SEND_MONEY_METHODS: SendMoneyMethod[] = [
  { id: 'contacto', label: 'Kulex', icon: 'person-outline' },
  { id: 'banco', label: 'Conta Bancária', icon: 'business-outline' },
  { id: 'kwik', label: 'KWiK', icon: 'flash-outline' },
  { id: 'minhascontas', label: 'Minhas Contas', icon: 'flower-outline' },
];

export const AGENT_SEND_MONEY_METHODS: SendMoneyMethod[] = SEND_MONEY_METHODS.filter(
  (method) => method.id !== 'contacto',
);
