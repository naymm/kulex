import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export type BusinessType = 'individual' | 'company';
export type InvoiceType = 'simplified' | 'normal';
export type VatRegime = 'general' | 'reduced' | 'exempt';

export const INVOICE_TYPES: {
  id: InvoiceType;
  label: string;
  description: string;
}[] = [
  {
    id: 'simplified',
    label: 'Factura simplificada',
    description: 'Isenta de IVA · limite 300/ano',
  },
  {
    id: 'normal',
    label: 'Factura normal',
    description: 'Com IVA · regime geral, reduzido ou isento',
  },
];

export const INVOICE_CLIENTS = [
  { id: 'c1', name: 'Distribuidora ABC', email: 'compras@abc.ao' },
  { id: 'c2', name: 'Hotel Talatona', email: 'financeiro@hoteltalatona.ao' },
  { id: 'c3', name: 'Cliente balcão', email: '' },
  { id: 'c4', name: 'Supermercado Kimbango', email: 'contas@kimbango.ao' },
];
export type BusinessNotificationKind =
  | 'invoice_pending'
  | 'employee_limit'
  | 'stock_credit_renewed';

export const BUSINESS_PROFILE = {
  companyName: 'Kulex Negócios Lda',
  tradeName: 'Kulex Store Luanda',
  location: 'Talatona, Luanda',
  nif: '5417890123',
  businessType: 'company' as BusinessType,
  kybStatus: 'Verificado',
  simplifiedInvoicesUsed: 42,
  simplifiedInvoicesLimit: 300,
};

export const BUSINESS_MONTHLY_SUMMARY = {
  monthLabel: 'Junho 2026',
  totalReceived: '3.850.420,00 kz',
  transactionCount: 284,
  invoicesIssued: 56,
};

export const BUSINESS_STOCK_CREDIT = {
  id: 'stock',
  label: 'Crédito de stock',
  preApprovedLimit: '2.000.000,00 kz',
  available: '1.450.000,00 kz',
  used: '550.000,00 kz',
  tan: '24% a.a.',
  termDays: 60,
  nextRenewal: '15 Jul 2026',
  status: 'Pré-aprovado',
  description:
    'Linha de capital de giro garantida pelo fluxo de caixa da loja. Exclusivo para reforço de stock.',
};

/** Único produto de crédito disponível para contas Business */
export const BUSINESS_CREDIT_PRODUCTS = [BUSINESS_STOCK_CREDIT] as const;

export const VAT_REGIMES: { id: VatRegime; label: string; rate: number }[] = [
  { id: 'general', label: 'Regime geral', rate: 14 },
  { id: 'reduced', label: 'Taxa reduzida', rate: 5 },
  { id: 'exempt', label: 'Isento / não sujeito', rate: 0 },
];

export const BUSINESS_OPENING_TYPES: {
  id: BusinessType;
  title: string;
  description: string;
  requirements: string[];
}[] = [
  {
    id: 'individual',
    title: 'Empresário em nome individual',
    description: 'BI, sem alvará, regime simplificado',
    requirements: [
      'Bilhete de Identidade válido',
      'NIF de empresário em nome individual',
      'Comprovativo de morada comercial',
      'Declaração de início de actividade',
    ],
  },
  {
    id: 'company',
    title: 'Empresa constituída',
    description: 'NIF + alvará comercial',
    requirements: [
      'Certidão comercial actualizada',
      'NIF da empresa',
      'Alvará comercial',
      'BI do representante legal',
      'Comprovativo de sede social',
    ],
  },
];

export const BUSINESS_KYB_STEPS = [
  'Dados da empresa',
  'Tipo de negócio',
  'Upload de documentos',
  'Validação automática',
  'Conta activada',
];

export type BusinessNotification = {
  id: string;
  kind: BusinessNotificationKind;
  title: string;
  message: string;
  dateLabel: string;
  read: boolean;
  actionHref?: string;
};

