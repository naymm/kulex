export type WithdrawMethodId = 'agente' | 'banco' | 'multicaixa';

export type WithdrawMethod = {
  id: WithdrawMethodId;
  label: string;
  icon: 'person-outline' | 'business-outline' | 'flower-outline';
};

export const WITHDRAW_METHODS: WithdrawMethod[] = [
  { id: 'agente', label: 'Agente Kulex', icon: 'person-outline' },
  { id: 'banco', label: 'Conta Bancária', icon: 'business-outline' },
  { id: 'multicaixa', label: 'Multicaixa Express', icon: 'flower-outline' },
];

export const WITHDRAW_BALANCE = '85.400,00';

export const AGENT_REFERENCE = '145 678 217';
export const AGENT_PIN = '123';
export const AGENT_VALIDITY = '23h59m';

export const BANK_TRANSACTION_REF = 'TW-00982302390';
export const BANK_SUCCESS_NOTE =
  'Esta operação não é instantânea, pode levar até 48 horas para ser concluída.';
