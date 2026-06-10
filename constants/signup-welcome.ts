import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export type SignupWelcomeFeature = {
  id: string;
  icon: IoniconName;
  title: string;
  description: string;
};

export const SIGNUP_WELCOME_FEATURES: SignupWelcomeFeature[] = [
  {
    id: 'transfer',
    icon: 'arrow-up-outline',
    title: 'Enviar dinheiro',
    description: 'Faça transferências internacionais de baixo custo.',
  },
  {
    id: 'credit',
    icon: 'cash-outline',
    title: 'Obter um microcrédito',
    description:
      'Impulsione o seu negócio ou projetos pessoais com financiamento rápido e juros baixos.',
  },
  {
    id: 'insurance',
    icon: 'shield-outline',
    title: 'Cobertura de Seguros',
    description:
      'Proteja o seu negócio, activos ou família com planos flexíveis.',
  },
  {
    id: 'kixikila',
    icon: 'people-circle-outline',
    title: 'Kixikila',
    description:
      'Crie ou participe em grupos de poupança rotativa, de forma digital e segura.',
  },
];

export const SIGNUP_WELCOME_PRIVACY =
  'A Kulex utiliza os seus dados para personalizar a experiência, manter a conta segura e cumprir requisitos legais.';
