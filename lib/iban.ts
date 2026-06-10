export const IBAN_PREFIX = 'AO06';
export const IBAN_MAX_DIGITS = 21;

export function parseIbanDigits(text: string) {
  return text.replace(/[^\d]/g, '').slice(0, IBAN_MAX_DIGITS);
}

export function formatIbanBody(digits: string) {
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

export function formatIbanDisplay(digits: string) {
  const body = formatIbanBody(parseIbanDigits(digits));
  return body ? `${IBAN_PREFIX} ${body}` : IBAN_PREFIX;
}
