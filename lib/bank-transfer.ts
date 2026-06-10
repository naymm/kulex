export type BankTransferParams = {
  bank: string;
  iban: string;
  titular: string;
  amount?: string;
};

export function bankParamsToRoute(params: BankTransferParams): Record<string, string> {
  const route: Record<string, string> = {
    method: 'banco',
    bank: params.bank,
    iban: params.iban,
    titular: params.titular,
  };
  if (params.amount) route.amount = params.amount;
  return route;
}

export function parseBankParams(
  raw: Record<string, string | string[] | undefined>,
): BankTransferParams {
  return {
    bank: typeof raw.bank === 'string' ? raw.bank : '',
    iban: typeof raw.iban === 'string' ? raw.iban : '',
    titular: typeof raw.titular === 'string' ? raw.titular : '',
    amount: typeof raw.amount === 'string' ? raw.amount : undefined,
  };
}
