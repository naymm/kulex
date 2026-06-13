import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  DEFAULT_ACCOUNT_ID,
  getAccountById,
  type AccountKind,
} from '@/constants/accounts';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export type MenuItemAction =
  | { type: 'route'; href: string }
  | { type: 'logout' }
  | { type: 'info'; message: string }
  | { type: 'toggle'; key: 'biometric' | 'twoFactor' | 'location' };

export type MenuItem = {
  id: string;
  title: string;
  subtitle?: string;
  icon: IoniconName;
  iconBg?: string;
  iconColor?: string;
  destructive?: boolean;
  action: MenuItemAction;
};

export type MenuSection = {
  id: string;
  title: string;
  items: MenuItem[];
};

export const MENU_USER = getAccountById(DEFAULT_ACCOUNT_ID);

/** Itens ocultos no menu da conta Agente */
export const AGENT_HIDDEN_MENU_ITEM_IDS = new Set([
  'kixikila',
  'remessas',
  'seguros',
  'cartoes',
  'credito',
]);

const BUSINESS_EXTRA_MENU_ITEMS: MenuItem[] = [
  {
    id: 'relatorios',
    title: 'Relatórios',
    subtitle: 'Extractos, facturas e exportação',
    icon: 'bar-chart-outline',
    action: { type: 'route', href: '/(tabs)/business-relatorios' },
  },
];

const BUSINESS_MENU_ITEM_OVERRIDES: Record<string, Partial<MenuItem>> = {
  'grafico-gastos': {
    action: { type: 'route', href: '/business/relatorios/grafico-gastos' },
  },
  credito: {
    title: 'Crédito de stock',
    subtitle: 'Capital de giro para reforço de stock',
    icon: 'cube-outline',
    action: { type: 'route', href: '/(tabs)/business-credito' },
  },
};

function applyBusinessMenuOverrides(section: MenuSection): MenuSection {
  return {
    ...section,
    items: section.items.map((item) => {
      const override = BUSINESS_MENU_ITEM_OVERRIDES[item.id];
      return override ? { ...item, ...override } : item;
    }),
  };
}

export function getMenuSectionsForAccount(kind: AccountKind): MenuSection[] {
  if (kind === 'agent') {
    return MENU_SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter((item) => !AGENT_HIDDEN_MENU_ITEM_IDS.has(item.id)),
    })).filter((section) => section.items.length > 0);
  }

  if (kind === 'business') {
    return MENU_SECTIONS.map((section) => {
      const mapped = applyBusinessMenuOverrides(section);
      if (section.id !== 'conta') return mapped;
      return {
        ...mapped,
        items: [...mapped.items, ...BUSINESS_EXTRA_MENU_ITEMS],
      };
    });
  }

  return MENU_SECTIONS;
}

