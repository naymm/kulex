import type { Movement } from '@/constants/movimentos';

export function formatIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseIsoDate(value: string): Date {
  if (!value) return new Date();
  const parsed = new Date(`${value}T12:00:00`);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

export function formatFilterDateLabel(value: string): string {
  if (!value) return 'Seleccionar data';
  const [year, month, day] = value.split('-');
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

export type MovementDetails = {
  reference: string;
  status: string;
  channel: string;
  category: string;
  typeLabel: string;
  timeLabel: string;
};

export function getMovementById(id: string, items: Movement[]) {
  return items.find((item) => item.id === id);
}

export function getMovementDetails(movement: Movement): MovementDetails {
  const timeMatch = movement.dateLabel.match(/,\s*(.+)$/);
  const category = movement.title.includes(' - ')
    ? movement.title.split(' - ')[0]
    : movement.title;

  return {
    reference: `TW-${movement.id.padStart(9, '0')}`,
    status: 'Concluído',
    channel: 'App Kulex',
    category,
    typeLabel: movement.type === 'credit' ? 'Crédito' : 'Débito',
    timeLabel: timeMatch?.[1] ?? '12:00:00',
  };
}
