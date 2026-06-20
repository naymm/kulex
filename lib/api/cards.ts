import type { PostpaidCardTierId } from '@/constants/postpaid-card';
import type { WalletCard, WalletPostpaidCard, WalletPrepaidCard } from '@/constants/card';
import { formatBalanceFromCents } from '@/lib/api/accounts';
import type { PostpaidWalletState } from '@/lib/postpaid-wallet';
import { formatMoneyAmount } from '@/lib/postpaid-bill';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

type CardRow = {
  id: string;
  card_type: 'prepaid' | 'postpaid';
  pan_masked: string;
  expiry_month: number | null;
  expiry_year: number | null;
  holder_name: string | null;
  status: string;
  product_id: PostpaidCardTierId | null;
};

type WalletStateRow = {
  plafond_cents: number;
  available_cents: number;
};

const TIER_LABELS: Record<PostpaidCardTierId, string> = {
  branco: 'Cartão Branco',
  verde: 'Cartão Verde',
  gold: 'Cartão Gold',
  prata: 'Cartão Prata',
  black: 'Cartão Black',
};

function formatExpiry(month: number | null, year: number | null): string {
  if (!month || !year) return '—';
  return `${String(month).padStart(2, '0')}/${String(year).slice(-2)}`;
}

function mapPrepaidCard(row: CardRow, balanceCents: number): WalletPrepaidCard {
  return {
    id: 'prepaid',
    kind: 'prepaid',
    title: 'Cartão Pré-pago',
    subtitle: row.holder_name ?? 'Titular',
    typeLabel: 'Pré-pago',
    lastDigits: row.pan_masked.slice(-4),
    cardNumber: row.pan_masked,
    expiry: formatExpiry(row.expiry_month, row.expiry_year),
    balance: formatBalanceFromCents(balanceCents),
  };
}

function mapPostpaidCard(row: CardRow, state: WalletStateRow): WalletPostpaidCard {
  const tierId = row.product_id ?? 'black';
  return {
    id: `postpaid-${tierId}`,
    kind: 'postpaid',
    title: TIER_LABELS[tierId],
    subtitle: row.holder_name ?? 'Titular',
    typeLabel: 'Pós-pago',
    tierId,
    plafond: formatMoneyAmount(state.plafond_cents / 100),
    available: formatMoneyAmount(state.available_cents / 100),
    cardNumber: row.pan_masked,
    expiry: formatExpiry(row.expiry_month, row.expiry_year),
  };
}

export async function fetchWalletCards(accountId: string): Promise<WalletCard[]> {
  if (!isSupabaseConfigured || !accountId) return [];

  const { data: cards, error } = await supabase
    .from('wallet_cards')
    .select('*')
    .eq('account_id', accountId)
    .eq('status', 'active')
    .order('created_at', { ascending: true });

  if (error) throw error;
  if (!cards?.length) return [];

  const result: WalletCard[] = [];

  for (const row of cards as CardRow[]) {
    if (row.card_type === 'postpaid') {
      const { data: state } = await supabase
        .from('postpaid_wallet_states')
        .select('plafond_cents, available_cents')
        .eq('card_id', row.id)
        .maybeSingle();

      if (state) {
        result.push(mapPostpaidCard(row, state as WalletStateRow));
      }
    } else {
      const { data: account } = await supabase
        .from('kulex_accounts')
        .select('balance_cents')
        .eq('id', accountId)
        .maybeSingle();

      result.push(mapPrepaidCard(row, account?.balance_cents ?? 0));
    }
  }

  return result;
}

export async function fetchPostpaidWalletState(accountId: string): Promise<PostpaidWalletState | null> {
  if (!isSupabaseConfigured || !accountId) return null;

  const { data: card } = await supabase
    .from('wallet_cards')
    .select('id')
    .eq('account_id', accountId)
    .eq('card_type', 'postpaid')
    .eq('status', 'active')
    .maybeSingle();

  if (!card) return null;

  const { data: state, error } = await supabase
    .from('postpaid_wallet_states')
    .select('plafond_cents, available_cents')
    .eq('card_id', card.id)
    .maybeSingle();

  if (error) throw error;
  if (!state) return null;

  return {
    plafond: formatMoneyAmount((state as WalletStateRow).plafond_cents / 100),
    available: formatMoneyAmount((state as WalletStateRow).available_cents / 100),
  };
}

export async function updatePostpaidWalletState(
  accountId: string,
  plafondCents: number,
  availableCents: number,
): Promise<void> {
  if (!isSupabaseConfigured) return;

  const { data: card } = await supabase
    .from('wallet_cards')
    .select('id')
    .eq('account_id', accountId)
    .eq('card_type', 'postpaid')
    .maybeSingle();

  if (!card) return;

  const { error } = await supabase
    .from('postpaid_wallet_states')
    .update({
      plafond_cents: plafondCents,
      available_cents: availableCents,
      used_cents: Math.max(0, plafondCents - availableCents),
      updated_at: new Date().toISOString(),
    })
    .eq('card_id', card.id);

  if (error) throw error;
}

export async function issueWalletCard(
  accountId: string,
  input: {
    cardType: 'prepaid' | 'postpaid';
    panMasked: string;
    holderName: string;
    expiryMonth: number;
    expiryYear: number;
    productId?: PostpaidCardTierId;
    plafondCents?: number;
  },
): Promise<string> {
  if (!isSupabaseConfigured) throw new Error('Backend não configurado');

  const cardId = `${input.cardType}-${Date.now()}`;

  const { error: cardError } = await supabase.from('wallet_cards').insert({
    id: cardId,
    account_id: accountId,
    card_type: input.cardType,
    pan_masked: input.panMasked,
    holder_name: input.holderName,
    expiry_month: input.expiryMonth,
    expiry_year: input.expiryYear,
    status: 'active',
    product_id: input.productId ?? null,
  });

  if (cardError) throw cardError;

  if (input.cardType === 'postpaid' && input.plafondCents) {
    const { error: stateError } = await supabase.from('postpaid_wallet_states').insert({
      card_id: cardId,
      plafond_cents: input.plafondCents,
      available_cents: input.plafondCents,
      used_cents: 0,
    });
    if (stateError) throw stateError;
  }

  return cardId;
}