export const BUSINESS_NOTIFICATIONS: BusinessNotification[] = [
  {
    id: 'bn1',
    kind: 'invoice_pending',
    title: 'Factura pendente',
    message: 'Factura #FS-2026-089 aguarda aprovação.',
    dateLabel: 'Hoje',
    read: false,
    actionHref: '/business/aprovar-factura/fs-2026-089',
  },
  {
    id: 'bn2',
    kind: 'employee_limit',
    title: 'Limite de colaborador',
    message: 'Maria Santos atingiu 90% do limite mensal de despesas.',
    dateLabel: 'Ontem',
    read: false,
  },
  {
    id: 'bn3',
    kind: 'stock_credit_renewed',
    title: 'Crédito de stock renovado',
    message: 'A sua linha de capital de giro foi renovada até 2.000.000,00 kz.',
    dateLabel: '03 Jun',
    read: true,
    actionHref: '/business/credito-stock',
  },
];

export type BusinessTransaction = {
  id: string;
  type: 'income' | 'expense';
  title: string;
  description: string;
  amount: string;
  date: string;
};

export const BUSINESS_RECENT_TRANSACTIONS: BusinessTransaction[] = [
  {
    id: 't1',
    type: 'income',
    title: 'Pagamento QR',
    description: 'Cliente balcão',
    amount: '+125.000,00 kz',
    date: '05 Jun',
  },
  {
    id: 't2',
    type: 'income',
    title: 'Transferência recebida',
    description: 'Distribuidora ABC',
    amount: '+890.000,00 kz',
    date: '04 Jun',
  },
  {
    id: 't3',
    type: 'expense',
    title: 'Pagamento serviço',
    description: 'ENDE · Electricidade',
    amount: '-45.200,00 kz',
    date: '04 Jun',
  },
];

export const BUSINESS_QUICK_ACTIONS: {
  id: string;
  title: string;
  subtitle: string;
  icon: IoniconName;
  iconBg: string;
  iconColor: string;
  href: string;
}[] = [
  {
    id: 'qr',
    title: 'QR da loja',
    subtitle: 'Receber no balcão',
    icon: 'qr-code-outline',
    iconBg: '#E0F2FE',
    iconColor: '#0284C7',
    href: '/business/qr-code',
  },
  {
    id: 'services',
    title: 'Pagar serviços',
    subtitle: 'ENDE, TV, internet',
    icon: 'flash-outline',
    iconBg: '#FEF3C7',
    iconColor: '#D97706',
    href: '/(tabs)/payments',
  },
  {
    id: 'invoice-simple',
    title: 'Factura simplificada',
    subtitle: 'Isenta de IVA',
    icon: 'document-text-outline',
    iconBg: '#DCFCE7',
    iconColor: '#16A34A',
    href: '/business/facturacao/criar?type=simplified',
  },
  {
    id: 'invoice-normal',
    title: 'Factura normal',
    subtitle: 'Com IVA',
    icon: 'receipt-outline',
    iconBg: '#EEF0F8',
    iconColor: '#1A1A4E',
    href: '/business/facturacao/criar?type=normal',
  },
];

export const BUSINESS_REPORTS = [
  {
    id: 'extracto',
    title: 'Extracto mensal',
    subtitle: 'Total de transacções do mês',
    icon: 'calendar-outline' as IoniconName,
    href: '/business/relatorios/extracto',
  },
  {
    id: 'facturas',
    title: 'Facturas emitidas',
    subtitle: 'Relatório de facturação',
    icon: 'documents-outline' as IoniconName,
    href: '/business/relatorios/facturas',
  },
  {
    id: 'exportar',
    title: 'Exportar contabilidade',
    subtitle: 'CSV, PDF ou SAFT-AO',
    icon: 'cloud-download-outline' as IoniconName,
    href: '/business/relatorios/exportar',
  },
  {
    id: 'fluxo',
    title: 'Fluxo de caixa',
    subtitle: 'Projecção a 3 meses',
    icon: 'trending-up-outline' as IoniconName,
    href: '/business/relatorios/fluxo-caixa',
  },
  {
    id: 'grafico-gastos',
    title: 'Gráfico de Gastos',
    subtitle: 'Despesas por categoria',
    icon: 'pie-chart-outline' as IoniconName,
    href: '/business/relatorios/grafico-gastos',
  },
];

export const BUSINESS_CASH_FLOW_PROJECTION = [
  { month: 'Jul 2026', projected: '4.200.000,00 kz', confidence: 'Alta' },
  { month: 'Ago 2026', projected: '4.050.000,00 kz', confidence: 'Média' },
  { month: 'Set 2026', projected: '4.380.000,00 kz', confidence: 'Média' },
];
