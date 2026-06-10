import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { POSTPAID_CARD_SCORE } from '@/constants/postpaid-card';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export const KULEX_SCORE_MIN = 300;
export const KULEX_SCORE_MAX = 1000;
export const KULEX_USER_SCORE = POSTPAID_CARD_SCORE;
export const KULEX_SCORE_PREVIOUS = 838;

export type ScoreBandId = 'insuficiente' | 'regular' | 'bom' | 'muito_bom' | 'excelente';

export type ScoreBand = {
  id: ScoreBandId;
  label: string;
  min: number;
  max: number;
  color: string;
  description: string;
};

export const SCORE_BANDS: ScoreBand[] = [
  {
    id: 'insuficiente',
    label: 'Insuficiente',
    min: 300,
    max: 549,
    color: '#EF4444',
    description: 'Continue a utilizar a Kulex para construir o seu histórico financeiro.',
  },
  {
    id: 'regular',
    label: 'Regular',
    min: 550,
    max: 649,
    color: '#F59E0B',
    description: 'Já pode aceder a produtos básicos de crédito e cartão Branco.',
  },
  {
    id: 'bom',
    label: 'Bom',
    min: 650,
    max: 749,
    color: '#C9A227',
    description: 'Perfil sólido com acesso a cartões Gold e limites mais elevados.',
  },
  {
    id: 'muito_bom',
    label: 'Muito bom',
    min: 750,
    max: 849,
    color: '#3B82F6',
    description: 'Excelente comportamento financeiro. Elegível para cartão Prata.',
  },
  {
    id: 'excelente',
    label: 'Excelente',
    min: 850,
    max: 1000,
    color: '#16A34A',
    description: 'Perfil premium. Acesso ao máximo de produtos e cartão Black.',
  },
];

export type ScoringFactorImpact = 'positive' | 'neutral' | 'negative';

export type ScoringFactor = {
  id: string;
  label: string;
  description: string;
  icon: IoniconName;
  impact: ScoringFactorImpact;
  points: number;
  maxPoints: number;
};

export const SCORING_FACTORS: ScoringFactor[] = [
  {
    id: 'payments',
    label: 'Histórico de pagamentos',
    description: 'Pagamentos em dia de faturas, créditos e serviços.',
    icon: 'checkmark-circle-outline',
    impact: 'positive',
    points: 180,
    maxPoints: 200,
  },
  {
    id: 'activity',
    label: 'Utilização da conta',
    description: 'Frequência e consistência de movimentos na conta.',
    icon: 'pulse-outline',
    impact: 'positive',
    points: 120,
    maxPoints: 150,
  },
  {
    id: 'kyc',
    label: 'Verificação de identidade',
    description: 'Conta verificada com documentos válidos.',
    icon: 'shield-checkmark-outline',
    impact: 'positive',
    points: 100,
    maxPoints: 100,
  },
  {
    id: 'diversity',
    label: 'Diversificação',
    description: 'Uso de transferências, pagamentos, poupança e cartão.',
    icon: 'layers-outline',
    impact: 'positive',
    points: 90,
    maxPoints: 120,
  },
  {
    id: 'tenure',
    label: 'Antiguidade na Kulex',
    description: 'Tempo de relacionamento com a plataforma.',
    icon: 'time-outline',
    impact: 'positive',
    points: 60,
    maxPoints: 80,
  },
  {
    id: 'delays',
    label: 'Atrasos de pagamento',
    description: 'Incumprimentos recentes reduzem o scoring.',
    icon: 'alert-circle-outline',
    impact: 'neutral',
    points: 0,
    maxPoints: 0,
  },
];

export type ScoreHistoryEntry = {
  id: string;
  monthLabel: string;
  score: number;
};

export const SCORE_HISTORY: ScoreHistoryEntry[] = [
  { id: 'h-1', monthLabel: 'Mar 2026', score: 812 },
  { id: 'h-2', monthLabel: 'Abr 2026', score: 838 },
  { id: 'h-3', monthLabel: 'Mai 2026', score: 845 },
  { id: 'h-4', monthLabel: 'Jun 2026', score: KULEX_USER_SCORE },
];

export type ScoringBenefit = {
  id: string;
  label: string;
  description: string;
  icon: IoniconName;
  minScore: number;
  unlocked: boolean;
};

export const SCORING_BENEFITS_BASE: Omit<ScoringBenefit, 'unlocked'>[] = [
  {
    id: 'postpaid-card',
    label: 'Cartão Pós-pago',
    description: 'Crédito rotativo com plafond personalizado.',
    icon: 'card-outline',
    minScore: 550,
  },
  {
    id: 'adiantamento',
    label: 'Adiantamento Kulex',
    description: 'Pague serviços e transferências à crédito.',
    icon: 'flash-outline',
    minScore: 500,
  },
  {
    id: 'maka-zero',
    label: 'Crédito Maka Zero',
    description: 'Microcrédito para necessidades do dia-a-dia.',
    icon: 'speedometer-outline',
    minScore: 600,
  },
  {
    id: 'remessas-priority',
    label: 'Remessas prioritárias',
    description: 'Processamento mais rápido de remessas internacionais.',
    icon: 'globe-outline',
    minScore: 750,
  },
  {
    id: 'plafond-boost',
    label: 'Aumento de plafond',
    description: 'Pedidos de aumento de limite com análise simplificada.',
    icon: 'trending-up-outline',
    minScore: 800,
  },
];

export const SCORING_IMPROVEMENT_TIPS = [
  'Pague faturas e créditos antes do vencimento.',
  'Mantenha movimentação regular na conta durante o mês.',
  'Complete a verificação KYC se ainda não o fez.',
  'Evite pedidos de crédito com saldo em atraso.',
];