export const MENU_SECTIONS: MenuSection[] = [
  {
    id: 'conta',
    title: 'Conta',
    items: [
      {
        id: 'dados',
        title: 'Meus Dados',
        subtitle: 'Configurações de dados pessoais',
        icon: 'person-outline',
        action: { type: 'route', href: '/meus-dados' },
      },
      {
        id: 'movimentos',
        title: 'Extratos e Movimentos',
        subtitle: 'Consultar histórico da conta',
        icon: 'document-text-outline',
        action: { type: 'route', href: '/movimentos' },
      },
      {
        id: 'grafico-gastos',
        title: 'Gráfico de Gastos',
        subtitle: 'Despesas por categoria',
        icon: 'pie-chart-outline',
        action: { type: 'route', href: '/movimentos/grafico-gastos' },
      },
      {
        id: 'verificacao',
        title: 'Verificar Conta',
        subtitle: 'Complete a verificação KYC',
        icon: 'shield-checkmark-outline',
        action: { type: 'route', href: '/kyc' },
      },
      {
        id: 'scoring',
        title: 'Scoring Kulex',
        subtitle: 'Consultar a sua pontuação financeira',
        icon: 'analytics-outline',
        action: { type: 'route', href: '/scoring' },
      },
    ],
  },
  {
    id: 'servicos',
    title: 'Serviços',
    items: [
      {
        id: 'transferencias',
        title: 'Transferências',
        subtitle: 'Enviar dinheiro e KWiK',
        icon: 'swap-horizontal-outline',
        action: { type: 'route', href: '/send-money/method' },
      },
      {
        id: 'depositar',
        title: 'Depositar',
        subtitle: 'Adicionar saldo à conta',
        icon: 'add-circle-outline',
        action: { type: 'route', href: '/add-money' },
      },
      {
        id: 'levantar',
        title: 'Levantar',
        subtitle: 'Levantar dinheiro da conta',
        icon: 'cash-outline',
        action: { type: 'route', href: '/withdraw' },
      },
      {
        id: 'kixikila',
        title: 'Kixikila',
        subtitle: 'Grupos de poupança rotativa',
        icon: 'people-outline',
        action: { type: 'route', href: '/kixikila' },
      },
      {
        id: 'remessas',
        title: 'Remessas',
        subtitle: 'Enviar e receber do exterior',
        icon: 'globe-outline',
        action: { type: 'route', href: '/remessas' },
      },
      {
        id: 'seguros',
        title: 'Seguros',
        subtitle: 'Gerir apólices e contratos',
        icon: 'briefcase-outline',
        action: { type: 'route', href: '/payments/seguros' },
      },
      {
        id: 'cartoes',
        title: 'Cartões',
        subtitle: 'Gerir cartões pré e pós-pago',
        icon: 'card-outline',
        action: { type: 'route', href: '/(tabs)/cards' },
      },
      {
        id: 'credito',
        title: 'Créditos',
        subtitle: 'Produtos de crédito Kulex',
        icon: 'speedometer-outline',
        action: { type: 'route', href: '/credito-flow/meus-creditos' },
      },
    ],
  },
  {
    id: 'definicoes',
    title: 'Definições',
    items: [
      {
        id: 'pin',
        title: 'Modificar PIN',
        subtitle: 'Alterar o PIN de segurança',
        icon: 'keypad-outline',
        action: { type: 'route', href: '/cards/carregar/pin' },
      },
      {
        id: 'biometric',
        title: 'Autenticação biométrica',
        subtitle: 'Desbloquear com impressão digital',
        icon: 'finger-print-outline',
        action: { type: 'toggle', key: 'biometric' },
      },
      {
        id: '2fa',
        title: 'Autenticação de 2 fatores',
        subtitle: 'Proteção extra na conta',
        icon: 'shield-outline',
        action: { type: 'toggle', key: 'twoFactor' },
      },
      {
        id: 'location',
        title: 'Localização',
        subtitle: 'Permitir serviços baseados em GPS',
        icon: 'navigate-outline',
        action: { type: 'toggle', key: 'location' },
      },
      {
        id: 'limites',
        title: 'Limites',
        subtitle: 'Gerir limites de transferência e cartão',
        icon: 'speedometer-outline',
        action: { type: 'route', href: '/cards/detalhes' },
      },
      {
        id: 'linguagem',
        title: 'Linguagem',
        subtitle: 'Português (Angola)',
        icon: 'language-outline',
        action: { type: 'info', message: 'Português (Angola) é o idioma actual da aplicação.' },
      },
    ],
  },
  {
    id: 'outras',
    title: 'Outras opções',
    items: [
      {
        id: 'ajuda',
        title: 'Ajuda e Suporte',
        subtitle: 'Centro de ajuda Kulex',
        icon: 'help-circle-outline',
        action: { type: 'info', message: 'Centro de ajuda em breve. Contacte suporte@kulex.ao' },
      },
      {
        id: 'termos',
        title: 'Termos e Condições',
        subtitle: 'Acordos e políticas',
        icon: 'information-circle-outline',
        action: { type: 'info', message: 'Consulte os termos e condições em kulex.ao/legal' },
      },
      {
        id: 'sair',
        title: 'Sair',
        subtitle: 'Terminar sessão',
        icon: 'log-out-outline',
        iconBg: '#FEE2E2',
        iconColor: '#DC2626',
        destructive: true,
        action: { type: 'logout' },
      },
    ],
  },
];
