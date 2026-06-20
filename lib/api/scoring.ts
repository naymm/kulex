import {
  SCORE_BANDS,
  SCORING_FACTORS,
  type ScoreBand,
  type ScoringFactor,
  type ScoringFactorImpact,
} from '@/constants/scoring';
import { formatBalanceFromCents } from '@/lib/api/accounts';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export type UserScoreData = {
  score: number;
  previousScore: number;
  band: ScoreBand;
  history: { monthLabel: string; score: number }[];
  factors: ScoringFactor[];
};

const FACTOR_META: Record<string, Pick<ScoringFactor, 'label' | 'description' | 'icon'>> = {
  payments: SCORING_FACTORS[0],
  activity: SCORING_FACTORS[1],
  kyc: SCORING_FACTORS[2],
  diversity: SCORING_FACTORS[3],
  tenure: SCORING_FACTORS[4],
  delays: SCORING_FACTORS[5],
};

function bandFromScore(score: number): ScoreBand {
  return SCORE_BANDS.find((b) => score >= b.min && score <= b.max) ?? SCORE_BANDS[0];
}

export async function fetchUserScore(userId: string): Promise<UserScoreData | null> {
  if (!isSupabaseConfigured || !userId) return null;

  const [{ data: scoreRow, error: scoreError }, { data: historyRows, error: histError }, { data: factorRows, error: facError }] =
    await Promise.all([
      supabase.from('kulex_scores').select('score, previous_score, band').eq('user_id', userId).maybeSingle(),
      supabase.from('score_history').select('month_label, score').eq('user_id', userId).order('recorded_at', { ascending: false }).limit(12),
      supabase.from('scoring_factors').select('id, impact, points, max_points').eq('user_id', userId),
    ]);

  if (scoreError) throw scoreError;
  if (histError) throw histError;
  if (facError) throw facError;
  if (!scoreRow) return null;

  const score = scoreRow.score ?? 0;
  const previousScore = scoreRow.previous_score ?? score;
  const band = scoreRow.band ? SCORE_BANDS.find((b) => b.id === scoreRow.band) ?? bandFromScore(score) : bandFromScore(score);

  const factors: ScoringFactor[] = (factorRows ?? []).map((row) => {
    const meta = FACTOR_META[row.id] ?? {
      label: row.id,
      description: '',
      icon: 'analytics-outline' as const,
    };
    return {
      id: row.id,
      label: meta.label,
      description: meta.description,
      icon: meta.icon,
      impact: row.impact as ScoringFactorImpact,
      points: row.points,
      maxPoints: row.max_points,
    };
  });

  return {
    score,
    previousScore,
    band,
    history: (historyRows ?? []).map((r) => ({ monthLabel: r.month_label, score: r.score })),
    factors: factors.length > 0 ? factors : SCORING_FACTORS,
  };
}

export async function upsertUserScore(userId: string, score: number, previousScore?: number): Promise<void> {
  if (!isSupabaseConfigured) return;

  const band = bandFromScore(score);
  const { error } = await supabase.from('kulex_scores').upsert({
    user_id: userId,
    score,
    previous_score: previousScore ?? score,
    band: band.id,
    tier: band.id,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
}
