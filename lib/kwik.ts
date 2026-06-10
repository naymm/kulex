import type { KwikKeyType } from '@/constants/kwik';

export function parsePhoneDigits(text: string) {
  return text.replace(/[^\d]/g, '').slice(0, 9);
}

export function formatPhoneDisplay(digits: string) {
  const clean = parsePhoneDigits(digits);
  if (clean.length <= 3) return clean;
  if (clean.length <= 6) return `${clean.slice(0, 3)} ${clean.slice(3)}`;
  return `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6)}`;
}

export function formatKwikKeyDisplay(keyType: KwikKeyType, value: string) {
  if (keyType === 'telemovel') return formatPhoneDisplay(value);
  return value;
}

export type KwikTransferParams = {
  keyType: KwikKeyType;
  beneficiary: string;
  kwikKey: string;
  personalDesc: string;
  destDesc: string;
  amount?: string;
};

export function kwikParamsToRoute(params: KwikTransferParams): Record<string, string> {
  const route: Record<string, string> = {
    keyType: params.keyType,
    beneficiary: params.beneficiary,
    kwikKey: params.kwikKey,
    personalDesc: params.personalDesc,
    destDesc: params.destDesc,
  };
  if (params.amount) route.amount = params.amount;
  return route;
}

export function parseKwikParams(raw: Record<string, string | string[] | undefined>): KwikTransferParams {
  const keyType: KwikKeyType = raw.keyType === 'email' ? 'email' : 'telemovel';
  return {
    keyType,
    beneficiary: typeof raw.beneficiary === 'string' ? raw.beneficiary : '',
    kwikKey: typeof raw.kwikKey === 'string' ? raw.kwikKey : '',
    personalDesc: typeof raw.personalDesc === 'string' ? raw.personalDesc : '',
    destDesc: typeof raw.destDesc === 'string' ? raw.destDesc : '',
    amount: typeof raw.amount === 'string' ? raw.amount : undefined,
  };
}
