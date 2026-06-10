import {
  formatPlafondAmount,
  getCardProductById,
  type PostpaidCardTierId,
} from '@/constants/postpaid-card';
import { formatMoneyAmount, parseMoneyAmount } from '@/lib/postpaid-bill';

export type PostpaidWalletState = {
  plafond: string;
  available: string;
};

const DEMO_USED_AMOUNT = 2_250_000;
const DEFAULT_POSTPAID_TIER: PostpaidCardTierId = 'black';

function createInitialWalletState(): PostpaidWalletState {
  const product = getCardProductById(DEFAULT_POSTPAID_TIER);
  const plafond = formatPlafondAmount(product.minPlafond);
  const available = formatMoneyAmount(Math.max(0, product.minPlafond - DEMO_USED_AMOUNT));

  return { plafond, available };
}

let walletState: PostpaidWalletState = createInitialWalletState();

export function getPostpaidWalletState(): PostpaidWalletState {
  return { ...walletState };
}

export function setPostpaidWalletState(next: PostpaidWalletState): void {
  walletState = { ...next };
}

export function resetPostpaidWalletState(): void {
  walletState = createInitialWalletState();
}

export function getPostpaidUsedAmount(state: PostpaidWalletState = walletState): string {
  const used = Math.max(0, parseMoneyAmount(state.plafond) - parseMoneyAmount(state.available));
  return formatMoneyAmount(used);
}
