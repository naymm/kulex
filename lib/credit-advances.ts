import { ADIANTAMENTO_CREDIT, ADIANTAMENTO_CREDIT_ID } from '@/constants/credit-line';
import { getAppDataStore, patchAppDataStore } from '@/lib/data-store';
import {
  createCreditAdvance,
  settleAllCreditAdvancesRemote,
  settleCreditAdvanceRemote,
} from '@/lib/api/credit';
import { formatMoneyAmount, parseMoneyAmount } from '@/lib/postpaid-bill';
import { isSupabaseConfigured } from '@/lib/supabase';

export type CreditAdvanceCategory =
  | 'servico'
  | 'referencia'
  | 'estado'
  | 'seguro'
  | 'qrcode';

export const CREDIT_ADVANCE_CATEGORY_LABELS: Record<CreditAdvanceCategory, string> = {
  servico: 'Pagamento de Serviço',
  referencia: 'Pagamento Por Referência',
  estado: 'Pagamento ao Estado',
  seguro: 'Seguro',
  qrcode: 'Pagamento QR Code',
};

export type CreditAdvance = {
  id: string;
  category: CreditAdvanceCategory;
  title: string;
  description: string;
  amount: number;
  amountFormatted: string;
  createdAt: string;
  dueDateLabel: string;
  dueIsoDate: string;
  settled: boolean;
};

export function getCreditAdvances(): CreditAdvance[] {
  return getAppDataStore().advances.filter((item) => !item.settled);
}

export function getCreditAdvanceById(id: string): CreditAdvance | null {
  return getCreditAdvances().find((item) => item.id === id) ?? null;
}

export function formatAdvanceCreatedLabel(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getAdvanceCategoryLabel(category: CreditAdvanceCategory): string {
  return CREDIT_ADVANCE_CATEGORY_LABELS[category];
}

export function getCreditAdvancesUsedTotal(): number {
  return getCreditAdvances().reduce((sum, item) => sum + item.amount, 0);
}

export function getCreditLineAvailable(): number {
  return Math.max(0, ADIANTAMENTO_CREDIT.limit - getCreditAdvancesUsedTotal());
}

export function getCreditLineAvailableFormatted(): string {
  return formatMoneyAmount(getCreditLineAvailable());
}

export function canPayWithCredit(amount: number): boolean {
  return amount > 0 && amount <= getCreditLineAvailable();
}

export async function registerCreditAdvance(
  accountId: string,
  input: {
    category: CreditAdvanceCategory;
    title: string;
    description: string;
    amount: number;
  },
): Promise<CreditAdvance> {
  if (!isSupabaseConfigured) {
    throw new Error('Backend não configurado');
  }

  const advance = await createCreditAdvance(accountId, {
    ...input,
    termDays: ADIANTAMENTO_CREDIT.termDays,
  });

  patchAppDataStore({
    advances: [advance, ...getAppDataStore().advances],
  });

  return advance;
}

export type AdvanceSettlementMode = 'single' | 'all';

export function getAdvanceSettlementAmount(
  mode: AdvanceSettlementMode,
  advanceId?: string,
): number {
  if (mode === 'all') {
    return getCreditAdvancesUsedTotal();
  }

  return getCreditAdvanceById(advanceId ?? '')?.amount ?? 0;
}

export function getAdvanceSettlementTitle(
  mode: AdvanceSettlementMode,
  advanceId?: string,
): string {
  if (mode === 'all') {
    const count = getCreditAdvances().length;
    return count === 1 ? 'Liquidar adiantamento' : `Liquidar ${count} adiantamentos`;
  }

  return getCreditAdvanceById(advanceId ?? '')?.title ?? 'Liquidar adiantamento';
}

export async function executeAdvanceSettlement(
  accountId: string,
  mode: AdvanceSettlementMode,
  advanceId?: string,
): Promise<{ success: boolean; settledCount: number }> {
  if (!isSupabaseConfigured) {
    return { success: false, settledCount: 0 };
  }

  if (mode === 'all') {
    const settledCount = await settleAllCreditAdvancesRemote(accountId);
    if (settledCount > 0) {
      patchAppDataStore({
        advances: getAppDataStore().advances.map((a) => ({ ...a, settled: true })),
      });
    }
    return { success: settledCount > 0, settledCount };
  }

  const success = await settleCreditAdvanceRemote(advanceId ?? '');
  if (success) {
    patchAppDataStore({
      advances: getAppDataStore().advances.map((a) =>
        a.id === advanceId ? { ...a, settled: true } : a,
      ),
    });
  }
  return { success, settledCount: success ? 1 : 0 };
}

export function parsePaymentAmountFromFields(input: {
  amount?: string;
  amountDigits?: string;
  value?: string;
  premium?: string;
}): number {
  if (input.amountDigits) {
    const cents = Number(input.amountDigits);
    if (Number.isFinite(cents) && cents > 0) {
      return cents / 100;
    }
  }

  if (input.amount) {
    const parsed = parseMoneyAmount(input.amount);
    if (parsed > 0) return parsed;
  }

  if (input.premium) {
    const parsed = parseMoneyAmount(input.premium.replace(/\s/g, ''));
    if (parsed > 0) return parsed;
  }

  if (input.value) {
    const matches = input.value.match(/(\d[\d.\s]*,\d{2})/g);
    if (matches?.length) {
      const last = matches[matches.length - 1].replace(/\s/g, '');
      const parsed = parseMoneyAmount(last);
      if (parsed > 0) return parsed;
    }
  }

  return 0;
}

export function isAdiantamentoCreditId(id: string): boolean {
  return id === ADIANTAMENTO_CREDIT_ID;
}
