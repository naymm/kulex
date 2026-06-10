import type { RemittanceFeeMode, RemittancePayoutMethod } from '@/constants/remessas';

export type RemessaRouteParams = {
  corridorId?: string;
  payoutMethod?: RemittancePayoutMethod;
  feeMode?: RemittanceFeeMode;
  beneficiaryName?: string;
  beneficiaryPhone?: string;
  beneficiaryAccount?: string;
  beneficiaryBank?: string;
  amountDigits?: string;
  trackingRef?: string;
  from?: string;
};

export function parseRemessaParams(
  raw: Record<string, string | string[] | undefined>,
): RemessaRouteParams {
  const pick = (key: keyof RemessaRouteParams) => {
    const value = raw[key];
    if (value === undefined) return undefined;
    return Array.isArray(value) ? value[0] : value;
  };

  return {
    corridorId: pick('corridorId'),
    payoutMethod: pick('payoutMethod') as RemittancePayoutMethod | undefined,
    feeMode: (pick('feeMode') as RemittanceFeeMode | undefined) ?? 'add',
    beneficiaryName: pick('beneficiaryName'),
    beneficiaryPhone: pick('beneficiaryPhone'),
    beneficiaryAccount: pick('beneficiaryAccount'),
    beneficiaryBank: pick('beneficiaryBank'),
    amountDigits: pick('amountDigits'),
    trackingRef: pick('trackingRef'),
    from: pick('from'),
  };
}

export function remessaParamsToRoute(params: RemessaRouteParams): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value) result[key] = value;
  }

  return result;
}
