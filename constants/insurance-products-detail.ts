import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export type InsuranceProductDetailConfig = {
  title: string;
  segment: string;
  description: string;
  audience: string;
  icon: IoniconName;
  iconColor: string;
  simulationAvailable: boolean;
  documents: Array<{ id: string; label: string }>;
  simulationRoute?: string;
};

export const ACIDENTE_TRABALHO_DETAIL: InsuranceProductDetailConfig = {
  title: 'Seguro de Acidentes de Trabalho',
  segment: 'Empresas',
  description:
    'Acidentes de Trabalho é o seguro que transfere para a Seguradora a responsabilidade legal que recai sobre o Empregador, em caso de acidente de trabalho ou doenças profissionais.',
  audience:
    'Destina-se a empresas e entidades particulares que realmente se preocupam com as necessidades dos seus colaboradores em caso de sinistros.',
  icon: 'shield-checkmark-outline',
  iconColor: '#F97316',
  simulationAvailable: false,
  documents: [
    { id: 'condicoes-at', label: 'Condições Gerais Seguro AT VIVA' },
    { id: 'seguro-at', label: 'Seguro Acidente de Trabalho' },
  ],
};

export const ACIDENTES_PESSOAIS_DETAIL: InsuranceProductDetailConfig = {
  title: 'Seguro Acidentes Pessoais',
  segment: 'Particulares',
  description:
    'O seguro de acidentes pessoais oferece cobertura financeira para os segurados em caso de acidentes que resultem em morte, invalidez permanente ou temporária, despesas médicas, hospitalares e medicamentos.',
  audience:
    'Este seguro destina-se a todas as pessoas que pretendam, de uma forma abrangente, salvaguardar o equilíbrio do orçamento familiar em caso de acidente pessoal de que sejam vítimas no seu dia-a-dia, quer esses acidentes decorram de actividades profissionais quer de actividades extra-profissionais.',
  icon: 'person-outline',
  iconColor: '#EC4899',
  simulationAvailable: false,
  documents: [],
};

export const MULTIRRISCOS_DETAIL: InsuranceProductDetailConfig = {
  title: 'Seguro de Multirriscos Habitação',
  segment: 'Particulares',
  description:
    'O Seguro de Multirriscos Habitação visa garantir a protecção dos edifícios ou fracções de edifícios e os seus conteúdos, destinados à habitação permanente do Segurado, localizado em Angola.',
  audience:
    'Especialmente indicado para particulares que querem ter a sua casa protegida de qualquer incidente.',
  icon: 'home-outline',
  iconColor: '#EF4444',
  simulationAvailable: false,
  documents: [{ id: 'condicoes-mrh', label: 'Condições Gerais Seguro MRH VIVA' }],
};
