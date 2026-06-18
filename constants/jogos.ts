export type JogoProvider = {
  id: string;
  label: string;
  logo: number;
};

export const JOGO_PROVIDERS: JogoProvider[] = [
  {
    id: 'premierbet',
    label: 'Premier bet',
    logo: require('../assets/images/jogos/premierbet.png'),
  },
  {
    id: 'elephantbet',
    label: 'Elephant bet',
    logo: require('../assets/images/jogos/elephantbet.png'),
  },
  {
    id: 'bantubet',
    label: 'Bantu bet',
    logo: require('../assets/images/jogos/bantubet.png'),
  },
  {
    id: 'mobet',
    label: 'Mobet',
    logo: require('../assets/images/jogos/mobet.png'),
  },
];
