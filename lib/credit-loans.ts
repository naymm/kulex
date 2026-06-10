import { ADIANTAMENTO_CREDIT, ADIANTAMENTO_CREDIT_ID } from '@/constants/credit-line';
import { getCreditAdvances, getCreditAdvancesUsedTotal } from '@/lib/credit-advances';
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

const BASE_LOANS: MeusCreditosItem[] = [
  {
    id: 'maka-zero',
    kind: 'loan',
    productTitle: 'Maka Zero',
    title: 'Maka Zero – 50.000,00 kz',
    prazo: 'Prazo: 23/07/2026',
    emFalta: 'Em falta: 25.000,00 kz',
    progress: 0.55,
  },
  {
    id: 'empreendedor',
    kind: 'loan',
    productTitle: 'Empreendedor',
    title: 'Empreendedor – 650.000,00 kz',
    prazo: 'Prazo: 12/04/2027',
    emFalta: 'Em falta: 455.000,00 kz',
    progress: 0.32,
    showChevron: true,
  },
];

export function getMeusCreditosItems(): MeusCreditosItem[] {
  const used = getCreditAdvancesUsedTotal();
  const items = [...BASE_LOANS];

  if (used > 0) {
    const advances = getCreditAdvances();
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
