export type PaymentCategory = {
  id: string;
  title: string;
  description: string;
};

export const PAYMENT_CATEGORIES: PaymentCategory[] = [
  {
    id: 'referencia',
    title: 'Pagamento Por Referência',
    description:
      'Pague facturas, compras online e serviços usando uma referência bancária.',
  },
  {
    id: 'servicos',
    title: 'Serviços',
    description:
      'Carregamentos, pacotes de internet, televisão, eletricidade, água e outros serviços.',
  },
  {
    id: 'estado',
    title: 'Pagamento ao Estado',
    description:
      'Liquidação de impostos, taxas ministeriais e documentos através do RUPE',
  },
  {
    id: 'seguro',
    title: 'Seguros',
    description:
      'Adesão e Pagamento e renovação de apólices de seguro automóvel, saúde e vida.',
  },
];
