import { ADIANTAMENTO_CREDIT } from '@/constants/credit-line';
import { formatMoneyAmount, parseMoneyAmount } from '@/lib/postpaid-bill';

export type CreditAdvanceCategory = 'servico' | 'referencia' | 'estado' | 'seguro';

export const CREDIT_ADVANCE_CATEGORY_LABELS: Record<CreditAdvanceCategory, string> = {
  servico: 'Pagamento de Serviço',
  referencia: 'Pagamento Por Referência',
  estado: 'Pagamento ao Estado',
  seguro: 'Seguro',
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

let advances: CreditAdvance[] = [];

function formatDueDate(date: Date): { label: string; iso: string } {
  const iso = date.toISOString().slice(0, 10);
  const label = date.toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  return { label, iso };
}

export function getCreditAdvances(): CreditAdvance[] {
  return advances.filter((item) => !item.settled).map((item) => ({ ...item }));
}

export function getCreditAdvanceById(id: string): CreditAdvance | null {
  const advance = advances.find((item) => item.id === id && !item.settled);
  return advance ? { ...advance } : null;
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

export function registerCreditAdvance(input: {
  category: CreditAdvanceCategory;
  title: string;
  description: string;
  amount: number;
}): CreditAdvance {
  const due = new Date();
  due.setDate(due.getDate() + ADIANTAMENTO_CREDIT.termDays);
  const { label, iso } = formatDueDate(due);

  const advance: CreditAdvance = {
    id: `advance-${Date.now()}`,
    category: input.category,
    title: input.title,
    description: input.description,
    amount: input.amount,
    amountFormatted: formatMoneyAmount(input.amount),
    createdAt: new Date().toISOString(),
    dueDateLabel: label,
    dueIsoDate: iso,
    settled: false,
  };

  advances = [advance, ...advances];
  return advance;
}

export function resetCreditAdvances(): void {
  advances = [];
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

export function settleCreditAdvance(id: string): boolean {
  const exists = advances.some((item) => item.id === id && !item.settled);
  if (!exists) return false;

  advances = advances.map((item) =>
    item.id === id ? { ...item, settled: true } : item,
  );
  return true;
}

export function settleAllCreditAdvances(): number {
  const pending = getCreditAdvances();
  if (pending.length === 0) return 0;

  const pendingIds = new Set(pending.map((item) => item.id));
  advances = advances.map((item) =>
    pendingIds.has(item.id) ? { ...item, settled: true } : item,
  );
  return pending.length;
}

export function executeAdvanceSettlement(
  mode: AdvanceSettlementMode,
  advanceId?: string,
): { success: boolean; settledCount: number } {
  if (mode === 'all') {
    const settledCount = settleAllCreditAdvances();
    return { success: settledCount > 0, settledCount };
  }

  const success = settleCreditAdvance(advanceId ?? '');
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
