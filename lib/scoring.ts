import {
  getEligibleCardProducts,
  getMaxCardTierForScore,
  getScoringLabel,
  POSTPAID_CARD_MIN_SCORE,
} from '@/constants/postpaid-card';
import {
  KULEX_SCORE_MAX,
  KULEX_SCORE_MIN,
  KULEX_SCORE_PREVIOUS,
  KULEX_USER_SCORE,
  SCORE_BANDS,
  SCORING_BENEFITS_BASE,
  type ScoreBand,
  type ScoringBenefit,
} from '@/constants/scoring';

export function getScoreBand(score: number): ScoreBand {
  const band = SCORE_BANDS.find((item) => score >= item.min && score <= item.max);
  return band ?? SCORE_BANDS[0];
}

export function getScoreProgress(score: number): number {
  const clamped = Math.min(KULEX_SCORE_MAX, Math.max(KULEX_SCORE_MIN, score));
  return (clamped - KULEX_SCORE_MIN) / (KULEX_SCORE_MAX - KULEX_SCORE_MIN);
}

export function getScoreDelta(): number {
  return KULEX_USER_SCORE - KULEX_SCORE_PREVIOUS;
}

export function formatScoreDelta(delta: number): string {
  if (delta > 0) return `+${delta}`;
  if (delta < 0) return String(delta);
  return '0';
}

export function getMaxCardLabelForScore(score: number): string | null {
  const tier = getMaxCardTierForScore(score);
  if (!tier) return null;
  return getScoringLabel(tier);
}

export function buildScoringBenefits(score: number): ScoringBenefit[] {
  const maxCard = getMaxCardLabelForScore(score);
  const eligibleCards = getEligibleCardProducts(score);

  return SCORING_BENEFITS_BASE.map((benefit) => {
    if (benefit.id === 'postpaid-card') {
      return {
        ...benefit,
        unlocked: score >= POSTPAID_CARD_MIN_SCORE,
        description:
          eligibleCards.length > 0
            ? `Até ${maxCard ?? eligibleCards[eligibleCards.length - 1].label}.`
            : benefit.description,
      };
    }

    return {
      ...benefit,
      unlocked: score >= benefit.minScore,
    };
  });
}
