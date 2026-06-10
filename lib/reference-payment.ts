import { formatMoneyFromDigitsAsCents } from '@/lib/money';

export const REFERENCE_ENTITY_LENGTH = 5;
export const REFERENCE_NUMBER_LENGTH = 9;
export const DEFAULT_ENTITY_NAME = 'Kulex Serviços';

export const PAYMENT_ENTITIES: Record<string, string> = {
  '04041': 'Kulex Serviços',
  '00623': 'Unitel',
  '00945': 'ENDE',
  '00123': 'EPAL',
  '00333': 'ZAP Fibra',
};

export function formatReferenceEntityInput(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, REFERENCE_ENTITY_LENGTH);
}

export function formatReferenceNumberInput(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, REFERENCE_NUMBER_LENGTH);
}

export function getPaymentEntityName(entityDigits: string): string {
  if (entityDigits.length < REFERENCE_ENTITY_LENGTH) {
    return '';
  }

  return PAYMENT_ENTITIES[entityDigits] ?? DEFAULT_ENTITY_NAME;
}

export function formatReferenceEntityDisplay(entityDigits: string): string {
  if (entityDigits.length < REFERENCE_ENTITY_LENGTH) {
    return entityDigits;
  }

  return `${entityDigits} - ${getPaymentEntityName(entityDigits)}`;
}

export function isReferenceEntityComplete(entityDigits: string): boolean {
  return entityDigits.length === REFERENCE_ENTITY_LENGTH;
}

export function isReferenceNumberComplete(referenceDigits: string): boolean {
  return referenceDigits.length === REFERENCE_NUMBER_LENGTH;
}

export function isValidReferencePaymentForm(
  entityDigits: string,
  referenceDigits: string,
  amountDigits: string,
): boolean {
  const amount = Number(amountDigits);
  return (
    isReferenceEntityComplete(entityDigits) &&
    isReferenceNumberComplete(referenceDigits) &&
    Number.isFinite(amount) &&
    amount > 0
  );
}

export function getReferenceAmountLabel(amountDigits: string): string {
  return formatMoneyFromDigitsAsCents(amountDigits || '0');
}

export function buildReferencePaymentSummary(
  entityDigits: string,
  referenceDigits: string,
  amountDigits: string,
) {
  const entityName = getPaymentEntityName(entityDigits);
  return {
    entityLabel: `${entityDigits} - ${entityName}`,
    reference: referenceDigits,
    amount: getReferenceAmountLabel(amountDigits),
  };
}
