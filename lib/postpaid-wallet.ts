import { getAppDataStore, patchAppDataStore } from '@/lib/data-store';
import { updatePostpaidWalletState } from '@/lib/api/cards';
import { formatMoneyAmount, parseMoneyAmount } from '@/lib/postpaid-bill';
import { isSupabaseConfigured } from '@/lib/supabase';

export type PostpaidWalletState = {
  plafond: string;
  available: string;
};

const DEFAULT_STATE: PostpaidWalletState = {
  plafond: '0,00',
  available: '0,00',
};

export function getPostpaidWalletState(): PostpaidWalletState {
  return getAppDataStore().postpaidWallet ?? DEFAULT_STATE;
}

export async function setPostpaidWalletStateRemote(
  accountId: string,
  next: PostpaidWalletState,
): Promise<void> {
  patchAppDataStore({ postpaidWallet: next });

  if (!isSupabaseConfigured) return;

  const plafondCents = Math.round(parseMoneyAmount(next.plafond) * 100);
  const availableCents = Math.round(parseMoneyAmount(next.available) * 100);
  await updatePostpaidWalletState(accountId, plafondCents, availableCents);
}

export function setPostpaidWalletState(next: PostpaidWalletState): void {
  patchAppDataStore({ postpaidWallet: next });
}

export function getPostpaidUsedAmount(state: PostpaidWalletState = getPostpaidWalletState()): string {
  const used = Math.max(0, parseMoneyAmount(state.plafond) - parseMoneyAmount(state.available));
  return formatMoneyAmount(used);
}
