export const POSTPAID_MINIMUM_PAYMENT_PERCENT = 3;

export type PostpaidBillPaymentType = 'total' | 'minimum' | 'custom';

export function parseMoneyAmount(value: string): number {
  const normalized = value.replace(/\./g, '').replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatMoneyAmount(value: number): string {
  const [intPart, decPart] = value.toFixed(2).split('.');
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${grouped},${decPart}`;
}

export function computePostpaidUsedAmount(plafond: string, available: string): string {
  const used = Math.max(0, parseMoneyAmount(plafond) - parseMoneyAmount(available));
  return formatMoneyAmount(used);
}

export function computeMinimumPaymentAmount(
  usedFormatted: string,
  minimumPercent = POSTPAID_MINIMUM_PAYMENT_PERCENT,
): string {
  const used = parseMoneyAmount(usedFormatted);
  return formatMoneyAmount(used * (minimumPercent / 100));
}

export function moneyAmountToDigits(formatted: string): string {
  const cents = Math.round(parseMoneyAmount(formatted) * 100);
  return String(cents);
}

export function digitsToMoneyFormatted(digits: string): string {
  const cents = Number(digits);
  if (!Number.isFinite(cents) || cents <= 0) return '0,00';
  return formatMoneyAmount(cents / 100);
}

export type BillPaymentBounds = {
  usedAmount: string;
  minimumAmount: string;
  usedDigits: string;
  minimumDigits: string;
  hasDebt: boolean;
};

export function buildPostpaidBillSummary(plafond: string, available: string): BillPaymentBounds {
  const usedAmount = computePostpaidUsedAmount(plafond, available);
  const minimumAmount = computeMinimumPaymentAmount(usedAmount);

  return {
    usedAmount,
    minimumAmount,
    usedDigits: moneyAmountToDigits(usedAmount),
    minimumDigits: moneyAmountToDigits(minimumAmount),
    hasDebt: parseMoneyAmount(usedAmount) > 0,
  };
}

export function getBillPaymentBounds(plafond: string, available: string): BillPaymentBounds {
  return buildPostpaidBillSummary(plafond, available);
}

export function validateBillPaymentAmount(
  amountFormatted: string,
  plafond: string,
  available: string,
): { valid: boolean; message?: string } {
  const bounds = getBillPaymentBounds(plafond, available);
  const amount = parseMoneyAmount(amountFormatted);
  const minimum = parseMoneyAmount(bounds.minimumAmount);
  const maximum = parseMoneyAmount(bounds.usedAmount);

  if (amount <= 0) {
    return { valid: false, message: 'Indique o valor a pagar.' };
  }

  if (amount < minimum) {
    return {
      valid: false,
      message: `O valor mínimo é AOA ${bounds.minimumAmount} (${POSTPAID_MINIMUM_PAYMENT_PERCENT}% da dívida).`,
    };
  }

  if (amount > maximum) {
    return {
      valid: false,
      message: `O valor máximo é AOA ${bounds.usedAmount} (total em dívida).`,
    };
  }

  return { valid: true };
}

export function getBillPaymentLabel(
  amountFormatted: string,
  plafond: string,
  available: string,
): string {
  const bounds = getBillPaymentBounds(plafond, available);
  const amount = parseMoneyAmount(amountFormatted);
  const minimum = parseMoneyAmount(bounds.minimumAmount);
  const maximum = parseMoneyAmount(bounds.usedAmount);

  if (amount >= maximum) return 'Valor total da fatura';
  if (amount <= minimum) return 'Pagamento mínimo';
  return 'Pagamento parcial';
}

export function getPaymentAmount(
  paymentType: PostpaidBillPaymentType,
  plafond: string,
  available: string,
): { amountFormatted: string; amountDigits: string } {
  const summary = buildPostpaidBillSummary(plafond, available);
  const amountFormatted =
    paymentType === 'minimum' ? summary.minimumAmount : summary.usedAmount;
  const amountDigits =
    paymentType === 'minimum' ? summary.minimumDigits : summary.usedDigits;

  return { amountFormatted, amountDigits };
}

export function getPaymentAmountFromDigits(amountDigits: string): {
  amountFormatted: string;
  amountDigits: string;
} {
  return {
    amountFormatted: digitsToMoneyFormatted(amountDigits),
    amountDigits,
  };
}
