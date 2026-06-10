export type KwikKeyType = 'telemovel' | 'email';

export const KWIK_KEY_TYPES: { id: KwikKeyType; label: string }[] = [
  { id: 'telemovel', label: 'Telemóvel' },
  { id: 'email', label: 'E-mail' },
];

export const KWIK_SOURCE_ACCOUNT = 'Kulex Pessoal';

export const KWIK_KEY_LABELS: Record<KwikKeyType, string> = {
  telemovel: 'Chave KWiK (Telemóvel)',
  email: 'Chave KWiK (E-mail)',
};

export const KWIK_KEY_PLACEHOLDERS: Record<KwikKeyType, string> = {
  telemovel: 'Ex: 923 000 000',
  email: 'Ex: email@exemplo.com',
};

export const KWIK_CONFIRM_KEY_LABELS: Record<KwikKeyType, string> = {
  telemovel: 'Chave KWiK - Telemóvel',
  email: 'Chave KWiK - E-mail',
};
