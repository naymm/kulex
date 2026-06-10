export const VIAGEM_INSURANCE_STEPS = [
  'Dados da Viagem',
  'Tomador do Seguro',
  'Resumo da Proposta',
  'Dados para pagamentos',
] as const;

export const VIAGEM_INSURANCE_DETAIL = {
  title: 'Assistência em Viagem',
  segment: 'Particulares',
  description:
    'O Seguro Assistência em Viagem garante apoio 24h em todo o mundo, quer viaje por lazer ou por trabalho, cobrindo riscos como atraso ou perda de bagagem, assistência médica ou perda de documentos.',
  audience:
    'Todo e qualquer viajante (seja em nome colectivo ou em nome individual).',
  documents: [
    { id: 'condicoes-av', label: 'Condições Gerais AV' },
    { id: 'assistencia-viagem', label: 'ASSISTÊNCIA EM VIAGEM' },
  ],
};

export const ORIGEM_OPTIONS = ['Angola', 'Portugal', 'Brasil', 'Moçambique', 'Cabo Verde'];
export const DESTINO_OPTIONS = ['Portugal', 'Angola', 'Brasil', 'Espanha', 'França', 'Estados Unidos'];
export const PASSAGEIROS_OPTIONS = ['0', '1', '2', '3', '4', '5'];

export const VIAGEM_SIMULATION_PRICE = '12.450,00';

export const DEFAULT_TRAVEL_FORM = {
  origem: 'Angola',
  destino: 'Portugal',
  inicio: '02-08-2026',
  fim: '04-10-2026',
  adultos: '1',
  criancas: '0',
};
