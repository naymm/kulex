import {
  formatPlafondAmount,
  getCardProductById,
  type PostpaidCardTierId,
} from '@/constants/postpaid-card';
import { formatMoneyAmount, parseMoneyAmount } from '@/lib/postpaid-bill';

export type PlafondRange = {
  min: string;
  max: string;
  rangeLabel: string;
};

export function getPlafondRangeForTier(tierId: PostpaidCardTierId): PlafondRange {
  const product = getCardProductById(tierId);
  return {
    min: formatPlafondAmount(product.minPlafond),
    max: formatPlafondAmount(product.maxPlafond),
    rangeLabel: product.rangeLabel,
  };
}

export function validateNewPlafond(
  tierId: PostpaidCardTierId,
  currentPlafond: string,
  newPlafond: string,
): { valid: boolean; message?: string } {
  const product = getCardProductById(tierId);
  const current = parseMoneyAmount(currentPlafond);
  const requested = parseMoneyAmount(newPlafond);

  if (!requested || requested <= 0) {
    return { valid: false, message: 'Indique o novo valor do plafond.' };
  }

  if (requested <= current) {
    return { valid: false, message: 'O novo plafond deve ser superior ao actual.' };
  }

  if (requested < product.minPlafond) {
    return {
      valid: false,
      message: `O mínimo permitido é AOA ${formatPlafondAmount(product.minPlafond)}.`,
    };
  }

  if (requested > product.maxPlafond) {
    return {
      valid: false,
      message: `O máximo permitido é AOA ${formatPlafondAmount(product.maxPlafond)}.`,
    };
  }

  return { valid: true };
}

export function applyPlafondIncrease(
  currentPlafond: string,
  currentAvailable: string,
  newPlafond: string,
): { plafond: string; available: string } {
  const delta = parseMoneyAmount(newPlafond) - parseMoneyAmount(currentPlafond);

  return {
    plafond: newPlafond,
    available: formatMoneyAmount(parseMoneyAmount(currentAvailable) + delta),
  };
}

export function isPlafondAtMaximum(tierId: PostpaidCardTierId, currentPlafond: string): boolean {
  const product = getCardProductById(tierId);
  return parseMoneyAmount(currentPlafond) >= product.maxPlafond;
}
