import type { PostpaidCardTierId } from '@/constants/postpaid-card';
import {
  getDueDayById,
  getMaxCardTierForScore,
} from '@/constants/postpaid-card';

export type PostpaidCardBaseParams = {
  score: string;
  cardTierId: PostpaidCardTierId;
  plafondId: string;
  plafondLabel: string;
  plafondAmount: string;
};

export type PostpaidCardRequestParams = PostpaidCardBaseParams & {
  dueDayId: string;
  dueDay: string;
  dueDayLabel: string;
};

function parseCardTierId(
  raw: Record<string, string | string[] | undefined>,
  score: string,
): PostpaidCardTierId | null {
  const cardTierRaw = raw.cardTierId;
  if (
    cardTierRaw === 'branco' ||
    cardTierRaw === 'verde' ||
    cardTierRaw === 'gold' ||
    cardTierRaw === 'prata' ||
    cardTierRaw === 'black'
  ) {
    return cardTierRaw;
  }

  return getMaxCardTierForScore(Number(score));
}

export function parsePostpaidBaseParams(
  raw: Record<string, string | string[] | undefined>,
): PostpaidCardBaseParams | null {
  const score = typeof raw.score === 'string' ? raw.score : '';
  const cardTierId = parseCardTierId(raw, score);
  if (!cardTierId) return null;

  const plafondId = typeof raw.plafondId === 'string' ? raw.plafondId : '';
  const plafondLabel = typeof raw.plafondLabel === 'string' ? raw.plafondLabel : '';
  const plafondAmount = typeof raw.plafondAmount === 'string' ? raw.plafondAmount : '';

  if (!plafondId || !plafondAmount) return null;

  return {
    score,
    cardTierId,
    plafondId,
    plafondLabel,
    plafondAmount,
  };
}

export function postpaidParamsToRoute(
  params: PostpaidCardRequestParams,
): Record<string, string> {
  return {
    score: params.score,
    cardTierId: params.cardTierId,
    plafondId: params.plafondId,
    plafondLabel: params.plafondLabel,
    plafondAmount: params.plafondAmount,
    dueDayId: params.dueDayId,
    dueDay: params.dueDay,
    dueDayLabel: params.dueDayLabel,
  };
}

export function postpaidBaseParamsToRoute(
  params: PostpaidCardBaseParams,
): Record<string, string> {
  return {
    score: params.score,
    cardTierId: params.cardTierId,
    plafondId: params.plafondId,
    plafondLabel: params.plafondLabel,
    plafondAmount: params.plafondAmount,
  };
}

export function parsePostpaidParams(
  raw: Record<string, string | string[] | undefined>,
): PostpaidCardRequestParams | null {
  const base = parsePostpaidBaseParams(raw);
  if (!base) return null;

  const dueDayId = typeof raw.dueDayId === 'string' ? raw.dueDayId : '';
  const dueDayOption = getDueDayById(dueDayId);
  if (!dueDayOption) return null;

  const dueDay = typeof raw.dueDay === 'string' ? raw.dueDay : String(dueDayOption.day);
  const dueDayLabel =
    typeof raw.dueDayLabel === 'string' ? raw.dueDayLabel : dueDayOption.label;

  return {
    ...base,
    dueDayId,
    dueDay,
    dueDayLabel,
  };
}
