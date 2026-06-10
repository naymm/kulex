import type { PostpaidCardTierId } from '@/constants/postpaid-card';
import { getPostpaidWalletState } from '@/lib/postpaid-wallet';

export const CARD_NUMBER_MASKED = '****  ****  ****  1123';
export const CARD_NUMBER_FULL = '1234 5678 9101 1123';
export const CARD_NUMBER_RAW = '1234567891011123';
export const CARD_HOLDER_DISPLAY = 'Naym Mupoia';
export const CARD_EXPIRY = '02/28';
export const CARD_CVV = '448';
export const CARD_BILLING_ADDRESS = 'Rua Marechal, Brós Tito, Edifício ESCOM, Kinaxixi, Luanda, Angola';
export const CARD_POSTAL_CODE = '19709';
export const CARD_BALANCE = '120.435,56';

export const WALLET_CARD_WIDTH = 329;
export const WALLET_CARD_HEIGHT = 180;
export const WALLET_CARD_ASPECT = WALLET_CARD_WIDTH / WALLET_CARD_HEIGHT;

const initialPostpaidWallet = getPostpaidWalletState();

export const POSTPAID_BLACK_CARD = {
  tierId: 'black' as const,
  label: 'Cartão Black',
  typeLabel: 'Pós-pago' as const,
  plafond: initialPostpaidWallet.plafond,
  available: initialPostpaidWallet.available,
  bill: {
    periodLabel: 'Maio 2026',
    closingDateLabel: '31 Mai 2026',
    dueDateLabel: '05 Jul 2026',
  },
};

export type CardTypeLabel = 'Pré-pago' | 'Pós-pago';

export type WalletPrepaidCard = {
  id: 'prepaid';
  kind: 'prepaid';
  title: string;
  subtitle: string;
  typeLabel: CardTypeLabel;
  lastDigits: string;
};

export type WalletPostpaidCard = {
  id: 'postpaid-black';
  kind: 'postpaid';
  title: string;
  subtitle: string;
  typeLabel: CardTypeLabel;
  tierId: PostpaidCardTierId;
  plafond: string;
  available: string;
};

export type WalletCard = WalletPrepaidCard | WalletPostpaidCard;

export type NewCardKind = 'prepaid' | 'postpaid';

export const NEW_CARD_TYPE_OPTIONS: {
  id: NewCardKind;
  typeLabel: CardTypeLabel;
  title: string;
  description: string;
  route: '/cards/pre-pago' | '/cards/pos-pago';
}[] = [
  {
    id: 'prepaid',
    typeLabel: 'Pré-pago',
    title: 'Cartão Pré-pago',
    description: 'Carregue o saldo e use apenas o que tiver disponível. Ideal para controlo de despesas.',
    route: '/cards/pre-pago',
  },
  {
    id: 'postpaid',
    typeLabel: 'Pós-pago',
    title: 'Cartão Pós-pago',
    description: 'Crédito rotativo com plafond baseado no seu scoring e pagamento mensal da fatura.',
    route: '/cards/pos-pago',
  },
];

export const WALLET_CARDS: WalletCard[] = [
  {
    id: 'prepaid',
    kind: 'prepaid',
    title: 'Cartão Pré-pago',
    subtitle: 'Mastercard',
    typeLabel: 'Pré-pago',
    lastDigits: '1123',
  },
  {
    id: 'postpaid-black',
    kind: 'postpaid',
    title: POSTPAID_BLACK_CARD.label,
    subtitle: 'Mastercard',
    typeLabel: POSTPAID_BLACK_CARD.typeLabel,
    tierId: POSTPAID_BLACK_CARD.tierId,
    plafond: POSTPAID_BLACK_CARD.plafond,
    available: POSTPAID_BLACK_CARD.available,
  },
];
