import { formatMoneyFromDigitsAsCents } from '@/lib/money';

export function computeWithdrawSummary(amountDigits: string) {
  const amountCents = Number(amountDigits) || 0;
  const feeCents = Math.round(amountCents * 0.1);
  const reflectedCents = Math.max(amountCents - feeCents, 0);

  return {
    amountFormatted: formatMoneyFromDigitsAsCents(amountDigits),
    feeFormatted: formatMoneyFromDigitsAsCents(String(feeCents)),
    reflectedFormatted: formatMoneyFromDigitsAsCents(String(reflectedCents)),
    amountFormattedWithKz: `${formatMoneyFromDigitsAsCents(amountDigits)} kz`,
  };
}
