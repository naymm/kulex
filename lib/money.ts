export function normalizeDigits(text: string) {
  return text.replace(/[^\d]/g, '').slice(0, 12);
}

export function formatMoneyFromDigitsAsCents(digits: string) {
  if (!digits) return '0';
  const cents = Number(digits);
  if (!Number.isFinite(cents)) return '0';
  return (cents / 100).toLocaleString('pt-PT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatMoneyShortFromDigitsAsCents(digits: string) {
  if (!digits) return '0';
  const cents = Number(digits);
  if (!Number.isFinite(cents)) return '0';
  const value = cents / 100;
  if (Number.isInteger(value)) {
    return value.toLocaleString('pt-PT', { maximumFractionDigits: 0 });
  }
  return value.toLocaleString('pt-PT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
