export const CARD_MAX_DIGITS = 16;

export function parseCardDigits(text: string) {
  return text.replace(/[^\d]/g, '').slice(0, CARD_MAX_DIGITS);
}

export function formatCardNumber(digits: string) {
  return parseCardDigits(digits).replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

export function parseExpiryDigits(text: string) {
  return text.replace(/[^\d]/g, '').slice(0, 4);
}

export function formatExpiry(digits: string) {
  const value = parseExpiryDigits(digits);
  if (value.length <= 2) return value;
  return `${value.slice(0, 2)}/${value.slice(2)}`;
}

export function parseCvc(text: string) {
  return text.replace(/[^\d]/g, '').slice(0, 3);
}
