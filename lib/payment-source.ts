import { getAccountById, parseAccountBalance } from '@/constants/accounts';
import { ADIANTAMENTO_CREDIT } from '@/constants/credit-line';
import { canPayWithCredit, getCreditLineAvailableFormatted } from '@/lib/credit-advances';
import { formatMoneyAmount } from '@/lib/postpaid-bill';

export type PaymentFundingSource = 'balance' | 'credit';

export function getPaymentFundingSourceLabel(
  source: PaymentFundingSource,
  accountId?: string,
): string {
  if (source === 'credit') {
    return ADIANTAMENTO_CREDIT.title;
  }

  const account = getAccountById(accountId ?? '');
  return `Conta ${account.shortLabel}`;
}

export function validatePaymentFunding(
  source: PaymentFundingSource,
  amount: number,
  accountId?: string,
): { valid: boolean; message?: string } {
  if (!amount || amount <= 0) {
    return { valid: false, message: 'Montante inválido para pagamento.' };
  }

  if (source === 'credit') {
    if (!canPayWithCredit(amount)) {
      return {
        valid: false,
        message: `Limite de adiantamento insuficiente. Disponível: AOA ${getCreditLineAvailableFormatted()}.`,
      };
    }
    return { valid: true };
  }

  const account = getAccountById(accountId ?? '');
  const balance = parseAccountBalance(account.balance);
  if (balance < amount) {
    return {
      valid: false,
      message: `Saldo insuficiente na conta ${account.shortLabel}.`,
    };
  }

  return { valid: true };
}

export function formatPaymentAmountLabel(amount: number): string {
  return `AOA ${formatMoneyAmount(amount)}`;
}
