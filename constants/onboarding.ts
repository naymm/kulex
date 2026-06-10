import type { ImageSourcePropType } from 'react-native';

export type OnboardingSlide = {
  id: string;
  background: ImageSourcePropType;
  title: string;
  variant: 'next' | 'auth';
};

export const ONBOARDING_SLIDE_DURATION_MS = 5000;

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: 'tela-1',
    background: require('../assets/images/fundos/tela-1.png'),
    title: 'O controle financeiro na palma da sua mão',
    variant: 'next',
  },
  {
    id: 'tela-2',
    background: require('../assets/images/fundos/tela-2.png'),
    title: 'O cartão que acompanha o seu ritmo',
    variant: 'next',
  },
  {
    id: 'tela-3',
    background: require('../assets/images/fundos/tela-3.png'),
    title: 'Facilidade para quem compra e para quem vende',
    variant: 'next',
  },
  {
    id: 'tela-4',
    background: require('../assets/images/fundos/tela-4.png'),
    title: 'Pronto para transformar sua vida financeira?',
    variant: 'auth',
  },
];

export const ONBOARDING_PROGRESS_SEGMENTS = 4;
