import { CARD_LOAD_FEE_CENTS } from '@/constants/load-card';
import { formatMoneyFromDigitsAsCents } from '@/lib/money';

export function computeLoadCardSummary(amountDigits: string) {
  const amountCents = Number(amountDigits) || 0;
  const feeCents = amountCents > 0 ? CARD_LOAD_FEE_CENTS : 0;
  const reflectedCents = Math.max(amountCents - feeCents, 0);

  return {
    amountFormatted: formatMoneyFromDigitsAsCents(amountDigits),
    feeFormatted: formatMoneyFromDigitsAsCents(String(feeCents)),
    reflectedFormatted: formatMoneyFromDigitsAsCents(String(reflectedCents)),
  };
}
