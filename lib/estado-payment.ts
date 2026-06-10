import { formatMoneyFromDigitsAsCents } from '@/lib/money';

export const ESTADO_REFERENCE_LENGTH = 20;

export function formatEstadoReferenceInput(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, ESTADO_REFERENCE_LENGTH);
}

export function formatEstadoReferenceDisplay(digits: string): string {
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

export function isValidEstadoPayment(referenceDigits: string, amountDigits: string): boolean {
  const amount = Number(amountDigits);
  return (
    referenceDigits.length === ESTADO_REFERENCE_LENGTH &&
    Number.isFinite(amount) &&
    amount > 0
  );
}

export function getEstadoAmountLabel(amountDigits: string): string {
  return formatMoneyFromDigitsAsCents(amountDigits || '0');
}
