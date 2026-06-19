import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { KIXIKILA_FEE_RATE_LABELS } from '@/constants/kixikila';

type IoniconName = ComponentProps<typeof Ionicons>['name'];

export type KixikilaHowItWorksStep = {
  id: string;
  title: string;
  description: string;
  icon: IoniconName;
};

export type KixikilaParticipationOption = {
  id: string;
  title: string;
  description: string;
  icon: IoniconName;
};

export type KixikilaFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const KIXIKILA_HOW_IT_WORKS_INTRO = {
  title: 'O que é a Kixikila?',
  description:
    'A Kixikila é a poupança rotativa digital da Kulex. Um grupo de pessoas contribui periodicamente para um fundo comum e, em cada ciclo, um membro recebe o montante total na sua conta — até todos receberem a sua vez.',
};

export const KIXIKILA_HOW_IT_WORKS_STEPS: KixikilaHowItWorksStep[] = [
  {
    id: 'grupo',
    title: 'Forma o grupo',
    description:
      'Cria uma Kixikila com amigos e família ou entra num grupo existente por convite ou através das Kixikilas Kulex.',
    icon: 'people-outline',
  },
  {
    id: 'contribuicao',
    title: 'Contribui em cada ciclo',
    description:
      'No dia útil definido, o valor acordado é debitado automaticamente da tua conta Kulex e entra no fundo do grupo.',
    icon: 'calendar-outline',
  },
  {
    id: 'ordem',
    title: 'Segue a ordem de recebimento',
    description:
      'O organizador define quem recebe em cada ciclo. Quando chega a tua vez, o fundo é creditado na tua conta.',
    icon: 'list-outline',
  },
  {
    id: 'ciclos',
    title: 'Completa todos os ciclos',
    description:
      'O grupo termina quando cada participante recebeu uma vez. Podes acompanhar contribuições, saldo e estado em tempo real.',
    icon: 'checkmark-done-outline',
  },
];

export const KIXIKILA_PARTICIPATION_OPTIONS: KixikilaParticipationOption[] = [
  {
    id: 'criar',
    title: 'Criar',
    description:
      'És o organizador: defines o valor, os membros, a ordem de recebimento e partilhas o código de convite.',
    icon: 'add-circle-outline',
  },
  {
    id: 'convite',
    title: 'Convite',
    description:
      'Recebeste um código de um organizador? Introduz o código em Participar e envia o pedido de entrada.',
    icon: 'ticket-outline',
  },
  {
    id: 'kulex',
    title: 'Kixikila Kulex',
    description:
      'Grupos criados pela app com participantes anónimos. Ideal para quem quer poupar sem expor identidades no grupo.',
    icon: 'shield-checkmark-outline',
  },
];

export const KIXIKILA_FEE_ITEMS = Object.values(KIXIKILA_FEE_RATE_LABELS);

export const KIXIKILA_FAQ: KixikilaFaqItem[] = [
  {
    id: 'inicio',
    question: 'Quando é que a Kixikila começa?',
    answer:
      'A Kixikila inicia quando o grupo atinge o número de membros definido e todos os pedidos de participação forem aceites. Até lá, o estado fica como «Aguardando membros».',
  },
  {
    id: 'debito',
    question: 'Como funciona o débito automático?',
    answer:
      'No dia útil escolhido (entre o 1.º e o 22.º), a Kulex debita da tua conta o valor da contribuição. Garante saldo suficiente nessa data para não falhar o ciclo.',
  },
  {
    id: 'comissoes',
    question: 'Quais são as comissões aplicadas?',
    answer:
      'A Kulex cobra taxa de serviço, Imposto de Selo, IVA e retenção sobre a taxa de serviço. O organizador pode escolher se as comissões saem do fundo ou são debitadas separadamente em cada participante.',
  },
  {
    id: 'anonimato',
    question: 'O que são as Kixikilas Kulex?',
    answer:
      'São grupos geridos pela plataforma. Os participantes aparecem de forma anónima — vês apenas a tua posição e a ordem de recebimento, sem os nomes reais dos outros membros.',
  },
  {
    id: 'organizador',
    question: 'Qual é o papel do organizador?',
    answer:
      'O organizador cria o grupo, convida membros, define a ordem de recebimento antes do início e pode adicionar novos membros enquanto a Kixikila estiver pendente.',
  },
  {
    id: 'seguro',
    question: 'Posso adicionar protecção ao grupo?',
    answer:
      'Sim. Ao criar uma Kixikila podes escolher «Com seguro» ou «Sem seguro». A protecção cobre cenários de incumprimento conforme as condições do produto Kulex.',
  },
];
