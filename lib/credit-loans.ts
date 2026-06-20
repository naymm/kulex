import { ADIANTAMENTO_CREDIT, ADIANTAMENTO_CREDIT_ID } from '@/constants/credit-line';
import { getAppDataStore } from '@/lib/data-store';
import { formatMoneyAmount } from '@/lib/postpaid-bill';

export type MeusCreditosItem = {
  id: string;
  productTitle: string;
  title: string;
  prazo: string;
  emFalta: string;
  progress: number;
  showChevron?: boolean;
  kind: 'loan' | 'adiantamento';
};

export function getMeusCreditosItems(): MeusCreditosItem[] {
  const { loans, advances } = getAppDataStore();
  const items = [...loans];

  const used = advances.filter((a) => !a.settled).reduce((sum, a) => sum + a.amount, 0);
  if (used > 0) {
    const nextDue = advances[0]?.dueDateLabel ?? '—';
    const progress = Math.min(1, used / ADIANTAMENTO_CREDIT.limit);

    items.unshift({
      id: ADIANTAMENTO_CREDIT_ID,
      kind: 'adiantamento',
      productTitle: ADIANTAMENTO_CREDIT.productTitle,
      title: `${ADIANTAMENTO_CREDIT.title} – ${formatMoneyAmount(used)} kz`,
      prazo: `Próximo vencimento: ${nextDue}`,
      emFalta: `Em falta: ${formatMoneyAmount(used)} kz`,
      progress,
      showChevron: true,
    });
  }

  return items;
}

export function isAdiantamentoCreditId(id: string): boolean {
  return id === ADIANTAMENTO_CREDIT_ID;
}
