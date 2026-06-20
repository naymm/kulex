import {
  parsePaymentAmountFromFields,
  registerCreditAdvance,
  type CreditAdvanceCategory,
} from '@/lib/credit-advances';
import type { PaymentFundingSource } from '@/lib/payment-source';

export async function finalizeCreditPaymentIfNeeded(
  accountId: string,
  input: {
    paymentSource?: string;
    amount?: string;
    amountDigits?: string;
    value?: string;
    premium?: string;
    title: string;
    description: string;
    category: CreditAdvanceCategory;
  },
): Promise<void> {
  if (input.paymentSource !== 'credit') return;

  const amount = parsePaymentAmountFromFields({
    amount: input.amount,
    amountDigits: input.amountDigits,
    value: input.value,
    premium: input.premium,
  });

  if (amount <= 0) return;

  await registerCreditAdvance(accountId, {
    category: input.category,
    title: input.title,
    description: input.description,
    amount,
  });
}

export function isCreditPayment(paymentSource?: string): paymentSource is PaymentFundingSource {
  return paymentSource === 'credit';
}
