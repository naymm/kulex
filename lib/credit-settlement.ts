import { getAccountById, parseAccountBalance } from '@/constants/accounts';
import {
  getAdvanceSettlementAmount,
  type AdvanceSettlementMode,
} from '@/lib/credit-advances';
import { formatMoneyAmount } from '@/lib/postpaid-bill';

export function validateAdvanceSettlement(
  mode: AdvanceSettlementMode,
  accountId: string,
  advanceId?: string,
): { valid: boolean; message?: string; amount: number; amountFormatted: string } {
  const amount = getAdvanceSettlementAmount(mode, advanceId);
  const amountFormatted = formatMoneyAmount(amount);

  if (amount <= 0) {
    return {
      valid: false,
      message: 'Não há adiantamentos por liquidar.',
      amount,
      amountFormatted,
    };
  }

  const account = getAccountById(accountId);
  const balance = parseAccountBalance(account.balance);

  if (balance < amount) {
    return {
      valid: false,
      message: `Saldo insuficiente na conta ${account.shortLabel}.`,
      amount,
      amountFormatted,
    };
  }

  return { valid: true, amount, amountFormatted };
}

export function amountToSettlementDigits(amount: number): string {
  return String(Math.round(amount * 100));
}
