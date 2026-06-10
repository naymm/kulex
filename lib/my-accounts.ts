import type { MyAccountId } from '@/constants/my-accounts';
import { getMyAccountById } from '@/constants/my-accounts';

export type MyAccountsTransferParams = {
  from: MyAccountId;
  to: MyAccountId;
  amount?: string;
};

export function myAccountsParamsToRoute(params: MyAccountsTransferParams): Record<string, string> {
  const route: Record<string, string> = {
    from: params.from,
    to: params.to,
  };
  if (params.amount) route.amount = params.amount;
  return route;
}

export function parseMyAccountsParams(
  raw: Record<string, string | string[] | undefined>
): MyAccountsTransferParams {
  const from =
    raw.from === 'agente' || raw.from === 'poupanca' ? raw.from : 'pessoal';
  const to =
    raw.to === 'pessoal' || raw.to === 'agente' || raw.to === 'poupanca' ? raw.to : 'agente';

  return {
    from,
    to,
    amount: typeof raw.amount === 'string' ? raw.amount : undefined,
  };
}

export function getTransferAccounts(params: MyAccountsTransferParams) {
  const fromAccount = getMyAccountById(params.from) ?? getMyAccountById('pessoal')!;
  const toAccount = getMyAccountById(params.to) ?? getMyAccountById('agente')!;
  return { fromAccount, toAccount };
}
