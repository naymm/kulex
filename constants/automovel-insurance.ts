export const AUTO_INSURANCE_STEPS = [
  'Dados do Automóvel',
  'Tomador do Seguro',
  'Resumo da Proposta',
  'Dados para pagamentos',
] as const;

export const AUTO_INSURANCE_DETAIL = {
  title: 'Seguro Automóvel',
  segment: 'Particulares',
  description:
    'O Seguro Automóvel visa garantir a tão desejada protecção sobre terceiros, em caso de sinistros em território nacional, e ainda pode garantir a protecção do veículo do tomador de seguro, aumentando o conforto e o bem-estar dos proprietários e/ou condutores dos veículos seguros.',
  audience:
    'Todo e qualquer proprietário e/ou condutor (seja em nome colectivo ou em nome individual) de um veículo terrestre a motor, seus reboques ou semi-reboques e velocípedes.',
  documents: [
    { id: 'condicoes', label: 'Condições Gerais Auto' },
    { id: 'folheto', label: 'Folheto' },
  ],
};

export const SIMULATION_PRICES = {
  trimestral: '8 791,82',
  semestral: '17 183,35',
  anual: '33 833,00',
};

export const INSURANCE_WALLET_BALANCE = '825.415,56';

export const FRACIONAMENTO_OPTIONS = ['Trimestral', 'Semestral', 'Anual'];

export const MARCA_OPTIONS = ['Kia', 'Toyota', 'Hyundai', 'Mercedes-Benz', 'BMW'];
export const MODELO_OPTIONS = ['Morning', 'Picanto', 'Sportage', 'Corolla', 'Hilux'];
export const LUGARES_OPTIONS = ['2', '4', '5', '7'];
export const COR_OPTIONS = ['Vermelho', 'Branco', 'Preto', 'Azul', 'Cinzento'];

export const DEFAULT_VEHICLE_FORM = {
  marca: 'Kia',
  modelo: 'Morning',
  cilindrada: '998',
  matricula: 'LD-10-10-XX',
  dataPrimeiraMatricula: '29-04-2024',
  dataInicioSeguro: '07-06-2026',
  lugares: '5',
  cor: 'Vermelho',
  peso: '1203kg',
};

export const DEFAULT_POLICYHOLDER = {
  isCliente: true,
  nome: 'NAYM MUPOIA',
  documento: '005853642LN048',
  nif: '005853642LN048',
  telefone: '944781378',
  email: 'naymupoia@gmail.com',
  morada: 'Rua Marien Ngouambi',
  dataNascimento: '04-04-2001',
  genero: 'Masculino',
};

export const GENERO_OPTIONS = ['Masculino', 'Feminino'];
