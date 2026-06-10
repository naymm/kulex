export const MONTHS_PT = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
] as const;

export type AccountType = 'personal' | 'agent';

export const ACCOUNT_TYPES: {
  id: AccountType;
  title: string;
  description: string;
  icon: 'person-outline' | 'shield-checkmark-outline';
}[] = [
  {
    id: 'personal',
    title: 'Conta Pessoal',
    description: 'Envie, gaste e receba dinheiro ao redor do mundo pagando menos.',
    icon: 'person-outline',
  },
  {
    id: 'agent',
    title: 'Conta Agente',
    description: 'Mesmos requisitos da conta pessoal, com KYC e PIN para operar como agente.',
    icon: 'shield-checkmark-outline',
  },
];

export const COUNTRY_FEATURES = [
  {
    id: 'transfer',
    icon: 'arrow-up-outline' as const,
    title: 'Enviar dinheiro para o exterior',
    description: 'Faça transferências internacionais de baixo custo.',
  },
  {
    id: 'credit',
    icon: 'cash-outline' as const,
    title: 'Obter um microcrédito',
    description:
      'Impulsione seu negócio ou projetos pessoais com financiamento rápido e juros baixos.',
  },
  {
    id: 'insurance',
    icon: 'shield-outline' as const,
    title: 'Cobertura de Seguros',
    description:
      'Proteja seu negócio, activos ou família com planos flexíveis. Tranquilidade total.',
  },
];
