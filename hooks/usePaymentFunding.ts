import { useMemo, useState } from 'react';
import { useActiveAccount } from '@/contexts/AccountContext';
import {
  validatePaymentFunding,
  type PaymentFundingSource,
} from '@/lib/payment-source';

export function usePaymentFunding(amount: number) {
  const { activeAccountId } = useActiveAccount();
  const [fundingSource, setFundingSource] = useState<PaymentFundingSource>('balance');
  const [accountId, setAccountId] = useState(activeAccountId);

  const validation = useMemo(
    () => validatePaymentFunding(fundingSource, amount, accountId),
    [amount, accountId, fundingSource],
  );

  const fundingParams = useMemo(
    () => ({
      paymentSource: fundingSource,
      accountId: fundingSource === 'balance' ? accountId : '',
    }),
    [accountId, fundingSource],
  );

  return {
    fundingSource,
    setFundingSource,
    accountId,
    setAccountId,
    validation,
    canContinue: validation.valid,
    fundingParams,
  };
}
