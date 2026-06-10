export type MovementType = 'credit' | 'debit';

export type MovementFilterType = 'todos' | 'debitos' | 'creditos';

export type Movement = {
  id: string;
  title: string;
  dateLabel: string;
  isoDate: string;
  amount: string;
  type: MovementType;
};

export const MOVEMENTS_INITIAL_COUNT = 20;
export const MOVEMENTS_LOAD_MORE_COUNT = 10;

const MOVEMENT_TEMPLATES: Omit<Movement, 'id'>[] = [
  {
    title: 'Desembolso - Maka Zero',
    dateLabel: 'Ontem, 23:47',
    isoDate: '2026-06-05',
    amount: '+ 44.000,00 kz',
    type: 'credit',
  },
  {
    title: 'Remessa',
    dateLabel: '22 Mai, 2026',
    isoDate: '2026-05-22',
    amount: '- 395.630,80 kz',
    type: 'debit',
  },
  {
    title: 'Carregamento Cartão',
    dateLabel: '19 Mai, 2026',
    isoDate: '2026-05-19',
    amount: '- 95.200,00 kz',
    type: 'debit',
  },
  {
    title: 'Pagamento Serviço',
    dateLabel: '10 Mai, 2026',
    isoDate: '2026-05-10',
    amount: '- 10.811,00 kz',
    type: 'debit',
  },
  {
    title: 'Remessa',
    dateLabel: '09 Mai, 2026',
    isoDate: '2026-05-09',
    amount: '+ 137.200,00 kz',
    type: 'credit',
  },
  {
    title: 'Transferência recebida',
    dateLabel: '08 Mai, 2026',
    isoDate: '2026-05-08',
    amount: '+ 25.500,00 kz',
    type: 'credit',
  },
  {
    title: 'Pagamento KWIK',
    dateLabel: '07 Mai, 2026',
    isoDate: '2026-05-07',
    amount: '- 4.250,00 kz',
    type: 'debit',
  },
  {
    title: 'Levantamento',
    dateLabel: '06 Mai, 2026',
    isoDate: '2026-05-06',
    amount: '- 50.000,00 kz',
    type: 'debit',
  },
  {
    title: 'Depósito Multicaixa',
    dateLabel: '05 Mai, 2026',
    isoDate: '2026-05-05',
    amount: '+ 120.000,00 kz',
    type: 'credit',
  },
  {
    title: 'Pagamento Serviço',
    dateLabel: '04 Mai, 2026',
    isoDate: '2026-05-04',
    amount: '- 8.900,00 kz',
    type: 'debit',
  },
];

function padAmount(value: number, type: MovementType) {
  const formatted = value.toLocaleString('pt-PT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${type === 'credit' ? '+' : '-'} ${formatted} kz`;
}

function buildMovements(total: number): Movement[] {
  return Array.from({ length: total }, (_, index) => {
    const template = MOVEMENT_TEMPLATES[index % MOVEMENT_TEMPLATES.length];
    const day = Math.max(1, 30 - index);
    const month = index < 10 ? 5 : 4;
    const isoDate = `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const amountValue = 5000 + (index % 7) * 3750.5;

    return {
      id: String(index + 1),
      title: index < MOVEMENT_TEMPLATES.length ? template.title : `${template.title} ${index + 1}`,
      dateLabel:
        index === 0
          ? template.dateLabel
          : `${String(day).padStart(2, '0')} ${month === 5 ? 'Mai' : 'Abr'}, 2026`,
      isoDate: index < MOVEMENT_TEMPLATES.length ? template.isoDate : isoDate,
      amount:
        index < MOVEMENT_TEMPLATES.length
          ? template.amount
          : padAmount(amountValue, template.type),
      type: template.type,
    };
  });
}

export const MOVEMENTS: Movement[] = buildMovements(30);

export function filterMovements(
  items: Movement[],
  typeFilter: MovementFilterType,
  dateFrom: string,
  dateTo: string
) {
  return items.filter((item) => {
    if (typeFilter === 'debitos' && item.type !== 'debit') return false;
    if (typeFilter === 'creditos' && item.type !== 'credit') return false;

    if (dateFrom && item.isoDate < dateFrom) return false;
    if (dateTo && item.isoDate > dateTo) return false;

    return true;
  });
}
