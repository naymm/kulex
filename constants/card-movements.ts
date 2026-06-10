import type { Movement } from '@/constants/movimentos';
import { MOVEMENTS } from '@/constants/movimentos';

function isCardMovement(movement: Movement) {
  const title = movement.title.toLowerCase();
  return (
    title.includes('cartão') ||
    title.includes('cartao') ||
    title.includes('kwik') ||
    title.includes('pagamento')
  );
}

export const ALL_CARD_MOVEMENTS = MOVEMENTS.filter(isCardMovement);

export const CARD_MOVEMENTS = ALL_CARD_MOVEMENTS.slice(0, 5);
