export type BiLookupData = {
  numero: string;
  nome_completo: string;
  nome: string;
  apelido: string;
  nif: string;
  data_nasc: string;
  genero: string;
  naturalidade: string;
  nacionalidade_nome: string;
};

type BiLookupResponse = {
  sucess: boolean;
  success?: boolean;
  message: string;
  data?: BiLookupData;
};

const BI_API_BASE = process.env.EXPO_PUBLIC_BI_API_URL ?? 'http://localhost:3000';

/** Formato típico: 001543646LA031 (14 caracteres) */
export function normalizeBiNumber(value: string): string {
  return value.replace(/\s/g, '').toUpperCase();
}

export function isCompleteBiNumber(value: string): boolean {
  return /^[0-9]{9}[A-Z]{2}[0-9]{3}$/.test(normalizeBiNumber(value));
}

export async function fetchBiData(biNumber: string, signal?: AbortSignal): Promise<BiLookupData> {
  const numero = normalizeBiNumber(biNumber);
  const url = `${BI_API_BASE.replace(/\/$/, '')}/api/bi/${encodeURIComponent(numero)}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });

  if (!response.ok) {
    throw new Error('Não foi possível consultar o BI.');
  }

  const payload = (await response.json()) as BiLookupResponse;
  const ok = payload.sucess === true || payload.success === true;

  if (!ok || !payload.data) {
    throw new Error(payload.message?.trim() || 'BI não encontrado.');
  }

  return payload.data;
}

export function parseBiBirthDate(isoDate: string): Date | null {
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}
