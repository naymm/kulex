import {
  REMITTANCE_FEE_MODES,
  REMITTANCE_PAYOUT_LABELS,
  type IncomingRemittance,
  type OutgoingRemittance,
  type RemittanceCorridor,
  type RemittanceFeeMode,
  type RemittancePayoutMethod,
} from '@/constants/remessas';
import { getAppDataStore, patchAppDataStore } from '@/lib/data-store';
import { createOutgoingRemittance } from '@/lib/api/remessas';
import { formatMoneyAmount } from '@/lib/postpaid-bill';
import { isSupabaseConfigured } from '@/lib/supabase';

export function getCorridorById(id: string): RemittanceCorridor | undefined {
  return getAppDataStore().remittanceCorridors.find((item) => item.id === id);
}

export function getCorridorByCountryCode(code: string): RemittanceCorridor | undefined {
  return getAppDataStore().remittanceCorridors.find((item) => item.countryCode === code);
}

export function getPayoutLabel(method: RemittancePayoutMethod): string {
  return REMITTANCE_PAYOUT_LABELS[method];
}

export function formatRateLabel(corridor: RemittanceCorridor): string {
  return `1 ${corridor.currency} = ${formatMoneyAmount(corridor.rateAoaPerUnit)} kz`;
}

export function amountDigitsToAoa(digits: string): number {
  const cents = Number(digits);
  if (!Number.isFinite(cents) || cents <= 0) return 0;
  return cents / 100;
}

export function getFeeModeLabel(feeMode: RemittanceFeeMode): string {
  return REMITTANCE_FEE_MODES.find((item) => item.id === feeMode)?.title ?? '';
}

export function buildRemittanceSummary(
  amountDigits: string,
  corridorId: string,
  feeMode: RemittanceFeeMode = 'add',
): {
  valid: boolean;
  message?: string;
  feeMode: RemittanceFeeMode;
  feeModeLabel: string;
  amountAoa: number;
  netAmountAoa: number;
  amountFormatted: string;
  netAmountFormatted: string;
  feeFormatted: string;
  totalFormatted: string;
  foreignFormatted: string;
  foreignCurrency: string;
  rateLabel: string;
} {
  const corridor = getCorridorById(corridorId);
  const amountAoa = amountDigitsToAoa(amountDigits);
  const empty = {
    valid: false,
    feeMode,
    feeModeLabel: getFeeModeLabel(feeMode),
    amountAoa: 0,
    netAmountAoa: 0,
    amountFormatted: '0,00',
    netAmountFormatted: '0,00',
    feeFormatted: '0,00',
    totalFormatted: '0,00',
    foreignFormatted: '0,00',
    foreignCurrency: '',
    rateLabel: '',
  };

  if (!corridor) {
    return { ...empty, message: 'Destino inválido.' };
  }

  if (amountAoa <= 0) {
    return {
      ...empty,
      message: 'Indique o montante a enviar.',
      foreignCurrency: corridor.currency,
      rateLabel: formatRateLabel(corridor),
    };
  }

  const minLabel =
    feeMode === 'add'
      ? `Montante mínimo a enviar: AOA ${formatMoneyAmount(corridor.minAmountAoa)}.`
      : `Montante mínimo a debitar: AOA ${formatMoneyAmount(corridor.minAmountAoa)}.`;

  if (amountAoa < corridor.minAmountAoa) {
    return {
      ...empty,
      message: minLabel,
      foreignCurrency: corridor.currency,
      rateLabel: formatRateLabel(corridor),
    };
  }

  const feeRate = corridor.feePercent / 100;
  const fee = amountAoa * feeRate;

  let netAmountAoa: number;
  let totalDebited: number;
  let foreign: number;

  if (feeMode === 'deduct') {
    netAmountAoa = amountAoa - fee;
    totalDebited = amountAoa;
    foreign = netAmountAoa / corridor.rateAoaPerUnit;

    if (netAmountAoa <= 0) {
      return {
        ...empty,
        message: 'O montante é insuficiente para cobrir a taxa.',
        foreignCurrency: corridor.currency,
        rateLabel: formatRateLabel(corridor),
      };
    }
  } else {
    netAmountAoa = amountAoa;
    totalDebited = amountAoa + fee;
    foreign = amountAoa / corridor.rateAoaPerUnit;
  }

  return {
    valid: true,
    feeMode,
    feeModeLabel: getFeeModeLabel(feeMode),
    amountAoa,
    netAmountAoa,
    amountFormatted: formatMoneyAmount(amountAoa),
    netAmountFormatted: formatMoneyAmount(netAmountAoa),
    feeFormatted: formatMoneyAmount(fee),
    totalFormatted: formatMoneyAmount(totalDebited),
    foreignFormatted: formatMoneyAmount(foreign),
    foreignCurrency: corridor.currency,
    rateLabel: formatRateLabel(corridor),
  };
}

export function generateRemittanceTrackingRef(): string {
  const suffix = Math.floor(100000 + Math.random() * 900000);
  return `RMX-${new Date().getFullYear()}-${suffix}`;
}

export function getAllIncomingRemittances(): IncomingRemittance[] {
  return getAppDataStore().incomingRemittances;
}

export function getIncomingRemittanceById(id: string): IncomingRemittance | undefined {
  return getAllIncomingRemittances().find((item) => item.id === id);
}

export function getAllOutgoingRemittances(): OutgoingRemittance[] {
  return getAppDataStore().outgoingRemittances;
}

export function getOutgoingRemittanceById(id: string): OutgoingRemittance | undefined {
  return getAllOutgoingRemittances().find((item) => item.id === id);
}

export async function registerOutgoingRemittance(
  accountId: string,
  input: {
    beneficiaryName: string;
    corridorId: string;
    payoutMethod: RemittancePayoutMethod;
    amountDigits: string;
    trackingRef: string;
    feeMode?: RemittanceFeeMode;
  },
): Promise<void> {
  const corridor = getCorridorById(input.corridorId);
  if (!corridor) return;

  const summary = buildRemittanceSummary(
    input.amountDigits,
    input.corridorId,
    input.feeMode ?? 'add',
  );
  if (!summary.valid) return;

  const entry: OutgoingRemittance = {
    id: `out-${Date.now()}`,
    beneficiaryName: input.beneficiaryName,
    destinationCountry: corridor.countryName,
    destinationCountryCode: corridor.countryCode,
    corridorId: corridor.id,
    payoutMethod: input.payoutMethod,
    amountForeign: summary.foreignFormatted,
    currency: corridor.currency,
    totalDebitedAoa: summary.totalFormatted,
    feeAoa: summary.feeFormatted,
    feeMode: input.feeMode ?? 'add',
    status: 'em_processamento',
    dateLabel: new Date().toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    reference: input.trackingRef,
  };

  if (isSupabaseConfigured) {
    await createOutgoingRemittance(accountId, {
      beneficiaryName: input.beneficiaryName,
      corridorId: input.corridorId,
      payoutMethod: input.payoutMethod,
      amountForeignCents: Math.round(parseFloat(summary.foreignFormatted.replace(/\./g, '').replace(',', '.')) * 100),
      currency: corridor.currency,
      totalDebitedAoaCents: Math.round(summary.amountAoa * 100),
      feeAoaCents: Math.round(parseFloat(summary.feeFormatted.replace(/\./g, '').replace(',', '.')) * 100),
      feeMode: input.feeMode ?? 'add',
      reference: input.trackingRef,
    });
  }

  patchAppDataStore({
    outgoingRemittances: [entry, ...getAppDataStore().outgoingRemittances],
  });
}
