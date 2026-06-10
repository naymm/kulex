import type { ImageSourcePropType } from 'react-native';

export type ServicoId =
  | 'unitel'
  | 'africell'
  | 'movicel'
  | 'netone'
  | 'zap'
  | 'dstv'
  | 'dstv-stream'
  | 'ende'
  | 'epal';

export type ServicoRoute =
  | { type: 'telecom'; provider: string }
  | { type: 'tv'; provider: string }
  | { type: 'publico'; provider: string };

export type ServicoItem = {
  id: ServicoId;
  label: string;
  logo: ImageSourcePropType;
  route: ServicoRoute;
};

export const SERVICOS: ServicoItem[] = [
  {
    id: 'unitel',
    label: 'Unitel',
    logo: require('@/assets/images/servicos/unitel.png'),
    route: { type: 'telecom', provider: 'unitel' },
  },
  {
    id: 'africell',
    label: 'Africell',
    logo: require('@/assets/images/servicos/africell.png'),
    route: { type: 'telecom', provider: 'africell' },
  },
  {
    id: 'movicel',
    label: 'Movicel',
    logo: require('@/assets/images/servicos/movicel.png'),
    route: { type: 'telecom', provider: 'movicel' },
  },
  {
    id: 'netone',
    label: 'Net One',
    logo: require('@/assets/images/servicos/netone.png'),
    route: { type: 'telecom', provider: 'netone' },
  },
  {
    id: 'zap',
    label: 'Zap',
    logo: require('@/assets/images/servicos/zap.png'),
    route: { type: 'tv', provider: 'zap' },
  },
  {
    id: 'dstv',
    label: 'Dstv',
    logo: require('@/assets/images/servicos/dstv.png'),
    route: { type: 'tv', provider: 'dstv' },
  },
  {
    id: 'dstv-stream',
    label: 'Dstv Stream',
    logo: require('@/assets/images/servicos/dstv-stream.png'),
    route: { type: 'tv', provider: 'dstv-stream' },
  },
  {
    id: 'ende',
    label: 'Ende',
    logo: require('@/assets/images/servicos/ende.png'),
    route: { type: 'publico', provider: 'ende' },
  },
  {
    id: 'epal',
    label: 'Epal',
    logo: require('@/assets/images/servicos/epal.png'),
    route: { type: 'publico', provider: 'epal' },
  },
];

export function getServicoRoutePath(route: ServicoRoute): string {
  switch (route.type) {
    case 'telecom':
      return '/payments/telecom/[provider]';
    case 'tv':
      return '/payments/tv/[provider]';
    case 'publico':
      return '/payments/publicos/[provider]';
  }
}
