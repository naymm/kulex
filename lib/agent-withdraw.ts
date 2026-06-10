import { computeWithdrawSummary } from '@/lib/withdraw';

export const WITHDRAW_REFERENCE_LENGTH = 9;
export const WITHDRAW_CLIENT_PIN_LENGTH = 3;
export const AGENT_CASH_OUT_COMMISSION_CENTS = 50000; // 500,00 kz
const DEFAULT_AMOUNT_DIGITS = '1500000';

const WITHDRAW_AMOUNTS: Record<string, string> = {
  '145678217': '1500000',
  '238901456': '850000',
  '367812345': '325080',
};

export function normalizeWithdrawReference(digits: string): string {
  return digits.replace(/\D/g, '').slice(0, WITHDRAW_REFERENCE_LENGTH);
}

export function formatWithdrawReference(digits: string): string {
  const reference = normalizeWithdrawReference(digits);
  if (reference.length <= 3) return reference;
  if (reference.length <= 6) return `${reference.slice(0, 3)} ${reference.slice(3)}`;
  return `${reference.slice(0, 3)} ${reference.slice(3, 6)} ${reference.slice(6)}`;
}

export function isWithdrawReferenceComplete(digits: string): boolean {
  return normalizeWithdrawReference(digits).length === WITHDRAW_REFERENCE_LENGTH;
}

export function isWithdrawClientPinComplete(pin: string): boolean {
  return pin.replace(/\D/g, '').length === WITHDRAW_CLIENT_PIN_LENGTH;
}

export type AgentWithdrawSummary = {
  reference: string;
  referenceFormatted: string;
  amountDigits: string;
  amountFormatted: string;
  feeFormatted: string;
  commissionFormatted: string;
};

export function buildAgentWithdrawSummary(
  referenceDigits: string,
  pin: string,
): AgentWithdrawSummary | null {
  const reference = normalizeWithdrawReference(referenceDigits);
  const clientPin = pin.replace(/\D/g, '');
  if (!isWithdrawReferenceComplete(reference) || clientPin.length !== WITHDRAW_CLIENT_PIN_LENGTH) {
    return null;
  }

  const amountDigits = WITHDRAW_AMOUNTS[reference] ?? DEFAULT_AMOUNT_DIGITS;
  const fees = computeWithdrawSummary(amountDigits);

  return {
    reference,
    referenceFormatted: formatWithdrawReference(reference),
    amountDigits,
    amountFormatted: fees.amountFormatted,
    feeFormatted: fees.feeFormatted,
    commissionFormatted: '500,00',
  };
}
