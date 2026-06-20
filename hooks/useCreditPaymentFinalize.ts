import { useCallback } from 'react';
import type { CreditAdvanceCategory } from '@/lib/credit-advances';
import { useActiveAccount } from '@/contexts/AccountContext';
import { finalizeCreditPaymentIfNeeded } from '@/lib/payment-completion';

export function useCreditPaymentFinalize() {
  const { activeAccountId } = useActiveAccount();

  return useCallback(
    (input: {
      paymentSource?: string;
      amount?: string;
      amountDigits?: string;
      value?: string;
      premium?: string;
      title: string;
      description: string;
      category: CreditAdvanceCategory;
    }) => {
      if (!activeAccountId) return;
      void finalizeCreditPaymentIfNeeded(activeAccountId, input);
    },
    [activeAccountId],
  );
}
