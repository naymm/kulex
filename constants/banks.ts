import type { ImageSourcePropType } from 'react-native';

export type Bank = {
  id: string;
  name: string;
  selectLabel: string;
  logo: ImageSourcePropType;
};

export const BANKS: Bank[] = [
  {
    id: 'bai',
    name: 'BAI',
    selectLabel: 'Banco BAI',
    logo: require('../assets/images/bancos/bai.png'),
  },
  {
    id: 'bfa',
    name: 'BFA',
    selectLabel: 'Banco BFA',
    logo: require('../assets/images/bancos/bfa.png'),
  },
  {
    id: 'millennium',
    name: 'Millennium Atlântico',
    selectLabel: 'Millennium Atlântico',
    logo: require('../assets/images/bancos/millennium.png'),
  },
  {
    id: 'bpc',
    name: 'BPC',
    selectLabel: 'Banco BPC',
    logo: require('../assets/images/bancos/bpc.png'),
  },
  {
    id: 'standard',
    name: 'Standard bank',
    selectLabel: 'Standard bank',
    logo: require('../assets/images/bancos/standard.png'),
  },
  {
    id: 'sol',
    name: 'Sol',
    selectLabel: 'Banco Sol',
    logo: require('../assets/images/bancos/sol.png'),
  },
  {
    id: 'caixa',
    name: 'Caixa Geral',
    selectLabel: 'Caixa Geral',
    logo: require('../assets/images/bancos/caixa.png'),
  },
  {
    id: 'keve',
    name: 'Keve',
    selectLabel: 'Keve',
    logo: require('../assets/images/bancos/keve.png'),
  },
  {
    id: 'bni',
    name: 'BNI',
    selectLabel: 'BNI',
    logo: require('../assets/images/bancos/bni.png'),
  },
  {
    id: 'bca',
    name: 'BCA',
    selectLabel: 'BCA',
    logo: require('../assets/images/bancos/bca.png'),
  },
  {
    id: 'bci',
    name: 'BCI',
    selectLabel: 'BCI',
    logo: require('../assets/images/bancos/bci.png'),
  },
  {
    id: 'bir',
    name: 'BIR',
    selectLabel: 'BIR',
    logo: require('../assets/images/bancos/bir.png'),
  },
  {
    id: 'yetu',
    name: 'YETU',
    selectLabel: 'YETU',
    logo: require('../assets/images/bancos/yetu.png'),
  },
  {
    id: 'valor',
    name: 'VALOR',
    selectLabel: 'VALOR',
    logo: require('../assets/images/bancos/valor.png'),
  },
  {
    id: 'vbt',
    name: 'VBT África',
    selectLabel: 'VBT África',
    logo: require('../assets/images/bancos/vbt.png'),
  },
  {
    id: 'bcs',
    name: 'BCS',
    selectLabel: 'BCS',
    logo: require('../assets/images/bancos/bcs.png'),
  },
  {
    id: 'comercial',
    name: 'Comercial Huambo',
    selectLabel: 'Comercial Huambo',
    logo: require('../assets/images/bancos/comercial.png'),
  },
];

export const DEFAULT_BANK = BANKS[0];
