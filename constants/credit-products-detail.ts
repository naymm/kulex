import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export type CreditProductTerms = {
  montanteMin: string;
  montanteMax: string;
  prazo: string;
  comissaoUtilizacao: string;
  iva: string;
  juroMora: string;
  taeg: string;
};

export type CreditProductDetailConfig = {
  id: string;
  title: string;
  segment: string;
  description: string;
  audience: string;
  icon: IoniconName;
  iconColor: string;
  terms: CreditProductTerms;
  documents: Array<{ id: string; label: string }>;
};

const DEFAULT_TERMS: CreditProductTerms = {
  montanteMin: '2.000,00 kz',
  montanteMax: '50.000,00 kz',
  prazo: '60 dias',
  comissaoUtilizacao: '15%',
  iva: '14%',
  juroMora: '4%',
  taeg: '105%',
};

export const MAKA_ZERO_DETAIL: CreditProductDetailConfig = {
  id: 'maka-zero',
  title: 'Maka Zero',
  segment: 'Particulares',
  description:
    'Com aprovação em até 2 horas, tens acesso ao crédito que precisas, quando mais precisas, sem burocracia e sem demoras.',
  audience:
    'Destina-se a clientes que precisam de liquidez imediata para despesas do dia-a-dia, imprevistos ou projectos pessoais de curto prazo.',
  icon: 'speedometer-outline',
  iconColor: '#3B82F6',
  terms: DEFAULT_TERMS,
  documents: [{ id: 'condicoes-maka', label: 'Condições Gerais Maka Zero' }],
};

export const EMPREENDEDOR_DETAIL: CreditProductDetailConfig = {
  id: 'empreendedor',
  title: 'Empreendedor',
  segment: 'Empreendedores',
  description:
    'Crédito rápido para capital de giro, compra de stock ou investimento no teu negócio, com processo simples e resposta em poucas horas.',
  audience:
    'Indicado para microempreendedores e pequenos negócios que precisam de financiamento flexível para manter ou expandir a actividade.',
  icon: 'walk-outline',
  iconColor: '#10B981',
  terms: DEFAULT_TERMS,
  documents: [{ id: 'condicoes-empreendedor', label: 'Condições Gerais Crédito Empreendedor' }],
};

export const FAMILIA_DETAIL: CreditProductDetailConfig = {
  id: 'familia',
  title: 'Família',
  segment: 'Famílias',
  description:
    'Solução de crédito pensada para despesas familiares — educação, saúde, reparações ou outros compromissos importantes do agregado.',
  audience:
    'Destina-se a famílias que procuram apoio financeiro rápido para gerir despesas relevantes com condições transparentes.',
  icon: 'people-outline',
  iconColor: '#8B5CF6',
  terms: DEFAULT_TERMS,
  documents: [{ id: 'condicoes-familia', label: 'Condições Gerais Crédito Família' }],
};

const CREDIT_PRODUCT_DETAILS: Record<string, CreditProductDetailConfig> = {
  'maka-zero': MAKA_ZERO_DETAIL,
  empreendedor: EMPREENDEDOR_DETAIL,
  familia: FAMILIA_DETAIL,
};

export function getCreditProductDetail(productId?: string): CreditProductDetailConfig {
  if (productId && CREDIT_PRODUCT_DETAILS[productId]) {
    return CREDIT_PRODUCT_DETAILS[productId];
  }
  return MAKA_ZERO_DETAIL;
}
