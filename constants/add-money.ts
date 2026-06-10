export type PaymentMethodId = 'multicaixa' | 'referencia' | 'cartao';

export type PaymentMethod = {
  id: PaymentMethodId;
  label: string;
  icon: 'flower-outline' | 'card-outline';
  showCardBrands?: boolean;
};

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'multicaixa', label: 'Multicaixa Express', icon: 'flower-outline' },
  { id: 'referencia', label: 'Referência de Pagamento', icon: 'flower-outline' },
  { id: 'cartao', label: 'Cartão', icon: 'card-outline', showCardBrands: true },
];

export const MCX_FEE_CENTS = 9000; // 90,00 AOA

/** Taxa de câmbio AOA → USD (ex.: 5.000,00 kz ≈ 5,26 USD) */
export const CARD_AOA_PER_USD = 950.570342205323;

export const REFERENCE_ENTITY = '00220';
export const REFERENCE_NUMBER = '192 648 894';
export const REFERENCE_VALIDITY = '23h59m';

export const ADD_MONEY_BALANCE = '85.400,00';
