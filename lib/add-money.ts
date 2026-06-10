import { CARD_AOA_PER_USD, MCX_FEE_CENTS } from '@/constants/add-money';
import { formatMoneyFromDigitsAsCents } from '@/lib/money';

export function computeCardDiscountUsd(amountDigits: string) {
  const amountCents = Number(amountDigits) || 0;
  const amountAoa = amountCents / 100;
  const usd = amountAoa / CARD_AOA_PER_USD;
  return `${usd.toLocaleString('pt-PT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} USD`;
}

export function computeAddMoneySummary(amountDigits: string) {
  const amountCents = Number(amountDigits) || 0;
  const feeCents = amountCents > 0 ? MCX_FEE_CENTS : 0;
  const reflectedCents = Math.max(amountCents - feeCents, 0);

  return {
    amountFormatted: formatMoneyFromDigitsAsCents(amountDigits),
    feeFormatted: formatMoneyFromDigitsAsCents(String(feeCents)),
    reflectedFormatted: formatMoneyFromDigitsAsCents(String(reflectedCents)),
    amountFormattedWithKz: `${formatMoneyFromDigitsAsCents(amountDigits)} kz`,
  };
}
