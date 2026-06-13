export type SpendingCategorySlice = {
  id: string;
  label: string;
  amount: number;
  amountLabel: string;
  color: string;
  percent: number;
};

export type SpendingChartSummary = {
  monthLabel: string;
  totalLabel: string;
  categories: SpendingCategorySlice[];
};

export const BUSINESS_SPENDING_SUMMARY: SpendingChartSummary = {
  monthLabel: 'Junho 2026',
  totalLabel: '685.450,00 kz',
  categories: [
    {
      id: 'stock',
      label: 'Stock e fornecedores',
      amount: 320_000,
      amountLabel: '320.000,00 kz',
      color: '#1A1A4E',
      percent: 47,
    },
    {
      id: 'salarios',
      label: 'Salários',
      amount: 185_000,
      amountLabel: '185.000,00 kz',
      color: '#2FB7A9',
      percent: 27,
    },
    {
      id: 'servicos',
      label: 'Serviços',
      amount: 128_450,
      amountLabel: '128.450,00 kz',
      color: '#F59E0B',
      percent: 19,
    },
    {
      id: 'renda',
      label: 'Renda e instalações',
      amount: 52_000,
      amountLabel: '52.000,00 kz',
      color: '#8B5CF6',
      percent: 7,
    },
  ],
};

export const PERSONAL_SPENDING_SUMMARY: SpendingChartSummary = {
  monthLabel: 'Junho 2026',
  totalLabel: '562.891,00 kz',
  categories: [
    {
      id: 'remessas',
      label: 'Remessas',
      amount: 395_630,
      amountLabel: '395.630,80 kz',
      color: '#1A1A4E',
      percent: 42,
    },
    {
      id: 'cartoes',
      label: 'Cartões',
      amount: 95_200,
      amountLabel: '95.200,00 kz',
      color: '#2FB7A9',
      percent: 17,
    },
    {
      id: 'transferencias',
      label: 'Transferências',
      amount: 54_250,
      amountLabel: '54.250,00 kz',
      color: '#F59E0B',
      percent: 10,
    },
    {
      id: 'servicos',
      label: 'Serviços',
      amount: 10_811,
      amountLabel: '10.811,00 kz',
      color: '#8B5CF6',
      percent: 2,
    },
    {
      id: 'outros',
      label: 'Outros',
      amount: 7_000,
      amountLabel: '7.000,00 kz',
      color: '#9CA3AF',
      percent: 1,
    },
  ],
};
