import type { Movement, MovementType } from '@/constants/movimentos';
import { formatBalanceFromCents } from '@/lib/api/accounts';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type MovementRow = Database['public']['Tables']['movements']['Row'];

const MONTHS_PT = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
] as const;

export function formatMovementAmount(cents: number, type: MovementType): string {
  const prefix = type === 'credit' ? '+ ' : '- ';
  return `${prefix}${formatBalanceFromCents(cents)}`;
}

export function formatMovementDateLabel(isoDate: string, createdAt: string): string {
  const created = new Date(createdAt);
  const today = new Date();
  const movementDate = new Date(`${isoDate}T12:00:00`);
  const time = created.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfMovement = new Date(
    movementDate.getFullYear(),
    movementDate.getMonth(),
    movementDate.getDate(),
  );
  const dayDiff = Math.round(
    (startOfToday.getTime() - startOfMovement.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (dayDiff === 0) return `Hoje, ${time}`;
  if (dayDiff === 1) return `Ontem, ${time}`;

  const day = movementDate.getDate();
  const month = MONTHS_PT[movementDate.getMonth()];
  const year = movementDate.getFullYear();
  const currentYear = today.getFullYear();

  if (year === currentYear) {
    return `${day} ${month}, ${time}`;
  }
  return `${day} ${month}, ${year}`;
}

export function mapMovementRow(row: MovementRow): Movement {
  return {
    id: row.id,
    title: row.title,
    isoDate: row.iso_date,
    dateLabel: formatMovementDateLabel(row.iso_date, row.created_at),
    amount: formatMovementAmount(row.amount_cents, row.type),
    type: row.type,
  };
}

export type MovementDetailRow = MovementRow;

export async function fetchAccountMovements(accountId: string): Promise<Movement[]> {
  if (!isSupabaseConfigured || !accountId) return [];

  const { data, error } = await supabase
    .from('movements')
    .select('*')
    .eq('account_id', accountId)
    .order('iso_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapMovementRow);
}

export async function fetchMovementById(
  accountId: string,
  movementId: string,
): Promise<MovementDetailRow | null> {
  if (!isSupabaseConfigured || !accountId || !movementId) return null;

  const { data, error } = await supabase
    .from('movements')
    .select('*')
    .eq('account_id', accountId)
    .eq('id', movementId)
    .maybeSingle();

  if (error) throw error;
  return data;
}
