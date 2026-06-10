export type PostpaidCardTierId = 'branco' | 'verde' | 'gold' | 'prata' | 'black';

export type PlafondOption = {
  id: string;
  label: string;
  amount: string;
};

export type PostpaidCardProduct = {
  id: PostpaidCardTierId;
  label: string;
  minScore: number;
  minPlafond: number;
  maxPlafond: number;
  rangeLabel: string;
  colors: [string, string];
  textColor: string;
  image?: number;
};

export const POSTPAID_CARD_SCORE = 850;
export const POSTPAID_CARD_MIN_SCORE = 550;

export const POSTPAID_CARD_PRODUCTS: PostpaidCardProduct[] = [
  {
    id: 'branco',
    label: 'Cartão Branco',
    minScore: 550,
    minPlafond: 50_000,
    maxPlafond: 1_000_000,
    rangeLabel: '50.000,00 – 1.000.000,00',
    colors: ['#F3F4F6', '#E5E7EB'],
    textColor: '#111827',
  },
  {
    id: 'verde',
    label: 'Cartão Verde',
    minScore: 600,
    minPlafond: 1_000_000,
    maxPlafond: 2_500_000,
    rangeLabel: '1.000.000,00 – 2.500.000,00',
    colors: ['#16A34A', '#15803D'],
    textColor: '#FFFFFF',
  },
  {
    id: 'gold',
    label: 'Cartão Gold',
    minScore: 650,
    minPlafond: 2_500_000,
    maxPlafond: 5_000_000,
    rangeLabel: '2.500.000,00 – 5.000.000,00',
    colors: ['#C9A227', '#DFA021'],
    textColor: '#1A1A4E',
  },
  {
    id: 'prata',
    label: 'Cartão Prata',
    minScore: 700,
    minPlafond: 5_000_000,
    maxPlafond: 7_500_000,
    rangeLabel: '5.000.000,00 – 7.500.000,00',
    colors: ['#9CA3AF', '#6B7280'],
    textColor: '#FFFFFF',
  },
  {
    id: 'black',
    label: 'Cartão Black',
    minScore: 750,
    minPlafond: 7_500_000,
    maxPlafond: 10_000_000,
    rangeLabel: '7.500.000,00 – 10.000.000,00',
    colors: ['#111827', '#000000'],
    textColor: '#FFFFFF',
    image: require('../assets/images/cartao-black.png') as number,
  },
];

export const POSTPAID_CARD_BENEFITS = [
  {
    id: 'safe',
    icon: 'shield-outline' as const,
    title: 'Mais segurança online',
    description: 'Bloqueie ou substitua o cartão instantaneamente se detectar uma transacção suspeita.',
  },
  {
    id: 'spend',
    icon: 'globe-outline' as const,
    title: 'Gaste em todo o lado',
    description: 'Aceite internacionalmente e pague em AOA ou deixe a Kulex converter quando necessário.',
  },
  {
    id: 'cycle',
    icon: 'calendar-outline' as const,
    title: 'Ciclo de pagamento flexível',
    description: 'Fatura mensal com prazo de pagamento e opção de pagamento mínimo.',
  },
];

export type PostpaidDueDayOption = {
  id: string;
  day: number;
  label: string;
  description: string;
};

export const POSTPAID_BILLING_DUE_DAYS: PostpaidDueDayOption[] = [
  {
    id: 'due-5',
    day: 5,
    label: 'Dia 5',
    description: '5.º dia útil de cada mês',
  },
  {
    id: 'due-10',
    day: 10,
    label: 'Dia 10',
    description: '10.º dia útil de cada mês',
  },
  {
    id: 'due-15',
    day: 15,
    label: 'Dia 15',
    description: '15.º dia útil de cada mês',
  },
  {
    id: 'due-20',
    day: 20,
    label: 'Dia 20',
    description: '20.º dia útil de cada mês',
  },
  {
    id: 'due-25',
    day: 25,
    label: 'Dia 25',
    description: '25.º dia útil de cada mês',
  },
];

export const POSTPAID_CARD_TERMS = {
  interestRateMonthly: '2,49%',
  interestRateAnnual: '29,88%',
  taeg: '34,50%',
  annualFee: '0,00 kz',
  paymentCycle: 'Fatura mensal — vencimento no dia útil escolhido',
  minimumPayment: '3% do saldo em dívida',
  gracePeriod: '21 dias após fecho da fatura',
};

export function getDueDayById(id: string): PostpaidDueDayOption | undefined {
  return POSTPAID_BILLING_DUE_DAYS.find((option) => option.id === id);
}

export function formatPaymentCycleLabel(day: number): string {
  return `Fatura mensal — vencimento no ${day}.º dia útil`;
}

export function formatPlafondAmount(value: number): string {
  const [intPart, decPart] = value.toFixed(2).split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${grouped},${decPart}`;
}

export function getCardProductById(id: string): PostpaidCardProduct {
  return POSTPAID_CARD_PRODUCTS.find((product) => product.id === id) ?? POSTPAID_CARD_PRODUCTS[0];
}

export function getMaxCardTierForScore(score: number): PostpaidCardTierId | null {
  if (score < POSTPAID_CARD_MIN_SCORE) return null;

  let maxTier: PostpaidCardTierId | null = null;
  for (const product of POSTPAID_CARD_PRODUCTS) {
    if (score >= product.minScore) {
      maxTier = product.id;
    }
  }
  return maxTier;
}

export function getEligibleCardProducts(score: number): PostpaidCardProduct[] {
  if (score < POSTPAID_CARD_MIN_SCORE) return [];
  return POSTPAID_CARD_PRODUCTS.filter((product) => score >= product.minScore);
}

export function getPlafondOptionsForCard(cardId: PostpaidCardTierId): PlafondOption[] {
  const product = getCardProductById(cardId);

  return [
    {
      id: `${cardId}-min`,
      label: 'Mínimo',
      amount: formatPlafondAmount(product.minPlafond),
    },
  ];
}

export function getScoringLabel(cardId: PostpaidCardTierId): string {
  return getCardProductById(cardId).label;
}

export function getPlafondById(cardId: PostpaidCardTierId, plafondId: string) {
  return getPlafondOptionsForCard(cardId).find((option) => option.id === plafondId);
}
