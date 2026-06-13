export type TabBarItem = {
  routeName: string;
  label: string;
  isCenter?: boolean;
};

export const PERSONAL_TAB_ITEMS: TabBarItem[] = [
  { routeName: 'index', label: 'Início' },
  { routeName: 'cards', label: 'Cartão' },
  { routeName: 'payments', label: 'Pagamentos', isCenter: true },
  { routeName: 'credito', label: 'Crédito' },
  { routeName: 'menu', label: 'Menu' },
];

export const AGENT_TAB_ITEMS: TabBarItem[] = [
  { routeName: 'index', label: 'Início' },
  { routeName: 'agent-operacoes', label: 'Clientes' },
  { routeName: 'agent-operar', label: 'Operar', isCenter: true },
  { routeName: 'agent-comissoes', label: 'Comissões' },
  { routeName: 'menu', label: 'Conta' },
];

export const BUSINESS_TAB_ITEMS: TabBarItem[] = [
  { routeName: 'index', label: 'Início' },
  { routeName: 'business-receber', label: 'Receber' },
  { routeName: 'business-facturacao', label: 'Facturar', isCenter: true },
  { routeName: 'business-servicos', label: 'Serviços' },
  { routeName: 'menu', label: 'Conta' },
];

export const PERSONAL_ONLY_ROUTES = ['cards', 'payments', 'credito'] as const;
export const AGENT_ONLY_ROUTES = ['agent-operacoes', 'agent-operar', 'agent-comissoes'] as const;
export const BUSINESS_ONLY_ROUTES = [
  'business-receber',
  'business-facturacao',
  'business-credito',
  'business-servicos',
  'business-relatorios',
] as const;
